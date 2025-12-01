function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


// ================= RENDER PRODUK =================
function render(data) {
  listEl.innerHTML = '';
  if (!data || data.length === 0) {
    listEl.innerHTML = '<div style="padding:12px;background:#fff;border:1px dashed #eee;border-radius:8px">Memuat Produk</div>';
    return;
  }

  data.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = p.img || 'images/placeholder.png';
    img.alt = p.name;
    card.appendChild(img);

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = p.name;
    card.appendChild(title);

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = formatRupiah(p.price);
    card.appendChild(price);

// === Kontrol Qty + Tombol Add ===
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

minus.addEventListener('click', (e) => {
  e.stopPropagation();
  if (q > 1) { q--; qty.textContent = q; }
});

plus.addEventListener('click', (e) => {
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

add.addEventListener('click', (e) => {
  e.stopPropagation();
  const existing = cart.find(it => it.name === p.name);
  if (existing) { existing.qty += q; }
  else { cart.push({ name: p.name, qty: q, price: p.price }); }

  updateCartCount();
  showToast(`Ditambahkan: ${p.name} x ${q}`);

  ding.currentTime = 0;
  ding.play().catch(()=>{}); // aman untuk browser

  q = 1;
  qty.textContent = '1';
});

controlsWrapper.appendChild(controls);
controlsWrapper.appendChild(add);
card.appendChild(controlsWrapper);

// === Klik card untuk buka modal detail ===
card.addEventListener('click', () => openProdukModal(p));

listEl.appendChild(card);
});   // <==== PENUTUP forEach

}      // <==== PENUTUP fungsi render()




let produkData = [];



   



// fungsi untuk render produk ke #produk-list
function renderProducts(list) {
  const container = document.getElementById('produk-list');
  container.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="title">${p.name}</div>
      <div class="price">Rp ${p.price.toLocaleString()}</div>
    `;
    container.appendChild(card);
  });
}

// ================== SHUFFLE ==================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ================== FETCH TUNGGAL ==================
let products = [];   // dipakai untuk kategori, scroll, filter

fetch('data/produk.json')
  .then(res => {
    if (!res.ok) throw new Error('Gagal memuat produk.json');
    return res.json();
  })
  .then(data => {
    products = shuffle([...data]); // simpan versi acak sebagai "products"
render(products);
                       // tampilkan produk sekali, langsung acak
  })
  .catch(err => console.error(err));

// === FILTER DROPDOWN HARGA ===
const filterSelect = document.getElementById('filter-harga');
if(filterSelect){
  filterSelect.addEventListener('change', () => {
    applyFilters();  // hanya ini!
  });
}
