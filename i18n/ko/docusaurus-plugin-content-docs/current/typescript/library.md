---
sidebar_position: 1
title: In-Depth guide for TypeScript Library Project
---

## Background

개발 프로젝트에서 공통 비즈니스 로직을 동일한 프로젝트 내 함수나 클래스로 분리해 재사용하는 것은 일반적인 접근 방법입니다. 프로젝트의 규모가 커지면 일부 로직은 별도의 패키지로 분리하여 다른 프로젝트에서 사용하는 것이 더 효율적일 수 있습니다. 제 경험 상, 로그인, 로그아웃, 로깅과 같은 기능은 별도의 라이브러리 패키지로 분리하면 장기적인 유지보수가 용이하고 적용도 간편합니다. 라이브러리 패키지 작성에 관한 여러 문서를 검토해봤지만, 여기서는 그 문서들에서 다루지 않는, 보다 특수한 주제들에 대해 정리하려고 합니다.

## What's the problem?

### Barrel file, edit over and over again

`import` 구문을 간소화 하기 위해 `export` 구문을 모아두는 파일을 [barrel 파일](https://basarat.gitbook.io/typescript/main-1/barrel)이라고 합니다.

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

Barrel 파일은 컴포넌트 라이브러리 프로젝트에서 흔히 볼 수 있는 파일입니다. 예를 들어, [Mantine](https://github.com/mantinedev/ui.mantine.dev) 프로젝트에서 [Barrel 파일](https://github.com/mantinedev/ui.mantine.dev/blob/master/lib/index.ts)을 확인할 수 있습니다. 라이브러리 프로젝트에서 각 컴포넌트나 기능 사이에 의존성이 없는 경우가 많기 때문에, 번들러가 dependency graph를 사용해도 모든 파일을 포함하지 않는 경우가 자주 발생합니다. 이 때 Barrel 파일이 효과적으로 활용됩니다. 또한, package.json 파일의 main과 module 필드에 Barrel 파일을 명시함으로써 Node.js 인터프리터나 브라우저의 스크립트 태그에서 실행할 지점을 지정하는 역할을 합니다. Barrel 파일은 중요한 기능을 수행하기 때문에 개발자가 직접 작성하는 경우가 많습니다.

그러나 Barrel 파일을 개발자가 직접 작성하는 것은 큰 도전입니다. [Mantine](https://github.com/mantinedev/ui.mantine.dev), [date-fns](https://github.com/date-fns/date-fns) 와 같이 이미 규모가 많이 커져버린 프로젝트에서는 어떤 변경 사항이 있을 때마다, 변경 사항을 고려하여 Barrel 파일을 작성하는 것이 쉽지 않고, VCS(eg. git)에 포함하는 경우 여러 개발자가 협업할 때 conflict이 발생할 확률이 높아집니다. 그래서 저는 일정한 규칙에 의해서 Barrel 파일을 자동 생성하고 VCS에 포함하지 않는 방법이 필요하다고 생각하게 되었습니다.

### Can I use path re-maps?

JavaScript에서 다른 스크립트에 있는 클래스, 함수, 상수 등을 불러오려면 현재 스크립트에서 불러오려는 스크립트가 있는 상대 경로를 입력해야 합니다.

```ts
import chunkArray from '../../tools/array/chunkArray';

async function getBulkInsertFruit(fruits: string[]) {
  await Promise.all(chunkArray(fruits, 5).map(async (chunk) => insert(chunk)));
}
```

위 예제코드를 보면 상대 경로로 함수를 불러온 것을 볼 수 있습니다. 상대 경로를 사용하는 것은 import statement가 항상 다르기 때문에 불편합니다. Barrel 파일을 사용해도 크게 개선이 되지 않습니다. IDE의 도움을 받지 않으면 해소하기 어려운 문제입니다. 그래서 TypeScript는 [Paths Re-Map](https://www.typescriptlang.org/tsconfig#paths) 기능을 제공합니다.

```ts
import chunkArray from '#/tools/array/chunkArray';

async function getBulkInsertFruit(fruits: string[]) {
  await Promise.all(chunkArray(fruits, 5).map(async (chunk) => insert(chunk)));
}
```

위 예제 코드를 보면 절대 경로를 사용하는 것처럼 `chunkArray` 함수를 불러온 것을 볼 수 있습니다. 이 기능을 사용하면 모든 파일에서 동일한 import statement를 사용할 수 있고 경로 또는 파일명을 변경하는 리펙토링을 할 때도 작업량이 줄어듭니다. 하지만 이 기능은 ECMA Script에서 제공하는 기능이 아니기 때문에 여러가지 문제를 만듭니다.jest, vitest와 같은 테스트 프레임워크에 Paths Re-Map 설정을 해줘야 하는 것은 물론, 번들러에게도 이 부분을 알려줘야 합니다. 뿐만 아니라 다음 장에서 설명할 `.d.ts` 파일 번들링에도 영향을 줍니다. 라이브러리 패키지, 어플리케이션 모두 이 문제는 동일하게 발생하기 때문에 이 문제를 해결할 방법도 필요합니다.

### bundling for `.d.ts`

TypeScript 기반의 라이브러리 패키지를 다른 TypeScript 프로젝트에서 사용하기 위해서는 JavaScript 파일과 함께 타입 파일(.d.ts)을 제공해야 합니다. 이를 위해 `package.json` 파일의 `types` 필드로 타입 파일의 시작 지점을 설정합니다. 하지만 타입 파일을 효과적으로 번들링하기 위한 공식적인 방법이 없는 상태입니다. 이와 관련된 [논의](https://github.com/Microsoft/TypeScript/issues/4433)가 있었으나, 이 문제에 대한 명확한 해결책 없이 이슈가 종료되었습니다.

TypeScript의 Paths Re-Map 기능을 사용하면 문제가 더 복잡해집니다. TypeScript는 Paths Re-Map된 모듈의 경로 치환을 [번들러의 역할로 정의](https://github.com/microsoft/TypeScript/issues/5039)해 놓았습니다. 이는 Paths Re-Map을 사용할 경우, 타입 파일을 제공하려면 해당 타입 파일의 Paths Re-Map을 상대 경로로 변환하고 번들링하는 두 가지 작업을 모두 수행해야 한다는 것을 의미합니다. 이로 인해 라이브러리 패키지 개발자들은 타입 파일을 효율적으로 관리하고 제공하는 데 어려움을 겪을 수 있습니다.

## How can we solve it?

번들러나 Paths Re-Map을 사용하지 않을 경우, 관련된 문제를 피할 수 있습니다. 그러나 여전히 Barrel 파일을 수동으로 작성하는 작업은 필요하며, 라이브러리 패키지의 규모가 커지면 기본 기능만을 사용하는 것은 비효율적일 수 있습니다. 그래서, 어떻게 문제를 해결할 수 있을지 하나씩 살펴보겠습니다.

### Barrel 파일 자동 생성하기

barrel 파일 자동화를 위해 오랜 시간 노력을 기울여왔으며, 이 과정에서 [ctix](https://github.com/imjuni/ctix)를 개발하여 사용하고 있습니다. 1.x 버전은 일부 불편한 점이 있었지만, 2.x 버전에서는 이러한 문제들을 개선하고 사용자 편의성을 높였습니다. ctix는 TypeScript Compiler API를 활용하여 `export` 키워드가 포함된 문장을 추출해 Barrel 파일을 자동 생성합니다. ctix의 장점은 Barrel 파일이 자동으로 생성되어 버전 관리 시스템(VCS), 예를 들어 git에서 별도로 Barrel 파일을 관리할 필요가 없다는 것입니다. 또한 TypeScript Compiler API를 사용하여 `export` 문장만 추출하기 때문에 항상 컴파일 가능한 Barrel 파일이 생성되는 이점도 있습니다.

### `.d.ts` bundling

이 부분은 정말 어려운 문제입니다. 일단 타입스크립트 개발팀에서 이 문제를 해결하기 위해 [논의](https://github.com/Microsoft/TypeScript/issues/4433)가 진행되고 있지만 아직 결론이 없는 상태이며, 오랫동안 이 상태가 유지되었습니다. 그래서 외부 도구를 사용해서 이 문제를 해결해야 합니다. 현재 널리 알려진 `.d.ts` 번들링 도구는 다음과 같습니다.

* [API Extractor](https://api-extractor.com/)
* [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator)
* [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts)
* [rollup-plugin-ts](https://github.com/wessberg/rollup-plugin-ts)
* [tsc-prog](https://github.com/jeremyben/tsc-prog)

위에서 나열한 것보다 더 많은 도구가 있습니다. 앞서 언급된 [논의](https://github.com/Microsoft/TypeScript/issues/4433)를 통해 다양한 도구들을 확인할 수 있습니다. 하지만 이들 중 적합한 도구를 선택하는 과정은 각자의 프로젝트 요구에 맞게 직접 실험해보고 결정해야 한다는 점이 아쉽습니다. 예를 들어, dts-bundle-generator, api-extractor, rollup-plugin-dts는 `.d.ts.map` 파일을 지원하지 않습니다. 또한, api-extractor와 dts-bundle-generator에는 chunking 기능이 없으며, rollup-plugin-dts는 현재 유지보수 모드입니다. 그리고 `default export`와 `export` 문장은 번들러마다의 결과물 생성 방식이 다릅니다. 따라서, 프로젝트의 구성에 따라 가장 적합한 도구를 신중하게 선택하여 사용해야 합니다.

저는 Barrel 파일 생성을 위해 [ctix](https://github.com/imjuni/ctix)를 사용하고, 번들링을 위해서는 [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator)를 활용합니다. 하지만 이 방법은 여러 패키지로 구성된 모노레포나 `tsconfig`에 `composite` 옵션이 설정된 경우에는 적합하지 않을 수 있습니다. 현재 진행 중인 라이브러리 패키지에 [ctix](https://github.com/imjuni/ctix)나 `.d.ts` 번들링 도구를 도입하기 전에 반드시 테스트를 진행하고 적합한지 확인한 후 적용하는 것이 중요합니다.

### export, default export

`default export`와 `export`의 사용에 대한 [토론](https://github.com/airbnb/javascript/issues/1365)이 있었으나, 어느 한쪽이 더 낫다고 명확하게 결론 내리기는 어려웠습니다. 예를 들어, [eslint-config-airbnb](https://github.com/airbnb/javascript#modules--prefer-default-export)는 `default export` 사용을 권장합니다. 하지만 [ctix](https://github.com/imjuni/ctix)를 개발하며 TypeScript Compiler API를 사용할 때, `default export`의 이름이 모두 'default'로 지정된다는 점을 발견했습니다. Barrel 파일에서 모든 import 문이 한 곳에 모이기 때문에, 이름이 중복될 경우 문제가 발생할 수 있습니다. `default export`는 이름이 같기 때문에 익명 export와 유사합니다. 원본 statement에 이름이 있는 경우 `alias` 키워드를 사용해 원래 이름을 부여할 수 있지만, `.d.ts` 번들러마다 alias를 다르게 처리하기 때문에 결과물이 의도와 다를 수 있습니다.

따라서, 다른 프로젝트에서 사용해야 하는 라이브러리 패키지에서 `default export`는 복잡한 문법적 문제를 일으킬 수 있습니다. 번들링 도구마다 다르게 작동하고, 어떻게 처리하는 것이 좋은지에 대한 개발자의 선호도 다양하기 때문입니다. 이러한 이유로, 저는 `default export`를 Vue, Svelte와 같이 TypeScript로 처리할 수 없는 컴포넌트에서만 사용하는 것이 좋다고 생각합니다. 다른 경우에는 `export`를 사용하는 것이 문제 발생 가능성을 최소화합니다.

## Conclusion

라이브러리 패키지 프로젝트는 개발할 때 유용합니다. [npm](http://npmjs.com/)에서는 사용가능한 정말 많은 라이브러리 패키지가 있습니다. 저 역시 필요에 따라 라이브러리를 만들어 사용하고 있으며, 이 과정에서 라이브러리 패키지 프로젝트 스케폴딩 방법에 대한 정리의 필요성을 느꼈습니다. 번들러 설정이나 전반적인 스케폴딩에 대해서는 이미 많은 좋은 자료가 있지만, Paths Re-Map이나 `.d.ts` 번들링과 같은 주제는 정보가 상대적으로 부족하여 이에 대해 정리해보았습니다. 아래 내용은 정답이라고 할 수는 없지만, 제가 라이브러리 프로젝트를 진행할 때 적용하는 방식입니다.

1. [ctix](https://github.com/imjuni/ctix)를 사용해서 barrel 파일을 자동 생성
1. [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator)를 사용하여 `.d.ts` 파일 번들링
1. [esbuild](https://esbuild.github.io/)를 사용하여 번들링
1. [vitest](https://vitest.dev/)를 또는 [jest](https://jestjs.io/) test runner로 사용
   1. [vite-tsconfig-paths](https://www.npmjs.com/package/vite-tsconfig-paths)를 사용해 Path Re-Map 전달
   1. [ts-jest](https://kulshekhar.github.io/ts-jest/)를 사용하고, [Paths Re-Map](https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/) 설정

내용을 참고할 수 있도록 [typescript-lib-boilerplate](https://github.com/imjuni/typescript-lib-boilerplate) repo.를 올려두었습니다. 여러분은 라이브러리 프로젝트를 개발할 때 어떤 방식으로 작업하시나요? 좋은 팁이 있다면 저에게도 알려주세요, 감사합니다!
