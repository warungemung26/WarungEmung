// ================= FILTER PRODUK =================
function applyFilters(){
  const q=(searchEl.value||'').trim().toLowerCase();
  let filtered=products;
  if(q){filtered=products.filter(p=>p.name.toLowerCase().includes(q));}
  else if(currentCategory){filtered=products.filter(p=>p.category===currentCategory);}
  render(filtered);
}

searchEl.addEventListener('input',applyFilters);

function setCategory(cat){
  currentCategory=cat;
  searchEl.value='';
  applyFilters();
  cartBackdropClose();
  document.getElementById('produk-list').scrollIntoView({behavior:'smooth',block:'start'});
}

searchEl.addEventListener('keydown',(e)=>{
  if(e.key==='Enter'){e.preventDefault();applyFilters();document.getElementById('produk-list').scrollIntoView({behavior:'smooth',block:'start'});}
});

const searchBtn=document.getElementById('search-btn');
if(searchBtn){
  searchBtn.addEventListener('click',()=>{
    document.querySelectorAll('.categories .cat,#cat-options .cat').forEach(el=>el.classList.remove('active'));
    applyFilters();
    document.getElementById('produk-list').scrollIntoView({behavior:'smooth',block:'start'});
  });
}