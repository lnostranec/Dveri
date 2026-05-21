(function () {
  var cookieBanner = document.getElementById("cookieBanner");
  var cookieBannerAccept = document.getElementById("cookieBannerAccept");
  var COOKIE_CONSENT_KEY = "hollywood_doors_cookie_consent_v1";

  function showCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.hidden = false;
    requestAnimationFrame(function () {
      cookieBanner.classList.add("is-visible");
    });
  }

  function hideCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.classList.remove("is-visible");
    setTimeout(function () {
      if (!cookieBanner.classList.contains("is-visible")) {
        cookieBanner.hidden = true;
      }
    }, 220);
  }

  function getCookieConsentAccepted() {
    try {
      return window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
    } catch (e) {
      return false;
    }
  }

  function setCookieConsentAccepted() {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    } catch (e) {}
  }

  function updateCookieBannerVisibility() {
    if (!cookieBanner) return;
    if (getCookieConsentAccepted()) {
      hideCookieBanner();
      return;
    }
    showCookieBanner();
  }

  if (cookieBanner && cookieBannerAccept) {
    cookieBannerAccept.addEventListener("click", function () {
      setCookieConsentAccepted();
      hideCookieBanner();
    });
    updateCookieBannerVisibility();
  }
})();

(function () {
  var menu = document.querySelector(".mobile-menu");
  if (!menu) return;

  var closeBtn = menu.querySelector(".mobile-menu__close");
  var backdrop = menu.querySelector(".mobile-menu__backdrop");
  var links = menu.querySelectorAll(".mobile-menu__links a");
  var openBtn = document.querySelector(".header-tools__menu");

  function openMenu() {
    menu.hidden = false;
    menu.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () {
      menu.classList.add("is-open");
    });
    document.body.classList.add("mobile-menu-open");
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mobile-menu-open");
    setTimeout(function () {
      if (!menu.classList.contains("is-open")) {
        menu.hidden = true;
      }
    }, 220);
  }

  if (openBtn) {
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openMenu();
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (backdrop) backdrop.addEventListener("click", closeMenu);
  links.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
})();

(function () {
  var searchTriggers = document.querySelectorAll(".header-tools__icon");
  if (!searchTriggers.length) return;

  function ensureSearchOverlay() {
    var existing = document.querySelector(".header-search-overlay");
    if (existing) return existing;

    var overlay = document.createElement("div");
    overlay.className = "header-search-overlay";
    overlay.setAttribute("hidden", "");
    overlay.innerHTML =
      '<div class="header-search-overlay__inner">' +
      '<form class="header-search-overlay__form" action="#" method="get">' +
      '<label class="header-search-overlay__label">' +
      '<input type="text" name="q" placeholder=" " autocomplete="off" />' +
      '<span class="header-search-overlay__label-text">Введите название</span>' +
      "</label>" +
      '<button type="submit">Найти</button>' +
      "</form>" +
      '<button type="button" class="header-search-overlay__close" aria-label="Закрыть поиск"></button>' +
      "</div>";

    document.body.appendChild(overlay);
    return overlay;
  }

  var overlay = ensureSearchOverlay();
  var closeBtn = overlay.querySelector(".header-search-overlay__close");
  var searchForm = overlay.querySelector(".header-search-overlay__form");
  var searchInput = overlay.querySelector('input[name="q"]');
  var bodyPaddingRightBeforeSearch = "";

  function getScrollbarWidth() {
    return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  }

  function syncSearchLabelState() {
    if (!searchInput) return;
    if (String(searchInput.value || "").trim() === "") {
      searchInput.classList.remove("has-value");
    } else {
      searchInput.classList.add("has-value");
    }
  }

  function openSearchOverlay(e) {
    e.preventDefault();
    bodyPaddingRightBeforeSearch = document.body.style.paddingRight;
    var scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + "px";
    }
    overlay.hidden = false;
    document.body.classList.add("search-overlay-open");
    requestAnimationFrame(function () {
      overlay.classList.add("is-open");
    });
  }

  function closeSearchOverlay() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("search-overlay-open");
    document.body.style.paddingRight = bodyPaddingRightBeforeSearch;
    setTimeout(function () {
      if (!overlay.classList.contains("is-open")) {
        overlay.hidden = true;
      }
    }, 220);
  }

  searchTriggers.forEach(function (btn) {
    btn.addEventListener("click", openSearchOverlay);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeSearchOverlay);
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }
  if (searchInput) {
    syncSearchLabelState();
    searchInput.addEventListener("input", syncSearchLabelState);
  }
})();

