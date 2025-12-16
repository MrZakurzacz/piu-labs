import productsData from './data.json' with { type: 'json' };

export function initShop() {
  const $ = id => document.getElementById(id);
  const el = {
    grid: $('productsGrid'),
    productsCount: $('productsCount'),
    cartList: $('cartList'),
    cartEmpty: $('cartEmpty'),
    cartCount: $('cartCount'),
    cartTotal: $('cartTotal'),
    clearCart: $('clearCart'),
    marketToggle: $('marketToggle')
  };

  let cart = [];
  let marketMode = false;
  let priceFactor = 1;
  let timer;

  const rerender = () => {
    renderProducts();
    renderCart();
  };

  el.productsCount.textContent = `${productsData.length} pozycji`;
  rerender();

  el.marketToggle?.addEventListener('change', () => {
    marketMode = el.marketToggle.checked;
    clearInterval(timer);
    priceFactor = marketMode ? randomFactor() : 1;
    if (marketMode) {
      timer = setInterval(() => {
        priceFactor = randomFactor();
        rerender();
      }, 1500);
    }
    rerender();
  });

  el.grid.addEventListener('click', e => {
    const b = e.target.closest('[data-action="add-to-cart"]');
    if (!b) return;

    const p = productsData.find(p => String(p.id) === b.dataset.id);
    if (!p) return;

    b.dispatchEvent(new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: { id: p.id, name: p.name, price: +b.dataset.price }
    }));
  });

  el.grid.addEventListener('add-to-cart', e => {
    cart.push(e.detail);
    renderCart();
  });

  el.cartList.addEventListener('click', e => {
    const b = e.target.closest('[data-action="remove-item"]');
    if (!b) return;
    cart.splice(+b.dataset.index, 1);
    renderCart();
  });

  el.clearCart.addEventListener('click', () => {
    cart = [];
    renderCart();
  });

  function renderProducts() {
    el.grid.innerHTML = '';
    const f = document.createDocumentFragment();

    productsData.forEach(p => {
      const price = marketMode ? round2(p.price * priceFactor) : p.price;

      const section = (label, arr) => arr?.length
        ? `<div class="row"><span class="label">${label}</span><div class="value pills">${arr.map(v => `<span class="pill">${v}</span>`).join('')}</div></div>`
        : '';

      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="media">
          <img class="img" src="${escA(p.image)}" alt="${escA(p.name)}">
          ${p.promo ? `<div class="promo"><span class="badge">${escH(p.promo)}</span></div>` : ''}
        </div>
        <div class="body">
          <div class="top">
            <h3 class="name">${escH(p.name)}</h3>
            <div class="price">${fmt(price)}</div>
          </div>
          ${section('Ziarna', p.colors)}
          ${section('Rozmiary', p.sizes)}
          <button class="btn" data-action="add-to-cart" data-id="${p.id}" data-price="${price}">
            Do koszyka
          </button>
        </div>
      `;
      f.appendChild(card);
    });

    el.grid.appendChild(f);
  }

  function renderCart() {
    el.cartList.innerHTML = '';
    const empty = !cart.length;

    el.cartEmpty.style.display = empty ? 'block' : 'none';
    el.cartCount.textContent = empty ? 'Pusto' : `${cart.length} produktów`;
    el.clearCart.disabled = empty;
    el.cartTotal.textContent = fmt(cart.reduce((s, i) => s + i.price, 0));

    if (empty) return;

    cart.forEach((i, idx) => {
      el.cartList.insertAdjacentHTML('beforeend', `
        <li class="cartItem">
          <div class="cartMeta">
            <div class="cartName">${escH(i.name)}</div>
            <div class="cartPrice">${fmt(i.price)}</div>
          </div>
          <button class="iconBtn" data-action="remove-item" data-index="${idx}">✕</button>
        </li>
      `);
    });
  }
}

const randomFactor = () => 1 + Math.random() * 0.06 - 0.03;
const round2 = n => Math.round(n * 100) / 100;
const fmt = n => Number(n).toLocaleString('pl-PL', { minimumFractionDigits: 2 }) + ' zł';
const escH = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const escA = s => escH(s).replaceAll('"','&quot;');
