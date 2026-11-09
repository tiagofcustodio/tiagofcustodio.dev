// ==========================================================================
// TIAGO CUSTÓDIO — PARALLAX ENGINE, 3D INTERACTIONS & BILINGUAL UI (PT / EN)
// ==========================================================================

(function () {
  const i18n = window.PORTFOLIO_I18N;
  const common = i18n.common;

  // Determine initial language from window.DEFAULT_LANG, URL ?lang=en, or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  let currentLang =
    window.DEFAULT_LANG ||
    (urlLang === 'en' || urlLang === 'pt' ? urlLang : null) ||
    localStorage.getItem('tc_portfolio_lang') ||
    'pt';

  let currentCertFilter = 'all';
  let currentProjFilter = 'all';

  function getLangData() {
    return i18n[currentLang] || i18n.pt;
  }

  // --------------------------------------------------------------------------
  // 1. SVG ICON HELPER
  // --------------------------------------------------------------------------
  const ICONS = {
    code: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    shield: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    cpu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
    server: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    terminal: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`
  };

  // --------------------------------------------------------------------------
  // 2. TYPEWRITER ROLE ROTATOR IN HERO
  // --------------------------------------------------------------------------
  function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;

    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function tick() {
      const roles = getLangData().roles;
      const currentRole = roles[roleIdx % roles.length];
      if (!deleting) {
        charIdx++;
        el.textContent = currentRole.slice(0, charIdx);
        if (charIdx >= currentRole.length) {
          deleting = true;
          setTimeout(tick, 2000);
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIdx--;
        el.textContent = currentRole.slice(0, Math.max(0, charIdx));
        if (charIdx <= 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(tick, 320);
          return;
        }
        setTimeout(tick, 28);
      }
    }
    tick();
  }

  // --------------------------------------------------------------------------
  // 3. APPLY TRANSLATIONS TO STATIC DOM ELEMENTS
  // --------------------------------------------------------------------------
  function applyUiTranslations() {
    const d = getLangData();
    const ui = d.ui;
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'pt-PT';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (ui[key] !== undefined) {
        el.textContent = ui[key];
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (ui[key] !== undefined) {
        el.innerHTML = ui[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (ui[key] !== undefined) {
        el.placeholder = ui[key];
      }
    });

    // Update language switch active buttons
    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.setLang === currentLang);
    });
  }

  // --------------------------------------------------------------------------
  // 4. RENDER BENTO GRID SKILLS
  // --------------------------------------------------------------------------
  function renderBentoSkills() {
    const container = document.getElementById('bento-skills-grid');
    if (!container) return;
    const d = getLangData();

    container.innerHTML = d.skillCategories
      .map(
        (cat) => `
      <article class="bento-card ${cat.span}" data-accent="${cat.accent}">
        <div class="bento-head">
          <div>
            <h3 class="bento-title">${cat.title}</h3>
            <p class="bento-subtitle">${cat.subtitle}</p>
          </div>
          <div class="bento-icon">${ICONS[cat.icon] || ICONS.code}</div>
        </div>
        <div class="skill-bars">
          ${cat.skills
            .map(
              (s) => `
            <div class="skill-row">
              <div class="skill-row-top">
                <span>${s.name}</span>
                <span class="skill-pct">${s.level}%</span>
              </div>
              <div class="skill-track">
                <div class="skill-fill" data-level="${s.level}"></div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </article>
    `
      )
      .join('');

    container.querySelectorAll('.bento-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach((bar) => {
              bar.style.width = `${bar.dataset.level}%`;
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    container.querySelectorAll('.bento-card').forEach((c) => observer.observe(c));
  }

  // --------------------------------------------------------------------------
  // 5. RENDER CERTIFICATES & 3D TILT + PDF MODAL
  // --------------------------------------------------------------------------
  function renderCertificates(filter = currentCertFilter) {
    currentCertFilter = filter;
    const grid = document.getElementById('certificates-grid');
    if (!grid) return;
    const d = getLangData();
    const ui = d.ui;

    const list =
      filter === 'all'
        ? d.certificates
        : d.certificates.filter((c) => c.category === filter);

    grid.innerHTML = list
      .map(
        (cert) => `
      <article class="cert-card tilt-card">
        <div>
          <div class="cert-top">
            <div class="cert-badge-wrap">
              <img src="${cert.badge}" alt="Badge ${cert.title}" loading="lazy" />
            </div>
            <div>
              <span class="cert-meta-date">${ui.certVerifiedTag} • ${cert.date}</span>
              <h3 class="cert-title">${cert.title}</h3>
              <p class="cert-issuer">${cert.issuer}</p>
            </div>
          </div>
          <ul class="cert-competencies">
            ${cert.competencies.map((comp) => `<li>${comp}</li>`).join('')}
          </ul>
        </div>
        <div class="cert-actions">
          ${
            cert.pdf
              ? `<button type="button" class="btn btn-primary btn-sm open-pdf-btn" data-pdf="${cert.pdf}" data-title="${cert.title}">
                  ${ui.certViewPdfBtn}
                </button>
                <a href="${cert.pdf}" download class="btn btn-glass btn-sm">
                  ${ui.certDownloadBtn}
                </a>`
              : `<a href="${common.credly}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                  ${ui.certCredlyProfileBtn}
                </a>`
          }
        </div>
      </article>
    `
      )
      .join('');

    grid.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    grid.querySelectorAll('.open-pdf-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        openPdfModal(btn.dataset.pdf, btn.dataset.title);
      });
    });
  }

  function initCertFilters() {
    const buttons = document.querySelectorAll('[data-cert-filter]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderCertificates(btn.dataset.certFilter);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. PDF LIGHTBOX MODAL
  // --------------------------------------------------------------------------
  function openPdfModal(pdfUrl, title) {
    const modal = document.getElementById('pdf-modal');
    const iframe = document.getElementById('pdf-modal-iframe');
    const titleEl = document.getElementById('pdf-modal-title');
    const downloadBtn = document.getElementById('pdf-modal-download');
    if (!modal || !iframe) return;

    titleEl.textContent = title;
    iframe.src = pdfUrl;
    downloadBtn.href = pdfUrl;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function initModalClose() {
    const modal = document.getElementById('pdf-modal');
    const closeBtn = document.getElementById('pdf-modal-close');
    const iframe = document.getElementById('pdf-modal-iframe');
    if (!modal) return;

    function close() {
      modal.classList.remove('open');
      iframe.src = '';
      document.body.style.overflow = '';
    }

    closeBtn?.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    document.querySelectorAll('.open-cv-modal-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openPdfModal(common.cvPdf, getLangData().ui.cvModalTitle);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. RENDER PROJECTS & LIVE GITHUB REPOSITORIES
  // --------------------------------------------------------------------------
  function renderProjects(filter = currentProjFilter) {
    currentProjFilter = filter;
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const d = getLangData();
    const ui = d.ui;

    const list =
      filter === 'all'
        ? d.projects
        : d.projects.filter((p) => p.category === filter);

    grid.innerHTML = list
      .map(
        (proj) => `
      <article class="project-card">
        <div>
          <span class="project-badge">${proj.badgeText}</span>
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-desc">${proj.description}</p>
          <pre class="project-code-preview"><code>${proj.codeSnippet}</code></pre>
          <div class="project-tags">
            ${proj.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="cert-actions">
          <a href="${proj.githubUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
            ${ui.projGithubBtn}
          </a>
          <span style="font-size:0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
            ${proj.metrics.join(' • ')}
          </span>
        </div>
      </article>
    `
      )
      .join('');
  }

  function initProjectFilters() {
    const buttons = document.querySelectorAll('[data-proj-filter]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.dataset.projFilter);
      });
    });
  }

  async function fetchLiveGitHubRepos() {
    const statusEl = document.getElementById('github-live-status');
    const reposContainer = document.getElementById('github-live-repos');
    if (!statusEl) return;

    try {
      const res = await fetch(
        `https://api.github.com/users/${common.githubUsername}/repos?sort=updated&per_page=4`
      );
      if (!res.ok) throw new Error('GitHub API status ' + res.status);
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length > 0 && reposContainer) {
        reposContainer.style.display = 'grid';
        reposContainer.innerHTML = repos
          .map(
            (r) => `
          <a href="${r.html_url}" target="_blank" rel="noopener" class="contact-item" style="text-decoration:none;">
            <div>
              <strong style="color:var(--accent-cyan); font-family:var(--font-mono);">${r.name}</strong>
              <p style="font-size:0.84rem; color:var(--text-secondary); margin-top:4px;">
                ${r.description || 'GitHub Repository — Tiago Custódio'}
              </p>
            </div>
          </a>
        `
          )
          .join('');
      }
    } catch {
      // Offline / rate-limit fallback
    }
  }

  // --------------------------------------------------------------------------
  // 8. RENDER TIMELINE (CV)
  // --------------------------------------------------------------------------
  function renderTimeline() {
    const container = document.getElementById('cv-timeline-items');
    if (!container) return;
    const d = getLangData();
    const ui = d.ui;

    container.innerHTML = d.timeline
      .map(
        (item) => `
      <article class="timeline-item" data-type="${item.type}">
        <div class="timeline-dot"></div>
        <div class="timeline-header">
          <span class="timeline-period">${item.period}</span>
          <span class="timeline-type-badge">${
            item.type === 'work' ? ui.timelineWorkBadge : ui.timelineEduBadge
          } • ${item.location}</span>
        </div>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-org">${item.organization}</p>
        <ul class="timeline-highlights">
          ${item.highlights.map((h) => `<li>${h}</li>`).join('')}
        </ul>
        <div class="project-tags" style="margin-bottom:0;">
          ${item.tags.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </article>
    `
      )
      .join('');
  }

  // --------------------------------------------------------------------------
  // 9. INTERACTIVE CYBER TERMINAL (BILINGUAL)
  // --------------------------------------------------------------------------
  function initTerminal() {
    const body = document.getElementById('terminal-body');
    const input = document.getElementById('terminal-input');
    const form = document.getElementById('terminal-form');
    if (!body || !input || !form) return;

    function executeCommand(raw) {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;

      if (cmd === 'clear') {
        body.innerHTML = '';
        return;
      }

      const d = getLangData();
      const isEn = currentLang === 'en';

      const commands = {
        help: () =>
          isEn
            ? `Available commands:\n` +
              `  whoami     → Executive summary of Tiago Custódio's profile\n` +
              `  skills     → Technical competencies (Python, Django, Cybersecurity, AI, Networks)\n` +
              `  certs      → List of Cisco Networking Academy & Tokio School certifications\n` +
              `  experience → Professional and academic timeline (20/20 Final Grade at CEPRA)\n` +
              `  contact    → Email, Phone, LinkedIn, GitHub, and Credly\n` +
              `  cv         → Open official Curriculum Vitae PDF\n` +
              `  clear      → Clear terminal screen`
            : `Comandos disponíveis:\n` +
              `  whoami     → Resumo do perfil profissional de Tiago Custódio\n` +
              `  skills     → Competências técnicas (Python, Django, Cibersegurança, IA, Redes)\n` +
              `  certs      → Lista de certificações Cisco Networking Academy & Tokio School\n` +
              `  experience → Percurso profissional e académico (Nota 20/20 CEPRA)\n` +
              `  contact    → Email, Telefone, LinkedIn, GitHub e Credly\n` +
              `  cv         → Abrir o Curriculum Vitae oficial em PDF\n` +
              `  clear      → Limpar consola`,

        whoami: () =>
          `> ${common.fullName}\n` +
          `> ${isEn ? 'Location' : 'Localização'}: ${common.location}\n` +
          `> ${isEn ? 'Profile' : 'Perfil'}: ${d.bioParagraphs.join(' ')}`,

        skills: () =>
          d.skillCategories
            .map(
              (c) =>
                `[${c.title.toUpperCase()}]\n  • ` +
                c.skills.map((s) => `${s.name} (${s.level}%)`).join('\n  • ')
            )
            .join('\n\n'),

        certs: () =>
          d.certificates
            .map((c, i) => `${String(i + 1).padStart(2, '0')}. ${c.title} — ${c.issuer} (${c.date})`)
            .join('\n'),

        experience: () =>
          d.timeline
            .map((t) => `• [${t.period}] ${t.title} @ ${t.organization}`)
            .join('\n'),

        contact: () =>
          `Email:    ${common.email}\n` +
          `${isEn ? 'Phone:   ' : 'Telefone:'} ${common.phone}\n` +
          `${isEn ? 'Address: ' : 'Morada:  '} ${common.location}\n` +
          `LinkedIn: ${common.linkedin}\n` +
          `GitHub:   ${common.github}\n` +
          `Credly:   ${common.credly}`,

        cv: () => {
          openPdfModal(common.cvPdf, d.ui.cvModalTitle);
          return isEn
            ? 'Opening official Curriculum Vitae PDF...'
            : 'A abrir Curriculum Vitae oficial em PDF...';
        }
      };

      const linePrompt = document.createElement('div');
      linePrompt.className = 'term-line';
      linePrompt.innerHTML = `<span class="term-prompt">tiago@cyber-portfolio:~$</span> ${raw}`;
      body.appendChild(linePrompt);

      const lineOut = document.createElement('div');
      lineOut.className = 'term-line term-output';
      lineOut.textContent = commands[cmd]
        ? commands[cmd]()
        : isEn
        ? `Command not found: "${cmd}". Type "help" to see available commands.`
        : `Comando não reconhecido: "${cmd}". Escreve "help" para ver os comandos disponíveis.`;
      body.appendChild(lineOut);

      body.scrollTop = body.scrollHeight;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      executeCommand(input.value);
      input.value = '';
    });

    document.querySelectorAll('[data-term-cmd]').forEach((chip) => {
      chip.addEventListener('click', () => {
        executeCommand(chip.dataset.termCmd);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. LANGUAGE SWITCHER HANDLER (PT <-> EN)
  // --------------------------------------------------------------------------
  function setLanguage(lang) {
    if (lang !== 'pt' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('tc_portfolio_lang', lang);

    applyUiTranslations();
    renderBentoSkills();
    renderCertificates(currentCertFilter);
    renderProjects(currentProjFilter);
    renderTimeline();
  }

  function initLanguageSwitcher() {
    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.setLang);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 11. MULTI-LAYER PARALLAX SCROLL & MOUSE ENGINE (60FPS LERP)
  // --------------------------------------------------------------------------
  function initParallaxEngine() {
    const parallaxNodes = Array.from(document.querySelectorAll('[data-parallax-speed]'));
    const spotlight = document.getElementById('cursor-spotlight');
    const progressBar = document.getElementById('scroll-progress-bar');
    const timelineWrapper = document.getElementById('timeline-wrapper');
    const timelineLaser = document.getElementById('timeline-laser');

    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener(
      'scroll',
      () => {
        targetScroll = window.scrollY;
      },
      { passive: true }
    );

    window.addEventListener(
      'mousemove',
      (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        if (spotlight) {
          spotlight.style.left = `${e.clientX}px`;
          spotlight.style.top = `${e.clientY}px`;
        }
      },
      { passive: true }
    );

    function animate() {
      currentScroll += (targetScroll - currentScroll) * 0.12;
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar && docHeight > 0) {
        progressBar.style.width = `${Math.min(100, Math.max(0, (currentScroll / docHeight) * 100))}%`;
      }

      for (const node of parallaxNodes) {
        const speedY = parseFloat(node.dataset.parallaxSpeed || '0');
        const speedX = parseFloat(node.dataset.parallaxX || '0');
        const mouseDepth = parseFloat(node.dataset.mouseDepth || '0');

        const yOffset = currentScroll * speedY + mouseY * mouseDepth;
        const xOffset = currentScroll * speedX + mouseX * mouseDepth;

        node.style.transform = `translate3d(${xOffset.toFixed(2)}px, ${yOffset.toFixed(2)}px, 0)`;
      }

      if (timelineWrapper && timelineLaser) {
        const rect = timelineWrapper.getBoundingClientRect();
        const viewMid = window.innerHeight * 0.65;
        const progress = ((viewMid - rect.top) / rect.height) * 100;
        timelineLaser.style.height = `${Math.min(100, Math.max(0, progress))}%`;
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  // --------------------------------------------------------------------------
  // 12. INTERACTIVE CYBER CONSTELLATION CANVAS
  // --------------------------------------------------------------------------
  function initCyberCanvas() {
    const canvas = document.getElementById('cyber-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const count = Math.min(65, Math.floor((w * h) / 24000));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.8,
      depth: Math.random() * 0.4 + 0.1
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const scrollY = window.scrollY;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const renderY = (p.y - scrollY * p.depth) % h;
        const actualY = renderY < 0 ? renderY + h : renderY;

        ctx.beginPath();
        ctx.arc(p.x, actualY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.55)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const rY2 = (p2.y - scrollY * p2.depth) % h;
          const actualY2 = rY2 < 0 ? rY2 + h : rY2;
          const dx = p.x - p2.x;
          const dy = actualY - actualY2;
          const dist = Math.hypot(dx, dy);

          if (dist < 135) {
            ctx.beginPath();
            ctx.moveTo(p.x, actualY);
            ctx.lineTo(p2.x, actualY2);
            ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 135) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // --------------------------------------------------------------------------
  // 13. CONTACT FORM MAILTO HANDLER
  // --------------------------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const subject =
        document.getElementById('cf-subject').value.trim() ||
        (currentLang === 'en' ? 'Portfolio Inquiry' : 'Contacto via Portfólio Web');
      const message = document.getElementById('cf-message').value.trim();

      const body = encodeURIComponent(
        `${currentLang === 'en' ? 'Hi Tiago' : 'Olá Tiago'},\n\n${message}\n\n---\n${
          currentLang === 'en' ? 'Sent by' : 'Enviado por'
        }: ${name} (${email})`
      );
      window.location.href = `mailto:${common.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }

  // --------------------------------------------------------------------------
  // INITIALIZE ALL MODULES ON DOM READY
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    applyUiTranslations();
    initLanguageSwitcher();
    initTypewriter();
    renderBentoSkills();
    renderCertificates('all');
    initCertFilters();
    renderProjects('all');
    initProjectFilters();
    fetchLiveGitHubRepos();
    renderTimeline();
    initTerminal();
    initModalClose();
    initParallaxEngine();
    initCyberCanvas();
    initContactForm();
  });
})();
