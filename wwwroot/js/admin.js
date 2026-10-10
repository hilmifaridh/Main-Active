const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

const app = document.querySelector("#admin-app");
let brandSettings = { brandName: "MAIN ACTIVE", logoUrl: "" };

const copyGroups = [
  {
    title: "Navigasi & hero",
    fields: [
      ["announcementShopLabel", "Label tautan toko di announcement"],
      ["brandHomeAriaLabel", "Teks aksesibilitas logo brand"],
      ["primaryNavigationAriaLabel", "Teks aksesibilitas navigasi"],
      ["navCatalogLabel", "Label navigasi katalog"],
      ["navStoryLabel", "Label navigasi cerita"],
      ["navInstagramLabel", "Label navigasi Instagram"],
      ["navShopLabel", "Label tombol navigasi toko"],
      ["menuOpenLabel", "Label aksesibilitas tombol menu"],
      ["heroPrimaryActionLabel", "Tombol utama hero"],
      ["heroSecondaryActionLabel", "Tombol kedua hero"],
      ["heroImageAltText", "Teks alternatif gambar hero"],
      ["heroVerticalLabel", "Teks vertikal gambar hero"],
      ["heroStampTop", "Teks atas badge hero"],
      ["heroStampBottom", "Teks utama badge hero"],
      ["heroStampDate", "Teks bawah badge hero"],
      ["heroSideNote", "Catatan samping hero (pisahkan baris dengan /)", true],
      ["heroCoordinate", "Teks koordinat hero"],
      ["scrollCueLabel", "Petunjuk scroll"],
      ["heroFootnoteLabel", "Teks catatan bawah hero"],
      ["heroFootnoteIndex", "Indeks catatan bawah hero"],
    ],
  },
  {
    title: "Running text",
    fields: [
      ["runningText1", "Teks berjalan 1"],
      ["runningText2", "Teks berjalan 2"],
      ["runningText3", "Teks berjalan 3"],
      ["runningText4", "Teks berjalan 4"],
    ],
  },
  {
    title: "Katalog",
    fields: [
      ["catalogKicker", "Label bagian katalog"],
      ["catalogTitleLine1", "Judul katalog — baris 1"],
      ["catalogTitleLine2", "Judul katalog — baris 2"],
      ["catalogDescription", "Deskripsi katalog", true],
      ["catalogAllFilterLabel", "Label filter semua produk"],
      ["catalogFilterAriaLabel", "Teks aksesibilitas filter katalog"],
      ["catalogCountLabel", "Label jumlah produk"],
      ["productViewLabel", "Label lihat produk"],
      ["productBuyLabel", "Label tombol beli"],
      ["productUnavailableLabel", "Label produk belum tersedia"],
      ["catalogFooterNote", "Catatan bawah katalog"],
      ["catalogShopLinkLabel", "Tautan toko di bawah katalog"],
    ],
  },
  {
    title: "Cerita brand",
    fields: [
      ["storyImageAltText", "Teks alternatif gambar cerita"],
      ["storyImageCaption", "Caption gambar cerita"],
      ["storyKicker", "Label bagian cerita"],
      ["storyFeature1Title", "Keunggulan 1 — judul"],
      ["storyFeature1Description", "Keunggulan 1 — deskripsi", true],
      ["storyFeature2Title", "Keunggulan 2 — judul"],
      ["storyFeature2Description", "Keunggulan 2 — deskripsi", true],
      ["storyFeature3Title", "Keunggulan 3 — judul"],
      ["storyFeature3Description", "Keunggulan 3 — deskripsi", true],
      ["storyActionLabel", "Tombol cerita brand"],
    ],
  },
  {
    title: "Ajakan & footer",
    fields: [
      ["closingKicker", "Label ajakan penutup"],
      ["closingTitleLine1", "Judul penutup — baris 1"],
      ["closingTitleLine2", "Judul penutup — baris 2"],
      ["closingActionLabel", "Tombol ajakan penutup"],
      ["footerTaglineLine1", "Tagline footer — baris 1"],
      ["footerTaglineLine2", "Tagline footer — baris 2"],
      ["footerCatalogLabel", "Tautan katalog footer"],
      ["footerInstagramLabel", "Tautan Instagram footer"],
      ["footerShopLabel", "Tautan toko footer"],
      ["footerCopyrightLabel", "Teks hak cipta footer"],
      ["footerAdminLabel", "Tautan admin footer"],
      ["footerTopLabel", "Tautan kembali ke atas"],
    ],
  },
];

