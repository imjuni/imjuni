---
sidebar_position: 1
title: ctix - barrel file generator using TypeScript Compiler API
locale: ko
---

## Background

저는 다양한 오픈소스 프로젝트와 업무 관련 라이브러리를 작성하는 과정에서, 여러 차례 배럴 파일을 작성해왔습니다. [배럴 파일](https://basarat.gitbook.io/typescript/main-1/barrel)은 주로 import 문을 간소화하기 위해 사용되거나, 라이브러리의 다른 프로젝트로의 export를 용이하게 하기 위해 작성됩니다. 특히 최근에는 Next.js 프로젝트에서 배럴 파일을 활용하여 성능을 개선하는 등, 배럴 파일이 중요한 역할을 하고 있다고 볼 수 있습니다.

- [TypeScript Deep Dive - barrel](https://basarat.gitbook.io/typescript/main-1/barrel)
- [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)

### 개발자가 직접 barrel 파일을 작성할 때 문제점

처음에는 대부분 배럴 파일을 직접 작성할 것입니다. 하지만 꽤 반복적인 작업이기 때문에 자동화를 할 수 있는 도구를 한 번쯤 찾아보게 됩니다. 배럴 파일을 자동으로 작성하는 몇 가지 도구가 있습니다.

- CLI
  - [barrelsby](https://github.com/bencoveney/barrelsby)
  - [barrelbot](https://github.com/stolinski/barrelbot)
  - [create-index](https://github.com/gajus/create-index)
- IDE
  - [VSCODE - TypeScript Barrel Generator](https://marketplace.visualstudio.com/items?itemName=eliostruyf.vscode-typescript-exportallmodules)
  - [WebStorm - Barrels](https://plugins.jetbrains.com/plugin/14990-barrels)

이 도구들은 훌륭하지만, 대부분 디렉토리 탐색과 파일 이름을 기반으로 작동합니다. 이 방식은 많은 경우에 효과적이지만, 일부 상황에서는 한계를 드러내기도 합니다. 예를 들어, [eslint-config-airbnb](https://github.com/airbnb/javascript)는 클래스나 함수를 각각의 파일에 단일로 작성하는 것을 권장하고, 이에 따라 `default export` 사용을 선호합니다. `default export`의 경우, 파일 이름과 `export` 문의 이름이 일치하지 않을 수 있으므로 파일 이름과 변수 이름을 분리할 수 없는 문제가 생깁니다.

또한 이 도구들은 빈 파일이나 테스트 케이스를 인식하지 못하는 한계가 있습니다. 테스트 케이스는 정규식을 통해 걸러낼 수 있지만, 빈 파일을 식별하는 것은 어려운 일입니다. 더욱이, 배럴 파일은 여러 `export` 문이 한 파일에 모이는 특성을 가지고 있어, 이름이 중복되는 경우 컴파일 오류를 유발할 수 있습니다. 파일 이름 기반의 처리로는 이러한 중복 문제를 안정적으로 필터링하기 어렵습니다.

이러한 점들을 고려했을 때, 디렉토리 탐색과 파일 이름 기반의 접근법은 빠르고 간편하지만, 복잡한 프로젝트에서는 유용하지 않을 수 있다는 결론에 이르렀습니다. 이에 다른 접근 방식의 필요성을 느끼게 되었습니다.

### 타입스크립트 컴파일러 API를 사용한 자동화

초기에는 디렉토리 탐색과 파일 이름 기반의 접근법으로 문제를 해결하려 했습니다. 이를 위해 [create-ts-index](https://github.com/imjuni/create-ts-index)를 개발하고 사용했지만, 앞서 언급한 문제들을 경험하며 이 방법의 한계를 느꼈습니다. 이에 개선이 필요하다고 판단하고, [ctix](https://github.com/imjuni/ctix)를 개발하여 사용하게 되었습니다. ctix는 [타입스크립트 컴파일러 API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)를 활용하여 배럴 파일을 생성합니다. 이 방식을 통해 앞서 언급한 대부분의 문제를 해결할 수 있었습니다.

`default export` 구문도 파일 이름과 코드에서 이름이 달라도 처리할 수 있습니다.

```ts
// button.component.ts

const Button = () => {
  return <button>test</button>;
};

Button.getInitialProps = () => { /* ... */ };

export default Button;
```

파일 이름은 `button.component.ts` 이지만 export statement 에서 이름은 `Button` 입니다. [ctix](https://github.com/imjuni/ctix)는 타입스크립트 컴파일러 API를 사용하여 변수 이름을 얻기 때문에 위 내용도 오류 없이 배럴 파일에 추가할 수 있습니다.

한 파일에 여러 export statement가 있을 때 일부만 배럴파일에서 제외하는 것도 가능 합니다.

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

위 코드를 보면 성격이 다른 `peach` 를 배럴 파일에서 제외한 것을 볼 수 있습니다. 이 경우 아래와 같이 배럴 파일이 생성됩니다.

```ts
export { dog, cat } from './animal';
```

뿐만 아니라 [ctix](https://github.com/imjuni/ctix)는 2.1 버전부터 module 모드를 사용하여 파일 이름으로 모듈을 생성할 수 있습니다. Vue, Svelte와 같은 프론트엔드 컴포넌트 프로젝트는 별도의 문법을 가지고 있어 타입스크립트 컴파일러 API를 사용하여 구문 분석을 할 수 없습니다. 그래서 일반적으로 Vue, Svelte 컴포넌트는 파일 이름을 이름으로 사용하며 타입스크립트에서는 타입 파일로 모듈로 등록한 뒤 사용합니다.

```ts
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
```

위 코드는 `.vue` 확장자를 가진 파일들을 타입스크립트에서 모듈로 인식시키기 위해 작성된 타입 파일입니다. 이 설정을 통해 타입스크립트는 `.vue` 파일의 내용을 직접 구문 분석할 수는 없지만, 이를 모듈로 인식하게 됩니다. [ctix](https://github.com/imjuni/ctix)는 이러한 특징을 활용하여, 먼저 파일과 디렉토리를 기반으로 Vue 컴포넌트용 배럴 파일을 생성합니다.

```ts
/// <reference path="../types/vue.d.ts" />

import Button from './Button.vue';
import Accordion from './Accordion.vue';

export { Button, Accordion };
```

아쉽지만 첫 번째 줄에 있는 triple slash를 사용한 reference 설정은 개발자가 직접해야 합니다. [directive 옵션](https://github.com/imjuni/ctix/blob/master/doc/OPTION_BUILD_MODULE.md)을 사용해서 전달할 수 있습니다. 이렇게 생성된 배럴 파일은 자동으로 타입스크립트 컴파일러 API 추가되고, 다음 배럴 파일 생성작업에 영향을 주게 됩니다. 즉, 실제 타입스크립트 파일과 Vue 컴포넌트 둘 다 배럴 파일을 작성할 수 있게 됩니다. 관련 예제를 [example/type10](https://github.com/imjuni/ctix/blob/master/example/type10)에, [설정 파일](https://github.com/imjuni/ctix/blob/master/example/type10/.ctirc)에 업로드 하였습니다.

`export statement` 가 중복된 경우도 더 잘 탐색할 수 있습니다.

> marvel.ts

```ts
export const ironman = 'ironman is awesome!'
```

> avengers.ts

```ts
export const ironman = 'avengers assemble!'
```

파일 이름이 다르기 때문에 파일 이름 기반으로는 중복 탐지를 하기 어렵지만 타입스크립트 컴파일러 API를 사용하면 중복 탐지를 할 수 있습니다. [ctix](https://github.com/imjuni/ctix)는 이와 같은 상황에서 오류를 방지하기 위해 중복 구문을 제외하고, 경고 메시지를 출력하여 개발자가 오류를 탐지할 수 있게 도와줍니다.

타입스크립트 컴파일러 API를 활용함에 따라 TypeScript에서 사용하는 대부분의 [export 문법](https://github.com/imjuni/ctix/blob/master/src/compilers/getExportedKind.ts)을 올바르게 처리할 수 있고, 디렉토리와 파일 이름보다 실제 코드를 사용해서 배럴 파일을 생성할 수 있습니다.

## 결론

[ctix](https://github.com/imjuni/ctix)는 다양한 상황에서 적절하게 배럴 파일을 생성해 주는 도구입니다. 개발자가 직접 배럴 파일을 신경 쓰지 않아도 되도록 설계되었으며, 중복 탐지, 특정 구문 제외, Vue 및 Svelte 컴포넌트 지원 등 다양한 기능을 제공합니다. 그러나 타입스크립트 컴파일러 API를 사용하기 때문에 디렉토리 및 파일 이름 기반의 배럴 파일 생성 방식에 비해 속도가 느린 편입니다. 또한, 올바른 작동을 위해 tsconfig.json 파일을 필수적으로 제공해야 합니다. 이러한 단점을 해결하기 위해 `init` 명령어를 통한 대화식 기본 설정 파일 생성 기능을 추가했고, 타입스크립트 컴파일러 API의 프로젝트 분석 범위를 최소화하여 성능을 개선했습니다.

[ctix](https://github.com/imjuni/ctix)를 사용하면 배럴 파일 작성의 번거로움을 자동화할 수 있습니다. 사용해보신 후 [ctix](https://github.com/imjuni/ctix)가 더 개선될 수 있도록 피드백을 부탁드립니다!
