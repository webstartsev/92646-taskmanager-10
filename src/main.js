import MenuComponent, {MenuItem} from './components/menu.js';
import StatisticsComponent from "./components/statistic.js";
import BoardController from './controllers/board.js';
import FilterController from "./controllers/filter.js";
import TasksModel from "./models/tasks.js";
import {generateTasks} from './mock/task.js';

import {render} from './utils/render.js';

const TASK_COUNT = 22;

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);
const menuComponent = new MenuComponent();
render(mainControlElement, menuComponent);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(mainElement, tasksModel);
filterController.render();

const boardController = new BoardController(mainElement, tasksModel);
boardController.render();

const statisticsComponent = new StatisticsComponent();
render(mainElement, statisticsComponent);

statisticsComponent.hide();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      menuComponent.setActiveMenu(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTIC:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
    default:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});