const renderCopyGroups = (texts) => copyGroups.map((group) => `
  <div class="cms-copy-group">
    <h3>${escapeHtml(group.title)}</h3>
    <div class="cms-fields">
      ${group.fields.map(([key, label, multiline]) => `
        <label class="${multiline ? "field-full" : ""}">${escapeHtml(label)}
          ${multiline
            ? `<textarea data-copy-field="${key}" required maxlength="500" rows="2">${escapeHtml(texts[key])}</textarea>`
            : `<input data-copy-field="${key}" required maxlength="300" value="${escapeHtml(texts[key])}">`}
        </label>
      `).join("")}
    </div>
  </div>
`).join("");

const getErrorMessage = async (response) => {
  try {
    const problem = await response.json();
    return problem.detail || problem.title || `Permintaan gagal (${response.status}).`;
  } catch {
    return `Permintaan gagal (${response.status}).`;
  }
};

const brandMark = (logoUrl, brandName) => logoUrl
  ? `<img class="brand-logo-image" src="${escapeHtml(logoUrl)}" alt="">`
  : `${escapeHtml(brandName.trim().charAt(0).toUpperCase() || "M")}<span>.</span>`;

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

const updateBrandSettings = (content) => {
  brandSettings = {
    brandName: content.brandName,
    logoUrl: content.logoUrl || "",
  };
};

const showLogin = (message = "") => {
  app.innerHTML = `
    <div class="admin-login-shell">
      <a class="admin-back" href="/">← KEMBALI KE WEBSITE</a>
      <section class="admin-login-card">
        <a class="brand admin-brand" href="/"><span class="brand-symbol${brandSettings.logoUrl ? " brand-symbol--logo" : ""}" aria-hidden="true">${brandMark(brandSettings.logoUrl, brandSettings.brandName)}</span><span class="brand-name">${escapeHtml(brandSettings.brandName)}</span></a>
        <p class="admin-eyebrow">CONTENT MANAGEMENT SYSTEM</p>
        <h1>Welcome<br><span>back.</span></h1>
        <p class="admin-login-copy">Masuk untuk mengelola katalog dan konten website Main Active.</p>
        <form id="login-form">
          <label>Username<input name="username" autocomplete="username" required maxlength="100" value="admin"></label>
          <label>Password<input name="password" type="password" autocomplete="current-password" required maxlength="256" autofocus></label>
          ${message ? `<p class="form-message is-error" role="alert">${escapeHtml(message)}</p>` : ""}
          <button class="button button-lime admin-submit" type="submit">MASUK KE CMS <span aria-hidden="true">↗</span></button>
        </form>
        <p class="admin-security-note">Akses admin dilindungi sesi terenkripsi dan kredensial server.</p>
      </section>
      <span class="admin-login-mark" aria-hidden="true">${escapeHtml(brandSettings.brandName)}</span>
    </div>
  `;

  enableBrandLogoFallback(app);
  app.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    const message = form.querySelector(".form-message");
    button.disabled = true;
    button.textContent = "MEMERIKSA AKSES...";
    message?.remove();
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.elements.username.value,
          password: form.elements.password.value,
        }),
      });
      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }
      await loadDashboard();
    } catch (error) {
      showLogin(error.message);
    }
  });
};

