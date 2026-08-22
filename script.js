const header = document.querySelector(".site-header");
const nav = document.querySelector("#site-nav");
const toggle = document.querySelector(".nav-toggle");
const year = document.querySelector("#year");
const toTop = document.querySelector(".to-top");
const form = document.querySelector("#contact-form");
const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".hero-dots button")];

if (year) year.textContent = String(new Date().getFullYear());

const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 12);
  toTop?.classList.toggle("is-visible", y > 500);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const closeNav = () => {
  if (!nav || !toggle) return;
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menú");
  document.body.style.overflow = "";
};

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}

toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

let slideIndex = 0;
let slideTimer;

const setSlide = (index) => {
  if (!slides.length) return;
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === slideIndex);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === slideIndex);
  });
};

const startSlider = () => {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => setSlide(slideIndex + 1), 6000);
};

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setSlide(Number(dot.dataset.slide));
    startSlider();
  });
});

if (slides.length > 1) startSlider();

const equipoCarousel = document.querySelector("[data-equipo-carousel]");
if (equipoCarousel) {
  const equipoSlides = [...equipoCarousel.querySelectorAll(".equipo-slide")];
  const dotsWrap = equipoCarousel.querySelector(".equipo-dots");
  const prevBtn = equipoCarousel.querySelector(".equipo-nav.is-prev");
  const nextBtn = equipoCarousel.querySelector(".equipo-nav.is-next");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let equipoIndex = 0;
  let equipoTimer;

  equipoSlides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Equipo ${i + 1}`);
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => {
      setEquipo(i);
      startEquipo();
    });
    dotsWrap?.append(dot);
  });

  const equipoDots = [...(dotsWrap?.querySelectorAll("button") || [])];

  const setEquipo = (index) => {
    equipoIndex = (index + equipoSlides.length) % equipoSlides.length;
    equipoSlides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === equipoIndex);
      slide.classList.toggle(
        "is-prev",
        i === (equipoIndex - 1 + equipoSlides.length) % equipoSlides.length
      );
      slide.classList.toggle(
        "is-next",
        i === (equipoIndex + 1) % equipoSlides.length
      );
    });
    equipoDots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === equipoIndex);
    });
  };

  const startEquipo = () => {
    clearInterval(equipoTimer);
    if (reduceMotion || equipoSlides.length < 2) return;
    equipoTimer = setInterval(() => setEquipo(equipoIndex + 1), 2000);
  };

  prevBtn?.addEventListener("click", () => {
    setEquipo(equipoIndex - 1);
    startEquipo();
  });
  nextBtn?.addEventListener("click", () => {
    setEquipo(equipoIndex + 1);
    startEquipo();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(equipoTimer);
    else startEquipo();
  });

  setEquipo(0);
  startEquipo();
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nombre = String(data.get("nombre") || "").trim();
  const email = String(data.get("email") || "").trim();
  const mensaje = String(data.get("mensaje") || "").trim();
  const status = form.querySelector(".form-status");

  if (!nombre || !email) {
    if (status) status.textContent = "Completá nombre y e-mail para continuar.";
    return;
  }

  const body = [
    `Nombre: ${nombre}`,
    `E-mail: ${email}`,
    "",
    mensaje || "(Sin mensaje)",
  ].join("\n");

  const mailto = `mailto:info@centrodearomas.com?subject=${encodeURIComponent(
    `Consulta web — ${nombre}`
  )}&body=${encodeURIComponent(body)}`;

  if (status) {
    status.textContent = "Abriendo tu correo para enviar el mensaje…";
  }
  window.location.href = mailto;
  form.reset();
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".client-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });
}

const revealTargets = document.querySelectorAll(
  ".section .eyebrow, .section h2, .section .lead, .pillar, .split-media, .split-copy > p, .service-card, .ambientes-intro, .ambiente-card, .ambiente-chips, .check-list, .equipos-intro, .equipo-benefits, .equipo-carousel, .fragancia-grid, .client-marquee, .contacto-copy, .contact-form"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
);

revealTargets.forEach((el) => observer.observe(el));
