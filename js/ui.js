// Comportamentos da interface: navegação ativa, faixa de projetos e animações de entrada

const SECTION_IDS = ["inicio", "sobre", "projetos", "skills", "contato"];
const SECTION_LANGUAGES = ["Shell", "Markdown", "JSON", "Python", "Shell Script"];

// Destaca o arquivo da seção visível no explorador, nas abas e na barra de status
export function initActiveSection() {
  const sections = SECTION_IDS.map((id) => document.getElementById(id));
  const links = document.querySelectorAll("[data-section]");
  const tabs = document.querySelector(".tabs");
  const language = document.getElementById("sb-lang");
  let current = -1;

  function update() {
    const index = sections.findLastIndex((section) => section.getBoundingClientRect().top < window.innerHeight * 0.45);
    const active = Math.max(index, 0);
    if (active === current) return;
    current = active;

    links.forEach((link) => link.classList.toggle("active", Number(link.dataset.section) === active));
    language.textContent = SECTION_LANGUAGES[active];

    // no celular, mantém a aba ativa visível
    const tab = tabs.querySelector(`[data-section="${active}"]`);
    tabs.scrollTo({ left: tab.offsetLeft - 40, behavior: "smooth" });
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// Faixa de projetos: arrastar com o mouse e navegar com as setas.
// No toque o navegador já faz a rolagem horizontal sozinho.
export function initDraggableStrip(strip) {
  const CARD_STEP = 360;
  let drag = null;

  strip.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag = { startX: event.clientX, startScroll: strip.scrollLeft, moved: false };
  });

  window.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const distance = event.clientX - drag.startX;

    if (!drag.moved && Math.abs(distance) > 4) {
      drag.moved = true;
      strip.classList.add("dragging");
    }
    if (drag.moved) strip.scrollLeft = drag.startScroll - distance;
  });

  window.addEventListener("pointerup", () => {
    if (!drag) return;
    drag = null;
    // espera o clique terminar para que soltar o arraste não abra um link
    setTimeout(() => strip.classList.remove("dragging"));
  });

  strip.addEventListener("dragstart", (event) => event.preventDefault());

  strip.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") strip.scrollBy({ left: CARD_STEP, behavior: "smooth" });
    if (event.key === "ArrowLeft") strip.scrollBy({ left: -CARD_STEP, behavior: "smooth" });
  });
}

// Seções aparecem suavemente ao entrar na tela
export function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("reveal");
    observer.observe(section);
  });
}
