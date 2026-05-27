const header = document.querySelector('header');

if (header) {
  const toggleScrolledClass = () => {
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', toggleScrolledClass);
  toggleScrolledClass();
}

document.addEventListener('DOMContentLoaded', function() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const currentPath = window.location.pathname;
      const linkPath = this.pathname;

      if (linkPath !== '' && linkPath !== currentPath) {
        const url = linkPath + targetId;
        window.location.href = url;
      } else {
        const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
        const windowHeight = window.innerHeight;
        const elementHeight = targetElement.offsetHeight;

        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (windowHeight / 2) + (elementHeight / 2);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        history.pushState(null, null, targetId);
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var modalButtons = document.querySelectorAll('.open-modal-dialog'),
      overlay = document.querySelector('body'),
      closeButtons = document.querySelectorAll('.modal-dialog .modal-close');

  var currentOpenModal = null;

  async function openModal(modalBtn) {
    return new Promise(resolve => {
      var modalId = modalBtn.getAttribute('data-src'),
          modalElem = document.querySelector('.modal-dialog.' + modalId);

      if (currentOpenModal && currentOpenModal !== modalElem) {
        closeModalDirectly(currentOpenModal);
      }

      overlay.classList.add('modal-open');
      modalElem.style.display = 'flex';

      setTimeout(function() {
        modalElem.classList.add('modal-opening');
        currentOpenModal = modalElem;
        resolve();
      }, 0);
    });
  }

  async function closeModal(closeBtn) {
    return new Promise(resolve => {
      var modal = closeBtn.closest('.modal-dialog');
      modal.classList.remove('modal-opening');
      modal.classList.add('modal-closing');

      setTimeout(function() {
        modal.classList.remove('modal-closing');
        modal.style.display = 'none';
        overlay.classList.remove('modal-open');
        if (currentOpenModal === modal) {
          currentOpenModal = null;
        }
        resolve();
      }, 500);
    });
  }

  function closeModalDirectly(modalElem) {
    modalElem.classList.remove('modal-opening');
    modalElem.style.display = 'none';

    if (currentOpenModal === modalElem) {
      currentOpenModal = null;
    }

    var anyModalOpen = document.querySelector('.modal-dialog[style*="display: flex"]');
    if (!anyModalOpen) {
      overlay.classList.remove('modal-open');
    }
  }

  /* open modal */
  modalButtons.forEach(function(modalBtn) {
    modalBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await openModal(modalBtn);
    });
  });

  /* close modal */
  closeButtons.forEach(function(closeBtn) {
    closeBtn.addEventListener('click', async function(e) {
      await closeModal(closeBtn);
    });
  });

  document.querySelectorAll('.modal-dialog').forEach(function(modal) {
    modal.addEventListener('click', async function(e) {
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody && !modalBody.contains(e.target)) {
        await closeModal(modal);
      }
    });
  });

});

document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const closeMenuButton = document.querySelector('.close-menu-button');
  const headerNav = document.querySelector('.header-nav');

  function isMobileView() {
    return window.innerWidth <= 1024;
  }

  function openMenu() {
    if (isMobileView()) {
      headerNav.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMenu() {
    headerNav.classList.remove('show');
    document.body.style.overflow = '';
  }

  mobileMenuButton.addEventListener('click', openMenu);
  closeMenuButton.addEventListener('click', closeMenu);

  const menuLinks = document.querySelectorAll('.main-menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (isMobileView()) {
        closeMenu();
      }
    });
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) {
      closeMenu();
    }
  });

});

function checkAllBlocks() {
  const blocks = document.querySelectorAll('.animate-block');

  blocks.forEach(block => {
    if (block.hasAttribute('data-animated')) {
      return;
    }

    const rect = block.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isInFooter = block.closest('footer');
    const offset = (isInFooter || window.innerWidth < 768) ? 0 : 0;

    if (rect.top <= windowHeight - offset && rect.bottom >= 0) {
      const delay = block.getAttribute('data-delay') || 0;
      const animationType = block.getAttribute('data-animation') || 'fade-up';

      setTimeout(() => {
        block.classList.add('animated');
        block.classList.add(animationType);
        block.setAttribute('data-animated', 'true');
      }, parseInt(delay));
    }
  });
}

function checkVisibility() {
  checkAllBlocks();
}

