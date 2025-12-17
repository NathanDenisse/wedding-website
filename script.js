/**
 * Site Mariage Annabelle & Nathan
 * Code JavaScript optimisé et simplifié
 */

(function () {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================

    const CONFIG = {
        navbarSelector: '.navbar',
        mobileMenuSelector: '#mobile-menu-toggle',
        navMenuSelector: '#nav-menu',
        carouselSelector: '.carousel-container',
        timelineItemSelector: '.timeline-item',
        photoItemSelector: '.photo-item img',
        sectionSelector: '.section',
        langBtnSelector: '.lang-btn',
        revealBtnSelector: '.reveal-next',
        scrollThreshold: 50,
        animationDelay: 100,
        swipeThreshold: 50
    };

    // ============================================
    // UTILITAIRES
    // ============================================

    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

    // ============================================
    // MODULE: Gestion des langues
    // ============================================

    const LanguageManager = {
        init() {
            const langButtons = $$(CONFIG.langBtnSelector);
            const storedLang = localStorage.getItem('preferredLanguage') || 'fr';

            this.setLanguage(storedLang);

            langButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const lang = btn.dataset.lang;
                    this.setLanguage(lang);
                    localStorage.setItem('preferredLanguage', lang);
                });
            });
        },

        setLanguage(lang) {
            document.body.classList.remove('lang-fr', 'lang-en');
            document.body.classList.add(`lang-${lang}`);

            $$(CONFIG.langBtnSelector).forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });
        }
    };

    // ============================================
    // MODULE: Navigation
    // ============================================

    const Navigation = {
        navbar: null,
        mobileToggle: null,
        navMenu: null,

        init() {
            this.navbar = $(CONFIG.navbarSelector);
            this.mobileToggle = $(CONFIG.mobileMenuSelector);
            this.navMenu = $(CONFIG.navMenuSelector);

            if (!this.navbar) return;

            this.setupSmoothScroll();
            this.setupScrollEffect();
            this.setupMobileMenu();
            this.setupActiveSection();
        },

        setupSmoothScroll() {
            $$('.nav-link, .scroll-btn').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const target = $(targetId);

                    if (target) {
                        const offset = this.navbar.offsetHeight;
                        const position = target.offsetTop - offset;
                        window.scrollTo({ top: position, behavior: 'smooth' });

                        // Fermer le menu mobile si ouvert
                        this.closeMobileMenu();
                    }
                });
            });
        },

        setupScrollEffect() {
            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const scrollTop = window.pageYOffset;
                        this.navbar.style.boxShadow = scrollTop > CONFIG.scrollThreshold
                            ? '0 4px 15px rgba(0, 0, 0, 0.12)'
                            : '0 2px 10px rgba(0, 0, 0, 0.08)';
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        },

        setupMobileMenu() {
            if (!this.mobileToggle || !this.navMenu) return;

            this.mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            document.addEventListener('click', (e) => {
                if (this.navMenu.classList.contains('active') &&
                    !this.navMenu.contains(e.target) &&
                    !this.mobileToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) this.closeMobileMenu();
            });
        },

        toggleMobileMenu() {
            const isActive = this.navMenu.classList.toggle('active');
            this.mobileToggle.classList.toggle('active', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        },

        closeMobileMenu() {
            this.navMenu?.classList.remove('active');
            this.mobileToggle?.classList.remove('active');
            document.body.style.overflow = '';
        },

        setupActiveSection() {
            const sections = $$('section[id]');
            const navLinks = $$('.nav-link');

            const updateActiveSection = () => {
                const scrollPos = window.pageYOffset + 150;

                sections.forEach(section => {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    const id = section.id;

                    if (scrollPos >= top && scrollPos < top + height) {
                        navLinks.forEach(link => {
                            link.classList.toggle('active-section',
                                link.getAttribute('href') === `#${id}`);
                        });
                    }
                });
            };

            window.addEventListener('scroll', updateActiveSection, { passive: true });
            updateActiveSection();
        }
    };

    // ============================================
    // MODULE: Carousel
    // ============================================

    const CarouselManager = {
        carousels: new Map(),

        init() {
            $$('.carousel-track[data-carousel]').forEach(track => {
                const item = track.closest('.timeline-item');
                if (!item || !item.classList.contains('hidden')) {
                    this.initCarousel(track.dataset.carousel);
                }
            });
        },

        initCarousel(carouselId) {
            const track = $(`[data-carousel="${carouselId}"]`);
            if (!track) return;

            const container = track.closest('.carousel-container');
            if (!container) return;

            const images = $$('.carousel-img', track);
            if (images.length === 0) return;

            const prevBtn = $('.carousel-btn.prev', container);
            const nextBtn = $('.carousel-btn.next', container);
            const dotsContainer = $('.carousel-dots', container);

            // Générer les dots dynamiquement
            if (dotsContainer) {
                dotsContainer.innerHTML = images.map((_, i) =>
                    `<span class="dot${i === 0 ? ' active' : ''}"></span>`
                ).join('');
            }

            const dots = dotsContainer ? $$('.dot', dotsContainer) : [];
            let currentIndex = 0;
            let touchStartX = 0;

            // Initialiser les images - la première est visible, les autres cachées
            images.forEach((img, i) => {
                img.style.opacity = i === 0 ? '1' : '0';
                img.style.zIndex = i === 0 ? '2' : '1';
                img.classList.toggle('active', i === 0);
            });

            const showImage = (index) => {
                images.forEach((img, i) => {
                    const isActive = i === index;
                    img.style.opacity = isActive ? '1' : '0';
                    img.style.zIndex = isActive ? '2' : '1';
                    img.classList.toggle('active', isActive);
                });

                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
                currentIndex = index;
            };

            const next = () => showImage((currentIndex + 1) % images.length);
            const prev = () => showImage((currentIndex - 1 + images.length) % images.length);

            // Event listeners
            nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); next(); });
            prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prev(); });

            dots.forEach((dot, i) => {
                dot.addEventListener('click', (e) => { e.stopPropagation(); showImage(i); });
            });

            // Support tactile
            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            track.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > CONFIG.swipeThreshold) {
                    diff > 0 ? next() : prev();
                }
            }, { passive: true });

            // Click sur image = lightbox
            images.forEach((img, i) => {
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    Lightbox.open(images.map(img => img.src), i);
                });
            });

            this.carousels.set(carouselId, { currentIndex, images, showImage });
        }
    };

    // ============================================
    // MODULE: Lightbox (unifié)
    // ============================================

    const Lightbox = {
        element: null,
        currentIndex: 0,
        images: [],

        open(images, startIndex = 0) {
            this.images = images;
            this.currentIndex = startIndex;

            this.element = document.createElement('div');
            this.element.className = 'photo-lightbox';
            this.element.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close">×</button>
                    <img class="lightbox-img" src="${images[startIndex]}" alt="Photo">
                </div>
                ${images.length > 1 ? `
                    <button class="lightbox-nav prev">‹</button>
                    <button class="lightbox-nav next">›</button>
                ` : ''}
            `;

            // Event listeners
            $('.lightbox-close', this.element).onclick = () => this.close();
            this.element.onclick = (e) => { if (e.target === this.element) this.close(); };

            if (images.length > 1) {
                $('.lightbox-nav.prev', this.element).onclick = (e) => { e.stopPropagation(); this.prev(); };
                $('.lightbox-nav.next', this.element).onclick = (e) => { e.stopPropagation(); this.next(); };
            }

            this.keyHandler = (e) => {
                if (e.key === 'Escape') this.close();
                else if (e.key === 'ArrowLeft') this.prev();
                else if (e.key === 'ArrowRight') this.next();
            };
            document.addEventListener('keydown', this.keyHandler);

            document.body.appendChild(this.element);
            document.body.style.overflow = 'hidden';
        },

        close() {
            if (this.element) {
                document.body.removeChild(this.element);
                document.body.style.overflow = '';
                document.removeEventListener('keydown', this.keyHandler);
                this.element = null;
            }
        },

        updateImage() {
            const img = $('.lightbox-img', this.element);
            if (img) img.src = this.images[this.currentIndex];
        },

        next() {
            if (this.images.length > 1) {
                this.currentIndex = (this.currentIndex + 1) % this.images.length;
                this.updateImage();
            }
        },

        prev() {
            if (this.images.length > 1) {
                this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
                this.updateImage();
            }
        }
    };

    // ============================================
    // MODULE: Animations
    // ============================================

    const Animations = {
        init() {
            this.setupSectionAnimations();
            this.setupPhotoAnimations();
            this.setupParallax();
            this.setupGalleryLightbox();
        },

        setupSectionAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

            $$(CONFIG.sectionSelector).forEach(section => {
                Object.assign(section.style, {
                    opacity: '0',
                    transform: 'translateY(30px)',
                    transition: 'opacity 0.8s ease, transform 0.8s ease'
                });
                observer.observe(section);
            });
        },

        setupPhotoAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) scale(1)';
                        }, i * CONFIG.animationDelay);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

            $$('.photo-item').forEach(item => {
                Object.assign(item.style, {
                    opacity: '0',
                    transform: 'translateY(30px) scale(0.95)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease'
                });
                observer.observe(item);
            });
        },

        setupParallax() {
            const hero = $('.hero');
            const heroContent = $('.hero-content');

            if (!hero || !heroContent) return;

            window.addEventListener('scroll', () => {
                const scrollPos = window.pageYOffset;
                const heroHeight = hero.offsetHeight;

                if (scrollPos < heroHeight) {
                    heroContent.style.transform = `translateY(${scrollPos * 0.3}px)`;
                    heroContent.style.opacity = 1 - (scrollPos / heroHeight) * 0.5;
                }
            }, { passive: true });
        },

        setupGalleryLightbox() {
            $$(CONFIG.photoItemSelector).forEach((img, i, imgs) => {
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    const allSrcs = imgs.map(img => img.src);
                    Lightbox.open(allSrcs, i);
                });
            });
        }
    };

    // ============================================
    // MODULE: Timeline Progressive Reveal
    // ============================================

    const TimelineReveal = {
        init() {
            $$(CONFIG.revealBtnSelector).forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.revealNext(btn);
                });
            });
        },

        revealNext(btn) {
            const container = btn.closest('.timeline-reveal-btn');
            const stepToReveal = container.dataset.reveals;
            const itemToReveal = $(`[data-step="${stepToReveal}"]`);

            if (!itemToReveal) return;

            // Afficher l'élément
            itemToReveal.classList.remove('hidden');
            itemToReveal.style.display = itemToReveal.classList.contains('timeline-end') ? 'block' : 'flex';
            itemToReveal.style.animation = 'fadeInTimeline 0.8s ease forwards';

            // Initialiser le carousel s'il y en a un
            const carouselTrack = $('[data-carousel]', itemToReveal);
            if (carouselTrack) {
                const carouselContainer = $('.carousel-container', itemToReveal);
                if (carouselContainer) {
                    carouselContainer.classList.add('visible');
                    Object.assign(carouselContainer.style, {
                        opacity: '1',
                        transform: 'translateY(0) scale(1)'
                    });
                }

                setTimeout(() => {
                    CarouselManager.initCarousel(carouselTrack.dataset.carousel);
                }, 200);
            }

            // Cacher le bouton actuel, afficher le suivant
            container.classList.add('hidden');
            const nextBtn = $(`.timeline-reveal-btn[data-reveals="${parseInt(stepToReveal) + 1}"]`);
            nextBtn?.classList.remove('hidden');

            // Scroll vers l'élément révélé
            setTimeout(() => {
                const navbar = $(CONFIG.navbarSelector);
                const navbarHeight = navbar?.offsetHeight || 80;
                const position = itemToReveal.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 50;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }, 300);
        }
    };

    // ============================================
    // INITIALISATION
    // ============================================

    document.addEventListener('DOMContentLoaded', () => {
        LanguageManager.init();
        Navigation.init();
        CarouselManager.init();
        Animations.init();
        TimelineReveal.init();
    });

})();
