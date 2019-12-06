import AbstractComponent from './abstract-component.js';

const createLoadMoreBtnTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoadMoreBtn extends AbstractComponent {
  getTemplate() {
    return createLoadMoreBtnTemplate();
  }
}
