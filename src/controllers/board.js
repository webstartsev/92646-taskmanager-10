import LoadMoreBtnComponent from '../components/load-more-btn.js';
import NoTasksComponent from '../components/no-tasks.js';
import SortComponent from '../components/sort.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType} from '../const.js';
import {TaskController} from './task.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks, onDataChange) => {
  tasks.forEach((task) => {
    const taskController = new TaskController(taskListElement, onDataChange);
    taskController.render(task);
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._countShowTasks = SHOWING_TASKS_COUNT_ON_START;
    this._tasks = [];

    this._loadMoreBtnComponent = new LoadMoreBtnComponent();
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();

    this._onDataChange = this._onDataChange.bind(this);
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
      renderTasks(taskListElement, tasks.slice(prevTasksCount, this._countShowTasks), this._onDataChange);

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

  render(tasks) {
    this._tasks = tasks;
    const container = this._container.getElement();
    const taskListElement = container.querySelector(`.board__tasks`);

    const isAllTaskArchive = this._tasks.every((task) => task.isArchive);

    if (isAllTaskArchive || this._tasks.length === 0) {
      render(container, this._noTasksComponent);
    } else {
      render(container, this._sortComponent, RenderPosition.AFTERBEGIN);

      this._sortComponent.setClickSortHandler((sortType) => {
        let sortedTask = [];

        switch (sortType) {
          case SortType.DATE_UP:
            sortedTask = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
            break;
          case SortType.DATE_DOWN:
            sortedTask = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
            break;
          case SortType.DEFAULT:
          default:
            sortedTask = this._tasks.slice();

            break;
        }

        remove(this._loadMoreBtnComponent);
        taskListElement.innerHTML = ``;

        renderTasks(taskListElement, sortedTask.slice(0, this._countShowTasks), this._onDataChange);
        this._renderLoadMorebtn(taskListElement, sortedTask);
      });

      renderTasks(taskListElement, this._tasks.slice(0, this._countShowTasks), this._onDataChange);
      this._renderLoadMorebtn(taskListElement, this._tasks);
    }
  }
}
