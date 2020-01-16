import MenuComponent, {MenuItem} from './components/menu.js';
import StatisticsComponent from "./components/statistic.js";
import BoardController from './controllers/board.js';
import FilterController from "./controllers/filter.js";
import TasksModel from "./models/tasks.js";
import {END_POINT, AUTHORIZATION, STORE_NAME} from "./const.js";
import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

import {render} from './utils/render.js';

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);
const menuComponent = new MenuComponent();
render(mainControlElement, menuComponent);

const tasksModel = new TasksModel();

const filterController = new FilterController(mainElement, tasksModel);
const boardController = new BoardController(mainElement, tasksModel, apiWithProvider);

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});
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

apiWithProvider.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    filterController.render();
    boardController.render();
  });


window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {

    })
    .catch(() => {

    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then(() => {
        // Действие, в случае успешной синхронизации
      })
      .catch(() => {
        // Действие, в случае ошибки синхронизации
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
