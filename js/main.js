document.addEventListener('DOMContentLoaded', () => {
    console.log('JLM Mohammedia Website Loaded');
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); 
                // Add 'fade-in' class or handle visibility logic here if not added by default
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Video Playback Interaction (YouTube)
    const playButtons = document.querySelectorAll('.play-button');

    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const videoContainer = this.closest('.video-container');
            const videoId = videoContainer.getAttribute('data-video-id');

            if (videoId) {
                // Create iframe
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('allowfullscreen', '');
                
                // Clear container and append iframe
                videoContainer.innerHTML = '';
                videoContainer.appendChild(iframe);
                videoContainer.classList.add('playing');
            }
        });
    });

    // Visit Counter Logic
    const counterElement = document.getElementById('visit-counter');
    if (counterElement) {
        // Using a namespace unique to the site
        const NAMESPACE = 'jlm-enset-mohammedia-site'; 
        const KEY = 'visits';
        
        // Check if we already counted this session/user to avoid spamming hits on refresh (optional but good practice)
        // However, user asked "how many people entered", usually implies hits. 
        // We will just hit every time for simplicity as "page views", or use localStorage to limit.
        // Let's do a simple hit for every page text "entered".
        
        fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
            .then(response => response.json())
            .then(data => {
                counterElement.innerText = data.value;
                counterElement.parentElement.style.opacity = '1'; // Fade in
            })
            .catch(error => {
                console.error('Error with visit counter:', error);
                // Fallback to a localized simulated counter or just hide
                // For now, let's just show a default or localStorage fallback
                let localCount = localStorage.getItem('local_visit_count') || 0;
                localCount++;
                localStorage.setItem('local_visit_count', localCount);
                counterElement.innerText = localCount + " (local)";
            });
    }
});
