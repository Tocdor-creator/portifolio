import { initI18n, getLang, onLangChange } from "./i18n.js?v=3";
import { initBackground } from "./background.js?v=3";
import { initTerminal } from "./terminal.js?v=3";
import { initActiveSection, initDraggableStrip, initReveal } from "./ui.js?v=3";

const TYPED_STRINGS = {
  pt: ["Desenvolvedor Frontend", "Desenvolvedor de Sistemas", "Criador do Luz Holística", "Aprendendo Python todo dia"],
  en: ["Frontend Developer", "Systems Developer", "Creator of Luz Holística", "Learning Python every day"],
};

let typed;

function startTyped(lang, startDelay = 0) {
  typed?.destroy();
  typed = new Typed("#typed", {
    strings: TYPED_STRINGS[lang],
    typeSpeed: 50,
    backSpeed: 28,
    backDelay: 1600,
    startDelay,
    loop: true,
  });
}

initI18n();
startTyped(getLang(), 900);
onLangChange((lang) => startTyped(lang));

// dispara a animação das linhas do terminal
document.body.classList.add("loaded");

const background = initBackground(document.getElementById("bg"));
initTerminal({ background });
initActiveSection();
initDraggableStrip(document.querySelector(".strip"));
initReveal();

document.getElementById("year").textContent = new Date().getFullYear();
