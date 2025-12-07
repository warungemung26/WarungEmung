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
        const seq = longestSequence(p.name, q);
        const pref = prefixScore(p.name, q);
        const include = p.name.toLowerCase().includes(q) ? 1 : 0;

        return {
          ...p,
          score_prefix: pref,
          score_seq: seq,
          score_include: include
        };
      })
      .filter(p => fuzzyMatch(p.name, q))
      .sort((a, b) => {
        // 1. prefix score (paling penting)
        if(b.score_prefix !== a.score_prefix)
          return b.score_prefix - a.score_prefix;

        // 2. longest consecutive sequence
        if(b.score_seq !== a.score_seq)
          return b.score_seq - a.score_seq;

        // 3. includes
        if(b.score_include !== a.score_include)
          return b.score_include - a.score_include;

        // 4. fallback alfabet
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
    applyFilters(query);
    suggestionsEl.style.display = 'none';

    document.getElementById('produk-list')
      .scrollIntoView({behavior:'smooth', block:'start'});
  }

  searchBtn?.addEventListener('click', runSearch);
  searchInput.addEventListener('keydown', e=>{
    if(e.key === 'Enter'){
      e.preventDefault();
      runSearch();
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

///highlih thumnail
function highlightMatch(text, query) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const i = t.indexOf(q);

  if (i === -1) return text;

  return (
    text.substring(0, i) +
    "<span class='highlight'>" +
    text.substring(i, i + q.length) +
    "</span>" +
    text.substring(i + q.length)
  );
}