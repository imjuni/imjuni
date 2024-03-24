---
title: Introduction
sidebar_position: 3
---

## Background

Node.js를 사용한 Backend RESTful API 개발은 

Node.js와 TypeScript를 사용한 웹 프레임워크 중에서는 [unopinionated](https://stackoverflow.com/questions/802050/what-is-opinionated-software) 프레임워크가 많습니다. [express](https://expressjs.com/), [koa](https://koajs.com/) 및 [fastify](https://fastify.dev/) 등이 이에 해당합니다. 프로젝트를 진행할 때, 개발자 간의 협업이 일반적이며, 이때 통일된 코드 작성 규칙이 없으면 프로젝트의 성공 가능성이 줄어듭니다. 따라서 unopinionated 프레임워크를 사용할 때는 코드 작성 규칙을 명시하기 위해 [boilerplate code](https://en.wikipedia.org/wiki/Boilerplate_code)를 많이 작성하게 되는데, 이러한 반복적인 코드 작성은 Node.js와 TypeScript의 생산성이 떨어지게 합니다.

이러한 문제를 해결하기 위해, [nest](https://nestjs.com/) 프레임워크는 엄격한 코드 작성 규칙과 세밀하게 정의된 boilerplate code를 제공합니다. nest는 좋은 프레임워크이나, [DI](https://en.wikipedia.org/wiki/Dependency_injection)와 [IoC](https://en.wikipedia.org/wiki/Inversion_of_control) 개념을 도입하기 위해 express와 fastify의 구조를 감추고, 기존 코드를 Provider, Service, Module 등의 형태로 바꾸게 됩니다. 또한 [typeorm](https://typeorm.io/)이나 [prisma](https://www.prisma.io/)와 같은 ORM 패키지, [axios](https://axios-http.com/)나 [got](https://github.com/sindresorhus/got)과 같은 HTTP 클라이언트 패키지를 연동할 때도 동일한 구조를 적용해야 합니다.

일관된 코드 작성이 주는 장점에도 불구하고, 제 생각에는 Module, Service, Provider의 작성이나, DTO와 Request Validation을 위한 [JavaScript decorator](https://github.com/tc39/proposal-decorators) 사용도 일종의 boilerplate code로 느껴졌습니다. 그래서, Node.js가 기존으로 제공하는 ESM과 CommonJS 모듈 시스템을 그대로 활용하여, 설치한 패키지를 수정 없이 사용하는 방법, 그리고 TypeScript의 인터페이스를 활용한 DTO와 Request Validation 방법을 고려하게 되었습니다. 추가로, decorator가 동적으로 작동하여 TypeScript 타입과 불일치의 위험이 있기 때문에, Compile-Time에 문제를 탐지할 수 있는 방법을 모색하게 되었습니다.

이러한 접근은 다음과 같은 장점이 있습니다:

1. **모듈 시스템의 유연성**: ESM과 CommonJS 기반으로 패키지를 사용하면, 대부분의 패키지를 그대로 가져와서 사용할 수 있습니다. 이로 인해 호환성 문제나 추가적인 설정 없이도 다양한 패키지를 편리하게 활용할 수 있게 됩니다.
2. **TypeScript의 최대한 활용**: DTO를 TypeScript의 [indexed access types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) 기능을 활용하여 작성함으로써, type-safety과 함께 코드의 명료성도 확보됩니다.
3. **타입 기반의 문서 자동화**: [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator)를 사용하여 DTO로부터 [JSONSchema](https://json-schema.org/)를 자동 생성하면, 문서와 코드 간의 일관성을 유지하면서도 개발 생산성을 향상시킬 수 있습니다.
4. **검증 및 문서화의 통합**: [ajv](https://ajv.js.org/)와 [fastify-swagger](https://github.com/fastify/fastify-swagger)를 활용하여 Request Validation 및 OpenAPI spec. 문서화를 손쉽게 진행할 수 있게 됩니다. 이는 팀 내에서 API 문서의 일관성 유지와 함께, 클라이언트 개발자와의 커뮤니케이션도 간소화시킵니다.
5. **Type-Safety 컴파일 프로세스**: 모든 작업이 static compile 및 generation을 통해 이루어지므로, 개발 시점에서 타입 오류나 런타임 오류의 가능성을 크게 줄일 수 있습니다.
6. **boilerplate 코드 최소화**: 필요한 boilerplate code는 static compile 및 generation을 통해 자동 생성되므로, 개발자는 핵심 로직에만 집중하면서도 타입 안전성을 확보할 수 있습니다.
7. **API Client 자동화**: 앞서 언급한 문서 자동화로 인해 클라이언트를 자동으로 작성하는 [openapi-typescript](https://github.com/drwpow/openapi-typescript) 또는 [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api) 도구를 도입할 수 있습니다

결론적으로, 이러한 접근법은 개발자의 작업 부담을 줄이면서도 높은 품질의 코드를 유지할 수 있는 방안을 제시합니다.

## Example

지금까지 작업한 내용은 모두 [pet-store](https://github.com/maeumjs/maeum-pet-store) 예제로 업로드를 하고 있습니다. 이 Repository에서 작업한 내용을 확인하고 scaffolding 코드로 사용할 수 있습니다.
