document.documentElement.classList.add('has-js');

const progress = document.querySelector('.scroll-progress span');
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updatePageState() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
  header.classList.toggle('scrolled', window.scrollY > 12);
}

window.addEventListener('scroll', updatePageState, { passive: true });
updatePageState();

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -35px' });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  navigation.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const portfolioVideos = [...document.querySelectorAll('.video-project video')];

portfolioVideos.forEach((video) => {
  video.muted = true;
  video.loop = true;
  video.controls = false;
});

if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      const card = video.closest('.video-project');

      if (entry.isIntersecting && entry.intersectionRatio >= 0.42 && !document.hidden) {
        video.play().then(() => card?.classList.add('is-playing')).catch(() => {});
      } else {
        video.pause();
        card?.classList.remove('is-playing');
      }
    });
  }, { threshold: [0, 0.42, 0.75] });

  portfolioVideos.forEach((video) => videoObserver.observe(video));
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    portfolioVideos.forEach((video) => {
      video.pause();
      video.closest('.video-project')?.classList.remove('is-playing');
    });
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
