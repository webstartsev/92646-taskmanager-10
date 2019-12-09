import LoadMoreBtnComponent from '../components/load-more-btn.js';
import NoTasksComponent from '../components/no-tasks.js';
import FormTaskComponent from '../components/form-task.js';
import TaskComponent from '../components/task.js';
import SortComponent from '../components/sort.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType} from '../const.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskFormComponent = new FormTaskComponent(task);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
    }
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskFormComponent.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };
  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskFormComponent.getElement(), taskComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  taskComponent.setEditBtnClickHandler(replaceTaskToEdit);
  taskFormComponent.setSubmitHandler(replaceEditToTask);

  render(taskListElement, taskComponent);
};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
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

  render(tasks) {
    const container = this._container.getElement();
    const taskListElement = container.querySelector(`.board__tasks`);

    const renderLoadMorebtn = (tasksList) => {
      if (this._countShowTasks >= tasksList.length) {
        return;
      }
      render(container, this._loadMoreBtnComponent);

      this._loadMoreBtnComponent.setClickHandler(() => {
        const prevTasksCount = this._countShowTasks;
        this._countShowTasks = this._countShowTasks + SHOWING_TASKS_COUNT_BY_BUTTON;
        renderTasks(taskListElement, tasksList.slice(prevTasksCount, this._countShowTasks));

        if (this._countShowTasks >= tasksList.length) {
          remove(this._loadMoreBtnComponent);
        }
      });
    };

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
        taskListElement.innerHTML = ``;

        renderTasks(taskListElement, sortedTask.slice(0, this._countShowTasks));
        renderLoadMorebtn(sortedTask);
      });

      renderTasks(taskListElement, tasks.slice(0, this._countShowTasks));
      renderLoadMorebtn(tasks);
    }
  }
}
