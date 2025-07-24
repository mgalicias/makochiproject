// ===== VARIABLES GLOBALES =====
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

// ===== FUNCIONES DEL MENÚ HAMBURGUESA =====
function toggleMenu() {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");
}

function closeMenu() {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", function () {
  // Menú hamburguesa
  if (navToggle) {
    navToggle.addEventListener("click", toggleMenu);
  }

  // Cerrar menú al hacer clic en un enlace
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener("click", function (event) {
    const isClickInsideNav =
      navMenu.contains(event.target) || navToggle.contains(event.target);

    if (!isClickInsideNav && navMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  // ===== ANIMACIÓN DEL LOGO =====
  initLogoAnimation();

  // ===== ANIMACIÓN DE TÍTULO HERO =====
  initHeroTitleAnimation();

  // ===== GALERÍA MODAL =====
  initGalleryModal();

  // ===== FORMULARIO DE CONTACTO =====
  initContactForm();

  // ===== SMOOTH SCROLL PARA NAVEGACIÓN =====
  initSmoothScroll();

  // ===== ANIMACIONES AL HACER SCROLL =====
  initScrollAnimations();
});

// ===== FUNCIÓN PARA MODAL DE GALERÍA =====
function initGalleryModal() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const modal = document.getElementById("gallery-modal");
  const modalImage = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");
  const closeBtn = document.querySelector(".close");

  if (!modal) return; // Si no hay modal en la página, salir

  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const img = this.querySelector("img");
      const title = this.getAttribute("data-title") || img.alt;

      modalImage.src = img.src;
      modalImage.alt = img.alt;
      modalCaption.textContent = title;
      modal.style.display = "block";
      document.body.style.overflow = "hidden"; // Prevenir scroll del body
    });
  });

  // Cerrar modal
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restaurar scroll del body
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Cerrar modal al hacer clic fuera de la imagen
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Cerrar modal con tecla ESC
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });
}

// ===== FUNCIÓN PARA VALIDACIÓN DEL FORMULARIO =====
function initContactForm() {
  const contactForm = document.querySelector(".contact-form");

  if (!contactForm) return; // Si no hay formulario en la página, salir

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validar campos requeridos
    const requiredFields = contactForm.querySelectorAll("[required]");
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = "#ef4444";
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      } else {
        field.style.borderColor = "#d1d5db";
      }
    });

    // Validar email
    const emailField = contactForm.querySelector("#email");
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.style.borderColor = "#ef4444";
        if (!firstInvalidField) {
          firstInvalidField = emailField;
        }
      }
    }

    // Si no es válido, enfocar el primer campo con error
    if (!isValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      showNotification(
        "Por favor, completa todos los campos requeridos correctamente.",
        "error"
      );
      return;
    }

    // Si es válido, mostrar mensaje de éxito y enviar
    showNotification(
      "Gracias por tu mensaje. Te contactaremos pronto.",
      "success"
    );

    // Aquí normalmente enviarías el formulario
    // Para este ejemplo, simplemente limpiamos el formulario después de 2 segundos
    setTimeout(() => {
      contactForm.reset();
    }, 2000);
  });

  // Limpiar estilos de error al escribir
  const formInputs = contactForm.querySelectorAll("input, textarea, select");
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      this.style.borderColor = "#d1d5db";
    });
  });
}

// ===== FUNCIÓN PARA MOSTRAR NOTIFICACIONES =====
function showNotification(message, type = "info") {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${
          type === "success"
            ? "#10b981"
            : type === "error"
            ? "#ef4444"
            : "#3b82f6"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
  notification.textContent = message;

  // Agregar estilos de animación
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
  document.head.appendChild(style);

  // Agregar al DOM
  document.body.appendChild(notification);

  // Remover después de 5 segundos
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// ===== FUNCIÓN PARA SCROLL SUAVE =====
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      const href = this.getAttribute("href");

      if (href === "#") return;

      const target = document.querySelector(href);

      if (target) {
        event.preventDefault();

        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        closeMenu();
      }
    });
  });
}

