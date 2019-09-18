var webcomponenttoolkit = (function (exports) {
  'use strict';

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

  function noop(){}
  function identity(a){return a}
  function attr2bool(a){return null!==a}
  function bool2attr(a){return a?"":null}
  function isDifferent(a,b){return !Object.is(a,b)}const debounce=(a,b,c=!1)=>{if("function"!=typeof a)throw new TypeError("Expected a function");let d;return function(...e){const f=c&&!d;clearTimeout(d),d=setTimeout(()=>{d=null,c||a.apply(this,e);},b),f&&a.apply(this,e);}};
  const defaultPropertyDeclaration={observe:!0,reflect:!1,prop2attr:identity,attr2prop:identity,modified:isDifferent};

  class BaseElement extends HTMLElement{
  constructor(){if(super(),_defineProperty(this,"_renderRoot",void 0),_defineProperty(this,"_rAFScheduled",!1),_defineProperty(this,"_template",void 0),_defineProperty(this,"_styleElement",void 0),this.attachShadow({mode:"open"}),!this.shadowRoot)throw this._renderRoot=this,new Error("No ShadowRoot");this._renderRoot=this.shadowRoot;}
  static get observedAttributes(){const a=[];return this.classProperties.forEach((b,c)=>{b.observe&&"string"==typeof c&&a.push(c);}),a}
  static get classProperties(){return Object.prototype.hasOwnProperty.call(this,"_classProperties")||Object.defineProperty(this,"_classProperties",{enumerable:!0,value:new Map}),this.classProperties}static addClassProperty(a,b){this.classProperties.set(a,Object.assign({},defaultPropertyDeclaration,b));}
  get template(){return this._template||(this._template=document.createElement("template")),this._template}
  get styleElement(){return this._styleElement||(this._styleElement=document.createElement("style")),this._styleElement}
  updateTemplate(){throw new Error("must be implemented by subclass!")}
  updateStyle(){throw new Error("must be implemented by subclass!")}
  reflectAttributes(){this.constructor.classProperties.forEach((a,b)=>{if(!a.reflect&&"string"!=typeof b)return;const{prop2attr:c=identity}=a,d=c.call(this,this[b]);null===d?this.removeAttribute(b):this.setAttribute(b,d);});}
  attributeChangedCallback(a,b,c){if(b!==c){const{attr2prop:b=identity}=this.constructor.classProperties.get(a)||defaultPropertyDeclaration;this[a]=b.call(this,c);}}
  connectedCallback(){this.isConnected&&this.render(!0,!0,!0);}
  requestUpdate(a,b,c){const{modified:d=isDifferent
  ,reflect:e=!1}=this.constructor.classProperties.get(a)||defaultPropertyDeclaration;d.call(this,b,c)&&(this.styleElement.innerHTML=this.updateStyle(),this.template.innerHTML=this.updateTemplate(),this.requestRender(!0,!0,e));}requestRender(a,b,c){this.preRenderHook(),this._rAFScheduled||(this._rAFScheduled=!0,requestAnimationFrame(()=>{this.render(a,b,c),this._rAFScheduled=!1;}));}
  preRenderHook(){}
  render(a,b,c){b&&this._renderRoot.appendChild(this.styleElement),a&&this._renderRoot.appendChild(this.template.content),c&&this.reflectAttributes();}}

  function defineElement(a,b){return function(c){return c.finisher=function(c){customElements.define(a,c,b);},c}}
  function property(a){
  return function(b){
  if("field"===b.kind){const a=`__${b.key}`;b.extras=[{key:a,kind:b.kind,placement:b.placement,initializer:b.initializer,descriptor:{configurable:!0,enumerable:!0,writable:!0}}],b.kind="method",b.placement="prototype",delete b.initializer,b.descriptor={get(){return this[a]},set(c){const d=this[a];this[a]=c,this.requestUpdate(b.key,d,c);},configurable:!0,enumerable:!0};}return b.finisher=function(c){c.addClassProperty(b.key,a);},b}}

  exports.BaseElement = BaseElement;
  exports.attr2bool = attr2bool;
  exports.bool2attr = bool2attr;
  exports.debounce = debounce;
  exports.defaultPropertyDeclaration = defaultPropertyDeclaration;
  exports.defineElement = defineElement;
  exports.identity = identity;
  exports.isDifferent = isDifferent;
  exports.noop = noop;
  exports.property = property;

  return exports;

}({}));
//# sourceMappingURL=index.iife.js.map
