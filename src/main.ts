// ═══════════════════════════════════════════════════════════
//  MAIN.TS — Hero Interactions & Animations
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────
     1.  ANIMATED GRID CANVAS
  ───────────────────────────────────────────────────────── */
  const canvas = document.getElementById('grid-canvas') as HTMLCanvasElement;
  const ctx    = canvas?.getContext('2d');

  const CELL   = 55;   // grid cell size (px)
  const SPEED  = 0.28; // px per frame (diagonal drift speed)

  let offset = 0;
  let raf: number;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawGrid() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Line style
    ctx.strokeStyle = 'rgba(170, 150, 120, 0.22)';
    ctx.lineWidth   = 0.7;

    const w = canvas.width;
    const h = canvas.height;

    // Diagonal offset capped to one cell
    const o = offset % CELL;

    // Vertical lines shifted diagonally
    for (let x = -CELL + o; x < w + CELL; x += CELL) {
      ctx.beginPath();
      ctx.moveTo(x,     0);
      ctx.lineTo(x + w * 0.3, h); // slight diagonal slant
      ctx.stroke();
    }

    // Horizontal lines shifted
    for (let y = -CELL + o; y < h + CELL; y += CELL) {
      ctx.beginPath();
      ctx.moveTo(0,  y);
      ctx.lineTo(w,  y + w * 0.0); // pure horizontal, offset only via y
      ctx.stroke();
    }

    offset += SPEED;
    raf = requestAnimationFrame(drawGrid);
  }

  if (canvas && ctx) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawGrid();
  }

  /* ─────────────────────────────────────────────────────────
     2.  NAVBAR SCROLL EFFECT
  ───────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─────────────────────────────────────────────────────────
     3.  ENTRANCE ANIMATIONS (Intersection Observer)
  ───────────────────────────────────────────────────────── */
  const animDelay: Record<string, number> = {
    'avail-badge':   0,
    'hero-title':    120,
    'hero-subtitle': 220,
    'hero-tagline':  320,
    'hero-actions':  430,
    'stats-row':     540,
    'hero-right':    200,
  };

  // Add fade-up class to left-side items
  const leftIds = ['avail-badge','hero-title','hero-subtitle','hero-tagline','hero-actions','stats-row'];
  leftIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('fade-up');
  });

  // Add fade-right class to right-side portrait
  const heroRight = document.getElementById('hero-right');
  if (heroRight) heroRight.classList.add('fade-right');

  // Animate on load (hero is always visible)
  function triggerEntrances() {
    Object.entries(animDelay).forEach(([id, delay]) => {
      const el = document.getElementById(id);
      if (!el) return;
      setTimeout(() => el.classList.add('in'), delay);
    });
  }

  // Small boot delay so CSS transitions work
  setTimeout(triggerEntrances, 80);

  /* ─────────────────────────────────────────────────────────
     3b. INTERSECTION OBSERVER (Scroll Animations)
  ───────────────────────────────────────────────────────── */
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Observe About section elements for scroll entrances
  const aboutElements = [
    'about-text-content', 
    'about-heading', 
    'about-description', 
    'about-visual-content',
    'about-gcard-1',
    'about-gcard-2',
    'projects-header',
    'projects-content',
    'projects-left',
    'services-header',
    'testimonials-header',
    'testimonials-marquee',
    'contact-header',
    'contact-hub'
  ];


  
  aboutElements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('fade-up');
      observer.observe(el);
    }
  });

  // Services Cards individual observation
  document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
  });

  // ═══════════════════════════════════════════════════════════
  // TESTIMONIALS LOGIC
  // ═══════════════════════════════════════════════════════════
  const testimonials = [
    {
      name: 'Anushka Rai',
      role: 'Research Head @ Plakasha University',
      text: 'Akshat is a rare talent who bridges the gap between complex AI research and production-ready applications. His work on our real-time processing pipeline reduced latency by 40% while maintaining incredible accuracy.',
      initials: 'AR'
    },
    {
      name: 'Anirudh Rathi',
      role: 'AI Engineer @ Appinventiv',
      text: 'The 3D visualization and dashboard Akshat built for our computer vision platform is simply world-class. It is not just about the aesthetics; the performance under heavy data loads is exceptional.',
      initials: 'AR'
    },
    {
      name: 'Khushi Tripathi',
      role: 'Lead Architect @ InnovateJS',
      text: 'Working with Akshat was a breeze. He took our vague requirements for a custom deep learning project and turned them into a robust, well-documented API within weeks. Truly professional.',
      initials: 'KT'
    },
    {
      name: 'Avni Shingal',
      role: 'SWE @ Infineon',
      text: 'Akshat’s approach to Natural Language Processing is deeply analytical. He helped us implement a sentiment analysis engine that handles 10M+ daily events with better precision than our previous commercial solution.',
      initials: 'AS'
    },
    {
      name: 'Archita Rai',
      role: 'Team Lead @ Accenture',
      text: 'The attention to detail in the UI and the smooth integration of the ML models made our transition to an AI-first product seamless. Akshat exceeded all our expectations.',
      initials: 'AR'
    }
  ];

  const marqueeTrack = document.getElementById('marquee-track');
  const modal = document.getElementById('testimonial-modal');
  const modalBody = document.getElementById('modal-body');
  const closeModal = document.getElementById('close-modal');
  const modalBackdrop = document.querySelector('.modal-backdrop');

  if (marqueeTrack) {
    // Generate cards twice for seamless loop
    const generateCards = (items: typeof testimonials) => {
      return items.map(t => `
        <div class="t-card" data-name="${t.name}">
          <div class="t-header">
            <div class="t-avatar">${t.initials}</div>
            <div class="t-info">
              <h4>${t.name}</h4>
              <p>${t.role}</p>
            </div>
          </div>
          <p class="t-quote">"${t.text}"</p>
        </div>
      `).join('');
    };

    marqueeTrack.innerHTML = generateCards(testimonials) + generateCards(testimonials);

    // Setup Modal Trigger
    marqueeTrack.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('.t-card');
      if (card) {
        const name = card.getAttribute('data-name');
        const data = testimonials.find(t => t.name === name);
        if (data) openTestimonialModal(data);
      }
    });
  }

  function openTestimonialModal(data: typeof testimonials[0]) {
    if (modal && modalBody) {
      modalBody.innerHTML = `
        <div class="t-header">
          <div class="t-avatar">${data.initials}</div>
          <div class="t-info">
            <h4>${data.name}</h4>
            <p>${data.role}</p>
          </div>
        </div>
        <p class="t-quote">"${data.text}"</p>
      `;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scroll
    }
  }

  function closeTestimonialModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeModal) closeModal.addEventListener('click', closeTestimonialModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeTestimonialModal);

  // ═══════════════════════════════════════════════════════════
  // 3D TILT EFFECT FOR SERVICES
  // ═══════════════════════════════════════════════════════════
  const serviceCards = document.querySelectorAll<HTMLElement>('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const dx = x - xc;
      const dy = y - yc;
      
      // Tilt Strength
      const tiltX = (dy / yc) * -6; // Max 6deg
      const tiltY = (dx / xc) * 6;  // Max 6deg
      
      card.style.transform = `translateY(-10px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `translateY(0) rotateX(0) rotateY(0)`;
    });
  });

  // Also observe contact and project section backgrounds
  const contact = document.querySelector('.contact');
  if (contact) observer.observe(contact);
  
  const projectsSection = document.getElementById('projects');
  if (projectsSection) observer.observe(projectsSection);

  /* ─────────────────────────────────────────────────────────
     4.  FLOATING TAGS — APPEAR WITH STAGGER
  ───────────────────────────────────────────────────────── */
  const ftags = document.querySelectorAll<HTMLElement>('.ftag');
  ftags.forEach((tag, i) => {
    setTimeout(() => tag.classList.add('visible'), 900 + i * 160);
  });

  /* ─────────────────────────────────────────────────────────
     5.  MOUSE PARALLAX (desktop)
  ───────────────────────────────────────────────────────── */
  const portrait = document.getElementById('hero-portrait') as HTMLImageElement | null;
  const blob1    = document.querySelector<HTMLElement>('.blob-1');
  const blob2    = document.querySelector<HTMLElement>('.blob-2');

  if (window.innerWidth > 1024) {
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx; // -1 … 1
        const dy = (e.clientY - cy) / cy;

        // Portrait subtle shift
        if (portrait) {
          portrait.style.transform = `translate(${dx * -8}px, ${dy * -8}px)`;
        }

        // Blobs drift opposite direction
        if (blob1) blob1.style.transform = `translate(${dx * 18}px, ${dy * 12}px)`;
        if (blob2) blob2.style.transform = `translate(${dx * -12}px, ${dy * 18}px)`;

        ticking = false;
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     6.  SCROLL PARALLAX on portrait
  ───────────────────────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    const sv = window.scrollY;
    if (portrait && window.innerWidth > 768) {
      portrait.style.transform = `translateY(${sv * 0.12}px)`;
    }
  }, { passive: true });

  /* ─────────────────────────────────────────────────────────
     7.  CLEAN UP on page unload
  ───────────────────────────────────────────────────────── */
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(raf);
  });

  /* ─────────────────────────────────────────────────────────
     8.  TYPEWRITER ANIMATION
  ───────────────────────────────────────────────────────── */
  const typewriterText = document.getElementById('typewriter');
  const roles = [
    "AI/ML Engineer",
    "Software Engineer",
    "Data Scientist",
    "Data Analyst"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 200;

  function handleTypewriter() {
    const currentFullText = roles[roleIdx];
    
    if (isDeleting) {
      charIdx--;
      typeSpeed = 50;
    } else {
      charIdx++;
      typeSpeed = 150;
    }

    if (typewriterText) {
      typewriterText.textContent = currentFullText.substring(0, charIdx);
    }

    if (!isDeleting && charIdx === currentFullText.length) {
      isDeleting = true;
      typeSpeed = 1500; // Pause at end
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 200;
    }

    setTimeout(handleTypewriter, typeSpeed);
  }

  if (typewriterText) {
    handleTypewriter();
  }

  /* ─────────────────────────────────────────────────────────
     9.  HERO INTERACTIVE CURSOR BUBBLE
  ───────────────────────────────────────────────────────── */
  const heroBubble = document.getElementById('hero-cursor-bubble');
  // Theme toggle logic
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  // Make dark theme the default on first load
  if (!currentTheme) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggle?.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });

  const heroSection = document.getElementById('home');
  const ctaButtons = document.querySelectorAll('.hero-actions a');

  if (heroBubble && heroSection) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let bubbleX = mouseX;
    let bubbleY = mouseY;
    let currentScale = 0;
    let targetScale = 0;
    let isHoveringHero = false;

    // Linear interpolation for smooth lag effect
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animate bubble position
    function animateBubble() {
      if (isHoveringHero && heroBubble) {
        bubbleX = lerp(bubbleX, mouseX, 0.12);
        bubbleY = lerp(bubbleY, mouseY, 0.12);
        
        targetScale = heroBubble.classList.contains('hidden-by-button') ? 0.6 : 1;
        currentScale = lerp(currentScale, targetScale, 0.15);

        // Center the bubble on the cursor using translate3d for performance
        heroBubble.style.transform = `translate3d(calc(${bubbleX}px - 50%), calc(${bubbleY}px - 50%), 0) scale(${currentScale})`;
      }
      requestAnimationFrame(animateBubble);
    }
    animateBubble();

    // Show/Hide based on Hero section hover
    heroSection.addEventListener('mouseenter', () => {
      isHoveringHero = true;
      heroBubble.classList.add('visible');
      // Snap to cursor immediately on enter to prevent flying in from afar
      bubbleX = mouseX;
      bubbleY = mouseY;
    });

    heroSection.addEventListener('mouseleave', () => {
      isHoveringHero = false;
      heroBubble.classList.remove('visible');
    });

    // Handle CTA button hovers
    ctaButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        heroBubble.classList.add('hidden-by-button');
      });
      btn.addEventListener('mouseleave', () => {
        heroBubble.classList.remove('hidden-by-button');
      });
    });

    // Handle bubble click (clicks pass through to heroSection)
    heroSection.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      // Do not trigger if the user directly clicked a button or link
      if (!target.closest('a') && !target.closest('button')) {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
    // About Section Laptop Parallax
    const aboutSection = document.getElementById('about');
    const laptop3d     = document.querySelector<HTMLElement>('.laptop-3d');
    
    if (aboutSection && laptop3d) {
      aboutSection.addEventListener('mousemove', (e) => {
        const rect = aboutSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation (-15 to 15 degrees)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Inverse for natural tilt
        const rotateY = ((x - centerX) / centerX) * 10;
        
        // Combine with base 3D transform (-18deg X, 22deg Y)
        laptop3d.style.transform = `rotateX(${rotateX - 18}deg) rotateY(${rotateY + 22}deg)`;
      });
      
      // Reset tilt on leave
      aboutSection.addEventListener('mouseleave', () => {
        laptop3d.style.transform = `rotateX(-18deg) rotateY(22deg)`;
      });
    }

    // Projects section logic
    const projects = [
      {
        id: 'swarakshak',
        title: 'Swarakshak',
        label: 'Legal AI System',
        description: 'An AI-powered legal assistant built on the Indian Constitution, leveraging RAG with vector search to retrieve relevant laws, generate confidence-based verdicts, and provide simplified explanations for real-world legal queries.',
        tech: ['RAG', 'FAISS', 'NLP', 'Legal AI'],
        color: 'linear-gradient(135deg, #ff5c35 0%, #ff8c42 100%)',
        image: '/Swarakshak.png',
        github: 'https://github.com/AkshatAwa/SwaRakshak'
      },
      {
        id: 'rainfall-prediction',
        title: 'Rainfall Prediction',
        label: 'Time Series Forecasting',
        description: 'A data-driven rainfall prediction system using SARIMAX to analyze historical weather patterns and forecast future rainfall trends with improved accuracy and seasonality awareness.',
        tech: ['Python', 'SARIMAX', 'Pandas', 'Matplotlib'],
        color: 'linear-gradient(135deg, #a88d6c 0%, #c4b095 100%)',
        image: '/Rainfall.png',
        github: 'https://github.com/AkshatAwa/AI-Rainfall-Prediction'
      },
      {
        id: 'car-booking',
        title: 'Wheelorent',
        label: 'Full Stack Web App',
        description: 'A modern car booking platform with real-time availability, dynamic pricing, and seamless booking experience. Designed with a focus on performance, user experience, and responsive design.',
        tech: ['React', 'Node.js', 'MySQL', 'REST API'],
        color: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
        image: '/car-booking.png',
        github: 'https://github.com/AkshatAwa/Wheelorent'
      },{
        id: 'ai-interviewer',
        title: 'Nquiro AI',
        label: 'AI Interview Assistant',
        description: 'An AI-powered interview assistant that simulates real interview scenarios, evaluates responses, and provides intelligent feedback using NLP and contextual understanding.',
        tech: ['NLP', 'LLM', 'React', 'Node.js'],
        color: 'linear-gradient(135deg, #603813 0%, #b29f94 100%)',
        image: '/aiinterview.png',
        github: 'https://github.com/AkshatAwa/nquiroAI'
      }
    ];

    let currentProject = 0;
    const projectTitle = document.getElementById('project-title');
    const projectLabel = document.getElementById('project-label');
    const projectDesc  = document.getElementById('project-desc');
    const projectTags  = document.getElementById('project-tags');
    const githubLink   = document.getElementById('project-github-link') as HTMLAnchorElement;
    const prevBtn      = document.getElementById('prev-project');
    const nextBtn      = document.getElementById('next-project');
    const stackBg      = document.querySelector<HTMLElement>('.project-stack-bg');
    const stackItems   = document.querySelectorAll<HTMLElement>('.stack-item');

    // Initialize stack images
    stackItems.forEach((item, idx) => {
      const img = item.querySelector('img');
      if (img && projects[idx]) {
        img.src = projects[idx].image;
        img.alt = projects[idx].title;
      }
    });

    function updateProjectUI() {
      const p = projects[currentProject];
      
      // Add changing class to trigger fade out
      const textElements = [projectTitle, projectLabel, projectDesc, projectTags];
      textElements.forEach(el => el?.classList.add('changing'));

      // Update stack items visual state immediately for the cards
      stackItems.forEach((item, idx) => {
        item.classList.remove('active', 'behind-1', 'behind-2', 'behind-3', 'hidden');
        const pos = (idx - currentProject + projects.length) % projects.length;
        
        if (pos === 0) item.classList.add('active');
        else if (pos === 1) item.classList.add('behind-1');
        else if (pos === 2) item.classList.add('behind-2');
        else if (pos === 3) item.classList.add('behind-3');
        else item.classList.add('hidden');
      });

      // Update background glow
      if (stackBg) {
        stackBg.style.background = `radial-gradient(circle, ${p.color.split(',')[1].trim()} 0%, transparent 70%)`;
      }

      // Wait for fade out to complete before changing text
      setTimeout(() => {
        if (projectTitle) projectTitle.textContent = p.title;
        if (projectLabel) projectLabel.textContent = p.label;
        if (projectDesc)  projectDesc.textContent  = p.description;
        if (githubLink)   githubLink.href = p.github;
        
        if (projectTags) {
          projectTags.innerHTML = p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
        }

        // Trigger fade in
        textElements.forEach(el => el?.classList.remove('changing'));
      }, 400); // Matches CSS transition duration
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        currentProject = (currentProject - 1 + projects.length) % projects.length;
        updateProjectUI();
      });
      nextBtn.addEventListener('click', () => {
        currentProject = (currentProject + 1) % projects.length;
        updateProjectUI();
      });
    }

    // Call initial update to sync everything
    updateProjectUI();

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    }, { passive: true });

    // Navbar fade on footer intersection
    const footer = document.querySelector('.site-footer');
    if (footer && navbar) {
      const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navbar.classList.add('navbar-hidden');
          } else {
            navbar.classList.remove('navbar-hidden');
          }
        });
      }, {
        threshold: 0.1, // Trigger when 10% of footer is visible
        rootMargin: '0px 0px 0px 0px'
      });
      footerObserver.observe(footer);
    }

    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for navbar height
            behavior: 'smooth'
          });

          // Update active state in navbar
          if (this.closest('.nav-links')) {
            document.querySelectorAll('.nav-links a').forEach(navLink => {
              navLink.classList.remove('active');
            });
            this.classList.add('active');
          }
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     10. THEMED CUSTOM CURSOR (scrollbar + theme already set in CSS)
  ───────────────────────────────────────────────────────── */
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const pointerFine = window.matchMedia?.('(pointer: fine)')?.matches ?? false;

  if (!prefersReducedMotion && pointerFine) {
    const cursorEl = document.createElement('div');
    cursorEl.className = 'custom-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorEl);

    let cursorRaf: number | null = null;
    let lastX = -100;
    let lastY = -100;

    const applyPosition = () => {
      cursorEl.style.setProperty('--x', `${lastX}px`);
      cursorEl.style.setProperty('--y', `${lastY}px`);
      cursorRaf = null;
    };

    const nativeCursorTargetSelector = 'input, textarea, select, [contenteditable="true"]';
    const hoverInteractiveSelector = 'a, button, [role="button"], [role="link"]';

    window.addEventListener('mousemove', (e) => {
      lastX = e.clientX;
      lastY = e.clientY;

      if (cursorRaf === null) {
        cursorRaf = window.requestAnimationFrame(applyPosition);
      }

      const target = e.target as Element | null;
      const inHero = !!target?.closest('#home');
      if (inHero) {
        cursorEl.classList.remove('is-visible', 'is-hovering');
        document.body.classList.add('use-native-cursor');
        return;
      }

      const nativeTarget = target?.closest(nativeCursorTargetSelector) as Element | null;
      const hoverTarget = target?.closest(hoverInteractiveSelector) as Element | null;

      const showCustomCursor = !nativeTarget;
      cursorEl.classList.toggle('is-visible', showCustomCursor);
      cursorEl.classList.toggle('is-hovering', !!hoverTarget && showCustomCursor);
      document.body.classList.toggle('use-native-cursor', !!nativeTarget);
    });

    window.addEventListener('mouseenter', () => {
      // Custom cursor will be shown immediately on first mousemove anyway,
      // but set it visible for a smoother start.
      cursorEl.classList.add('is-visible');
    });

    window.addEventListener('mouseleave', () => {
      cursorEl.classList.remove('is-visible', 'is-hovering');
      document.body.classList.remove('use-native-cursor');

      lastX = -100;
      lastY = -100;
      cursorEl.style.setProperty('--x', `${lastX}px`);
      cursorEl.style.setProperty('--y', `${lastY}px`);
    });
  }

});
