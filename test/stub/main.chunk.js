(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{40:function(e,t,r){},41:function(e,t,r){},43:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}(r(1));r(41);t.default=class Checkbox extends n.Component{render(){return n.default.createElement("p",null,"test")}}},44:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,o=(n=r(43))&&n.__esModule?n:{default:n},a=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}(r(1));function u(e,t,r,n,o,a,u){try{var c=e[a](u),i=c.value}catch(l){return void r(l)}c.done?t(i):Promise.resolve(i).then(n,o)}r(40);t.default=class Base extends a.Component{constructor(){super(),this.handleNext=this.handleNext.bind(this)}handleNext(){}testAsyncFunction(){return(e=regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("thing");case 2:return t=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}},e,this)}),function(){var t=this,r=arguments;return new Promise(function(n,o){var a=e.apply(t,r);function c(e){u(a,n,o,c,i,"next",e)}function i(e){u(a,n,o,c,i,"throw",e)}c(void 0)})})();var e}render(){return a.default.createElement("div",{className:"container"},this.props.children,a.default.createElement("img",{src:"/images/logo.svg",alt:"Vital Logo",className:"logo",width:"18",height:"18"}),a.default.createElement(o.default,null))}}},45:function(e,t,r){"use strict";var n=l(r(44)),o=r(25),a=r(26),u=l(r(1)),c=r(35),i=r(27);function l(e){return e&&e.__esModule?e:{default:e}}(0,c.render)(u.default.createElement(a.Provider,{store:{}},u.default.createElement(o.BrowserRouter,null,u.default.createElement(i.Route,{exact:!0,path:"/",component:n.default}))),document.getElementById("root")||document.createElement("div"))}},[[45,0,1]]]);
//# sourceMappingURL=main.chunk.js.map