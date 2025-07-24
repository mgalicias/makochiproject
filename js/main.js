// ===== OPTIMIZED MAIN.JS FILE =====

// ===== VARIABLES GLOBALES =====
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

// Configuration objects
const CONFIG = {
  ANIMATION_DELAYS: {
    LETTER: 0.08,
    WORD: 0.05,
    PARTICLE_DELAY: 100,
  },
  PARTICLE_COUNTS: {
    LETTER: 6,
    LOGO: 8,
    MINI: 8,
  },
  COLORS: {
    GOOGLE: ["#4285F4", "#EA4335", "#FBBC04", "#34A853"],
    THEME: [
      "var(--color-primary)",
      "var(--color-secondary)",
      "var(--color-accent)",
    ],
  },
  DURATIONS: {
    NOTIFICATION: 5000,
    CLICK_TIMEOUT: 400,
    ANIMATION_DELAY: 2000,
  },
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Get element safely
  getElement(selector) {
    return document.querySelector(selector);
  },

  // Get elements safely
  getElements(selector) {
    return document.querySelectorAll(selector);
  },

  // Create element with styles
  createElement(tag, className, styles = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (Object.keys(styles).length) {
      element.style.cssText = Object.entries(styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; ");
    }
    return element;
  },

  // Add styles to head
  addStyles(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return style;
  },
};

// ===== NAVIGATION MODULE =====
const Navigation = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Toggle menu
    if (navToggle) {
      navToggle.addEventListener("click", this.toggleMenu);
    }

    // Close menu on link click
    Utils.getElements(".nav-link").forEach((link) => {
      link.addEventListener("click", this.closeMenu);
    });

    // Close menu on outside click
    document.addEventListener("click", this.handleOutsideClick);

    // Close menu on window resize
    window.addEventListener(
      "resize",
      Utils.debounce(() => {
        if (window.innerWidth >= 768) {
          this.closeMenu();
        }
      }, 250)
    );
  },

  toggleMenu() {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  },

  closeMenu() {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
  },

  handleOutsideClick(event) {
    const isClickInsideNav =
      navMenu?.contains(event.target) || navToggle?.contains(event.target);
    if (!isClickInsideNav && navMenu?.classList.contains("active")) {
      Navigation.closeMenu();
    }
  },
};

// ===== PARTICLE EFFECTS MODULE =====
const ParticleEffects = {
  createParticles(
    element,
    count = CONFIG.PARTICLE_COUNTS.LETTER,
    colors = CONFIG.COLORS.THEME
  ) {
    const rect = element.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
      const particle = this.createSingleParticle(rect, i, count, colors);
      document.body.appendChild(particle);
      this.animateParticle(particle);
    }
  },

  createSingleParticle(rect, index, total, colors) {
    const angle = (Math.PI * 2 * index) / total;
    const radius = 20 + Math.random() * 10;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const size = 3 + Math.random() * 3;
    const color = colors[Math.floor(Math.random() * colors.length)];

    return Utils.createElement("div", "particle", {
      position: "absolute",
      left: `${rect.left + rect.width / 2 + x}px`,
      top: `${rect.top + rect.height / 2 + y}px`,
      width: `${size}px`,
      height: `${size}px`,
      background: color,
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "1000",
    });
  },

  animateParticle(particle) {
    particle.animate(
      [
        {
          opacity: 1,
          transform: "scale(1) translateY(0px)",
        },
        {
          opacity: 0,
          transform: `scale(0.3) translateY(-${30 + Math.random() * 20}px)`,
        },
      ],
      {
        duration: 800 + Math.random() * 400,
        easing: "ease-out",
      }
    ).onfinish = () => particle.remove();
  },

  createRipple(element, className = "ripple-effect") {
    const rect = element.getBoundingClientRect();
    const ripple = Utils.createElement("div", className, {
      position: "absolute",
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top + rect.height / 2}px`,
      transform: "translate(-50%, -50%)",
      zIndex: "998",
    });

    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
    return ripple;
  },

  createImpactWave(element) {
    const rect = element.getBoundingClientRect();
    const wave = Utils.createElement("div", "impact-wave", {
      position: "absolute",
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.bottom - 5}px`,
      transform: "translate(-50%, -50%)",
      zIndex: "999",
    });

    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 600);
  },
};