(function () {
  var feature = document.getElementById("heroFeature");
  if (!feature) return;

  var slides = feature.querySelectorAll(".hero-intro__feature-slide");
  var caption = feature.querySelector(".hero-intro__feature-caption");
  var prevBtn = feature.querySelector(".hero-intro__nav-btn--prev");
  var nextBtn = feature.querySelector(".hero-intro__nav-btn--next");
  var dotsRoot = feature.querySelector(".hero-intro__dots");
  if (!slides.length || !dotsRoot) return;

  var current = 0;
  var dots = [];

  slides.forEach(function (slide, idx) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero-intro__dot" + (idx === 0 ? " is-active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Слайд " + (idx + 1));
    dot.setAttribute("aria-selected", idx === 0 ? "true" : "false");
    dot.addEventListener("click", function () {
      goTo(idx);
    });
    dotsRoot.appendChild(dot);
    dots.push(dot);
  });

  function syncCaption() {
    if (!caption) return;
    var active = slides[current];
    caption.textContent = active.getAttribute("data-caption") || "";
  }

  function render() {
    slides.forEach(function (slide, idx) {
      slide.classList.toggle("is-active", idx === current);
    });
    dots.forEach(function (dot, idx) {
      var on = idx === current;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-selected", on ? "true" : "false");
    });
    syncCaption();
  }

  function goTo(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    render();
  }

  function step(delta) {
    goTo(current + delta);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      step(-1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      step(1);
    });
  }

  var swipeArea = feature.querySelector(".hero-intro__feature-slides") || feature;
  var dragStartX = 0;
  var dragActive = false;
  var swipeThreshold = 40;
  var lastSwipeStepAt = 0;
  var useTouchSwipe =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  function isSwipeBlocked(target) {
    return target && target.closest && target.closest(".hero-intro__dot, .hero-intro__nav");
  }

  function onSwipeEnd(dx) {
    if (Math.abs(dx) < swipeThreshold) return;
    var now = Date.now();
    if (now - lastSwipeStepAt < 350) return;
    lastSwipeStepAt = now;
    step(dx < 0 ? 1 : -1);
  }

  function endDrag(clientX) {
    if (!dragActive) return;
    var dx = (typeof clientX === "number" ? clientX : dragStartX) - dragStartX;
    dragActive = false;
    swipeArea.classList.remove("is-dragging");
    onSwipeEnd(dx);
  }

  if (useTouchSwipe) {
    swipeArea.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length !== 1) return;
        if (isSwipeBlocked(e.target)) return;
        dragActive = true;
        dragStartX = e.touches[0].clientX;
        swipeArea.classList.add("is-dragging");
      },
      { passive: true }
    );

    swipeArea.addEventListener(
      "touchend",
      function (e) {
        if (!dragActive) return;
        var touch = e.changedTouches[0];
        endDrag(touch ? touch.clientX : dragStartX);
      },
      { passive: true }
    );

    swipeArea.addEventListener(
      "touchcancel",
      function () {
        endDrag(null);
      },
      { passive: true }
    );
  } else {
    swipeArea.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (isSwipeBlocked(e.target)) return;
      dragActive = true;
      dragStartX = e.clientX;
      swipeArea.classList.add("is-dragging");
      try {
        if (swipeArea.setPointerCapture) {
          swipeArea.setPointerCapture(e.pointerId);
        }
      } catch (err) {}
    });

    swipeArea.addEventListener("pointerup", function (e) {
      if (!dragActive) return;
      try {
        if (swipeArea.hasPointerCapture && swipeArea.hasPointerCapture(e.pointerId)) {
          swipeArea.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}
      endDrag(e.clientX);
    });

    swipeArea.addEventListener("pointercancel", function () {
      endDrag(null);
    });
  }

  render();
})();

