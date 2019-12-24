import FilterComponent from '../components/filter.js';
import {FilterType} from '../const.js';
import {render, replace} from '../utils/render.js';
import {generateFilters} from "../mock/filter.js";

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._activeFilterType = FilterType.ALL;

    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._tasksModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldComponent = this._filterComponent;

    const tasks = this._tasksModel.getAllTasks();
    const filters = generateFilters(tasks, this._activeFilterType);
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent);
    }
  }

  _onFilterChange(filterName) {
    this._tasksModel.setFilter(filterName);
    this._activeFilterType = filterName;
  }

  _onDataChange() {
    this.render();
  }
}
