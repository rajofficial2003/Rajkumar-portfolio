document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. DYNAMIC NAVIGATION EFFECT (STICKY & SCROLL)
  // ==========================================
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case user refreshed part-way down

  // ==========================================
  // 2. MOBILE HAMBURGER MENU DRAWER
  // ==========================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  mobileToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close mobile drawer on link click
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ==========================================
  // 3. REACTIVE CONSTELLATION CANVAS BACKGROUND
  // ==========================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 1;
        this.baseColor = Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(168, 85, 247, ';
        this.alpha = Math.random() * 0.3 + 0.1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor + this.alpha + ')';
        ctx.fill();
      }

      update() {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Boundary checks
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Interaction with mouse (gentle push away)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 1.5;
            this.y += (dy / distance) * force * 1.5;
          }
        }
      }
    }

    const initParticles = () => {
      particles = [];
      const density = Math.floor((canvas.width * canvas.height) / 11000);
      const particleCount = Math.min(density, 120); // Cap it for ultra-performance
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw links between nearby particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 110) {
            const alpha = (110 - dist) / 110 * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    };

    // Events
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animateParticles();
  }

  // ==========================================
  // 4. ANIMATED TYPEWRITER HERO COMPONENT
  // ==========================================
  const typingSpan = document.querySelector('.typing-text');
  if (typingSpan) {
    const roles = [
      'Full Stack Web Developer',
      'React.js & Vite Specialist',
      'Firebase & SQL Architect',
      'Modern UI/UX Developer'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
      const currentRole = roles[roleIdx];
      
      if (isDeleting) {
        typingSpan.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 50; // Deletes faster
      } else {
        typingSpan.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 100; // Natural typing speed
      }

      if (!isDeleting && charIdx === currentRole.length) {
        // Pause at full word
        isDeleting = true;
        typingSpeed = 2000; 
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next word
      }

      setTimeout(typeEffect, typingSpeed);
    };

    setTimeout(typeEffect, 1000); // Start typing after 1s delay
  }

  // ==========================================
  // 5. ACTIVE NAV SECTIONS SCROLL TRACKER
  // ==========================================
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px', // Trigger when section occupies core viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // ==========================================
  // 6. FILTERABLE PROJECTS DASHBOARD
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-wrapper');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Toggle active states on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Dynamic opacity-scale structural filters
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ==========================================
  // 7. GLOWING CONTACT FORM VALIDATION & SUCCESS
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const successOverlay = document.querySelector('.form-success-overlay');
  const resetFormBtn = document.getElementById('reset-form-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather input values
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // Super simple regex check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let isValid = true;

      // Validate inputs
      [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ef4444'; // Red outline on empty fields
          isValid = false;
        } else {
          input.style.borderColor = '';
        }
      });

      if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
        emailInput.style.borderColor = '#ef4444';
        isValid = false;
      }

      if (!isValid) return;

      // Enter loading state on submit button
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <div class="btn-spinner"></div>`;

      // Add a CSS loading spinner helper inside the button
      const style = document.createElement('style');
      style.innerHTML = `
        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px dashed #030408;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      // Simulate network request duration
      setTimeout(() => {
        // Show the success panel beautifully
        successOverlay.classList.add('active');
        
        // Reset states
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        contactForm.reset();
      }, 1500);
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      successOverlay.classList.remove('active');
    });
  }

});
