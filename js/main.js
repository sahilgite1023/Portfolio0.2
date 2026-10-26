/**
 * SAHIL GITE - SWISS + NEO-BRUTALISM + CUTE PORTFOLIO ENGINE
 * Features:
 *  - Real-time Nashik (IST) Clock
 *  - Web Audio API Retro 8-bit Synth (Chirp / Pop / Click)
 *  - 3-Way Theme Switcher (Daylight / Cyber-Dark / Candy-Pastel)
 *  - Interactive Sticker Tray & Stamping
 *  - Copy to Clipboard Toast & Sound
 *  - Interactive Guestbook with LocalStorage
 *  - Mobile Navigation Toggle
 */

(function () {
  'use strict';

  // State
  let audioEnabled = false;
  let activeSticker = null;
  let audioCtx = null;

  // Initialize Web Audio on first user interaction
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Cute 8-bit Sound Generator
  function playCuteSound(type = 'pop') {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // --- Real-time Nashik IST Clock ---
  function updateLiveClock() {
    const clockEl = document.getElementById('liveClock');
    if (!clockEl) return;
    const now = new Date();
    // Format in IST (UTC+5:30)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    clockEl.textContent = now.toLocaleTimeString('en-US', options) + ' IST';
  }

  // --- Toast Notification ---
  function showToast(message, icon = '✨') {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'cute-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="font-size: 1.3rem;">${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    playCuteSound('success');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // --- Copy to Clipboard Utility ---
  window.copyText = function (text, label) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${label || text} to clipboard!`, '📋');
      }).catch(() => {
        fallbackCopy(text, label);
      });
    } else {
      fallbackCopy(text, label);
    }
  };

  function fallbackCopy(text, label) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied ${label || text}!`, '📋');
  }

  // --- Theme Switcher ---
  const THEMES = ['default', 'dark', 'pastel'];
  function initTheme() {
    const savedTheme = localStorage.getItem('sg_theme') || 'default';
    setTheme(savedTheme, false);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'default';
        const nextIdx = (THEMES.indexOf(current) + 1) % THEMES.length;
        const nextTheme = THEMES[nextIdx];
        setTheme(nextTheme, true);
      });
    }
  }

  function setTheme(themeName, animate = true) {
    if (themeName === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeName);
    }
    localStorage.setItem('sg_theme', themeName);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      const iconMap = {
        default: '☀️ LIGHT',
        dark: '🌙 DARK',
        pastel: '🍬 PASTEL'
      };
      themeToggleBtn.innerHTML = `<span>🎨</span> ${iconMap[themeName] || 'THEME'}`;
    }
    if (animate) {
      playCuteSound('click');
      showToast(`Switched theme to ${themeName.toUpperCase()}`, '🎨');
    }
  }

  // --- Sound Effects Toggle ---
  function initAudioToggle() {
    const audioBtn = document.getElementById('audioToggleBtn');
    const savedAudio = localStorage.getItem('sg_audio') === 'true';
    audioEnabled = savedAudio;

    function renderAudioBtn() {
      if (!audioBtn) return;
      if (audioEnabled) {
        audioBtn.innerHTML = '<span>🔊</span> SOUND: ON';
        audioBtn.style.background = 'var(--accent-mint)';
        audioBtn.style.color = '#121316';
      } else {
        audioBtn.innerHTML = '<span>🔇</span> SOUND: OFF';
        audioBtn.style.background = 'var(--bg-secondary)';
        audioBtn.style.color = 'var(--ink)';
      }
    }

    renderAudioBtn();

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        getAudioContext();
        audioEnabled = !audioEnabled;
        localStorage.setItem('sg_audio', audioEnabled);
        renderAudioBtn();
        if (audioEnabled) {
          playCuteSound('pop');
          showToast('Sound effects enabled! (Tap around)', '🔊');
        } else {
          showToast('Sound effects muted', '🔇');
        }
      });
    }
  }

  // --- Mobile Nav Menu ---
  function initMobileNav() {
    const toggle = document.getElementById('mobileNavToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        links.classList.toggle('mobile-open');
        playCuteSound('click');
        toggle.textContent = links.classList.contains('mobile-open') ? '✕ CLOSE' : '☰ MENU';
      });
    }
  }

  // --- Sound on Interactive Elements ---
  function initButtonSounds() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, .cta-button, .btn-primary, .btn-secondary, .btn-card, .system-btn, .nav-link, .tag-pill');
      if (target) {
        playCuteSound('pop');
      }
    });
  }

  // --- Cute Interactive Sticker Stamping Tray ---
  function initStickerTray() {
    const stickerBtns = document.querySelectorAll('.tray-sticker-btn');
    if (!stickerBtns.length) return;

    stickerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const emoji = btn.getAttribute('data-emoji');
        activeSticker = emoji;
        stickerBtns.forEach(b => b.style.outline = 'none');
        btn.style.outline = '3px solid var(--accent-pink)';
        playCuteSound('pop');
        showToast(`Sticker ${emoji} armed! Click anywhere to stamp!`, emoji);
      });
    });

    document.addEventListener('click', (e) => {
      // Don't stamp on buttons or forms or nav
      if (!activeSticker) return;
      if (e.target.closest('button, a, input, textarea, select, .site-header, .top-system-bar, .sticker-palette-tray')) {
        return;
      }

      stampSticker(e.pageX, e.pageY, activeSticker);
      playCuteSound('success');
    });
  }

  function stampSticker(x, y, emoji) {
    const stickerEl = document.createElement('div');
    stickerEl.className = 'dropped-sticker';
    stickerEl.textContent = emoji;
    stickerEl.style.left = `${x - 20}px`;
    stickerEl.style.top = `${y - 20}px`;
    stickerEl.style.transform = `rotate(${(Math.random() * 40 - 20).toFixed(1)}deg)`;

    // Make it draggable
    makeDraggable(stickerEl);

    document.body.appendChild(stickerEl);
  }

  function makeDraggable(el) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    el.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = parseFloat(el.style.left) || 0;
      initialTop = parseFloat(el.style.top) || 0;
      el.style.zIndex = '999';
      playCuteSound('click');
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${initialLeft + dx}px`;
      el.style.top = `${initialTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        el.style.zIndex = '70';
      }
    });
  }

  // --- Project Filtering System (on projects.html) ---
  function initProjectFilters() {
    const filterTabs = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (!filterTabs.length || !projectCards.length) return;

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.style.background = 'var(--bg-primary)';
        });
        tab.classList.add('active');
        tab.style.background = 'var(--accent-yellow)';
        playCuteSound('pop');

        const filter = tab.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Interactive Guestbook Board (on contact.html) ---
  function initGuestbook() {
    const form = document.getElementById('guestbookForm');
    const container = document.getElementById('guestbookPins');
    if (!form || !container) return;

    const defaultNotes = [
      { name: "Recruiter @ TechCorp", emoji: "🚀", text: "Impressive MCA projects! Love the brutalist vibes.", time: "2 hrs ago", rot: "-2" },
      { name: "Dev Friend", emoji: "☕", text: "CareerNova UI looks super clean! Best of luck bro!", time: "5 hrs ago", rot: "3" },
      { name: "Hackathon Judge", emoji: "🥇", text: "Great problem-solving skills at KKWIEER!", time: "1 day ago", rot: "-1" }
    ];

    let savedNotes = [];
    try {
      const stored = localStorage.getItem('sg_guestbook');
      savedNotes = stored ? JSON.parse(stored) : defaultNotes;
    } catch (e) {
      savedNotes = defaultNotes;
    }

    function renderNotes() {
      container.innerHTML = '';
      savedNotes.forEach(note => {
        const pin = document.createElement('div');
        pin.className = 'guestbook-pin';
        pin.style.setProperty('--rot', `${note.rot || 0}deg`);
        pin.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="pin-author">${note.name}</span>
            <span style="font-size:1.2rem;">${note.emoji}</span>
          </div>
          <p style="margin-bottom:8px; line-height:1.4;">${note.text}</p>
          <div style="font-size:0.7rem; color:var(--ink-secondary); text-align:right;">${note.time}</div>
        `;
        container.appendChild(pin);
      });
    }

    renderNotes();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('guestName');
      const msgInput = document.getElementById('guestMsg');
      const emojiInput = document.getElementById('guestEmoji');

      const name = nameInput.value.trim() || 'Anonymous Visitor';
      const text = msgInput.value.trim();
      const emoji = emojiInput.value || '⭐';

      if (!text) {
        showToast('Please type a short cute note!', '✍️');
        return;
      }

      const newPin = {
        name,
        emoji,
        text,
        time: 'Just now',
        rot: (Math.random() * 6 - 3).toFixed(1)
      };

      savedNotes.unshift(newPin);
      localStorage.setItem('sg_guestbook', JSON.stringify(savedNotes));
      renderNotes();

      nameInput.value = '';
      msgInput.value = '';
      showToast('Sticker note pinned to Sahil’s board!', '📌');
      playCuteSound('success');
    });
  }

  // --- Contact Form Dispatch Simulator (on contact.html) ---
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳</span> TRANSMITTING PACKET...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        showToast('Message received! Sahil will respond shortly. (✿◠‿◠)', '💌');
        playCuteSound('success');
      }, 1200);
    });
  }

  // --- Initialize Everything on DOM Ready ---
  document.addEventListener('DOMContentLoaded', () => {
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
    initTheme();
    initAudioToggle();
    initMobileNav();
    initButtonSounds();
    initStickerTray();
    initProjectFilters();
    initGuestbook();
    initContactForm();
  });

})();
