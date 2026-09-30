/* ==========================================================================
   JOMETRY ACTIVE BIOFILTRATION & 4-LAYER LEAK DEFENSE SIMULATOR
   Section 08 & Section 09 Dynamic Fluid Physics & Environmental Engineering
   ========================================================================== */

export function initBiofilterExplorer() {
  const fanSpeedBtns = document.querySelectorAll('.fan-speed-btn');
  const leakStepBtns = document.querySelectorAll('.leak-step-btn');
  const leakStepCard = document.getElementById('leak-step-card');
  const canvas = document.getElementById('biofilter-particle-canvas');
  const bioMetricsDisplay = document.getElementById('bio-metrics-display');
  const climateTabs = document.querySelectorAll('.facade-climate-tab');
  const climateInfo = document.getElementById('facade-climate-info');

  // ==========================================================
  // 1. DYNAMIC CANVAS PARTICLE AIRFLOW SIMULATION (ROOT ZONE)
  // ==========================================================
  let fanMode = 'standard'; // off, standard, boost
  let animFrameId = null;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth || 600);
    let height = (canvas.height = canvas.offsetHeight || 240);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth || 600;
      height = canvas.height = canvas.offsetHeight || 240;
    });

    const particles = [];
    const MAX_PARTICLES = 65;

    class AirParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = 20 + Math.random() * 80; // Start in room air
        this.y = 40 + Math.random() * (height - 80);
        this.baseSpeed = 1.2 + Math.random() * 0.8;
        this.size = 2.5 + Math.random() * 2.0;
        this.state = 'dirty'; // dirty (VOC), processing (root), clean (exhaust)
        this.alpha = 0.8;
      }

      update(speedMultiplier) {
        if (speedMultiplier === 0) {
          // Brownian motion when fan is off
          this.x += (Math.random() - 0.5) * 0.5;
          this.y += (Math.random() - 0.5) * 0.5;
          return;
        }

        const vx = this.baseSpeed * speedMultiplier;
        this.x += vx;

        // Turbulence
        this.y += Math.sin(this.x * 0.05) * 0.6;

        // Zone 1: Room Air (x: 20 to 140) -> Dirty grey/red
        if (this.x < 140) {
          this.state = 'dirty';
        }
        // Zone 2: Root Rhizosphere (x: 140 to 300) -> Microbial biofilter transition (green)
        else if (this.x >= 140 && this.x < 300) {
          this.state = 'processing';
        }
        // Zone 3: Ventilated Cavity Plenum (x: 300 to 450) -> Pure blue
        else if (this.x >= 300 && this.x < 450) {
          this.state = 'clean';
        }
        // Zone 4: Clean Air Exhaust (x: 450 to width)
        else if (this.x >= 450) {
          this.state = 'clean';
          this.alpha = Math.max(0, 1 - (this.x - 450) / (width - 450));
        }

        if (this.x > width || this.y < 20 || this.y > height - 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        if (this.state === 'dirty') {
          // Ambient VOCs / PM2.5 (Amber / Grey)
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
          ctx.shadowBlur = 4;
        } else if (this.state === 'processing') {
          // Microbial Rhizosphere breakdown (Lush Green)
          ctx.fillStyle = '#4ade80';
          ctx.shadowColor = 'rgba(74, 222, 128, 0.6)';
          ctx.shadowBlur = 6;
        } else {
          // Purified Oxygen (Cyan / Bright Blue)
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
          ctx.shadowBlur = 8;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = new AirParticle();
      p.x = 20 + Math.random() * (width - 60);
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      let mult = 1.0;
      if (fanMode === 'off') mult = 0;
      else if (fanMode === 'boost') mult = 2.4;

      particles.forEach(p => {
        p.update(mult);
        p.draw();
      });

      animFrameId = requestAnimationFrame(animate);
    }

    animate();
  }

  // ==========================================================
  // 2. FAN CONTROLLER & TELEMETRY
  // ==========================================================
  if (fanSpeedBtns.length > 0) {
    fanSpeedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        fanSpeedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        fanMode = btn.dataset.speed || 'standard';
        let cfm = '240 m³/h';
        let db = '21 dB (Whisper Silent)';
        let voc = 'Up to 85% Formaldehyde';

        if (fanMode === 'off') {
          cfm = '0 m³/h (Passive Diffusion)';
          db = '0 dB (Silent)';
          voc = '~15% (Passive Foliage)';
        } else if (fanMode === 'boost') {
          cfm = '480 m³/h (Active Flush)';
          db = '32 dB (Moderate)';
          voc = '85% Single-Pass Breakdown';
        }

        if (bioMetricsDisplay) {
          bioMetricsDisplay.innerHTML = `
            <span><strong>Air Exchange:</strong> ${cfm}</span> &nbsp;·&nbsp;
            <span><strong>Acoustic Emission:</strong> ${db}</span> &nbsp;·&nbsp;
            <span><strong>VOC Purification:</strong> ${voc}</span>
          `;
        }
      });
    });
  }

  // ==========================================================
  // 3. 4-LAYER LEAK DEFENSE INTERACTIVE ARCHITECTURE
  // ==========================================================
  const leakSteps = [
    {
      step: "01",
      title: "1. Impermeable Recycled Polymer Cassette Body",
      description: "Each 500 × 500 mm cassette is thermoformed from recycled polymer with a 100% watertight rear body. Water is wicked evenly through a rigid inert inorganic medium with zero soil, preventing soil-borne pathogens, fungal gnats, and mold.",
      metric: "100% Watertight Backing · Zero Soil / Zero Pathogens"
    },
    {
      step: "02",
      title: "2. Cavity Drip Tray & Internal Collection Channel",
      description: "Concealed stainless-steel drip channels and inter-cassette EPDM labyrinth gaskets catch and route surplus moisture directly into the internal drainage raceway behind the elevation.",
      metric: "Stainless Steel 304 Drip Rails & EPDM Gaskets"
    },
    {
      step: "03",
      title: "3. Automated Smart Moisture Sensors with Shut-Off",
      description: "Dual IoT moisture probes monitor saturation telemetry in real-time. If abnormal condensation or pooling is sensed, automated solenoid shut-off valves close within 1.2 seconds to isolate the branch.",
      metric: "1.2s Fail-Safe Solenoid Zone Isolation"
    },
    {
      step: "04",
      title: "4. Dedicated Drainage Manifold (Never Touches Building Slab)",
      description: "All surplus water is routed through a dedicated gravity drainage manifold directly into the building's greywater circuit or recirculation sump — completely isolated from building slabs, plaster, or drywall partitions.",
      metric: "0 mm Slab Contact · Direct Greywater Integration"
    }
  ];

  if (leakStepBtns.length > 0) {
    leakStepBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        leakStepBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const stepData = leakSteps[index] || leakSteps[0];
        if (leakStepCard) {
          leakStepCard.innerHTML = `
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-living-moss); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;">
              4-Layer Leak Defense — Layer ${stepData.step} / 04
            </div>
            <h4 style="font-size: 1.2rem; margin-bottom: 8px; color: var(--color-ink);">${stepData.title}</h4>
            <p style="font-size: 0.92rem; line-height: 1.6; color: var(--color-ink-soft); margin-bottom: 14px;">${stepData.description}</p>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; background: var(--color-living-moss-light); color: var(--color-living-moss); padding: 10px 16px; border-radius: 2px; display: inline-block; font-weight: 600;">
              🛡️ ${stepData.metric}
            </div>
          `;
        }
      });
    });
  }

  // ==========================================================
  // 4. EXTERIOR LIVING FACADE CLIMATE SIMULATOR (PAGE 10)
  // ==========================================================
  const climateData = {
    wind: {
      title: "WIND & SEISMIC RESISTANCE: Tested to 2.4 kPa",
      desc: "Positive and negative cyclonic wind pressure cycles verified to withstand tropical monsoon typhoons, high-rise wind shearing, and structural inter-story building sway without cassette dislodgement.",
      badge: "2.4 kPa Positive/Negative Pressure Tested"
    },
    cooling: {
      title: "MICROCLIMATE COOLING: -14°C Facade Temp Attenuation",
      desc: "Evapotranspiration through the living botanical layer slashes exterior wall surface temperature by up to 14°C, drastically lowering HVAC cooling loads and mitigating the urban heat island effect.",
      badge: "-14°C Exterior Thermal Attenuation"
    },
    stormwater: {
      title: "STORMWATER BUFFERING: 45 L/m² Water Retention",
      desc: "Rigid inorganic wicking matrix absorbs and buffers torrential monsoon downpours, reducing civic stormwater runoff peaks and integrating seamlessly with building greywater recycling loops.",
      badge: "45 L/m² Peak Monsoon Stormwater Retention"
    }
  };

  if (climateTabs.length > 0) {
    climateTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        climateTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const key = tab.dataset.climate || 'wind';
        const data = climateData[key] || climateData.wind;

        if (climateInfo) {
          climateInfo.innerHTML = `
            <h4 style="margin: 0 0 8px; color: var(--color-living-moss);">${data.title}</h4>
            <p style="font-size: 0.92rem; color: var(--color-ink-soft); line-height: 1.6; margin-bottom: 12px;">${data.desc}</p>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; background: var(--color-living-moss-light); color: var(--color-living-moss); padding: 8px 14px; border-radius: 2px; display: inline-block; font-weight: 600;">
              ${data.badge}
            </div>
          `;
        }

        // Trigger visual effect on exterior graphic if present
        const facadeSvg = document.getElementById('facade-sim-graphic');
        if (facadeSvg) {
          facadeSvg.className = `facade-sim-stage mode-${key}`;
        }
      });
    });
  }
}
