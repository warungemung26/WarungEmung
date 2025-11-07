// ================= AUDIO & SUARA =================
const audioDing = new Audio('sounds/ding.mp3');
audioDing.preload = 'auto';

const fallbackSounds = {
  success: 'sounds/pelayan_default.mp3'
};

function pickIndoVoice(){
  const voices = speechSynthesis.getVoices();
  return voices.find(v=>v.lang==='id-ID'||v.lang.startsWith('id')) || voices.find(v=>v.lang.startsWith('en')) || null;
}

function stopSpeaking(){
  try { speechSynthesis.cancel(); } catch(e){}
}

// ================= TOAST DENGAN SUARA =================
function showToast(msg, options = {askFollowUp:false, playDing:false}){
  const {askFollowUp, playDing} = options;
  toastEl.textContent = msg;
  toastEl.style.opacity = '1';
  toastEl.style.bottom = '80px';

  // efek ding
  if(playDing) audioDing.play().catch(()=>{});

  // TTS
  if('speechSynthesis' in window){
    stopSpeaking();
    let voices = speechSynthesis.getVoices();
    if(!voices.length){
      speechSynthesis.getVoices();
      setTimeout(()=>voices = speechSynthesis.getVoices(),100);
    }

    const voice = pickIndoVoice();
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

  // auto hide
  setTimeout(()=>{
    toastEl.style.opacity='0';
    toastEl.style.bottom='20px';
  }, 2500);
}