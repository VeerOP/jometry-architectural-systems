/* ==========================================================================
   JOMETRY MODULAR ARCHITECTURAL PLATFORM - MASTER CONTROLLER
   MACR MAYR INDIA PVT LTD · MUMBAI · 2026 EDITION
   ========================================================================== */

import { fetchProductData, getAllVariants } from './data.js';
import { initTheme } from './components/theme.js';
import { initHeroVisualizer } from './components/hero-visualizer.js';
import { initCavityExploder } from './components/cavity-exploder.js';
import { initNodeSimulator } from './components/node-simulator.js';
import { initTileStudio } from './components/tile-studio.js';
import { initAcousticSimulator } from './components/acoustic-simulator.js';
import { initBiofilterExplorer } from './components/biofilter-flow.js';
import { initFacadeSimulator } from './components/facade-simulator.js';
import { initProductFilters } from './components/filters.js';
import { initSpecBuilder } from './components/spec-builder.js';
import { initEnquiryModal, openEnquiryModal } from './components/modal.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Initializing JOMETRY Architectural Platform (2026 Edition)...");

  // 1. Initialize Theme (Dark / Light Mode)
  initTheme();

  // 2. Fetch Core Product Data
  const productData = await fetchProductData();
  const allVariants = productData ? getAllVariants(productData) : [];

  // 3. Global Modals & Enquiry
  initEnquiryModal();

  // 4. Mobile Menu Controller
  initMobileMenu();

  // Navbar Action CTA button
  const navEnquireBtn = document.getElementById('nav-enquire-btn');
  if (navEnquireBtn) {
    navEnquireBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openEnquiryModal('JOMETRY Universal Platform General Specification & Samples');
    });
  }

  // Detect active page from URL path
  const path = window.location.pathname.toLowerCase();
  const isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('/');
  const isService = path.includes('service-wall');
  const isAcoustics = path.includes('acoustics');
  const isLiving = path.includes('living-wall');
  const isFacadeLight = path.includes('facade-light');
  const isSpecs = path.includes('specifications');

  // Highlight active desktop & mobile nav link
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (
      (isHome && (href === 'index.html' || href === './index.html' || href === '/')) ||
      (isService && href.includes('service-wall')) ||
      (isAcoustics && href.includes('acoustics')) ||
      (isLiving && href.includes('living-wall')) ||
      (isFacadeLight && href.includes('facade-light')) ||
      (isSpecs && href.includes('specifications'))
    ) {
      link.classList.add('active');
    }
  });

  // Page-specific initializers:
  if (document.getElementById('hero-headline')) {
    initHeroVisualizer();
  }

  if (document.getElementById('node-simulator-container')) {
    initNodeSimulator();
  }

  if (document.getElementById('cavity-layer-viewer') || document.querySelector('.cavity-layer-tab')) {
    initCavityExploder();
  }

  if (document.getElementById('studio-grid')) {
    initTileStudio();
  }

  if (document.getElementById('cavity-depth-slider')) {
    initAcousticSimulator();
  }

  if (document.getElementById('biofilter-particle-canvas') || document.querySelector('.fan-speed-btn')) {
    initBiofilterExplorer();
  }

  if (document.getElementById('facade-light-stage') || document.getElementById('facade-daynight-toggle')) {
    initFacadeSimulator();
  }

  const variantsGridEl = document.getElementById('variants-grid');
  if (variantsGridEl && allVariants.length > 0) {
    initProductFilters(allVariants, variantsGridEl);
  }

  if (document.getElementById('spec-family-select')) {
    initSpecBuilder();
  }

  // Scroll Reveal Animations via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Header Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress-bar');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
});

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close when clicking backdrop
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('active') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Close when clicking any nav link
  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}
