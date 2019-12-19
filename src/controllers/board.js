import LoadMoreBtnComponent from '../components/load-more-btn.js';
import NoTasksComponent from '../components/no-tasks.js';
import SortComponent from '../components/sort.js';
import BoardComponent from '../components/board.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType} from '../const.js';
import TaskController from './task.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export default class BoardController {
  constructor(container, tasksModel) {
    this._container = container;
    this._countShowTasks = SHOWING_TASKS_COUNT_ON_START;
    this._showedTaskControllers = [];
    this._boardElement = null;
    this._taskListElement = null;

    this._tasksModel = tasksModel;

    this._boardComponent = new BoardComponent();
    this._loadMoreBtnComponent = new LoadMoreBtnComponent();
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setClickSortHandler(this._onSortTypeChange);
  }

  _renderTasks(tasks) {
    const newTasks = tasks.map((task) => {
      const taskController = new TaskController(this._taskListElement, this._onDataChange, this._onViewChange);
      taskController.render(task);

      return taskController;
    });

    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._countShowTasks = this._showedTaskControllers.length;
  }

  _renderLoadMorebtn(tasks) {
    if (this._countShowTasks >= this._countShowTasks.length) {
      return;
    }
    render(this._boardElement, this._loadMoreBtnComponent);

    this._loadMoreBtnComponent.setClickHandler(() => {
      const prevTasksCount = this._countShowTasks;
      this._countShowTasks = this._countShowTasks + SHOWING_TASKS_COUNT_BY_BUTTON;
      this._renderTasks(tasks.slice(prevTasksCount, this._countShowTasks));

      if (this._countShowTasks >= tasks.length) {
        remove(this._loadMoreBtnComponent);
      }
    });
  }

  _onDataChange(taskController, oldTask, newTask) {
    const index = this._tasks.findIndex((task) => task === oldTask);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newTask, this._tasks.slice(index + 1));
    taskController.render(this._tasks[index]);
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
      this._renderLoadMorebtn(tasks);
    }
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

    this._renderLoadMorebtn(sortedTasks);
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _updateTasks(count) {
    const tasks = this._tasksModel.getTasks().slice(0, count);
    this._removeTasks();
    this._renderTasks(tasks);
    this._renderLoadMorebtn(tasks);
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }
}
