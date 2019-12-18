import MenuComponent from './components/menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import TasksModel from "./models/tasks.js";
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render} from './utils/render.js';

const TASK_COUNT = 22;

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);
const menuComponent = new MenuComponent();
render(mainControlElement, menuComponent);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);
const filterComponent = new FilterComponent(filters);
render(mainElement, filterComponent);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();
