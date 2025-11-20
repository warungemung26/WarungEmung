// ================= RENDER PRODUK =================
function render(data) {
  listEl.innerHTML = '';
  if (!data || data.length === 0) {
    listEl.innerHTML = '<div style="padding:12px;background:#fff;border:1px dashed #eee;border-radius:8px">Tidak ada produk</div>';
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
      ding.play().catch(()=>{}); // supaya tidak error di browser tanpa izin suara
      q = 1; qty.textContent = '1';
    });

    controlsWrapper.appendChild(controls);
    controlsWrapper.appendChild(add);
    card.appendChild(controlsWrapper);

    listEl.appendChild(card);
  });
}



let produkData = [];

fetch('data/produk.json')
  .then(response => {
    if (!response.ok) throw new Error('Gagal memuat produk');
    return response.json();
  })
  .then(data => {
    produkData = data;
    console.log('Produk berhasil dimuat:', produkData);

    // misalnya ada fungsi untuk tampilkan produk
    if (typeof tampilkanProduk === 'function') {
      tampilkanProduk(produkData);
    }
  })
  .catch(error => console.error('Error load JSON:', error));

   
let products = [];  // array kosong dulu

// load produk dari file eksternal
fetch('data/produk.json')
  .then(response => {
    if (!response.ok) throw new Error('Gagal load produk.json');
    return response.json();
  })
  .then(data => {
    products = data;
    renderProducts(products); // panggil fungsi render produk
  })
  .catch(err => console.error(err));    

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

fetch('data/produk.json')
  .then(res => res.json())
  .then(data => {
    window.products = data;
    render(data);
  });


