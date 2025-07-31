// Enhanced Error Handling and Loading Management
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const heroVideo = document.getElementById('heroVideo');
    const videoFallback = document.querySelector('.video-fallback');
    let loadingTimeout;
    let resourcesLoaded = {
        video: false,
        images: false,
        fonts: false
    };

    // Show loading screen initially
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }

    // Set maximum loading time (10 seconds)
    loadingTimeout = setTimeout(() => {
        console.log('Loading timeout reached, showing page anyway');
        hideLoadingScreen();
    }, 10000);

    // Font loading check
    if (document.fonts) {
        document.fonts.ready.then(() => {
            resourcesLoaded.fonts = true;
            checkAllResourcesLoaded();
        });
    } else {
        // Fallback for browsers without Font Loading API
        setTimeout(() => {
            resourcesLoaded.fonts = true;
            checkAllResourcesLoaded();
        }, 2000);
    }

    // Video handling with timeout
    if (heroVideo) {
        let videoTimeout = setTimeout(() => {
            console.log('Video loading timeout, using fallback');
            handleVideoError();
        }, 5000);

        heroVideo.addEventListener('loadstart', function() {
            console.log('Video loading started');
        });

        heroVideo.addEventListener('canplay', function() {
            console.log('Video can play');
            clearTimeout(videoTimeout);
            heroVideo.classList.add('loaded');
            videoFallback.classList.add('hide');
            resourcesLoaded.video = true;
            checkAllResourcesLoaded();
        });

        heroVideo.addEventListener('error', handleVideoError);

        function handleVideoError() {
            console.log('Video failed to load, showing fallback');
            clearTimeout(videoTimeout);
            if (videoFallback) {
                videoFallback.classList.remove('hide');
            }
            resourcesLoaded.video = true;
            checkAllResourcesLoaded();
        }

        // Try to load video
        heroVideo.load();
    } else {
        resourcesLoaded.video = true;
    }

    // Enhanced image loading for team members
    const memberPhotos = document.querySelectorAll('.member-photo');
    let imagesLoadedCount = 0;
    const totalImages = memberPhotos.length;

    if (totalImages === 0) {
        resourcesLoaded.images = true;
        checkAllResourcesLoaded();
    }

    memberPhotos.forEach((photo, index) => {
        const imageLoading = photo.parentElement.querySelector('.image-loading');
        const placeholder = photo.parentElement.querySelector('.image-placeholder');
        
        // Set timeout for each image
        const imageTimeout = setTimeout(() => {
            console.log(`Image ${index + 1} timeout, showing placeholder`);
            handleImageError(photo, imageLoading, placeholder);
        }, 3000);

        photo.addEventListener('load', function() {
            clearTimeout(imageTimeout);
            console.log(`Image ${index + 1} loaded successfully`);
            this.classList.add('loaded');
            if (imageLoading) {
                imageLoading.classList.add('hidden');
            }
            imagesLoadedCount++;
            if (imagesLoadedCount === totalImages) {
                resourcesLoaded.images = true;
                checkAllResourcesLoaded();
            }
        });

        photo.addEventListener('error', function() {
            clearTimeout(imageTimeout);
            handleImageError(this, imageLoading, placeholder);
        });

        function handleImageError(img, loading, placeholder) {
            console.log(`Image failed to load: ${img.src}`);
            if (loading) {
                loading.classList.add('hidden');
            }
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
            img.style.display = 'none';
            imagesLoadedCount++;
            if (imagesLoadedCount === totalImages) {
                resourcesLoaded.images = true;
                checkAllResourcesLoaded();
            }
        }
    });

    // Check if all resources are loaded
    function checkAllResourcesLoaded() {
        if (resourcesLoaded.video && resourcesLoaded.images && resourcesLoaded.fonts) {
            clearTimeout(loadingTimeout);
            setTimeout(hideLoadingScreen, 500); // Small delay for smooth transition
        }
    }

    // Hide loading screen
    function hideLoadingScreen() {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        // Trigger entrance animations
        triggerEntranceAnimations();
    }

    // Trigger entrance animations
    function triggerEntranceAnimations() {
        const elementsToAnimate = document.querySelectorAll('.preload-hidden');
        elementsToAnimate.forEach((element, index) => {
            setTimeout(() => {
                element.classList.remove('preload-hidden');
                element.classList.add('preload-visible');
            }, index * 100);
        });
    }

    // Enhanced mobile menu handling
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !navMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Counter animation for impact numbers
    const impactNumbers = document.querySelectorAll('.impact-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.getAttribute('data-target'));
                animateCounter(target, finalNumber);
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    impactNumbers.forEach(number => {
        observer.observe(number);
    });

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 30);
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1000);
        });
    }

    // Add initial classes for animations
    const elementsToPreload = document.querySelectorAll('.feature, .program-card, .team-member, .diff-card');
    elementsToPreload.forEach(element => {
        element.classList.add('preload-hidden');
    });

    console.log('StemBotics website initialized successfully');
});

