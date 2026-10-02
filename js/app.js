const CONFIG = {
  audioUrl: 'assets/music/cancion.mp3',
  lotusVideoUrl: 'assets/video/lotus.mp4',
  lyrics: [
    { time: 0, text: '...' },
    { time: 10, text: 'Que hasta dónde te quiero' },
    { time: 13, text: 'Siempre me has preguntado' },
    { time: 16, text: 'No te sé decir' },
    { time: 22, text: 'Si parece imposible' },
    { time: 24, text: 'Alcanzar una estrella' },
    { time: 27, text: 'Yo lo haría por ti' },
    { time: 32, text: 'Que hasta dónde te quiero' },
    { time: 36, text: 'Esa necia pregunta' },
    { time: 39, text: 'No responderé' },
    { time: 44, text: 'Si en mi amor no hay distancias' },
    { time: 47, text: 'Si no hay cerca, no hay lejos' },
    { time: 50, text: '¿Cómo te haré saber?' },
    { time: 56, text: 'Júzgame como un loco' },
    { time: 58, text: 'Piensa tú lo que quieras' },
    { time: 62, text: 'Yo te quiero así' },
    { time: 67, text: '¿Quieres que yo te diga' },
    { time: 70, text: 'Hasta dónde te quiero?' },
    { time: 73, text: 'Hasta donde tus ojos no ven' },
    { time: 80, text: 'No preguntes a mi alma cuánto te amo' },
    { time: 84, text: 'Porque para mi amor no hay distancias ni fronteras' },
    { time: 88, text: 'Y si quieres saber cuánto he de amarte' },
    { time: 90, text: 'Te amo más allá de tu vida, de la mía y del tiempo' },
    { time: 96, text: 'Porque es poca la eternidad para adorarte' },
    { time: 101, text: 'Si tú quieres, soy loco' },
    { time: 104, text: 'Píntame como quieras' },
    { time: 107, text: 'Siempre esclavo de ti seré' },
    { time: 113, text: '¿Quieres que yo te diga' },
    { time: 115, text: 'Hasta dónde te quiero?' },
    { time: 120, text: 'Hasta donde tus ojos no ven' },
    { time: 127, text: 'Hasta donde tus ojos no ven' },
    { time: 134, text: 'Hasta donde tus ojos no ven' }
  ]
};

const $ = (selector) => document.querySelector(selector);
const openingScreen = $('#openingScreen');
const audio = $('#audio');
const vinyl = $('#vinyl');
const playButton = $('#playButton');
const progressBar = $('#progressBar');
const currentTime = $('#currentTime');
const duration = $('#duration');
const lyricsContainer = $('#lyrics');

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function renderLyrics() {
  if (!lyricsContainer) return;
  lyricsContainer.innerHTML = CONFIG.lyrics.map((line, index) =>
    `<p class="lyric-line${index === 0 ? ' active' : ''}" data-time="${line.time}">${line.text}</p>`
  ).join('');

  lyricsContainer.querySelectorAll('.lyric-line').forEach((line) => {
    line.addEventListener('click', () => {
      if (audio) audio.currentTime = Number(line.dataset.time);
    });
  });
}

let lastActiveIndex = -1;

function setActiveLyric() {
  if (!lyricsContainer || !audio) return;
  const lines = [...lyricsContainer.querySelectorAll('.lyric-line')];
  let activeIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    if (audio.currentTime >= Number(lines[i].dataset.time)) {
      activeIndex = i;
    } else {
      break;
    }
  }

  if (activeIndex !== lastActiveIndex) {
    lastActiveIndex = activeIndex;
    lines.forEach((line, index) => line.classList.toggle('active', index === activeIndex));

    const activeLine = lines[activeIndex];
    if (activeLine) {
      const containerHeight = lyricsContainer.clientHeight;
      const lineTop = activeLine.getBoundingClientRect().top
        - lyricsContainer.getBoundingClientRect().top
        + lyricsContainer.scrollTop;
      const lineHeight = activeLine.clientHeight;
      const maxScroll = lyricsContainer.scrollHeight - containerHeight;
      const targetScroll = lineTop - (containerHeight / 2) + (lineHeight / 2);

      lyricsContainer.scrollTo({
        top: Math.max(0, Math.min(targetScroll, maxScroll)),
        behavior: 'smooth'
      });
    }
  }
}

function togglePlayback() {
  if (!audio) return;
  if (!CONFIG.audioUrl) {
    return;
  }
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

if (playButton) playButton.addEventListener('click', togglePlayback);

if (audio) {
  audio.addEventListener('play', () => { 
    if (vinyl) vinyl.classList.add('playing'); 
    if (playButton) playButton.textContent = 'Ⅱ'; 
  });
  audio.addEventListener('pause', () => { 
    if (vinyl) vinyl.classList.remove('playing'); 
    if (playButton) playButton.textContent = '▶'; 
  });
  audio.addEventListener('loadedmetadata', () => { 
    if (duration) duration.textContent = formatTime(audio.duration); 
  });
  audio.addEventListener('timeupdate', () => {
    if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
    if (progressBar) progressBar.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    setActiveLyric();
  });
  
  if (CONFIG.audioUrl) audio.src = CONFIG.audioUrl;
}

if (progressBar) {
  progressBar.addEventListener('input', () => {
    if (audio && audio.duration) audio.currentTime = (Number(progressBar.value) / 100) * audio.duration;
  });
}

renderLyrics();

const lotusScene = $('#lotusScene');
const startBtn = $('#startButton');

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (lotusScene) {
      lotusScene.classList.remove('is-hidden');
      lotusScene.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    togglePlayback();

    const video = $('#lotusVideo');
    if (video) {
      video.src = CONFIG.lotusVideoUrl;
      video.load();
      video.play().catch(() => {});
    }
    createPetals();
  });
}

function createPetals() {
  const layer = $('#petalLayer');
  if (!layer || layer.dataset.created) return;
  layer.dataset.created = 'true';
  for (let i = 0; i < 16; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * -18}s`;
    layer.appendChild(petal);
  }
}

const viewer = $('#drawingViewer');
function openDrawing() {
  if (!viewer) return;
  viewer.classList.remove('is-hidden');
}

document.querySelectorAll('[data-drawing]').forEach((button) => {
  button.addEventListener('click', openDrawing);
});

const closeBtn = $('#closeDrawing');
if (closeBtn && viewer) {
  closeBtn.addEventListener('click', () => viewer.classList.add('is-hidden'));
  viewer.addEventListener('click', (event) => { 
    if (event.target === viewer) viewer.classList.add('is-hidden'); 
  });
}

const finalBtn = $('#finalButton');
const finalMsg = $('#finalMessage');

if (finalBtn && finalMsg) {
  finalBtn.addEventListener('click', () => {
    finalMsg.classList.remove('is-hidden');
    finalBtn.textContent = '♡ Siempre tú';
  });
}

if (openingScreen) {
  window.setTimeout(() => {
    openingScreen.classList.add('is-finished');
    window.setTimeout(() => openingScreen.remove(), 900);
  }, 2800);
}