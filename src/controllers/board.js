import LoadMoreBtnComponent from '../components/load-more-btn.js';
import NoTasksComponent from '../components/no-tasks.js';
import SortComponent from '../components/sort.js';
import BoardComponent from '../components/board.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType} from '../const.js';
import TaskController from './task.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);

    return taskController;
  });
};

export default class BoardController {
  constructor(container, tasksModel) {
    this._container = container;
    this._countShowTasks = SHOWING_TASKS_COUNT_ON_START;
    this._showedTaskControllers = [];
    this._boardElement = null;

    this._tasksModel = tasksModel;

    this._boardComponent = new BoardComponent();
    this._loadMoreBtnComponent = new LoadMoreBtnComponent();
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  _renderLoadMorebtn(taskListElement, tasks) {
    if (this._countShowTasks >= this._countShowTasks.length) {
      return;
    }
    render(this._boardElement, this._loadMoreBtnComponent);

    this._loadMoreBtnComponent.setClickHandler(() => {
      const prevTasksCount = this._countShowTasks;
      this._countShowTasks = this._countShowTasks + SHOWING_TASKS_COUNT_BY_BUTTON;
      const newTasks = renderTasks(taskListElement, tasks.slice(prevTasksCount, this._countShowTasks), this._onDataChange, this._onViewChange);

      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

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

    const tasks = this._tasksModel.getTasks();
    const taskListElement = this._container.querySelector(`.board__tasks`);

    const isAllTaskArchive = tasks.every((task) => task.isArchive);

    if (isAllTaskArchive || tasks.length === 0) {
      render(this._container, this._noTasksComponent);
    } else {
      this._boardElement = this._boardComponent.getElement();
      render(this._boardElement, this._sortComponent, RenderPosition.AFTERBEGIN);

      this._sortComponent.setClickSortHandler((sortType) => {
        let sortedTask = [];

        switch (sortType) {
          case SortType.DATE_UP:
            sortedTask = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
            break;
          case SortType.DATE_DOWN:
            sortedTask = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
            break;
          case SortType.DEFAULT:
          default:
            sortedTask = tasks.slice();

            break;
        }

        remove(this._loadMoreBtnComponent);
        taskListElement.innerHTML = ``;

        const newTasks = renderTasks(taskListElement, sortedTask.slice(0, this._countShowTasks), this._onDataChange, this._onViewChange);
        this._showedTaskControllers = newTasks;

        this._renderLoadMorebtn(taskListElement, sortedTask);
      });

      const newTasks = renderTasks(taskListElement, tasks.slice(0, this._countShowTasks), this._onDataChange, this._onViewChange);
      this._showedTaskControllers = newTasks;

      this._renderLoadMorebtn(taskListElement, tasks);
    }
  }
}
