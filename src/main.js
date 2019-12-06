import MenuComponent from './components/menu';
import FilterComponent from './components/filter';
import BoardComponent from './components/board';
import FormTaskComponent from './components/form-task';
import TaskComponent from './components/task';
import LoadMoreBtnComponent from './components/load-more-btn';
import NoTaskComponent from './components/no-tasks.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render, remove} from './utils/render.js';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskFormComponent = new FormTaskComponent(task);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskFormComponent.getElement());
  };
  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskFormComponent.getElement(), taskComponent.getElement());
  };

  const editBtn = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editBtn.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });
  const submitForm = taskFormComponent.getElement().querySelector(`.card__form`);
  submitForm.addEventListener(`submit`, () => {
    replaceEditToTask();
  });

  render(taskListElement, taskComponent);
};

const mainElement = document.querySelector(`.main`);

const mainControlElement = mainElement.querySelector(`.main__control`);
render(mainControlElement, new MenuComponent());

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);
render(mainElement, new FilterComponent(filters));

const isAllTaskArchive = tasks.every((task) => task.isArchive);

if (isAllTaskArchive || tasks.length === 0) {
  render(mainElement, new NoTaskComponent());
} else {
  render(mainElement, new BoardComponent());

  const boardElement = mainElement.querySelector(`.board`);
  const taskListElement = boardElement.querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  tasks.slice(0, showingTasksCount).forEach((task) => {
    renderTask(taskListElement, task);
  });

  const loadMoreBtnComponent = new LoadMoreBtnComponent();
  render(boardElement, loadMoreBtnComponent);

  const loadMoreButton = boardElement.querySelector(`.load-more`);
  loadMoreButton.addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      remove(loadMoreBtnComponent);
    }
  });
}