// ===== NOTIFICATION MODULE =====
const Notifications = {
  show(message, type = "info") {
    const colors = {
      success: "#10b981",
      error: "#ef4444",
      info: "#3b82f6",
    };

    const notification = Utils.createElement(
      "div",
      `notification notification-${type}`,
      {
        position: "fixed",
        top: "100px",
        right: "20px",
        backgroundColor: colors[type],
        color: "white",
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: "2000",
        maxWidth: "300px",
        animation: "slideIn 0.3s ease-out",
      }
    );

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, CONFIG.DURATIONS.NOTIFICATION);
  },
};

// ===== FORM VALIDATION MODULE =====
const FormValidation = {
  init() {
    const contactForm = Utils.getElement(".contact-form");
    if (!contactForm) return;

    this.bindFormEvents(contactForm);
    this.initRealTimeValidation();
  },

  bindFormEvents(form) {
    form.addEventListener("submit", this.handleSubmit.bind(this));

    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        input.style.borderColor = "#d1d5db";
        this.hideFieldError(input);
      });
    });
  },

  handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    if (this.validateForm(form)) {
      Notifications.show(
        "Gracias por tu mensaje. Te contactaremos pronto.",
        "success"
      );
      setTimeout(() => form.reset(), 2000);
    }
  },

  validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;
    let firstInvalidField = null;

    // Check required fields
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        this.markFieldInvalid(field);
        isValid = false;
        if (!firstInvalidField) firstInvalidField = field;
      }
    });

    // Validate email
    const emailField = form.querySelector("#email");
    if (emailField?.value && !this.isValidEmail(emailField.value)) {
      this.markFieldInvalid(emailField);
      isValid = false;
      if (!firstInvalidField) firstInvalidField = emailField;
    }

    if (!isValid) {
      firstInvalidField?.focus();
      firstInvalidField?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      Notifications.show(
        "Por favor, completa todos los campos requeridos correctamente.",
        "error"
      );
    }

    return isValid;
  },

  markFieldInvalid(field) {
    field.style.borderColor = "#ef4444";
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  initRealTimeValidation() {
    const emailInputs = Utils.getElements('input[type="email"]');
    const phoneInputs = Utils.getElements('input[type="tel"]');

    emailInputs.forEach((input) => {
      input.addEventListener("blur", () => {
        if (input.value && !this.isValidEmail(input.value)) {
          this.markFieldInvalid(input);
          this.showFieldError(input, "Por favor ingresa un email válido");
        }
      });
    });

    phoneInputs.forEach((input) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9\s\(\)\-]/g, "");
      });
    });
  },

  showFieldError(field, message) {
    this.hideFieldError(field);
    const errorDiv = Utils.createElement("div", "field-error", {
      color: "#ef4444",
      fontSize: "0.8rem",
      marginTop: "0.25rem",
    });
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  },

  hideFieldError(field) {
    const existingError = field.parentNode.querySelector(".field-error");
    existingError?.remove();
  },
};

// ===== GALLERY MODULE =====
const Gallery = {
  init() {
    const modal = Utils.getElement("#gallery-modal");
    if (!modal) return;

    this.modal = modal;
    this.modalImage = Utils.getElement("#modal-image");
    this.modalCaption = Utils.getElement("#modal-caption");
    this.bindEvents();
  },

  bindEvents() {
    const galleryItems = Utils.getElements(".gallery-item");
    const closeBtn = Utils.getElement(".close");

    galleryItems.forEach((item) => {
      item.addEventListener("click", this.openModal.bind(this));
    });

    closeBtn?.addEventListener("click", this.closeModal.bind(this));
    this.modal.addEventListener("click", this.handleModalClick.bind(this));
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  },

  openModal(event) {
    const img = event.currentTarget.querySelector("img");
    const title = event.currentTarget.getAttribute("data-title") || img.alt;

    this.modalImage.src = img.src;
    this.modalImage.alt = img.alt;
    this.modalCaption.textContent = title;
    this.modal.style.display = "block";
    document.body.style.overflow = "hidden";
  },

  closeModal() {
    this.modal.style.display = "none";
    document.body.style.overflow = "auto";
  },

  handleModalClick(event) {
    if (event.target === this.modal) {
      this.closeModal();
    }
  },

  handleKeyDown(event) {
    if (event.key === "Escape" && this.modal.style.display === "block") {
      this.closeModal();
    }
  },
};