// Error boundary for uncaught errors
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    
    // Hide loading screen if it's still showing
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.program || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Thank you for your interest! We will contact you soon.', 'success');
    
    // Reset form
    this.reset();
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Close button styles
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature, .program-card, .team-member');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Dynamic typing effect for hero title
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.textContent;
    
    // Small delay before starting the typing effect
    setTimeout(() => {
        typeWriter(heroTitle, originalText, 60);
    }, 500);
});

// Add scroll progress indicator
function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(to right, #2563eb, #3b82f6);
        z-index: 1002;
        transition: width 0.2s ease;
    `;
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicator.style.width = scrolled + '%';
    });
}

// Initialize scroll indicator
document.addEventListener('DOMContentLoaded', createScrollIndicator);

// Add floating action button for quick contact
function createFloatingButton() {
    const fab = document.createElement('a');
    fab.href = '#contact';
    fab.innerHTML = '<i class="fas fa-comments"></i>';
    fab.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        text-decoration: none;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
        transform: scale(0);
    `;
    
    document.body.appendChild(fab);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            fab.style.transform = 'scale(1)';
        } else {
            fab.style.transform = 'scale(0)';
        }
    });
    
    // Hover effect
    fab.addEventListener('mouseenter', () => {
        fab.style.transform = 'scale(1.1)';
        fab.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
    });
    
    fab.addEventListener('mouseleave', () => {
        if (window.scrollY > 300) {
            fab.style.transform = 'scale(1)';
        }
        fab.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
    });
}

// Initialize floating button
document.addEventListener('DOMContentLoaded', createFloatingButton);

// Add loading animation
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            flex-direction: column;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #2563eb;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <p style="margin-top: 1rem; color: #666; font-family: Inter, sans-serif;">Loading StemBotics...</p>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(loader);
    
    // Remove loader when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }, 800);
    });
}

// Initialize loading animation
if (document.readyState === 'loading') {
    showLoadingAnimation();
}

// Add particles background effect to hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    `;
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: float${i} ${3 + Math.random() * 4}s ease-in-out infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        
        particlesContainer.appendChild(particle);
        
        // Create unique animation for each particle
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float${i} {
                0%, 100% { 
                    transform: translateY(${Math.random() * 20}px) translateX(${Math.random() * 20 - 10}px);
                    opacity: 0.3;
                }
                50% { 
                    transform: translateY(${-Math.random() * 40 - 20}px) translateX(${Math.random() * 20 - 10}px);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    hero.style.position = 'relative';
    hero.appendChild(particlesContainer);
}

// Initialize particles effect
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createParticles, 1000);
});

