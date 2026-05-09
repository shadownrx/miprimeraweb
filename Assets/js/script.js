
document.addEventListener('DOMContentLoaded', () => {
    
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('is-active');
        });
    }


    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const feedback = document.getElementById('feedback');
            const name = document.getElementById('username').value;
            const email = document.getElementById('email').value;


            if (name.trim().length < 3) {
                showFeedback("El nombre es demasiado corto.", "error");
                return;
            }

            if (!email.includes('@')) {
                showFeedback("Ingresa un email válido.", "error");
                return;
            }

    
            showFeedback(`¡Perfecto ${name}! Hemos recibido tu mensaje.`, "success");
            this.reset(); 
        });
    }
});


function showFeedback(message, type) {
    const el = document.getElementById('feedback');
    if (el) {
        el.textContent = message;
        el.className = `feedback-msg ${type}`; 
        el.style.display = "block";
    }
}