import AbstractComponent from './abstract-component.js';

const createBoardTemplate = () => {
  return (
    `<section class="board container">
      <div class="board__tasks"></div>
    </div>`
  );
};

export default class Board extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}
