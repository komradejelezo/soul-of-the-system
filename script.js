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
// Interactive cube: drag from any tile; a simple click still follows its link.
(() => {
    const cube = document.getElementById('portfolioCube');
    const scene = document.getElementById('cubeScene');
    if (!cube || !scene) return;

    let rx = -22, ry = -34;
    let dragging = false, moved = false, suppressClick = false;
    let startX = 0, startY = 0, lastX = 0, lastY = 0;
    let hovering = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Time-based animation keeps the same speed on 60/120/144 Hz screens.
    // Pause rendering while offscreen or in a background tab, without changing visuals.
    let visible = true;
    let frameId = 0;
    let previousTime = null;
    let dirty = true;
    function render(now) {
        frameId = 0;
        const dt = previousTime === null ? 0 : Math.min(now - previousTime, 50);
        previousTime = now;
        if (document.hidden || !visible) return;
        if (!dragging && !hovering && !reduced) {
            ry += dt * 0.0045; // 0.075 degrees at 60 FPS
            dirty = true;
        }
        if (dirty) {
            cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
            dirty = false;
        }
        if (!reduced || dragging || dirty) frameId = requestAnimationFrame(render);
    }
    function wake() {
        previousTime = null;
        dirty = true;
        if (!frameId && !document.hidden && visible) frameId = requestAnimationFrame(render);
    }
    const observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) wake();
        else if (frameId) { cancelAnimationFrame(frameId); frameId = 0; previousTime = null; }
    }, { threshold: 0 });
    observer.observe(scene);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = 0;
            previousTime = null;
        } else wake();
    });
    wake();

    scene.addEventListener('pointerenter', () => { hovering = true; });
    scene.addEventListener('pointerleave', () => { hovering = false; });

    scene.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true;
        moved = false;
        suppressClick = false;
        startX = lastX = e.clientX;
        startY = lastY = e.clientY;
        // Do not capture pointer here: native link clicks must remain intact.
    });

    window.addEventListener('pointermove', e => {
        if (!dragging) return;
        if (!moved && Math.hypot(e.clientX - startX, e.clientY - startY) > 5) moved = true;
        if (moved) {
            ry += (e.clientX - lastX) * 0.55;
            rx -= (e.clientY - lastY) * 0.55;
            dirty = true;
            wake();
        }
        lastX = e.clientX;
        lastY = e.clientY;
    });

    function endDrag() {
        if (!dragging) return;
        dragging = false;
        suppressClick = moved;
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    scene.addEventListener('click', e => {
        if (!suppressClick) return;
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
    }, true);

    scene.addEventListener('dragstart', e => e.preventDefault());
})();
