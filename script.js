document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Toggling Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to DARK.
    // NOTE: For file:// URLs, this may not read/write, but it works when hosted.
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // The dark-theme class is already added to the <body> in index.html.
    // We only need to remove it IF the user explicitly saved a 'light' preference.
    if (savedTheme === 'dark') {
        // Ensure icon is correct for dark mode (the sun icon)
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    } else {
        // If 'light' preference is saved (only works on a server), override the HTML default.
        body.classList.remove('dark-theme');
        // Ensure icon is correct for light mode (the moon icon)
        themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');

        // Update local storage (will only work when hosted)
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);

        // Update button icon
        const icon = themeToggle.querySelector('i');
        if (currentTheme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });


    // --- Scroll-Spy Active Link Highlighting ---
    const sections = document.querySelectorAll("main section");
    const navLinks = document.querySelectorAll(".nav-right-links a");

    // The logic to apply the 'active' class to the navigation link
    const highlightLink = () => {
        let current = '';

        // Iterate backward to find the section closest to the top of the viewport
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Subtracting a value (e.g., 120) helps account for the fixed header
            if (window.scrollY >= sectionTop - 120) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    };

    // Run once on load and every time the user scrolls
    window.addEventListener('scroll', highlightLink);
    highlightLink(); // Initial call to set active link on load


    // --- Gallery Slider Logic (Optional) ---
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    if (sliderTrack) {
        const updateSlider = () => {
            const slideWidth = slides[0].clientWidth;
            sliderTrack.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        };

        const goToPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateSlider();
        };

        const goToNext = () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        };

        prevBtn.addEventListener('click', goToPrev);
        nextBtn.addEventListener('click', goToNext);

        // Recalculate slider position on window resize
        window.addEventListener('resize', updateSlider);
    }
});