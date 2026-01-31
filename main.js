/* ========================================
   SEADAP SEANI MALIKA KITCHEN
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functions (all pages)
    initPreloader();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    
    // Initialize page-specific functions (only if elements exist)
    if (document.querySelector('.filter-btn')) initMenuFilter();
    if (document.getElementById('imageModal')) initImageZoom();
    if (document.querySelector('a[href^="#"]')) initSmoothScroll();
});

/* ========================================
   PRELOADER
   ======================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 1500);
    });
    
    // Fallback - hide preloader after 3 seconds max
    setTimeout(function() {
        preloader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }, 3000);
}

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when scrolling down
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   MENU FILTER
   ======================================== */
function initMenuFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Filter cards with animation
            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    card.style.display = 'block';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'all 0.4s ease';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ========================================
   SCROLL REVEAL ANIMATION
   ======================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.section-header, .about-content, .about-images, .menu-card, .gallery-item, .testimonial-card, .contact-info, .contact-map');
    
    // Add reveal class to elements
    reveals.forEach(el => {
        el.classList.add('reveal');
    });
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;
        
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    }
    
    // Check on load
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal, { passive: true });
}

/* ========================================
   ACTIVE NAV LINK ON SCROLL
   ======================================== */
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
}

/* ========================================
   IMAGE ZOOM MODAL
   ======================================== */
function initImageZoom() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = modal.querySelector('.modal-overlay');
    
    // Get all clickable images (menu cards + gallery items)
    const zoomImages = document.querySelectorAll('.menu-card-image img, .gallery-item img');
    
    zoomImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const imgSrc = this.src;
            const imgAlt = this.alt;
            
            // Try get title from menu card, fallback to alt text
            const menuCard = this.closest('.menu-card');
            const caption = menuCard ? menuCard.querySelector('.menu-card-title')?.textContent : imgAlt;
            
            modalImage.src = imgSrc;
            modalImage.alt = imgAlt;
            modalCaption.textContent = caption;
            
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    });
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

/* ========================================
   PARALLAX EFFECT (Optional - for hero)
   ======================================== */
function initParallax() {
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.float-item');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        floatingElements.forEach((el, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            el.style.transform = `translateY(${rate * direction * 0.2}px)`;
        });
    }, { passive: true });
}

/* ========================================
   COUNTER ANIMATION (For stats)
   ======================================== */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.innerText);
        const suffix = counter.innerText.includes('+') ? '+' : counter.innerText.includes('K') ? 'K+' : '';
        const isDecimal = counter.innerText.includes('.');
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = isDecimal ? target.toFixed(1) : target + suffix;
                clearInterval(timer);
            } else {
                counter.innerText = isDecimal ? current.toFixed(1) : Math.floor(current) + suffix;
            }
        }, duration / steps);
    });
}

/* ========================================
   IMAGE LAZY LOADING (Future use)
   ======================================== */
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ========================================
   FORM VALIDATION (Future use)
   ======================================== */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
            }
        }
    });
    
    return isValid;
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Debounce function for scroll events
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ========================================
   CONSOLE WELCOME MESSAGE
   ======================================== */
console.log('%c🦀 Seadap Seani Malika Kitchen', 'color: #FFD700; font-size: 24px; font-weight: bold;');
console.log('%cServis Molek, Tempat Seleso, Make Jeliro', 'color: #D4AF37; font-size: 14px;');
console.log('%cWebsite by Rudden', 'color: #888; font-size: 12px;');