const productFields = (product, shopUrl, index) => `
  <article class="cms-product" data-product-id="${escapeHtml(product.id)}">
    <div class="cms-product-heading">
      <span class="cms-product-index">PRODUCT <b>${String(index + 1).padStart(2, "0")}</b></span>
      <button class="remove-product" type="button" aria-label="Hapus ${escapeHtml(product.name)}">HAPUS ×</button>
    </div>
    <div class="cms-product-fields">
      <label class="field-wide">Nama produk<input data-field="name" required maxlength="100" value="${escapeHtml(product.name)}"></label>
      <label>Kategori<input data-field="category" required maxlength="60" value="${escapeHtml(product.category)}"></label>
      <label>Harga (IDR)<input data-field="price" type="number" min="1" max="100000000" step="1" required value="${escapeHtml(product.price)}"></label>
      <label class="field-wide">URL foto produk<input data-field="imageUrl" type="url" required maxlength="500" value="${escapeHtml(product.imageUrl)}"></label>
      <label class="field-full">URL halaman produk<input data-field="productUrl" type="url" required maxlength="500" value="${escapeHtml(product.productUrl || shopUrl)}"></label>
      <label>Label / badge<input data-field="badge" maxlength="40" value="${escapeHtml(product.badge)}" placeholder="BEST SELLER"></label>
      <label class="availability-field"><input data-field="isAvailable" type="checkbox" ${product.isAvailable ? "checked" : ""}> Tersedia untuk dibeli</label>
      <label class="field-full">Deskripsi<textarea data-field="description" required maxlength="300" rows="2">${escapeHtml(product.description)}</textarea></label>
    </div>
  </article>
`;

const bannerFields = (banner, index) => `
  <article class="cms-banner" data-banner-id="${escapeHtml(banner.id)}">
    <div class="cms-product-heading">
      <span class="cms-product-index">BANNER <b>${String(index + 1).padStart(2, "0")}</b></span>
      <button class="remove-banner" type="button" aria-label="Hapus banner ${index + 1}">HAPUS ×</button>
    </div>
    <div class="cms-product-fields">
      <label class="field-full">URL gambar banner<input data-banner-field="imageUrl" type="url" required maxlength="500" value="${escapeHtml(banner.imageUrl)}" placeholder="https://domain.com/banner.jpg"></label>
      <label class="field-full">Teks alternatif gambar<input data-banner-field="altText" required maxlength="300" value="${escapeHtml(banner.altText)}" placeholder="Deskripsi singkat banner"></label>
      <label class="field-full">URL tujuan (opsional)<input data-banner-field="linkUrl" type="url" maxlength="500" value="${escapeHtml(banner.linkUrl || "")}" placeholder="https://domain.com/produk"></label>
    </div>
  </article>
`;

