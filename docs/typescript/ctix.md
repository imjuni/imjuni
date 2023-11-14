---
sidebar_position: 1
title: ctix - barrel file generator using TypeScript Compiler API
---

## Background

In the past, I've written barrel files for various open source projects and work-related libraries. [Barrel files](https://basarat.gitbook.io/typescript/main-1/barrel) are often used to simplify import statements, or to allow libraries to be exported to other projects. I've seen them in action recently, especially in the Next.js project, where they've been utilized to improve performance.

- [TypeScript Deep Dive - barrel](https://basarat.gitbook.io/typescript/main-1/barrel)
- [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)

### Problems when developers write their own barrel files

At first, you'll probably write most of your barrel files by hand, but since it's a fairly repetitive task, you'll probably want to find a tool to automate it. There are a couple of tools to automatically write barrel files.

- CLI
  - [barrelsby](https://github.com/bencoveney/barrelsby)
  - [barrelbot](https://github.com/stolinski/barrelbot)
  - [create-index](https://github.com/gajus/create-index)
- IDE
  - [VSCODE - TypeScript Barrel Generator](https://marketplace.visualstudio.com/items?itemName=eliostruyf.vscode-typescript-exportallmodules)
  - [WebStorm - Barrels](https://plugins.jetbrains.com/plugin/14990-barrels)

These tools are awesome, but they mostly work based on directory traversal and filenames. While this works well in many cases, it has limitations in some situations. For example, [eslint-config-airbnb](https://github.com/airbnb/javascript) recommends writing a class or function in a single file, and thus prefers to use `default export`. In the case of `default export`, the filename and the name of the `default export` statement may not match, but directory traversal and filename-based approaches cannot separate filenames from variable names.

These tools also have the limitation of not being recognized for empty files or test cases. Test cases can be filtered out through the glob pattern, but recognizing empty files is a challenge. Furthermore, barrel files are a collection of multiple `export` statements in one file, which can cause compilation errors if there are duplicate names. It is difficult to reliably filter out these duplicates with filename-based processing.

Considering these points, I came to the conclusion that while directory traversal and filename-based approaches are quick and easy, they may not be useful in complex projects. I recognized the need for a different approach.

### Automate barrel file writing with the TypeScript Compiler API

At first, I tried to solve the problem with a directory traversal and filename-based approach. I developed and used [create-ts-index](https://github.com/imjuni/create-ts-index) for this purpose, but after experiencing the previously mentioned issues, I recognized the limitations of this approach. I decided that it needed to be improved, so I developed and used [ctix](https://github.com/imjuni/ctix). ctix utilizes the [Typescript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) to write barrel files. This approach solved most of the problems I mentioned earlier.

The `default export` statement can handle different filenames and variable names

```ts
// button.component.ts

const Button = () => {
  return <button>test</button>;
};

Button.getInitialProps = () => { /* ... */ };

export default Button;
```

The file is named `button.component.ts`, but in the export statement it is named `Button`. Since [ctix](https://github.com/imjuni/ctix) uses the Typescript compiler API to get variable names, the above can be added to the barrel file without error.

When there are multiple `export statements` in a file, it is possible to exclude only some of them from the barrel file.

```ts
export function dog() {
  // ...
}

// @ctix-exclude-next
export function peach() {
  // ...
}

export function cat() {
  // ...
}
```

If you look at the code above, you'll see that I've excluded `peach`, which has a different personality, from the barrel file. In this case, the barrel file is written as shown below.

```ts
export { dog, cat } from './animal';
```

In addition, [ctix](https://github.com/imjuni/ctix) can write barrel files with filenames using module mode since version 2.1. Front-end component projects such as [Vue](https://vuejs.org/) and [Svelte](https://svelte.dev/) have a different syntax and cannot be parsed using the TypeScript compiler API, so typically Vue and Svelte components use filenames as names and are registered as modules in TypeScript as type files.

```ts
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
```

The above code is a type file written to make files with the `.vue` extension recognized as modules by Typescript. With this setup, Typescript cannot directly parse the contents of a `.vue` file, but it will recognize it as a module. [ctix](https://github.com/imjuni/ctix) takes advantage of this, first writing barrel files for Vue components based on filenames and directory traversal.

```ts
/// <reference path="../types/vue.d.ts" />

import Button from './Button.vue';
import Accordion from './Accordion.vue';

export { Button, Accordion };
```

Unfortunately, the reference setting with the triple slash in the first line must be handled by the developer. It can be passed using the [directive option](https://github.com/imjuni/ctix/blob/master/doc/OPTION_BUILD_MODULE.md). This will automatically add the TypeScript compiler API to the barrel file and affect the next barrel file writing operation, meaning that both actual TypeScript files and Vue components will be able to write barrel files. I've uploaded a working example to [example/type10](https://github.com/imjuni/ctix/blob/master/example/type10) and a [configuration file](https://github.com/imjuni/ctix/blob/master/example/type10/.ctirc).

Duplicate `export statement`s can also be better detected.

> marvel.ts

```ts
export const ironman = 'ironman is awesome!'
```

> avengers.ts

```ts
export const ironman = 'avengers assemble!'
```

Because of the different file names, duplicate detection is difficult to do with filename and directory traversal, but it can be achieved using the Typescript compiler API. To prevent errors in situations like this, [ctix](https://github.com/imjuni/ctix) excludes duplicate statements and outputs warning messages to help developers recognize errors.

By using the TypeScript compiler API, it can correctly handle most of the [export syntax](https://github.com/imjuni/ctix/blob/master/src/compilers/getExportedKind.ts) used by TypeScript, and it can write barrel files using actual code, as compared to the filename and directory traversal approach.

## Conclusion

[ctix](https://github.com/imjuni/ctix) is a tool that writes barrel files correctly in a variety of situations. It's designed to free developers from having to care about barrel files themselves, and offers a number of features including duplicate detection, exclusion of particular statements, and support for Vue and Svelte components. However, because it uses the TypeScript compiler API, it is slower than barrel file writing based on filenames and directory traversal. It also requires a tsconfig.json file to be provided for it to work correctly. To solve these problems, I've added the ability to generate a configuration file via an interactive prompt with the `init` command, and improved performance by minimizing the scope of the TypeScript compiler API's project analysis.

With [ctix](https://github.com/imjuni/ctix), you can automate the hassle of writing barrel files. Give it a try and let us know what you think so for us to make [ctix](https://github.com/imjuni/ctix) even better!
