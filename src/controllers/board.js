import LoadMoreBtnComponent from '../components/load-more-btn.js';
import NoTasksComponent from '../components/no-tasks.js';
import FormTaskComponent from '../components/form-task.js';
import TaskComponent from '../components/task.js';
import SortComponent from '../components/sort.js';
import {render, remove, RenderPosition} from '../utils/render.js';

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
  }

  render(tasks) {
    const container = this._container.getElement();
    const taskListElement = container.querySelector(`.board__tasks`);

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const renderLoadMorebtn = () => {
      render(container, this._loadMoreBtnComponent);

      this._loadMoreBtnComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

        renderTasks(taskListElement, tasks.slice(prevTasksCount, showingTasksCount));

        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreBtnComponent);
        }
      });
    };

    const isAllTaskArchive = tasks.every((task) => task.isArchive);

    if (isAllTaskArchive || tasks.length === 0) {
      render(container, this._noTasksComponent);
    } else {
      render(container, this._sortComponent, RenderPosition.AFTERBEGIN);
      renderTasks(taskListElement, tasks.slice(0, showingTasksCount));
      renderLoadMorebtn();
    }
  }
}