(function initAboutSwiper() {
  if (typeof Swiper === "undefined") return;

  var visual = document.querySelector("[data-about-swiper]");
  if (!visual) return;

  var section = visual.closest(".about-split");
  if (!section) return;

  var titleEl = section.querySelector(".about-split__title");
  var descLines = section.querySelectorAll(".about-split__desc-line");
  var pagerCurrent = section.querySelector(".about-split__pager-current");

  function padSlideNum(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function syncAboutSlide(swiper) {
    var slide = swiper.slides[swiper.activeIndex];
    if (!slide) return;

    var slideTitle = slide.getAttribute("data-title");
    var line1 = slide.getAttribute("data-desc-1");
    var line2 = slide.getAttribute("data-desc-2");

    if (titleEl && slideTitle) {
      titleEl.textContent = slideTitle;
    }
    if (descLines[0] && line1) {
      descLines[0].textContent = line1;
    }
    if (descLines[1] && line2) {
      descLines[1].textContent = line2;
    }
    if (pagerCurrent) {
      pagerCurrent.textContent = padSlideNum(swiper.activeIndex + 1);
    }
  }

  new Swiper(visual, {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 450,
    grabCursor: true,
    allowTouchMove: true,
    resistanceRatio: 0.85,
    watchOverflow: true,
    on: {
      init: function () {
        syncAboutSlide(this);
      },
      slideChange: function () {
        syncAboutSlide(this);
      },
    },
  });
})();

(function initCollectionSwipers() {
  if (typeof Swiper === "undefined") return;

  var swipers = document.querySelectorAll("[data-collection-swiper]");
  if (!swipers.length) return;

  function getCollectionLayout() {
    var root = getComputedStyle(document.documentElement);
    var visible = parseInt(root.getPropertyValue("--collection-visible"), 10);
    var gap = parseFloat(root.getPropertyValue("--door-card-gap"));

    return {
      visible: visible > 0 ? visible : 4,
      gap: Number.isFinite(gap) ? gap : 29,
    };
  }

  function applySlideWidths(swiper) {
    var layout = getCollectionLayout();
    var trackWidth = swiper.el.clientWidth;
    if (!trackWidth) return;

    var slideW = (trackWidth - (layout.visible - 1) * layout.gap) / layout.visible;
    swiper.params.spaceBetween = layout.gap;

    swiper.slides.forEach(function (slide) {
      slide.style.width = Math.max(0, slideW) + "px";
    });
    swiper.update();
  }

  swipers.forEach(function (el) {
    var block = el.closest(".collection-block");
    var paginationEl = block
      ? block.querySelector(".collection-block__strip-pagination")
      : null;

    var layout = getCollectionLayout();

    new Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: layout.gap,
      speed: 400,
      watchSlidesProgress: true,
      rewind: false,
      grabCursor: true,
      observer: true,
      observeParents: true,
      pagination: paginationEl
        ? {
            el: paginationEl,
            type: "progressbar",
          }
        : undefined,
      on: {
        init: function () {
          applySlideWidths(this);
          if (this.pagination) this.pagination.update();
        },
        resize: function () {
          applySlideWidths(this);
          if (this.pagination) this.pagination.update();
        },
        slideChange: function () {
          if (this.pagination) this.pagination.update();
        },
        progress: function () {
          if (this.pagination) this.pagination.update();
        },
      },
    });
  });
})();

