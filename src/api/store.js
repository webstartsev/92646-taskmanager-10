export default class Store {
  constructor(key, storage) {
    this._key = key;
    this._storage = storage;
  }

  getAll() {}

  dropAll() {}

  setItem(key, value) {}

  removeItem(key) {}
}
