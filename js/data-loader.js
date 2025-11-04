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


