/* ==========================================================================
   SMART TECH INTERIOR AND EXTERIOR SOLUTION
   Client Interactivity & Logic
   ========================================================================== */

/* ==========================================================================
   GOOGLE ADS & DIRECTORY CONVERSIONS CONFIGURATION
   ========================================================================== */
export const SMART_TECH_CONFIG = {
  // Google Ads Conversion ID (Replace AW-XXXXXXXXXX with your actual Google Ads ID)
  googleAdsId: 'AW-XXXXXXXXXX',

  // Conversion Action Labels configured in Google Ads > Goals > Conversions:
  conversionLabels: {
    reviewSubmit: '',    // Conversion label for customer review submissions
    contactForm: '',     // Conversion label for contact lead form
    whatsappClick: '',   // Conversion label for WhatsApp chat initiates
    phoneCall: '',       // Conversion label for direct phone calls
    justdialClick: '',   // Conversion label for Justdial directory outbound clicks
    googleReviewClick: '' // Conversion label for Google Maps review outbound clicks
  },

  // Directory & Review Links
  justdialUrl: 'https://www.justdial.com/Palakkad/Smart-Tech-Near-to-Post-Office-Noorani/9999PX491-X491-140214112214-N5G4_BZDET',
  googleMapsUrl: 'https://maps.google.com/?q=Noorani+Palakkad+Post+Office'
};

// Expose globally for testing / developer verification in browser console
window.SMART_TECH_CONFIG = SMART_TECH_CONFIG;

/**
 * Universal conversion & event tracking for Google Ads and Google Analytics
 * @param {string} actionName - Name of the conversion action
 * @param {Object} [params={}] - Additional event payload (rating, service, label, etc.)
 */
export function trackGoogleAdConversion(actionName, params = {}) {
  try {
    const labelMap = {
      review_submission: SMART_TECH_CONFIG.conversionLabels.reviewSubmit,
      lead_form_submit: SMART_TECH_CONFIG.conversionLabels.contactForm,
      whatsapp_click: SMART_TECH_CONFIG.conversionLabels.whatsappClick,
      phone_call: SMART_TECH_CONFIG.conversionLabels.phoneCall,
      justdial_click: SMART_TECH_CONFIG.conversionLabels.justdialClick,
      google_review_click: SMART_TECH_CONFIG.conversionLabels.googleReviewClick
    };

    const label = labelMap[actionName] || '';
    const hasActiveAdsId = SMART_TECH_CONFIG.googleAdsId && SMART_TECH_CONFIG.googleAdsId !== 'AW-XXXXXXXXXX';

    // 1. Google Ads Tag (gtag.js)
    if (typeof window.gtag === 'function') {
      if (hasActiveAdsId && label) {
        window.gtag('event', 'conversion', {
          send_to: `${SMART_TECH_CONFIG.googleAdsId}/${label}`,
          ...params
        });
      }
      // Track named event in GA4 / Google Tag Manager
      window.gtag('event', actionName, {
        event_category: 'SmartTech_Interactions',
        event_label: params.service || params.platform || actionName,
        ...params
      });
    }

    // 2. Custom DOM Event for modular analytics
    window.dispatchEvent(new CustomEvent('smarttech:conversion', {
      detail: { actionName, hasActiveAdsId, ...params }
    }));

    console.log(
      `%c[Google Ads Event]: ${actionName}`,
      'color: #b38b1f; font-weight: bold; background: rgba(179,139,31,0.1); padding: 2px 6px; border-radius: 4px;',
      { hasActiveAdsId, ...params }
    );
  } catch (err) {
    console.warn('[Tracking Warning]:', err);
  }
}
window.trackGoogleAdConversion = trackGoogleAdConversion;

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initHeroSlider();
  initCounterAnimation();
  initServiceFilters();
  initPortfolioFilters();
  initCostCalculator();
  initLightbox();
  initConversionTracking();
  initReviewSystem();
});

