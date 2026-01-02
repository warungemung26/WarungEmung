/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

function getProdukSlug(){
  return new URLSearchParams(window.location.search).get('produk');
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* =========================================================
   GLOBAL STATE
========================================================= */
let isAllMode = false;
let allIndex = 0;
const ALL_CHUNK = 24;
let currentCurrency = 'Rp';

/* =========================================================
   LAZY IMAGE OBSERVER
========================================================= */
const imgObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imgObserver.unobserve(img);
    }
  });
}, { rootMargin: '200px' });

/* =========================================================
   FORMAT PRICE BY CURRENCY (SINGLE SOURCE)
========================================================= */
function renderPrice(el, priceRp){
  el.dataset.priceRp = priceRp;

  if (currentCurrency === 'PI') {
    el.innerHTML = `<img src="images/pi-logo.png" class="pi-logo">
                    PI ${(priceRp / 3200).toFixed(2)}`;
  } else {
    el.textContent = formatPrice(priceRp, currentCurrency);
  }
}

/* =========================================================
   CREATE CARD (REUSABLE)
========================================================= */
function createCard(p){
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  img.dataset.src = p.img;
  img.src = 'images/placeholder.png';
  img.alt = p.name;
  img.loading = 'lazy';
  card.appendChild(img);
  imgObserver.observe(img);

  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = p.name;
  card.appendChild(title);

  const price = document.createElement('div');
  price.className = 'price';
  renderPrice(price, p.price);
  card.appendChild(price);

  const controlsWrapper = document.createElement('div');
  controlsWrapper.className = 'controls-wrapper';

  const controls = document.createElement('div');
  controls.className = 'qty-controls';

  let q = 1;
  const qty = document.createElement('span');
  qty.className = 'qty-number';
  qty.textContent = q;

  const minus = document.createElement('button');
  minus.className = 'btn-minus';
  minus.textContent = '-';
  minus.onclick = e => {
    e.stopPropagation();
    if (q > 1) qty.textContent = --q;
  };

  const plus = document.createElement('button');
  plus.className = 'btn-plus';
  plus.textContent = '+';
  plus.onclick = e => {
    e.stopPropagation();
    qty.textContent = ++q;
  };

  controls.append(minus, qty, plus);

  const add = document.createElement('button');
  add.className = 'add-btn';
  add.innerHTML = '<i class="fa fa-cart-plus"></i>';
  add.onclick = e => {
    e.stopPropagation();
    const existing = cart.find(it => it.name === p.name);
    if (existing) existing.qty += q;
    else cart.push({ name: p.name, qty: q, price: p.price });
    updateCartCount();
    showToast(`Ditambahkan: ${p.name} x ${q}`);
    ding.currentTime = 0;
    ding.play().catch(()=>{});
    q = 1;
    qty.textContent = '1';
  };

  controlsWrapper.append(controls, add);
  card.appendChild(controlsWrapper);

  card.onclick = () => {
    if (p.slug) history.pushState(null, '', '?produk=' + p.slug);
    openProdukModal(p);
  };

  return card;
}

/* =========================================================
   RENDER NORMAL
========================================================= */
function render(data) {
  isAllMode = false;
  listEl.innerHTML = '';

  if (!data || data.length === 0) {
    listEl.innerHTML =
      '<div style="padding:12px;background:#fff;border:1px dashed #eee;border-radius:8px">Memuat Produk</div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  data.forEach(p => fragment.appendChild(createCard(p)));
  listEl.appendChild(fragment);
}

/* =========================================================
   RENDER ALL (INFINITE)
========================================================= */
function renderAll(reset = false){
  if (reset) {
    listEl.innerHTML = '';
    allIndex = 0;
    isAllMode = true;
  }

  const slice = products.slice(allIndex, allIndex + ALL_CHUNK);
  if (slice.length === 0) return;

  const fragment = document.createDocumentFragment();
  slice.forEach(p => fragment.appendChild(createCard(p)));
  listEl.appendChild(fragment);

  allIndex += ALL_CHUNK;
}

/* =========================================================
   SCROLL LISTENER
========================================================= */
window.addEventListener('scroll', () => {
  if (!isAllMode) return;

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    renderAll();
  }
});

/* ================== MATA UANG ================== */
const currencySelect = document.getElementById('currency-select');

function formatPrice(price, currency){
  switch(currency){
    case 'Rp': return 'Rp ' + Number(price).toLocaleString('id-ID');
    case '$': return '$ ' + (price / 15000).toFixed(2);
    case 'PI': return 'PI ' + (price / 1000).toFixed(2);
    default: return price;
  }
}

function updatePrices(currency){
  currentCurrency = currency;
  document.querySelectorAll('.price, .pm-price').forEach(el => {
    const base = parseFloat(el.dataset.priceRp);
    if (!isNaN(base)) renderPrice(el, base);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  currentCurrency = localStorage.getItem('selectedCurrency') || 'Rp';
  if (currencySelect) currencySelect.value = currentCurrency;
  updatePrices(currentCurrency);
});

if (currencySelect) {
  currencySelect.addEventListener('change', () => {
    currentCurrency = currencySelect.value;
    localStorage.setItem('selectedCurrency', currentCurrency);
    updatePrices(currentCurrency);
  });
}

/* ================== FETCH ================== */
let products = [];

fetch('data/produk.json')
  .then(res => res.json())
  .then(data => {
    products = shuffle([...data]);
    renderAll(true);

    const slug = getProdukSlug();
    if (slug) {
      const p = products.find(x => x.slug === slug);
      if (p) openProdukModal(p);
    }
  })
  .catch(err => console.error(err));

/* ================== FILTER ================== */
const filterSelect = document.getElementById('filter-harga');
if (filterSelect) {
  filterSelect.addEventListener('change', () => {
    isAllMode = false;
    applyFilters();
  });
}