import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createBoardTemplate} from './components/board';
import {createFormTaskEditTemplate} from './components/form-task';
import {createTaskTemplate} from './components/task';
import {createLoadMoreBtnTemplate} from './components/load-more-btn';

const TASK_COUNT = 3;

const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

render(mainControlElement, createMenuTemplate());
render(mainElement, createFilterTemplate());
render(mainElement, createBoardTemplate());

const boardElement = mainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);
render(taskListElement, createFormTaskEditTemplate());

new Array(TASK_COUNT).fill(``).forEach(() => render(taskListElement, createTaskTemplate()));

render(boardElement, createLoadMoreBtnTemplate());
