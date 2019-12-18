export default class Task {
  constructor() {
    this._tasks = [];
  }

  getTasks() {
    return this._tasks;
  }

  setTasks(tasks) {
    this._tasks = Array.from(tasks);
  }

  updateTask(id, newTask) {
    const index = this._tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newTask, this._tasks.slice(index + 1));

    return true;
  }
}
