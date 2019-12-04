import MenuComponent from './components/menu';
import FilterComponent from './components/filter';
import BoardComponent from './components/board';
import FormTaskComponent from './components/form-task';
import TaskComponent from './components/task';
import LoadMoreBtnComponent from './components/load-more-btn';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render} from './utils.js';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskFormComponent = new FormTaskComponent(task);

  const editBtn = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editBtn.addEventListener(`click`, () => {
    taskListElement.replaceChild(taskFormComponent.getElement(), taskComponent.getElement());
  });

  const editForm = taskFormComponent.getElement().querySelector(`.card__form`);
  editForm.addEventListener(`submit`, () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskFormComponent.getElement());
  });

  render(taskListElement, taskComponent.getElement());
};

const mainElement = document.querySelector(`.main`);

const mainControlElement = mainElement.querySelector(`.main__control`);
render(mainControlElement, new MenuComponent().getElement());

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);
render(mainElement, new FilterComponent(filters).getElement());
render(mainElement, new BoardComponent().getElement());

const boardElement = mainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
tasks.slice(0, showingTasksCount).forEach((task) => {
  renderTask(taskListElement, task);
});

render(boardElement, new LoadMoreBtnComponent().getElement());

const loadMoreButton = boardElement.querySelector(`.load-more`);
loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderTask(taskListElement, task));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
