/* ==========================================================================
   JOMETRY 500 × 500 MM TILE LAYOUT STUDIO & DALI-2 LIGHTING SIMULATOR
   Section 06 & Section 10 Composition & Concealed LED Backlighting Engine
   ========================================================================== */

export function initTileStudio() {
  const studioGrid = document.getElementById('studio-grid');
  if (!studioGrid) return;

  const presetButtons = document.querySelectorAll('.preset-btn');
  const finishButtons = document.querySelectorAll('.finish-swatch-btn');
  const backlitToggle = document.getElementById('backlit-toggle');
  const dimmerSlider = document.getElementById('studio-dimmer-slider');
  const dimmerValue = document.getElementById('studio-dimmer-value');
  const cctButtons = document.querySelectorAll('.cct-select-btn');
  const studioStatus = document.getElementById('studio-status-text');
  const randomizeBtn = document.getElementById('btn-randomize-grid');
  const resetBtn = document.getElementById('btn-reset-grid');

  // Studio State
  let currentPreset = 'basket-weave';
  let currentFinish = 'charcoal'; // charcoal, terracotta, bronze, oak, hygiene
  let isBacklit = false;
  let brightness = 85; // 0 - 100%
  let currentCCT = '2700K'; // 2700K, 3000K, 4000K

  // 12 tiles in a 4x3 grid (2000 mm × 1500 mm elevation)
  const tilesState = Array.from({ length: 12 }, (_, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    return {
      id: i,
      row,
      col,
      rotation: (row + col) % 2 === 1 ? 90 : 0,
      slots: true,
      hasLed: true
    };
  });

  const finishPalette = {
    charcoal: {
      name: 'Architectural Charcoal Matte',
      base: '#1e2229',
      border: '#333a46',
      slotDark: '#0d0f13',
      ribShadow: 'rgba(0,0,0,0.35)'
    },
    terracotta: {
      name: 'Terracotta AV Acoustic',
      base: '#a64d2d',
      border: '#c25e3b',
      slotDark: '#542312',
      ribShadow: 'rgba(50,15,5,0.4)'
    },
    bronze: {
      name: 'Anodised Champagne-Bronze',
      base: '#7e643c',
      border: '#9c7f51',
      slotDark: '#3d301c',
      ribShadow: 'rgba(30,22,10,0.45)'
    },
    oak: {
      name: 'Warm Natural Oak Woodgrain',
      base: '#9e7952',
      border: '#b89267',
      slotDark: '#4a341e',
      ribShadow: 'rgba(35,20,10,0.38)'
    },
    hygiene: {
      name: 'ISO Class 5 Cleanroom White',
      base: '#e9edf2',
      border: '#ccd2dc',
      slotDark: '#adb6c4',
      ribShadow: 'rgba(0,0,0,0.1)'
    }
  };

  const cctGlows = {
    '2700K': {
      color: '#ffaa33',
      glow: 'rgba(255, 170, 51, 0.85)',
      ambient: 'rgba(255, 170, 51, 0.25)'
    },
    '3000K': {
      color: '#ffcc66',
      glow: 'rgba(255, 204, 102, 0.85)',
      ambient: 'rgba(255, 204, 102, 0.22)'
    },
    '4000K': {
      color: '#fff0d0',
      glow: 'rgba(255, 240, 208, 0.85)',
      ambient: 'rgba(255, 240, 208, 0.2)'
    }
  };

  function renderGrid() {
    studioGrid.innerHTML = '';
    const finish = finishPalette[currentFinish] || finishPalette.charcoal;
    const cct = cctGlows[currentCCT] || cctGlows['2700K'];
    const glowIntensity = isBacklit ? (brightness / 100) : 0;

    tilesState.forEach((tile, index) => {
      const tileEl = document.createElement('div');
      tileEl.className = `studio-tile finish-${currentFinish}`;
      tileEl.dataset.id = index;
      tileEl.style.transform = `rotate(${tile.rotation}deg)`;
      tileEl.title = `Module #${index + 1} (${tile.rotation}°) · Click to rotate 90°`;

      const isGradient = currentPreset === 'gradient';
      const slotOpacity = isGradient ? (1 - (tile.row * 0.35)) : 1;
      const showSlots = tile.slots && slotOpacity > 0.1;

      // Slot fill color based on LED state
      const slotFill = isBacklit && showSlots
        ? cct.color
        : finish.slotDark;
      const slotFilter = isBacklit && showSlots
        ? `drop-shadow(0 0 ${8 * glowIntensity}px ${cct.glow}) drop-shadow(0 0 ${16 * glowIntensity}px ${cct.ambient})`
        : 'none';

      tileEl.innerHTML = `
        <svg viewBox="0 0 100 100" class="tile-face-svg" style="width:100%; height:100%; display:block;">
          <defs>
            <linearGradient id="rib-grad-${index}" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
              <stop offset="70%" stop-color="rgba(0,0,0,0)"/>
              <stop offset="100%" stop-color="${finish.ribShadow}"/>
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="${finish.base}" class="tile-base-bg"/>
          <!-- 6 Broad Architectural Fluted Ribs -->
          <g class="ribs-group">
            ${[0, 1, 2, 3, 4, 5].map(r => `
              <rect x="${r * 16.66}" y="0" width="16.66" height="100" fill="url(#rib-grad-${index})"/>
              <line x1="${r * 16.66}" y1="0" x2="${r * 16.66}" y2="100" stroke="${finish.border}" stroke-width="0.8"/>
            `).join('')}
          </g>
          <!-- Laser-Cut Acoustic / Illuminated Slots -->
          ${showSlots ? `
            <g class="slots-group" opacity="${slotOpacity}" style="filter: ${slotFilter};">
              <rect x="6" y="14" width="4.5" height="72" rx="1.5" fill="${slotFill}"/>
              <rect x="23" y="8" width="4.5" height="84" rx="1.5" fill="${slotFill}"/>
              <rect x="39.5" y="14" width="4.5" height="72" rx="1.5" fill="${slotFill}"/>
              <rect x="56" y="8" width="4.5" height="84" rx="1.5" fill="${slotFill}"/>
              <rect x="73" y="14" width="4.5" height="72" rx="1.5" fill="${slotFill}"/>
              <rect x="89.5" y="8" width="4.5" height="84" rx="1.5" fill="${slotFill}"/>
            </g>
          ` : ''}
          <rect width="100" height="100" fill="none" stroke="${finish.border}" stroke-width="1.2"/>
        </svg>
        <span class="tile-rotation-badge">${tile.rotation}°</span>
      `;

      // Click to rotate 90 degrees
      tileEl.addEventListener('click', () => {
        tile.rotation = (tile.rotation + 90) % 360;
        tileEl.style.transform = `rotate(${tile.rotation}deg)`;
        const badge = tileEl.querySelector('.tile-rotation-badge');
        if (badge) badge.textContent = `${tile.rotation}°`;
        updateStatus();
      });

      studioGrid.appendChild(tileEl);
    });

    if (isBacklit) {
      studioGrid.classList.add('backlit-active');
      studioGrid.style.boxShadow = `0 0 ${30 * glowIntensity}px ${cct.ambient}`;
    } else {
      studioGrid.classList.remove('backlit-active');
      studioGrid.style.boxShadow = 'none';
    }

    updateStatus();
  }

  function applyPreset(preset) {
    currentPreset = preset;
    presetButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === preset);
    });

    tilesState.forEach((tile) => {
      if (preset === 'directional') {
        tile.rotation = 0;
        tile.slots = true;
      } else if (preset === 'basket-weave') {
        tile.rotation = (tile.row + tile.col) % 2 === 1 ? 90 : 0;
        tile.slots = true;
      } else if (preset === 'gradient') {
        tile.rotation = 0;
        tile.slots = true;
      } else if (preset === 'solid-hygiene') {
        tile.rotation = 0;
        tile.slots = false;
      } else if (preset === 'randomized') {
        tile.rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
        tile.slots = Math.random() > 0.15;
      }
    });

    renderGrid();
  }

  function applyFinish(finish) {
    currentFinish = finish;
    finishButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.finish === finish);
    });
    renderGrid();
  }

  function updateStatus() {
    if (!studioStatus) return;
    const finish = finishPalette[currentFinish] || finishPalette.charcoal;
    const presetNames = {
      'basket-weave': 'Basket-Weave (90° Parquet)',
      'directional': 'Directional Fluted Monolith',
      'gradient': 'Graduated Open-Area Perforation',
      'solid-hygiene': 'Unperforated Solid Hygiene (ISO-5)',
      'randomized': 'Randomized Architectural Pattern'
    };

    studioStatus.innerHTML = `
      <span><strong>Grid Composition:</strong> 12 Modules (500 × 500 mm · 2000 × 1500 mm Elevation)</span> &nbsp;·&nbsp;
      <span><strong>Pattern:</strong> ${presetNames[currentPreset] || currentPreset}</span> &nbsp;·&nbsp;
      <span><strong>Finish:</strong> ${finish.name}</span>
      ${isBacklit ? ` &nbsp;·&nbsp; <span style="color:var(--color-backlit-amber);">★ Concealed LED Active (${currentCCT} · ${brightness}% DALI-2)</span>` : ''}
    `;
  }

  // Event Listeners
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
  });

  finishButtons.forEach(btn => {
    btn.addEventListener('click', () => applyFinish(btn.dataset.finish));
  });

  if (backlitToggle) {
    backlitToggle.addEventListener('click', () => {
      isBacklit = !isBacklit;
      backlitToggle.classList.toggle('active', isBacklit);
      backlitToggle.innerHTML = isBacklit 
        ? '💡 Concealed LED: ACTIVE (Night Glow)'
        : '💡 Toggle Backlit LED Night Mode';
      renderGrid();
    });
  }

  if (dimmerSlider) {
    dimmerSlider.addEventListener('input', (e) => {
      brightness = parseInt(e.target.value, 10);
      if (dimmerValue) dimmerValue.textContent = `${brightness}%`;
      if (isBacklit) renderGrid();
    });
  }

  if (cctButtons.length > 0) {
    cctButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        cctButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCCT = btn.dataset.cct || '2700K';
        if (isBacklit) renderGrid();
      });
    });
  }

  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', () => applyPreset('randomized'));
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => applyPreset('basket-weave'));
  }

  // Initial render
  renderGrid();
}
