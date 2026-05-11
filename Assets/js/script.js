/**
 * Salvador Juarez Portfolio Logic
 * Includes: Three.js Particles, Custom Cursor, Scroll Animations, Form Handling
 */

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupThreeJS();
        this.setupCursorGlow();
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupCounters();
        this.setupForm();
        this.handleResize();
    }

    // ===== Three.js Background (Particles) =====
    setupThreeJS() {
        const container = document.getElementById('canvas-container');
        if (!container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        // Create Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 1500;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 15;
            colors[i] = Math.random();
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            this.particles.rotation.y += 0.001;
            this.particles.rotation.x += 0.0005;
            
            // Interaction with mouse
            if (this.mouseX) {
                this.particles.rotation.y += (this.mouseX * 0.05 - this.particles.rotation.y) * 0.05;
                this.particles.rotation.x += (this.mouseY * 0.05 - this.particles.rotation.x) * 0.05;
            }

            this.renderer.render(this.scene, this.camera);
        };

        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) - 0.5;
            this.mouseY = (e.clientY / window.innerHeight) - 0.5;
        });

        animate();
    }

    // ===== Custom Cursor Glow =====
    setupCursorGlow() {
        const glow = document.querySelector('.cursor-glow');
        if (!glow) return;

        window.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ===== Navigation =====
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.getElementById('nav-links');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled', 'glass');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        if (mobileMenu) {
            mobileMenu.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            });
        }
    }

    // ===== Scroll Animations =====
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.glass-card, .section-header, .about-image-side, .about-text-side, .portfolio-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });

        // CSS Inject for animation
        const style = document.createElement('style');
        style.innerHTML = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== Stats Counter =====
    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    this.animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 1 });

        counters.forEach(c => observer.observe(c));
    }

    animateCounter(el, target) {
        let count = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const update = () => {
            count += increment;
            if (count < target) {
                el.innerText = Math.ceil(count);
                requestAnimationFrame(update);
            } else {
                el.innerText = target + '+';
            }
        };
        update();
    }

    // ===== Form Handling =====
    setupForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const feedback = document.getElementById('feedback');
            
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Enviando...';
            btn.disabled = true;

            // Simulate API Call
            setTimeout(() => {
                btn.innerHTML = '¡Mensaje Enviado!';
                feedback.innerText = '¡Gracias! Me pondré en contacto contigo pronto.';
                feedback.style.color = '#10b981';
                form.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    feedback.innerText = '';
                }, 3000);
            }, 1500);
        });
    }

    handleResize() {
        window.addEventListener('resize', () => {
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    }
}

// Start App
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    
    // Lucide Icons fallback
    if (window.lucide) {
        window.lucide.createIcons();
    }
});