(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{41:function(e,t,r){},43:function(e,t,r){},45:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}(r(1));r(43);t.default=class extends n.Component{render(){return n.default.createElement("p",null,"test")}}},46:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,o=(n=r(45))&&n.__esModule?n:{default:n},u=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}(r(1));r(41);t.default=class extends u.Component{constructor(){super(),this.handleNext=this.handleNext.bind(this)}handleNext(){}testAsyncFunction(){return(e=regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("thing");case 2:return t=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}},e,this)}),function(){var t=this,r=arguments;return new Promise(function(n,o){var u=e.apply(t,r);function a(e,t){try{var r=u[e](t),a=r.value}catch(e){return void o(e)}r.done?n(a):Promise.resolve(a).then(c,i)}function c(e){a("next",e)}function i(e){a("throw",e)}c()})})();var e}render(){return u.default.createElement("div",{className:"container"},this.props.children,u.default.createElement("img",{src:"/images/logo.svg",alt:"Vital Logo",className:"logo",width:"18",height:"18"}),u.default.createElement(o.default,null))}}},47:function(e,t,r){"use strict";var n=l(r(46)),o=r(25),u=r(26),a=l(r(1)),c=r(35),i=r(27);function l(e){return e&&e.__esModule?e:{default:e}}(0,c.render)(a.default.createElement(u.Provider,{store:{}},a.default.createElement(o.BrowserRouter,null,a.default.createElement(i.Route,{exact:!0,path:"/",component:n.default}))),document.getElementById("root")||document.createElement("div"))}},[[47,0,1]]]);
//# sourceMappingURL=main.chunk.js.map