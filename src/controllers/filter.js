import FilterComponent from '../components/filter.js';
import {generateFilters} from '../mock/filter.js';
import {render} from '../utils/render.js';

export default class Filter {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._filterComponent = null;
  }

  render() {
    const tasks = this._tasksModel.getTasks();
    const filters = generateFilters(tasks);
    this._filterComponent = new FilterComponent(filters);
    render(this._container, this._filterComponent);
  }
}
