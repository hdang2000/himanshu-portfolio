const q = (selector, scope = document) => scope.querySelector(selector);
const qa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const storedTheme = localStorage.getItem("portfolio-theme-v2");
if (storedTheme === "dark") {
  document.documentElement.classList.add("dark");
  document.body.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
  document.body.classList.remove("dark");
}

const progressFill = q(".progress-fill");
const hudFill = q("[data-hud-fill]");
const xpText = q("[data-xp]");
const navLinks = qa(".navlinks a[href^='#']");
const sections = qa("section[id]");
const badges = qa("[data-badge]");

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (hudFill) hudFill.style.width = `${pct}%`;
  if (xpText) xpText.textContent = `${Math.round(pct * 12)} XP`;
  badges.forEach((badge, index) => {
    if (pct >= (index + 1) * 22) badge.classList.add("unlocked");
  });
}

function updateActiveNav() {
  let current = sections[0]?.id || "";
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140) current = section.id;
  });
  navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
}

window.addEventListener("scroll", () => {
  updateProgress();
  updateActiveNav();
}, { passive: true });

updateProgress();
updateActiveNav();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

qa(".reveal").forEach((item) => observer.observe(item));

const menuToggle = q("[data-menu-toggle]");
const nav = q("[data-nav]");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
  qa("a", nav).forEach((link) => link.addEventListener("click", () => nav.classList.remove("open")));
}

const themeToggle = q("[data-theme-toggle]");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("portfolio-theme-v2", isDark ? "dark" : "light");
  });
}

const phrases = ["Product Manager", "Growth Strategist", "Innovation Driver", "User Experience Advocate"];
const typing = q("[data-typing]");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typing) return;
  const phrase = phrases[phraseIndex];
  typing.textContent = phrase.slice(0, charIndex);
  if (!deleting && charIndex < phrase.length) {
    charIndex += 1;
    setTimeout(typeLoop, 70);
    return;
  }
  if (!deleting && charIndex === phrase.length) {
    deleting = true;
    setTimeout(typeLoop, 1100);
    return;
  }
  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 34);
    return;
  }
  deleting = false;
  phraseIndex = (phraseIndex + 1) % phrases.length;
  setTimeout(typeLoop, 260);
}
typeLoop();

qa(".tilt").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-3px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

function openVideo(src) {
  const modal = q("[data-video-modal]");
  const video = q("[data-video]");
  if (!modal || !video) return;
  video.src = src;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  video.play().catch(() => {});
}

function closeVideo() {
  const modal = q("[data-video-modal]");
  const video = q("[data-video]");
  if (!modal || !video) return;
  video.pause();
  video.src = "";
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

window.openVideo = openVideo;
window.closeVideo = closeVideo;

const modal = q("[data-video-modal]");
if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeVideo();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeVideo();
  });
}
