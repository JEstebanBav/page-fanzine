/* ===========================================
   FANZINE DIGITAL — Application Logic
   Interactive book experience with
   GSAP animations and StPageFlip
   =========================================== */

(() => {
  'use strict';

  /* ---------- Configuration ---------- */
  const PAGE_IMAGES = [
    'public/pages/page1.png',
    'public/pages/page2.png',
    'public/pages/page3.png',
    'public/pages/page4.png',
    'public/pages/page5.png',
    'public/pages/page6.png',
    'public/pages/page7.png',
    'public/pages/page8.png',
  ];
  const CALENDAR_IMAGE = 'public/pages/calendar-final.png';
  const FOLD_IMAGES = PAGE_IMAGES.slice(1, 5);
  const TOTAL_PAGES = PAGE_IMAGES.length;

  /* ---------- State ---------- */
  let currentPage = 0;
  let pageFlip = null;
  let calendarActive = false;
  let hintVisible = true;

  /* ---------- DOM References ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ========================================
     1. IMAGE PRELOADER
     ======================================== */
  function preloadImages() {
    const allImages = [...PAGE_IMAGES, CALENDAR_IMAGE];
    const loader = $('#loader');
    const progressFill = loader.querySelector('.progress-fill');
    const pctText = loader.querySelector('.pct');
    let loaded = 0;

    return new Promise((resolve) => {
      allImages.forEach((src) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded++;
          const pct = Math.round((loaded / allImages.length) * 100);
          progressFill.style.width = pct + '%';
          pctText.textContent = pct + '%';
          if (loaded === allImages.length) {
            setTimeout(() => {
              loader.classList.add('hidden');
              resolve();
            }, 400);
          }
        };
        img.src = src;
      });
    });
  }

  /* ========================================
     2. JUNGLE BACKGROUND
     ======================================== */
  function createJungleBackground() {
    const bg = $('#jungle-bg');
    bg.innerHTML = `
      <div class="jungle-base"></div>
      <div class="jungle-texture"></div>

      <!-- Monstera top-left -->
      <div class="jungle-leaf leaf-tl sway-1" style="opacity:.65">
        <svg width="280" height="300" viewBox="0 0 280 300" fill="none">
          <g transform="rotate(-25,140,150)">
            <path d="M140 15C140 15,65 70,48 145c-17 75,18 145,92 160 74-15,109-85,92-160C215 70,140 15,140 15Z" fill="#0d3d0d" opacity=".75"/>
            <path d="M140 15c0 0-55 75-65 150s25 115,65 135" stroke="#1a5c1a" stroke-width="2.5" fill="none" opacity=".5"/>
            <line x1="140" y1="70" x2="105" y2="50" stroke="#1a5c1a" stroke-width="1.5" opacity=".35"/>
            <line x1="125" y1="120" x2="78" y2="95" stroke="#1a5c1a" stroke-width="1.5" opacity=".35"/>
            <line x1="115" y1="170" x2="60" y2="150" stroke="#1a5c1a" stroke-width="1.5" opacity=".3"/>
            <line x1="160" y1="70" x2="200" y2="45" stroke="#1a5c1a" stroke-width="1.5" opacity=".35"/>
            <line x1="170" y1="130" x2="220" y2="100" stroke="#1a5c1a" stroke-width="1.5" opacity=".35"/>
            <ellipse cx="105" cy="130" rx="13" ry="17" fill="#0a1f0a" opacity=".45"/>
            <ellipse cx="172" cy="148" rx="11" ry="15" fill="#0a1f0a" opacity=".4"/>
            <ellipse cx="125" cy="215" rx="9" ry="12" fill="#0a1f0a" opacity=".35"/>
          </g>
        </svg>
      </div>

      <!-- Palm top-right -->
      <div class="jungle-leaf leaf-tr sway-2" style="opacity:.55;animation-delay:-2s">
        <svg width="310" height="260" viewBox="0 0 310 260" fill="none">
          <g transform="rotate(20,155,130)">
            <path d="M155 8c40 28,115 62,142 118-28-18-80-35-142-18C93 90,42 108,15 126,42 65,115 36,155 8Z" fill="#0b350b" opacity=".65"/>
            <line x1="155" y1="8" x2="155" y2="110" stroke="#1a5c1a" stroke-width="2.5" opacity=".4"/>
            <line x1="155" y1="40" x2="210" y2="28" stroke="#145214" stroke-width="1.2" opacity=".3"/>
            <line x1="155" y1="40" x2="100" y2="28" stroke="#145214" stroke-width="1.2" opacity=".3"/>
            <line x1="155" y1="70" x2="240" y2="48" stroke="#145214" stroke-width="1.2" opacity=".3"/>
            <line x1="155" y1="70" x2="70" y2="48" stroke="#145214" stroke-width="1.2" opacity=".3"/>
          </g>
        </svg>
      </div>

      <!-- Fern bottom-left -->
      <div class="jungle-leaf leaf-bl sway-3" style="opacity:.45;animation-delay:-4s">
        <svg width="240" height="280" viewBox="0 0 240 280" fill="none">
          <g transform="rotate(12,120,140)">
            <path d="M120 265c0 0-8-85-16-130S88 50,120 15c32 35,28 75,20 120s-20 130-20 130Z" fill="#0e3e0e" opacity=".55"/>
            <line x1="120" y1="265" x2="120" y2="15" stroke="#1a5c1a" stroke-width="1.8" opacity=".35"/>
            <path d="M116 225c-22-8-50-2-70 15" stroke="#0e3e0e" stroke-width="7" fill="none" opacity=".45" stroke-linecap="round"/>
            <path d="M124 225c22-8 50-2 70 15" stroke="#0e3e0e" stroke-width="7" fill="none" opacity=".45" stroke-linecap="round"/>
            <path d="M114 185c-25-8-55-4-75 12" stroke="#0e3e0e" stroke-width="6" fill="none" opacity=".4" stroke-linecap="round"/>
            <path d="M126 185c25-8 55-4 75 12" stroke="#0e3e0e" stroke-width="6" fill="none" opacity=".4" stroke-linecap="round"/>
            <path d="M112 145c-20-8-45-5-62 8" stroke="#0e3e0e" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>
            <path d="M128 145c20-8 45-5 62 8" stroke="#0e3e0e" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>
          </g>
        </svg>
      </div>

      <!-- Monstera bottom-right (mirrored) -->
      <div class="jungle-leaf leaf-br sway-1" style="opacity:.5;animation-delay:-5s">
        <svg width="260" height="290" viewBox="0 0 260 290" fill="none">
          <g transform="scale(-1,1) translate(-260,0) rotate(-28,130,145)">
            <path d="M130 12C130 12,60 65,44 135c-16 70,17 135,86 148 69-13,102-78,86-148C200 65,130 12,130 12Z" fill="#0c380c" opacity=".65"/>
            <line x1="130" y1="12" x2="130" y2="295" stroke="#1a5c1a" stroke-width="2" opacity=".4"/>
            <ellipse cx="98" cy="125" rx="12" ry="16" fill="#0a1f0a" opacity=".4"/>
            <ellipse cx="160" cy="150" rx="10" ry="14" fill="#0a1f0a" opacity=".35"/>
          </g>
        </svg>
      </div>

      <!-- Small side leaves -->
      <div class="jungle-leaf leaf-ml sway-2" style="opacity:.25;animation-delay:-3s">
        <svg width="70" height="105" viewBox="0 0 70 105" fill="none">
          <path d="M35 5c18 18,28 42,20 65S35 100,35 100s-8-10-20-30S17 23,35 5Z" fill="#0d3d0d"/>
          <line x1="35" y1="5" x2="35" y2="100" stroke="#1a5c1a" stroke-width="1.2" opacity=".4"/>
        </svg>
      </div>
      <div class="jungle-leaf leaf-mr sway-3" style="opacity:.22;animation-delay:-6s">
        <svg width="60" height="90" viewBox="0 0 60 90" fill="none">
          <path d="M30 3c16 16,25 38,18 58S30 88,30 88s-7-9-18-27S14 19,30 3Z" fill="#0b350b"/>
          <line x1="30" y1="3" x2="30" y2="88" stroke="#145214" stroke-width="1" opacity=".35"/>
        </svg>
      </div>

      <!-- Light rays -->
      <div class="light-ray light-ray-1"></div>
      <div class="light-ray light-ray-2"></div>

      <!-- Fireflies -->
      ${Array.from({length: 8}, (_, i) => {
        const top = 12 + Math.random() * 72;
        const left = 5 + Math.random() * 88;
        const dur = (5 + Math.random() * 5).toFixed(1);
        const delay = (Math.random() * 6).toFixed(1);
        const dx = ((Math.random()-.5)*40).toFixed(0);
        const dy = (-(10+Math.random()*30)).toFixed(0);
        return `<div class="firefly" style="top:${top}%;left:${left}%;--dur:${dur}s;--delay:${delay}s;--dx:${dx}px;--dy:${dy}px"></div>`;
      }).join('')}

      <div class="jungle-vignette"></div>
      <div class="jungle-earth"></div>
    `;
  }

  /* ========================================
     3. FLIPBOOK
     ======================================== */
  function getBookDimensions() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 768;

    const ratio = 1.5; // pages are ~1000x1500 (2:3)
    let w, h;
    if (isMobile) {
      w = Math.min(vw * 0.88, 340);
      h = w * ratio;
    } else {
      const maxH = vh * 0.60;
      h = Math.min(maxH, 640);
      w = h / ratio;
      if (w * 2 > vw * 0.82) {
        w = (vw * 0.82) / 2;
        h = w * ratio;
      }
    }
    return { width: Math.round(w), height: Math.round(h) };
  }

  function createFlipBook() {
    const wrapper = $('#book-wrapper');

    // Create page elements
    const pagesContainer = document.createElement('div');
    pagesContainer.id = 'book-pages';

    PAGE_IMAGES.forEach((src, i) => {
      const pageEl = document.createElement('div');
      pageEl.className = 'page-item';
      pageEl.dataset.page = String(i + 1);

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Página ${i + 1}`;
      img.draggable = false;

      pageEl.appendChild(img);
      pagesContainer.appendChild(pageEl);
    });

    wrapper.appendChild(pagesContainer);

    // Shadow layer
    const shadowLayer = document.createElement('div');
    shadowLayer.className = 'book-shadow-layer';
    wrapper.appendChild(shadowLayer);

    // Hint
    const hint = document.createElement('div');
    hint.className = 'page-hint';
    hint.id = 'page-hint';
    hint.innerHTML = `
      <div class="page-hint-inner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <path d="M14 2v6h6"/>
        </svg>
        Desliza para explorar
      </div>
    `;
    wrapper.appendChild(hint);

    const dims = getBookDimensions();

    // Initialize StPageFlip
    pageFlip = new St.PageFlip(pagesContainer, {
      width: dims.width,
      height: dims.height,
      size: 'fixed',
      minWidth: 260,
      maxWidth: 620,
      minHeight: 370,
      maxHeight: 870,
      showCover: true,
      mobileScrollSupport: false,
      drawShadow: true,
      flippingTime: 850,
      usePortrait: window.innerWidth < 768,
      startZIndex: 0,
      autoSize: false,
      maxShadowOpacity: 0.55,
      showPageCorners: true,
      disableFlipByClick: false,
      useMouseEvents: true,
      swipeDistance: 30,
      clickEventForward: true,
      startPage: 0,
    });

    pageFlip.loadFromHTML($$('.page-item'));

    // Events
    pageFlip.on('flip', (e) => {
      currentPage = e.data;
      updatePageUI();
      if (hintVisible) {
        hintVisible = false;
        const hintEl = $('#page-hint');
        if (hintEl) hintEl.style.display = 'none';
      }
    });

    pageFlip.on('changeState', (e) => {
      if (e.data === 'user_fold' && hintVisible) {
        hintVisible = false;
        const hintEl = $('#page-hint');
        if (hintEl) hintEl.style.display = 'none';
      }
    });

  }

  /* ========================================
     4. NAVIGATION CONTROLS
     ======================================== */
  function createNavigation() {
    const nav = $('#navigation');
    nav.innerHTML = `
      <div class="nav-side nav-side-prev">
        <button class="nav-btn" id="btn-prev" aria-label="Página anterior" disabled>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>
      <div class="page-counter">
        <span class="current" id="page-current">1</span>
        <span class="sep">/</span>
        <span class="total">${TOTAL_PAGES}</span>
      </div>
      <div class="nav-side nav-side-next">
        <button class="nav-btn" id="btn-next" aria-label="Página siguiente">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="final-btn hidden" id="btn-final" aria-label="Ver calendario final">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Final
        </button>
      </div>
    `;

    // Page dots
    const dots = $('#page-dots');
    const spreadCount = Math.ceil(TOTAL_PAGES / 2) + 1;
    dots.innerHTML = Array.from({ length: spreadCount }, (_, i) =>
      `<div class="dot${i === 0 ? ' active' : ''}" data-spread="${i}"></div>`
    ).join('');

    // Button events
    $('#btn-prev').addEventListener('click', () => pageFlip?.flipPrev());
    $('#btn-next').addEventListener('click', () => pageFlip?.flipNext());
    $('#btn-final').addEventListener('click', () => showCalendarAnimation());

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (calendarActive) {
        if (e.key === 'Escape') hideCalendarAnimation();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentPage >= TOTAL_PAGES - 2) {
          showCalendarAnimation();
        } else {
          pageFlip?.flipNext();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        pageFlip?.flipPrev();
      }
    });
  }

  function updatePageUI() {
    const btnPrev = $('#btn-prev');
    const btnNext = $('#btn-next');
    const btnFinal = $('#btn-final');
    const pageCurrent = $('#page-current');

    pageCurrent.textContent = currentPage + 1;
    btnPrev.disabled = currentPage <= 0;

    const isLast = currentPage >= TOTAL_PAGES - 2;
    if (isLast) {
      btnNext.classList.add('hidden');
      btnFinal.classList.remove('hidden');
    } else {
      btnNext.classList.remove('hidden');
      btnFinal.classList.add('hidden');
      btnNext.disabled = false;
    }

    // Update dots
    const dots = $$('.dot');
    const activeSpread = Math.floor(currentPage / 2);
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeSpread);
    });
  }

  /* ========================================
     5. CALENDAR ANIMATION
     ======================================== */
  let particleAnimFrame = 0;
  let particles = [];
  let foldInteractionCleanup = null;

  function showCalendarAnimation() {
    if (calendarActive) return;
    calendarActive = true;

    const overlay = $('#calendar-overlay');
    overlay.classList.add('active');

    setupFoldSequence();
    runAnimation();
  }

  function hideCalendarAnimation() {
    calendarActive = false;
    cancelAnimationFrame(particleAnimFrame);
    particles = [];

    if (foldInteractionCleanup) {
      foldInteractionCleanup();
      foldInteractionCleanup = null;
    }

    const overlay = $('#calendar-overlay');
    overlay.classList.remove('active');

    $('#final-image-wrap').classList.remove('visible');
    $('#complete-title').classList.remove('visible');

    const canvas = $('#particle-canvas');
    const ctx = canvas?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

    gsap.killTweensOf('#fold-strip, .fold-panel, .calendar-glow, #final-image-wrap img, .fold-grip, .fold-curl, .fold-shadow');
  }

  function setupFoldSequence() {
    const container = $('#anim-container');
    container.querySelectorAll('#fold-stage').forEach(el => el.remove());

    const stage = document.createElement('div');
    stage.id = 'fold-stage';

    const shadow = document.createElement('div');
    shadow.className = 'fold-shadow';

    const strip = document.createElement('div');
    strip.id = 'fold-strip';
    strip.setAttribute('role', 'button');
    strip.setAttribute('tabindex', '0');
    strip.setAttribute('aria-label', 'Desplegar hoja de arriba hacia abajo');

    // Fanzine 2, 3, 4 and 5 joined as a single folded sheet.
    FOLD_IMAGES.forEach((src, i) => {
      const panel = document.createElement('div');
      panel.className = `fold-panel fold-panel-${i + 1}`;
      panel.dataset.index = String(i + 2);

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Fanzine ${i + 2}`;
      img.draggable = false;

      panel.appendChild(img);
      strip.appendChild(panel);
    });

    const curl = document.createElement('div');
    curl.className = 'fold-curl';
    strip.appendChild(curl);

    const grip = document.createElement('button');
    grip.className = 'fold-grip';
    grip.id = 'fold-grip';
    grip.type = 'button';
    grip.setAttribute('aria-label', 'Arrastrar hacia abajo para desplegar');
    strip.appendChild(grip);

    const glow = document.createElement('div');
    glow.className = 'calendar-glow';

    stage.appendChild(shadow);
    stage.appendChild(strip);
    stage.appendChild(glow);
    container.appendChild(stage);
  }

  function runAnimation() {
    startParticles();

    const panels = $$('.fold-panel');
    const strip = $('#fold-strip');
    const stage = $('#fold-stage');
    const grip = $('#fold-grip');
    const finalWrap = $('#final-image-wrap');
    const completeTitle = $('#complete-title');
    const foldState = { progress: 0 };
    let autoTween = null;
    let settleTween = null;
    let dragStartY = 0;
    let dragStartProgress = 0;
    let dragging = false;
    let completed = false;
    const tl = gsap.timeline();

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const finishFold = () => {
      if (completed) return;
      completed = true;
      strip.classList.add('is-complete');
      grip.classList.add('is-hidden');
      finalWrap.classList.add('visible');
      gsap.fromTo('#final-image-wrap img', {
        opacity: 0,
        y: -28,
        scale: 0.96,
        clipPath: 'inset(0% 0% 100% 0%)',
        filter: 'blur(10px)',
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
      });
      gsap.to('.calendar-glow', {
        opacity: 0.5,
        duration: 0.45,
        yoyo: true,
        repeat: 2,
        ease: 'power2.inOut',
      });
      gsap.delayedCall(0.55, () => completeTitle.classList.add('visible'));
    };

    const setFoldProgress = (progress) => {
      const p = clamp(progress, 0, 1);
      const shine = Math.sin(p * Math.PI);
      const drop = p * Math.min(260, window.innerHeight * 0.34);
      const depth = p * 120;
      const rotation = p * 118;

      gsap.set(strip, {
        y: drop,
        z: depth,
        rotationX: rotation,
        scale: 1.03 - p * 0.1,
        opacity: 1 - Math.max(0, (p - 0.78) / 0.22),
        filter: `brightness(${1 - shine * 0.14}) saturate(${1 + shine * 0.08})`,
      });

      panels.forEach((panel, index) => {
        const distanceFromCenter = Math.abs(index - 1.5);
        gsap.set(panel, {
          y: shine * (2 + distanceFromCenter * 2),
          rotationZ: (index - 1.5) * shine * 0.85,
          z: shine * (10 - distanceFromCenter * 2),
          boxShadow: `0 ${14 + shine * 18}px ${35 + shine * 34}px rgba(0,0,0,${0.36 + shine * 0.2})`,
        });
      });

      gsap.set('.fold-curl', {
        opacity: Math.min(0.95, shine * 1.4),
        y: p * 24,
        scaleY: 1 + shine * 0.55,
      });

      gsap.set('.fold-shadow', {
        opacity: 0.42 + shine * 0.1 - p * 0.24,
        scaleX: 1 - p * 0.16,
        scaleY: 1 - p * 0.45,
        y: 42 + p * 66,
      });

      gsap.set(grip, {
        opacity: 1 - p * 1.35,
        y: p * 34,
      });

      gsap.set('.calendar-glow', {
        opacity: p > 0.86 ? (p - 0.86) / 0.14 * 0.28 : 0,
      });

      if (p >= 0.995) finishFold();
    };

    const animateFoldTo = (target, duration = 1.1) => {
      if (settleTween) settleTween.kill();
      settleTween = gsap.to(foldState, {
        progress: target,
        duration,
        ease: target > foldState.progress ? 'power3.out' : 'power2.inOut',
        onUpdate: () => setFoldProgress(foldState.progress),
        onComplete: () => {
          if (target === 1) finishFold();
        },
      });
    };

    const beginDrag = (event) => {
      if (completed) return;
      event.preventDefault();
      if (autoTween) autoTween.kill();
      if (settleTween) settleTween.kill();
      dragging = true;
      dragStartY = event.clientY;
      dragStartProgress = foldState.progress;
      stage.classList.add('is-dragging');
      strip.setPointerCapture?.(event.pointerId);
    };

    const moveDrag = (event) => {
      if (!dragging) return;
      const dragDistance = Math.min(440, window.innerHeight * 0.48);
      foldState.progress = clamp(dragStartProgress + (event.clientY - dragStartY) / dragDistance, 0, 1);
      setFoldProgress(foldState.progress);
    };

    const endDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      strip.releasePointerCapture?.(event.pointerId);
      animateFoldTo(foldState.progress > 0.42 ? 1 : 0, foldState.progress > 0.42 ? 1 : 0.65);
    };

    const keyHandler = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (autoTween) autoTween.kill();
        animateFoldTo(1, 1.35);
      }
    };

    if (foldInteractionCleanup) {
      foldInteractionCleanup();
    }

    foldInteractionCleanup = () => {
      if (autoTween) autoTween.kill();
      if (settleTween) settleTween.kill();
      strip.removeEventListener('pointerdown', beginDrag);
      window.removeEventListener('pointermove', moveDrag);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      strip.removeEventListener('keydown', keyHandler);
    };

    finalWrap.classList.remove('visible');
    completeTitle.classList.remove('visible');

    finalWrap.classList.remove('visible');
    gsap.set('#final-image-wrap img', {
      opacity: 0,
      y: -28,
      scale: 0.96,
      clipPath: 'inset(0% 0% 100% 0%)',
      filter: 'blur(10px)',
    });

    gsap.set(strip, {
      scale: 0.92,
      y: -32,
      rotationX: -8,
      transformPerspective: 1600,
      transformOrigin: '50% 0%',
      opacity: 0,
      filter: 'blur(10px)',
    });

    setFoldProgress(0);

    strip.addEventListener('pointerdown', beginDrag);
    window.addEventListener('pointermove', moveDrag);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    strip.addEventListener('keydown', keyHandler);

    // Phase 1: Fanzine 2, 3, 4 and 5 appear joined as one sheet.
    tl.to(strip, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.85,
      ease: 'power3.out',
    });

    tl.set(panels, {
      opacity: 1,
      rotationY: 0,
    }, '<');

    // Phase 2: The sheet folds from top to bottom; only then the calendar appears.
    tl.call(() => {
      autoTween = gsap.to(foldState, {
        progress: 1,
        duration: 1.85,
        delay: 0.65,
        ease: 'power3.inOut',
        onUpdate: () => setFoldProgress(foldState.progress),
        onComplete: finishFold,
      });
    }, null, '+=0.2');
  }

  /* ---------- Particle System ---------- */
  function startParticles() {
    const canvas = $('#particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeHandler);

    function spawnParticle() {
      const isLeaf = Math.random() > 0.55;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5 - 0.5,
        life: 0,
        maxLife: 80 + Math.random() * 140,
        size: isLeaf ? 3 + Math.random() * 5 : 1.5 + Math.random() * 2.5,
        hue: isLeaf ? 105 + Math.random() * 35 : 48 + Math.random() * 20,
        saturation: isLeaf ? 65 : 75,
        lightness: isLeaf ? 42 + Math.random() * 18 : 68 + Math.random() * 15,
        type: isLeaf ? 'leaf' : 'glow',
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
      };
    }

    function tick() {
      if (!calendarActive) {
        window.removeEventListener('resize', resizeHandler);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn
      if (particles.length < 100) {
        for (let i = 0; i < 3; i++) particles.push(spawnParticle());
      }

      // Update & draw
      particles = particles.filter((p) => {
        p.life++;
        if (p.life > p.maxLife) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.008;
        p.rot += p.rotSpeed;

        const alpha = Math.min(1, p.life / 15) * (1 - p.life / p.maxLife);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;

        if (p.type === 'glow') {
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.5);
          grad.addColorStop(0, `hsla(${p.hue},${p.saturation}%,${p.lightness}%,.7)`);
          grad.addColorStop(1, `hsla(${p.hue},${p.saturation}%,${p.lightness}%,0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `hsla(${p.hue},${p.saturation}%,${p.lightness}%,.55)`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.38, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      particleAnimFrame = requestAnimationFrame(tick);
    }

    particleAnimFrame = requestAnimationFrame(tick);
  }

  /* ========================================
     6. INITIALIZATION
     ======================================== */
  async function init() {
    createJungleBackground();
    await preloadImages();
    createFlipBook();
    createNavigation();

    // Back button
    $('#back-btn').addEventListener('click', hideCalendarAnimation);

    // Resize handler (attached once)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (calendarActive) return;
        const savedPage = currentPage;
        const wrapper = $('#book-wrapper');
        try {
          if (pageFlip) { pageFlip.destroy(); pageFlip = null; }
        } catch (_) { /* ignore */ }
        wrapper.innerHTML = '';
        createFlipBook();
        if (savedPage > 0 && pageFlip) {
          try { pageFlip.flip(savedPage); } catch (_) { /* ignore */ }
        }
      }, 400);
    });
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
