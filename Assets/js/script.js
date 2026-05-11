/**
 * Salvador Juarez Portfolio Logic - Phase 2
 * Includes: Three.js Particles, Modal System, Scroll Progress, Active Links
 */

class PortfolioApp {
    constructor() {
        this.projectData = {
            education: {
                title: "EduFlow Platform",
                cat: "Education",
                desc: "Plataforma integral para la gestión educativa. Incluye portales para profesores y alumnos, seguimiento de asistencia, gestión de calificaciones y un sistema de recursos compartidos. Diseñado para modernizar la interacción en el aula.",
                tags: ["Next.js", "TypeScript", "Tailwind", "MongoDB"],
                gradClass: "p1",
                link: "https://github.com/shadownrx/education-app"
            },
            plurist: {
                title: "Plurist AI",
                cat: "AI & Content",
                desc: "Herramienta avanzada para la creación y edición de contenido generado por IA. Permite a los usuarios interactuar con modelos de IA tanto a través de código como de herramientas visuales, democratizando el acceso a la IA generativa.",
                tags: ["TypeScript", "AI SDK", "React", "Node.js"],
                gradClass: "p2",
                link: "https://github.com/shadownrx/plurist"
            },
            windows: {
                title: "Windows Web OS",
                cat: "UI/UX Experiment",
                desc: "Una simulación inmersiva del sistema operativo Windows dentro del navegador. Explora conceptos de gestión de ventanas, sistemas de archivos y UI reactiva en un entorno puramente web.",
                tags: ["TypeScript", "React", "CSS Grid", "Framer Motion"],
                gradClass: "p3",
                link: "https://github.com/shadownrx/windows"
            },
            pcn: {
                title: "PCN Social Network",
                cat: "Social Media",
                desc: "Red social dedicada a apasionados del desarrollo de software. Un espacio para colaborar, compartir conocimientos y conectar con otros profesionales del sector tecnológico.",
                tags: ["TypeScript", "Next.js", "PostgreSQL", "Prisma"],
                gradClass: "p1",
                link: "https://github.com/shadownrx/pcn-website"
            }
        };
        this.init();
    }

    init() {
        this.setupThreeJS();
        this.setupCursorGlow();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupCounters();
        this.setupForm();
        this.setupModal();
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

        this.isThreeJSRunning = true;
        const animate = () => {
            if (this.isThreeJSRunning) {
                requestAnimationFrame(animate);
                this.particles.rotation.y += 0.001;
                this.particles.rotation.x += 0.0005;
                
                if (this.mouseX) {
                    this.particles.rotation.y += (this.mouseX * 0.05 - this.particles.rotation.y) * 0.05;
                    this.particles.rotation.x += (this.mouseY * 0.05 - this.particles.rotation.x) * 0.05;
                }
                this.renderer.render(this.scene, this.camera);
            } else {
                requestAnimationFrame(animate);
            }
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

    // ===== Navigation & Scroll Progress =====
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const progressBar = document.querySelector('.scroll-progress');
        const navLinks = document.querySelectorAll('.nav-item');

        window.addEventListener('scroll', () => {
            // Navbar transparency
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Progress bar
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            if (progressBar) progressBar.style.width = scrolled + '%';

            // Active section highlighting
            this.updateActiveNavLink();
            
            // Performance: Pause Three.js if not in Hero
            this.isThreeJSRunning = window.scrollY < window.innerHeight;
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section, header');
        const navLinks = document.querySelectorAll('.nav-item');
        
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    // ===== Modal System =====
    setupModal() {
        const modal = document.getElementById('projectModal');
        const openButtons = document.querySelectorAll('.btn-open-modal');
        const closeButton = document.querySelector('.close-modal');

        openButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectItem = e.target.closest('.portfolio-item');
                const projectId = projectItem.getAttribute('data-project');
                this.fillModal(projectId);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (closeButton) closeButton.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    fillModal(id) {
        const data = this.projectData[id];
        if (!data) return;

        document.getElementById('modalTitle').innerText = data.title;
        document.getElementById('modalCat').innerText = data.cat;
        document.getElementById('modalDesc').innerText = data.desc;
        
        const gradient = document.getElementById('modalGradient');
        gradient.className = 'project-gradient ' + data.gradClass;

        const tagsContainer = document.getElementById('modalTags');
        tagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'modal-tag';
            span.innerText = tag;
            tagsContainer.appendChild(span);
        });

        // Set link
        const demoBtn = document.querySelector('#projectModal .btn-primary');
        if (demoBtn) demoBtn.href = data.link || "#";
    }

    // ===== Scroll Animations (Intersection Observer) =====
    setupScrollEffects() {
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
        style.innerHTML = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
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
    if (window.lucide) window.lucide.createIcons();
});