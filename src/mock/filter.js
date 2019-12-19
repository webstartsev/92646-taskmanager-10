import {getTasksByFilter} from "../utils/filters.js";
import {FilterType} from '../const.js';

const generateFilters = (tasks, activeFilterType) => {
  return Object.values(FilterType).map((filterType) => {
    return {
      name: filterType,
      count: getTasksByFilter(tasks, filterType).length,
      isChecked: filterType === activeFilterType,
    };
  });
};

export {generateFilters};
