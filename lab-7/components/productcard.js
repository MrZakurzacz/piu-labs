import { loadTemplate } from '../loadTemplate.js';

const TPL = new URL('./productcard.html', import.meta.url).href;
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const escA = s => esc(s).replaceAll('"','&quot;');
const fmt = n => Number(n).toLocaleString('pl-PL', { minimumFractionDigits: 2 }) + ' zł';

export class ProductCard extends HTMLElement {
  static observedAttributes = ['data', 'price'];
  #els = {};
  #onAdd = () => {
    const p = this.p;
    if (!p) return;
    const price = +((this.getAttribute('price') ?? p.price) || 0);
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      bubbles: true, composed: true,
      detail: { id: p.id, name: p.name, price }
    }));
  };

  get p() { try { return JSON.parse(this.getAttribute('data') || ''); } catch { return null; } }

  async connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    if (!this.shadowRoot.childNodes.length) {
      const frag = await loadTemplate(TPL);
      const tpl = frag.querySelector?.('template#product-card');
      this.shadowRoot.append((tpl ? tpl.content : frag).cloneNode(true));

      const q = s => this.shadowRoot.querySelector(s);
      for (const [k, s] of Object.entries({
        img: '.img', promo: '.promo', badge: '.badge', name: '.name', price: '.price',
        cRow: '.row.colors', cPills: '.row.colors .pills',
        sRow: '.row.sizes',  sPills: '.row.sizes .pills',
        btn: '.btn'
      })) this.#els[k] = q(s);
    }

    this.#els.btn?.addEventListener('click', this.#onAdd, { passive: true });
    
    this.#render();
    
  }

  disconnectedCallback() { this.#els.btn?.removeEventListener('click', this.#onAdd); }
  attributeChangedCallback() { this.isConnected && this.#render(); }

  #pills(row, box, arr) {
    row.hidden = !arr?.length;
    if (arr?.length) box.innerHTML = arr.map(v => `<span class="pill">${esc(v)}</span>`).join('');
  }

  #render() {
    const p = this.p; if (!p) return;
    const price = +(this.getAttribute('price') ?? p.price);

    this.#els.img.src = escA(p.image || '');
    this.#els.img.alt = escA(p.name || '');
    this.#els.name.innerHTML = esc(p.name || '');
    this.#els.price.textContent = fmt(price);

    const promo = p.promo ? String(p.promo) : '';
    this.#els.promo.hidden = !promo;
    if (promo) this.#els.badge.innerHTML = esc(promo);

    this.#pills(this.#els.cRow, this.#els.cPills, p.colors);
    this.#pills(this.#els.sRow, this.#els.sPills, p.sizes);
  }
}

customElements.define('product-card', ProductCard);
