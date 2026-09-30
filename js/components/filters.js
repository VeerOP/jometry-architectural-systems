/* ==========================================================================
   JOMETRY PRODUCT FILTER & DISCOVERY COMPONENT
   Catalogue Discovery Engine for 4 Architectural Typologies
   ========================================================================== */

import { openSpecDrawer, openEnquiryModal } from './modal.js';

export function initProductFilters(variants, containerEl) {
  if (!containerEl) return;

  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');
      renderFilteredVariants(variants, filterCategory, containerEl);
    });
  });

  // Check URL query param for default filter
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter') || 'all';

  const initialBtn = Array.from(filterButtons).find(b => b.getAttribute('data-filter') === filterParam);
  if (initialBtn) {
    filterButtons.forEach(b => b.classList.remove('active'));
    initialBtn.classList.add('active');
    renderFilteredVariants(variants, filterParam, containerEl);
  } else {
    renderFilteredVariants(variants, 'all', containerEl);
  }
}

function renderFilteredVariants(variants, filter, containerEl) {
  const filtered = variants.filter(v => {
    if (filter === 'all') return true;
    if (filter === 'production') return v.typologyStatus === 'Production' || v.status === 'Production';
    if (filter === 'development') return v.status.includes('Development') || v.status.includes('Commissioned');
    return v.typologyId === filter || v.familyId === filter;
  });

  if (filtered.length === 0) {
    containerEl.innerHTML = `<p class="lead" style="grid-column: 1/-1; text-align: center; padding: 40px 0;">No variants match the selected filter.</p>`;
    return;
  }

  containerEl.innerHTML = filtered.map(v => {
    const isDev = (v.status && (v.status.includes('Development') || v.status.includes('Indicative')));
    const badgeClass = isDev ? 'development' : 'production';
    
    const imgHtml = v.image ? `
      <div class="card-thumb-wrap" style="height: 180px; overflow: hidden; position: relative;">
        <img src="${v.image}" alt="${v.name}" class="card-thumb-img" style="width:100%; height:100%; object-fit: cover;" onerror="this.style.display='none'">
        <div class="prod-badge">${v.status || 'Production · Mumbai'}</div>
      </div>
    ` : '';
    
    return `
      <div class="product-card hover-lift" data-id="${v.id}" data-typology="${v.typologyId}">
        ${imgHtml}
        <div class="product-card-header" style="padding: 16px 16px 8px;">
          <div>
            <span class="eyebrow" style="color: var(--color-service-blue);">${v.typologyName || 'JOMETRY System'}</span>
            <h3 class="product-title" style="font-size: 1.15rem; margin: 4px 0 6px;">${v.name}</h3>
          </div>
          <span class="status-badge ${badgeClass}" style="font-size: 0.7rem;">${v.status}</span>
        </div>
        
        <div class="product-card-body" style="padding: 0 16px 16px;">
          <p class="product-card-desc" style="font-size: 0.86rem; color: var(--color-ink-soft); line-height: 1.5; margin-bottom: 12px;">${v.description}</p>
          <div class="product-card-spec-tag" style="font-family: var(--font-mono); font-size: 0.75rem; background: var(--color-paper-alt); padding: 6px 10px; border-radius: 2px;">
            <strong>Face:</strong> ${v.faceOption || 'Standard 500 × 500 mm Cassette'}
          </div>
        </div>
        
        <div class="product-card-footer" style="padding: 12px 16px; border-top: 1px solid var(--color-rule); display: flex; gap: 8px;">
          <button class="btn-secondary btn-quick-spec" data-id="${v.id}" style="flex: 1; padding: 8px; font-size: 0.75rem;">Quick Spec</button>
          <button class="btn-nav-action btn-enquire-spec" data-variant="${v.name}" style="flex: 1; padding: 8px; font-size: 0.75rem; justify-content: center;">Enquire</button>
        </div>
      </div>
    `;
  }).join('');

  // Bind Quick Spec Drawer events
  containerEl.querySelectorAll('.btn-quick-spec').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const variant = variants.find(v => v.id === id);
      if (variant) openSpecDrawer(variant);
    });
  });
}
