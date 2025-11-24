export const randomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)},70%,75%)`;

export const countShapes = (shapes) =>
  shapes.reduce(
    (a, s) => {
      s.type === 'square' ? a.squares++ : s.type === 'circle' && a.circles++;
      return a;
    },
    { squares: 0, circles: 0 }
  );

export const createShapeElement = (shape) => {
  const el = document.createElement('div');
  el.className = `shape ${shape.type}`;
  el.dataset.id = shape.id;
  el.style.backgroundColor = shape.color;
  return el;
};

export const defaultState = () => ({ shapes: [], lastId: 0 });
