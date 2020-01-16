import nanoid from 'nanoid';
import Task from '../models/task.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (this._isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          tasks.forEach((task) => {
            this._store.setItem(task.id, task.toRAW());
            return task;
          });
        });
    }

    const storeTasks = Object.values(this._store.getAll());

    return Promise.resolve(Task.parseTasks(storeTasks));
  }

  createTask(task) {
    if (this._isOnline()) {
      return this._api.createTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());
          return newTask;
        });
    }

    const fakeNewTaskId = nanoid();
    const fakeNewTask = Task.parseTask(Object.assign({}, task.toRAW(), {id: fakeNewTaskId}));

    this._store.setItem(fakeNewTask.id, Object.assign({}, fakeNewTask.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewTask);
  }

  updateTask(id, task) {
    if (this._isOnline()) {
      return this._api.updateTask(id, task)
        .then((newItem) => {
          this._store.setItem(newItem.id, newItem.toRAW());
          return newItem;
        });
    }

    const fakeUpdateTask = Task.parseTask(Object.assign({}, task.toRAW(), {id}));
    this._store.setItem(id, Object.assign({}, fakeUpdateTask.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdateTask);
  }

  deleteTask(id) {
    if (this._isOnline()) {
      return this._api.deleteTask(id)
        .then(() => {
          this._store.removeItem(id);
        });
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
