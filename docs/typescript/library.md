---
sidebar_position: 2
title: In-Depth guide for TypeScript Library Project
---

## Background

It's a common approach in development projects to separate common business logic into functions or classes within the same project for reuse. As a project grows in size, some logic may be more efficiently isolated into separate packages and used in other projects. In my experience, functions like login, logout, and logging are easier to maintain and adapt in the long run if they are separated into separate library packages. I've reviewed several articles on writing library packages, but here I'm going to summarize some of the more specialized topics that aren't covered in those articles.

## What's the problem?

### Barrel file, edit over and over again

To simplify the `import` syntax, the file that holds the `export` syntax is called a [barrel file](https://basarat.gitbook.io/typescript/main-1/barrel).

> barrel file

```ts
export { Button } from './button/index.ts'
export { Accordion } from './accordion/index.ts'
export { Notification } from './notification/index.ts'
```

> other file

```ts
import { Button } from '../../src'
```

Barrel files are commonly found in component library projects. For example, you can find a [Barrel file](https://github.com/mantinedev/ui.mantine.dev/blob/master/lib/index.ts) in the [Mantine](https://github.com/mantinedev/ui.mantine.dev) project. Since there are often no dependencies between each component or feature in a library project, it often happens that the bundler does not include all the files even when using a dependency graph. This is where the barrel file comes into handy. By specifying the barrel file in the main and module fields of the `package.json` file, it also serves as a point of execution for the Node.js interpreter or the browser's script tag. Barrel files are often written by developers themselves because they fulfill an important function.

However, it is a big challenge for developers to write barrel files themselves. In projects like [Mantine](https://github.com/mantinedev/ui.mantine.dev) and [date-fns](https://github.com/date-fns/date-fns), which are already very large, it is not easy to write a barrel file every time there is a change, and if it is included in a VCS(e.g. `git`), it increases the probability of conflicts when multiple developers collaborate. Therefore, I thought there is a need for a way to automatically generate barrel files based on certain rules and not include them in a VCS.

### Can I use paths re-maps?

To import classes, functions, constants, etc. from another script in TypeScript and JavaScript, you need to enter the relative path to the script you want to call from the current script.

```ts
import chunkArray from '../../tools/array/chunkArray';

async function getBulkInsertFruit(fruits: string[]) {
  await Promise.all(chunkArray(fruits, 5).map(async (chunk) => insert(chunk)));
}
```

In the example code above, you can see that we imported the function with a relative path. Using relative paths is inconvenient because the import statement is always different. Using a barrel file doesn't improve things much, and it's a difficult problem to solve without the help of an IDE. That's why TypeScript provides the [Paths Re-Map](https://www.typescriptlang.org/tsconfig#paths) feature.

```ts
import chunkArray from '#/tools/array/chunkArray';

async function getBulkInsertFruit(fruits: string[]) {
  await Promise.all(chunkArray(fruits, 5).map(async (chunk) => insert(chunk)));
}
```

If you look at the example code above, you can see that we've imported the `chunkArray` function as if we were using an absolute path. This feature allows you to use the same import statement for all your files and reduces the amount of work when refactoring to change paths or filenames. However, since this feature is not provided by ECMA Script, it creates a number of problems: not only do you have to tell your test frameworks like jest and vitest to set up Paths Re-Map, but you also have to tell your bundlers about it. It also affects the bundling of `.d.ts` files, which we will discuss in the next chapter. Since this issue is the same for library packages and applications alike, we also need a way to work around it.

### bundling for `.d.ts`

In order for a TypeScript-based library package to be used by other TypeScript projects, it is necessary to provide the type files (.d.ts) along with the JavaScript files. To do this, the `types` field in the `package.json` file sets the entry point for the type files. However, there is no official way to effectively bundle type files. There was a [discussion](https://github.com/Microsoft/TypeScript/issues/4433) about this, but the issue was closed without a clear solution to the problem.

Using TypeScript's Paths Re-Map feature further complicates matters. TypeScript has [defined module renaming for Paths Re-Mapped modules as the role of the bundler](https://github.com/microsoft/TypeScript/issues/5039), which means that when using Paths Re-Map, providing a type file requires you to do two things: convert the Paths Re-Map of that type file to a relative path and bundle it. This can make it difficult for library package developers to efficiently manage and ship type files.

## How can we solve it?

If you don't use bundlers and Paths Re-Map, you can avoid the issues involved. However, you'll still need to manually write your barrel files, and as your library package grows in size, it can be inefficient to use only the basic functionality. So, let's take a look at how you can solve the problem.

### Automatically generate a barrel file

I've been working on automating barrel files for a long time, and in the process have developed [ctix](https://github.com/imjuni/ctix). The 1.x version had some inconveniences, but with the 2.x version, I've improved these issues and made it more user-friendly. ctix uses the TypeScript Compiler API to automatically generate barrel files by extracting statements containing the `export` keyword. The advantage of ctix is that barrel files are automatically generated, so you don't have to manage them separately in your version control system (VCS), e.g. git. It also has the advantage of always generating compilable barrel files because it uses the TypeScript Compiler API to extract only `export` statements.

### `.d.ts` bundling

This is a really hard problem. For now, there are [discussions](https://github.com/Microsoft/TypeScript/issues/4433) going on within the TypeScript community to resolve this issue, but they are inconclusive, and have been for a long time. So we need to use external tools to solve this problem. Currently, the popular `.d.ts` bundling tools are as follows

* [API Extractor](https://api-extractor.com/)
* [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator)
* [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts)
* [rollup-plugin-ts](https://github.com/wessberg/rollup-plugin-ts)
* [tsc-prog](https://github.com/jeremyben/tsc-prog)

There are many more tools than those listed above. You can check out [discussion](https://github.com/Microsoft/TypeScript/issues/4433) and [comparison](https://github.com/timocov/dts-bundle-generator/discussions/68) of bundling tools. Unfortunately, choosing the right tool among them is a process that you'll have to experiment with and decide for your own project needs. For example, [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator), [API Extractor](https://api-extractor.com/), and [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts) do not support `.d.ts.map` files. Also, [API Extractor](https://api-extractor.com/) and [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator) do not have chunking capabilities, [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts) is currently in maintenance mode, and the `default export` and `export` statements differ in the way different bundlers generate output. Therefore, you should carefully select and use the most appropriate tool based on your project's configuration.

The [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator) is a lightweight and easy tool. If you pass a barrel file generated using [ctix](https://github.com/imjuni/ctix) to [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator) and just specify the path to the output file, it will work fine in most cases without any additional setup. However, if you are using the latest version of [Fastify.js](https://fastify.dev/) in your backend development, you may encounter an issue where bundling fails because `Symbol.asyncDispose` is not found. This is due to the way the [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator) loads only necessary modules for performance optimization, which prevents it from loading some `.d.ts` files. There is a [workaround](https://github.com/timocov/dts-bundle-generator/discussions/232) being discussed for this, but it didn't work in my case. Nevertheless, the tool generally works well and is easy to use with a few simple option settings, and I recommend testing in a live environment if you are considering adopting it.

The [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts) is a plugin that is currently in maintenance mode, but still works well. However, this plugin only performs bundling correctly for `.d.ts` files that do not use Paths Re-Map. By the way, even if you create a `.d.ts` file using [@rollup/plugin-typescript](https://github.com/rollup/plugins/tree/master/packages/typescript), this does not fully resolve Paths Re-Map. For this, you need to use [tsc-alias](https://github.com/justkey007/tsc-alias) to resolve Paths Re-Map issues. After resolving Paths Re-Map, bundling with [rollup-plugin-ts](https://github.com/wessberg/rollup-plugin-ts) works well to generate a `.d.ts` file. However, even with this method, the ability to generate `.map` files and the `chunking` feature is not available. Given that library projects are often bundled as part of JavaScript projects, I think these limitations are acceptable.

I use [ctix](https://github.com/imjuni/ctix) for barrel file generation and [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts) and [tsc-alias](https://github.com/justkey007/tsc-alias) for bundling. However, this method may not be suitable for monorepos consisting of multiple packages or if the `composite` option is set in `tsconfig`. Before introducing [ctix](https://github.com/imjuni/ctix) or `.d.ts` bundling tools to your ongoing library packages, it is important to test them and make sure they are suitable before applying them.

### default export, export

There has been some [discussion](https://github.com/airbnb/javascript/issues/1365) about the use of `default export` vs `export`, but it's hard to conclude unequivocally that one is better. For example, [eslint-config-airbnb](https://github.com/airbnb/javascript#modules--prefer-default-export) recommends using `default export`. However, when developing [ctix](https://github.com/imjuni/ctix) and using the TypeScript Compiler API, I noticed that all of the `default export`s were named `default`. Since all of the import statements in a barrel file are collected in one place, duplicate names can cause problems. The `default export` is similar to an anonymous export because it has the same name. If the original statement has a name, you can use the `alias` keyword to give it the original name, but since different `.d.ts` bundlers handle aliases differently, the result may not be what you intended.

Thus, `default export` can cause complicated syntax issues in library packages that need to be used by other projects. Because different bundling tools work differently, and because developers have different preferences on how to handle them, I believe that `default export` should only be used in components that cannot be handled by TypeScript, such as Vue and Svelte. In other cases, using `export` minimizes the chance of problems.

## Conclusion

Library package projects are useful when developing. With [npm](http://npmjs.com/), there are tons of library packages available. I've been creating and using libraries out of necessity, and in doing so, I've felt the need to organize how I go about scaffolding my library package projects. There's a lot of good material out there about setting up bundlers and overall scaffolding, but topics like Paths Re-Map and `.d.ts` bundling are relatively uninformed, so I've put together some thoughts on that. The following is by no means a definitive answer, but it's the way I apply it when working on library projects.

1. Automatically generate an barrel file using [ctix](https://github.com/imjuni/ctix)
1. Bundling `.d.ts` files using [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts) and [tsc-alias](https://github.com/justkey007/tsc-alias)
1. Bundling with [esbuild](https://esbuild.github.io/)
1. use [vitest](https://vitest.dev/) or [jest](https://jestjs.io/) as a test runner
   1. use [vite-tsconfig-paths](https://www.npmjs.com/package/vite-tsconfig-paths) to pass [Paths Re-Map](https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/)
   1. use [ts-jest](https://kulshekhar.github.io/ts-jest/) and set up [Paths Re-Map](https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/)

I've uploaded the [typescript-lib-boilerplate](https://github.com/imjuni/typescript-lib-boilerplate) repo.for your reference. How do you guys work when developing library projects? If you have any good tips, please let me know, thanks!