// ===== HERO ANIMATION MODULE =====
const HeroAnimation = {
  init() {
    const heroTitle = Utils.getElement(".hero-title");
    if (!heroTitle) return;

    this.createAnimatedTitle(heroTitle);
    this.addAnimationStyles();

    // Initialize word interactions after animation completes
    setTimeout(
      () => this.initWordInteractions(),
      CONFIG.DURATIONS.ANIMATION_DELAY
    );
  },

  createAnimatedTitle(heroTitle) {
    const text = heroTitle.textContent;
    const words = text.split(" ");
    heroTitle.innerHTML = "";

    words.forEach((word, wordIndex) => {
      const wordSpan = this.createWordElement(word, wordIndex);
      heroTitle.appendChild(wordSpan);

      // Add space between words (except for the last word)
      if (wordIndex < words.length - 1) {
        const spaceSpan = Utils.createElement("span", "hero-space", {
          display: "inline-block",
          width: "0.5rem",
        });
        spaceSpan.innerHTML = "&nbsp;";
        heroTitle.appendChild(spaceSpan);
      }
    });
  },

  createWordElement(word, wordIndex) {
    const wordSpan = Utils.createElement("span", "hero-word", {
      display: "inline-block",
      position: "relative",
      cursor: "pointer",
      animation: `jumpWord 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${
        wordIndex * CONFIG.ANIMATION_DELAYS.LETTER * 3
      }s both`,
      transformOrigin: "bottom center",
    });

    wordSpan.textContent = word;
    this.bindWordEvents(wordSpan);
    return wordSpan;
  },

  bindWordEvents(wordSpan) {
    let clickCount = 0;
    let clickTimer = null;

    wordSpan.addEventListener("click", (event) => {
      clickCount++;

      if (clickCount === 1) {
        ParticleEffects.createParticles(wordSpan);
        ParticleEffects.createRipple(wordSpan);
        clickTimer = setTimeout(
          () => (clickCount = 0),
          CONFIG.DURATIONS.CLICK_TIMEOUT
        );
      } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        ParticleEffects.createImpactWave(wordSpan);
        this.animateWordExplosion(wordSpan);
      }

      event.stopPropagation();
    });

    wordSpan.addEventListener("mouseenter", () => {
      this.animateWordHover(wordSpan);
    });
  },

  animateWordHover(wordElement) {
    wordElement.style.animation =
      "wordHover 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

    setTimeout(() => {
      wordElement.style.animation = "";
    }, 400);
  },

  initWordInteractions() {
    const heroWords = Utils.getElements(".hero-word");

    heroWords.forEach((word) => {
      // Additional interactions can be added here if needed
      word.addEventListener("mouseleave", () => {
        word.style.animation = "";
      });
    });
  },

  animateWordExplosion(wordElement) {
    const originalTransform = wordElement.style.transform;
    const originalText = wordElement.textContent;

    // Create explosion effect by temporarily splitting into letters
    const letters = originalText.split("");
    wordElement.innerHTML = "";

    letters.forEach((letter, index) => {
      const letterSpan = Utils.createElement("span", "exploding-letter", {
        display: "inline-block",
        position: "relative",
      });
      letterSpan.textContent = letter;
      wordElement.appendChild(letterSpan);

      letterSpan.animate(
        [
          { transform: "translate(0, 0) rotate(0deg) scale(1)" },
          {
            transform: `translate(${(Math.random() - 0.5) * 100}px, ${
              (Math.random() - 0.5) * 100
            }px) rotate(${Math.random() * 360}deg) scale(${
              1.5 + Math.random()
            })`,
            opacity: 0.7,
          },
          { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1 },
        ],
        {
          duration: 1000,
          easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }
      );

      setTimeout(
        () => this.createMiniParticles(letterSpan),
        index * CONFIG.ANIMATION_DELAYS.PARTICLE_DELAY
      );
    });

    // Restore original text after animation
    setTimeout(() => {
      wordElement.innerHTML = originalText;
    }, 1200);
  },

  createMiniParticles(element) {
    const rect = element.getBoundingClientRect();

    for (let i = 0; i < CONFIG.PARTICLE_COUNTS.MINI; i++) {
      const particle = Utils.createElement("div", "", {
        position: "absolute",
        left: `${rect.left + rect.width / 2}px`,
        top: `${rect.top + rect.height / 2}px`,
        width: "2px",
        height: "2px",
        background: "var(--color-accent)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: "1500",
      });

      document.body.appendChild(particle);

      const angle = (Math.PI * 2 * i) / CONFIG.PARTICLE_COUNTS.MINI;
      const velocity = 15 + Math.random() * 10;

      particle.animate(
        [
          { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
          {
            opacity: 0,
            transform: `translate(${Math.cos(angle) * velocity - 50}%, ${
              Math.sin(angle) * velocity - 50
            }%) scale(0)`,
          },
        ],
        {
          duration: 600,
          easing: "ease-out",
        }
      ).onfinish = () => particle.remove();
    }
  },

  addAnimationStyles() {
    Utils.addStyles(`
      .hero-title {
        perspective: 1000px;
        overflow: visible;
      }
      
      .hero-title .hero-word {
        background: linear-gradient(45deg, var(--color-primary), var(--color-secondary), var(--color-accent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
        transition: all 0.3s ease;
      }
      
      .hero-space {
        pointer-events: none;
      }
      
      @keyframes jumpWord {
        0% {
          transform: translateY(50px) rotateX(90deg) scale(0.5);
          opacity: 0;
        }
        30% {
          transform: translateY(-15px) rotateX(0deg) scale(1.1);
          opacity: 1;
        }
        60% {
          transform: translateY(5px) scale(0.95);
        }
        100% {
          transform: translateY(0) rotateX(0deg) scale(1);
          opacity: 1;
        }
      }
      
      @keyframes wordHover {
        0%, 100% { 
          transform: translateY(0) scale(1) rotateZ(0deg); 
        }
        25% { 
          transform: translateY(-8px) scale(1.15) rotateZ(-2deg); 
        }
        50% { 
          transform: translateY(-12px) scale(1.2) rotateZ(1deg); 
        }
        75% { 
          transform: translateY(-5px) scale(1.1) rotateZ(-1deg); 
        }
      }
      
      .hero-word:hover {
        transform: translateY(-5px) scale(1.05);
        text-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }
      
      .exploding-letter {
        background: inherit;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    `);
  },
};

