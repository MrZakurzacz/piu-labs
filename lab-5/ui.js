// ui.js
import store from './store.js';
import { countShapes, createShapeElement } from './helpers.js';

let addSquareBtn, addCircleBtn, recolorSquaresBtn, recolorCirclesBtn, cntSquaresEl, cntCirclesEl, boardEl;

const updateCounters = ({ shapes }) => {
  const { squares, circles } = countShapes(shapes);
  cntSquaresEl.textContent = squares;
  cntCirclesEl.textContent = circles;
};

const renderAllShapes = ({ shapes }) => {
  boardEl.innerHTML = '';
  shapes.forEach((s) => boardEl.appendChild(createShapeElement(s)));
};

const handleStoreChange = (state) => {
  renderAllShapes(state);
  updateCounters(state);
};

export function initUi() {
  [
    addSquareBtn,
    addCircleBtn,
    recolorSquaresBtn,
    recolorCirclesBtn,
    cntSquaresEl,
    cntCirclesEl,
    boardEl,
  ] = [
    'addSquare',
    'addCircle',
    'recolorSquares',
    'recolorCircles',
    'cntSquares',
    'cntCircles',
    'board',
  ].map((id) => document.getElementById(id));

  addSquareBtn.onclick = () =>
    store.dispatch({ type: 'ADD_SHAPE', shapeType: 'square' });
  addCircleBtn.onclick = () =>
    store.dispatch({ type: 'ADD_SHAPE', shapeType: 'circle' });
  recolorSquaresBtn.onclick = () =>
    store.dispatch({ type: 'RECOLOR_TYPE', shapeType: 'square' });
  recolorCirclesBtn.onclick = () =>
    store.dispatch({ type: 'RECOLOR_TYPE', shapeType: 'circle' });

  boardEl.addEventListener('click', (e) => {
    const el = e.target.closest?.('.shape');
    if (!el) return;
    const id = +el.dataset.id;
    if (!Number.isNaN(id)) store.dispatch({ type: 'REMOVE_SHAPE', id });
  });

  const state = store.getState();
  renderAllShapes(state);
  updateCounters(state);
  store.subscribe(handleStoreChange);
}
