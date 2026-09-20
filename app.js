/* ==========================================================================
   SMART TECH INTERIOR AND EXTERIOR SOLUTION
   Client Interactivity & Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initHeroSlider();
  initCounterAnimation();
  initServiceFilters();
  initPortfolioFilters();
  initCostCalculator();
  initLightbox();
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
  let started = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const step = Math.ceil(target / 45);
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = count;
        }
      }, 35);
    });
  }

  // Trigger counters when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      runCounters();
    }
  }, { threshold: 0.5 });

  const heroSection = document.querySelector('.hero-section');
  if (heroSection) observer.observe(heroSection);
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
      window.open(`https://wa.me/919447722144?text=${waText}`, '_blank');
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
    waLink.href = `https://wa.me/919447722144?text=${msg}`;

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

  statusMsg.className = 'form-status-msg success';
  statusMsg.innerHTML = `✓ Thank you, <strong>${name}</strong>! Your inquiry for <strong>${service}</strong> has been registered. Our supervisor will call you at <strong>${phone}</strong> shortly.`;

  // Offer optional direct WhatsApp transfer
  const confirmWA = confirm(`Inquiry received! Would you like to also open WhatsApp to chat with our Noorani office directly?`);
  if (confirmWA) {
    const waMsg = encodeURIComponent(
      `Hello Smart Tech,\nMy Name: ${name}\nPhone: ${phone}\nRequirement: ${service}\nSite Location: ${location || 'Palakkad'}\nNotes: ${message || 'Need quotation & site visit'}`
    );
    window.open(`https://wa.me/919447722144?text=${waMsg}`, '_blank');
  }

  document.getElementById('contactForm').reset();
};
