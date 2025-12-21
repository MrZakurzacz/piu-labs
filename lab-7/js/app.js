import productsData from '../data.json' with { type: 'json' };
import '../components/productcard.js';
import { ShoppingCart } from '../cart/shoppingcart.js';

const $ = id => document.getElementById(id);
const el = {
  grid: $('productsGrid'),
  productsCount: $('productsCount'),
  cartList: $('cartList'),
  cartEmpty: $('cartEmpty'),
  cartCount: $('cartCount'),
  cartTotal: $('cartTotal'),
  clearCart: $('clearCart'),
  marketToggle: $('marketToggle'),
};

const rf = () => 1 + Math.random() * 0.06 - 0.03;
const r2 = n => Math.round(n * 100) / 100;

export function initShop() {
  let market = false, factor = 1, timer;

  const cart = new ShoppingCart({ onChange: renderCart });

  function renderProducts() {
    el.grid.replaceChildren(...productsData.map(p => {
      const price = market ? r2(p.price * factor) : p.price;
      const c = document.createElement('product-card');
      c.setAttribute('data', JSON.stringify(p));
      c.setAttribute('price', String(price));
      return c;
    }));
  }

  function renderCart() {
    cart.renderInto({
      listEl: el.cartList,
      emptyEl: el.cartEmpty,
      countEl: el.cartCount,
      totalEl: el.cartTotal,
      clearBtnEl: el.clearCart,
    });
  }

  el.productsCount.textContent = `${productsData.length} pozycji`;
  renderProducts();
  renderCart();

  el.marketToggle?.addEventListener('change', () => {
    market = el.marketToggle.checked;
    clearInterval(timer);
    factor = market ? rf() : 1;

    if (market) {
      timer = setInterval(() => {
        factor = rf();
        renderProducts();
      }, 1500);
    }

    renderProducts();
  });

  el.grid.addEventListener('add-to-cart', e => cart.add(e.detail));

  el.cartList.addEventListener('click', e => {
    const b = e.target.closest('[data-action="remove-item"]');
    if (b) cart.removeAt(b.dataset.index);
  });

  el.clearCart.addEventListener('click', () => cart.clear());
}
