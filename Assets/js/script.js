// ===== Three.js Scene Setup =====
let scene, camera, renderer, cubes = [];

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    // Camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x60a5fa, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create rotating cubes
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const positions = [
        { x: -2, y: 1, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 2, y: 1, z: 0 },
        { x: -1, y: -1, z: 0 },
        { x: 1, y: -1, z: 0 }
    ];

    positions.forEach((pos, index) => {
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(index / positions.length, 0.7, 0.6),
            emissive: new THREE.Color().setHSL(index / positions.length, 0.7, 0.3)
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(pos.x, pos.y, pos.z);
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        cube.userData = {
            rotationSpeed: { x: Math.random() * 0.01, y: Math.random() * 0.01 }
        };
        scene.add(cube);
        cubes.push(cube);
    });

    // Responsive handling
    window.addEventListener('resize', onWindowResize);

    // Animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate cubes
    cubes.forEach(cube => {
        cube.rotation.x += cube.userData.rotationSpeed.x;
        cube.rotation.y += cube.userData.rotationSpeed.y;
    });

    // Mouse interaction
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        camera.position.x = x * 2;
        camera.position.y = y * 2;
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// ===== Navigation & DOM =====
class App {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupContactForm();
        this.setupScrollEffects();
        this.initThreeJS();
    }

    setupNavigation() {
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.getElementById('nav-links');
        const navbar = document.querySelector('.navbar');

        if (mobileMenu) {
            mobileMenu.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenu.classList.toggle('is-active');
            });
        }

        // Close menu when link is clicked
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (mobileMenu) mobileMenu.classList.remove('is-active');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Input validation in real-time
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const formGroup = input.parentElement;
        const errorMsg = formGroup.querySelector('.error-msg');
        let isValid = true;
        let message = '';

        if (input.id === 'username') {
            if (input.value.trim().length < 3) {
                isValid = false;
                message = 'El nombre debe tener al menos 3 caracteres';
            }
        } else if (input.id === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                message = 'Por favor ingresa un email válido';
            }
        } else if (input.id === 'message') {
            if (input.value.trim().length < 10) {
                isValid = false;
                message = 'El mensaje debe tener al menos 10 caracteres';
            }
        }

        if (isValid) {
            formGroup.classList.remove('error');
            if (errorMsg) errorMsg.textContent = '';
        } else {
            formGroup.classList.add('error');
            if (errorMsg) errorMsg.textContent = message;
        }

        return isValid;
    }

    handleFormSubmit(event) {
        event.preventDefault();

        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        const isUsernameValid = this.validateInput(username);
        const isEmailValid = this.validateInput(email);
        const isMessageValid = this.validateInput(message);

        if (isUsernameValid && isEmailValid && isMessageValid) {
            this.showFeedback(`¡Gracias ${username.value}! Tu mensaje ha sido recibido. Te contactaremos pronto.`, 'success');
            event.target.reset();
            document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('error'));
        }
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.className = `feedback ${type}`;
            
            setTimeout(() => {
                feedback.className = 'feedback';
            }, 5000);
        }
    }

    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card, .skill-tag, .stat, .portfolio-item, .testimonial-card, .skill-bar').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });

        // Animate counters for statistics
        this.animateCounters();

        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const hero = document.querySelector('.hero');
            if (hero && window.scrollY < window.innerHeight) {
                hero.style.transform = `translateY(${window.scrollY * 0.5}px)`;
            }
        });
    }

    animateCounters() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber && !statNumber.dataset.animated) {
                        statNumber.dataset.animated = 'true';
                        const text = statNumber.textContent;
                        const finalValue = parseInt(text.replace(/[^0-9]/g, ''));
                        const suffix = text.replace(/[0-9]/g, '');
                        
                        this.countUp(statNumber, finalValue, suffix);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat').forEach(stat => {
            observer.observe(stat);
        });
    }

    countUp(element, finalValue, suffix) {
        let currentValue = 0;
        const increment = Math.ceil(finalValue / 50);
        const interval = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(interval);
            }
            element.textContent = currentValue + suffix;
        }, 30);
    }

    initThreeJS() {
        if (typeof THREE !== 'undefined') {
            initThreeJS();
        }
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});