// ===== FUNCIÓN PARA ANIMACIONES AL HACER SCROLL =====
function initScrollAnimations() {
  // Crear observer para animaciones
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observar elementos que queremos animar
  const animatedElements = document.querySelectorAll(
    ".card, .team-member, .pilar-item, .area-card, .taller-card, .gallery-item, .caracteristica-item, .paso-item, .costo-card, .fecha-item, .faq-item"
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Agregar estilos CSS para animaciones
  const animationStyles = document.createElement("style");
  animationStyles.textContent = `
        .card, .team-member, .pilar-item, .area-card, .taller-card, .gallery-item, .caracteristica-item, .paso-item, .costo-card, .fecha-item, .faq-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .gallery-item:hover {
            transform: translateY(0) scale(1.02);
        }
        
        .animate-in.gallery-item:hover {
            transform: translateY(0) scale(1.02);
        }
    `;
  document.head.appendChild(animationStyles);
}

// ===== FUNCIÓN PARA MANEJO DEL SCROLL DEL HEADER =====
function initHeaderScroll() {
  const header = document.querySelector(".header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      header.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });

  // Agregar transición al header
  header.style.transition = "transform 0.3s ease-in-out";
}

// ===== FUNCIÓN PARA LAZY LOADING DE IMÁGENES =====
function initLazyLoading() {
  const images = document.querySelectorAll('img[src*="placeholder"]');

  const imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Aquí normalmente cargarías la imagen real
        // Por ahora solo agregamos una clase para indicar que está cargada
        img.classList.add("loaded");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    imageObserver.observe(img);
  });
}

// ===== FUNCIÓN PARA VALIDACIÓN EN TIEMPO REAL =====
function initRealTimeValidation() {
  const emailInputs = document.querySelectorAll('input[type="email"]');
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  emailInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.value && !emailRegex.test(this.value)) {
        this.style.borderColor = "#ef4444";
        showFieldError(this, "Por favor ingresa un email válido");
      } else {
        this.style.borderColor = "#d1d5db";
        hideFieldError(this);
      }
    });
  });

  phoneInputs.forEach((input) => {
    input.addEventListener("input", function () {
      // Solo permitir números, espacios, paréntesis y guiones
      this.value = this.value.replace(/[^0-9\s\(\)\-]/g, "");
    });
  });
}

// ===== FUNCIONES AUXILIARES PARA VALIDACIÓN =====
function showFieldError(field, message) {
  hideFieldError(field); // Limpiar error previo

  const errorDiv = document.createElement("div");
  errorDiv.className = "field-error";
  errorDiv.style.cssText =
    "color: #ef4444; font-size: 0.8rem; margin-top: 0.25rem;";
  errorDiv.textContent = message;

  field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
  const existingError = field.parentNode.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }
}

