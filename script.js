// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Charger le thème sauvegardé ou utiliser le thème système
const savedTheme = localStorage.getItem('theme') || 'light';
body.classList.add(savedTheme + '-theme');

// Fonction pour basculer le thème
function toggleTheme() {
    body.classList.toggle('light-theme');
    body.classList.toggle('dark-theme');
    
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Navigation Scroll Effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            navMenu.classList.remove('active');
        }
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
});

// Observe processus steps
document.querySelectorAll('.processus-step').forEach(step => {
    observer.observe(step);
});

// Observe avantage cards
document.querySelectorAll('.avantage-card').forEach(card => {
    observer.observe(card);
});

// Timeline Animation
const timelineLine = document.querySelector('.timeline-line');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            timelineLine.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

if (timelineLine) {
    timelineObserver.observe(timelineLine);
}

// Stagger Animation for Service Cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Stagger Animation for Avantage Cards
const avantageCards = document.querySelectorAll('.avantage-card');
avantageCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// CTA Button Scroll
const ctaButton = document.getElementById('ctaButton');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const offsetTop = servicesSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

// Contact Button Scroll
const contactButton = document.getElementById('contactButton');
if (contactButton) {
    contactButton.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const offsetTop = contactSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

// Form Submission to Discord Webhook
const contactForm = document.getElementById('contactForm');
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1454928669838409760/4xC6zXx5UuxHvDV9ALClnHE5svuk6MkNxELIEOTmcmcqkMs337JQE6_b07psH3qhjvOQ';

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalText = submitButton.innerHTML;
        const originalDisabled = submitButton.disabled;
        
        // Désactiver le bouton et afficher le chargement
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Envoi en cours...</span>';
        
        // Créer le message Discord
        const discordMessage = {
            embeds: [{
                title: '📧 Nouveau message de contact HBC',
                color: 0x667eea,
                fields: [
                    {
                        name: '👤 Nom',
                        value: data.name || 'Non renseigné',
                        inline: true
                    },
                    {
                        name: '📧 Email',
                        value: data.email || 'Non renseigné',
                        inline: true
                    },
                    {
                        name: '🏷️ Type',
                        value: data.type === 'influenceur' ? '🎮 Influenceur / Créateur' : data.type === 'marque' ? '💼 Marque / Entreprise' : 'Non renseigné',
                        inline: true
                    },
                    {
                        name: '💬 Message',
                        value: data.message || 'Aucun message',
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'HBC - Hub Brand Connection'
                }
            }]
        };
        
        try {
            // Envoyer au webhook Discord
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discordMessage)
            });
            
            if (response.ok) {
                // Succès
                submitButton.innerHTML = '<span>Message envoyé ! ✓</span>';
                submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                
                // Reset form
                contactForm.reset();
                
                // Afficher une notification de succès
                showNotification('✅ Message envoyé avec succès !', 'success');
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = originalDisabled;
                }, 3000);
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error('Erreur:', error);
            submitButton.innerHTML = '<span>Erreur, réessayez</span>';
            submitButton.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            showNotification('❌ Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.style.background = '';
                submitButton.disabled = originalDisabled;
            }, 3000);
        }
    });
}

// Fonction pour afficher des notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Parallax Effect for Hero Background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Mouse Move Effect for Hero Cards
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.floating-card');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        cards.forEach((card, index) => {
            const speed = (index + 1) * 0.02;
            const x = (mouseX - 0.5) * 30 * speed;
            const y = (mouseY - 0.5) * 30 * speed;
            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Service Card Hover Effect Enhancement
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Dynamic Gradient Animation
const orbs = document.querySelectorAll('.gradient-orb');
orbs.forEach((orb, index) => {
    setInterval(() => {
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        orb.style.transform = `translate(${randomX}px, ${randomY}px) scale(${1 + Math.random() * 0.2})`;
    }, 5000 + index * 1000);
});

// Scroll Progress Indicator (optional)
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// Add active state to navigation links on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Countdown Timer
function initCountdown() {
    // Date cible : 30 jours à partir de maintenant (vous pouvez modifier cette date)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    targetDate.setHours(23, 59, 59, 999);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance < 0) {
            // Le compte à rebours est terminé
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    // Mettre à jour immédiatement
    updateCountdown();
    
    // Mettre à jour toutes les secondes
    setInterval(updateCountdown, 1000);
}

// Initialiser le compte à rebours
if (document.getElementById('countdown')) {
    initCountdown();
}


// Ajouter les animations pour la notification
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Observer pour les nouvelles sections
const remunerationCard = document.querySelector('.remuneration-card');
if (remunerationCard) {
    observer.observe(remunerationCard);
}

document.querySelectorAll('.email-card').forEach(card => {
    observer.observe(card);
});

// Console welcome message
console.log('%cHBC - Hub Brand Connection', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cBienvenue sur notre site ! 🚀', 'font-size: 14px; color: #764ba2;');

