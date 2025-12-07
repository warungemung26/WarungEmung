/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

// =======================
// FILTER HARGA (MANDIRI)
// =======================

let semuaProduk = [];  // data asli dari dataload

// Fungsi ini dipanggil sekali dari dataload.js
export function setDataProduk(data) {
  semuaProduk = data;
}

// Listener dropdown
document.addEventListener("DOMContentLoaded", function(){
  const filter = document.getElementById("filter-harga");
  if(!filter) return;

  filter.addEventListener("change", function(){
    if(!semuaProduk.length) return;

    let result = [...semuaProduk];

    if(this.value === "low"){
      result.sort((a,b) => a.price - b.price);
    }
    else if(this.value === "high"){
      result.sort((a,b) => b.price - a.price);
    }

    // panggil render produk asli kamu
    if(typeof render === "function"){
      render(result);
    }
  });
});