// ===== FUNCIÓN PARA ANIMACIÓN DEL TÍTULO HERO =====
function initHeroTitleAnimation() {
  const heroTitle = document.querySelector(".hero-title");

  if (!heroTitle) return; // Si no hay título hero en la página, salir

  // Guardar estilos originales del título
  const originalStyles = window.getComputedStyle(heroTitle);
  const originalFontSize = originalStyles.fontSize;
  const originalFontWeight = originalStyles.fontWeight;
  const originalFontFamily = originalStyles.fontFamily;
  const originalColor = originalStyles.color;
  const originalTextShadow = originalStyles.textShadow;

  // Dividir el texto en palabras y luego en letras
  const text = heroTitle.textContent;
  const words = text.split(" ");
  heroTitle.innerHTML = "";

  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "hero-word";
    wordSpan.style.cssText = `
            display: inline-block;
            margin-right: 0.5rem;
        `;

    word.split("").forEach((char, charIndex) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.cssText = `
                display: inline-block;
                animation: jumpLetter 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${
                  (wordIndex * word.length + charIndex) * 0.08
                }s both;
                transform-origin: bottom center;
                cursor: pointer;
                position: relative;
                font-size: ${originalFontSize};
                font-weight: ${originalFontWeight};
                font-family: ${originalFontFamily};
                color: ${originalColor};
                text-shadow: ${originalTextShadow};
            `;

      // Variables para manejar doble clic en cada letra
      let letterClickCount = 0;
      let letterClickTimer = null;

      // Agregar eventos para efectos interactivos
      span.addEventListener("click", function () {
        letterClickCount++;

        if (letterClickCount === 1) {
          // Primer clic: partículas y ripple
          createParticles(this);
          createRippleEffect(this);

          letterClickTimer = setTimeout(() => {
            letterClickCount = 0;
          }, 400);
        } else if (letterClickCount === 2) {
          // Segundo clic: onda de impacto
          clearTimeout(letterClickTimer);
          letterClickCount = 0;
          createImpactWave(this);
        }
      });

      // Hover sobre letra activa toda la palabra
      span.addEventListener("mouseenter", function () {
        animateWord(wordSpan);
      });

      wordSpan.appendChild(span);
    });

    heroTitle.appendChild(wordSpan);
  });

  // Agregar estilos CSS para la animación mejorada (sin estilos de contador)
  const animationStyles = document.createElement("style");
  animationStyles.textContent = `
        .hero-title {
            perspective: 1000px;
            overflow: visible;
            /* Preservar estilos originales del título */
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            background: inherit;
            -webkit-background-clip: inherit;
            -webkit-text-fill-color: inherit;
            background-clip: inherit;
        }
        
        .hero-title .hero-word span {
            /* Heredar todos los estilos del título original */
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            line-height: inherit;
            /* Mantener el gradiente de texto si existe */
            background: linear-gradient(45deg, 
                var(--color-primary), 
                var(--color-secondary), 
                var(--color-accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        @keyframes jumpLetter {
            0% {
                transform: translateY(50px) rotateX(90deg) scale(0.5);
                opacity: 0;
                background: linear-gradient(45deg, var(--color-accent), var(--color-accent));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 10px var(--color-accent);
            }
            30% {
                transform: translateY(-15px) rotateX(0deg) scale(1.2);
                opacity: 1;
                background: linear-gradient(45deg, var(--color-primary), var(--color-primary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 20px var(--color-primary);
            }
            60% {
                transform: translateY(5px) scale(0.95);
                background: linear-gradient(45deg, var(--color-secondary), var(--color-secondary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 15px var(--color-secondary);
            }
            100% {
                transform: translateY(0) rotateX(0deg) scale(1);
                opacity: 1;
                background: linear-gradient(45deg, 
                    var(--color-primary), 
                    var(--color-secondary), 
                    var(--color-accent));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            }
        }
        
        .hero-title span:hover {
            animation: jumpLetterHover 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
        }
        
        @keyframes jumpLetterHover {
            0%, 100% {
                transform: translateY(0) scale(1) rotateZ(0deg);
                background: linear-gradient(45deg, 
                    var(--color-primary), 
                    var(--color-secondary), 
                    var(--color-accent));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            }
            25% {
                transform: translateY(-8px) scale(1.15) rotateZ(-2deg);
                background: linear-gradient(45deg, var(--color-primary), var(--color-primary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 15px var(--color-primary);
            }
            75% {
                transform: translateY(-5px) scale(1.1) rotateZ(2deg);
                background: linear-gradient(45deg, var(--color-secondary), var(--color-secondary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 12px var(--color-secondary);
            }
        }
        
        .hero-word.animate-word span {
            animation: wordWave 0.6s ease-in-out;
        }
        
        @keyframes wordWave {
            0%, 100% {
                transform: translateY(0) scale(1);
                background: linear-gradient(45deg, 
                    var(--color-primary), 
                    var(--color-secondary), 
                    var(--color-accent));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            25% {
                transform: translateY(-12px) scale(1.1);
                background: linear-gradient(45deg, var(--color-primary), var(--color-primary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 20px var(--color-primary);
            }
            75% {
                transform: translateY(-8px) scale(1.05);
                background: linear-gradient(45deg, var(--color-secondary), var(--color-secondary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 15px var(--color-secondary);
            }
        }
        
        /* Modo arcoíris mejorado */
        .rainbow-mode .hero-word span {
            animation: rainbowPulse 2s ease-in-out infinite;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
        }
        
        @keyframes rainbowPulse {
            0%, 100% {
                background: linear-gradient(45deg, #FF6B6B, #FF6B6B);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 20px #FF6B6B;
            }
            16.66% {
                background: linear-gradient(45deg, #FFE66D, #FFE66D);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 20px #FFE66D;
            }
            33.33% {
                background: linear-gradient(45deg, #4ECDC4, #4ECDC4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 20px #4ECDC4;
            }
            50% {
                background: linear-gradient(45deg, #A8E6CF, #A8E6CF);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 20px #A8E6CF;
            }
            66.66% {
                background: linear-gradient(45deg, #FF8B94, #FF8B94);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 20px #FF8B94;
            }
            83.33% {
                background: linear-gradient(45deg, #87CEEB, #87CEEB);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 20px #87CEEB;
            }
        }
        
        /* Resto de animaciones... */
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--color-accent);
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat 1s ease-out forwards;
        }
        
        @keyframes particleFloat {
            0% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            100% {
                opacity: 0;
                transform: scale(0.3) translateY(-30px);
            }
        }
        
        .impact-wave {
            position: absolute;
            border: 2px solid var(--color-primary);
            border-radius: 50%;
            pointer-events: none;
            animation: waveExpand 0.6s ease-out forwards;
        }
        
        @keyframes waveExpand {
            0% {
                width: 0;
                height: 0;
                opacity: 1;
                border-width: 3px;
            }
            100% {
                width: 40px;
                height: 40px;
                opacity: 0;
                border-width: 1px;
            }
        }
        
        .ripple-effect {
            position: absolute;
            background: radial-gradient(circle, rgba(255, 107, 107, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: rippleExpand 0.5s ease-out forwards;
        }
        
        @keyframes rippleExpand {
            0% {
                width: 0;
                height: 0;
                opacity: 1;
            }
            100% {
                width: 60px;
                height: 60px;
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(animationStyles);
}

// ===== FUNCIÓN PARA ANIMAR PALABRA COMPLETA =====
function animateWord(wordElement) {
  // Limpiar animación anterior
  wordElement.classList.remove("animate-word");

  // Forzar reflow para reiniciar la animación
  wordElement.offsetHeight;

  // Agregar clase de animación
  wordElement.classList.add("animate-word");

  // Animar cada letra de la palabra con delay escalonado
  const letters = wordElement.querySelectorAll("span");
  letters.forEach((letter, index) => {
    setTimeout(() => {
      letter.style.animationDelay = `${index * 0.05}s`;
    }, index * 50);
  });

  // Quitar la clase después de la animación
  setTimeout(() => {
    wordElement.classList.remove("animate-word");
  }, 600);
}

// ===== FUNCIÓN PARA CREAR PARTÍCULAS =====
function createParticles(element) {
  const rect = element.getBoundingClientRect();
  const particleCount = 6;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Posición aleatoria alrededor de la letra
    const angle = (Math.PI * 2 * i) / particleCount;
    const radius = 20 + Math.random() * 10;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    particle.style.cssText = `
            position: absolute;
            left: ${rect.left + rect.width / 2 + x}px;
            top: ${rect.top + rect.height / 2 + y}px;
            width: ${3 + Math.random() * 3}px;
            height: ${3 + Math.random() * 3}px;
            background: ${
              [
                "var(--color-primary)",
                "var(--color-secondary)",
                "var(--color-accent)",
              ][Math.floor(Math.random() * 3)]
            };
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;

    document.body.appendChild(particle);

    // Animar partícula
    particle.animate(
      [
        {
          opacity: 1,
          transform: "scale(1) translateY(0px)",
          background: particle.style.background,
        },
        {
          opacity: 0,
          transform: `scale(0.3) translateY(-${30 + Math.random() * 20}px)`,
          background: "var(--color-accent)",
        },
      ],
      {
        duration: 800 + Math.random() * 400,
        easing: "ease-out",
      }
    ).onfinish = () => {
      particle.remove();
    };
  }
}

