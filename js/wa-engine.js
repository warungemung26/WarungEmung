window.WA_READY = false;
window.WA_QUEUE = [];

fetch("config.json")
  .then(r => r.json())
  .then(cfg => {
    window.WA_CONFIG = cfg;
    window.WA_READY = true;

    // Jalankan antrian
    window.WA_QUEUE.forEach(fn => fn());
    window.WA_QUEUE = [];
  })
  .catch(err => {
    console.error("WA config gagal dimuat", err);
  });

function buildText(template, data){
  return template.replace(/{{(.*?)}}/g, (_, k) => data[k] ?? "");
}

window.openWA = function(type, data){
  const run = () => {
    const cfg = window.WA_CONFIG;
    if(!cfg || !cfg.templates[type]) return;

    const text = buildText(cfg.templates[type], data);
    const url =
      `https://wa.me/${cfg.number}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank", "noopener");
  };

  // ⏳ tunggu config siap
  if(!window.WA_READY){
    window.WA_QUEUE.push(run);
    return;
  }

  run();
};
