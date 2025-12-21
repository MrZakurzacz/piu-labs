const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const fmt = n => Number(n).toLocaleString('pl-PL', { minimumFractionDigits: 2 }) + ' zł';

export class ShoppingCart {
  #items = [];
  #onChange = () => {};

  constructor({ onChange } = {}) {
    if (typeof onChange === 'function') this.#onChange = onChange;
  }

  get total() { return this.#items.reduce((s, x) => s + (+x.price || 0), 0); }

  add(x) { this.#items.push({ ...x, price: +x.price }); this.#onChange(); }
  removeAt(i) { this.#items.splice(+i, 1); this.#onChange(); }
  clear() { this.#items.length = 0; this.#onChange(); }

  renderInto({ listEl, emptyEl, countEl, totalEl, clearBtnEl }) {
    const empty = !this.#items.length;

    if (emptyEl) emptyEl.style.display = empty ? 'block' : 'none';
    if (countEl) countEl.textContent = empty ? 'Pusto' : `${this.#items.length} produktów`;
    if (clearBtnEl) clearBtnEl.disabled = empty;
    if (totalEl) totalEl.textContent = fmt(this.total);

    if (!listEl) return;
    listEl.innerHTML = empty ? '' : this.#items.map((x, idx) => `
      <li class="cartItem">
        <div class="cartMeta">
          <div class="cartName">${esc(x.name)}</div>
          <div class="cartPrice">${fmt(x.price)}</div>
        </div>
        <button class="iconBtn" data-action="remove-item" data-index="${idx}">✕</button>
      </li>
    `).join('');
  }
}
