import FormTaskComponent from '../components/form-task.js';
import TaskComponent from '../components/task.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {Color} from "../const.js";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  tags: [],
  color: Color.BLACK,
  isFavorite: false,
  isArchive: false,
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
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
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

  render(task, mode) {
    this._mode = mode;

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

    this._formTaskComponet.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._formTaskComponet.getData();
      this._onDataChange(this, task, data);
    });

    this._formTaskComponet.setDeleteButtonClickHandler(() => {
      this._onDataChange(this, task, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskComponent && oldFromTaskComponent) {
          replace(this._taskComponet, oldTaskComponent);
          replace(this._formTaskComponet, oldFromTaskComponent);
        } else {
          render(this._container, this._taskComponet);
        }
        break;
      case Mode.ADDING:
        if (oldFromTaskComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldFromTaskComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._formTaskComponet, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  destroy() {
    remove(this._formTaskComponet);
    remove(this._taskComponet);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
