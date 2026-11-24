// V33: compositor-friendly section reveals; observe once rather than measuring all DOM on every scroll.
const revealElements = document.querySelectorAll('section, footer');
const sosLightDevice = matchMedia('(pointer:coarse), (max-width:767px)').matches;

if(sosLightDevice){revealElements.forEach(element=>element.classList.add('active'));}
else if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('active');observer.unobserve(entry.target); } });
  }, {rootMargin:'0px 0px -45px 0px',threshold:0.01});
  revealElements.forEach(element => {element.classList.add('reveal');revealObserver.observe(element);});
} else {revealElements.forEach(element => element.classList.add('active'));}

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
            counter.innerText = String(target) + (counter.getAttribute('data-suffix') || '');
            clearInterval(timer);
        } else {
            counter.innerText = Math.floor(current);
        }
    }, stepTime);
}

const resultsSection = document.querySelector('.results');
if (resultsSection) {
  const startCounters = () => { if(countersStarted)return; countersStarted = true;counters.forEach(animateCounter); };
  if('IntersectionObserver' in window){
    const countObserver = new IntersectionObserver(entries=>{ if(entries.some(x=>x.isIntersecting)){startCounters();countObserver.disconnect();} },{threshold:0.1});
    countObserver.observe(resultsSection);
  } else window.addEventListener('load',startCounters,{once:true});
}
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
    let idleTimer = 0;
    let previousTime = null;
    let lastPaint = 0;
    const mobileFrameInterval = matchMedia('(pointer: coarse)').matches ? ((navigator.deviceMemory&&navigator.deviceMemory<=2)?50:33) : 0;
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
        if (dirty && (!mobileFrameInterval || now - lastPaint >= mobileFrameInterval || dragging)) {
            lastPaint = now;
            cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
            dirty = false;
        }
        if (!reduced || dragging || dirty) scheduleNext();
    }
    function scheduleNext(){
        if(document.hidden || !visible || frameId || idleTimer) return;
        if(mobileFrameInterval && !dragging){
            idleTimer=setTimeout(()=>{idleTimer=0; if(!document.hidden&&visible) frameId=requestAnimationFrame(render);},mobileFrameInterval);
        }else frameId=requestAnimationFrame(render);
    }
    function stop(){
        if(frameId)cancelAnimationFrame(frameId);
        if(idleTimer)clearTimeout(idleTimer);
        frameId=idleTimer=0;previousTime=null;
    }
    function wake() {
        previousTime = null;
        dirty = true;
        if (!frameId && !idleTimer && !document.hidden && visible) frameId = requestAnimationFrame(render);
    }
    const observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) wake();
        else stop();
    }, { threshold: 0 });
    observer.observe(scene);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stop();
        } else wake();
    });
    wake();

    scene.addEventListener('pointerenter', e => { if(e.pointerType === 'mouse') hovering = true; });
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
