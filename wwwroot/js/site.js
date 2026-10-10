const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const initials = (title) =>
  title
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();

const renderSite = (site) => {
  const app = document.querySelector("#app");
  const email = escapeHtml(site.email);
  const brandName = escapeHtml(site.brandName);
  const brandMark = escapeHtml(site.brandMark);

  document.documentElement.style.setProperty("--primary", site.primaryColor);
  document.documentElement.style.setProperty("--accent", site.accentColor);
  document.querySelector('meta[name="theme-color"]').content = site.primaryColor;
  document.querySelector('meta[name="description"]').content = site.description;
  document.title = `${site.brandName} — Studio Digital Independen`;

  app.innerHTML = `
    <header class="site-header">
      <div class="nav-wrap">
        <a class="brand" href="#beranda" aria-label="${brandName}, ke beranda">
          <span class="brand-mark">${brandMark}</span>
          <span>${brandName}</span>
        </a>
        <nav class="nav-links" aria-label="Navigasi utama">
          <a href="#layanan">Layanan</a>
          <a href="#karya">Karya</a>
          <a class="button" href="mailto:${email}">Hubungi kami <span class="arrow" aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero" id="beranda">
        <div class="hero-wrap">
          <div class="hero-content">
            <span class="eyebrow">${escapeHtml(site.eyebrow)}</span>
            <h1>${escapeHtml(site.headline)}</h1>
            <p class="hero-copy">${escapeHtml(site.description)}</p>
            <div class="hero-actions">
              <a class="button" href="mailto:${email}">Ceritakan proyek Anda <span class="arrow" aria-hidden="true">↗</span></a>
              <a class="text-link" href="#karya">Lihat karya kami <span class="arrow" aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div class="stats" aria-label="Sekilas tentang ${brandName}">
            ${site.stats.map((stat) => `
              <div>
                <span class="stat-value">${escapeHtml(stat.value)}</span>
                <span class="stat-label">${escapeHtml(stat.label)}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="section section-dark" id="layanan">
        <div class="section-wrap">
          <div class="section-heading">
            <div>
              <span class="section-kicker">Yang bisa kami bantu</span>
              <h2>Strategi yang matang. Eksekusi yang berarti.</h2>
            </div>
            <p class="section-intro">Dari ide pertama sampai produk siap diluncurkan, kami bekerja sebagai partner yang memahami tujuan bisnis Anda.</p>
          </div>
          <div class="service-grid">
            ${site.services.map((service, index) => `
              <article class="service-card">
                <span class="service-number">${String(index + 1).padStart(2, "0")}</span>
                <h3>${escapeHtml(service.title)}</h3>
                <p>${escapeHtml(service.description)}</p>
              </article>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="section" id="karya">
        <div class="section-wrap">
          <div class="section-heading">
            <div>
              <span class="section-kicker">Pilihan karya</span>
              <h2>Ide menjadi pengalaman.</h2>
            </div>
            <p class="section-intro" style="color: var(--muted)">Setiap kolaborasi berangkat dari tantangan yang berbeda. Inilah beberapa cerita yang kami bangun bersama.</p>
          </div>
          <div class="project-grid">
            ${site.projects.map((project) => `
              <article class="project-card">
                <div class="project-art" aria-hidden="true">
                  <span class="project-monogram">${escapeHtml(initials(project.title))}</span>
                </div>
                <div class="project-copy">
                  <span class="project-category">${escapeHtml(project.category)}</span>
                  <h3>${escapeHtml(project.title)}</h3>
                  <p>${escapeHtml(project.description)}</p>
                </div>
              </article>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="contact" id="kontak">
        <div class="section-wrap">
          <div class="contact-panel">
            <div>
              <span class="section-kicker">Punya ide? Mari mulai.</span>
              <h2>Proyek berikutnya bisa dimulai dari percakapan sederhana.</h2>
              <p>${escapeHtml(site.location)}${site.phone ? ` · ${escapeHtml(site.phone)}` : ""}</p>
            </div>
            <a class="button" href="mailto:${email}">Kirim email <span class="arrow" aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-wrap">
        <p class="footer-note">© ${new Date().getFullYear()} ${brandName}. Dibuat dengan tujuan.</p>
        <div class="footer-meta">
          <a class="footer-link" href="mailto:${email}">${email}</a>
          <span>${escapeHtml(site.location)}</span>
        </div>
      </div>
    </footer>
  `;
};

const loadSite = async () => {
  const app = document.querySelector("#app");

  try {
    const response = await fetch("/api/site-config");
    if (!response.ok) {
      throw new Error(`Permintaan konfigurasi gagal (${response.status}).`);
    }

    renderSite(await response.json());
  } catch (error) {
    console.error("Gagal memuat konfigurasi website.", error);
    app.innerHTML = '<p class="load-error" role="alert">Website belum dapat dimuat. Coba muat ulang halaman atau hubungi administrator.</p>';
  }
};

loadSite();
