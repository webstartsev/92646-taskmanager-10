import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createBoardTemplate} from './components/board';
import {createFormTaskEditTemplate} from './components/form-task';
import {createTaskTemplate} from './components/task';
import {createLoadMoreBtnTemplate} from './components/load-more-btn';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';

const TASK_COUNT = 3;

const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

render(mainControlElement, createMenuTemplate());

const filters = generateFilters();
render(mainElement, createFilterTemplate(filters));
render(mainElement, createBoardTemplate());

const boardElement = mainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

const tasks = generateTasks(TASK_COUNT);
render(taskListElement, createFormTaskEditTemplate(tasks[0]));
for (let index = 1; index < tasks.length; index++) {
  render(taskListElement, createTaskTemplate(tasks[index]));
}

render(boardElement, createLoadMoreBtnTemplate());
