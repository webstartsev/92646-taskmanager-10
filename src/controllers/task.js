import FormTaskComponent from '../components/form-task.js';
import TaskComponent from '../components/task.js';
import {render, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

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
    this._formTaskComponet.reset();

    replace(this._taskComponet, this._formTaskComponet);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();

    replace(this._formTaskComponet, this._taskComponet);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.EDIT;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  render(task) {
    const oldTaskComponent = this._taskComponet;
    const oldFromTaskComponent = this._formTaskComponet;

    this._taskComponet = new TaskComponent(task);
    this._formTaskComponet = new FormTaskComponent(task);

    this._taskComponet.setEditBtnClickHandler(this._replaceTaskToEdit);
    this._taskComponet.setFavoriteClickHandler(() => {
      this._onDataChange(task, Object.assign({}, task, {
        isFavorite: !task.isFavorite
      }));
    });
    this._taskComponet.setArchiveClickHandler(() => {
      this._onDataChange(task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    this._formTaskComponet.setSubmitHandler(this._replaceEditToTask);
    this._formTaskComponet.setDeleteButtonClickHandler(() => {
      this._onDataChange(task, null);
    });

    if (oldTaskComponent && oldFromTaskComponent) {
      replace(this._taskComponet, oldTaskComponent);
      replace(this._formTaskComponet, oldFromTaskComponent);
    } else {
      render(this._container, this._taskComponet);
    }
  }

  destroy() {
    remove(this._formTaskComponet);
    remove(this._taskComponet);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
