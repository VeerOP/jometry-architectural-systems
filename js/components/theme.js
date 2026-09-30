/* ==========================================================================
   THEME CONTROLLER (DARK / LIGHT MODE)
   ========================================================================== */

export function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const htmlEl = document.documentElement;

  // Get current theme from html attribute or localStorage
  function getCurrentTheme() {
    return htmlEl.getAttribute('data-theme') || localStorage.getItem('dwall_theme') || 'light';
  }

  function updateToggleIcon(theme) {
    if (!toggleBtn) return;
    if (theme === 'dark') {
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="theme-icon">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      toggleBtn.setAttribute('title', 'Switch to Light Mode');
      toggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="theme-icon">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      toggleBtn.setAttribute('title', 'Switch to Dark Mode');
      toggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  }

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('dwall_theme', theme);
    updateToggleIcon(theme);
    
    // Dispatch custom event if other components need to re-render (like SVG graphics)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  // Initial icon setup
  const current = getCurrentTheme();
  setTheme(current);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }
}
