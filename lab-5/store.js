// store.js
import { randomColor, defaultState } from './helpers.js';

const KEY = 'lab5-shapes-state';

class Store {
  constructor() {
    this._listeners = [];
    this._state = this._loadState();
  }

  _loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const p = JSON.parse(raw);
      return p && Array.isArray(p.shapes)
        ? { shapes: p.shapes, lastId: typeof p.lastId === 'number' ? p.lastId : 0 }
        : defaultState();
    } catch {
      return defaultState();
    }
  }

  _saveState() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this._state));
    } catch {}
  }

  getState() {
    return this._state;
  }

  subscribe(fn) {
    this._listeners.push(fn);
    return () => (this._listeners = this._listeners.filter((x) => x !== fn));
  }

  _notify(action) {
    const s = this.getState();
    this._listeners.forEach((fn) => fn(s, action));
  }

  dispatch(action) {
    switch (action.type) {
      case 'ADD_SHAPE': {
        const id = (this._state.lastId || 0) + 1;
        const shape = {
          id,
          type: action.shapeType,
          color: action.color || randomColor(),
        };
        this._state.lastId = id;
        this._state.shapes.push(shape);
        action.shape = shape;
        break;
      }
      case 'REMOVE_SHAPE':
        this._state.shapes = this._state.shapes.filter((s) => s.id !== action.id);
        break;
      case 'RECOLOR_TYPE': {
        const ids = [];
        this._state.shapes = this._state.shapes.map((s) => {
          if (s.type === action.shapeType) {
            const color = randomColor();
            ids.push(s.id);
            return { ...s, color };
          }
          return s;
        });
        action.ids = ids;
        break;
      }
      default:
        return;
    }
    this._saveState();
    this._notify(action);
  }
}

export default new Store();
