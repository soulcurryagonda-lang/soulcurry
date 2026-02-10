document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';

            // Simple mobile menu styling injection for toggle
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = '#F9F5EA';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal, .section, .feature-card, .menu-card, .review-card');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        el.classList.add('reveal'); // Ensure they have the base class
        revealObserver.observe(el);
    });

    // --- Booking Form to WhatsApp ---
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('bookingDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('guestName').value.trim();
            const phone = document.getElementById('guestPhone').value.trim();
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;
            const guests = document.getElementById('guestCount').value;
            const special = document.getElementById('specialRequest').value.trim();

            // Format the date nicely
            const formattedDate = new Date(date).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Construct WhatsApp message (clean format without problematic emojis)
            let message = `*TABLE BOOKING REQUEST*\n`;
            message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
            message += `*Name:* ${name}\n`;
            message += `*Phone:* ${phone}\n`;
            message += `*Date:* ${formattedDate}\n`;
            message += `*Time:* ${time}\n`;
            message += `*Guests:* ${guests}\n`;
            if (special) {
                message += `*Special Request:* ${special}\n`;
            }
            message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
            message += `_Via Soul Curry Website_`;

            // Encode the message for URL
            const encodedMessage = encodeURIComponent(message);

            // Your actual WhatsApp number
            const whatsappNumber = '917498159749';

            // Open WhatsApp
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');

            // Optional: Show success feedback
            alert('Opening WhatsApp... Please send the message to confirm your booking!');
        });
    }

});