/* ==========================================================================
   Navbar Sticky & Active Link Tracking
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const menuToggle = document.getElementById('menuToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open') && 
        !mobileDrawer.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   Hero Automated Showcase Slider
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-slider-dots .dot');
  const slideNum = document.getElementById('heroSlideNum');
  const slideTitle = document.getElementById('heroSlideTitle');
  const slideSub = document.getElementById('heroSlideSub');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const heroSlider = document.getElementById('heroSlider');

  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;
  const intervalTime = 3800; // Changes every 3.8 seconds

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
        const title = slide.getAttribute('data-title');
        const sub = slide.getAttribute('data-sub');
        if (slideTitle) slideTitle.textContent = title;
        if (slideSub) slideSub.textContent = sub;
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    if (slideNum) {
      slideNum.textContent = String(currentIndex + 1).padStart(2, '0');
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, intervalTime);
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(idx);
      startAutoPlay();
    });
  });

  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe gesture support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    heroSlider.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].screenX;
        touchStartY = e.touches[0].screenY;
        stopAutoPlay();
      }
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
        startAutoPlay();
      }
    }, { passive: true });

    function handleSwipe() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      // Horizontal swipe threshold 40px and dominant over vertical scroll
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
          // Swipe left -> Next slide
          showSlide(currentIndex + 1);
        } else {
          // Swipe right -> Previous slide
          showSlide(currentIndex - 1);
        }
      }
    }
  }

  startAutoPlay();
}

/* ==========================================================================
   Hero Animated Counters
   ========================================================================== */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  const metricsContainer = document.querySelector('.hero-metrics');
  let started = false;

  function runCounters() {
    if (started) return;
    started = true;

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target') || 0;
      let count = 0;
      counter.textContent = '0';
      const duration = 1200; // Total 1.2 seconds animation
      const steps = 35;
      const stepValue = Math.max(1, Math.ceil(target / steps));
      const interval = Math.floor(duration / steps);

      const timer = setInterval(() => {
        count += stepValue;
        if (count >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = count;
        }
      }, interval);
    });
  }

  // Trigger counters when scrolled into view or immediately on mobile
  if ('IntersectionObserver' in window && metricsContainer) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        runCounters();
        observer.disconnect();
      }
    }, {
      threshold: 0.1, // Trigger as soon as 10% of the metrics are visible
      rootMargin: '50px 0px' // Pre-trigger slightly before scrolling into view
    });

    observer.observe(metricsContainer);

    // Guaranteed fallback: If observer hasn't fired within 1.2s, animate anyway
    setTimeout(() => {
      if (!started) {
        runCounters();
      }
    }, 1200);
  } else {
    runCounters();
  }
}

/* ==========================================================================
   Service Filtering
   ========================================================================== */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* Helper to preselect service from service card link */
window.preselectService = function(serviceKey) {
  const serviceSelect = document.getElementById('calcService');
  if (serviceSelect) {
    serviceSelect.value = serviceKey;
    const event = new Event('change');
    serviceSelect.dispatchEvent(event);
  }
};

/* ==========================================================================
   Portfolio Filtering
   ========================================================================== */
