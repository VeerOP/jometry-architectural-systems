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
import { initReadMore } from './components/read-more.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Initializing JOMETRY Architectural Platform (2026 Edition)...");

  // 1. Initialize Theme (Dark / Light Mode)
  initTheme();

  // 1b. Initialize Progressive Disclosure / Read More
  initReadMore();

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

  // Scroll Reveal Animations via IntersectionObserver with robust mobile handling
  const revealElements = document.querySelectorAll('.reveal');
  
  function checkInitialVisibility() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowHeight + 100) {
        el.classList.add('is-revealed');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px 80px 0px',
      threshold: 0
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  checkInitialVisibility();
  window.addEventListener('resize', checkInitialVisibility, { passive: true });

  // Header Scroll Progress Bar & Fixed Sticky Elevation
  const progressBar = document.getElementById('scroll-progress-bar');
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Toggle elevated shadow on scroll
    if (navbar) {
      if (scrollY > 15) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (progressBar) {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (scrollY / totalScroll) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });
});

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('active') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Close when clicking any link in drawer
  drawer.querySelectorAll('.mobile-nav-link, .btn-enquire-spec').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}
