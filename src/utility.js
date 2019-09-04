// eslint-disable-next-line
export function noop() { }
export function identity(val) { return val; }
export function attr2bool(val) { return val !== null; }
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
