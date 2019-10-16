// State store for e.g. class properties

const store = Symbol('store');

export const StateStore = Object.seal(class StateStore {
	constructor() {
		this[store] = new Map();
	}

	get(key) {
		return this[store].get(key);
	}

	set(key, value) {
		const oldVal = this[store].get(key);
		this[store].set(key, value);

		return this.mutation(oldVal, this[store].get(key));
	}

	mutation(oldVal, newVal) {
		return new Promise((resolve, reject) => {
			if (this.dispatchEvent(new Event('mutation', { cancelable: true }))) {
				resolve({ oldVal, newVal });
			}

			reject(new Error('Mutation event was canceled'));
		});
	}
});
