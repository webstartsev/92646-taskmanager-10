import nanoid from 'nanoid';
import Task from '../models/task.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (this._isOnline()) {
      return this._api.getTasks();
    }

    return Promise.resolve(Task.parseTasks([]));
  }

  createTask(task) {
    if (this._isOnline()) {
      return this._api.createTask(task);
    }

    const fakeNewTaskId = nanoid();
    const fakeNewTask = Task.parseTask(Object.assign({}, task.toRAW(), {id: fakeNewTaskId}));

    return Promise.resolve(fakeNewTask);
  }

  updateTask(id, task) {
    if (this._isOnline()) {
      return this._api.updateTask(id, task);
    }

    return Promise.resolve(task);
  }

  deleteTask(id) {
    if (this._isOnline()) {
      return this._api.deleteTask(id);
    }

    return Promise.resolve();
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
