/* Portfolio interactions: theme, menu, active links, reveal, typing, back-to-top */
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const $ = (s) => document.querySelector(s);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Dark / light theme (saved in localStorage) ---- */
  const themeBtn = $("#theme");
  const applyTheme = (t) => {
    root.dataset.theme = t;
    const light = t === "light";
    themeBtn.innerHTML = `<i class="fa-solid ${light ? "fa-moon" : "fa-sun"}"></i>`;
    themeBtn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
  };
  applyTheme(root.dataset.theme || "dark");
  themeBtn.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---- Mobile menu ---- */
  const burger = $("#burger"), menu = $("#menu");
  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });

  /* ---- Active link highlighting on scroll ---- */
  const links = [...document.querySelectorAll(".menu a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

  /* ---- Scroll-reveal animations ---- */
  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

  /* ---- Typing animation for the hero role ---- */
  const typed = $("#typed");
  const roles = ["Java Full Stack Developer", "Spring Boot and Microservices", "React.js Developer"];
  if (!reduceMotion) {
    let r = 0, i = 0, deleting = false;
    const tick = () => {
      const word = roles[r];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 40 : 80;
      if (!deleting && i === word.length) { deleting = true; delay = 1800; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 400; }
      setTimeout(tick, delay);
    };
    typed.textContent = "";
    tick();
  }

  /* ---- Back-to-top button ---- */
  const toTop = $("#toTop");
  addEventListener("scroll", () => toTop.classList.toggle("show", scrollY > 600), { passive: true });
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---- Footer year ---- */
  $("#year").textContent = new Date().getFullYear();
})();
