document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const closeNav = document.querySelector('.close-nav');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    function openNav() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNavigation() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    navToggle.addEventListener('click', openNav);
    closeNav.addEventListener('click', closeNavigation);
    overlay.addEventListener('click', closeNavigation);

    const showMoreBtn = document.querySelector('.show-more-btn');
    const hiddenLessons = document.querySelectorAll('.lesson-card.hidden');
    const visibleLessons = document.querySelectorAll('.lesson-card.visible');

    if (showMoreBtn && hiddenLessons.length > 0) {
        showMoreBtn.addEventListener('click', () => {
            hiddenLessons.forEach(lesson => {
                lesson.classList.toggle('visible');
                lesson.classList.toggle('hidden');
            });

            showMoreBtn.classList.toggle('active');

            // Scroll to the first newly visible lesson if expanding
            if (showMoreBtn.classList.contains('active')) {
                const firstHiddenLesson = hiddenLessons[0];
                firstHiddenLesson.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                const firstVisibleLesson = visibleLessons[0];
                firstVisibleLesson.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    const reviewsSlider = new Swiper('.reviews-slider', {
        slidesPerView: 1,
        loop: false,
        spaceBetween: 30,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const sections = document.querySelectorAll('section');

    const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.005 // Lower threshold for quicker trigger
};

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
});