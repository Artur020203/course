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

    document.querySelectorAll('.contact-form').forEach(form => {
        form.addEventListener('submit', formSend)
        // form.addEventListener('submit', function (e) {
        //     e.preventDefault();

        //     const TOKEN = ""; // TODO use token telegram bot
        //     const CHAT_ID = ""; // TODO use chat_Id to telegram
        //     const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

        //     const formData = new FormData(this);
        //     const data = Object.fromEntries(formData);

        //     // Add loading state
        //     const submitBtn = this.querySelector('.submit-btn');
        //     const originalText = submitBtn.innerHTML;
        //     submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправка...';
        //     submitBtn.disabled = true;



        //     // Simulate form submission (replace with actual API call)
        //     setTimeout(() => {
        //         console.log('Form data:', data);

        //         // Reset form
        //         this.reset();

        //         // Reset button
        //         submitBtn.innerHTML = originalText;
        //         submitBtn.disabled = false;

        //         // Show success message (implement your own notification system)
        //         alert('Дякуємо! Ми зв\'яжемося з вами найближчим часом.');
        //     }, 1500);
        // });
    })
});
async function formSend(event) {
    event.preventDefault();

    const TOKEN = "7626620548:AAGQ4SRgOXu_Q_3XL_T5bMD-3puSIu8cCEY"; // TODO use token telegram bot
    const CHAT_ID = "-1002722471061"; // TODO use chat_Id to telegram
    const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    let message = `
        <b>Дані з форми:</b>
        <b>Ім'я: ${data.name}</b>
        <b>Номер телефону:  ${data.phone}</b>
        <b>Нік в Telegram:  ${data.nikname}</b>
        `;

    // Add loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправка...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(URI_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "html",
            }),
        });

        const result = await response.json();

        if (result.ok) {
            form.reset();
            showMessage(true);
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error(error);
        showMessage(false);
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}
function showMessage(isSuccess) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert ${isSuccess ? 'alert-success' : 'alert-error'}`;
    
    // Set message content
    alert.innerHTML = `
        <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${isSuccess ? 'Дякуємо! Ми зв\'яжемося з вами найближчим часом.' : 'Помилка! Спробуйте ще раз.'}</span>
        <button class="alert-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to document
    document.body.appendChild(alert);
    
    // Show alert
    setTimeout(() => alert.classList.add('show'), 100);
    
    // Add close button handler
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(alert)) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}