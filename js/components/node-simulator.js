/* ==========================================================================
   JOMETRY WALLCLICK NODE & 3-MOVE DEMOUNTING SIMULATOR
   Section 03 & 04 Mechanics Interactive Simulator
   ========================================================================== */

export function initNodeSimulator() {
  const container = document.getElementById('node-simulator-container');
  if (!container) return;

  const stepBtns = container.querySelectorAll('.sim-step-btn');
  const actionBtn = document.getElementById('sim-action-btn');
  const simStage = document.getElementById('sim-stage');
  const forceGauge = document.getElementById('sim-force-gauge');
  const alignmentGauge = document.getElementById('sim-alignment-gauge');
  const stepTitle = document.getElementById('sim-step-title');
  const stepDesc = document.getElementById('sim-step-desc');
  const tierTabs = container.querySelectorAll('.raceway-tier-tab');
  const tierInfo = document.getElementById('raceway-tier-info');

  let currentStep = 1; // 1: Release, 2: Open, 3: Close

  const stepsData = {
    1: {
      stepNum: '01',
      title: 'STEP 01 — RELEASE: Press & Disengage',
      desc: 'Technician applies calibrated inward pressure (180 N) to release the concealed spring clips without face tools, suction lifters, or pry bars. Surrounding panels remain 100% undisturbed.',
      forceText: '180 N Calibrated Inward Pressure',
      alignmentText: '±0.00 mm (Locked in Grid)',
      panelClass: 'state-pressed',
      actionText: 'Next: Lift Straight Off →'
    },
    2: {
      stepNum: '02',
      title: 'STEP 02 — OPEN: Lift Straight Off',
      desc: 'Panel lifts off parallel to the elevation, completely exposing the full cavity width (50–220 mm) with segregated multi-tier raceways for power, optical data, acoustics, and air plenum.',
      forceText: '0 N (Free in Hand)',
      alignmentText: 'Demounted (Cavity 100% Exposed)',
      panelClass: 'state-open',
      actionText: 'Next: Snap & Self-Index →'
    },
    3: {
      stepNum: '03',
      title: 'STEP 03 — CLOSE: Snap & Self-Index',
      desc: 'Panel snaps flush into the grid. Sub-millimeter alignment is retained by conical indexing nodes and EPDM elastomeric isolation rings that eliminate acoustic flanking and panel rattle.',
      forceText: 'Retention Engaged (>500 Cycles)',
      alignmentText: '±0.25 mm True Position',
      panelClass: 'state-closed',
      actionText: 'Restart 3-Move Demo ⟳'
    }
  };

  const racewayTiers = {
    1: {
      title: "TIER 01 · POWER (230V Mains & UPS)",
      spec: "Grounded metallic raceway isolating high-voltage lines from data interference with continuous EMI barrier."
    },
    2: {
      title: "TIER 02 · DATA (Cat6A / Fiber Trunking)",
      spec: "Dedicated optical conduits with 50mm bend radii for high-speed IT networks and low-latency building backbone."
    },
    3: {
      title: "TIER 03 · Continuous Service Cavity (45 kg/m³ Acoustic Infill)",
      spec: "High-density mineral wool batts dampen reverberation and eliminate inter-room sound transmission (STC 48–54)."
    },
    4: {
      title: "TIER 04 · AIRFLOW (Negative Pressure)",
      spec: "Continuous cavity ventilation draws ambient room air through living bio-cassettes for root-zone purification."
    }
  };

  function setStep(step) {
    currentStep = step;
    const data = stepsData[step];

    stepBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.step, 10) === step);
    });

    if (simStage) {
      simStage.className = `sim-stage-canvas ${data.panelClass}`;
    }

    if (stepTitle) stepTitle.textContent = data.title;
    if (stepDesc) stepDesc.textContent = data.desc;
    if (forceGauge) forceGauge.textContent = data.forceText;
    if (alignmentGauge) alignmentGauge.textContent = data.alignmentText;
    if (actionBtn) actionBtn.textContent = data.actionText;

    // Trigger visual spring/node animations
    const nodes = container.querySelectorAll('.sim-node-point');
    nodes.forEach(node => {
      if (step === 1) {
        node.classList.add('node-trigger');
      } else if (step === 2) {
        node.classList.remove('node-trigger');
        node.classList.add('node-detached');
      } else {
        node.classList.remove('node-trigger', 'node-detached');
        node.classList.add('node-locked');
      }
    });
  }

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      setStep(step);
    });
  });

  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      let nextStep = currentStep + 1;
      if (nextStep > 3) nextStep = 1;
      setStep(nextStep);
    });
  }

  // Multi-tier raceway switcher
  if (tierTabs.length > 0) {
    tierTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tierTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const tierId = tab.dataset.tier;
        const tier = racewayTiers[tierId] || racewayTiers[1];

        if (tierInfo) {
          tierInfo.innerHTML = `
            <h4 style="margin: 0 0 6px 0; color: var(--color-service-blue);">${tier.title}</h4>
            <p style="margin: 0; font-size: 0.9rem; color: var(--color-ink-soft); line-height: 1.5;">${tier.spec}</p>
          `;
        }

        // Highlight SVG tier lines
        container.querySelectorAll('.raceway-tier-path').forEach(p => {
          p.classList.toggle('active-tier', p.dataset.tier === tierId);
        });
      });
    });
  }

  // Interactive 3D drag / tilt on simulation stage
  if (simStage) {
    let isDragging = false;
    let startX = 0;
    let currentRotation = -15;

    simStage.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      simStage.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const rot = Math.max(-45, Math.min(25, currentRotation + deltaX * 0.2));
      const board = simStage.querySelector('.isometric-assembly');
      if (board) {
        board.style.transform = `rotateX(55deg) rotateZ(${rot}deg)`;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        simStage.style.cursor = 'grab';
      }
    });
  }

  // Initialize at Step 1
  setStep(1);
}
