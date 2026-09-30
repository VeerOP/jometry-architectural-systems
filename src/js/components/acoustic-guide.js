/* ==========================================================================
   ACOUSTIC SELECTION GUIDE INTERACTIVE WIDGET
   ========================================================================== */

export function initAcousticGuide(productData) {
  const selectEl = document.getElementById('acoustic-room-select');
  const resultEl = document.getElementById('acoustic-guide-result');

  if (!selectEl || !resultEl) return;

  const tuningGuide = productData.families.find(f => f.id === 'acoustic-wall')?.tuningGuide || [];

  selectEl.addEventListener('change', (e) => {
    const selectedRoom = e.target.value;
    const match = tuningGuide.find(g => g.roomType.toLowerCase().includes(selectedRoom.toLowerCase()));

    if (match) {
      resultEl.innerHTML = `
        <div class="callout-box clay" style="margin-top: 16px;">
          <span class="eyebrow" style="color: var(--color-acoustic-clay);">Recommended Specification Setup</span>
          <h4 style="font-size: 1.1rem; margin-top: 4px;">${match.roomType}</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px; font-family: var(--font-mono); font-size: 0.85rem;">
            <div><strong>Priority Spectrum:</strong> ${match.priority}</div>
            <div><strong>Required Standoff Depth:</strong> <span style="color: var(--color-acoustic-clay); font-weight: 600;">${match.standoff}</span></div>
          </div>
          <p style="font-size: 0.85rem; margin-top: 12px; color: var(--color-ink-soft);">
            Acoustic test data for the selected standoff depth and face perforation pattern will be issued with your project specification.
          </p>
        </div>
      `;
    } else {
      resultEl.innerHTML = `<p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-ink-faint); margin-top: 16px;">Select a room type above to view recommended standoff depth and frequency target.</p>`;
    }
  });
}