(function initConsultModal() {
  var quickOrderTriggers = document.querySelectorAll("#callbackBtn, #maxContactBtn");
  if (!quickOrderTriggers.length) return;

  var modal = document.getElementById("consultModal");
  if (!modal) return;
  var backdrop = modal.querySelector(".consult-modal__backdrop");
  var closeBtn = modal.querySelector(".consult-modal__close");
  var form = modal.querySelector("#consultModalForm");
  var nameInput = form ? form.querySelector('input[name="name"]') : null;
  var phoneInput = form ? form.querySelector('input[name="phone"]') : null;
  var consentCheckbox = form
    ? form.querySelector('.consult-modal__checkbox input[type="checkbox"]')
    : null;
  var modalFormSubmitted = false;
  var bodyPaddingRightBeforeModal = "";

  function getScrollbarWidth() {
    return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  }

  function syncModalFieldState(inputEl) {
    if (!inputEl) return;
    var has = String(inputEl.value || "").trim() !== "";
    inputEl.classList.toggle("has-value", has);
  }

  function getPhoneDigits(value) {
    var v = (value || "").replace(/\D/g, "");
    if (v.indexOf("8") === 0 && v.length <= 11) {
      v = "7" + v.slice(1);
    }
    if (v.indexOf("7") === 0) {
      v = v.slice(1);
    }
    return v;
  }

  function isPhoneFull(value) {
    return getPhoneDigits(value).length === 10;
  }

  function formatPhoneInput(inputEl) {
    if (!inputEl) return;
    var v = (inputEl.value || "").replace(/\D/g, "");
    if (v.indexOf("8") === 0 && v.length <= 11) {
      v = "7" + v.slice(1);
    }
    if (v.indexOf("7") === 0) {
      v = v.slice(1);
    }
    if (v.length > 10) {
      v = v.slice(0, 10);
    }

    var formatted = "+7";
    if (v.length > 0) formatted += " (" + v.slice(0, 3);
    if (v.length >= 3) formatted += ") " + v.slice(3, 6);
    if (v.length >= 6) formatted += " " + v.slice(6, 8);
    if (v.length >= 8) formatted += " " + v.slice(8, 10);
    inputEl.value = formatted;
  }

  function openModal(e) {
    if (e) e.preventDefault();
    modalFormSubmitted = false;
    if (nameInput) nameInput.classList.remove("input--error");
    if (phoneInput) phoneInput.classList.remove("input--error");
    if (consentCheckbox) consentCheckbox.classList.remove("input--error");
    syncModalFieldState(nameInput);
    syncModalFieldState(phoneInput);
    bodyPaddingRightBeforeModal = document.body.style.paddingRight;
    var scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + "px";
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("consult-modal-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("consult-modal-open");
    document.body.style.paddingRight = bodyPaddingRightBeforeModal;
    modalFormSubmitted = false;
    if (form) form.reset();
    if (nameInput) nameInput.classList.remove("input--error");
    if (phoneInput) phoneInput.classList.remove("input--error");
    if (consentCheckbox) consentCheckbox.classList.remove("input--error");
  }

  quickOrderTriggers.forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });

  if (backdrop) backdrop.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      modalFormSubmitted = true;
      var nameEmpty = !nameInput || !nameInput.value || !nameInput.value.trim();
      var phoneEmpty = !phoneInput || !isPhoneFull(phoneInput.value);
      var consentEmpty = !consentCheckbox || !consentCheckbox.checked;

      if (nameInput) {
        nameInput.classList.toggle("input--error", !!nameEmpty);
      }
      if (phoneInput) {
        phoneInput.classList.toggle("input--error", !!phoneEmpty);
      }
      if (consentCheckbox) {
        consentCheckbox.classList.toggle("input--error", !!consentEmpty);
      }

      if (nameEmpty || phoneEmpty || consentEmpty) {
        return;
      }

      closeModal();
    });

    if (nameInput) {
      nameInput.addEventListener("input", function () {
        syncModalFieldState(nameInput);
        var hasError = !nameInput.value || !nameInput.value.trim();
        nameInput.classList.toggle("input--error", !!hasError);
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("focus", function () {
        if (!phoneInput.value || !phoneInput.value.trim()) {
          phoneInput.value = "+7 ";
        }
      });
      phoneInput.addEventListener("input", function () {
        formatPhoneInput(phoneInput);
        syncModalFieldState(phoneInput);
        if (modalFormSubmitted) {
          phoneInput.classList.toggle("input--error", !isPhoneFull(phoneInput.value));
        } else {
          phoneInput.classList.remove("input--error");
        }
      });
      phoneInput.addEventListener("blur", function () {
        var digits = getPhoneDigits(phoneInput.value);
        if (!digits.length) {
          phoneInput.value = "";
          syncModalFieldState(phoneInput);
          if (!modalFormSubmitted) {
            phoneInput.classList.remove("input--error");
          }
        }
      });
      phoneInput.setAttribute("maxlength", "18");
    }

    if (consentCheckbox) {
      consentCheckbox.addEventListener("change", function () {
        consentCheckbox.classList.toggle("input--error", !consentCheckbox.checked);
      });
    }
  }
})();

