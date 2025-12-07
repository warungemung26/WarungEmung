/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

window.showToast = function(msg, options = {askFollowUp:false, playDing:false}){
  // Cek toggle suara
  if(!toastEnabled){
    // Hanya tampilkan toast visual, tanpa audio / TTS
    if(toastEl){
      toastEl.textContent = msg;
      toastEl.style.opacity = '1';
      toastEl.style.bottom = '80px';
      setTimeout(()=>{
        toastEl.style.opacity='0';
        toastEl.style.bottom='20px';
      }, 2500);
    }
    return;
  }

  // =====================================================
  // Jalankan showToast asli (TTS + ding) jika suara aktif
  // =====================================================
  const {askFollowUp, playDing} = options;
  if(toastEl){
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    toastEl.style.bottom = '80px';
  }

  if(playDing) audioDing.play().catch(()=>{});

  if('speechSynthesis' in window){
    try { speechSynthesis.cancel(); } catch(e){}
    let voices = speechSynthesis.getVoices();
    if(!voices.length){
      speechSynthesis.getVoices();
      setTimeout(()=>voices = speechSynthesis.getVoices(),100);
    }
    const voice = voices.find(v=>v.lang==='id-ID'||v.lang.startsWith('id')) || voices.find(v=>v.lang.startsWith('en')) || null;
    const utter1 = new SpeechSynthesisUtterance(msg);
    utter1.lang = 'id-ID';
    utter1.rate = 1.0; utter1.pitch = 1.0; utter1.volume = 1.0;
    if(voice) utter1.voice = voice;
    speechSynthesis.speak(utter1);

    if(askFollowUp){
      const utter2 = new SpeechSynthesisUtterance('Mau tambah yang lain?');
      utter2.lang = 'id-ID';
      utter2.rate = 1.05; utter2.pitch = 1.25; utter2.volume = 1.0;
      if(voice) utter2.voice = voice;
      setTimeout(()=>speechSynthesis.speak(utter2),400);
    }
  } else {
    const a = new Audio(fallbackSounds.success);
    a.play().catch(()=>{});
  }

  if(toastEl){
    setTimeout(()=>{
      toastEl.style.opacity='0';
      toastEl.style.bottom='20px';
    }, 2500);
  }
}
