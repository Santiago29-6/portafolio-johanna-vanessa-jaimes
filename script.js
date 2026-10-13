const root = document.documentElement;
root.classList.add("js");

/* ---------- Menú móvil ---------- */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const desktopQuery = window.matchMedia("(min-width: 861px)");

function setMenu(open, { returnFocus = false } = {}) {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  if (!open && returnFocus) menuToggle.focus();
}

menuToggle?.addEventListener("click", () => {
  setMenu(!navLinks.classList.contains("open"));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks?.classList.contains("open")) {
    setMenu(false, { returnFocus: true });
  }
});

document.addEventListener("click", (event) => {
  if (navLinks?.classList.contains("open") && !event.target.closest(".navbar")) {
    setMenu(false);
  }
});

desktopQuery.addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

/* ---------- Aparición al hacer scroll ---------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  revealItems.forEach((element) => revealObserver.observe(element));
} else {
  revealItems.forEach((element) => element.classList.add("visible"));
}

/* ---------- Sección activa en la navegación ---------- */
const navAnchors = new Map(
  [...document.querySelectorAll('.nav-links a[href^="#"]')].map((link) => [
    link.getAttribute("href").slice(1),
    link,
  ])
);

function setCurrent(id) {
  navAnchors.forEach((link, key) => {
    if (key === id) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCurrent(entry.target.id || null);
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach((section) => {
    if (navAnchors.has(section.id)) spy.observe(section);
  });

  const hero = document.querySelector(".hero");
  if (hero) spy.observe(hero);
}

/* ---------- Año del footer ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
