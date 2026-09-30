/* ==========================================================================
   JOMETRY CINEMATIC HERO 4-TYPOLOGY SWITCHER
   Universal Platform Interactive Switcher
   ========================================================================== */

export function initHeroVisualizer() {
  const tabs = document.querySelectorAll('.hero-pillar-tab');
  const bgLayers = document.querySelectorAll('.hero-bg-layer');
  const headlineEl = document.getElementById('hero-headline');
  const subheadEl = document.getElementById('hero-subhead');
  const leadEl = document.getElementById('hero-lead');
  const metricBadgeEl = document.getElementById('hero-metric-badge');
  const heroCtaEl = document.getElementById('hero-cta-btn');

  const heroData = {
    'service': {
      title: "Buildings change.<br>Walls don't. Until now.",
      subhead: "01. Service Wall · Demountable Precision Dry Wall Cladding",
      lead: "A precision modular dry wall cladding system where every cable, conduit, and connection behind the surface stays reachable for the life of the building. Add, move, or maintain services in minutes with zero dust, zero trades, and zero downtime.",
      metric: "⚡ Access in <3 Min · 0 Wet Trades · Patented WallClick Node",
      ctaText: "Explore Service Wall System",
      ctaHref: "service-wall.html",
      bgIndex: 0
    },
    'acoustic': {
      title: "The cavity is the absorber.<br>Acoustic physics tuned to geometry.",
      subhead: "02. Acoustic Control · Helmholtz Resonant Cavity Tuning",
      lead: "Most acoustic panels are a material problem. Ours is a geometry problem. A slotted face over an air cavity acts as a Helmholtz resonant absorber. The depth of that cavity determines which frequencies are absorbed (NRC 0.80–0.95).",
      metric: "🎵 Helmholtz Absorption (NRC 0.80–0.95) · STI > 0.75 · 500×500 mm Grid",
      ctaText: "Launch Interactive Tile Studio",
      ctaHref: "acoustics.html",
      bgIndex: 1
    },
    'living': {
      title: "The living wall you can take apart.<br>Living plants as building services.",
      subhead: "03. Living Bio-Wall · Modular Botanical Cassettes & Biofiltration",
      lead: "Replaces tedious on-site gardening with pre-cultivated cassette exchange. Ambient room air is actively drawn through the living root rhizosphere into the negative-pressure cavity, cleansing up to 85% formaldehyde with 4-layer leak defense.",
      metric: "🌿 85% VOC Reduction · 4-Layer Leak Defense · -14°C Microclimate Cooling",
      ctaText: "Explore Living Wall & Biofiltration",
      ctaHref: "living-wall.html",
      bgIndex: 2
    },
    'facade-light': {
      title: "Illuminated elevations & rainscreens.<br>Concealed LED backlighting.",
      subhead: "04. Facade & Light · Architectural Dual-Function Elevations",
      lead: "Concealed warm 2700K/3000K museum-grade LED illumination integrated behind laser-cut acoustic slots and exterior rainscreens tested for 2.4 kPa cyclonic wind load, all sharing identical node geometry.",
      metric: "💡 DALI-2 Dimmable to 0.1% · High CRI > 90 · 2.4 kPa Wind Load Tested",
      ctaText: "Explore Facade & Light",
      ctaHref: "facade-light.html",
      bgIndex: 3
    }
  };

  function switchPillar(pillarKey) {
    const data = heroData[pillarKey];
    if (!data) return;

    tabs.forEach(t => t.classList.toggle('active', t.dataset.pillar === pillarKey));

    bgLayers.forEach((layer, idx) => {
      layer.classList.toggle('active', idx === data.bgIndex);
    });

    if (headlineEl) {
      headlineEl.style.opacity = '0';
      setTimeout(() => {
        headlineEl.innerHTML = data.title;
        headlineEl.style.opacity = '1';
      }, 150);
    }

    if (subheadEl) subheadEl.textContent = data.subhead;
    if (leadEl) leadEl.textContent = data.lead;
    if (metricBadgeEl) metricBadgeEl.innerHTML = data.metric;
    if (heroCtaEl) {
      heroCtaEl.textContent = data.ctaText;
      heroCtaEl.setAttribute('href', data.ctaHref);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchPillar(tab.dataset.pillar);
    });
  });
}
