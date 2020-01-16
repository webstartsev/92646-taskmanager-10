export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    return this._api.getTasks();
  }

  createTask(task) {
    return this._api.createTask(task);
  }

  updateTask(id, task) {
    return this._api.updateTask(id, task);
  }

  deleteTask(id) {
    return this._api.deleteTask(id);
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
