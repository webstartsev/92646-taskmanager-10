import LoadMoreBtnComponent from '../components/load-more-btn.js';
import NoTasksComponent from '../components/no-tasks.js';
import SortComponent from '../components/sort.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType} from '../const.js';
import {TaskController} from './task.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    const taskController = new TaskController(taskListElement);
    taskController.render(task);
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._loadMoreBtnComponent = new LoadMoreBtnComponent();
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._countShowTasks = SHOWING_TASKS_COUNT_ON_START;
  }

  _renderLoadMorebtn(taskListElement, tasks) {
    const container = this._container.getElement();
    if (this._countShowTasks >= this._countShowTasks.length) {
      return;
    }
    render(container, this._loadMoreBtnComponent);

    this._loadMoreBtnComponent.setClickHandler(() => {
      const prevTasksCount = this._countShowTasks;
      this._countShowTasks = this._countShowTasks + SHOWING_TASKS_COUNT_BY_BUTTON;
      renderTasks(taskListElement, tasks.slice(prevTasksCount, this._countShowTasks));

      if (this._countShowTasks >= tasks.length) {
        remove(this._loadMoreBtnComponent);
      }
    });
  }

  render(tasks) {
    const container = this._container.getElement();
    const taskListElement = container.querySelector(`.board__tasks`);

    const isAllTaskArchive = tasks.every((task) => task.isArchive);

    if (isAllTaskArchive || tasks.length === 0) {
      render(container, this._noTasksComponent);
    } else {
      render(container, this._sortComponent, RenderPosition.AFTERBEGIN);

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

        renderTasks(taskListElement, sortedTask.slice(0, this._countShowTasks));
        this._renderLoadMorebtn(taskListElement, sortedTask);
      });

      renderTasks(taskListElement, tasks.slice(0, this._countShowTasks));
      this._renderLoadMorebtn(taskListElement, tasks);
    }
  }
}