const renderDashboard = (content) => {
  updateBrandSettings(content);
  content.banners ??= [];
  app.innerHTML = `
    <div class="cms-shell">
      <aside class="cms-sidebar">
        <a class="brand cms-brand" href="/"><span class="brand-symbol${content.logoUrl ? " brand-symbol--logo" : ""}" aria-hidden="true">${brandMark(content.logoUrl, content.brandName)}</span><span class="brand-name">${escapeHtml(content.brandName)}</span></a>
        <p class="cms-sidebar-kicker">WORKSPACE</p>
        <a class="cms-side-link is-active" href="#page-content" aria-current="location"><span>01</span> Konten website</a>
        <a class="cms-side-link" href="#banner-management"><span>02</span> Banner slide</a>
        <a class="cms-side-link" href="#product-catalog"><span>03</span> Katalog produk</a>
        <div class="cms-sidebar-bottom"><span class="admin-status-dot"></span> CMS ACTIVE <a href="/">LIHAT WEBSITE ↗</a></div>
      </aside>
      <main class="cms-main">
        <header class="cms-topbar"><div><p class="admin-eyebrow">MAIN ACTIVE / ADMIN</p><span>Pengelola konten</span></div><button class="logout-button" id="logout-button" type="button">LOG OUT <span aria-hidden="true">↗</span></button></header>
        <div class="cms-content">
          <div class="cms-page-heading"><div><p class="admin-eyebrow">CONTENT STUDIO</p><h1>Website <span>editor.</span></h1><p>Perbarui cerita, visual, dan koleksi Main Active dari satu tempat.</p></div><a class="preview-button" href="/" target="_blank" rel="noopener noreferrer">PREVIEW WEBSITE ↗</a></div>
          <form id="content-form">
            <section class="cms-section" id="page-content">
              <div class="cms-section-title"><div><span class="cms-section-number">01</span><div><h2>Konten halaman</h2><p>Atur pesan utama dan tautan brand.</p></div></div></div>
              <div class="cms-fields">
                <label>Nama brand<input name="brandName" required maxlength="80" value="${escapeHtml(content.brandName)}"></label>
                <label>URL logo brand<input name="logoUrl" type="url" maxlength="500" value="${escapeHtml(content.logoUrl || "")}" placeholder="https://domain.com/logo.png"></label>
                <label>Eyebrow / label hero<input name="eyebrow" required maxlength="120" value="${escapeHtml(content.eyebrow)}"></label>
                <label class="field-full">Headline utama<input name="headline" required maxlength="180" value="${escapeHtml(content.headline)}"></label>
                <label class="field-full">Deskripsi hero<textarea name="description" required maxlength="500" rows="3">${escapeHtml(content.description)}</textarea></label>
                <label>Headline cerita<input name="storyHeadline" required maxlength="120" value="${escapeHtml(content.storyHeadline)}"></label>
                <label>URL foto hero<input name="heroImageUrl" type="url" required maxlength="500" value="${escapeHtml(content.heroImageUrl)}"></label>
                <label class="field-full">Deskripsi cerita<textarea name="storyDescription" required maxlength="800" rows="3">${escapeHtml(content.storyDescription)}</textarea></label>
                <label>Link toko / Shopee<input name="shopUrl" type="url" required maxlength="500" value="${escapeHtml(content.shopUrl)}"></label>
                <label>Link Instagram<input name="instagramUrl" type="url" required maxlength="500" value="${escapeHtml(content.instagramUrl)}"></label>
              </div>
              ${renderCopyGroups(content.texts)}
            </section>
            <section class="cms-section" id="banner-management">
              <div class="cms-section-title cms-products-title"><div><span class="cms-section-number">02</span><div><h2>Banner slide</h2><p>Tambah atau ganti gambar banner dan atur tautan tujuan.</p></div></div><button class="add-product-button" id="add-banner" type="button" ${content.banners.length >= 12 ? "disabled" : ""}>+ TAMBAH BANNER</button></div>
              <div class="cms-banners">${content.banners.map((banner, index) => bannerFields(banner, index)).join("")}</div>
              <p class="cms-footnote">Gunakan URL gambar HTTPS. Maksimal 12 banner; urutan di sini menentukan urutan slide.</p>
            </section>
            <section class="cms-section" id="product-catalog">
              <div class="cms-section-title cms-products-title"><div><span class="cms-section-number">03</span><div><h2>Katalog produk</h2><p>Kelola nama, foto, kategori, dan harga.</p></div></div><button class="add-product-button" id="add-product" type="button">+ TAMBAH PRODUK</button></div>
              <div class="cms-products">${content.products.map((product, index) => productFields(product, content.shopUrl, index)).join("")}</div>
            </section>
            <div class="cms-savebar"><p id="save-message" role="status">Perubahan belum disimpan.</p><button class="button button-lime save-button" type="submit">SIMPAN & PUBLIKASIKAN <span aria-hidden="true">↗</span></button></div>
          </form>
          <p class="cms-footnote">Konten yang disimpan langsung tampil di landing page. Pastikan URL gambar menggunakan alamat HTTPS yang dapat diakses publik.</p>
        </div>
      </main>
    </div>
  `;

  const form = app.querySelector("#content-form");
  const productList = app.querySelector(".cms-products");
  const bannerList = app.querySelector(".cms-banners");
  const saveMessage = app.querySelector("#save-message");
  const sectionLinks = [...app.querySelectorAll(".cms-side-link")];
  const sections = sectionLinks.map((link) => app.querySelector(link.getAttribute("href")));
  let scrollFrame = 0;
  let navigationTarget = null;
  const updateProductIndexes = () => {
    productList.querySelectorAll(".cms-product-index b").forEach((label, index) => {
      label.textContent = String(index + 1).padStart(2, "0");
    });
  };
  const updateBannerIndexes = () => {
    bannerList.querySelectorAll(".cms-product-index b").forEach((label, index) => {
      label.textContent = String(index + 1).padStart(2, "0");
    });
    bannerList.querySelectorAll(".remove-banner").forEach((button, index) => {
      button.setAttribute("aria-label", `Hapus banner ${index + 1}`);
    });
    app.querySelector("#add-banner").disabled = bannerList.children.length >= 12;
  };

  const setActiveSection = (id) => {
    sectionLinks.forEach((link) => {
      const isActive = link.hash === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateActiveSection = () => {
    scrollFrame = 0;
    const activationLine = window.innerHeight * 0.35;
    if (navigationTarget) {
      if (navigationTarget.getBoundingClientRect().top > activationLine) {
        setActiveSection(navigationTarget.id);
        return;
      }
      navigationTarget = null;
    }

    let activeSection = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= activationLine) {
        activeSection = section;
      }
    }
    if (activeSection) setActiveSection(activeSection.id);
  };

  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navigationTarget = app.querySelector(link.hash);
      setActiveSection(link.hash.slice(1));
    });
  });
  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateActiveSection);
  }, { passive: true });
  window.addEventListener("hashchange", updateActiveSection);
  updateActiveSection();
  enableBrandLogoFallback(app);

  app.querySelector("#add-product").addEventListener("click", () => {
    productList.insertAdjacentHTML("beforeend", productFields({
      id: crypto.randomUUID(),
      name: "",
      category: "Matchday",
      price: 100000,
      description: "",
      imageUrl: "",
      productUrl: content.shopUrl,
      badge: "",
      isAvailable: true,
    }, content.shopUrl, productList.children.length));
    updateProductIndexes();
    productList.lastElementChild.querySelector('input[data-field="name"]').focus();
  });

  app.querySelector("#add-banner").addEventListener("click", () => {
    bannerList.insertAdjacentHTML("beforeend", bannerFields({
      id: crypto.randomUUID(),
      imageUrl: "",
      altText: "",
      linkUrl: "",
    }, bannerList.children.length));
    updateBannerIndexes();
    bannerList.lastElementChild.querySelector('[data-banner-field="imageUrl"]').focus();
  });

  bannerList.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-banner");
    if (!removeButton) return;
    removeButton.closest(".cms-banner").remove();
    updateBannerIndexes();
    saveMessage.textContent = "Banner dihapus dari draft. Simpan untuk memublikasikan perubahan.";
  });

  productList.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-product");
    if (!removeButton) return;
    removeButton.closest(".cms-product").remove();
    updateProductIndexes();
    saveMessage.textContent = "Produk dihapus dari draft. Simpan untuk memublikasikan perubahan.";
  });

  form.addEventListener("input", () => {
    saveMessage.textContent = "Ada perubahan yang belum disimpan.";
    saveMessage.classList.remove("is-error");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const saveButton = form.querySelector(".save-button");
    saveButton.disabled = true;
    saveButton.textContent = "MENYIMPAN...";
    saveMessage.textContent = "";
    saveMessage.classList.remove("is-error");

    const formData = new FormData(form);
    const value = (key) => String(formData.get(key) ?? "").trim();
    const products = [...productList.querySelectorAll(".cms-product")].map((row) => {
      const field = (key) => row.querySelector(`[data-field="${key}"]`);
      return {
        id: row.dataset.productId,
        name: field("name").value.trim(),
        category: field("category").value.trim(),
        price: Number(field("price").value),
        description: field("description").value.trim(),
        imageUrl: field("imageUrl").value.trim(),
        productUrl: field("productUrl").value.trim(),
        badge: field("badge").value.trim(),
        isAvailable: field("isAvailable").checked,
      };
    });
    const banners = [...bannerList.querySelectorAll(".cms-banner")].map((row) => {
      const field = (key) => row.querySelector(`[data-banner-field="${key}"]`);
      return {
        id: row.dataset.bannerId,
        imageUrl: field("imageUrl").value.trim(),
        altText: field("altText").value.trim(),
        linkUrl: field("linkUrl").value.trim(),
      };
    });

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: value("brandName"),
          logoUrl: value("logoUrl"),
          runningText: [...app.querySelectorAll('[data-copy-field^="runningText"]')]
            .map((field) => field.value.trim())
            .join(" · "),
          eyebrow: value("eyebrow"),
          headline: value("headline"),
          description: value("description"),
          storyHeadline: value("storyHeadline"),
          storyDescription: value("storyDescription"),
          heroImageUrl: value("heroImageUrl"),
          shopUrl: value("shopUrl"),
          instagramUrl: value("instagramUrl"),
          texts: Object.fromEntries(
            [...app.querySelectorAll("[data-copy-field]")]
              .map((field) => [field.dataset.copyField, field.value.trim()]),
          ),
          banners,
          products,
        }),
      });
      if (response.status === 401) {
        showLogin("Sesi admin berakhir. Silakan masuk kembali.");
        return;
      }
      if (!response.ok) throw new Error(await getErrorMessage(response));
      const saved = await response.json();
      updateBrandSettings(saved);
      app.querySelector(".cms-brand .brand-name").textContent = saved.brandName;
      const currentLogo = app.querySelector(".cms-brand .brand-symbol");
      currentLogo.classList.toggle("brand-symbol--logo", Boolean(saved.logoUrl));
      currentLogo.innerHTML = brandMark(saved.logoUrl, saved.brandName);
      enableBrandLogoFallback(currentLogo);
      productList.innerHTML = saved.products.map((product, index) => productFields(product, saved.shopUrl, index)).join("");
      bannerList.innerHTML = (saved.banners ?? []).map((banner, index) => bannerFields(banner, index)).join("");
      updateBannerIndexes();
      saveMessage.textContent = "Berhasil disimpan dan dipublikasikan.";
    } catch (error) {
      saveMessage.textContent = error.message;
      saveMessage.classList.add("is-error");
    } finally {
      saveButton.disabled = false;
      saveButton.innerHTML = 'SIMPAN & PUBLIKASIKAN <span aria-hidden="true">↗</span>';
    }
  });

  app.querySelector("#logout-button").addEventListener("click", async () => {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (!response.ok) {
      saveMessage.textContent = await getErrorMessage(response);
      saveMessage.classList.add("is-error");
      return;
    }
    showLogin();
  });
};

const loadDashboard = async () => {
  const response = await fetch("/api/admin/content");
  if (response.status === 401) {
    const publicResponse = await fetch("/api/content");
    if (!publicResponse.ok) {
      throw new Error(await getErrorMessage(publicResponse));
    }
    updateBrandSettings(await publicResponse.json());
    showLogin();
    return;
  }
  if (!response.ok) {
    showLogin(await getErrorMessage(response));
    return;
  }
  renderDashboard(await response.json());
};

loadDashboard().catch((error) => {
  console.error("Gagal memuat CMS.", error);
  showLogin("CMS tidak dapat dimuat. Coba muat ulang halaman.");
});
