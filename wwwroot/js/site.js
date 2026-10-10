const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const brandMark = (logoUrl, brandName) => logoUrl
  ? `<img class="brand-logo-image" src="${escapeHtml(logoUrl)}" alt="">`
  : `${escapeHtml(brandName.trim().charAt(0).toUpperCase() || "M")}<span>.</span>`;

const tickerItemsMarkup = (runningTexts) => runningTexts
  .map((text) => `<span class="ticker-item"><span>${escapeHtml(text)}</span><i aria-hidden="true">✳</i></span>`)
  .join("");

const enableBrandLogoFallback = (root) => {
  root.querySelectorAll(".brand-logo-image").forEach((image) => {
    image.addEventListener("error", () => {
      const fallback = document.createElement("span");
      fallback.className = "brand-symbol";
      fallback.setAttribute("aria-hidden", "true");
      const initial = image.closest(".brand")?.querySelector(".brand-name")?.textContent?.trim().charAt(0).toUpperCase() || "M";
      fallback.textContent = initial;
      const dot = document.createElement("span");
      dot.textContent = ".";
      fallback.append(dot);
      image.closest(".brand-symbol").replaceWith(fallback);
    }, { once: true });
  });
};

const renderSite = (site) => {
  const app = document.querySelector("#app");
  const texts = site.texts;
  const runningTexts = [
    texts.runningText1,
    texts.runningText2,
    texts.runningText3,
    texts.runningText4,
  ].filter((text) => String(text ?? "").trim());
  const banners = site.banners ?? [];
  const categories = [...new Set(site.products.map((product) => product.category))];
  const shopUrl = escapeHtml(site.shopUrl);
  const instagramUrl = escapeHtml(site.instagramUrl);

  document.title = `${site.brandName} — ${site.headline}`;
  document.querySelector('meta[name="description"]').content = site.description;

  app.innerHTML = `
    <div class="announcement"><span class="announcement-dot"></span> ${escapeHtml(site.eyebrow)} <span class="announcement-separator">/</span> <a href="${shopUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.announcementShopLabel)} <span aria-hidden="true">↗</span></a></div>
    <header class="site-header">
      <div class="nav-wrap">
        <a class="brand" href="#beranda" aria-label="${escapeHtml(site.brandName)} — ${escapeHtml(texts.brandHomeAriaLabel)}">
          <span class="brand-symbol${site.logoUrl ? " brand-symbol--logo" : ""}" aria-hidden="true">${brandMark(site.logoUrl, site.brandName)}</span>
          <span class="brand-name">${escapeHtml(site.brandName)}</span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="${escapeHtml(texts.menuOpenLabel)}"><span></span><span></span></button>
        <nav class="nav-links" id="main-nav" aria-label="${escapeHtml(texts.primaryNavigationAriaLabel)}">
          <a href="#koleksi">${escapeHtml(texts.navCatalogLabel)}</a>
          <a href="#cerita">${escapeHtml(texts.navStoryLabel)}</a>
          <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.navInstagramLabel)} <span aria-hidden="true">↗</span></a>
          <a class="nav-cta" href="${shopUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.navShopLabel)} <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero" id="beranda">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow"><span class="eyebrow-mark"></span> ${escapeHtml(site.eyebrow)}</p>
            <h1>${escapeHtml(site.headline)}</h1>
            <p class="hero-description">${escapeHtml(site.description)}</p>
            <div class="hero-actions">
              <a class="button button-lime" href="#koleksi">${escapeHtml(texts.heroPrimaryActionLabel)} <span class="button-arrow" aria-hidden="true">↗</span></a>
              <a class="text-link" href="#cerita">${escapeHtml(texts.heroSecondaryActionLabel)} <span aria-hidden="true">↓</span></a>
            </div>
            <div class="hero-footnote"><span class="hero-index">${escapeHtml(texts.heroFootnoteIndex)}</span><span class="hero-footnote-line"></span><span>${escapeHtml(texts.heroFootnoteLabel)}</span></div>
          </div>
          <div class="hero-visual">
            <div class="hero-image-wrap">
              <img class="hero-image" src="${escapeHtml(site.heroImageUrl)}" alt="${escapeHtml(texts.heroImageAltText)}" fetchpriority="high">
              <div class="image-shade"></div>
              <div class="hero-vertical-label">${escapeHtml(texts.heroVerticalLabel)}</div>
              <div class="hero-stamp"><span>${escapeHtml(texts.heroStampTop)}</span><b>${escapeHtml(texts.heroStampBottom)}</b><i>${escapeHtml(texts.heroStampDate)}</i></div>
            </div>
            <div class="hero-side-note"><span class="side-note-line"></span><span>${escapeHtml(texts.heroSideNote).replace(/\s*\/\s*/g, "<br>")}</span></div>
          </div>
          <div class="hero-coordinate" aria-hidden="true">${escapeHtml(texts.heroCoordinate)}</div>
        </div>
        <a class="scroll-cue" href="#koleksi"><span class="scroll-line"></span> ${escapeHtml(texts.scrollCueLabel)}</a>
      </section>

      <div class="ticker" aria-label="${escapeHtml(runningTexts.join(" · "))}">
        <div class="ticker-track">
          <div class="ticker-sequence" aria-hidden="true">${tickerItemsMarkup(runningTexts)}</div>
          <div class="ticker-sequence" aria-hidden="true">${tickerItemsMarkup(runningTexts)}</div>
        </div>
      </div>

      ${banners.length ? `
        <section class="banner-carousel section-wrap" aria-roledescription="carousel" aria-label="Banner promosi">
          <div class="banner-stage">
            ${banners.map((banner, index) => `
              <div class="banner-slide${index ? "" : " is-active"}" data-banner-slide="${index}" role="group" aria-roledescription="slide" aria-label="${index + 1} dari ${banners.length}" aria-hidden="${index !== 0}" ${index ? "inert hidden" : ""}>
                ${banner.linkUrl
                  ? `<a class="banner-slide-link" href="${escapeHtml(banner.linkUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(banner.altText)}">`
                  : '<div class="banner-slide-link">'}
                  <img src="${escapeHtml(banner.imageUrl)}" alt="${escapeHtml(banner.altText)}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'}>
                ${banner.linkUrl ? "</a>" : "</div>"}
              </div>
            `).join("")}
            ${banners.length > 1 ? `
              <div class="banner-controls">
                <button class="banner-arrow banner-previous" type="button" aria-label="Banner sebelumnya">←</button>
                <div class="banner-pagination" role="group" aria-label="Pilih banner">
                  ${banners.map((_, index) => `<button class="banner-dot${index === 0 ? " is-active" : ""}" type="button" data-banner-target="${index}" aria-label="Tampilkan banner ${index + 1}" aria-pressed="${index === 0}"></button>`).join("")}
                </div>
                <button class="banner-arrow banner-next" type="button" aria-label="Banner berikutnya">→</button>
              </div>
            ` : ""}
          </div>
        </section>
      ` : ""}

      <section class="catalog section-wrap" id="koleksi">
        <div class="section-heading">
          <div>
            <p class="section-kicker">${escapeHtml(texts.catalogKicker)}</p>
            <h2>${escapeHtml(texts.catalogTitleLine1)}<br><span>${escapeHtml(texts.catalogTitleLine2)}</span></h2>
          </div>
          <p class="section-intro">${escapeHtml(texts.catalogDescription)}</p>
        </div>
        <div class="catalog-toolbar">
          <div class="filter-list" role="group" aria-label="${escapeHtml(texts.catalogFilterAriaLabel)}">
            <button class="filter-button is-active" type="button" data-category="all" aria-pressed="true">${escapeHtml(texts.catalogAllFilterLabel)} <span>${site.products.length}</span></button>
            ${categories.map((category) => `<button class="filter-button" type="button" data-category="${escapeHtml(category)}" aria-pressed="false">${escapeHtml(category)} <span>${site.products.filter((product) => product.category === category).length}</span></button>`).join("")}
          </div>
          <span class="catalog-count">${String(site.products.length).padStart(2, "0")} ${escapeHtml(texts.catalogCountLabel)}</span>
        </div>
        <div class="product-grid" id="product-grid">
          ${site.products.map((product, index) => `
            <article class="product-card" data-product-category="${escapeHtml(product.category)}">
              <a class="product-image" href="${escapeHtml(product.productUrl || site.shopUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(texts.productViewLabel)}: ${escapeHtml(product.name)}">
                <img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
                <span class="product-number">0${index + 1}</span>
                ${!product.isAvailable ? `<span class="sold-overlay">${escapeHtml(texts.productUnavailableLabel)}</span>` : ""}
                <span class="product-quick-view" aria-hidden="true">${escapeHtml(texts.productViewLabel)} ↗</span>
              </a>
              <div class="product-meta">
                <div><p class="product-category">${escapeHtml(product.category)}</p><h3>${escapeHtml(product.name)}</h3></div>
                <span class="product-price">${rupiah.format(product.price)}</span>
              </div>
              <p class="product-description">${escapeHtml(product.description)}</p>
              <a class="product-buy" href="${escapeHtml(product.productUrl || site.shopUrl)}" target="_blank" rel="noopener noreferrer" ${!product.isAvailable ? 'aria-disabled="true"' : ""}>${escapeHtml(product.isAvailable ? texts.productBuyLabel : texts.productUnavailableLabel)} <span aria-hidden="true">↗</span></a>
            </article>
          `).join("")}
        </div>
        <div class="catalog-bottom"><span>${escapeHtml(texts.catalogFooterNote)}</span><a href="${shopUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.catalogShopLinkLabel)} <span aria-hidden="true">↗</span></a></div>
      </section>

      <section class="manifesto" id="cerita">
        <div class="manifesto-image">
          <img src="${escapeHtml(site.heroImageUrl)}" alt="${escapeHtml(texts.storyImageAltText)}" loading="lazy">
          <span class="manifesto-image-caption">${escapeHtml(texts.storyImageCaption)}</span>
        </div>
        <div class="manifesto-copy">
          <p class="section-kicker">${escapeHtml(texts.storyKicker)}</p>
          <h2>${escapeHtml(site.storyHeadline)}</h2>
          <p class="manifesto-description">${escapeHtml(site.storyDescription)}</p>
          <div class="feature-list">
            <div><span>01</span><p><b>${escapeHtml(texts.storyFeature1Title)}</b><br>${escapeHtml(texts.storyFeature1Description)}</p></div>
            <div><span>02</span><p><b>${escapeHtml(texts.storyFeature2Title)}</b><br>${escapeHtml(texts.storyFeature2Description)}</p></div>
            <div><span>03</span><p><b>${escapeHtml(texts.storyFeature3Title)}</b><br>${escapeHtml(texts.storyFeature3Description)}</p></div>
          </div>
          <a class="text-link manifesto-link" href="${instagramUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.storyActionLabel)} <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section class="closing-cta">
        <div class="closing-inner">
          <p class="section-kicker">${escapeHtml(texts.closingKicker)}</p>
          <h2>${escapeHtml(texts.closingTitleLine1)}<br><span>${escapeHtml(texts.closingTitleLine2)}</span></h2>
          <a class="button button-lime" href="${shopUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.closingActionLabel)} <span class="button-arrow" aria-hidden="true">↗</span></a>
          <span class="closing-graphic" aria-hidden="true">${site.logoUrl
            ? `<img src="${escapeHtml(site.logoUrl)}" alt="">`
            : `${escapeHtml(site.brandName.trim().charAt(0).toUpperCase() || "M")}.`}</span>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-main">
        <a class="brand footer-brand" href="#beranda"><span class="brand-symbol${site.logoUrl ? " brand-symbol--logo" : ""}" aria-hidden="true">${brandMark(site.logoUrl, site.brandName)}</span><span class="brand-name">${escapeHtml(site.brandName)}</span></a>
        <p>${escapeHtml(texts.footerTaglineLine1)}<br>${escapeHtml(texts.footerTaglineLine2)}</p>
        <div class="footer-links"><a href="#koleksi">${escapeHtml(texts.footerCatalogLabel)}</a><a href="${instagramUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.footerInstagramLabel)} ↗</a><a href="${shopUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.footerShopLabel)} ↗</a></div>
      </div>
      <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${escapeHtml(site.brandName)}. ${escapeHtml(texts.footerCopyrightLabel)}</span><a href="/admin.html">${escapeHtml(texts.footerAdminLabel)}</a><a href="#beranda">${escapeHtml(texts.footerTopLabel)} ↑</a></div>
    </footer>
  `;

  enableBrandLogoFallback(app);
  const menuToggle = app.querySelector(".menu-toggle");
  const nav = app.querySelector(".nav-links");
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });

  const tickerTrack = app.querySelector(".ticker-track");
  if (tickerTrack && runningTexts.length) {
    const firstSequence = tickerTrack.querySelector(".ticker-sequence");
    const fillSequence = () => {
      firstSequence.innerHTML = tickerItemsMarkup(runningTexts);
      while (firstSequence.getBoundingClientRect().width < window.innerWidth + 1) {
        firstSequence.insertAdjacentHTML("beforeend", tickerItemsMarkup(runningTexts));
      }
      tickerTrack.querySelectorAll(".ticker-sequence")[1].innerHTML = firstSequence.innerHTML;
      tickerTrack.style.setProperty(
        "--ticker-duration",
        `${Math.max(18, firstSequence.getBoundingClientRect().width / 55)}s`,
      );
    };
    fillSequence();
    let resizeFrame = 0;
    window.addEventListener("resize", () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        fillSequence();
      });
    }, { passive: true });
  }

  const bannerSlides = [...app.querySelectorAll(".banner-slide")];
  if (bannerSlides.length > 1) {
    const bannerCarousel = app.querySelector(".banner-carousel");
    const bannerDots = [...bannerCarousel.querySelectorAll(".banner-dot")];
    const pauseReasons = new Set();
    let currentBanner = 0;
    let autoplayTimer = 0;
    const showBanner = (index, direction = 1) => {
      const nextBanner = (index + bannerSlides.length) % bannerSlides.length;
      if (nextBanner === currentBanner) return;
      bannerSlides.forEach((slide, slideIndex) => {
        window.clearTimeout(slide._transitionTimer);
        const isCurrent = slideIndex === currentBanner;
        slide.classList.remove("is-exiting", "slide-from-next", "slide-from-previous");
        slide.hidden = !isCurrent;
        slide.inert = !isCurrent;
        slide.setAttribute("aria-hidden", String(!isCurrent));
        slide.classList.toggle("is-active", isCurrent);
      });
      const outgoingSlide = bannerSlides[currentBanner];
      const incomingSlide = bannerSlides[nextBanner];
      const wasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finishTransition = () => {
        outgoingSlide.classList.remove("is-active", "is-exiting", "slide-from-next", "slide-from-previous");
        outgoingSlide.setAttribute("aria-hidden", "true");
        outgoingSlide.inert = true;
        outgoingSlide.hidden = true;
        incomingSlide.classList.remove("slide-from-next", "slide-from-previous");
      };

      if (wasReducedMotion) {
        finishTransition();
        currentBanner = nextBanner;
        incomingSlide.hidden = false;
        incomingSlide.inert = false;
        incomingSlide.setAttribute("aria-hidden", "false");
        incomingSlide.classList.add("is-active");
      } else {
        outgoingSlide.classList.remove("slide-from-next", "slide-from-previous");
        outgoingSlide.classList.add("is-exiting");
        outgoingSlide.inert = true;
        outgoingSlide.setAttribute("aria-hidden", "true");
        incomingSlide.hidden = false;
        incomingSlide.inert = false;
        incomingSlide.setAttribute("aria-hidden", "false");
        incomingSlide.classList.remove("is-exiting", "is-active");
        incomingSlide.classList.add(direction > 0 ? "slide-from-next" : "slide-from-previous");
        void incomingSlide.offsetWidth;
        requestAnimationFrame(() => {
          outgoingSlide.classList.remove("is-active");
          incomingSlide.classList.remove("slide-from-next", "slide-from-previous");
          incomingSlide.classList.add("is-active");
        });
        outgoingSlide._transitionTimer = window.setTimeout(finishTransition, 760);
      }

      currentBanner = nextBanner;
      bannerSlides.forEach((slide, slideIndex) => {
        bannerDots[slideIndex].classList.toggle("is-active", slideIndex === currentBanner);
        bannerDots[slideIndex].setAttribute("aria-pressed", String(slideIndex === currentBanner));
      });
    };
    const updateAutoplay = () => {
      window.clearInterval(autoplayTimer);
      if (!pauseReasons.size && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        autoplayTimer = window.setInterval(() => showBanner(currentBanner + 1, 1), 5000);
      }
    };
    const setPaused = (reason, paused) => {
      if (paused) pauseReasons.add(reason);
      else pauseReasons.delete(reason);
      updateAutoplay();
    };

    bannerCarousel.querySelector(".banner-previous").addEventListener("click", () => showBanner(currentBanner - 1, -1));
    bannerCarousel.querySelector(".banner-next").addEventListener("click", () => showBanner(currentBanner + 1, 1));
    bannerDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const nextBanner = Number(dot.dataset.bannerTarget);
        const forwardDistance = (nextBanner - currentBanner + bannerSlides.length) % bannerSlides.length;
        showBanner(nextBanner, forwardDistance <= bannerSlides.length / 2 ? 1 : -1);
      });
    });
    bannerCarousel.addEventListener("mouseenter", () => setPaused("pointer", true));
    bannerCarousel.addEventListener("mouseleave", () => setPaused("pointer", false));
    bannerCarousel.addEventListener("focusin", () => setPaused("focus", true));
    bannerCarousel.addEventListener("focusout", (event) => {
      if (!bannerCarousel.contains(event.relatedTarget)) setPaused("focus", false);
    });
    document.addEventListener("visibilitychange", () => setPaused("hidden", document.hidden));
    updateAutoplay();
  }

  app.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      app.querySelector(".filter-button.is-active")?.classList.remove("is-active");
      app.querySelector('.filter-button[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      const category = button.dataset.category;
      app.querySelectorAll(".product-card").forEach((card) => {
        card.hidden = category !== "all" && card.dataset.productCategory !== category;
      });
    });
  });
};

const loadSite = async () => {
  const app = document.querySelector("#app");
  try {
    const response = await fetch("/api/content");
    if (!response.ok) {
      throw new Error(`Permintaan konten gagal (${response.status}).`);
    }
    renderSite(await response.json());
  } catch (error) {
    console.error("Gagal memuat konten Main Active.", error);
    app.innerHTML = '<p class="load-error" role="alert">Konten belum dapat dimuat. Coba muat ulang halaman.</p>';
  }
};

loadSite();