// Video background handling
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.video-background video');
    
    if (video) {
        console.log('Video element found, setting up event listeners...');
        
        // Handle video loading
        video.addEventListener('loadstart', () => {
            console.log('Video loading started');
        });
        
        video.addEventListener('loadedmetadata', () => {
            console.log('Video metadata loaded');
        });
        
        video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
            video.style.opacity = '1';
        });
        
        video.addEventListener('canplay', () => {
            console.log('Video can start playing');
        });
        
        video.addEventListener('playing', () => {
            console.log('Video is now playing');
        });
        
        // Handle video errors
        video.addEventListener('error', (e) => {
            console.error('Video failed to load:', e);
            console.error('Video error details:', video.error);
            // If video fails, show gradient background
            const videoBackground = document.querySelector('.video-background');
            if (videoBackground) {
                videoBackground.style.display = 'none';
                console.log('Video background hidden due to error');
            }
        });
        
        // Handle individual source errors
        const sources = video.querySelectorAll('source');
        sources.forEach((source, index) => {
            source.addEventListener('error', (e) => {
                console.error(`Video source ${index + 1} (${source.src}) failed to load`);
            });
        });
        
        // Try to play the video
        const attemptPlay = () => {
            video.play().then(() => {
                console.log('Video autoplay successful');
            }).catch(e => {
                console.warn('Autoplay prevented:', e.message);
                console.log('Video will play after user interaction');
            });
        };
        
        // Attempt autoplay after a short delay
        setTimeout(attemptPlay, 500);
        
        // Ensure video plays on first user interaction
        const playOnInteraction = () => {
            if (video.paused) {
                video.play().catch(e => {
                    console.error('Could not play video on interaction:', e);
                });
            }
        };
        
        // Listen for various user interactions
        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, playOnInteraction, { once: true });
        });
    } else {
        console.error('Video element not found in DOM');
    }
});

// Enhanced team section interactions
document.addEventListener('DOMContentLoaded', () => {
    const teamMembers = document.querySelectorAll('.team-member');
    
    // Add intersection observer for team member animations
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe team members
    teamMembers.forEach(member => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        member.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        teamObserver.observe(member);
    });
    
    // Add click interaction to team cards
    teamMembers.forEach(member => {
        const card = member.querySelector('.member-card');
        
        card.addEventListener('click', () => {
            // Remove active class from all cards
            teamMembers.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked card
            member.classList.add('active');
            
            // Optional: Show more info (you can expand this)
            console.log(`Clicked on ${member.querySelector('h3').textContent}`);
        });
    });
    
    // Add parallax effect to team background
    const teamSection = document.getElementById('team');
    
    if (teamSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            teamSection.style.backgroundPosition = `center ${rate}px`;
        });
    }
});

// Handle team member photo loading
document.addEventListener('DOMContentLoaded', () => {
    const memberPhotos = document.querySelectorAll('.member-photo');
    
    memberPhotos.forEach(photo => {
        // Add loading placeholder
        photo.style.opacity = '0';
        
        photo.addEventListener('load', () => {
            photo.style.opacity = '1';
            photo.style.transition = 'opacity 0.5s ease';
        });
        
        photo.addEventListener('error', () => {
            // If photo fails to load, create a fallback
            const memberImage = photo.parentElement;
            const memberName = photo.alt;
            const initials = memberName.split(' ').map(name => name[0]).join('');
            
            photo.style.display = 'none';
            
            const fallback = document.createElement('div');
            fallback.className = 'photo-fallback';
            fallback.textContent = initials;
            fallback.style.cssText = `
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
                font-size: 2rem;
                font-weight: bold;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            `;
            
            memberImage.appendChild(fallback);
        });
    });
});

