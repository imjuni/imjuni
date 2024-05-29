"use strict";(self.webpackChunkimjuni_home=self.webpackChunkimjuni_home||[]).push([[8374],{360:(e,i,s)=>{s.r(i),s.d(i,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>n,metadata:()=>a,toc:()=>d});var t=s(1527),r=s(6274);const n={title:"Introduction",sidebar_position:3},o=void 0,a={id:"backend/index",title:"Introduction",description:"Background",source:"@site/docs/backend/index.md",sourceDirName:"backend",slug:"/backend/",permalink:"/imjuni/backend/",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"Introduction",sidebar_position:3},sidebar:"aboutSidebar",previous:{title:"ByungJoon Lee Career",permalink:"/imjuni/resume/"},next:{title:"Design of Entity & DTO",permalink:"/imjuni/backend/node/entity_dto"}},c={},d=[{value:"Background",id:"background",level:2},{value:"Example",id:"example",level:2}];function h(e){const i={a:"a",h2:"h2",li:"li",ol:"ol",p:"p",strong:"strong",...(0,r.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.h2,{id:"background",children:"Background"}),"\n",(0,t.jsx)(i.p,{children:"Node.js\ub97c \uc0ac\uc6a9\ud55c Backend RESTful API \uac1c\ubc1c\uc740"}),"\n",(0,t.jsxs)(i.p,{children:["Node.js\uc640 TypeScript\ub97c \uc0ac\uc6a9\ud55c \uc6f9 \ud504\ub808\uc784\uc6cc\ud06c \uc911\uc5d0\uc11c\ub294 ",(0,t.jsx)(i.a,{href:"https://stackoverflow.com/questions/802050/what-is-opinionated-software",children:"unopinionated"})," \ud504\ub808\uc784\uc6cc\ud06c\uac00 \ub9ce\uc2b5\ub2c8\ub2e4. ",(0,t.jsx)(i.a,{href:"https://expressjs.com/",children:"express"}),", ",(0,t.jsx)(i.a,{href:"https://koajs.com/",children:"koa"})," \ubc0f ",(0,t.jsx)(i.a,{href:"https://fastify.dev/",children:"fastify"})," \ub4f1\uc774 \uc774\uc5d0 \ud574\ub2f9\ud569\ub2c8\ub2e4. \ud504\ub85c\uc81d\ud2b8\ub97c \uc9c4\ud589\ud560 \ub54c, \uac1c\ubc1c\uc790 \uac04\uc758 \ud611\uc5c5\uc774 \uc77c\ubc18\uc801\uc774\uba70, \uc774\ub54c \ud1b5\uc77c\ub41c \ucf54\ub4dc \uc791\uc131 \uaddc\uce59\uc774 \uc5c6\uc73c\uba74 \ud504\ub85c\uc81d\ud2b8\uc758 \uc131\uacf5 \uac00\ub2a5\uc131\uc774 \uc904\uc5b4\ub4ed\ub2c8\ub2e4. \ub530\ub77c\uc11c unopinionated \ud504\ub808\uc784\uc6cc\ud06c\ub97c \uc0ac\uc6a9\ud560 \ub54c\ub294 \ucf54\ub4dc \uc791\uc131 \uaddc\uce59\uc744 \uba85\uc2dc\ud558\uae30 \uc704\ud574 ",(0,t.jsx)(i.a,{href:"https://en.wikipedia.org/wiki/Boilerplate_code",children:"boilerplate code"}),"\ub97c \ub9ce\uc774 \uc791\uc131\ud558\uac8c \ub418\ub294\ub370, \uc774\ub7ec\ud55c \ubc18\ubcf5\uc801\uc778 \ucf54\ub4dc \uc791\uc131\uc740 Node.js\uc640 TypeScript\uc758 \uc0dd\uc0b0\uc131\uc774 \ub5a8\uc5b4\uc9c0\uac8c \ud569\ub2c8\ub2e4."]}),"\n",(0,t.jsxs)(i.p,{children:["\uc774\ub7ec\ud55c \ubb38\uc81c\ub97c \ud574\uacb0\ud558\uae30 \uc704\ud574, ",(0,t.jsx)(i.a,{href:"https://nestjs.com/",children:"nest"})," \ud504\ub808\uc784\uc6cc\ud06c\ub294 \uc5c4\uaca9\ud55c \ucf54\ub4dc \uc791\uc131 \uaddc\uce59\uacfc \uc138\ubc00\ud558\uac8c \uc815\uc758\ub41c boilerplate code\ub97c \uc81c\uacf5\ud569\ub2c8\ub2e4. nest\ub294 \uc88b\uc740 \ud504\ub808\uc784\uc6cc\ud06c\uc774\ub098, ",(0,t.jsx)(i.a,{href:"https://en.wikipedia.org/wiki/Dependency_injection",children:"DI"}),"\uc640 ",(0,t.jsx)(i.a,{href:"https://en.wikipedia.org/wiki/Inversion_of_control",children:"IoC"})," \uac1c\ub150\uc744 \ub3c4\uc785\ud558\uae30 \uc704\ud574 express\uc640 fastify\uc758 \uad6c\uc870\ub97c \uac10\ucd94\uace0, \uae30\uc874 \ucf54\ub4dc\ub97c Provider, Service, Module \ub4f1\uc758 \ud615\ud0dc\ub85c \ubc14\uafb8\uac8c \ub429\ub2c8\ub2e4. \ub610\ud55c ",(0,t.jsx)(i.a,{href:"https://typeorm.io/",children:"typeorm"}),"\uc774\ub098 ",(0,t.jsx)(i.a,{href:"https://www.prisma.io/",children:"prisma"}),"\uc640 \uac19\uc740 ORM \ud328\ud0a4\uc9c0, ",(0,t.jsx)(i.a,{href:"https://axios-http.com/",children:"axios"}),"\ub098 ",(0,t.jsx)(i.a,{href:"https://github.com/sindresorhus/got",children:"got"}),"\uacfc \uac19\uc740 HTTP \ud074\ub77c\uc774\uc5b8\ud2b8 \ud328\ud0a4\uc9c0\ub97c \uc5f0\ub3d9\ud560 \ub54c\ub3c4 \ub3d9\uc77c\ud55c \uad6c\uc870\ub97c \uc801\uc6a9\ud574\uc57c \ud569\ub2c8\ub2e4."]}),"\n",(0,t.jsxs)(i.p,{children:["\uc77c\uad00\ub41c \ucf54\ub4dc \uc791\uc131\uc774 \uc8fc\ub294 \uc7a5\uc810\uc5d0\ub3c4 \ubd88\uad6c\ud558\uace0, \uc81c \uc0dd\uac01\uc5d0\ub294 Module, Service, Provider\uc758 \uc791\uc131\uc774\ub098, DTO\uc640 Request Validation\uc744 \uc704\ud55c ",(0,t.jsx)(i.a,{href:"https://github.com/tc39/proposal-decorators",children:"JavaScript decorator"})," \uc0ac\uc6a9\ub3c4 \uc77c\uc885\uc758 boilerplate code\ub85c \ub290\uaef4\uc84c\uc2b5\ub2c8\ub2e4. \uadf8\ub798\uc11c, Node.js\uac00 \uae30\uc874\uc73c\ub85c \uc81c\uacf5\ud558\ub294 ESM\uacfc CommonJS \ubaa8\ub4c8 \uc2dc\uc2a4\ud15c\uc744 \uadf8\ub300\ub85c \ud65c\uc6a9\ud558\uc5ec, \uc124\uce58\ud55c \ud328\ud0a4\uc9c0\ub97c \uc218\uc815 \uc5c6\uc774 \uc0ac\uc6a9\ud558\ub294 \ubc29\ubc95, \uadf8\ub9ac\uace0 TypeScript\uc758 \uc778\ud130\ud398\uc774\uc2a4\ub97c \ud65c\uc6a9\ud55c DTO\uc640 Request Validation \ubc29\ubc95\uc744 \uace0\ub824\ud558\uac8c \ub418\uc5c8\uc2b5\ub2c8\ub2e4. \ucd94\uac00\ub85c, decorator\uac00 \ub3d9\uc801\uc73c\ub85c \uc791\ub3d9\ud558\uc5ec TypeScript \ud0c0\uc785\uacfc \ubd88\uc77c\uce58\uc758 \uc704\ud5d8\uc774 \uc788\uae30 \ub54c\ubb38\uc5d0, Compile-Time\uc5d0 \ubb38\uc81c\ub97c \ud0d0\uc9c0\ud560 \uc218 \uc788\ub294 \ubc29\ubc95\uc744 \ubaa8\uc0c9\ud558\uac8c \ub418\uc5c8\uc2b5\ub2c8\ub2e4."]}),"\n",(0,t.jsx)(i.p,{children:"\uc774\ub7ec\ud55c \uc811\uadfc\uc740 \ub2e4\uc74c\uacfc \uac19\uc740 \uc7a5\uc810\uc774 \uc788\uc2b5\ub2c8\ub2e4:"}),"\n",(0,t.jsxs)(i.ol,{children:["\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:"\ubaa8\ub4c8 \uc2dc\uc2a4\ud15c\uc758 \uc720\uc5f0\uc131"}),": ESM\uacfc CommonJS \uae30\ubc18\uc73c\ub85c \ud328\ud0a4\uc9c0\ub97c \uc0ac\uc6a9\ud558\uba74, \ub300\ubd80\ubd84\uc758 \ud328\ud0a4\uc9c0\ub97c \uadf8\ub300\ub85c \uac00\uc838\uc640\uc11c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc774\ub85c \uc778\ud574 \ud638\ud658\uc131 \ubb38\uc81c\ub098 \ucd94\uac00\uc801\uc778 \uc124\uc815 \uc5c6\uc774\ub3c4 \ub2e4\uc591\ud55c \ud328\ud0a4\uc9c0\ub97c \ud3b8\ub9ac\ud558\uac8c \ud65c\uc6a9\ud560 \uc218 \uc788\uac8c \ub429\ub2c8\ub2e4."]}),"\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:"TypeScript\uc758 \ucd5c\ub300\ud55c \ud65c\uc6a9"}),": DTO\ub97c TypeScript\uc758 ",(0,t.jsx)(i.a,{href:"https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html",children:"indexed access types"})," \uae30\ub2a5\uc744 \ud65c\uc6a9\ud558\uc5ec \uc791\uc131\ud568\uc73c\ub85c\uc368, type-safety\uacfc \ud568\uaed8 \ucf54\ub4dc\uc758 \uba85\ub8cc\uc131\ub3c4 \ud655\ubcf4\ub429\ub2c8\ub2e4."]}),"\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:"\ud0c0\uc785 \uae30\ubc18\uc758 \ubb38\uc11c \uc790\ub3d9\ud654"}),": ",(0,t.jsx)(i.a,{href:"https://github.com/vega/ts-json-schema-generator",children:"ts-json-schema-generator"}),"\ub97c \uc0ac\uc6a9\ud558\uc5ec DTO\ub85c\ubd80\ud130 ",(0,t.jsx)(i.a,{href:"https://json-schema.org/",children:"JSONSchema"}),"\ub97c \uc790\ub3d9 \uc0dd\uc131\ud558\uba74, \ubb38\uc11c\uc640 \ucf54\ub4dc \uac04\uc758 \uc77c\uad00\uc131\uc744 \uc720\uc9c0\ud558\uba74\uc11c\ub3c4 \uac1c\ubc1c \uc0dd\uc0b0\uc131\uc744 \ud5a5\uc0c1\uc2dc\ud0ac \uc218 \uc788\uc2b5\ub2c8\ub2e4."]}),"\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:"\uac80\uc99d \ubc0f \ubb38\uc11c\ud654\uc758 \ud1b5\ud569"}),": ",(0,t.jsx)(i.a,{href:"https://ajv.js.org/",children:"ajv"}),"\uc640 ",(0,t.jsx)(i.a,{href:"https://github.com/fastify/fastify-swagger",children:"fastify-swagger"}),"\ub97c \ud65c\uc6a9\ud558\uc5ec Request Validation \ubc0f OpenAPI spec. \ubb38\uc11c\ud654\ub97c \uc190\uc27d\uac8c \uc9c4\ud589\ud560 \uc218 \uc788\uac8c \ub429\ub2c8\ub2e4. \uc774\ub294 \ud300 \ub0b4\uc5d0\uc11c API \ubb38\uc11c\uc758 \uc77c\uad00\uc131 \uc720\uc9c0\uc640 \ud568\uaed8, \ud074\ub77c\uc774\uc5b8\ud2b8 \uac1c\ubc1c\uc790\uc640\uc758 \ucee4\ubba4\ub2c8\ucf00\uc774\uc158\ub3c4 \uac04\uc18c\ud654\uc2dc\ud0b5\ub2c8\ub2e4."]}),"\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:"Type-Safety \ucef4\ud30c\uc77c \ud504\ub85c\uc138\uc2a4"}),": \ubaa8\ub4e0 \uc791\uc5c5\uc774 static compile \ubc0f generation\uc744 \ud1b5\ud574 \uc774\ub8e8\uc5b4\uc9c0\ubbc0\ub85c, \uac1c\ubc1c \uc2dc\uc810\uc5d0\uc11c \ud0c0\uc785 \uc624\ub958\ub098 \ub7f0\ud0c0\uc784 \uc624\ub958\uc758 \uac00\ub2a5\uc131\uc744 \ud06c\uac8c \uc904\uc77c \uc218 \uc788\uc2b5\ub2c8\ub2e4."]}),"\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:"boilerplate \ucf54\ub4dc \ucd5c\uc18c\ud654"}),": \ud544\uc694\ud55c boilerplate code\ub294 static compile \ubc0f generation\uc744 \ud1b5\ud574 \uc790\ub3d9 \uc0dd\uc131\ub418\ubbc0\ub85c, \uac1c\ubc1c\uc790\ub294 \ud575\uc2ec \ub85c\uc9c1\uc5d0\ub9cc \uc9d1\uc911\ud558\uba74\uc11c\ub3c4 \ud0c0\uc785 \uc548\uc804\uc131\uc744 \ud655\ubcf4\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."]}),"\n",(0,t.jsxs)(i.li,{children:[(0,t.jsx)(i.strong,{children:"API Client \uc790\ub3d9\ud654"}),": \uc55e\uc11c \uc5b8\uae09\ud55c \ubb38\uc11c \uc790\ub3d9\ud654\ub85c \uc778\ud574 \ud074\ub77c\uc774\uc5b8\ud2b8\ub97c \uc790\ub3d9\uc73c\ub85c \uc791\uc131\ud558\ub294 ",(0,t.jsx)(i.a,{href:"https://github.com/drwpow/openapi-typescript",children:"openapi-typescript"})," \ub610\ub294 ",(0,t.jsx)(i.a,{href:"https://github.com/acacode/swagger-typescript-api",children:"swagger-typescript-api"})," \ub3c4\uad6c\ub97c \ub3c4\uc785\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4"]}),"\n"]}),"\n",(0,t.jsx)(i.p,{children:"\uacb0\ub860\uc801\uc73c\ub85c, \uc774\ub7ec\ud55c \uc811\uadfc\ubc95\uc740 \uac1c\ubc1c\uc790\uc758 \uc791\uc5c5 \ubd80\ub2f4\uc744 \uc904\uc774\uba74\uc11c\ub3c4 \ub192\uc740 \ud488\uc9c8\uc758 \ucf54\ub4dc\ub97c \uc720\uc9c0\ud560 \uc218 \uc788\ub294 \ubc29\uc548\uc744 \uc81c\uc2dc\ud569\ub2c8\ub2e4."}),"\n",(0,t.jsx)(i.h2,{id:"example",children:"Example"}),"\n",(0,t.jsxs)(i.p,{children:["\uc9c0\uae08\uae4c\uc9c0 \uc791\uc5c5\ud55c \ub0b4\uc6a9\uc740 \ubaa8\ub450 ",(0,t.jsx)(i.a,{href:"https://github.com/maeumjs/maeum-pet-store",children:"pet-store"})," \uc608\uc81c\ub85c \uc5c5\ub85c\ub4dc\ub97c \ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4. \uc774 Repository\uc5d0\uc11c \uc791\uc5c5\ud55c \ub0b4\uc6a9\uc744 \ud655\uc778\ud558\uace0 scaffolding \ucf54\ub4dc\ub85c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."]})]})}function p(e={}){const{wrapper:i}={...(0,r.a)(),...e.components};return i?(0,t.jsx)(i,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}}}]);