/* ==========================================================================
   JOMETRY HELMHOLTZ CAVITY ACOUSTIC PHYSICS & LIVE AUDIO SIMULATOR
   Section 06 & 07 Measured Octave Data & Web Audio Resonance Engine
   ========================================================================== */

export function initAcousticSimulator() {
  const depthSlider = document.getElementById('cavity-depth-slider');
  const depthDisplay = document.getElementById('cavity-depth-value');
  const pathCurve = document.getElementById('curve-deep');
  const peakHzDisplay = document.getElementById('acoustic-peak-hz');
  const nrcDisplay = document.getElementById('acoustic-nrc-rating');
  const stiDisplay = document.getElementById('acoustic-sti-rating');
  const descDisplay = document.getElementById('acoustic-zone-desc');
  const presetBtns = document.querySelectorAll('.acoustic-preset-btn');
  const playAudioBtn = document.getElementById('btn-play-acoustic-audio');
  const audioSampleSelect = document.getElementById('acoustic-sample-select');

  if (!depthSlider) return;

  // Exact Certified Laboratory Data from Page 8 of 2026 Catalogue:
  // 50 mm:  125Hz: 0.18, 250Hz: 0.38, 500Hz: 0.72, 1000Hz: 0.94, 2000Hz: 0.92, 4000Hz: 0.86 (NRC: 0.80)
  // 100 mm: 125Hz: 0.35, 250Hz: 0.72, 500Hz: 0.95, 1000Hz: 0.96, 2000Hz: 0.90, 4000Hz: 0.88 (NRC: 0.90)
  // 180 mm: 125Hz: 0.62, 250Hz: 0.92, 500Hz: 0.98, 1000Hz: 0.94, 2000Hz: 0.88, 4000Hz: 0.85 (NRC: 0.95)

  function interpolate(x0, y0, x1, y1, x) {
    return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
  }

  function calculateAcoustics(depthMm) {
    const d = Math.max(50, Math.min(220, parseInt(depthMm, 10)));
    let a125, a250, a500, a1000, a2000, a4000, nrc;

    if (d <= 100) {
      a125 = interpolate(50, 0.18, 100, 0.35, d);
      a250 = interpolate(50, 0.38, 100, 0.72, d);
      a500 = interpolate(50, 0.72, 100, 0.95, d);
      a1000 = interpolate(50, 0.94, 100, 0.96, d);
      a2000 = interpolate(50, 0.92, 100, 0.90, d);
      a4000 = interpolate(50, 0.86, 100, 0.88, d);
      nrc = interpolate(50, 0.80, 100, 0.90, d);
    } else {
      a125 = interpolate(100, 0.35, 180, 0.62, d);
      a250 = interpolate(100, 0.72, 180, 0.92, d);
      a500 = interpolate(100, 0.95, 180, 0.98, d);
      a1000 = interpolate(100, 0.96, 180, 0.94, d);
      a2000 = interpolate(100, 0.90, 180, 0.88, d);
      a4000 = interpolate(100, 0.88, 180, 0.85, d);
      nrc = interpolate(100, 0.90, 180, 0.95, d);
    }

    // Extended range up to 220mm
    if (d > 180) {
      const extra = (d - 180) / 40;
      a125 = Math.min(0.78, a125 + extra * 0.12);
      a250 = Math.min(0.96, a250 + extra * 0.04);
      nrc = 0.95;
    }

    const bands = [
      +a125.toFixed(2),
      +a250.toFixed(2),
      +a500.toFixed(2),
      +a1000.toFixed(2),
      +a2000.toFixed(2),
      +a4000.toFixed(2)
    ];

    // Find resonant center frequency
    const maxVal = Math.max(...bands);
    const maxIdx = bands.indexOf(maxVal);
    const hzLabels = [125, 250, 500, 1000, 2000, 4000];
    const peakHz = hzLabels[maxIdx];

    let zoneDesc = 'High-frequency flutter echo and reverberation control for circulation and open offices.';
    let priorityBand = 'Corridor / Open Office (50–75 mm)';
    let sti = 'STI > 0.82 (Excellent)';

    if (d >= 140) {
      zoneDesc = 'Deep Helmholtz bass resonant absorption targeting low-frequency HVAC rumble and cinema modal standing waves.';
      priorityBand = 'AV / Screening Suite & Studio (120–180 mm)';
      sti = 'STI > 0.88 (Pristine)';
    } else if (d >= 80) {
      zoneDesc = 'Optimized speech intelligibility band (500 Hz – 2 kHz) eliminating room flutter echoes in video conferencing.';
      priorityBand = 'Boardroom / Video Conference (75–100 mm)';
      sti = 'STI > 0.85 (Excellent)';
    }

    return {
      d,
      peakHz,
      bands,
      nrc: +nrc.toFixed(2),
      zoneDesc,
      priorityBand,
      sti
    };
  }

  function updateVisuals(data) {
    if (depthDisplay) depthDisplay.textContent = `${data.d} mm`;
    if (peakHzDisplay) peakHzDisplay.textContent = `${data.peakHz} Hz`;
    if (nrcDisplay) nrcDisplay.textContent = `NRC ${data.nrc.toFixed(2)}`;
    if (stiDisplay) stiDisplay.textContent = data.sti;
    if (descDisplay) {
      descDisplay.innerHTML = `<strong>Priority Target:</strong> ${data.priorityBand}<br>${data.zoneDesc}`;
    }

    // Graph coordinates mapping:
    // X axis: 125Hz (80), 250Hz (180), 500Hz (280), 1000Hz (380), 2000Hz (480), 4000Hz (580)
    // Y axis: 0.0 (200), 1.0 (40) => y = 200 - (val * 160)
    const xCoords = [80, 180, 280, 380, 480, 580];
    const points = data.bands.map((val, idx) => {
      const y = 200 - Math.min(Math.max(val, 0), 1.0) * 160;
      return `${xCoords[idx]},${y.toFixed(1)}`;
    });

    const svgPath = `M ${points[0]} ` +
      `C 130,${points[0].split(',')[1]} 130,${points[1].split(',')[1]} ${points[1]} ` +
      `C 230,${points[1].split(',')[1]} 230,${points[2].split(',')[1]} ${points[2]} ` +
      `C 330,${points[2].split(',')[1]} 330,${points[3].split(',')[1]} ${points[3]} ` +
      `C 430,${points[3].split(',')[1]} 430,${points[4].split(',')[1]} ${points[4]} ` +
      `C 530,${points[4].split(',')[1]} 530,${points[5].split(',')[1]} ${points[5]}`;

    if (pathCurve) {
      pathCurve.setAttribute('d', svgPath);
    }

    const dotsGroup = document.getElementById('curve-dots-group');
    if (dotsGroup) {
      dotsGroup.innerHTML = points.map((pt, i) => {
        const [x, y] = pt.split(',');
        return `
          <circle cx="${x}" cy="${y}" r="4.5" fill="var(--color-acoustic-clay)" stroke="#fff" stroke-width="2"/>
          <text x="${x}" y="${parseFloat(y) - 10}" font-family="IBM Plex Mono" font-size="9" fill="var(--color-acoustic-clay)" text-anchor="middle" font-weight="600">α ${data.bands[i].toFixed(2)}</text>
        `;
      }).join('');
    }
  }

  depthSlider.addEventListener('input', (e) => {
    presetBtns.forEach(btn => btn.classList.remove('active'));
    const data = calculateAcoustics(e.target.value);
    updateVisuals(data);
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const depth = btn.dataset.depth;
      depthSlider.value = depth;
      const data = calculateAcoustics(depth);
      updateVisuals(data);
    });
  });

  // ==========================================
  // WEB AUDIO REVERB & HELMHOLTZ SYNTHESIZER
  // ==========================================
  let audioCtx = null;

  function playAcousticSimulation(depthMm, sampleType) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      alert('Web Audio is not supported in this browser.');
      return;
    }

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const d = parseInt(depthMm, 10);
    const isBareRoom = sampleType === 'bare';

    // Master gain
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.7, now);
    masterGain.connect(audioCtx.destination);

    // Helmholtz notch / band-pass filter based on standoff cavity
    const filter = audioCtx.createBiquadFilter();
    if (isBareRoom) {
      // Harsh reflective room: high peak reverberant resonances at 250Hz & 3kHz
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(280, now);
      filter.Q.setValueAtTime(4.0, now);
      filter.gain.setValueAtTime(9.0, now);
    } else {
      // JOMETRY Absorption: Damps room modal resonances based on depth
      filter.type = 'lowshelf';
      const cutoff = interpolate(50, 2000, 180, 200, d);
      filter.frequency.setValueAtTime(cutoff, now);
      filter.gain.setValueAtTime(-8.0, now);
    }

    // Synthesize test excitation signal (transient impulse + reverberant decay)
    const decayTime = isBareRoom ? 2.4 : interpolate(50, 0.7, 180, 0.35, d);
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    // Sound profile
    if (sampleType === 'clap' || isBareRoom) {
      // Noise burst for room impulse
      const bufferSize = audioCtx.sampleRate * decayTime;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp(-i / (audioCtx.sampleRate * (decayTime / 4)));
        output[i] = (Math.random() * 2 - 1) * decay;
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start(now);
    } else {
      // Synthesized speech tone transient
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);

      oscGain.gain.setValueAtTime(0.8, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + decayTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      filter.connect(masterGain);

      osc.start(now);
      osc.stop(now + decayTime);
    }

    // Visual button feedback
    if (playAudioBtn) {
      playAudioBtn.textContent = isBareRoom 
        ? '🔊 Playing Untreated Bare Room (RT60: 2.4s)...' 
        : `🔊 Playing JOMETRY Tuned Absorber (${d}mm, RT60: ${decayTime.toFixed(2)}s)...`;
      setTimeout(() => {
        playAudioBtn.textContent = '▶ Listen to Room Acoustic Simulation';
      }, decayTime * 1000 + 400);
    }
  }

  if (playAudioBtn) {
    playAudioBtn.addEventListener('click', () => {
      const sample = audioSampleSelect ? audioSampleSelect.value : 'clap';
      playAcousticSimulation(depthSlider.value, sample);
    });
  }

  // Initial calculation (default 100mm medium depth)
  const initialData = calculateAcoustics(depthSlider.value || 100);
  updateVisuals(initialData);
}
