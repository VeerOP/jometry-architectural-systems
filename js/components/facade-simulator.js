/* ==========================================================================
   JOMETRY FACADE & LIGHT SIMULATOR
   Section 09 & Section 10 Exterior Engineering & Concealed LED Backlighting Engine
   ========================================================================== */

export function initFacadeSimulator() {
  // 1. Concealed LED Backlit Night Facade Engine
  const dayNightToggle = document.getElementById('facade-daynight-toggle');
  const dimmerSlider = document.getElementById('facade-dimmer-slider');
  const dimmerVal = document.getElementById('facade-dimmer-val');
  const cctBtns = document.querySelectorAll('.facade-cct-btn');
  const facadeStage = document.getElementById('facade-light-stage');
  const facadeStatus = document.getElementById('facade-lighting-status');

  let isNight = true;
  let brightness = 90;
  let currentCCT = '2700K';

  const cctProfiles = {
    '2700K': {
      label: '2700K Museum Warm Gold',
      glow: 'rgba(255, 165, 40, 0.9)',
      ambient: 'rgba(255, 165, 40, 0.35)',
      hex: '#ffa528'
    },
    '3000K': {
      label: '3000K Architectural Neutral Warm',
      glow: 'rgba(255, 195, 75, 0.9)',
      ambient: 'rgba(255, 195, 75, 0.3)',
      hex: '#ffc34b'
    },
    'tunable': {
      label: 'Tunable White (2700K–4500K)',
      glow: 'rgba(255, 230, 160, 0.9)',
      ambient: 'rgba(255, 230, 160, 0.25)',
      hex: '#ffe6a0'
    }
  };

  function updateLighting() {
    if (!facadeStage) return;

    const profile = cctProfiles[currentCCT] || cctProfiles['2700K'];
    const intensity = isNight ? (brightness / 100) : 0;

    facadeStage.classList.toggle('night-mode', isNight);
    
    // Slit lights glow effect
    facadeStage.querySelectorAll('.slit-light').forEach(slit => {
      if (isNight && intensity > 0.01) {
        slit.style.opacity = intensity;
        slit.style.backgroundColor = profile.hex;
        slit.style.boxShadow = `0 0 ${12 * intensity}px ${profile.glow}, 0 0 ${28 * intensity}px ${profile.ambient}`;
      } else {
        slit.style.opacity = 0.05;
        slit.style.backgroundColor = 'rgba(0,0,0,0.4)';
        slit.style.boxShadow = 'none';
      }
    });

    if (facadeStatus) {
      facadeStatus.innerHTML = `
        <span><strong>Elevation Mode:</strong> ${isNight ? '🌙 Night Luminescence' : '☀️ Daytime Architectural Flutes'}</span> &nbsp;·&nbsp;
        <span><strong>CCT:</strong> ${profile.label}</span> &nbsp;·&nbsp;
        <span><strong>DALI-2 Dimmer:</strong> ${isNight ? `${brightness}% Intensity (0.1% Min Depth)` : 'Standby (0%)'}</span> &nbsp;·&nbsp;
        <span><strong>CRI:</strong> >90 Museum Grade</span>
      `;
    }
  }

  if (dayNightToggle) {
    dayNightToggle.addEventListener('click', () => {
      isNight = !isNight;
      dayNightToggle.classList.toggle('active', isNight);
      dayNightToggle.innerHTML = isNight
        ? '🌙 Night Mode Active (Concealed 2700K Glow)'
        : '☀️ Daytime Mode Active (Solid Fluted Surface)';
      updateLighting();
    });
  }

  if (dimmerSlider) {
    dimmerSlider.addEventListener('input', (e) => {
      brightness = parseInt(e.target.value, 10);
      if (dimmerVal) dimmerVal.textContent = `${brightness}%`;
      if (!isNight) {
        isNight = true;
        if (dayNightToggle) {
          dayNightToggle.classList.add('active');
          dayNightToggle.innerHTML = '🌙 Night Mode Active (Concealed 2700K Glow)';
        }
      }
      updateLighting();
    });
  }

  if (cctBtns.length > 0) {
    cctBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        cctBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCCT = btn.dataset.cct || '2700K';
        updateLighting();
      });
    });
  }

  // Initial update
  updateLighting();
}