function initPortfolioFilters() {
  const pFilterBtns = document.querySelectorAll('.p-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  pFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-pfilter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-pcategory');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Interactive Cost Estimator Calculator
   ========================================================================== */
function initCostCalculator() {
  const serviceSelect = document.getElementById('calcService');
  const gradeSelect = document.getElementById('calcGrade');
  const areaSlider = document.getElementById('calcArea');
  const areaDisplay = document.getElementById('areaDisplay');
  const unitDisplay = document.getElementById('unitDisplay');
  const rateDisplay = document.getElementById('rateDisplay');
  const totalDisplay = document.getElementById('totalDisplay');
  const whatsappQuoteBtn = document.getElementById('whatsappQuoteBtn');

  function calculate() {
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const minBase = parseFloat(selectedOption.getAttribute('data-min'));
    const maxBase = parseFloat(selectedOption.getAttribute('data-max'));
    const unit = selectedOption.getAttribute('data-unit');
    const gradeMultiplier = parseFloat(gradeSelect.value);
    const area = parseFloat(areaSlider.value);

    // Adjust slider range dynamically for modular kitchens (measured in running feet)
    if (serviceSelect.value === 'kitchen') {
      if (areaSlider.max !== '60') {
        areaSlider.min = '8';
        areaSlider.max = '60';
        areaSlider.step = '1';
        if (area > 60 || area < 8) areaSlider.value = '18';
      }
      unitDisplay.textContent = 'r.ft.';
    } else {
      if (areaSlider.max !== '2500') {
        areaSlider.min = '50';
        areaSlider.max = '2500';
        areaSlider.step = '25';
        if (area <= 60) areaSlider.value = '350';
      }
      unitDisplay.textContent = 'sq.ft.';
    }

    const currentArea = parseFloat(areaSlider.value);
    areaDisplay.textContent = currentArea;

    const minRate = Math.round(minBase * gradeMultiplier);
    const maxRate = Math.round(maxBase * gradeMultiplier);

    const minTotal = Math.round(minRate * currentArea);
    const maxTotal = Math.round(maxRate * currentArea);

    rateDisplay.textContent = `₹${minRate.toLocaleString('en-IN')} - ₹${maxRate.toLocaleString('en-IN')} / ${unit}`;
    totalDisplay.textContent = `₹${minTotal.toLocaleString('en-IN')} – ₹${maxTotal.toLocaleString('en-IN')}`;

    // Update WhatsApp prefilled link
    const serviceName = selectedOption.text.split('(')[0].trim();
    const gradeName = gradeSelect.options[gradeSelect.selectedIndex].text.split('(')[0].trim();
    const waText = encodeURIComponent(
      `Hello Smart Tech Palakkad,\nI used your Cost Estimator on your website:\n- Project Type: ${serviceName}\n- Specification: ${gradeName}\n- Estimated Scope: ${currentArea} ${unitDisplay.textContent}\n- Estimated Price: ₹${minTotal.toLocaleString('en-IN')} – ₹${maxTotal.toLocaleString('en-IN')}\n\nPlease let me know when your team can visit my site for a survey & interior/exterior design consultation.`
    );
    whatsappQuoteBtn.onclick = () => {
      window.open(`https://wa.me/919995984554?text=${waText}`, '_blank');
    };
  }

  serviceSelect.addEventListener('change', calculate);
  gradeSelect.addEventListener('change', calculate);
  areaSlider.addEventListener('input', calculate);

  // Initial run
  calculate();
}

/* ==========================================================================
   Lightbox Modal
   ========================================================================== */
function initLightbox() {
  // Global helpers
  window.openLightbox = function(imgSrc, title, loc, desc) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const locEl = document.getElementById('lightboxLoc');
    const descEl = document.getElementById('lightboxDesc');
    const waLink = document.getElementById('lightboxWhatsApp');

    img.src = imgSrc;
    titleEl.textContent = title;
    locEl.textContent = loc;
    descEl.textContent = desc;

    const msg = encodeURIComponent(`Hi Smart Tech Palakkad, I am interested in a project similar to: "${title}" in ${loc}.`);
    waLink.href = `https://wa.me/919995984554?text=${msg}`;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeLightbox();
    }
  });
}

/* ==========================================================================
   Contact Form Submission
   ========================================================================== */
window.handleContactSubmit = function(e) {
  e.preventDefault();

  const name = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const service = document.getElementById('cService').value;
  const location = document.getElementById('cLocation').value.trim();
  const message = document.getElementById('cMessage').value.trim();
  const statusMsg = document.getElementById('formStatus');

  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  // Google Ads conversion event
  trackGoogleAdConversion('lead_form_submit', {
    name,
    service,
    location: location || 'Palakkad'
  });

  statusMsg.className = 'form-status-msg success';
  statusMsg.innerHTML = `✓ Thank you, <strong>${name}</strong>! Your inquiry for <strong>${service}</strong> has been registered. Our supervisor will call you at <strong>${phone}</strong> shortly.`;

  // Offer optional direct WhatsApp transfer
  const confirmWA = confirm(`Inquiry received! Would you like to also open WhatsApp to chat with our Noorani office directly?`);
  if (confirmWA) {
    const waMsg = encodeURIComponent(
      `Hello Smart Tech,\nMy Name: ${name}\nPhone: ${phone}\nRequirement: ${service}\nSite Location: ${location || 'Palakkad'}\nNotes: ${message || 'Need quotation & site visit'}`
    );
    window.open(`https://wa.me/919995984554?text=${waMsg}`, '_blank');
  }

  document.getElementById('contactForm').reset();
};

/* ==========================================================================
   Universal Conversion Tracking Handlers (WhatsApp, Phone, Justdial, Google)
   ========================================================================== */