// Debug image loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.member-photo');
    console.log(`Found ${images.length} team member images`);
    
    images.forEach((img, index) => {
        console.log(`Image ${index + 1}: ${img.src}`);
        
        img.addEventListener('load', () => {
            console.log(`✓ Image loaded successfully: ${img.alt}`);
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', (e) => {
            console.error(`✗ Failed to load image: ${img.alt} - ${img.src}`);
            console.error('Error details:', e);
            
            // Show a visible error message
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                text-align: center;
                z-index: 10;
            `;
            errorDiv.textContent = `Image not found: ${img.src.split('/').pop()}`;
            img.parentElement.appendChild(errorDiv);
        });
        
        // Force reload if image hasn't loaded after 3 seconds
        setTimeout(() => {
            if (!img.complete || img.naturalHeight === 0) {
                console.warn(`Image taking too long to load: ${img.alt}`);
            }
        }, 3000);
    });
});

// About Section Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    initAboutAnimations();
    initTestimonialSlider();
    initCountUpAnimations();
    initScrollAnimations();
    initParallaxEffects();
});

// Initialize About Section Animations
function initAboutAnimations() {
    // Animate title words on page load
    const titleWords = document.querySelectorAll('.title-word');
    titleWords.forEach((word, index) => {
        setTimeout(() => {
            word.style.animation = `slideUpWords 1s ease-out forwards`;
        }, index * 200);
    });

    // Interactive cards hover effects
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.querySelector('.card-glow').style.opacity = '1';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.querySelector('.card-glow').style.opacity = '0';
        });
    });
}

// Testimonial Slider Functionality
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const controlBtns = document.querySelectorAll('.control-btn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Hide all testimonials
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            testimonial.style.opacity = '0';
            testimonial.style.transform = 'translateX(100px)';
        });

        // Update control buttons
        controlBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        // Show current testimonial
        setTimeout(() => {
            testimonials[index].classList.add('active');
            testimonials[index].style.opacity = '1';
            testimonials[index].style.transform = 'translateX(0)';
        }, 200);

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % testimonials.length;
        showSlide(next);
    }

    // Control button click handlers
    controlBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startAutoSlide();
        });
    });

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Initialize first slide and start auto-slide
    if (testimonials.length > 0) {
        showSlide(0);
        startAutoSlide();
    }

    // Pause auto-slide on hover
    const testimonialSection = document.querySelector('.testimonials-section');
    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
        testimonialSection.addEventListener('mouseleave', startAutoSlide);
    }
}

// Count-up Animation for Impact Numbers
function initCountUpAnimations() {
    const impactNumbers = document.querySelectorAll('.impact-number');
    
    function animateNumber(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Use Intersection Observer to trigger animations when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });

    impactNumbers.forEach(number => observer.observe(number));
}

// Scroll-triggered Animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-animate');
                
                switch(animationType) {
                    case 'fade-up':
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                        break;
                    case 'slide-up':
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                        break;
                    case 'slide-left':
                        element.style.opacity = '1';
                        element.style.transform = 'translateX(0)';
                        break;
                    case 'slide-right':
                        element.style.opacity = '1';
                        element.style.transform = 'translateX(0)';
                        break;
                    case 'zoom-in':
                        element.style.opacity = '1';
                        element.style.transform = 'scale(1)';
                        break;
                }
                
                element.classList.add('animate');
                observer.unobserve(element);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        // Set initial states
        const animationType = element.getAttribute('data-animate');
        element.style.transition = 'all 0.8s ease-out';
        
        switch(animationType) {
            case 'fade-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(50px)';
                break;
            case 'slide-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                break;
            case 'slide-left':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-50px)';
                break;
            case 'slide-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(50px)';
                break;
            case 'zoom-in':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                break;
        }
        
        observer.observe(element);
    });

    // Special handling for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
    });

    // Special handling for differentiator cards
    const diffCards = document.querySelectorAll('.diff-card');
    diffCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Parallax Effects for Background Elements
function initParallaxEffects() {
    const floatingShapes = document.querySelectorAll('.shape');
    const orbitalElements = document.querySelectorAll('.orbit-ring');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const aboutSection = document.querySelector('.about');
        
        if (!aboutSection) return;
        
        const aboutRect = aboutSection.getBoundingClientRect();
        const isInView = aboutRect.top < window.innerHeight && aboutRect.bottom > 0;
        
        if (isInView) {
            // Update floating shapes
            floatingShapes.forEach((shape, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = scrolled * speed;
                shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
            });
            
            // Update orbital rings
            orbitalElements.forEach((orbit, index) => {
                const baseRotation = scrolled * 0.02 * (index + 1);
                orbit.style.transform = `translate(-50%, -50%) rotate(${baseRotation}deg)`;
            });
        }
    }
    
    // Throttled scroll handler
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Dynamic Content Loading (for future enhancement)
function loadDynamicContent() {
    // This could be used to load testimonials, stats, or other content from an API
    // For now, it's a placeholder for future enhancements
    console.log('Dynamic content loading initialized');
}

// Interactive Card 3D Effect
function init3DCardEffects() {
    const cards = document.querySelectorAll('.interactive-card, .diff-card, .impact-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Initialize 3D effects after page load
window.addEventListener('load', init3DCardEffects);

// Keyboard Navigation for Testimonials
document.addEventListener('keydown', (e) => {
    const testimonialSection = document.querySelector('.testimonials-section');
    if (!testimonialSection) return;
    
    const isInView = testimonialSection.getBoundingClientRect().top < window.innerHeight && 
                     testimonialSection.getBoundingClientRect().bottom > 0;
    
    if (isInView) {
        const controlBtns = document.querySelectorAll('.control-btn');
        const activeBtn = document.querySelector('.control-btn.active');
        let currentIndex = Array.from(controlBtns).indexOf(activeBtn);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            controlBtns[currentIndex - 1].click();
        } else if (e.key === 'ArrowRight' && currentIndex < controlBtns.length - 1) {
            e.preventDefault();
            controlBtns[currentIndex + 1].click();
        }
    }
});

// Performance optimization: Reduce animations on low-performance devices
function optimizeForPerformance() {
    // Detect if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable complex animations
        document.querySelectorAll('[data-animate]').forEach(element => {
            element.style.animation = 'none';
            element.style.transition = 'none';
        });
        
        // Show elements immediately
        document.querySelectorAll('.title-word').forEach(word => {
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
        });
    }
}

// Initialize performance optimizations
optimizeForPerformance();

// Video error handling
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.getElementById('heroVideo');
    const videoFallback = document.querySelector('.video-fallback');
    
    if (heroVideo) {
        // Handle video loading errors
        heroVideo.addEventListener('error', function() {
            console.log('Video failed to load, showing fallback background');
            if (videoFallback) {
                videoFallback.classList.add('show');
            }
        });
        
        // Handle video source errors
        heroVideo.addEventListener('loadstart', function() {
            console.log('Video loading started');
        });
        
        heroVideo.addEventListener('canplay', function() {
            console.log('Video can start playing');
            if (videoFallback) {
                videoFallback.classList.remove('show');
            }
        });

        // Fallback if video doesn't load within 3 seconds
        setTimeout(() => {
            if (heroVideo.readyState === 0) {
                console.log('Video timeout, showing fallback');
                if (videoFallback) {
                    videoFallback.classList.add('show');
                }
            }
        }, 3000);
    }
    
    // Enhanced image error handling for team photos
    const memberPhotos = document.querySelectorAll('.member-photo');
    memberPhotos.forEach((photo, index) => {
        const memberNames = ['TM', 'AM', 'NM', 'RA'];
        
        photo.addEventListener('error', function() {
            console.log(`Failed to load image: ${this.src}`);
            // Create placeholder if image fails
            const placeholder = document.createElement('div');
            placeholder.className = 'error-fallback';
            placeholder.innerHTML = `<i class="fas fa-user"></i>`;
            placeholder.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                font-size: 3rem;
                z-index: 5;
            `;
            this.parentElement.appendChild(placeholder);
        });
        
        photo.addEventListener('load', function() {
            this.style.opacity = '1';
            // Remove any error fallback if image loads successfully
            const errorFallback = this.parentElement.querySelector('.error-fallback');
            if (errorFallback) {
                errorFallback.remove();
            }
        });
    });

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});
