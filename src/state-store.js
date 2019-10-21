// State store for e.g. class properties

const store = Symbol('store');
const observers = Symbol('observers');

class Entity {
	constructor(key, value, newValue) {
		this.key = key;
		this.value = value;
		this.newValue = newValue;
	}
}

export const StateStore = Object.seal(class StateStore {
	constructor() {
		this[store] = new Map();
		this[observers] = [];
		this.mutationEvent = new Event('mutation', { cancelable: true });
	}

	get(key) {
		return this[store].get(key);
	}

	set(key, newValue) {
		this.mutation(new Entity(key, this[store].get(key), newValue))
			.then(this.saveToStore.bind(this))
			.catch((err) => err)
			.finally(this.notify.bind(this));

		return this;
	}

	saveToStore(entity) {
		this[store].set(entity.key, entity.newValue);
		return entity;
	}

	notify() {
		this[observers].reduce((promiseAcc, func) => promiseAcc.then(func), Promise.resolve());
	}

	mutation(entity) {
		return new Promise((resolve, reject) => {
			if (this.dispatchEvent(this.mutationEvent)) {
				resolve(entity);
			}

			reject(new Error('Mutation event was canceled'));
		});
	}

	observe(callback) {
		this[observers].push(callback);
	}
});
