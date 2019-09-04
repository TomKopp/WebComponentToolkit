'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function noop(){}function identity(a){return a}function attr2bool(a){return null!==a}function bool2attr(a){return a?"":null}const debounce=(a,b,c=!1)=>{if("function"!=typeof a)throw new TypeError("Expected a function");let d;return function(...e){const f=c&&!d;clearTimeout(d),d=setTimeout(()=>{d=null,c||a.apply(this,e);},b),f&&a.apply(this,e);}};

function defineElement(a,b){return function(c){return c.finisher=function(c){customElements.define(a,c,b);},c}}function property(a){return function(b){
if("field"===b.kind){const a=`__${b.key}`;b.extras=[{key:a,kind:b.kind,placement:b.placement,initializer:b.initializer,descriptor:{configurable:!0,enumerable:!0,writable:!0}}],b.kind="method",b.placement="prototype",delete b.initializer,b.descriptor={get(){return this[a]},set(b){this[a]===b||(this[a]=b,this.requestUpdate());},configurable:!0,enumerable:!0};}return b.finisher=function(c){c.addClassProperty(b.key,a);},b}}

const defaultPropertyDeclaration={observe:!0,reflect:!1,prop2attr:identity,attr2prop:identity};
class BaseElement extends HTMLElement{
constructor(){if(super(),_defineProperty(this,"renderRoot",void 0),_defineProperty(this,"_template",void 0),_defineProperty(this,"_styleElement",void 0),this.attachShadow({mode:"open"}),!this.shadowRoot)throw this.renderRoot=this,new Error("No ShadowRoot");this.renderRoot=this.shadowRoot;}
static addClassProperty(a,b){this._classProperties.set(a,Object.assign({},defaultPropertyDeclaration,b));}get template(){return this._template||(this._template=document.createElement("template")),this._template}get styleElement(){return this._styleElement||(this._styleElement=document.createElement("style")),this._styleElement}
renderTemplate(){return ""}renderStyle(){return ""}requestUpdate(){console.log("requestUpdate: ",this),this.render();}renderAttributes(){this.constructor._classProperties.forEach((a,b)=>{if(!a.reflect||"string"!=typeof b)return;const{prop2attr:c=identity}=a,d=this[b];d?this.setAttribute(b,c.call(this,d)):this.removeAttribute(b);});}render(){this.styleElement.innerHTML=this.renderStyle(),this.template.innerHTML=this.renderTemplate(),this.preCommitHook(),requestAnimationFrame(this.commit.bind(this));}
static get observedAttributes(){const a=[];return this._classProperties.forEach((b,c)=>{b.observe&&"string"==typeof c&&a.push(c);}),a}
attributeChangedCallback(a,b,c){if(b!==c){const{attr2prop:b=identity}=this.constructor._classProperties.get(a)||defaultPropertyDeclaration;this[a]=b.call(this,c);}}
connectedCallback(){this.isConnected&&this.render();}
preCommitHook(){}commit(){
this.renderRoot.appendChild(this.styleElement),this.renderRoot.appendChild(this.template.content),this.renderAttributes();}}_defineProperty(BaseElement,"_classProperties",new Map);

exports.BaseElement = BaseElement;
exports.attr2bool = attr2bool;
exports.bool2attr = bool2attr;
exports.debounce = debounce;
exports.defaultPropertyDeclaration = defaultPropertyDeclaration;
exports.defineElement = defineElement;
exports.identity = identity;
exports.noop = noop;
exports.property = property;
//# sourceMappingURL=index.cjs.js.map
