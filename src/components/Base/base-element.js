import { identity } from '../../utility';

export * from './../../decorators';
export * from '../../utility';

export const defaultPropertyDeclaration = {
	observe: true
	, reflect: false
	, prop2attr: identity
	, attr2prop: identity
};

//* Class *********************************************************************
export class BaseElement extends HTMLElement {
	//* Constructor *************************************************************
	constructor() {

		/**
     * If you define a constructor, always call super() first to apply the right property chain!
     * This is specific to custom elements and required by the spec.
     */
		super();

		this.attachShadow({ mode: 'open' });
		if (!this.shadowRoot) {
			this.renderRoot = this;
			throw new Error('No ShadowRoot');
		}
		this.renderRoot = this.shadowRoot;
	}



	//* Properties/Getter/Setter ************************************************
	static _classProperties = new Map();
	static addClassProperty(propertyKey, propertyDeclaration) {
		this._classProperties.set(propertyKey, Object.assign({}, defaultPropertyDeclaration, propertyDeclaration));
	}

	renderRoot;

	_template;
	get template() {
		if (!this._template) { this._template = document.createElement('template'); }
		return this._template;
	}

	_styleElement;
	get styleElement() {
		if (!this._styleElement) { this._styleElement = document.createElement('style'); }
		return this._styleElement;
	}



	//* Template ****************************************************************
	/* return '<div><slot name=test></slot></div>'; */
	renderTemplate() { return ''; }

	/* return 'div {background-color: blue;}' */
	renderStyle() { return ''; }

	requestUpdate() {
		console.log('requestUpdate: ', this);
		this.render();
	}

	renderAttributes() {
		this.constructor._classProperties.forEach((propertyDeclaration, propertyKey) => {
			if (!propertyDeclaration.reflect || typeof propertyKey !== 'string') { return; }

			const { prop2attr = identity } = propertyDeclaration;
			const prop = this[propertyKey];
			if (prop) { this.setAttribute(propertyKey, prop2attr.call(this, prop)); }
			else { this.removeAttribute(propertyKey); }
		});
	}

	render() {
		this.styleElement.innerHTML = this.renderStyle();
		this.template.innerHTML = this.renderTemplate();
		this.preCommitHook();
		requestAnimationFrame(this.commit.bind(this));
	}



	//* Obervers/Handlers *******************************************************
	/**
   * Specify observed attributes names to be notified in attributeChangedCallback
   */
	static get observedAttributes() {
		const ret = [];
		this._classProperties.forEach((propertyDeclaration, propertyKey) => {
			if (propertyDeclaration.observe && typeof propertyKey === 'string') { ret.push(propertyKey); }
		});
		return ret;
	}

	/**
   * Called when an observed attribute has been added, removed, updated, or replaced.
   * Also called for initial values when an element is created by the parser, or upgraded.
   * Note: only attributes listed in the observedAttributes property will receive this callback.
   */
	attributeChangedCallback(attrName, oldValue, newValue) {
		if (oldValue === newValue) { return; }
		const { attr2prop = identity } = this.constructor._classProperties.get(attrName) || defaultPropertyDeclaration;
		this[attrName] = attr2prop.call(this, newValue);
	}



	//* Life Cycle Callbacks ****************************************************
	/**
   * Invoked each time the custom element is appended into a document-connected
   * element. This will happen each time the node is moved, and may happen before
   * the element's contents have been fully parsed.
   *
   * Useful for running setup code, such as fetching resources or rendering.
   * Generally, you should try to delay work until this time.
   */
	connectedCallback() {
		if (!this.isConnected) { return; }
		this.render();
	}

	/**
   * Invoked each time the custom element is disconnected from the document's DOM.
   * Useful for running clean up code.
   */
	// protected disconnectedCallback() {}

	/**
   * Invoked each time the custom element is moved to a new document.
   */
	// protected adoptedCallback() {}

	/**
   * Invoked if custom elem is "form-associative = true".
   */
	// protected formResetCallback() {}

	// eslint-disable-next-line
	preCommitHook() { }

	commit() {
		this.renderRoot.appendChild(this.styleElement);

		// Does not clone the DocumentFragment, instead rips it from the template and
		// places it into the render node. This way the element will retain the references
		// of objects within the template.
		this.renderRoot.appendChild(this.template.content);
		this.renderAttributes();
	}
}
