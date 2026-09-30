/* ==========================================================================
   PRODUCT VARIANT COMPARISON COMPONENT
   ========================================================================== */

let selectedForComparison = [];

export function initComparison(allVariants) {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-compare')) {
      const variantId = e.target.getAttribute('data-id');
      toggleComparison(variantId, allVariants);
    }
  });
}

function toggleComparison(variantId, allVariants) {
  const variant = allVariants.find(v => v.id === variantId);
  if (!variant) return;

  const index = selectedForComparison.findIndex(v => v.id === variantId);
  if (index >= 0) {
    selectedForComparison.splice(index, 1);
  } else {
    if (selectedForComparison.length >= 3) {
      alert('You can compare up to 3 variants at a time.');
      return;
    }
    selectedForComparison.push(variant);
  }

  updateComparisonUI();
  if (selectedForComparison.length >= 2) {
    openComparisonModal();
  }
}

function updateComparisonUI() {
  document.querySelectorAll('.btn-compare').forEach(btn => {
    const id = btn.getAttribute('data-id');
    const isSelected = selectedForComparison.some(v => v.id === id);
    if (isSelected) {
      btn.classList.add('active');
      btn.innerText = 'Selected ✓';
    } else {
      btn.classList.remove('active');
      btn.innerText = 'Compare';
    }
  });
}

function openComparisonModal() {
  let modal = document.getElementById('comparison-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'comparison-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 960px;">
      <button class="modal-close" id="close-comparison">&times;</button>
      <span class="eyebrow">Product Specification Comparison</span>
      <h2 style="margin-bottom: 24px;">Comparing ${selectedForComparison.length} Product Variants</h2>
      
      <div style="display: grid; grid-template-columns: repeat(${selectedForComparison.length}, 1fr); gap: 16px; overflow-x: auto;">
        ${selectedForComparison.map(v => `
          <div style="border: 1px solid var(--color-rule); padding: 16px; background: var(--color-paper-card); border-radius: var(--radius-subtle);">
            <span class="status-badge ${v.status.includes('Production') ? 'production' : 'development'}" style="margin-bottom: 8px;">${v.status}</span>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-ink-faint);">${v.familyName}</div>
            <h3 style="font-size: 1.1rem; margin: 4px 0 12px;">${v.name}</h3>
            <p style="font-size: 0.85rem; margin-bottom: 16px;">${v.description}</p>
            
            <table class="spec-table" style="font-size: 0.8rem;">
              <tbody>
                <tr><td>Face</td><td>${v.faceOption || 'To spec'}</td></tr>
                <tr><td>Mounting</td><td>Toolless Clip</td></tr>
                <tr><td>Module</td><td>500×500 mm</td></tr>
              </tbody>
            </table>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: 24px; text-align: right;">
        <button class="btn-secondary" id="clear-comparison">Clear Selection</button>
      </div>
    </div>
  `;

  modal.classList.add('active');

  document.getElementById('close-comparison').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  document.getElementById('clear-comparison').addEventListener('click', () => {
    selectedForComparison = [];
    updateComparisonUI();
    modal.classList.remove('active');
  });
}
