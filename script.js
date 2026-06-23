const revealElements = document.querySelectorAll('section, footer');

revealElements.forEach(element => {
    element.classList.add('reveal');
});

function revealOnScroll() {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 80) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Аккордеон услуг
const items = document.querySelectorAll('.accordion-item');

items.forEach(item => {
    item.querySelector('.accordion-header').addEventListener('click', () => {
        items.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        item.classList.toggle('active');
    });
});

// Анимация цифр
const counters = document.querySelectorAll('.counter');
let countersStarted = false;

function animateCounter(counter) {
    const target = Number(counter.getAttribute('data-target'));
    let current = 0;
    const duration = 1800;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            counter.innerText = target;
            clearInterval(timer);
        } else {
            counter.innerText = Math.floor(current);
        }
    }, stepTime);
}

function startCountersOnScroll() {
    const resultsSection = document.querySelector('.results');

    if (!resultsSection || countersStarted) return;

    const sectionTop = resultsSection.getBoundingClientRect().top;

    if (sectionTop < window.innerHeight - 100) {
        countersStarted = true;
        counters.forEach(counter => animateCounter(counter));
    }
}

window.addEventListener('scroll', startCountersOnScroll);
window.addEventListener('load', startCountersOnScroll);