window.addEventListener('load', function() {
  checkVisibility();
  setTimeout(checkAllBlocks, 500);
});

window.addEventListener('scroll', checkVisibility);

window.addEventListener('resize', function() {
  setTimeout(checkAllBlocks, 100);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const block = entry.target;
      const delay = parseInt(block.getAttribute('data-delay') || 0);
      const animationType = block.getAttribute('data-animation') || 'fade-up';

      setTimeout(() => {
        block.classList.add('animated', animationType);
        block.setAttribute('data-animated', 'true');
      }, delay);

      observer.unobserve(block);
    }
  });
}, { threshold: 0.1, rootMargin: '50px' });

document.querySelectorAll('.animate-block:not([data-animated])').forEach(block => {
  observer.observe(block);
});

document.addEventListener('DOMContentLoaded', function () {
  function animateNumber(element, target, suffix, duration) {
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.floor(progress * target);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  const statBlocks = document.querySelectorAll('.block-stats-js');

  statBlocks.forEach(block => {
    const statItems = block.querySelectorAll('.stat-item .stat-title');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          let text = element.textContent.trim();

          const prefixMatch = text.match(/^([<>=\s]+)?([\d.]+)(.*)$/);

          if (prefixMatch && !element.hasAttribute('data-animated')) {
            const prefix = prefixMatch[1] || '';
            const target = parseFloat(prefixMatch[2]);
            let suffix = prefixMatch[3] || '';

            const fullSuffix = prefix + suffix;

            const duration = parseInt(element.dataset.duration) || 2000;

            element.textContent = prefix + '0' + suffix;

            animateNumberWithPrefix(element, target, prefix, suffix, duration);
            element.setAttribute('data-animated', 'true');
            observer.unobserve(element);
          }
        }
      });
    }, { threshold: 0.5 });

    statItems.forEach(item => observer.observe(item));
  });

  function animateNumberWithPrefix(element, target, prefix, suffix, duration) {
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.floor(progress * target);

      element.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(step);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const mapWrapper = document.querySelector('.migration-map-section .map-wrapper');
  if (!mapWrapper) return;

  const images = mapWrapper.querySelectorAll('.map-image');

  const mapImageDefault = images[0];
  const mapImageActive = images[1];

  if (!mapImageDefault || !mapImageActive) return;

  mapImageDefault.style.opacity = '1';
  mapImageActive.style.opacity = '0';
  mapImageDefault.style.position = 'relative';
  mapImageActive.style.position = 'absolute';
  mapImageActive.style.top = '0';
  mapImageActive.style.left = '0';

  mapWrapper.addEventListener('mouseenter', function() {
    mapImageDefault.style.opacity = '0';
    mapImageActive.style.opacity = '1';
  });

  mapWrapper.addEventListener('mouseleave', function() {
    mapImageDefault.style.opacity = '1';
    mapImageActive.style.opacity = '0';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('.wpcf7 form');

  forms.forEach(form => {
    const brElements = form.querySelectorAll('br');
    brElements.forEach(br => br.remove());
  });
});

var swiper1 = new Swiper(".blog-slider", {
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  watchSlidesProgress: true,
  navigation: {
    nextEl: ".blog-section .swiper-button-next",
    prevEl: ".blog-section .swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    601: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  }
});

var swiper2 = new Swiper(".partner-slider", {
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  watchSlidesProgress: true,
  slidesPerView: 1,
  spaceBetween: 0,
  navigation: {
    nextEl: ".partners-company-section .swiper-button-next",
    prevEl: ".partners-company-section .swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    601: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 1,
      spaceBetween: 40,
    },
  }
});

var swiper3 = new Swiper(".gallery-slider-thumbs", {
  spaceBetween: 20,
  slidesPerView: 10,
  watchSlidesProgress: true,
  observer: true,
  observeParents: true,
  breakpoints: {
    0: {
      slidesPerView: 5,
      spaceBetween: 10,
    },
    1025: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
  },
});

var swiper4 = new Swiper(".gallery-slider-main", {
  spaceBetween: 10,
  slidesPerView: 1,
  effect: "fade",
  observer: true,
  observeParents: true,
  watchSlidesProgress: true,
  navigation: {
    nextEl: ".gallery-slider-main .swiper-button-next",
    prevEl: ".gallery-slider-main .swiper-button-prev",
  },
});
