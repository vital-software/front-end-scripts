(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{18:function(e,t,n){e.exports={thing:"base-component-module--thing--3afL7"}},24:function(e,t,n){},25:function(e,t,n){},34:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r);n(24);class o extends r.Component{render(){return a.a.createElement("p",null,"test")}}n(25);var c=n(18),s=n.n(c);function i(e,t,n,r,a,o,c){try{var s=e[o](c),i=s.value}catch(l){return void n(l)}s.done?t(i):Promise.resolve(i).then(r,a)}class l extends r.Component{constructor(){super(),this.handleNext=this.handleNext.bind(this)}handleNext(){console.log(this.props)}testAsyncFunction(){return(e=regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("thing");case 2:return t=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)})),function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function c(e){i(o,r,a,c,s,"next",e)}function s(e){i(o,r,a,c,s,"throw",e)}c(void 0)}))})();var e}render(){return a.a.createElement("div",{className:"container"},this.props.children,a.a.createElement("img",{src:"/images/logo.svg",alt:"Vital Logo",className:"logo",width:"18",height:"18"}),a.a.createElement("p",{className:s.a.thing},"Yolo"),a.a.createElement(o,null))}}var u=n(20),m=n(22),h=n(11),p=n(7);Object(h.render)(a.a.createElement(m.a,{store:{}},a.a.createElement(u.a,null,a.a.createElement(p.a,{exact:!0,path:"/",component:l}))),document.getElementById("root")||document.createElement("div"))}},[[34,1,2]]]);
//# sourceMappingURL=main.chunk.js.map