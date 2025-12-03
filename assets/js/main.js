// Minimal deck manager: lazy-load pages, keyboard nav, dot nav, hash sync
const deck = document.getElementById('deck');
const pages = Array.from(deck.querySelectorAll('.page'));
const dotNav = document.getElementById('dotNav');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let lockKeysMs = 350;
let lastKeyTs = 0;

// Build dot nav
pages.forEach((_, i) => {
  const b = document.createElement('button');
  b.title = `Go to page ${i+1}`;
  b.addEventListener('click', () => goTo(i));
  dotNav.appendChild(b);
});
function updateDots(idx){
  Array.from(dotNav.children).forEach((b,i) => b.setAttribute('aria-current', i===idx ? 'true' : 'false'));
}

// Helpers
function goTo(i){
  i = Math.max(0, Math.min(pages.length-1, i));
  pages[i].scrollIntoView({behavior:'smooth', block:'start'});
}
function next(){ goTo(currentIndex+1) }
function prev(){ goTo(currentIndex-1) }

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);

window.addEventListener('keydown', e => {
  const now = performance.now();
  if(now - lastKeyTs < lockKeysMs) return;
  if(['ArrowDown','PageDown',' '].includes(e.key)){ e.preventDefault(); next(); lastKeyTs = now; }
  else if(['ArrowUp','PageUp'].includes(e.key)){ e.preventDefault(); prev(); lastKeyTs = now; }
});

// Lazy loader (slide: fetch HTML; d3: inject iframe)
async function ensureLoaded(sec){
  if(sec.dataset.loaded) return;
  const type = sec.dataset.type;
  const src  = sec.dataset.src;
  try{
    if(type === 'slide'){
      const html = await (await fetch(src, {cache:'no-store'})).text();
      sec.innerHTML = `<div class="card slide">${html}</div>`;
    }else if(type === 'd3'){
      const wrap = document.createElement('div');
      wrap.className = 'iframe-wrap card';
      const iframe = document.createElement('iframe');
      iframe.loading = 'lazy';
      iframe.src = src;
      wrap.appendChild(iframe);
      sec.innerHTML = '';
      sec.appendChild(wrap);
    }
    sec.dataset.loaded = 'true';
  }catch(err){
    console.error('Failed to load section', src, err);
    sec.innerHTML = `<div class="card"><p style="color:#ff9aa2">Failed to load: ${src}</p></div>`;
    sec.dataset.loaded = 'true';
  }
}

// Intersection observer: set visible, progress, lazy-load
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry => {
    const sec = entry.target;
    if(entry.isIntersecting){
      sec.classList.add('is-visible');
      const idx = pages.indexOf(sec);
      currentIndex = idx;
      updateDots(idx);
      const progress = ((idx)/(pages.length-1))*100;
      progressBar.style.width = `${progress}%`;
      history.replaceState(null, '', `#/${idx+1}`);
      // eager-load current and neighbors
      ensureLoaded(sec);
      if(pages[idx-1]) ensureLoaded(pages[idx-1]);
      if(pages[idx+1]) ensureLoaded(pages[idx+1]);
    }else{
      sec.classList.remove('is-visible');
    }
  });
}, { root: deck, threshold: 0.6, rootMargin: '0px 0px -10% 0px' });

pages.forEach(p => io.observe(p));

// Hash startup
(function initFromHash(){
  const m = location.hash.match(/#\/(\d+)/);
  const idx = m ? Math.min(Math.max(parseInt(m[1],10)-1,0), pages.length-1) : 0;
  setTimeout(()=>goTo(idx), 50);
})();

// Public API for runtime control if needed
window.Deck = { next, prev, goTo };
