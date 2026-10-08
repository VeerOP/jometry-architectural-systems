/* ==========================================================================
   JOMETRY ARCHITECTURAL DESIGN SYSTEM - PROGRESSIVE DISCLOSURE & READ MORE
   Streamlined content expansion with accessible toggle states
   ========================================================================== */

export function initReadMore() {
  // 1. Inline Read More / Deep Dive Buttons
  document.querySelectorAll('.btn-read-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSelector = btn.getAttribute('data-target');
      const targetContent = targetSelector 
        ? document.querySelector(targetSelector) 
        : btn.closest('.read-more-wrapper')?.querySelector('.read-more-content');
      
      if (!targetContent) return;
      
      const isExpanded = targetContent.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      
      const openLabel = btn.getAttribute('data-open-label') || '− Show Less';
      const closeLabel = btn.getAttribute('data-close-label') || '+ Read More';
      
      const labelText = isExpanded ? openLabel : closeLabel;
      btn.innerHTML = `${labelText} <span class="read-more-icon">▾</span>`;
    });
  });

  // 2. Collapsible Accordions (e.g. Lab Data Tables & Full Technical Specs)
  document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
      const targetSelector = header.getAttribute('data-target');
      const body = targetSelector 
        ? document.querySelector(targetSelector) 
        : header.nextElementSibling;
        
      if (!body) return;
      
      const isExpanded = body.classList.toggle('expanded');
      header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      
      const icon = header.querySelector('.collapsible-icon');
      if (icon) {
        icon.classList.toggle('rotated', isExpanded);
      }
    });
  });
}