// ===== FUNCIÓN PARA CREAR ONDAS DE IMPACTO =====
function createImpactWave(element) {
  const rect = element.getBoundingClientRect();
  const wave = document.createElement("div");
  wave.className = "impact-wave";

  wave.style.cssText = `
        position: absolute;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.bottom - 5}px;
        transform: translate(-50%, -50%);
        z-index: 999;
    `;

  document.body.appendChild(wave);

  setTimeout(() => {
    wave.remove();
  }, 600);
}

// ===== FUNCIÓN PARA CREAR EFECTO RIPPLE =====
function createRippleEffect(element) {
  const rect = element.getBoundingClientRect();
  const ripple = document.createElement("div");
  ripple.className = "ripple-effect";

  ripple.style.cssText = `
        position: absolute;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        transform: translate(-50%, -50%);
        z-index: 998;
    `;

  document.body.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 500);
}

// ===== FUNCIÓN PARA DOBLE CLIC EN PALABRAS =====
function initWordDoubleClick() {
  const heroWords = document.querySelectorAll(".hero-word");

  heroWords.forEach((word) => {
    let clickCount = 0;
    let clickTimer = null;

    word.addEventListener("click", function (event) {
      clickCount++;

      if (clickCount === 1) {
        clearTimeout(clickTimer);
        clickCount = 0;

        // Efecto especial para doble clic
        animateWordExplosion(this);
        event.stopPropagation();
      }
    });
  });
}

