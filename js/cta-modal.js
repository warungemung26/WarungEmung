/*!
 * CTA Modal Utility
 * Warung Emung
 */

(function () {
  const modal = document.getElementById("modal-confirm");
  if (!modal) {
    console.warn("modal-confirm tidak ditemukan");
    return;
  }

  const titleEl   = modal.querySelector("#modal-title");
  const bodyEl    = modal.querySelector("#modal-body");
  const btnOk     = modal.querySelector("#modal-ok");
  const btnCancel = modal.querySelector("#modal-cancel");

  let okHandler = null;

  function closeModal() {
    modal.classList.remove("show");
    okHandler = null;
  }

  /**
   * openModal({
   *  title: string,
   *  message: string | HTML,
   *  okText: string,
   *  showCancel: boolean,
   *  action: function
   * })
   */
  window.openModal = function (opts = {}) {
    titleEl.textContent = opts.title || "Konfirmasi";

    // body (text / html)
    bodyEl.innerHTML = "";
    if (opts.message) {
      if (typeof opts.message === "string") {
        bodyEl.textContent = opts.message;
      } else {
        bodyEl.appendChild(opts.message);
      }
    }

    // tombol OK
    btnOk.textContent = opts.okText || "OK";

    // tombol batal (optional)
    if (opts.showCancel === false) {
      btnCancel.style.display = "none";
    } else {
      btnCancel.style.display = "inline-block";
    }

    okHandler = typeof opts.action === "function" ? opts.action : null;

    modal.classList.add("show");
  };

  // ===== EVENTS =====
  btnCancel.addEventListener("click", closeModal);

  btnOk.addEventListener("click", () => {
    if (okHandler) okHandler();
    closeModal();
  });

})();