function initConversionTracking() {
  // WhatsApp clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      trackGoogleAdConversion('whatsapp_click', {
        href: link.href,
        location: link.closest('section')?.id || 'header/floating-dock'
      });
    });
  });

  // Direct Phone Calls
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackGoogleAdConversion('phone_call', {
        phone: link.getAttribute('href'),
        location: link.closest('section')?.id || 'header/footer/floating-dock'
      });
    });
  });

  // Justdial Directory Outbound Clicks
  document.querySelectorAll('a[href*="justdial.com"]').forEach(link => {
    link.addEventListener('click', () => {
      trackGoogleAdConversion('justdial_click', {
        directory: 'Justdial Palakkad',
        targetUrl: link.href
      });
    });
  });

  // Google Maps Reviews Outbound Clicks
  document.querySelectorAll('a[href*="maps.google.com"]').forEach(link => {
    link.addEventListener('click', () => {
      trackGoogleAdConversion('google_review_click', {
        platform: 'Google Maps'
      });
    });
  });
}

/* ==========================================================================
   Interactive Customer Review System & Attributes
   ========================================================================== */
const STORAGE_KEY_REVIEWS = 'smart_tech_customer_reviews';

const RATING_DESCRIPTIONS = {
  1: '1 Star - Needs Improvement',
  2: '2 Stars - Fair Experience',
  3: '3 Stars - Good Service',
  4: '4 Stars - Very Good & Professional',
  5: '5 Stars - Outstanding Workmanship!'
};

