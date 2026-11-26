document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     1. TAHUN DINAMIS & SCROLL PROGRESS + NAVBAR
     ========================================================= */
  const yearEl = document.getElementById('yearNow');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) scrollProgress.style.width = `${pct}%`;
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 24);

    // Highlight active nav link
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (scrollTop >= top) currentId = sec.getAttribute('id');
    });

    navLinksAll.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  /* =========================================================
     2. MOBILE HAMBURGER MENU
     ========================================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinksAll.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================
     3. DARK / LIGHT THEME TOGGLE
     ========================================================= */
  const themeToggle = document.getElementById('themeToggle');
  const rootEl = document.documentElement;
  const savedTheme = localStorage.getItem('sonang-theme');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    rootEl.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = rootEl.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      rootEl.setAttribute('data-theme', next);
      localStorage.setItem('sonang-theme', next);
    });
  }

  /* =========================================================
     4. CURSOR GLOW (DESKTOP)
     ========================================================= */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  /* =========================================================
     5. TYPING EFFECT DI HERO
     ========================================================= */
  const typingEl = document.getElementById('typingText');
  const phrases = [
    'Siswa Kelas 12 TKJ',
    'SMK Bangun Nusa Bangsa',
    'Network & MikroTik Enthusiast',
    'Linux Server & Web Builder'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function runTyping() {
    if (!typingEl) return;
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
      typingEl.textContent = currentPhrase.substring(0, charIdx);
    } else {
      charIdx++;
      typingEl.textContent = currentPhrase.substring(0, charIdx);
    }

    let delay = isDeleting ? 45 : 85;

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 1700;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(runTyping, delay);
  }

  runTyping();

  /* =========================================================
     6. ANIMATED NETWORK CANVAS (LATAR HERO TKJ)
     ========================================================= */
  const canvas = document.getElementById('networkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);
    const mouse = { x: null, y: null, radius: 130 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const nodeCount = Math.min(55, Math.floor((width * height) / 18000));
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      r: Math.random() * 2 + 1.4
    }));

    function animateNetwork() {
      ctx.clearRect(0, 0, width, height);
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      const nodeColor = isLight ? 'rgba(2, 132, 199, 0.55)' : 'rgba(56, 189, 248, 0.65)';

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.28;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = isLight
              ? `rgba(2, 132, 199, ${alpha})`
              : `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mdx = n.x - mouse.x;
          const mdy = n.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < mouse.radius) {
            const alpha = (1 - mDist / mouse.radius) * 0.45;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateNetwork);
    }

    animateNetwork();
  }

  /* =========================================================
     7. SCROLL REVEAL, SKILL BARS & COUNTER ANIMATION
     ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');
  const skillFills = document.querySelectorAll('.skill-fill');
  const statNums = document.querySelectorAll('.stat-num');

  const animateCounter = (el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = Number(el.dataset.target || 0);
    const duration = 1200;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Animate any skill bar inside
          entry.target.querySelectorAll('.skill-fill').forEach((bar) => {
            bar.style.width = bar.dataset.width || '0%';
          });

          // Animate any stat counter inside
          entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));

  // Fallback for elements directly observed
  skillFills.forEach((bar) => observer.observe(bar));
  statNums.forEach((num) => observer.observe(num));

  /* =========================================================
     8. FILTER KEAHLIAN
     ========================================================= */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const category = btn.dataset.filter;
      skillCards.forEach((card) => {
        const match = category === 'all' || card.dataset.category === category;
        card.classList.toggle('hidden', !match);
        if (match) {
          card.classList.add('visible');
          const fill = card.querySelector('.skill-fill');
          if (fill) fill.style.width = fill.dataset.width || '0%';
        }
      });
    });
  });

  /* =========================================================
     9. MODAL DETAIL PROYEK
     ========================================================= */
  const projectData = {
    hotspot: {
      badge: 'Jaringan TKJ',
      title: 'Sistem Hotspot & Manajemen Bandwidth MikroTik',
      desc: 'Merancang jaringan hotspot terkelola untuk lingkungan sekolah atau kafe dengan pembagian hak akses dan limitasi kecepatan yang adil.',
      points: [
        'Konfigurasi DHCP Server, NAT Masquerade, dan DNS pada RouterOS.',
        'Pembuatan profil user Hotspot dengan limitasi bandwidth menggunakan Simple Queue.',
        'Pengaturan halaman login Hotspot kustom dan aturan Firewall dasar.'
      ],
      tags: ['MikroTik', 'RouterOS', 'Winbox', 'Firewall']
    },
    webserver: {
      badge: 'Linux Server',
      title: 'Konfigurasi Debian Web & DNS Server',
      desc: 'Membangun layanan server lokal berbasis Linux Debian untuk hosting website internal serta resolusi nama domain lokal.',
      points: [
        'Instalasi dan konfigurasi Bind9 sebagai DNS Server lokal.',
        'Setup Nginx Virtual Host untuk melayani beberapa situs web sekaligus.',
        'Pengamanan akses jarak jauh menggunakan SSH dan konfigurasi UFW.'
      ],
      tags: ['Debian Linux', 'Nginx', 'Bind9', 'SSH']
    },
    portfolio: {
      badge: 'Web Development',
      title: 'Website Portofolio Interaktif',
      desc: 'Website profil pribadi yang dirancang dengan estetika modern, mendukung mode gelap/terang, serta animasi interaktif berbasis HTML, CSS, dan JavaScript.',
      points: [
        'Animasi partikel topologi jaringan real-time menggunakan HTML5 Canvas.',
        'Efek mengetik otomatis, scroll-reveal, dan filter keahlian interaktif.',
        'Desain responsif yang nyaman diakses di desktop maupun smartphone.'
      ],
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API']
    }
  };

  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalList = document.getElementById('modalList');
  const modalTags = document.getElementById('modalTags');

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.dataset.project;
      const data = projectData[key];
      if (!data || !modal) return;

      modalBadge.textContent = data.badge;
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;
      modalList.innerHTML = data.points.map((pt) => `<li>${pt}</li>`).join('');
      modalTags.innerHTML = data.tags.map((t) => `<span>${t}</span>`).join('');

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* =========================================================
     10. FORM KONTAK & TOAST NOTIFICATION
     ========================================================= */
  const toastEl = document.getElementById('toast');
  const showToast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3600);
  };

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        showToast('Mohon lengkapi semua kolom sebelum mengirim.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Format alamat email belum valid.');
        return;
      }

      showToast(`Terima kasih, ${name}! Pesan Anda telah dicatat.`);
      contactForm.reset();
    });
  }
});
