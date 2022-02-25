"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[436],{1307:function(e,t,n){var a=this&&this.__assign||function(){return a=Object.assign||function(e){for(var t,n=1,a=arguments.length;n<a;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},a.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.Accordion=void 0;var r=n(5893);t.Accordion=function(e){return(0,r.jsx)("div",a({className:"accordion mt-4",id:"".concat(e.id,"Accordion")},{children:e.items.map((function(e){return(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("div",a({className:"accordion-item"},{children:[(0,r.jsx)("h2",a({className:"accordion-header",id:e.id},{children:(0,r.jsx)("button",a({className:"accordion-button collapsed",type:"button","data-bs-toggle":"collapse","data-bs-target":"#".concat(e.id,"Collapse"),"aria-expanded":"false","aria-controls":"".concat(e.id,"Collapse")},{children:e.title}),void 0)}),void 0),(0,r.jsx)("div",a({id:e.id+"Collapse",className:"accordion-collapse collapse","aria-labelledby":e.id,"data-bs-parent":"#".concat(e.id,"Accordion")},{children:(0,r.jsx)("div",a({className:"accordion-body"},{children:e.render()}),void 0)}),void 0)]}),void 0)},void 0)}))}),void 0)}},5486:function(e,t,n){var a=this&&this.__assign||function(){return a=Object.assign||function(e){for(var t,n=1,a=arguments.length;n<a;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},a.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.Card=void 0;var r=n(5893);function c(e){return(0,r.jsx)("div",a({className:"utrecht-card card"},{children:!1!==e.divider?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",a({className:"utrecht-card-header card-header"},{children:(0,r.jsxs)("div",a({className:"utrecht-card-head-row card-head-row row"},{children:[null!==e.title&&null!==e.cardHeader&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",a({className:"col-6"},{children:(0,r.jsx)("h4",a({className:"utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title text-start"},{children:e.title}),void 0)}),void 0),(0,r.jsx)("div",a({className:"col-6 text-right"},{children:null!==e.cardHeader&&e.cardHeader()}),void 0)]},void 0),null!==e.title&&null===e.cardHeader&&(0,r.jsx)("div",a({className:"col-12"},{children:(0,r.jsx)("h4",a({className:"utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title text-start"},{children:e.title}),void 0)}),void 0)]}),void 0)}),void 0),(0,r.jsx)("div",a({className:"utrecht-card-body card-body"},{children:null!==e.cardBody&&e.cardBody()}),void 0)]},void 0):(0,r.jsxs)("div",a({className:"utrecht-card-body card-body"},{children:[(0,r.jsx)("h4",a({className:"utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title text-start"},{children:e.title}),void 0),null!==e.cardBody&&e.cardBody()]}),void 0)}),void 0)}n(5586),t.Card=c,c.defaultProps={cardHeader:null,cardBody:null}},9002:function(e,t,n){var a=this&&this.__assign||function(){return a=Object.assign||function(e){for(var t,n=1,a=arguments.length;n<a;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},a.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.GenericInputComponent=void 0;var r=n(5893),c=n(6486);t.GenericInputComponent=function(e){var t;return(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("div",a({className:"input-group"},{children:[(0,r.jsxs)("label",a({htmlFor:e.id,className:"utrecht-form-label"},{children:[c.upperFirst(null!==(t=e.nameOverride)&&void 0!==t?t:e.name),e.required&&" *"]}),void 0),(0,r.jsx)("input",{className:"utrecht-textbox utrecht-textbox--html-input",name:e.name,id:e.id,defaultValue:null===e.data?void 0:e.data,type:e.type,required:e.required,minLength:null===e.minLength?void 0:e.minLength,maxLength:null===e.maxLength?void 0:e.maxLength,disabled:e.disabled},void 0)]}),void 0)},void 0)},t.GenericInputComponent.defaultProps={data:null,disabled:!1,required:!1,minLength:null,maxLength:null}},5888:function(e,t,n){var a=this&&this.__assign||function(){return a=Object.assign||function(e){for(var t,n=1,a=arguments.length;n<a;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},a.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.SelectInputComponent=void 0;var r=n(5893),c=n(6486);n(4156);t.SelectInputComponent=function(e){var t;return(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("div",a({className:"input-group"},{children:[(0,r.jsx)("label",a({className:"utrecht-form-label",htmlFor:e.id},{children:c.upperFirst(null!==(t=e.nameOverride)&&void 0!==t?t:e.name)}),void 0),(0,r.jsxs)("select",a({name:e.name,id:e.id,required:e.required,className:"utrecht-select utrecht-select--html-select"},{children:[!e.required&&(0,r.jsx)("option",{children:" "},void 0),e.options.map((function(t){return(0,r.jsx)("option",a({selected:null!==e.data&&e.data===t.value,value:t.value},{children:c.upperFirst(t.name)}),t.value)}))]}),void 0)]}),void 0)},void 0)},t.SelectInputComponent.defaultProps={required:!1}},3084:function(e,t,n){n.d(t,{Z:function(){return u}});var a=n(7294),r=n(5444);function c(){return a.createElement("footer",{className:"utrecht-page-footer"},a.createElement("div",{className:"container"},a.createElement("a",{href:"https://conduction.nl",target:"_blank",className:"utrecht-link utrecht-link--hover mr-5"},"Conduction"),a.createElement(r.rU,{to:"/",target:"_blank",className:"utrecht-link utrecht-link--hover mr-5"},"Docs"),a.createElement(r.rU,{to:"/",target:"_blank",className:"utrecht-link utrecht-link--hover mr-5"},"Licence"),a.createElement(r.rU,{to:"/",target:"_blank",className:"utrecht-link utrecht-link--hover mr-5"},"Code")))}var l=n(9963),i=n(8902);function o(){return a.createElement("div",{className:"utrecht-navhtml"},a.createElement("nav",{className:"topnav utrecht-topnav__list"},a.createElement("div",{className:"container"},a.createElement("div",{className:"d-inline"},a.createElement("ul",{className:"utrecht-topnav__list"},a.createElement("li",null,a.createElement("div",{className:"d-flex align-items-center h-100 justify-content-center"},a.createElement("a",{href:"https://conduction.nl",target:"_blank"},a.createElement("img",{className:"logo",alt:"",src:"data:image/svg+xml;base64,PHN2ZyBpZD0iTGFhZ18xIiBkYXRhLW5hbWU9IkxhYWcgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHBhdGggZD0iTTE0OS43MiwyOCwzOCw5Mi41djEyOUwxNDkuNzIsMjg2bDExMS43Mi02NC41VjkyLjVaTTIzMywyMDUuMDZsLTgzLjI1LDQ4LjA3TDY2LjQ3LDIwNS4wNlYxMDguOTRsODMuMjUtNDguMDdMMjMzLDEwOC45NFoiIHN0eWxlPSJmaWxsOiNmZmYiLz48cG9seWdvbiBwb2ludHM9IjE0OS40NCAxMjQuNTIgMTc1LjYxIDEzOS42MiAyMDYuMDUgMTIyLjA0IDE0OS40NCA4OS4zNiA5MC44NyAxMjMuMTggOTAuODcgMTkwLjgyIDE0OS40NCAyMjQuNjQgMjA2LjA1IDE5MS45NiAxNzUuNjEgMTc0LjM4IDE0OS40NCAxODkuNDggMTIxLjMyIDE3My4yNCAxMjEuMzIgMTQwLjc2IDE0OS40NCAxMjQuNTIiIHN0eWxlPSJmaWxsOiNmZmYiLz48L3N2Zz4="})))),a.createElement("li",{className:"utrecht-topnav__item"},a.createElement(r.rU,{to:"/",className:"utrecht-topnav__link"},"Dashboard")),(0,l.jl)()?a.createElement(a.Fragment,null,a.createElement("li",{className:"utrecht-topnav__item"},a.createElement(r.rU,{to:"/sources",className:"utrecht-topnav__link"},"Sources")),a.createElement("li",{className:"utrecht-topnav__item"},a.createElement(r.rU,{to:"/entities",className:"utrecht-topnav__link"},"Entities")),a.createElement("li",{className:"utrecht-topnav__item"},a.createElement(r.rU,{to:"/endpoints",className:"utrecht-topnav__link"},"Endpoints")),a.createElement("li",{className:"utrecht-topnav__item"},a.createElement(r.rU,{to:"/applications",className:"utrecht-topnav__link"},"Applications")),a.createElement("li",{className:"utrecht-topnav__item"},a.createElement(r.rU,{to:"/soap",className:"utrecht-topnav__link"},"SOAP")),a.createElement("li",{className:"utrecht-topnav__item"},a.createElement("a",{className:"utrecht-topnav__link"},a.createElement("span",{onClick:function(){(0,l.kS)(),(0,i.c4)("/")}},a.createElement("i",{className:"fas fa-sign-out-alt mr-2"}),"Uitloggen")))):a.createElement("li",{className:"utrecht-topnav__item"},a.createElement(r.rU,{to:"/",className:"utrecht-topnav__link"},a.createElement("span",null,"Login"))))))))}var s=n(5414);function d(e){var t=e.title,n=e.subText;return a.createElement(a.Fragment,null,a.createElement("header",{className:"utrecht-page-header"},a.createElement("div",{className:"container"},a.createElement("h1",{className:"utrecht-heading-1 utrecht-heading-1--distanced"},t),a.createElement("h5",{className:"utrecht-heading-5 utrecht-heading-5--distanced"},n))))}function u(e){var t=e.children,n=e.title,r=void 0===n?"":n,l=e.subtext,i=void 0===l?"":l;return a.createElement(a.Fragment,null,a.createElement(s.q,null,a.createElement("title",null,"Gateway Admin Dashboard"),a.createElement("link",{rel:"stylesheet",href:"https://unpkg.com/@conductionnl/conduction-design-tokens@1.0.0-alpha.13/dist/index.css"})),a.createElement("div",{className:"utrecht-document conduction-theme"},a.createElement("div",{className:"utrecht-page"},a.createElement(o,null),a.createElement("div",{className:"utrecht-page__content"},a.createElement(d,{title:r,subText:i}),a.createElement("div",{className:"container py-4"},t)),a.createElement(c,null))))}},6405:function(e,t,n){n.d(t,{Z:function(){return r}});var a=n(7294);function r(){return a.createElement("div",{className:"text-center px-5"},a.createElement("div",{className:"spinner-border text-primary",style:{width:"3rem",height:"3rem"},role:"status"},a.createElement("span",{className:"sr-only"},"Loading...")))}},9868:function(e,t,n){n.r(t),n.d(t,{default:function(){return u}});var a=n(7294),r=n(3084),c=n(5444),l=n(663),i=n(6405),o=n(9002),s=(n(5888),n(1307),n(3947),n(5486));function d(e){var t=e.id,n=a.useState(null),r=n[0],d=n[1],u=a.useState(null),m=u[0],p=u[1],h=a.useState(!1),v=h[0],E=h[1];a.useEffect((function(){"undefined"!=typeof window&&null===r&&d({adminUrl:window.GATSBY_ADMIN_URL}),"new"!==t&&g()}),[r]);var g=function(){fetch(r.adminUrl+"/soaps/"+t,{headers:{"Content-Type":"application/json",Authorization:"Bearer "+sessionStorage.getItem("jwt")}}).then((function(e){return e.json()})).then((function(e){p(e),console.log(e)}))};return a.createElement("form",{id:"dataForm",onSubmit:function(e){E(!0),e.preventDefault();var n=(0,l.Oo)(e.target,"headers"),a=r.adminUrl+"/gateways",i="POST";"new"!==t&&(a=a+"/"+t,i="PUT");var o=document.getElementById("nameInput"),s=document.getElementById("locationInput"),d=document.getElementById("authInput"),u=document.getElementById("localeInput"),m=document.getElementById("acceptInput"),h=document.getElementById("jwtInput"),v=document.getElementById("jwtIdInput"),g=document.getElementById("secretInput"),N=document.getElementById("usernameInput"),f=document.getElementById("passwordInput"),y=document.getElementById("apikeyInput"),I=document.getElementById("documentationInput"),j=document.getElementById("authorizationHeaderInput"),x={name:o.value,location:s.value,auth:d.value,locale:u.value,accept:m.value,jwt:h.value,jwtId:v.value,secret:g.value,username:N.value,password:f.value,apikey:y.value,documentation:I.value,authorizationHeader:j.value};0!==Object.keys(n).length?x.headers=n:x.headers=[],x=(0,l.Z6)(x),fetch(a,{method:i,credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(x)}).then((function(e){return e.json()})).then((function(e){p(e),E(!1),(0,c.c4)("/soap")})).catch((function(e){console.error("Error:",e)}))}},a.createElement(s.Card,{title:"Soap",cardHeader:function(){return a.createElement(a.Fragment,null,a.createElement(c.rU,{className:"utrecht-link",to:"/soaps"},a.createElement("button",{className:"utrecht-button utrecht-button-sm btn-sm btn-danger mr-2"},a.createElement("i",{className:"fas fa-long-arrow-alt-left mr-2"}),"Back")),a.createElement("button",{className:"utrecht-button utrec`ht-button-sm btn-sm btn-success",type:"submit"},a.createElement("i",{className:"fas fa-save mr-2"}),"Save"))},cardBody:function(){return a.createElement("div",{className:"row"},a.createElement("div",{className:"col-12"},!0===v?a.createElement(i.Z,null):a.createElement(a.Fragment,null,a.createElement("div",{className:"row mb-3"},a.createElement("div",{className:"col-6"},null!==m&&null!==m.name?a.createElement(o.GenericInputComponent,{type:"text",name:"name",id:"nameInput",data:m.name,nameOverride:"Name",required:"true"}):a.createElement(o.GenericInputComponent,{type:"text",name:"name",id:"nameInput",nameOverride:"Name",required:"true"})),a.createElement("div",{className:"col-6"},null!==m&&null!==m.description?a.createElement(o.GenericInputComponent,{name:"description",data:m.description,type:"text",id:"descriptionInput"}):a.createElement(o.GenericInputComponent,{name:"description",type:"text",id:"descriptionInput"}))),a.createElement("div",{className:"row mb-3"},a.createElement("div",{className:"col-6"},null!==m&&null!==m.type?a.createElement(o.GenericInputComponent,{type:"text",name:"type",id:"typeInput",data:m.type,required:"true"}):a.createElement(o.GenericInputComponent,{type:"text",name:"type",id:"typeInput",required:"true"})),a.createElement("div",{className:"col-6"},null!==m&&null!==m.zaaktype?a.createElement(o.GenericInputComponent,{name:"zaaktype",data:m.zaaktype,type:"text",id:"zaaktypeInput"}):a.createElement(o.GenericInputComponent,{name:"zaaktype",type:"text",id:"zaaktypeInput"}))))))}}))}var u=function(e){return a.createElement(r.Z,{title:"Soap",subtext:"Edit or create a soap object"},a.createElement("title",null,"Gateway - Soaps"),a.createElement("main",null,a.createElement("div",{className:"row"},a.createElement("div",{className:"col-12"},a.createElement("div",{className:"page-top-item"},a.createElement(d,{id:e.params.id}))))))}},9963:function(e,t,n){n.d(t,{PR:function(){return a},av:function(){return r},jl:function(){return c},kS:function(){return l}});var a=function(){return"undefined"!=typeof window&&window.sessionStorage.getItem("user")?JSON.parse(window.sessionStorage.getItem("user")):{}},r=function(e){return window.sessionStorage.setItem("user",JSON.stringify(e))},c=function(){return!!a().username},l=function(){r({})}},5586:function(e,t,n){n.r(t)},4156:function(e,t,n){n.r(t)}}]);
//# sourceMappingURL=component---src-pages-soap-[id]-tsx-833a2a69bf4c01fad568.js.map