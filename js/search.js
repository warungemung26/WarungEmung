/* ============================================================
   TOAST NOTIF
============================================================ */
function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.style.opacity = "1";
  setTimeout(()=>{ t.style.opacity = "0"; }, 1500);
}

/* ============================================================
   FILTER PRODUK + ACak + SCORING
============================================================ */
function applyFilters(){
  const q = (searchEl.value || '').trim().toLowerCase();

  let filtered = products;



  // ============================
  // MODE SEARCH
  // ============================
  if(q){
    const norm = q.toLowerCase().trim();
    const normClean = norm.replace(/\s+/g, "").replace(/(.)\1+/g, "$1");
    const normWords = norm.split(/\s+/).map(w => w.toLowerCase());

    // === SCORING ===
    function getScore(p){
      const name = p.name.toLowerCase();
      const clean = name.replace(/\s+/g, "").replace(/(.)\1+/g, "$1");
      let score = 0;

      if(name.startsWith(norm)) score += 100;
      const firstWord = name.split(/\s+/)[0];
      if(firstWord.startsWith(norm)) score += 80;
      if(name.includes(norm)) score += 60;
      if(clean.includes(normClean)) score += 40;

      for(const w of normWords){
        if(w.length>1 && clean.includes(w.replace(/(.)\1+/g,"$1"))){
          score += 30;
          break;
        }
      }

      let diff = 0;
      for(let i=0;i<Math.min(clean.length,normClean.length);i++){
        if(clean[i] !== normClean[i]) diff++;
        if(diff>2) break;
      }
      if(diff <= 2) score += 20;

      return score;
    }

    // === FILTER + SCORE ===
    filtered = products
      .map(p=>({...p, score:getScore(p)}))
      .filter(p=>{
        const name = p.name.toLowerCase();
        const seq = norm.length>=2 ? norm.slice(0,2) : norm;
        if(seq.length>=2 && !name.includes(seq)) return false;
        return p.score>0;
      });

    // === jika kosong, jangan biarkan kosong ===
    if(filtered.length === 0){
      filtered = products.map(p=>({...p, score:1}));
    }

    filtered.sort((a,b)=>b.score - a.score);
    filtered = filtered.map(p=>{
      delete p.score;
      return p;
    });

  }


  // ============================
// MODE KATEGORI
// ============================
else if(currentCategory){
  filtered = products.filter(p => p.category === currentCategory);
}


// ======================================================
//   FILTER HARGA (SETELAH KATEGORI / SEARCH TERAPLIKASI)
// ======================================================

const filterSelect = document.getElementById('filter-harga');
if(filterSelect && filterSelect.value){
  
  if(filterSelect.value === 'low'){
    filtered = [...filtered].sort((a,b) => a.price - b.price);
  }
  else if(filterSelect.value === 'high'){
    filtered = [...filtered].sort((a,b) => b.price - a.price);
  }
  // default "" = tidak apa-apa, biarkan acak biasa
}


  // ============================
  // RENDER + ACAK SETIAP TAMPIL
  // ============================
  // jika sedang filter harga → jangan acak
if (filterSelect && filterSelect.value) {
  render([...filtered]); 
} else {
  render(shuffle([...filtered])); // acak hanya kalau tidak sorting harga
}


  return filtered; // penting untuk runSearch()
}

/* ============================================================
   SET CATEGORY
============================================================ */
function setCategory(cat){
  currentCategory = cat;
  searchEl.value = "";
  
  catOptions.querySelectorAll('.cat').forEach(el => {
  el.addEventListener('click', () => {
    const cat = el.getAttribute('data-cat');
    currentCategory = cat;  // <── tambahkan ini
    searchEl.value = "";
    applyFilters();
    closeCatModal();
  });
});


  // === RESET FILTER HARGA DI SINI ===
  const filterSelect = document.getElementById('filter-harga');
  if(filterSelect){
    filterSelect.value = "";   // kembali ke default
  }

  applyFilters();

  // tutup modal/cart jika terbuka
  cartBackdropClose?.();
  closeRegisterModal?.();

  document.getElementById('produk-list')
    .scrollIntoView({behavior:'smooth', block:'start'});
}


/* ============================================================
   SEARCH BUTTON + ENTER
============================================================ */
searchEl.addEventListener('keydown',(e)=>{
  if(e.key === 'Enter'){
    e.preventDefault();
    runSearch();
  }
});

const searchBtn = document.getElementById('search-btn');
if(searchBtn){
  searchBtn.addEventListener('click',()=>{
    document.querySelectorAll('.categories .cat,#cat-options .cat')
      .forEach(el=>el.classList.remove('active'));

    runSearch();
  });
}

/* ============================================================
   RUN SEARCH (AMAN, TIDAK HANG, ADA TOAST)
============================================================ */
function runSearch(){
  const q = searchEl.value.trim();  

  // jika user paksa search saat suggestion kosong  TIDAK MACET
  const s = getSuggestions(q);
  if(s.length === 0){
    showToast("Produk tidak ditemukan");
    return;
  }

  const final = applyFilters(q);

  if(!final || final.length === 0){
    showToast("Produk tidak ditemukan");
    return;
  }

  // tutup modal/cart saat search
  cartBackdropClose?.();
  closeRegisterModal?.();

  document.getElementById('produk-list')
    .scrollIntoView({behavior:'smooth', block:'start'});
}

