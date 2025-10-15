// Lazy loading de imágenes optimizado
(function () {
  "use strict";

  // Configuración de Intersection Observer
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // Cargar imagen
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }

          // Cargar srcset si existe
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute("data-srcset");
          }

          // Remover clase de loading
          img.classList.remove("lazy");
          img.classList.add("loaded");

          // Dejar de observar
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.01,
    }
  );

  // Observar todas las imágenes lazy
  function initLazyLoad() {
    const lazyImages = document.querySelectorAll(
      'img[loading="lazy"], img.lazy, img[data-src]'
    );
    lazyImages.forEach((img) => imageObserver.observe(img));
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLazyLoad);
  } else {
    initLazyLoad();
  }

  // Re-inicializar para contenido dinámico
  window.reInitLazyLoad = initLazyLoad;
})();
