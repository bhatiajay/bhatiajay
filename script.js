document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Toggling Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to DARK.
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // The dark-theme class is already added to the <body> in index.html.
    // We only need to remove it IF the user explicitly saved a 'light' preference.
    if (savedTheme === 'dark') {
        // Ensure icon is correct for dark mode (the sun icon)
        body.classList.add('dark-theme'); // Ensure class is present
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    } else {
        // If 'light' preference is saved, override the HTML default.
        body.classList.remove('dark-theme');
        // Ensure icon is correct for light mode (the moon icon)
        themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');

        // Update local storage
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


    // Scroll-Spy Active Link Highlighting
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


    // Gallery Slider Logic 
    const sliderTrack = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    if (sliderTrack) {
        const updateSlider = () => {
            const currentSlides = document.querySelectorAll('.slide'); // Re-evaluate slide list
            if (currentSlides.length > 0) {
                const slideWidth = currentSlides[0].clientWidth;
                sliderTrack.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
            }
        };

        const goToPrev = () => {
            const currentSlides = document.querySelectorAll('.slide');
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentSlides.length - 1;
            updateSlider();
        };

        const goToNext = () => {
            const currentSlides = document.querySelectorAll('.slide');
            currentIndex = (currentIndex < currentSlides.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        };

        prevBtn.addEventListener('click', goToPrev);
        nextBtn.addEventListener('click', goToNext);

        // Recalculate slider position on window resize
        window.addEventListener('resize', updateSlider);
    }
    
    // Hobby Video toggle logic
    // Data for all video-linked hobby cards
    const videoCards = [
        { id: 'wrestling-card', src: 'assets/videos/miaaWrestlingMeet.mp4', caption: 'At one of inter-school wrestling meets 🤼‍♂️' },
        { id: 'piano-card', src: 'assets/videos/playingPiano.mp4', caption: 'Playing Rondo Alla Turca (Turkish March) and the Merry Go Round of Life (Howl\'s Moving Castle) 🎹' },
        { id: 'guitar-card', src: 'assets/videos/playingGuitar.mp4', caption: 'Playing Malagueña (Ernesto Lecuona) on the acoustic guitar 🎸' }
    ];

    const videoContainer = document.getElementById('video-player-container');
    const videoElement = document.getElementById('hobby-video-player');
    const videoCaption = document.getElementById('video-caption');

    // Variable to track the currently loaded video source
    let currentVideoSrc = '';

    /**
     * Handles the click event for all video-linked hobby cards.
     * Toggles visibility, updates source, and controls playback.
     */
    function handleVideoCardClick(e, cardData) {
        e.preventDefault(); 
        
        // Check if the same video is currently active
        const isCurrentlyActive = videoContainer.classList.contains('active') && currentVideoSrc === cardData.src;

        // Reset and hide the current video if it's visible, or if a different one is loaded
        if (videoContainer.classList.contains('active')) {
             videoElement.pause();
             videoElement.currentTime = 0;
             videoContainer.classList.remove('active');

             // If the same video was clicked, we are done (it's now hidden)
             if (isCurrentlyActive) {
                currentVideoSrc = ''; // Clear source state
                return; 
             }
        }
        
        // If we reach here, a new video needs to be loaded and shown.
        // 1. Update source and caption
        // We update the src attribute of the source element *inside* the video tag
        videoElement.querySelector('source').src = cardData.src;
        videoElement.load();
        videoCaption.textContent = cardData.caption;
        currentVideoSrc = cardData.src; // Set new source state

        // 2. Show the container and play
        // use a small delay to ensure the element is visible before trying to play.
        setTimeout(() => {
            videoContainer.classList.add('active');
            
            videoElement.play().catch(error => {
                // This usually happens if the browser blocks autoplay without user interaction
                console.log("Video playback interrupted (likely user interaction required):", error);
            });
            
            // Scroll to the video container
            videoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50); // Small delay to allow class change to apply
    }

    // Attach the event listeners to all video cards
    videoCards.forEach(cardData => {
        const cardElement = document.getElementById(cardData.id);
        if (cardElement) {
            cardElement.addEventListener('click', (e) => handleVideoCardClick(e, cardData));
        }
    });
});