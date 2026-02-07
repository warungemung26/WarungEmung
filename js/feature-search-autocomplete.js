/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const suggestionsEl = document.getElementById('search-suggestions');
  const searchBtn = document.getElementById('search-btn');

  if(!searchInput || !suggestionsEl || !products) return;

  /* ============================================================
     LONGEST SEQUENCE (huruf berurutan terpanjang)
  ============================================================ */
  function longestSequence(str, query){
    str = str.toLowerCase();
    query = query.toLowerCase();

    let maxSeq = 0;

    for (let i = 0; i < str.length; i++){
      let seq = 0;
      for (let j = 0; j < query.length; j++){
        if(str[i + j] === query[j]){
          seq++;
          if(seq > maxSeq) maxSeq = seq;
        } else break;
      }
    }
    return maxSeq;
  }

  /* ============================================================
     PREFIX SCORE
     - Awal nama → skor sangat besar (100)
     - Awal kata → skor besar (50)
  ============================================================ */
  function prefixScore(name, query){
    name = name.toLowerCase();
    query = query.toLowerCase();

    if(name.startsWith(query)) return 100;  // “Mie Sedap”
    
    // cek tiap kata
    const words = name.split(/\s+/);
    if(words.some(w => w.startsWith(query))) return 50;

    return 0;
  }

  /* ============================
        Fuzzy Match
  ============================ */
  function fuzzyMatch(str, query) {
    str = str.toLowerCase();
    query = query.toLowerCase();

    if(str.includes(query)) return true;

    const qw = query.split(/\s+/);
    const words = str.split(/\s+/);

    return qw.every(q => 
      words.some(w => w.startsWith(q.slice(0,2)))
    );
  }

  /* ==========================================
        Highlight pencarian
  ========================================== */
  function highlightMatch(name, query){
    const regex = new RegExp(`(${query.split(/\s+/).join('|')})`, 'gi');
    return name.replace(regex, '<span class="highlight">$1</span>');
  }

  /* =====================================================
        GET SUGGESTIONS + SCORING + SUPER SORTING
  ===================================================== */
  function getSuggestions(query){
  if(!query) return [];

  const q = query.toLowerCase();

  return products
    .map(p => {
      const nameText = p.name.toLowerCase();

      // === SCORING TETAP ORIGINAL (NAME ONLY) ===
      const seq = longestSequence(nameText, q);
      const pref = prefixScore(p.name, q);
      const include = nameText.includes(q) ? 1 : 0;

            // === TAG ONLY FOR PASSING (DEFENSIVE) ===
      let tagHit = false;
      const rawTags = p.tags || p.tag || '';

      if (Array.isArray(rawTags)) {
        tagHit = rawTags.join(' ').toLowerCase().includes(q);
      } else if (typeof rawTags === 'string') {
        tagHit = rawTags.toLowerCase().includes(q);
      }


      return {
        ...p,
        _nameText: nameText,
        _tagHit: tagHit,
        score_prefix: pref,
        score_seq: seq,
        score_include: include
      };
    })
    // lolos kalau NAME cocok ATAU TAG cocok
    .filter(p => fuzzyMatch(p._nameText, q) || p._tagHit)    
    .sort((a, b) => {
      if(b.score_prefix !== a.score_prefix)
        return b.score_prefix - a.score_prefix;

      if(b.score_seq !== a.score_seq)
        return b.score_seq - a.score_seq;

      if(b.score_include !== a.score_include)
        return b.score_include - a.score_include;

      return a.name.localeCompare(b.name);
    })
    .slice(0, 7);
}


  /* ==========================================
        Update UI suggestion
  ========================================== */
  function updateSuggestions(){
    const query = searchInput.value.trim();
    const matches = getSuggestions(query);

    suggestionsEl.innerHTML = '';
    if(matches.length === 0){
      suggestionsEl.style.display = 'none';
      return;
    }
    suggestionsEl.style.display = 'block';

    matches.forEach(p=>{
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="name">${highlightMatch(p.name, query)}</span>
        <span class="price">Rp ${p.price.toLocaleString()}</span>
      `;
      li.addEventListener('click', ()=>{
  searchInput.value = p.name;
  suggestionsEl.style.display = 'none';

  // tutup keyboard / fokus dulu
  searchInput.blur();

  // pakai flow asli tombol search agar scroll sama
  setTimeout(() => {
  searchBtn?.click();
}, 10);
});


      suggestionsEl.appendChild(li);
    });
  }

  searchInput.addEventListener('input', updateSuggestions);

  document.addEventListener('click', e=>{
    if(!searchInput.contains(e.target) && !suggestionsEl.contains(e.target)){
      suggestionsEl.style.display = 'none';
    }
  });

  /* ==========================================
        Jalankan search
  ========================================== */
  function runSearch(){
  const query = searchInput.value.trim();
  if(!query) return;

  applyFilters(query);
  suggestionsEl.style.display = 'none';

// tunggu render chunk mulai & nempel dulu
setTimeout(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = document.getElementById('produk-list');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}, 30);
}


  searchBtn?.addEventListener('click', runSearch);
  searchInput.addEventListener('keydown', e=>{
    if(e.key === 'Enter'){
      e.preventDefault();
      searchBtn?.click();
    }
  });
});

/* ==========================================
      Tombol ❌ Clear Search
========================================== */
const searchInput = document.getElementById('search');
const clearBtn = document.getElementById('search-clear');

searchInput.addEventListener('input', () => {
  clearBtn.style.display = searchInput.value ? 'block' : 'none';
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearBtn.style.display = 'none';
  const sug = document.getElementById('search-suggestions');
  sug.innerHTML = '';
  sug.style.display = 'none';
  searchInput.focus();
});

/* ==========================================
      NAV SEARCH RESET HANDLER
========================================== */
(function(){
  const navSearch = document.getElementById('nav-search');
  const searchInput = document.getElementById('search');
  const clearBtn = document.getElementById('search-clear');
  const suggestionsEl = document.getElementById('search-suggestions');

  if (!navSearch || !searchInput) return;

  navSearch.addEventListener('click', function(e){
    e.preventDefault();

    // reset value
    searchInput.value = '';

    // hide clear btn
    if (clearBtn) clearBtn.style.display = 'none';

    // reset suggestions
    if (suggestionsEl) {
      suggestionsEl.innerHTML = '';
      suggestionsEl.style.display = 'none';
    }

    // focus after layout settle
    requestAnimationFrame(() => {
      searchInput.focus();
    });
  });

})();
