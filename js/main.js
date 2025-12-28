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
            const platform = videoContainer.getAttribute('data-platform') || 'youtube';

            if (videoId) {
                if (platform === 'google-drive') {
                    const iframe = document.createElement('iframe');
                    iframe.setAttribute('src', `https://drive.google.com/file/d/${videoId}/preview`);
                    iframe.setAttribute('allow', 'autoplay; fullscreen');
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    iframe.style.border = '0';
                    
                    // Clear container and append iframe
                    videoContainer.innerHTML = '';
                    videoContainer.appendChild(iframe);
                    videoContainer.classList.add('playing');
                } else {
                    // Default to YouTube
                    const iframe = document.createElement('iframe');
                    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                    iframe.setAttribute('allowfullscreen', '');
                    
                    // Clear container and append iframe
                    videoContainer.innerHTML = '';
                    videoContainer.appendChild(iframe);
                    videoContainer.classList.add('playing');
                }
            }
        });
    });

    // Visit Counter Logic
    // Visit Counter Logic
    const counterElement = document.getElementById('visit-counter');
    if (counterElement) {
        
        // Check if this session has already been counted
        const userSessionKey = 'jlm_session_recorded';
        const hasVisitedThisSession = sessionStorage.getItem(userSessionKey);

        // If visited, just GET the value. If new session, HIT (increment).
        const action = hasVisitedThisSession ? 'get' : 'hit';
        
        // We use the relative path to our Netlify Function
        const url = `/.netlify/functions/visit?action=${action}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.value !== undefined) {
                    counterElement.innerText = data.value;
                    counterElement.parentElement.style.opacity = '1';
                    
                    // Mark this session as counted
                    if (!hasVisitedThisSession) {
                        sessionStorage.setItem(userSessionKey, 'true');
                    }
                }
            })
            .catch(error => {
                console.error('Error with visit counter API:', error);
                counterElement.innerText = '--';
            });
    }
});