// ===== LOGO ANIMATION MODULE =====
const LogoAnimation = {
  init() {
    const logo = Utils.getElement(".logo") || Utils.getElement(".nav-logo img");
    const logoContainer =
      Utils.getElement(".nav-logo a") || Utils.getElement(".nav-logo");

    if (!logoContainer) return;

    this.bindEvents(logo, logoContainer);
    this.addStyles();
  },

  bindEvents(logo, logoContainer) {
    logoContainer.addEventListener("click", (event) => {
      event.preventDefault();

      if (logo) {
        ParticleEffects.createParticles(
          logo,
          CONFIG.PARTICLE_COUNTS.LOGO,
          CONFIG.COLORS.GOOGLE
        );
        logo.style.animation =
          "logoClickAnimation 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      }

      this.createLogoRipple(logoContainer);

      setTimeout(() => {
        if (logo) logo.style.animation = "";
        if (logoContainer.href) window.location.href = logoContainer.href;
      }, 600);
    });

    logoContainer.addEventListener("mouseenter", () => {
      if (logo) logo.style.animation = "logoHover 0.3s ease-out";
    });

    logoContainer.addEventListener("mouseleave", () => {
      if (logo) logo.style.animation = "";
    });
  },

  createLogoRipple(logoContainer) {
    const ripple = Utils.createElement("div", "logo-ripple", {
      position: "absolute",
      border: "2px solid #4285F4",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "999",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    });

    logoContainer.appendChild(ripple);

    ripple.animate(
      [
        { width: "0px", height: "0px", opacity: 1, borderWidth: "3px" },
        { width: "80px", height: "80px", opacity: 0, borderWidth: "1px" },
      ],
      {
        duration: 600,
        easing: "ease-out",
      }
    ).onfinish = () => ripple.remove();
  },

  addStyles() {
    Utils.addStyles(`
      @keyframes logoClickAnimation {
        0% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.2) rotate(-5deg); }
        50% { transform: scale(0.9) rotate(5deg); }
        75% { transform: scale(1.1) rotate(-2deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      
      @keyframes logoHover {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.05) rotate(1deg); }
      }
    `);
  },
};

// ===== SCROLL ANIMATIONS MODULE =====
const ScrollAnimations = {
  init() {
    this.initSmoothScroll();
    this.initScrollObserver();
    this.initHeaderScroll();
  },

  initSmoothScroll() {
    const links = Utils.getElements('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (href === "#") return;

        const target = Utils.getElement(href);
        if (target) {
          event.preventDefault();

          const headerHeight = Utils.getElement(".header")?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;

          window.scrollTo({ top: targetPosition, behavior: "smooth" });
          Navigation.closeMenu();
        }
      });
    });
  },

  initScrollObserver() {
    if (!window.IntersectionObserver) {
      // Fallback for old browsers
      Utils.getElements(
        ".card, .team-member, .pilar-item, .area-card, .taller-card, .gallery-item, .caracteristica-item, .paso-item, .costo-card, .fecha-item, .faq-item"
      ).forEach((element) => element.classList.add("animate-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    Utils.getElements(
      ".card, .team-member, .pilar-item, .area-card, .taller-card, .gallery-item, .caracteristica-item, .paso-item, .costo-card, .fecha-item, .faq-item"
    ).forEach((element) => observer.observe(element));

    this.addScrollAnimationStyles();
  },

  initHeaderScroll() {
    const header = Utils.getElement(".header");
    if (!header) return;

    let lastScrollTop = 0;
    header.style.transition = "transform 0.3s ease-in-out";

    const scrollHandler = Utils.debounce(() => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }

      lastScrollTop = scrollTop;
    }, 10);

    window.addEventListener("scroll", scrollHandler);
  },

  addScrollAnimationStyles() {
    Utils.addStyles(`
      .card, .team-member, .pilar-item, .area-card, .taller-card, .gallery-item, .caracteristica-item, .paso-item, .costo-card, .fecha-item, .faq-item {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      
      .animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
      }
    `);
  },
};

// ===== MAIN INITIALIZATION =====
const App = {
  init() {
    // Initialize core modules
    Navigation.init();
    FormValidation.init();
    Gallery.init();
    ScrollAnimations.init();

    // Initialize animations
    HeroAnimation.init();
    LogoAnimation.init();

    // Add compatibility checks
    this.addCompatibilityFixes();
  },

  addCompatibilityFixes() {
    // NodeList forEach polyfill
    if (!window.NodeList || !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = Array.prototype.forEach;
    }
  },
};

// ===== DOCUMENT READY =====
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

// ===== WINDOW EVENTS =====
window.addEventListener(
  "resize",
  Utils.debounce(() => {
    if (window.innerWidth >= 768) {
      Navigation.closeMenu();
    }
  }, 250)
);
