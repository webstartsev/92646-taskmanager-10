import LoadMoreBtnComponent from '../components/load-more-btn.js';
import NoTasksComponent from '../components/no-tasks.js';
import SortComponent from '../components/sort.js';
import BoardComponent from '../components/board.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType, HIDDEN_CLASS} from '../const.js';
import TaskController, {EmptyTask, Mode} from './task.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export default class BoardController {
  constructor(container, tasksModel, api) {
    this._container = container;
    this._countShowTasks = SHOWING_TASKS_COUNT_ON_START;
    this._showedTaskControllers = [];
    this._boardElement = null;
    this._taskListElement = null;
    this._creatingTask = null;

    this._tasksModel = tasksModel;
    this._api = api;

    this._boardComponent = new BoardComponent();
    this._loadMoreBtnComponent = new LoadMoreBtnComponent();
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);


    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setClickSortHandler(this._onSortTypeChange);
  }

  _renderTasks(tasks) {
    const newTasks = tasks.map((task) => {
      const taskController = new TaskController(this._taskListElement, this._onDataChange, this._onViewChange);
      taskController.render(task, Mode.DEFAULT);

      return taskController;
    });

    this._showedTaskControllers = [...this._showedTaskControllers, ...newTasks];
    this._countShowTasks = this._showedTaskControllers.length;
  }

  _renderLoadMorebtn() {
    const tasks = this._tasksModel.getTasks();
    remove(this._loadMoreBtnComponent);

    if (this._countShowTasks >= tasks.length) {
      return;
    }

    render(this._boardElement, this._loadMoreBtnComponent);
    this._loadMoreBtnComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    const tasks = this._tasksModel.getTasks();

    const prevTasksCount = this._countShowTasks;
    this._countShowTasks = this._countShowTasks + SHOWING_TASKS_COUNT_BY_BUTTON;
    this._renderTasks(tasks.slice(prevTasksCount, this._countShowTasks));

    if (this._countShowTasks >= tasks.length) {
      remove(this._loadMoreBtnComponent);
    }
  }

  _onDataChange(taskController, oldTask, newTask) {
    if (oldTask === EmptyTask) {
      this._creatingTask = null;
      if (newTask === null) {
        taskController.destroy();
        this._updateTasks(this._countShowTasks);
      } else {
        this._api.createTask(newTask)
          .then((taskModel) => {
            this._tasksModel.addTask(taskModel);
            taskController.render(newTask, Mode.DEFAULT);

            const destroyedTask = this._showedTaskControllers.pop();
            destroyedTask.destroy();

            this._showedTaskControllers = [taskController, ...this._showedTaskControllers];
            this._showingTasksCount = this._showedTaskControllers.length;
          });
      }
    } else if (newTask === null) {
      this._api.deleteTask(oldTask.id)
        .then(() => {
          this._tasksModel.removeTask(oldTask.id);
          this._updateTasks(this._countShowTasks);
        });
    } else {
      this._api.updateTask(oldTask.id, newTask)
        .then((taskModel) => {
          this._tasksModel.updateTask(oldTask.id, taskModel);
          this._updateTasks(this._countShowTasks);
        });
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((task) => task.setDefaultView());
  }

  render() {
    render(this._container, this._boardComponent);
    this._boardElement = this._boardComponent.getElement();

    const tasks = this._tasksModel.getTasks();

    this._taskListElement = this._container.querySelector(`.board__tasks`);

    const isAllTaskArchive = tasks.every((task) => task.isArchive);
    if (isAllTaskArchive || tasks.length === 0) {
      render(this._boardElement, this._noTasksComponent);
    } else {

      render(this._boardElement, this._sortComponent, RenderPosition.AFTERBEGIN);

      this._renderTasks(tasks.slice(0, this._countShowTasks));
      this._renderLoadMorebtn();
    }
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    this._creatingTask = new TaskController(this._taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, Mode.ADDING);
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];
    const tasks = this._tasksModel.getTasks();

    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
      default:
        sortedTasks = tasks.slice();

        break;
    }
    this._removeTasks();
    this._renderTasks(sortedTasks);

    this._renderLoadMorebtn();
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _updateTasks(count) {
    const tasks = this._tasksModel.getTasks().slice(0, count);
    this._removeTasks();
    this._renderTasks(tasks);
    this._renderLoadMorebtn();
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }

  show() {
    this._container.querySelector(`.board`).classList.remove(HIDDEN_CLASS);
  }

  hide() {
    this._container.querySelector(`.board`).classList.add(HIDDEN_CLASS);
  }
}
