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

    // Ensure modal is properly hidden on initialization
    this.modal.style.display = "none";
    this.modal.classList.remove("show");
    document.body.style.overflow = "auto";

    this.bindEvents();
  },

  bindEvents() {
    // Bind events for both gallery structures
    const galleryItems = Utils.getElements(
      ".photo-collage-grid .gallery-item, .photo-collage .collage-item"
    );
    const closeBtn = Utils.getElement(".close");

    galleryItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        this.openModal(event);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        this.closeModal();
      });
    }

    if (this.modal) {
      this.modal.addEventListener("click", (event) =>
        this.handleModalClick(event)
      );
    }

    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
  },

  openModal(event) {
    event.preventDefault();
    event.stopPropagation();

    const item = event.currentTarget;
    const img = item.querySelector("img");

    if (!img) {
      return;
    }

    // Get image source
    const fullSrc = img.getAttribute("data-full-src") || img.src;

    if (!fullSrc) {
      return;
    }

    // Get title
    let title = item.getAttribute("data-title");
    if (!title) {
      const h3 = item.querySelector(".collage-overlay h3");
      const p = item.querySelector(".collage-overlay p");
      title = (h3 ? h3.textContent : "") + (p ? ` - ${p.textContent}` : "");
    }

    // Set modal content
    if (this.modalImage) {
      this.modalImage.src = fullSrc;
      this.modalImage.alt = img.alt || title || "Imagen de galería";
    }

    if (this.modalCaption) {
      this.modalCaption.innerHTML = title || "";
    }

    // Show modal - use flex display for better centering
    this.modal.style.display = "flex";
    this.modal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Fade in effect
    setTimeout(() => {
      this.modal.style.opacity = "1";
    }, 10);
  },

  closeModal() {
    if (!this.modal) return;

    // Fade out
    this.modal.style.opacity = "0";

    setTimeout(() => {
      this.modal.style.display = "none";
      this.modal.classList.remove("show");
      document.body.style.overflow = "auto";

      // Clear content
      if (this.modalImage) {
        this.modalImage.src = "";
        this.modalImage.alt = "";
      }
      if (this.modalCaption) {
        this.modalCaption.innerHTML = "";
      }
    }, 200);
  },

  handleModalClick(event) {
    // Close modal when clicking on the modal background (not on image or content)
    if (event.target === this.modal) {
      this.closeModal();
    }
  },

  handleKeyDown(event) {
    if (event.key === "Escape" && this.modal.classList.contains("show")) {
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

    let globalLetterIndex = 0;

    words.forEach((word, wordIndex) => {
      const wordSpan = this.createWordElement(
        word,
        wordIndex,
        globalLetterIndex
      );
      heroTitle.appendChild(wordSpan);

      // Update global letter index
      globalLetterIndex += word.length;

      // Add space between words (except for the last word)
      if (wordIndex < words.length - 1) {
        const spaceSpan = Utils.createElement("span", "hero-space", {
          display: "inline-block",
          width: "1rem",
        });
        spaceSpan.innerHTML = "&nbsp;";
        heroTitle.appendChild(spaceSpan);
      }
    });
  },

  createWordElement(word, wordIndex, startLetterIndex) {
    const wordSpan = Utils.createElement("span", "hero-word", {
      display: "inline-block",
      position: "relative",
      cursor: "pointer",
      animation: `jumpWord 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${
        wordIndex * CONFIG.ANIMATION_DELAYS.LETTER * 3
      }s both`,
      transformOrigin: "bottom center",
    });

    // Split word into letters and apply Google-like colors
    const letters = word.split("");
    letters.forEach((letter, letterIndex) => {
      const letterSpan = Utils.createElement("span", "hero-letter", {
        display: "inline-block",
        color:
          CONFIG.COLORS.GOOGLE[
            (startLetterIndex + letterIndex) % CONFIG.COLORS.GOOGLE.length
          ],
        fontWeight: "700",
      });
      letterSpan.textContent = letter;
      wordSpan.appendChild(letterSpan);
    });

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
    // Clear any pending restore to avoid race conditions on rapid double-clicks
    if (wordElement.__restoreTimer) {
      clearTimeout(wordElement.__restoreTimer);
      wordElement.__restoreTimer = null;
    }

    // Cache original HTML so we can restore the exact structure and styles
    const originalHTML =
      wordElement.dataset.originalHtml || wordElement.innerHTML;
    wordElement.dataset.originalHtml = originalHTML;

    // Capture current letters and their computed colors
    const letterNodes = Array.from(
      wordElement.querySelectorAll(".hero-letter")
    );
    const lettersData = letterNodes.length
      ? letterNodes.map((node) => ({
          char: node.textContent || "",
          color: getComputedStyle(node).color,
        }))
      : (wordElement.textContent || "")
          .split("")
          .map((ch) => ({ char: ch, color: "" }));

    // Replace content with exploding letters preserving colors
    wordElement.innerHTML = "";
    lettersData.forEach((item, index) => {
      const letterSpan = Utils.createElement("span", "exploding-letter", {
        display: "inline-block",
        position: "relative",
        color: item.color || "inherit",
      });
      letterSpan.textContent = item.char;
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

    // Restore original HTML (colored letters and structure) after animation
    wordElement.__restoreTimer = setTimeout(() => {
      wordElement.innerHTML = wordElement.dataset.originalHtml || originalHTML;
      delete wordElement.dataset.originalHtml;
      wordElement.__restoreTimer = null;
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
      /* font-size controlled via CSS for responsive behavior */
      }
      
      .hero-title .hero-word {
      font-weight: 700;
      transition: all 0.3s ease;
      }
      
      .hero-letter {
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
      
      .hero-word:hover .hero-letter {
      text-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }
      
      .exploding-letter {
      color: inherit;
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
        ".card, .team-member, .pilar-item, .area-card, .taller-card, .gallery-item, .collage-item, .caracteristica-item, .paso-item, .costo-card, .fecha-item, .faq-item"
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
      ".card, .team-member, .pilar-item, .area-card, .taller-card, .gallery-item, .collage-item, .caracteristica-item, .paso-item, .costo-card, .fecha-item, .faq-item"
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
      .card, .team-member, .pilar-item, .area-card, .taller-card, .gallery-item, .collage-item, .caracteristica-item, .paso-item, .costo-card, .fecha-item, .faq-item {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      
      .animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Gallery Modal Styles - Fixed */
      #gallery-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        z-index: 9999;
        display: none;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        align-items: center;
        justify-content: center;
      }
      
      #gallery-modal.show {
        display: flex !important;
      }
      
      .gallery-item {
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      
      .gallery-item:hover {
        transform: scale(1.02);
      }
      
      /* Instalaciones Gallery Styles Override */
      .photo-collage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        padding: 2rem 0;
      }

      .photo-collage-grid .gallery-item {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .photo-collage-grid .gallery-item:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      }

      .photo-collage-grid .gallery-item img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .photo-collage-grid .gallery-item:hover img {
        transform: scale(1.05);
      }

      .photo-collage-grid .collage-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        color: white;
        padding: 2rem 1.5rem 1.5rem;
        transform: translateY(0);
        transition: transform 0.3s ease;
      }

      .photo-collage-grid .gallery-item:hover .collage-overlay {
        transform: translateY(-5px);
      }

      .photo-collage-grid .collage-overlay h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: white;
      }

      .photo-collage-grid .collage-overlay p {
        font-size: 0.9rem;
        line-height: 1.4;
        margin: 0;
        opacity: 0.9;
      }
      
      /* Photo Collage Masonry Layout for Modelo Educativo */
      .photo-collage {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
        padding: 2rem 0;
        max-width: 1200px;
        margin: 0 auto;
      }

      .collage-item {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .collage-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      }

      .collage-item img {
        width: 100%;
        height: 220px;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .collage-item:hover img {
        transform: scale(1.08);
      }

      .collage-item .collage-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
        color: white;
        padding: 1.5rem 1rem 1rem;
        transform: translateY(0);
        transition: transform 0.3s ease;
      }

      .collage-item:hover .collage-overlay {
        transform: translateY(-3px);
      }

      .collage-item .collage-overlay h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.4rem;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
      }

      .collage-item .collage-overlay p {
        font-size: 0.85rem;
        line-height: 1.3;
        margin: 0;
        opacity: 0.95;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
      }

      /* Special grid positioning for first items */
      .collage-item:nth-child(1) {
        grid-column: span 1;
        grid-row: span 1;
      }

      .collage-item:nth-child(2) {
        grid-column: span 1;
        grid-row: span 1;
      }

      .collage-item:nth-child(3) {
        grid-column: span 1;
        grid-row: span 1;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .photo-collage {
          grid-template-columns: 1fr;
          gap: 1rem;
          padding: 1rem 0;
        }
        
        .collage-item {
          grid-column: span 1 !important;
          grid-row: span 1 !important;
        }
        
        .collage-item img {
          height: 200px;
        }
        
        .photo-collage-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .photo-collage-grid .gallery-item img {
          height: 200px;
        }
      }
      
      /* Modal Content Styles */
      .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        margin: auto;
        display: block;
        text-align: center;
      }
      
      #modal-image {
        width: 100%;
        height: auto;
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }
      
      #modal-caption {
        color: white;
        text-align: center;
        padding: 1.5rem 2rem;
        margin-top: 1.5rem;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8));
        border-radius: 12px;
        font-size: 1.1rem;
        line-height: 1.6;
        font-weight: 500;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
      }
      
      #modal-caption h3 {
        color: #ffffff;
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      
      #modal-caption p {
        color: #e2e8f0;
        margin: 0;
        font-size: 1rem;
      }
      
      .close {
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 2.5rem;
        font-weight: bold;
        cursor: pointer;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.7);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        border: 2px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
      }
      
      .close:hover {
        background-color: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
        border-color: rgba(255, 255, 255, 0.5);
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

// Function to split active nav link text into individual letters
function initActiveNavAnimation() {
  const activeNavLink = document.querySelector(".nav-link.active");

  if (activeNavLink) {
    const text = activeNavLink.textContent;
    activeNavLink.innerHTML = "";

    // Split text into individual letters and wrap each in a span
    for (let i = 0; i < text.length; i++) {
      const letter = text[i];
      const span = document.createElement("span");
      span.classList.add("letter");
      span.textContent = letter === " " ? "\u00A0" : letter; // Non-breaking space for spaces
      activeNavLink.appendChild(span);
    }
  }
}

// The mobile navigation is already handled by the Navigation module above

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
    this.initHorarioFix();
    this.initA11y();
  },

  addCompatibilityFixes() {
    // NodeList forEach polyfill
    if (!window.NodeList || !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = Array.prototype.forEach;
    }
  },

  initHorarioFix() {
    // Ensure horario items are visible
    const horarioItems = document.querySelectorAll(".horario-item");
    horarioItems.forEach((item) => {
      item.style.opacity = "1";
      item.style.visibility = "visible";
      item.style.display = "block";
    });
  },

  initA11y() {
    var grids = document.querySelectorAll(
      ".photo-collage-grid, .photo-collage"
    );
    grids.forEach(function (grid) {
      if (grid) grid.setAttribute("role", "list");
    });

    var items = document.querySelectorAll(".gallery-item, .collage-item");
    items.forEach(function (el) {
      el.setAttribute("role", "listitem");
      el.setAttribute("tabindex", "0");
      var title = el.getAttribute("data-title");
      if (!title) {
        var h3 = el.querySelector(".collage-overlay h3");
        title = h3 ? h3.textContent.trim() : "Imagen de galería";
      }
      el.setAttribute("aria-label", title);
      el.addEventListener("keydown", function (e) {
        var key = e.key || e.code;
        if (key === "Enter" || key === " " || key === "Spacebar") {
          e.preventDefault();
          el.click();
        }
      });
    });
  },
};

// ===== DOCUMENT READY =====
document.addEventListener("DOMContentLoaded", () => {
  App.init();
  initActiveNavAnimation();
});

// Optimización: usar requestIdleCallback para tareas no críticas
function deferredInit() {
  // Inicializar características no críticas
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      initNonCriticalFeatures();
    });
  } else {
    setTimeout(initNonCriticalFeatures, 1);
  }
}

function initNonCriticalFeatures() {
  // Cargar iconos y fuentes secundarias
  const iconsLink = document.createElement("link");
  iconsLink.rel = "stylesheet";
  iconsLink.href =
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
  document.head.appendChild(iconsLink);

  // Cargar fuentes de Google si es necesario
  const fontsLink = document.createElement("link");
  fontsLink.rel = "stylesheet";
  fontsLink.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(fontsLink);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // ...existing code...
    deferredInit();
  });
} else {
  // ...existing code...
  deferredInit();
}
