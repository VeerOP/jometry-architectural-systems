/* ==========================================================================
   4-LAYER CAVITY ANATOMY & 3-MOVE DEMO EXPLORER
   Inspired by Mobilane & Clestra
   ========================================================================== */

export function initCavityExploder() {
  const layerTabs = document.querySelectorAll('.cavity-layer-tab');
  const layerViewer = document.getElementById('cavity-layer-viewer');
  const layerInfoTitle = document.getElementById('cavity-info-title');
  const layerInfoDesc = document.getElementById('cavity-info-desc');
  const layerInfoSpecs = document.getElementById('cavity-info-specs');

  const layerData = {
    1: {
      title: "Layer 01 — Building Substrate Wall",
      desc: "The rough host structure (concrete core, lightweight blockwork, or existing plasterboard). D'WALL isolates entirely from substrate imperfections — compensating for up to ±25 mm of surface out-of-plumb without shimming or wet plaster.",
      specs: [
        "Compatibility: Concrete, masonry, stud walls, structural steel",
        "Tolerances: Accommodates ±25 mm surface unevenness",
        "Acoustic Decoupling: Neoprene acoustic dampeners isolate vibrations"
      ],
      diagramHighlight: "substrate"
    },
    2: {
      title: "Layer 02 — Concealed Sub-frame & Patented Nodes",
      desc: "Cold-rolled structural aluminum vertical mullions and backer plates carrying the patented toolless mounting nodes. Each node supports up to 85 kg shear load while permitting instant snap-fit installation and micro-adjusted plumb alignment.",
      specs: [
        "Material: Architectural grade 6063-T6 extruded aluminum",
        "Mounting Node: Patented dual-action spring-retention clip",
        "Service Life: Rated for 500+ demount/remount cycles without wear"
      ],
      diagramHighlight: "subframe"
    },
    3: {
      title: "Layer 03 — Continuous Service Cavity (50–180 mm)",
      desc: "The open raceway behind the wall. Unlike studs packed with fiberglass, D'WALL provides organized, accessible runs on multi-tier cable ladders for LV power, Cat6A data, HVAC condensate, or drip irrigation lines.",
      specs: [
        "Standoff Range: 50 mm (Shallow) to 180 mm (Deep MEP zone)",
        "Service Segregation: Dedicated power, data, and wet line channels",
        "Acoustic Infill: Tunable semi-rigid absorptive polyester or mineral batt"
      ],
      diagramHighlight: "cavity"
    },
    4: {
      title: "Layer 04 — Demountable Finished Face Panels (500×500 mm)",
      desc: "The finished architectural elevation. Individual panels release independently in seconds with zero tools. Outlets, switchgear, and thermostats mount directly flush into the panel face and relocate simply by swapping tile locations.",
      specs: [
        "Module Baseline: 500 × 500 mm (Custom modules available to spec)",
        "Face Typologies: Slotted Acoustic, Solid Hygiene, Backlit LED, Planted",
        "Demount Speed: Under 15 seconds per panel, zero dust generated"
      ],
      diagramHighlight: "face"
    }
  };

  if (layerTabs.length > 0) {
    layerTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        layerTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const layerId = tab.dataset.layer;
        const data = layerData[layerId] || layerData[1];

        if (layerInfoTitle) layerInfoTitle.textContent = data.title;
        if (layerInfoDesc) layerInfoDesc.textContent = data.desc;
        if (layerInfoSpecs) {
          layerInfoSpecs.innerHTML = data.specs.map(s => `<li>${s}</li>`).join('');
        }

        // Highlight SVG parts if present
        document.querySelectorAll('.cavity-svg-part').forEach(part => {
          part.classList.toggle('highlighted', part.dataset.part === data.diagramHighlight);
        });
      });
    });
  }

  // 3-Move Access Step switcher
  const stepCards = document.querySelectorAll('.sequence-interactive-card');
  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      stepCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}
