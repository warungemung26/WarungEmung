// ===== SHARE PRO =====
const shareBtn = document.getElementById("pm-share")
const shareBackdrop = document.getElementById("share-backdrop")
const closeShare = document.getElementById("close-share")
const qrCanvas = document.getElementById("share-qr")

let currentShareUrl = ""
let currentShareTitle = ""

shareBtn?.addEventListener("click", () => {
  const modal = document.getElementById("product-modal")
  const title = modal.querySelector(".pm-title")?.innerText || "Produk Warung Emung"

  const urlParams = new URLSearchParams(window.location.search);
const produkParam = urlParams.get("produk") || "";
currentShareUrl = `${location.origin}${location.pathname}?produk=${encodeURIComponent(produkParam)}`;  currentShareTitle = title

  // 🔹 Native share (HP modern)
  if (navigator.share) {
    navigator.share({
      title: title,
      text: "Cek produk ini di Warung Emung",
      url: currentShareUrl
    }).catch(()=>{})
    return
  }

  openShareModal()
})

function openShareModal(){
  shareBackdrop.style.display = "flex"
  generateQR(currentShareUrl)
}

closeShare.onclick = ()=> shareBackdrop.style.display="none"

shareBackdrop.addEventListener("click", e=>{
  if(e.target===shareBackdrop) shareBackdrop.style.display="none"
})

// ===== SHARE BUTTONS =====
document.querySelectorAll("[data-share]").forEach(btn=>{
  btn.onclick = ()=>{
    const type = btn.dataset.share
    let url=""

    switch(type){
      case "wa":
        url=`https://wa.me/?text=${encodeURIComponent(currentShareTitle+" "+currentShareUrl)}`
        break
      case "fb":
        url=`https://www.facebook.com/sharer/sharer.php?u=${currentShareUrl}`
        break
      case "tg":
        url=`https://t.me/share/url?url=${currentShareUrl}&text=${currentShareTitle}`
        break
      case "tw":
        url=`https://twitter.com/intent/tweet?url=${currentShareUrl}&text=${currentShareTitle}`
        break
      case "copy":
        navigator.clipboard.writeText(currentShareUrl)
        showToast("Link disalin")
        return
    }
    window.open(url,"_blank")
  }
})

// ===== QR GENERATOR (TANPA LIB BERAT) =====
function generateQR(text){
  const qr = new QRious({
    element: qrCanvas,
    size: 180,
    value: text
  })
}
