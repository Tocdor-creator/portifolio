import { initBackground } from "./background.js?v=2";
import { initTerminal } from "./terminal.js?v=2";
import { initActiveSection, initDraggableStrip, initReveal } from "./ui.js?v=2";

new Typed("#typed", {
  strings: [
    "Desenvolvedor Frontend",
    "Desenvolvedor de Sistemas",
    "Criador do Luz Holística",
    "Aprendendo Python todo dia",
  ],
  typeSpeed: 50,
  backSpeed: 28,
  backDelay: 1600,
  startDelay: 900,
  loop: true,
});

// dispara a animação das linhas do terminal
document.body.classList.add("loaded");

const background = initBackground(document.getElementById("bg"));
initTerminal({ background });
initActiveSection();
initDraggableStrip(document.querySelector(".strip"));
initReveal();

document.getElementById("year").textContent = new Date().getFullYear();
