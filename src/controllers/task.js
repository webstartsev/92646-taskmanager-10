import FormTaskComponent from '../components/form-task.js';
import TaskComponent from '../components/task.js';
import {render, replace} from '../utils/render.js';

export class TaskController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._taskComponet = null;
    this._formTaskComponet = null;

    this._replaceEditToTask = this._replaceEditToTask.bind(this);
    this._replaceTaskToEdit = this._replaceTaskToEdit.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
    }
  }

  _replaceEditToTask() {
    replace(this._taskComponet, this._formTaskComponet);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceTaskToEdit() {
    replace(this._formTaskComponet, this._taskComponet);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }


  render(task) {
    const oldTaskComponent = this._taskComponet;
    const oldFromTaskComponent = this._formTaskComponet;

    this._taskComponet = new TaskComponent(task);
    this._formTaskComponet = new FormTaskComponent(task);

    this._taskComponet.setEditBtnClickHandler(this._replaceTaskToEdit);
    this._taskComponet.setFavoriteClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite
      }));
    });
    this._taskComponet.setArchiveClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    this._formTaskComponet.setSubmitHandler(this._replaceEditToTask);

    if (oldTaskComponent && oldFromTaskComponent) {
      replace(this._taskComponet, oldTaskComponent);
      replace(this._formTaskComponet, oldFromTaskComponent);
    } else {
      render(this._container, this._taskComponet);
    }
  }
}
