// tentang.js
document.addEventListener("DOMContentLoaded", () => {
  const about = document.getElementById("nav-about");
  if(!about) return;

  about.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Pakai modal global (openModal)
    if(typeof openModal === "function"){
      openModal({
        title: "Tentang Warung Emung",
        message: `Warung Emung adalah layanan belanja praktis,
hemat, dan dekat. Menyediakan berbagai kebutuhan harian
dengan harga bersahabat dan pelayanan cepat.`,
        action: function(){ /* tidak ada aksi khusus */ }
      });
    } else {
      alert("Tentang Warung Emung:\nWarung Emung menyediakan layanan ...");
    }
  });
});
