/**
 * Sharma Printers — Interactive Homepage Engine (2026)
 * Vanilla JavaScript (ES6+) with zero dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initHeroParallax();
  initServicesToggle();
  initServiceSelectTriggers();
  initShowcaseFilterAndModal();
  initCountUp();
  initScrollReveal();
  initQuoteForm();
  initBackToTop();
  initAddressCopy();
});

/* --------------------------------------------------------------------------
   1. SCROLL PROGRESS INDICATOR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. NAVBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  // Navbar background change on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close on clicking nav links inside mobile drawer
    mobileDrawer.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileDrawer.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active navigation link tracking via IntersectionObserver
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }
}

/* --------------------------------------------------------------------------
   3. HERO PARALLAX & 3D TILT
   -------------------------------------------------------------------------- */
function initHeroParallax() {
  const heroVisual = document.querySelector('.hero-visual-wrapper');
  if (!heroVisual) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const cards = heroVisual.querySelectorAll('.print-card');

  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / rect.height) * -12;
    const tiltY = (x / rect.width) * 12;

    cards.forEach((card, index) => {
      const depth = (index + 1) * 0.4;
      const moveX = (x / rect.width) * 15 * depth;
      const moveY = (y / rect.height) * 15 * depth;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });

  heroVisual.addEventListener('mouseleave', () => {
    cards.forEach(card => {
      card.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------------
   4. SERVICES SECTION TOGGLE
   -------------------------------------------------------------------------- */
function initServicesToggle() {
  const toggleBtn = document.getElementById('toggle-all-services-btn');
  const drawer = document.getElementById('all-services-drawer');
  const btnText = document.getElementById('toggle-services-text');
  const btnIcon = document.getElementById('toggle-services-icon');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = drawer.classList.toggle('expanded');
    toggleBtn.setAttribute('aria-expanded', isExpanded.toString());

    if (btnText) {
      btnText.textContent = isExpanded ? 'Hide Additional Services' : 'View All 22 Services';
    }

    if (btnIcon) {
      btnIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    // Smooth scroll down slightly if expanding
    if (isExpanded) {
      setTimeout(() => {
        drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  });
}

/* --------------------------------------------------------------------------
   5. SERVICE SELECT AUTO-PREFILL
   -------------------------------------------------------------------------- */
function initServiceSelectTriggers() {
  const actionLinks = document.querySelectorAll('[data-service-target]');
  const serviceDropdown = document.getElementById('quote-service-select');
  const contactSection = document.getElementById('contact');
  const nameInput = document.getElementById('quote-name');

  actionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = link.getAttribute('data-service-target');

      if (serviceDropdown && serviceName) {
        for (let i = 0; i < serviceDropdown.options.length; i++) {
          if (serviceDropdown.options[i].value === serviceName || 
              serviceDropdown.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
            serviceDropdown.selectedIndex = i;
            break;
          }
        }
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          nameInput?.focus();
        }, 500);
      }

      showToast(`Selected "${serviceName}" in quote form.`);
    });
  });
}

/* --------------------------------------------------------------------------
   6. SHOWCASE FILTER & PREVIEW MODAL
   -------------------------------------------------------------------------- */
function initShowcaseFilterAndModal() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.showcase-item');
  const modal = document.getElementById('showcase-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close-btn');

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      items.forEach(item => {
        const itemCat = item.getAttribute('data-category') || '';
        if (filter === 'all' || itemCat.toLowerCase() === filter.toLowerCase()) {
          item.style.display = '';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.35s ease';
            item.style.opacity = '1';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Modal Interaction
  items.forEach(item => {
    item.addEventListener('click', () => {
      if (!modal) return;
      const title = item.querySelector('.showcase-title')?.textContent || 'Print Sample';
      const desc = item.querySelector('.showcase-desc')?.textContent || '';
      const category = item.querySelector('.showcase-category-tag')?.textContent || 'Printed Product';
      const imgSrc = item.querySelector('img')?.getAttribute('src') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = category;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalImg) modalImg.src = imgSrc;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. COUNT-UP FOR VERIFIED NUMBERS (4.1 & 71)
   -------------------------------------------------------------------------- */
function initCountUp() {
  const ratingCounters = document.querySelectorAll('[data-counter]');
  if (!ratingCounters.length) return;

  const countUp = (el, target, isDecimal) => {
    let current = 0;
    const duration = 1600;
    const steps = 40;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toString();
    }, stepTime);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter') || '0');
          const isDecimal = el.getAttribute('data-decimal') === 'true';
          countUp(el, target, isDecimal);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    ratingCounters.forEach(c => observer.observe(c));
  } else {
    ratingCounters.forEach(c => {
      c.textContent = c.getAttribute('data-counter') || '';
    });
  }
}

/* --------------------------------------------------------------------------
   8. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('revealed'));
  }
}

/* --------------------------------------------------------------------------
   9. QUOTE FORM VALIDATION & FILE DROP
   -------------------------------------------------------------------------- */
function initQuoteForm() {
  const form = document.getElementById('quote-form');
  const dropzone = document.getElementById('file-dropzone');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.getElementById('file-name-preview');
  const submitBtn = document.getElementById('submit-quote-btn');

  // File Upload Handlers
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer?.files.length) {
        handleSelectedFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files?.length) {
        handleSelectedFile(fileInput.files[0]);
      }
    });
  }

  function handleSelectedFile(file) {
    if (!filePreview) return;
    filePreview.textContent = `Attached: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
    filePreview.style.display = 'block';
    showToast(`File "${file.name}" ready for quote upload.`);
  }

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quote-name')?.value?.trim();
      const phone = document.getElementById('quote-phone')?.value?.trim();
      const service = document.getElementById('quote-service-select')?.value;
      const message = document.getElementById('quote-message')?.value?.trim();

      if (!name || !phone) {
        showToast('Please provide your name and phone number.', 'error');
        return;
      }

      // Simulate sending state
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
          <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          Submitting Request...
        `;
        submitBtn.setAttribute('disabled', 'true');

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.removeAttribute('disabled');

          const quoteId = `SP-${Math.floor(1000 + Math.random() * 9000)}`;
          showToast(`Quote Request Sent! Reference ID: #${quoteId}. Sharma Printers will contact you shortly.`);

          // Reset inputs smoothly
          form.reset();
          if (filePreview) filePreview.style.display = 'none';
        }, 800);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   10. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   11. ADDRESS CLIPBOARD COPY
   -------------------------------------------------------------------------- */
function initAddressCopy() {
  const copyBtns = document.querySelectorAll('[data-copy-address]');
  const addressText = '1/63, Main 60 Feet Rd, Opp. HDFC Bank, East Rohtas Nagar, Vishwas Nagar, Shahdara, Delhi – 110032';

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(addressText).then(() => {
          showToast('Address copied to clipboard!');
        }).catch(() => {
          showToast('Address: ' + addressText);
        });
      } else {
        showToast('Address: ' + addressText);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   12. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconSvg = type === 'error' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger entrance
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after 4.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}