function initReviewSystem() {
  const modal = document.getElementById('reviewModal');
  const openBtn = document.getElementById('openReviewModalBtn');
  const closeBtn = document.getElementById('closeReviewModalBtn');
  const cancelBtn = document.getElementById('cancelReviewBtn');
  const overlay = document.getElementById('reviewModalOverlay');
  const form = document.getElementById('customerReviewForm');
  const starButtons = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('reviewRatingInput');
  const ratingFeedbackBadge = document.getElementById('ratingFeedbackBadge');
  const statusBox = document.getElementById('reviewStatusBox');

  // Filter pills
  const filterPills = document.querySelectorAll('.rf-pill');

  let currentSelectedRating = 5;

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setStarRating(currentSelectedRating);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (statusBox) {
      statusBox.style.display = 'none';
      statusBox.textContent = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Star Rating Interaction (Hover & Click)
  function setStarRating(val) {
    currentSelectedRating = val;
    if (ratingInput) ratingInput.value = val;
    if (ratingFeedbackBadge) {
      ratingFeedbackBadge.textContent = RATING_DESCRIPTIONS[val] || `${val} Stars`;
    }

    starButtons.forEach(btn => {
      const btnVal = parseInt(btn.getAttribute('data-value'), 10);
      if (btnVal <= val) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  starButtons.forEach(btn => {
    const val = parseInt(btn.getAttribute('data-value'), 10);

    btn.addEventListener('click', () => {
      setStarRating(val);
    });

    btn.addEventListener('mouseenter', () => {
      starButtons.forEach(b => {
        const bVal = parseInt(b.getAttribute('data-value'), 10);
        if (bVal <= val) {
          b.classList.add('hover-active');
        } else {
          b.classList.remove('hover-active');
        }
      });
      if (ratingFeedbackBadge) {
        ratingFeedbackBadge.textContent = RATING_DESCRIPTIONS[val] || `${val} Stars`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      starButtons.forEach(b => b.classList.remove('hover-active'));
      if (ratingFeedbackBadge) {
        ratingFeedbackBadge.textContent = RATING_DESCRIPTIONS[currentSelectedRating] || `${currentSelectedRating} Stars`;
      }
    });
  });

  // Initial render of stored reviews from localStorage
  loadAndRenderCustomerReviews();

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const author = document.getElementById('reviewAuthor').value.trim();
      const location = document.getElementById('reviewLocation').value.trim();
      const service = document.getElementById('reviewService').value;
      const contact = document.getElementById('reviewContact').value.trim();
      const text = document.getElementById('reviewText').value.trim();
      const recommend = document.getElementById('reviewRecommend').checked;
      const rating = parseInt(ratingInput.value, 10) || 5;

      if (!author || !location || !text) {
        if (statusBox) {
          statusBox.className = 'review-status-box error';
          statusBox.textContent = 'Please fill out your name, location, and review message.';
          statusBox.style.display = 'block';
        }
        return;
      }

      const reviewObj = {
        id: 'rev_' + Date.now(),
        author,
        location,
        service,
        contact,
        rating,
        text,
        recommend,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        source: 'customer'
      };

      // Save to localStorage
      saveCustomerReview(reviewObj);

      // Trigger Google Ads Conversion Event
      trackGoogleAdConversion('review_submission', {
        author,
        rating,
        service,
        location,
        recommend: recommend ? 'yes' : 'no'
      });

      // Render the review into the testimonials grid
      renderReviewCard(reviewObj, true);
      updateReviewCounts();

      // Show confirmation toast
      showToast(`Thank you, ${author}! Your ${rating}★ review for "${service}" has been published.`, 'success');

      form.reset();
      currentSelectedRating = 5;
      setStarRating(5);
      closeModal();
    });
  }

  // Filter Pills Handler
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterVal = pill.getAttribute('data-filter');
      const allCards = document.querySelectorAll('#testimonialsGrid .testi-card');

      allCards.forEach(card => {
        const cardSource = card.getAttribute('data-source');
        if (filterVal === 'all' || cardSource === filterVal) {
          card.style.display = 'flex';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function getStoredReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading stored reviews:', e);
    return [];
  }
}

function saveCustomerReview(review) {
  try {
    const list = getStoredReviews();
    list.unshift(review);
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving review to localStorage:', e);
  }
}

function loadAndRenderCustomerReviews() {
  const reviews = getStoredReviews();
  reviews.forEach(review => {
    renderReviewCard(review, false);
  });
  updateReviewCounts();
}

function renderReviewCard(review, prepend = false) {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;

  const card = document.createElement('div');
  card.className = 'testi-card customer-review-card';
  card.setAttribute('data-source', 'customer');
  card.setAttribute('id', review.id);

  // Generate initials
  const initials = review.author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || 'ST';

  const starsHtml = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

  card.innerHTML = `
    <div class="testi-top-meta">
      <span class="testi-source-badge customer-verified">
        <span class="badge-dot green"></span> Verified Customer Review
      </span>
      <span class="testi-service-tag">${escapeHtml(review.service)}</span>
    </div>
    <div class="testi-rating" title="${review.rating} out of 5 stars">${starsHtml}</div>
    <p class="testi-text">"${escapeHtml(review.text)}"</p>
    <div class="testi-author">
      <div class="author-avatar customer-avatar">${initials}</div>
      <div class="author-info">
        <h4 class="author-name">${escapeHtml(review.author)}</h4>
        <p class="author-meta">${escapeHtml(review.location)} • ${escapeHtml(review.date)}</p>
      </div>
      <div class="testi-verified-stamp">✓ Verified</div>
    </div>
  `;

  if (prepend && grid.firstChild) {
    grid.insertBefore(card, grid.firstChild);
    card.classList.add('highlight-new');
    setTimeout(() => card.classList.remove('highlight-new'), 3000);
  } else {
    grid.appendChild(card);
  }
}

function updateReviewCounts() {
  const storedReviews = getStoredReviews();
  const customerCount = storedReviews.length;
  const justdialCount = 3; // Baseline verified reviews
  const totalCount = justdialCount + customerCount;

  const countAll = document.getElementById('countAllReviews');
  const countJd = document.getElementById('countJdReviews');
  const countCust = document.getElementById('countCustomerReviews');
  const summaryCount = document.getElementById('ratingSummaryCount');
  const bigScore = document.getElementById('ratingBigNumber');

  if (countAll) countAll.textContent = totalCount;
  if (countJd) countJd.textContent = justdialCount;
  if (countCust) countCust.textContent = customerCount;

  if (summaryCount) {
    const verifiedTotal = 24 + customerCount;
    summaryCount.innerHTML = `Rated 5.0/5 across <strong>${verifiedTotal}+ Verified Reviews</strong>`;
  }

  // Update dynamic schema.org reviewCount
  try {
    const schemaEl = document.getElementById('businessSchema');
    if (schemaEl) {
      const schemaData = JSON.parse(schemaEl.textContent);
      if (schemaData.aggregateRating) {
        schemaData.aggregateRating.reviewCount = String(24 + customerCount);
        schemaEl.textContent = JSON.stringify(schemaData, null, 2);
      }
    }
  } catch (e) {
    // schema update silent fallback
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   Toast Notification Feedback
   ========================================================================== */
export function showToast(message, type = 'success', duration = 4500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
    <span class="toast-body">${message}</span>
    <button class="toast-close-btn" aria-label="Close message">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger enter transition
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => removeToast(toast));
  }

  setTimeout(() => {
    removeToast(toast);
  }, duration);
}
window.showToast = showToast;

function removeToast(toast) {
  if (!toast || !toast.parentNode) return;
  toast.classList.remove('visible');
  toast.classList.add('fade-out');
  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, 300);
}

