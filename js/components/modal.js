/* ==========================================================================
   JOMETRY SPECIFICATION MODAL & SLIDE-OUT PRODUCT SPEC DRAWER
   Technical Consultation & Material Sample Desk
   ========================================================================== */

export function initEnquiryModal() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-enquire-spec')) {
      const btn = e.target.closest('.btn-enquire-spec');
      const variantName = btn.getAttribute('data-variant') || 'JOMETRY System';
      openEnquiryModal(variantName);
    }
  });
}

export function openSpecDrawer(variant) {
  let drawer = document.getElementById('spec-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'spec-drawer';
    drawer.className = 'drawer-overlay';
    document.body.appendChild(drawer);
  }

  const isDev = variant.status.includes('Development') || variant.status.includes('Indicative');

  drawer.innerHTML = `
    <div class="drawer-container">
      <button class="drawer-close" id="close-drawer">&times;</button>
      
      <div class="drawer-header">
        <span class="eyebrow">${variant.typologyName || 'JOMETRY Platform'} · Technical Specification</span>
        <h2 style="font-size: 1.8rem; margin: 4px 0 8px;">${variant.name}</h2>
        <span class="status-badge ${isDev ? 'development' : 'production'}">${variant.status}</span>
      </div>

      <div class="drawer-body">
        ${variant.image ? `
          <div style="width: 100%; height: 240px; overflow: hidden; border-radius: 2px; margin-bottom: 20px; border: 1px solid var(--color-rule); position: relative;">
            <img src="${variant.image}" alt="${variant.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
            ${isDev ? '<span class="concept-badge">Concept Rendering</span>' : '<span class="prod-badge">Mumbai Engineered</span>'}
          </div>
        ` : ''}

        <p class="lead" style="font-size: 1rem; margin-bottom: 16px;">${variant.description}</p>

        <div style="background: var(--color-paper-alt); padding: 16px; border: 1px solid var(--color-rule); margin-bottom: 20px;">
          <h4 style="font-size: 0.95rem; margin-bottom: 8px;">Core Engineering Parameters</h4>
          <table class="spec-table" style="margin: 0; font-size: 0.82rem;">
            <tr><td>Standard Module</td><td>500 × 500 mm precision cassette (30 mm profile)</td></tr>
            <tr><td>Mounting Interface</td><td>Patented WallClick Node (Die-Cast Zinc & SS304)</td></tr>
            <tr><td>Face Typology</td><td>${variant.faceOption || '6-Rib fluted / laser-cut slotted face'}</td></tr>
            <tr><td>Standoff Range</td><td>50 mm to 220 mm continuous raceway (Custom to 350 mm)</td></tr>
            <tr><td>Demountability</td><td>100% toolless 3-move access, >500 removal cycles</td></tr>
            <tr><td>Fire Performance</td><td>Class 1 / Class A (ASTM E84 / EN 13501, BS 476 Part 6 & 7)</td></tr>
            <tr><td>Acoustic STC</td><td>STC 48–54 with cavity infill & EPDM gaskets</td></tr>
          </table>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <button class="btn-primary btn-enquire-spec" data-variant="${variant.name}" style="flex: 2;">
            Request Architectural Spec &amp; BIM
          </button>
          <button class="btn-secondary" id="drawer-copy-btn" style="flex: 1;">
            Copy Code
          </button>
        </div>
      </div>
    </div>
  `;

  drawer.classList.add('active');

  document.getElementById('close-drawer').addEventListener('click', () => {
    drawer.classList.remove('active');
  });

  const copyBtn = document.getElementById('drawer-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(`JOMETRY Variant: ${variant.name} (${variant.id})`).then(() => {
        copyBtn.textContent = '✓ Copied';
        setTimeout(() => { copyBtn.textContent = 'Copy Code'; }, 2000);
      });
    });
  }
}

export function openEnquiryModal(presetVariant = '') {
  let modal = document.getElementById('enquiry-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'enquiry-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" id="close-enquiry">&times;</button>
      <span class="eyebrow">MACR MAYR INDIA PVT LTD · MUMBAI</span>
      <h2 style="margin-bottom: 8px;">Specification &amp; Architectural Consultation Desk</h2>
      <p style="margin-bottom: 20px; font-size: 0.9rem; color: var(--color-ink-soft);">
        DWG CAD details, Revit BIM 2026 families, acoustic chamber reports, custom standoff calculations, and physical material sample boxes available on request.
      </p>

      <form id="enquiry-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-input" required placeholder="Architect / Consultant Name" />
          </div>
          <div class="form-group">
            <label class="form-label">Firm / Practice / Client *</label>
            <input type="text" class="form-input" required placeholder="Design Studio / Developer" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">Official Email *</label>
            <input type="email" class="form-input" required placeholder="architect@firm.com" />
          </div>
          <div class="form-group">
            <label class="form-label">Contact Number</label>
            <input type="tel" class="form-input" placeholder="+91 98..." />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Selected System / Specification Code</label>
          <input type="text" class="form-input" id="modal-spec-code" value="${presetVariant}" placeholder="e.g. JOM-ACST-500-ST100-CHARCOAL-SLOTTED" />
        </div>

        <div class="form-group">
          <label class="form-label">Requested Deliverables</label>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 0.85rem; margin-top: 6px;">
            <label style="display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked /> CAD / DWG Section Details</label>
            <label style="display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked /> Physical Material Sample Box</label>
            <label style="display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked /> Revit BIM 2026 3D Family</label>
            <label style="display: flex; align-items: center; gap: 6px;"><input type="checkbox" /> Mumbai Project Site Visit</label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Project Scope / MEP Requirements</label>
          <textarea class="form-textarea" rows="3" placeholder="Project typology, wall elevation area (sq.m), services behind wall (power, data, AV, healthcare, or biofiltration)..."></textarea>
        </div>
        
        <button type="submit" class="btn-primary" style="margin-top: 8px;">Dispatch Specification Request</button>
      </form>
    </div>
  `;

  modal.classList.add('active');

  document.getElementById('close-enquiry').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  document.getElementById('enquiry-form').addEventListener('submit', (e) => {
    e.preventDefault();
    modal.querySelector('.modal-content').innerHTML = `
      <span class="eyebrow" style="color: var(--color-service-blue);">Request Confirmed</span>
      <h2 style="margin: 12px 0;">Specification Package In Progress</h2>
      <p style="margin-bottom: 20px; line-height: 1.6; color: var(--color-ink-soft);">
        Thank you. Our engineering team at <strong>MACR MAYR India Pvt Ltd (Mumbai)</strong> has received your project details. We will dispatch the requested CAD details, Revit BIM families, acoustic reports, and physical finish samples.
      </p>
      <div style="font-family: var(--font-mono); font-size: 0.82rem; background: var(--color-paper-alt); padding: 14px; border: 1px solid var(--color-rule); margin-bottom: 24px;">
        Direct Mumbai Specification Desk: <span style="color: var(--color-service-blue);">project@jometry.in</span> · +91 (022) 6700-DWALL
      </div>
      <button class="btn-primary" onclick="document.getElementById('enquiry-modal').classList.remove('active')">Return to Platform</button>
    `;
  });
}
