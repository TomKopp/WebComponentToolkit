/**
 * @module utility
 */
// eslint-disable-next-line
export function noop() { }

/**
 * Returns the value
 *
 * @exports
 * @param {*} val any value
 * @returns {*} the exat same value
 */
export function identity(val) { return val; }

/**
 * Converts an attribute string value to boolean
 *
 * @exports
 * @param {string} val attribute value
 * @returns {boolean} boolean interpretation of attribute
 */
export function attr2bool(val) { return val !== null; }

/**
 * Converts a boolean value to a boolean attribute value
 *
 * @exports
 * @param {boolean} val a boolean
 * @returns {(string | null)} empty strign if attribute should exist, else null
 */
export function bool2attr(val) { return val ? '' : null; }

export const debounce = (func, wait, immediate = false) => {
	if (typeof func !== 'function') {
		throw new TypeError('Expected a function');
	}

	let timeout;

	return function debounced(...args) {
		const later = () => {
			timeout = null;
			if (!immediate) {
				func.apply(this, args);
			}
		};

		const callNow = immediate && !timeout;

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

		if (callNow) {
			func.apply(this, args);
		}
	};
};



/**
 * PropertyDeclaration
 *
 * @typedef {object} PropertyDeclaration
 * @property {boolean} [observe=true] Flag indicating that this property will be monitored for changes
 * @property {boolean} [reflect=false] Flag indicatin that this property will be reflected as attribute
 * @property {Function} [prop2attr=identity] Converts the property to an attribute
 * @property {Function} [attr2prop=identity] Converts the attribute to a property
 */
/**
 * @exports
 * @type {PropertyDeclaration}
 */
export const defaultPropertyDeclaration = {
	observe: true
	, reflect: false
	, prop2attr: identity
	, attr2prop: identity
};
