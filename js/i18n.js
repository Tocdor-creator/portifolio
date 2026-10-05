// Tradução PT/EN.
//
// O português fica direto no HTML. Elementos com data-i18n="chave" recebem
// o texto em inglês deste dicionário; ao voltar para PT, o conteúdo original
// é restaurado. Atributos usam data-i18n-placeholder, data-i18n-aria-label
// e data-i18n-content.
//
// O dicionário é conteúdo fixo escrito por mim (nunca entrada do visitante),
// por isso pode conter marcação HTML.

const STORAGE_KEY = "portfolio-lang";
const TRANSLATED_ATTRS = ["placeholder", "aria-label", "content"];

const EN = {
  "meta.title": "Bruno Schutz | Frontend &amp; Systems Developer",
  "meta.description": "Portfolio of Bruno Schutz, software developer focused on Frontend and Systems.",
  "lang.label": "Language",

  "nav.explorer": "EXPLORER",
  "nav.files": "File explorer",
  "nav.sections": "Sections",
  "file.about": "about.md",
  "file.projects": "projects.json",
  "file.contact": "contact.sh",

  "term.catRole": "cat role.txt",
  "term.lsShortcuts": "ls shortcuts/",
  "term.hint": "# this terminal works! try: help, hello, theme matrix",
  "term.placeholder": "type help and press Enter",
  "term.label": "Terminal command",

  "about.title": "# About me",
  "about.p1": `I'm a software developer focused on <b class="md-b">**Frontend**</b> and <b class="md-b">**Systems**</b>. I enjoy turning everyday problems into simple, functional and easy-to-use solutions.`,
  "about.p2": `I like understanding how things work behind the interface. That's why I keep exploring new technologies and building my own projects to put what I learn into practice <span class="c">(and breaking things along the way, it's part of it)</span>.`,
  "about.p3": `Right now I'm studying <b class="md-b">**Python**</b> and building projects around management systems, automation and web apps. In my spare time I'm learning to work side by side with AI, on my way to becoming an <b class="md-b">**AI Engineer**</b>. Or at least a respectable vibe coder.`,
  "about.focus": "focus",
  "about.systemsDev": `"Systems Development"`,
  "about.studying": "studying",
  "about.projects": "projects",
  "about.certGen": `"Certificate Generator"`,
  "about.married": "married",
  "about.curiosity": "curiosity",

  "projects.drag": "← drag →",
  "projects.comment": "// drag the cards sideways",
  "projects.label": "Project list. Drag or use the arrow keys to browse.",
  "json.name": `"name"`,
  "json.type": `"type"`,
  "json.about": `"about"`,
  "luz.type": `"Spiritual house management"`,
  "luz.stackSystems": `"Systems"`,
  "luz.about": `"Keeps members, events and the house routines in one place."`,
  "fin.type": `"Personal use"`,
  "fin.about": `"Personal finance tracker built as a learning project."`,
  "radar.type": `"Job aggregator"`,
  "radar.about": `"Pulls remote jobs from 5 APIs and filters by stack, salary and time zone."`,
  "cert.name": `"Certificate Request Generator"`,
  "cert.about": `"Automates steps of certificate generation."`,
  "port.name": `"This portfolio"`,
  "port.type": `"Personal website"`,
  "port.about": `"Code editor theme with a 3D background and an interactive terminal."`,
  "soon.comment": "// next project coming soon...",
  "link.code": "view code ↗",
  "link.open": "open project ↗",

  "skills.comment": "# my everyday tools",
  "skills.systems": `"systems"`,
  "skills.tools": `"tools"`,
  "skills.responsive": `"Responsive design"`,
  "skills.list": "items",
  "skills.fstring": `f"{area}: {', '.join(items)}"`,
  "skills.systemsLabel": "systems",
  "skills.toolsLabel": "tools",
  "skills.responsiveChip": "⧉ Responsive design",

  "contact.comment": "# got an idea, a project or a job opening? reach out!",
  "contact.echo": `"Shall we build something together?"`,
  "contact.send": "$ send email",
};

const originals = new Map();
const listeners = [];
let currentLang = "pt";

export const getLang = () => currentLang;

export function onLangChange(callback) {
  listeners.push(callback);
}

// Guarda o conteúdo em português na primeira vez que o elemento é traduzido
function remember(element, attr) {
  if (!originals.has(element)) originals.set(element, {});
  const saved = originals.get(element);
  if (!(attr in saved)) saved[attr] = attr === "html" ? element.innerHTML : element.getAttribute(attr);
  return saved[attr];
}

function translatePage(lang) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const original = remember(element, "html");
    element.innerHTML = lang === "en" ? EN[element.dataset.i18n] ?? original : original;
  });

  TRANSLATED_ATTRS.forEach((attr) => {
    document.querySelectorAll(`[data-i18n-${attr}]`).forEach((element) => {
      const original = remember(element, attr);
      const key = element.getAttribute(`data-i18n-${attr}`);
      element.setAttribute(attr, lang === "en" ? EN[key] ?? original : original);
    });
  });
}

export function setLang(lang) {
  if (lang !== "pt" && lang !== "en") return;
  currentLang = lang;

  document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  translatePage(lang);

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  });

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // navegação privada ou armazenamento bloqueado: só não lembra a escolha
  }

  listeners.forEach((callback) => callback(lang));
}

export function initI18n() {
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    // sem acesso ao armazenamento, segue com a detecção pelo navegador
  }

  // Primeira visita: português para quem usa o navegador em português, inglês para o resto
  const browserLang = navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLang(button.dataset.lang));
  });

  setLang(saved || browserLang);
}
