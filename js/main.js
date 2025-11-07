// ================= SCRIPT PRODUK & KERANJANG (toast suara + tampilan lama) =================

// --- ELEMENTS ---
const listEl = document.getElementById('produk-list');
const searchEl = document.getElementById('search');
const cartCountEl = document.getElementById('cart-count');
const openCartBtn = document.getElementById('open-cart');
const cartModal = document.getElementById('cart-modal');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const waCartBtn = document.getElementById('wa-cart');
const clearCartBtn = document.getElementById('clear-cart');
const catFloat = document.getElementById('cat-float');
const catBackdrop = document.getElementById('cat-modal-backdrop');
const catModal = document.getElementById('cat-modal');
const closeCatBtn = document.getElementById('close-cat');
const catOptions = document.getElementById('cat-options');
const toastEl = document.getElementById('toast');

let currentCategory = '';
let cart = [];

// ================= HELPERS =================
function formatRupiah(n){ return 'Rp ' + Number(n).toLocaleString('id-ID'); }
function updateCartCount(){
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  cartCountEl.textContent = totalQty;
  cartCountEl.style.display = totalQty>0? 'flex' : 'none';
}

// ================= RENDER PRODUK (TAMPILAN LAMA) =================
function render(data){
  listEl.innerHTML = '';
  if(!data || data.length===0){
    listEl.innerHTML = '<div style="padding:12px;background:#fff;border:1px dashed #eee;border-radius:8px">Tidak ada produk</div>';
    return;
  }

  data.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    const img = document.createElement('img'); img.src = p.img || 'images/placeholder.png'; img.alt = p.name; card.appendChild(img);
    const title = document.createElement('div'); title.className='title'; title.textContent = p.name; card.appendChild(title);
    const price = document.createElement('div'); price.className='price'; price.textContent = formatRupiah(p.price); card.appendChild(price);

    // qty controls
    const controls = document.createElement('div'); controls.className='qty-controls';
    const minus = document.createElement('button'); minus.type='button'; minus.textContent='-';
    const qty = document.createElement('span'); let q = 1; qty.textContent = q;
    const plus = document.createElement('button'); plus.type='button'; plus.textContent='+';
    minus.addEventListener('click',(e)=>{e.stopPropagation();if(q>1){q--;qty.textContent=q;}});
    plus.addEventListener('click',(e)=>{e.stopPropagation();q++;qty.textContent=q;});
    controls.appendChild(minus); controls.appendChild(qty); controls.appendChild(plus); card.appendChild(controls);

    // add button
    const add = document.createElement('button'); add.type='button'; add.className='add-btn'; add.textContent='+ ke Keranjang ';
    add.addEventListener('click',(e)=>{
      e.stopPropagation();
      const existing = cart.find(it=>it.name===p.name);
      if(existing){existing.qty+=q;} else {cart.push({name:p.name,qty:q,price:p.price});}
      updateCartCount();
      showToast(`Ditambahkan: ${p.name} x ${q}`, {askFollowUp:true, playDing:true});
      q=1; qty.textContent='1';
    });
    card.appendChild(add);

    // wa button
    const wa = document.createElement('a'); wa.className='wa-btn'; wa.textContent='Pesan Sekarang'; wa.href='#';
    wa.addEventListener('click',(e)=>{
      e.stopPropagation();
      showToast('Membuka WhatsApp...', {playDing:false});
      const message=`Halo Warung Emung, saya pesan ${q} ${p.name} (estimasi ${formatRupiah(p.price*q)})`;
      window.open('https://wa.me/6285322882512?text='+encodeURIComponent(message),'_blank');
    });
    card.appendChild(wa);

    listEl.appendChild(card);
  });
}



