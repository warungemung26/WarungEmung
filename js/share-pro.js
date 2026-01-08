// ===== SHARE PRO (EDITED) =====
const shareBtn = document.getElementById("pm-share")
const shareBackdrop = document.getElementById("share-backdrop")
const closeShare = document.getElementById("close-share")
const qrCanvas = document.getElementById("share-qr")

let currentProduct = null

//  dipanggil saat modal produk dibuka
// pastikan ini dipanggil dari produk-modal.js
window.setShareProduct = function(p){
  currentProduct = p
}

shareBtn?.addEventListener("click", () => {
  if(!currentProduct) return

  const slug = currentProduct.slug || currentProduct.id
  const hargaFinal = currentProduct.price_flash || currentProduct.price
const currency = localStorage.getItem("selectedCurrency") || "Rp"

const hargaText = currency === "PI"
  ? `PI ${(hargaFinal / 3200).toFixed(2)}`
  : formatPrice(hargaFinal, currency)
  const productLink =
    `${location.origin}${location.pathname}?produk=${encodeURIComponent(slug)}`

  // ===== TEMPLATE WA PREMIUM (PUNYAMU) =====
  const text =
` *${currentProduct.name}*  
 Harga: ${hargaText}  

 Cek produk:
${productLink}
-----------------------
 Dapatkan sekarang di *Warung Emung*!`

  //  Native Share (mobile)
  if(navigator.share){
    navigator.share({
  title: currentProduct.name,
  text
}).catch(()=>{})
    return
  }

  openShareModal(productLink)
})

// ===== SHARE MODAL =====
function openShareModal(productLink){
  shareBackdrop.style.display = "flex"
  generateQR(productLink)
}

closeShare?.addEventListener("click", () => {
  shareBackdrop.style.display = "none"
})

shareBackdrop?.addEventListener("click", e => {
  if(e.target === shareBackdrop){
    shareBackdrop.style.display = "none"
  }
})

// ===== BUTTONS =====
document.querySelectorAll("[data-share]").forEach(btn => {
  btn.onclick = () => {
    if(!currentProduct) return

    const slug = currentProduct.slug || currentProduct.id
    const hargaFinal = currentProduct.price_flash || currentProduct.price
const currency = localStorage.getItem("selectedCurrency") || "Rp"

const hargaText = currency === "PI"
  ? `PI ${(hargaFinal / 3200).toFixed(2)}`
  : formatPrice(hargaFinal, currency)
    const productLink =
      `${location.origin}${location.pathname}?produk=${encodeURIComponent(slug)}`

    const text =
` *${currentProduct.name}*  
 Harga: ${hargaText}  

 Cek produk:
${productLink}
-----------------------
 Dapatkan sekarang di *Warung Emung*!`

    let url = ""

    switch(btn.dataset.share){
      case "wa":
        url = `https://wa.me/?text=${encodeURIComponent(text)}`
        break
      case "fb":
        url = `https://www.facebook.com/sharer/sharer.php?u=${productLink}`
        break
      case "tg":
        url = `https://t.me/share/url?url=${productLink}&text=${currentProduct.name}`
        break
      case "tw":
        url = `https://twitter.com/intent/tweet?url=${productLink}&text=${currentProduct.name}`
        break
      case "copy":
        navigator.clipboard.writeText(productLink)
        showToast("Link disalin")
        return
    }

    window.open(url, "_blank")
  }
})

// ===== QR =====
function generateQR(text){
  if(!window.QRious) return
  new QRious({
    element: qrCanvas,
    size: 180,
    value: text
  })
}