// ===== FUNCIÓN PARA EXPLOSIÓN DE PALABRA =====
function animateWordExplosion(wordElement) {
  const letters = wordElement.querySelectorAll("span");

  letters.forEach((letter, index) => {
    const originalTransform = letter.style.transform;

    letter.animate(
      [
        { transform: originalTransform },
        {
          transform: `${originalTransform} scale(2) rotate(${
            Math.random() * 360
          }deg) translate(${(Math.random() - 0.5) * 100}px, ${
            (Math.random() - 0.5) * 100
          }px)`,
          background: `linear-gradient(45deg, ${
            [
              "var(--color-primary)",
              "var(--color-accent)",
              "var(--color-secondary)",
            ][Math.floor(Math.random() * 3)]
          }, ${
            [
              "var(--color-primary)",
              "var(--color-accent)",
              "var(--color-secondary)",
            ][Math.floor(Math.random() * 3)]
          })`,
        },
        { transform: originalTransform },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      }
    );

    // Crear mini partículas alrededor de cada letra
    setTimeout(() => {
      createMiniParticles(letter);
    }, index * 100);
  });
}

// ===== FUNCIÓN PARA MINI PARTÍCULAS =====
function createMiniParticles(element) {
  const rect = element.getBoundingClientRect();

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    const angle = (Math.PI * 2 * i) / 8;
    const velocity = 15 + Math.random() * 10;

    particle.style.cssText = `
            position: absolute;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 2px;
            height: 2px;
            background: var(--color-accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1500;
        `;

    document.body.appendChild(particle);

    particle.animate(
      [
        {
          opacity: 1,
          transform: "translate(-50%, -50%) scale(1)",
        },
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
    ).onfinish = () => {
      particle.remove();
    };
  }
}

// ===== INICIALIZACIÓN ADICIONAL =====
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar funcionalidades adicionales
  initHeaderScroll();
  initLazyLoading();
  initRealTimeValidation();

  // Inicializar doble clic en palabras
  setTimeout(() => {
    initWordDoubleClick();
  }, 2000); // Esperar a que termine la animación inicial
});

// ===== FUNCIÓN PARA RESIZE DE VENTANA =====
window.addEventListener("resize", function () {
  // Cerrar menú móvil al cambiar a desktop
  if (window.innerWidth >= 768) {
    closeMenu();
  }
});

