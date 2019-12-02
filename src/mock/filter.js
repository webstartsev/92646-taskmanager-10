import {getFullDate} from '../utils.js';

const filterNames = [
  `all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`
];

const getFilterCountItems = (title, tasks) => {
  switch (title) {
    case `overdue`:
      return tasks.filter((task) => task.dueDate instanceof Date && task.dueDate < Date.now()).length;
    case `today`:
      return tasks.filter((task) => task.dueDate instanceof Date && getFullDate(task.dueDate) === getFullDate()).length;
    case `favorites`:
      return tasks.filter((task) => task.dueDate instanceof Date && task.isFavorite).length;
    case `repeating`:
      return tasks.filter((task) => task.dueDate instanceof Date && Object.values(task.repeatingDays).some(Boolean)).length;
    case `tags`:
      return tasks.filter((task) => task.dueDate instanceof Date && Array.from(task.tags).length).length;
    case `archive`:
      return tasks.filter((task) => task.dueDate instanceof Date && task.isArchive).length;
    default:
      return tasks.length;
  }
};

const generateFilters = (tasks) => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: getFilterCountItems(it, tasks),
    };
  });
};

export {generateFilters};
