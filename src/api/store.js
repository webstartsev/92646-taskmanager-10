export default class Store {
  constructor(key, storage) {
    this._storekey = key;
    this._storage = storage;
  }

  getAll() {
    try {
      return JSON.stringify(this._storage.getItem(this._storekey));
    } catch (err) {
      return {};
    }
  }

  dropAll() {}

  setItem(key, value) {
    const store = this.getAll();

    this._storage.setItem(
        this._storekey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        )
    );
  }

  removeItem(key) {
    const store = this.getAll();

    delete store[key];

    this._storage.setItem(
        this._storekey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }
}