(function initCatalogMega() {
  var root = document.getElementById("catalogMega");
  var openBtn = document.getElementById("catalogMegaOpen");
  if (!root || !openBtn) return;

  var mq = window.matchMedia("(min-width: 901px)");
  var panels = root.querySelectorAll(".catalog-mega__sub-panel");
  var primary = root.querySelector(".catalog-mega__primary");

  function clearPrimaryActive() {
    if (!primary) return;
    primary.querySelectorAll("li.is-active").forEach(function (li) {
      li.classList.remove("is-active");
    });
    primary.querySelectorAll("a[data-mega-subpanel]").forEach(function (a) {
      a.setAttribute("aria-expanded", "false");
    });
  }

  function isOpen() {
    return !root.hasAttribute("hidden");
  }

  function getDefaultPanelId() {
    var first = primary && primary.querySelector("a[data-mega-subpanel]");
    return first ? first.getAttribute("data-mega-subpanel") : null;
  }

  function showSubPanel(panelId) {
    if (!panelId) return;
    var target = document.getElementById(panelId);
    panels.forEach(function (panel) {
      if (panel.id === panelId) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
    if (!target) return;
    if (target.classList.contains("catalog-mega__sub-panel--empty")) {
      root.setAttribute("data-mega-hide-main", "true");
    } else {
      root.removeAttribute("data-mega-hide-main");
    }
  }

  function setOpen(open) {
    if (open) {
      root.removeAttribute("hidden");
      root.setAttribute("aria-hidden", "false");
      openBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("catalog-mega-open");
      document.documentElement.classList.add("catalog-mega-open");
      clearPrimaryActive();
      var def = getDefaultPanelId();
      if (def) {
        var firstA = primary && primary.querySelector('a[data-mega-subpanel="' + def + '"]');
        if (firstA) {
          firstA.closest("li") && firstA.closest("li").classList.add("is-active");
          firstA.setAttribute("aria-expanded", "true");
        }
        showSubPanel(def);
      }
    } else {
      root.setAttribute("hidden", "");
      root.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("catalog-mega-open");
      document.documentElement.classList.remove("catalog-mega-open");
      root.removeAttribute("data-mega-hide-main");
      clearPrimaryActive();
      panels.forEach(function (panel) {
        panel.setAttribute("hidden", "");
      });
    }
  }

  function toggle() {
    setOpen(!isOpen());
  }

  openBtn.addEventListener("click", function (e) {
    if (mq.matches) {
      e.preventDefault();
      toggle();
    }
  });

  var backdrop = root.querySelector(".catalog-mega__backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", function () {
      if (mq.matches) {
        setOpen(false);
      }
    });
    backdrop.addEventListener(
      "wheel",
      function (e) {
        if (!mq.matches) return;
        if (e.cancelable) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }

  var headerLogo = document.querySelector(".site-header .brand .logo");
  if (headerLogo) {
    headerLogo.addEventListener("click", function (e) {
      if (mq.matches && isOpen()) {
        e.preventDefault();
        setOpen(false);
      }
    });
  }

  var catalogLabel = document.querySelector(".brand .nav__catalog-text");
  if (catalogLabel) {
    catalogLabel.addEventListener("click", function () {
      if (mq.matches) {
        setOpen(false);
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
    }
  });

  function onMqChange() {
    if (!mq.matches) {
      setOpen(false);
    }
  }

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onMqChange);
  } else if (typeof mq.addListener === "function") {
    mq.addListener(onMqChange);
  }

  document.querySelectorAll(".site-header__nav .nav__link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (mq.matches) {
        setOpen(false);
      }
    });
  });

  function setPrimaryActive(li) {
    clearPrimaryActive();
    if (li) {
      li.classList.add("is-active");
      var a = li.querySelector("a[data-mega-subpanel]");
      if (a) a.setAttribute("aria-expanded", "true");
    }
  }

  function activatePrimaryLink(a) {
    if (!a) return;
    var panelId = a.getAttribute("data-mega-subpanel");
    if (!panelId) return;
    setPrimaryActive(a.closest("li"));
    showSubPanel(panelId);
  }

  if (primary) {
    primary.querySelectorAll("a[data-mega-subpanel]").forEach(function (a) {
      var li = a.closest("li");
      if (!li) return;

      a.addEventListener("click", function (e) {
        if (!mq.matches || !isOpen()) return;
        var href = (a.getAttribute("href") || "").trim();
        var isAlreadyActive = li.classList.contains("is-active");

        if (isAlreadyActive && href && href !== "#") {
          setOpen(false);
          return;
        }

        e.preventDefault();
        activatePrimaryLink(a);
      });
    });
  }

  root.querySelectorAll(".catalog-mega__sub a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (mq.matches) {
        setOpen(false);
      }
    });
  });
})();