// ===== PREVENIR ERRORES DE FORMULARIO EN NAVEGADORES ANTIGUOS =====
if (!window.NodeList || !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// ===== FALLBACK PARA INTERSECTION OBSERVER =====
if (!window.IntersectionObserver) {
  // Fallback simple para navegadores que no soportan IntersectionObserver
  const animatedElements = document.querySelectorAll(
    ".card, .team-member, .pilar-item, .area-card, .taller-card, .gallery-item, .caracteristica-item, .paso-item, .costo-card, .fecha-item, .faq-item"
  );
  animatedElements.forEach((element) => {
    element.classList.add("animate-in");
  });
}

// ===== FUNCIÓN PARA ANIMACIÓN DEL LOGO =====
function initLogoAnimation() {
  const logo = document.querySelector(".logo");
  const logoContainer = document.querySelector(".nav-logo a");

  if (!logo || !logoContainer) return;

  logoContainer.addEventListener("click", function (event) {
    // Prevenir navegación momentáneamente para mostrar animación
    event.preventDefault();

    // Crear efecto de partículas alrededor del logo
    createLogoParticles(logo);

    // Animación principal del logo
    logo.style.animation =
      "logoClickAnimation 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";

    // Efecto de onda expansiva
    createLogoRipple(logoContainer);

    // Navegación después de la animación
    setTimeout(() => {
      logo.style.animation = "";
      window.location.href = logoContainer.href;
    }, 600);
  });

  // Hover effect
  logoContainer.addEventListener("mouseenter", function () {
    logo.style.animation = "logoHover 0.3s ease-out";
  });

  logoContainer.addEventListener("mouseleave", function () {
    logo.style.animation = "";
  });

  // Agregar estilos CSS para las animaciones del logo
  const logoStyles = document.createElement("style");
  logoStyles.textContent = `
        .nav-logo {
            overflow: visible;
            position: relative;
        }
        
        .logo {
            transition: all 0.3s ease;
            transform-origin: center;
        }
        
        @keyframes logoClickAnimation {
            0% {
                transform: scale(1) rotate(0deg);
                filter: brightness(1) drop-shadow(0 0 0 transparent);
            }
            25% {
                transform: scale(1.2) rotate(-5deg);
                filter: brightness(1.2) drop-shadow(0 0 10px #4285F4);
            }
            50% {
                transform: scale(0.9) rotate(5deg);
                filter: brightness(1.4) drop-shadow(0 0 15px #EA4335);
            }
            75% {
                transform: scale(1.1) rotate(-2deg);
                filter: brightness(1.1) drop-shadow(0 0 20px #FBBC04);
            }
            100% {
                transform: scale(1) rotate(0deg);
                filter: brightness(1) drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            }
        }
        
        @keyframes logoHover {
            0%, 100% {
                transform: scale(1) rotate(0deg);
            }
            50% {
                transform: scale(1.05) rotate(1deg);
            }
        }
        
        .logo-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #4285F4;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        }
        
        .logo-ripple {
            position: absolute;
            border: 2px solid #4285F4;
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    `;
  document.head.appendChild(logoStyles);
}

// ===== FUNCIÓN PARA CREAR PARTÍCULAS DEL LOGO =====
function createLogoParticles(logoElement) {
  const rect = logoElement.getBoundingClientRect();
  const particleCount = 8;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "logo-particle";

    // Posición aleatoria alrededor del logo
    const angle = (Math.PI * 2 * i) / particleCount;
    const radius = 25 + Math.random() * 15;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Google colors array
    const googleColors = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];

    particle.style.cssText = `
            position: absolute;
            left: ${rect.left + rect.width / 2 + x}px;
            top: ${rect.top + rect.height / 2 + y}px;
            width: ${3 + Math.random() * 4}px;
            height: ${3 + Math.random() * 4}px;
            background: ${
              googleColors[Math.floor(Math.random() * googleColors.length)]
            };
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;

    document.body.appendChild(particle);

    // Animar partícula
    particle.animate(
      [
        {
          opacity: 1,
          transform: "scale(1) translateY(0px) rotate(0deg)",
        },
        {
          opacity: 0,
          transform: `scale(0.3) translateY(-${
            40 + Math.random() * 20
          }px) rotate(360deg)`,
        },
      ],
      {
        duration: 1000 + Math.random() * 500,
        easing: "ease-out",
      }
    ).onfinish = () => {
      particle.remove();
    };
  }
}

// ===== FUNCIÓN PARA CREAR ONDA DEL LOGO =====
function createLogoRipple(logoContainer) {
  const ripple = document.createElement("div");
  ripple.className = "logo-ripple";

  logoContainer.appendChild(ripple);

  ripple.animate(
    [
      {
        width: "0px",
        height: "0px",
        opacity: 1,
        borderWidth: "3px",
        borderColor: "#4285F4",
      },
      {
        width: "80px",
        height: "80px",
        opacity: 0,
        borderWidth: "1px",
        borderColor: "#EA4335",
      },
    ],
    {
      duration: 600,
      easing: "ease-out",
    }
  ).onfinish = () => {
    ripple.remove();
  };
}
