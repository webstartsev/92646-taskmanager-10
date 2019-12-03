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

const mainElement = document.querySelector(`.main`);

const mainControlElement = mainElement.querySelector(`.main__control`);
render(mainControlElement, new MenuComponent().getElement());

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);
render(mainElement, new FilterComponent(filters).getElement());
render(mainElement, new BoardComponent().getElement());

const boardElement = mainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);
render(taskListElement, new FormTaskComponent(tasks[0]).getElement());

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
tasks.slice(1, showingTasksCount)
  .forEach((task) => render(taskListElement, new TaskComponent(task).getElement()));

render(boardElement, new LoadMoreBtnComponent().getElement());

const loadMoreButton = boardElement.querySelector(`.load-more`);
loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, new TaskComponent(task).getElement()));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
