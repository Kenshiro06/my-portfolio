// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
updateDarkModeIcon(currentTheme);

darkModeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateDarkModeIcon(newTheme);

    // Add rotation animation
    darkModeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        darkModeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

function updateDarkModeIcon(theme) {
    const icon = darkModeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Smooth Scroll for Navigation Links
// Smooth Scroll for Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');

        // Only trigger smooth scroll for hash links on the same page
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
        // Otherwise, allow default navigation (e.g., to index.html or projects.html)
    });
});

// Fade-in Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 100) {
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

// Button Ripple Effect
document.querySelectorAll('.project-button').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Skill Bar Animation on Scroll
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fillBar 1.5s ease-out forwards';
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Parallax Effect for Background Shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add hover effect to cards (excluding the main 3D profile card)
document.querySelectorAll('.glass-effect:not(.profile-card)').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Physics-based Lanyard Card Effect
{
    const card = document.getElementById('profile-card');
    const container = document.getElementById('profile-container');
    const canvas = document.getElementById('lanyard-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    if (card && container && canvas && ctx) {

        let physics = {
            x: 0, // Offset from center
            y: 0,
            vx: 0,
            vy: 0,
            angle: 0,
            vAngle: 0,
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0
        };

        const config = {
            tension: 0.1,    // Spring tension
            friction: 0.9,   // Velocity decay
            gravity: 0,      // Gravity (0 for simpler center-pull spring, or high for pendulum)
            // Let's rely on tension to pull back to center (0,0) like a springy string
            stringLength: 100
        };

        // Resize canvas to match container
        function resizeCanvas() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Mouse Events
        card.addEventListener('mousedown', (e) => {
            physics.isDragging = true;
            // Calculate offset of mouse from card center to keep relative position
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            physics.dragStartX = e.clientX - cardCenterX;
            physics.dragStartY = e.clientY - cardCenterY;

            card.style.transition = 'none';
            card.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (physics.isDragging) {
                const rect = container.getBoundingClientRect();
                const containerCenterX = rect.left + rect.width / 2;
                const containerCenterY = rect.top + rect.height / 2;

                // Mouse position relative to container center
                let targetX = e.clientX - containerCenterX;
                let targetY = e.clientY - containerCenterY;

                // Adjust by the drag start offset so card doesn't jump to mouse center
                // But generally users want to grab the point they clicked. 
                // For simplicity, let's just track the mouse directly gives a "magnetic" feel
                // Or better:
                physics.x = targetX;
                physics.y = targetY;
            }
        });

        window.addEventListener('mouseup', () => {
            if (physics.isDragging) {
                physics.isDragging = false;
                card.style.cursor = 'grab';
                // Give it a little release flick? 
                // Velocity is inferred from previous frames in a real engine 
                // but here we just let spring take over from current Pos.
            }
        });

        // Loop
        function animate() {
            if (!physics.isDragging) {
                // Spring force to return to (0,0)
                // We use a stronger tension for "snappy" return but good damping
                const tension = 0.05;
                const friction = 0.92;

                const ax = -tension * physics.x;
                const ay = -tension * physics.y;

                physics.vx += ax;
                physics.vy += ay;

                physics.vx *= friction;
                physics.vy *= friction;

                physics.x += physics.vx;
                physics.y += physics.vy;

                // Stop micro-movements
                if (Math.abs(physics.vx) < 0.01 && Math.abs(physics.vy) < 0.01 && Math.abs(physics.x) < 0.1 && Math.abs(physics.y) < 0.1) {
                    physics.vx = 0; physics.vy = 0; // physics.x = 0; physics.y = 0;
                }
            } else {
                physics.vx = 0;
                physics.vy = 0;
            }

            // Sway Angle logic
            const targetAngle = -physics.x * 0.1;
            physics.vAngle += (targetAngle - physics.angle) * 0.1;
            physics.vAngle *= 0.9;
            physics.angle += physics.vAngle;

            // Apply Transform
            const rotateX = -physics.y * 0.05;
            card.style.transform = `translate(calc(-50% + ${physics.x}px), calc(-50% + ${physics.y}px)) rotate(${physics.angle}deg) rotateX(${rotateX}deg)`;

            // Draw String
            if (ctx && canvas.width > 0) {
                const anchorX = canvas.width / 2;
                const anchorY = 0;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                const cardX = centerX + physics.x;
                const cardY = centerY + physics.y;

                const rad = physics.angle * Math.PI / 180;
                // Clip/String Attachment Point relative to card center
                // It is at the top of the card + a bit up for the clip loop
                // CSS top is -20px. Card height ~500px.
                // Center to Top = 250px. 
                // Loop is at roughly Y = -260px in local space

                const clipLocalX = 0;
                // We need to measure exact height for perfect alignment, but approximation is fine for visual
                const cardHeight = card.offsetHeight || 500;
                const clipLocalY = -(cardHeight / 2 + 15);

                const clipWorldX = cardX + (clipLocalX * Math.cos(rad) - clipLocalY * Math.sin(rad));
                const clipWorldY = cardY + (clipLocalX * Math.sin(rad) + clipLocalY * Math.cos(rad));

                // --- Detailed Lanyard String ---
                const stringColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#4b5563';
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#4f46e5';

                // 1. Draw Double-Braided String
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Create a gradient for the string
                const gradient = ctx.createLinearGradient(anchorX, anchorY, clipWorldX, clipWorldY);
                gradient.addColorStop(0, stringColor);
                gradient.addColorStop(0.5, accentColor);
                gradient.addColorStop(1, stringColor);

                ctx.strokeStyle = gradient;
                ctx.globalAlpha = 0.8;

                // Draw two paths slightly offset to look like a thick braided lanyard
                const offset = 2;

                // Left strand
                ctx.beginPath();
                ctx.moveTo(anchorX - offset, anchorY);
                ctx.quadraticCurveTo(anchorX - offset, (anchorY + clipWorldY) / 2, clipWorldX - offset, clipWorldY);
                ctx.stroke();

                // Right strand
                ctx.beginPath();
                ctx.moveTo(anchorX + offset, anchorY);
                ctx.quadraticCurveTo(anchorX + offset, (anchorY + clipWorldY) / 2, clipWorldX + offset, clipWorldY);
                ctx.stroke();

                // 2. Draw Connection "Knot" or Metal Crimp
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = '#94a3b8'; // Silver/Metal color
                ctx.beginPath();
                // A small rectangle/rounded box for the metal crimp
                ctx.roundRect(clipWorldX - 6, clipWorldY - 12, 12, 10, 2);
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // 3. Draw Detailed Clip Circle (The Ring)
                ctx.strokeStyle = '#64748b';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(clipWorldX, clipWorldY, 6, 0, Math.PI * 2);
                ctx.stroke();

                // Inner shine on the ring
                ctx.strokeStyle = '#f8fafc';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(clipWorldX - 1, clipWorldY - 1, 3, 0, Math.PI);
                ctx.stroke();
            }



            requestAnimationFrame(animate);
        }

        animate();
    }
}

// Typing Effect for Profile Title (Optional Enhancement)
const profileTitle = document.querySelector('.profile-title');
if (profileTitle) {
    const text = profileTitle.textContent;
    profileTitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            profileTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// Console message for developers
console.log('%c👋 Welcome to my Portfolio!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'color: #764ba2; font-size: 14px;');
