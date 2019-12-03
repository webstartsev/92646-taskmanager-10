import {getFullDate} from '../utils.js';

const filterNames = [
  `all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`
];

const getFilterCountItems = (title, tasks) => {
  const filteredDueDateTasks = tasks.filter((task) => task.dueDate instanceof Date);
  switch (title) {
    case `overdue`:
      return filteredDueDateTasks.filter((task) => task.dueDate < Date.now()).length;
    case `today`:
      return filteredDueDateTasks.filter((task) => getFullDate(task.dueDate) === getFullDate()).length;
    case `favorites`:
      return tasks.filter((task) => task.isFavorite).length;
    case `repeating`:
      return tasks.filter((task) => Object.values(task.repeatingDays).some(Boolean)).length;
    case `tags`:
      return tasks.filter((task) => Array.from(task.tags).length).length;
    case `archive`:
      return tasks.filter((task) => task.isArchive).length;
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