(function initDoorCatalogMore() {
  var grid = document.getElementById("doorCatalogGrid");
  var btn = document.getElementById("doorCatalogMoreBtn");
  if (!grid || !btn) return;
  var more = btn.closest(".section-cats__more");
  if (!more) return;

  var cards = Array.prototype.slice.call(
    grid.querySelectorAll(".door-catalog-grid__item")
  );
  var limit = 12;
  var expanded = false;

  function sync() {
    if (cards.length <= limit) {
      more.hidden = true;
      cards.forEach(function (card) {
        card.hidden = false;
        card.style.display = "";
      });
      expanded = false;
      btn.textContent = "Показать ещё";
      btn.setAttribute("aria-expanded", "false");
      return;
    }

    more.hidden = false;
    cards.forEach(function (card, i) {
      var isHidden = expanded ? false : i >= limit;
      card.hidden = isHidden;
      card.style.display = isHidden ? "none" : "";
    });
    btn.textContent = expanded ? "Свернуть" : "Показать ещё";
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  btn.addEventListener("click", function () {
    expanded = !expanded;
    sync();
  });

  sync();
})();

(function initDoorProductConfig() {
  var root = document.querySelector("[data-door-product-config]");
  if (!root) return;

  var heroImg = document.querySelector(".door-product-detail__hero-img");

  function setHeroFromVariant(btn) {
    if (!heroImg || !btn) return;
    var thumb = btn.querySelector(".door-product-variant__img img");
    if (!thumb || !thumb.getAttribute("src")) return;
    heroImg.src = thumb.src;
    var alt = thumb.getAttribute("alt");
    if (alt) heroImg.alt = alt;
  }

  var initialActive = root.querySelector(".door-product-variant.is-active");
  if (initialActive) setHeroFromVariant(initialActive);

  var tabs = root.querySelectorAll(".door-product-config__tab");
  var panels = root.querySelectorAll(".door-product-config__panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var id = tab.getAttribute("data-tab");
      if (!id) return;

      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });

      panels.forEach(function (panel) {
        var show = panel.id === "tab-" + id;
        panel.classList.toggle("is-active", show);
        panel.hidden = !show;
      });
    });
  });

  root.querySelectorAll(".door-product-variant").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var block = btn.closest(".door-product-variants__block");
      if (!block) return;
      block.querySelectorAll(".door-product-variant").forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      setHeroFromVariant(btn);
    });
  });
})();

(function initProductQty() {
  function setPressed(btn, on) {
    btn.classList.toggle("is-pressed", on);
  }

  document.querySelectorAll(".door-product-detail .qty").forEach(function (qty) {
    var span = qty.querySelector(":scope > span");
    var buttons = qty.querySelectorAll("button");
    if (!span || buttons.length < 2) return;
    var minus = buttons[0];
    var plus = buttons[1];

    minus.addEventListener("click", function () {
      var n = parseInt(span.textContent, 10);
      if (isNaN(n) || n < 1) n = 1;
      if (n > 1) span.textContent = String(n - 1);
    });

    plus.addEventListener("click", function () {
      var n = parseInt(span.textContent, 10);
      if (isNaN(n) || n < 1) n = 1;
      if (n < 9999) span.textContent = String(n + 1);
    });

    [minus, plus].forEach(function (btn) {
      btn.addEventListener("mousedown", function () {
        setPressed(btn, true);
      });
      btn.addEventListener("mouseup", function () {
        setPressed(btn, false);
      });
      btn.addEventListener("mouseleave", function () {
        setPressed(btn, false);
      });
      btn.addEventListener(
        "touchstart",
        function () {
          setPressed(btn, true);
        },
        { passive: true }
      );
      btn.addEventListener("touchend", function () {
        setPressed(btn, false);
      });
      btn.addEventListener("touchcancel", function () {
        setPressed(btn, false);
      });
    });
  });
})();
