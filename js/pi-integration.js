document.addEventListener("DOMContentLoaded", () => {
  const btnPiLogin = document.getElementById("btn-pi-login");
  const piUsernameEl = document.getElementById("pi-username");

  // Buat elemen img logo Pi
  let piLogoImg = document.createElement("img");
  piLogoImg.src = "images/pi-logo.png"; // pastikan path sesuai
  piLogoImg.alt = "Pi Logo";
  piLogoImg.style.height = "18px";
  piLogoImg.style.width = "18px";
  piLogoImg.style.marginRight = "5px";
  piLogoImg.style.verticalAlign = "middle";
  piLogoImg.style.display = "none"; // sembunyi dulu, tampil setelah login
  piUsernameEl.prepend(piLogoImg);

  if (btnPiLogin && window.Pi) {
    btnPiLogin.addEventListener("click", async () => {
      try {
        const user = await Pi.authenticate();
        // tampilkan username
        piUsernameEl.innerText = user.username || "User Pi";
        // prepend logo lagi setelah innerText
        piUsernameEl.prepend(piLogoImg);
        piLogoImg.style.display = "inline-block";
        // simpan user di localStorage
        localStorage.setItem("piUser", JSON.stringify(user));
      } catch (err) {
        console.error("Login Pi gagal:", err);
        alert("Login Pi gagal. Pastikan menggunakan Pi Browser atau coba lagi.");
      }
    });
  }
});
