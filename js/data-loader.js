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
   LAZY IMAGE OBSERVER (GLOBAL – WAJIB DI LUAR RENDER)
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

/* ================= RENDER PRODUK ================= */
function render(data) {
  listEl.innerHTML = '';

  if (!data || data.length === 0) {
    listEl.innerHTML =
      '<div style="padding:12px;background:#fff;border:1px dashed #eee;border-radius:8px">Memuat Produk</div>';
    return;
  }

  const CHUNK_SIZE = 24;      // aman untuk Android
  let index = 0;

  function renderChunk() {
    const fragment = document.createDocumentFragment();
    const slice = data.slice(index, index + CHUNK_SIZE);

    slice.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';

      /* ===== IMAGE (LAZY) ===== */
      const img = document.createElement('img');
      img.dataset.src = p.img;
      img.src = 'images/placeholder.png';
      img.alt = p.name;
      img.loading = 'lazy';
      card.appendChild(img);
      imgObserver.observe(img);

      /* ===== TITLE ===== */
      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = p.name;
      card.appendChild(title);

      /* ===== PRICE ===== */
      const price = document.createElement('div');
      price.className = 'price';
      price.dataset.priceRp = p.price;
      price.textContent = formatRupiah(p.price);
      card.appendChild(price);

      /* ===== QTY + ADD ===== */
      const controlsWrapper = document.createElement('div');
      controlsWrapper.className = 'controls-wrapper';

      const controls = document.createElement('div');
      controls.className = 'qty-controls';

      const minus = document.createElement('button');
      minus.type = 'button';
      minus.textContent = '-';
      minus.className = 'btn-minus';

      let q = 1;
      const qty = document.createElement('span');
      qty.textContent = q;
      qty.className = 'qty-number';

      const plus = document.createElement('button');
      plus.type = 'button';
      plus.textContent = '+';
      plus.className = 'btn-plus';

      minus.addEventListener('click', e => {
        e.stopPropagation();
        if (q > 1) { q--; qty.textContent = q; }
      });

      plus.addEventListener('click', e => {
        e.stopPropagation();
        q++; qty.textContent = q;
      });

      controls.appendChild(minus);
      controls.appendChild(qty);
      controls.appendChild(plus);

      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'add-btn';
      add.innerHTML = '<i class="fa fa-cart-plus"></i>';

      add.addEventListener('click', e => {
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
      });

      controlsWrapper.appendChild(controls);
      controlsWrapper.appendChild(add);
      card.appendChild(controlsWrapper);

      /* ===== CARD CLICK ===== */
      card.addEventListener('click', () => {
        if (p.slug) history.pushState(null, '', '?produk=' + p.slug);
        openProdukModal(p);
      });

      fragment.appendChild(card);
    });

    listEl.appendChild(fragment);
    index += CHUNK_SIZE;

    // render berikutnya (halus, tidak freeze)
    if (index < data.length) {
      requestAnimationFrame(renderChunk);
    }
  }

  renderChunk();
}

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
  document.querySelectorAll('.price, .pm-price').forEach(el => {
    const base = parseFloat(el.dataset.priceRp);
    if (isNaN(base)) return;

    if (currency === 'PI') {
      el.innerHTML = `<img src="images/pi-logo.png" class="pi-logo">
                      PI ${(base / 3200).toFixed(2)}`;
    } else {
      el.textContent = formatPrice(base, currency);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('selectedCurrency') || 'Rp';
  if (currencySelect) currencySelect.value = saved;
  updatePrices(saved);
});

if (currencySelect) {
  currencySelect.addEventListener('change', () => {
    const val = currencySelect.value;
    localStorage.setItem('selectedCurrency', val);
    updatePrices(val);
  });
}

/* ================== FETCH ================== */
let products = [];

fetch('data/produk.json')
  .then(res => {
    if (!res.ok) throw new Error('Gagal memuat produk.json');
    return res.json();
  })
  .then(data => {
    products = shuffle([...data]);
    render(products);

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
    applyFilters();
  });
}
