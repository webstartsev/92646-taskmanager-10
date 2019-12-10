import AbstractComponent from './abstract-component.js';

const sortItems = [
  {
    title: `SORT BY DEFAULT`,
    type: `default`,
  },
  {
    title: `SORT BY DATE up`,
    type: `date-up`,
  },
  {
    title: `SORT BY DATE down`,
    type: `date-down`,
  }
];

const createSortMarkup = (item, currentSortType) => {
  const activeClass = (currentSortType === item.type) ? `board__filter--active` : ``;

  return (
    `<a href="#" class="board__filter ${activeClass}" data-sort-type="${item.type}">${item.title}</a>`
  );
};

const createSortTemplate = (currentSortType) => {
  const sortMarkup = sortItems.map((item) => createSortMarkup(item, currentSortType)).join(`\n`);
  return (
    `<div class="board__filter-list">
      ${sortMarkup}
    </div>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = `default`;
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  setClickSortHandler(handler) {
    const sortElements = this.getElement().querySelectorAll(`.board__filter`);
    sortElements.forEach((element) => element.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const sortType = evt.target.dataset.sortType;
      if (sortType === this._currentSortType) {
        return;
      }

      this._currentSortType = sortType;
      handler(sortType);
    }));
  }
}
