import { defaultPropertyDeclaration, identity } from '../../utility';

/**
 * @module BaseElement
 */


//* Class *********************************************************************
/**
 * Base class for web components
 *
 * @exports
 * @class BaseElement
 * @extends {HTMLElement}
 */
export class BaseElement extends HTMLElement {
	//* Constructor ***********************************************************
	constructor() {
		// If you define a constructor, always call super() first to apply the right property chain!
		// This is specific to custom elements and required by the spec.
		super();

		this.attachShadow({ mode: 'open' });
		if (!this.shadowRoot) {
			this._renderRoot = this;
			throw new Error('No ShadowRoot');
		}
		this._renderRoot = this.shadowRoot;
	}



	//* Properties/Getter/Setter **********************************************
	/**
	 * Protected map of properties of the class with special flags.
	 *
	 * @protected
	 * @static
	 * @memberof BaseElement
	 */
	static _classProperties = new Map();
	static addClassProperty(propertyKey, propertyDeclaration) {
		this._classProperties.set(propertyKey, Object.assign({}, defaultPropertyDeclaration, propertyDeclaration));
	}

	/**
	 * Protected property that holds a reference where to render the DOM to.
	 *
	 * @protected
	 * @type {(HTMLElement | ShadowRoot)}
	 * @memberof BaseElement
	 */
	_renderRoot;

	/**
	 * Flag to indicate a scheduled requestAnimationFrame
	 *
	 * @protected
	 * @type {boolean}
	 * @memberof BaseElement
	 */
	_rAFScheduled = false;

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
	/**
	 * Override to set a template
	 *
	 * @example return '<div><slot name=test></slot></div>';
	 * @returns {string} the template string
	 * @memberof BaseElement
	 */
	renderTemplate() { return ''; }

	/**
	 * Override to set the style element
	 *
	 * @example return 'div {background-color: blue;}'
	 * @returns {string} css ruleset
	 * @memberof BaseElement
	 */
	renderStyle() { return ''; }

	/**
	 * Requests an update of the component. Checks if the value changed.
	 *
	 * @param {string} propertyKey property name
	 * @param {*} oldValue old value of the property
	 * @param {*} newValue new value of the property
	 * @memberof BaseElement
	 */
	requestUpdate(propertyKey, oldValue, newValue) {
		if (Object.is(oldValue, newValue)) { return; }
		this.render();
	}

	/**
	 * Sets or removes attributes of the component, based on the 'reflect' flag of the property.
	 *
	 * @memberof BaseElement
	 */
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

		if (!this._rAFScheduled) {
			this._rAFScheduled = true;
			requestAnimationFrame(() => {
				this.commit();
				this._rAFScheduled = false;
			});
		}
	}



	//* Obervers/Handlers *****************************************************
	/**
	 * Specify observed attributes names to be notified in attributeChangedCallback
	 *
	 * @readonly
	 * @static
	 * @memberof BaseElement
	 * @returns {string[]} array of property names that will be observed as attributes
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
	 *
	 * @param {string} attrName attribute name
	 * @param {(string | null)} oldValue old value of the attribute
	 * @param {(string | null)} newValue new value of the attribute
	 * @memberof BaseElement
	 */
	attributeChangedCallback(attrName, oldValue, newValue) {
		if (oldValue === newValue) { return; }
		const { attr2prop = identity } = this.constructor._classProperties.get(attrName) || defaultPropertyDeclaration;
		this[attrName] = attr2prop.call(this, newValue);
	}



	//* Life Cycle Callbacks **************************************************
	/**
	 * Invoked each time the custom element is appended into a document-connected
	 * element. This will happen each time the node is moved, and may happen before
	 * the element's contents have been fully parsed.
	 *
	 * Useful for running setup code, such as fetching resources or rendering.
	 * Generally, you should try to delay work until this time.
	 *
	 * @memberof BaseElement
	 */
	connectedCallback() {
		if (!this.isConnected) { return; }
		this.render();
	}

	/**
	 * Invoked each time the custom element is disconnected from the document's DOM.
	 * Useful for running clean up code.
	 *
	 * @memberof BaseElement
	 */
	// disconnectedCallback() {}

	/**
	 * Invoked each time the custom element is moved to a new document.
	 *
	 * @memberof BaseElement
	 */
	// adoptedCallback() {}

	/**
	 * Invoked if custom elem is "form-associative = true".
	 *
	 * @memberof BaseElement
	 */
	// formResetCallback() {}

	/**
	 * Invoked each time the custom element will becommitted to the DOM.
	 *
	 * @memberof BaseElement
	 */
	// eslint-disable-next-line
	preCommitHook() { }

	/**
	 * Invoked each time the custom element is committed to the DOM
	 *
	 * @memberof BaseElement
	 */
	commit() {
		this._renderRoot.appendChild(this.styleElement);

		// Does not clone the DocumentFragment, instead rips it from the template and
		// places it into the render node. This way the element will retain the references
		// of objects within the template.
		this._renderRoot.appendChild(this.template.content);
		this.renderAttributes();
	}
}
