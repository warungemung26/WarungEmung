// ================= CART Modal =================
openCartBtn.addEventListener('click',()=>{
  if(cart.length===0){alert('Keranjang kosong');return;}
  renderCartModal();
  cartModal.classList.toggle('open');
  cartModal.setAttribute('aria-hidden',cartModal.classList.contains('open')?'false':'true');
});

function renderCartModal(){
  cartItemsEl.innerHTML='';
  let total=0;
  cart.forEach((it,idx)=>{
    const row=document.createElement('div');row.className='item';
    row.innerHTML=`<div>${it.name} x ${it.qty}</div><div>${formatRupiah(it.price*it.qty)}</div>`;
    cartItemsEl.appendChild(row);
    total+=it.price*it.qty;
  });
  cartTotalEl.textContent='Total: '+formatRupiah(total);
}

waCartBtn.addEventListener('click',()=>{
  if(cart.length===0){alert('Keranjang kosong');return;}
  showToast('Membuka WhatsApp...');
  let lines=cart.map(it=>`${it.qty} x ${it.name} = ${formatRupiah(it.price*it.qty)}`);
  const total=cart.reduce((s,i)=>s+i.qty*i.price,0);
  lines.push('\nTotal: '+formatRupiah(total));
  const message=`Halo Warung Emung, saya pesan:\n`+lines.join('\n');
  window.open('https://wa.me/6285322882512?text='+encodeURIComponent(message),'_blank');
});

clearCartBtn.addEventListener('click',()=>{
  if(!confirm('Kosongkan keranjang?'))return;
  cart=[];
  updateCartCount();
  renderCartModal();
  cartModal.classList.remove('open');
  cartModal.setAttribute('aria-hidden','true');
});

// ================= INIT =================
cartBackdropClose();
updateCartCount();
render(products);

// ================= CATEGORY MODAL =================
function cartBackdropClose(){
  catBackdrop.style.display='none';
  catModal.classList.remove('open');
  catModal.setAttribute('aria-hidden','true');
}
function cartBackdropOpen(){
  catBackdrop.style.display='flex';
  requestAnimationFrame(()=>{
    catModal.classList.add('open');
    catModal.setAttribute('aria-hidden','false');
  });
}

catFloat.addEventListener('click',(e)=>{e.stopPropagation();cartBackdropOpen();});
closeCatBtn.addEventListener('click',(e)=>{e.stopPropagation();cartBackdropClose();});
catBackdrop.addEventListener('click',(e)=>{if(e.target===catBackdrop)cartBackdropClose();});

catOptions.querySelectorAll('.cat').forEach(el=>{
  el.addEventListener('click',()=>{
    const cat=el.getAttribute('data-cat');
    setCategory(cat);
    cartBackdropClose();
  });
});

