// Terminal interativo da página inicial.
//
// Segurança: nada do que o visitante digita é executado ou interpretado como HTML.
// Só os comandos da lista abaixo existem, os argumentos são validados
// e toda saída é escrita com textContent.

const MAX_LENGTH = 80;
const THEMES = ["dracula", "matrix", "oceano", "sunset"];
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function initTerminal({ background }) {
  const body = document.querySelector(".terminal-body");
  const output = document.getElementById("term-out");
  const form = document.getElementById("term-form");
  const input = document.getElementById("term-in");
  const root = document.documentElement;

  const commandHistory = [];
  let historyIndex = 0;

  function print(text, className = "") {
    const line = document.createElement("p");
    line.textContent = text;
    if (className) line.className = className;
    output.appendChild(line);
  }

  function openSection(id, message) {
    print(message, "ok");
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }

  function setTheme(name) {
    root.style.removeProperty("--purple");
    if (name === "dracula") delete root.dataset.theme;
    else root.dataset.theme = name;
    background.applyPalette();
  }

  const commands = {
    help: {
      description: "lista os comandos",
      run() {
        print("comandos disponíveis:", "info");
        for (const [name, command] of Object.entries(commands)) {
          print(`  ${name.padEnd(9)} ${command.description}`);
        }
        print("dica: Tab completa o comando e ↑ ↓ navegam no histórico", "dim");
      },
    },
    hello: {
      description: "o clássico",
      run() {
        print("Hello, World! 👋", "big");
        print("obrigado por visitar meu portfólio :)", "dim");
      },
    },
    echo: {
      description: "repete o texto (echo oi)",
      run: (args) => print(args.join(" ")),
    },
    whoami: {
      description: "quem sou eu",
      run() {
        print("Bruno Eliseu Schutz", "hl");
        print("desenvolvedor frontend e de sistemas · estudando Python, C# e Node");
      },
    },
    sobre: { description: "abre sobre.md", run: () => openSection("sobre", "abrindo sobre.md...") },
    projetos: { description: "abre projetos.json", run: () => openSection("projetos", "abrindo projetos.json...") },
    skills: { description: "abre skills.py", run: () => openSection("skills", "executando skills.py...") },
    contato: { description: "abre contato.sh", run: () => openSection("contato", "abrindo contato.sh...") },
    tema: {
      description: `muda as cores (${THEMES.join(", ")})`,
      run([name = ""]) {
        name = name.toLowerCase();
        if (!THEMES.includes(name)) return print(`uso: tema <${THEMES.join("|")}>`, "err");
        setTheme(name);
        print(`tema "${name}" aplicado ✓`, "ok");
      },
    },
    cor: {
      description: "cor de destaque (cor #ff79c6)",
      run([hex = ""]) {
        if (!HEX_COLOR.test(hex)) return print("uso: cor #rrggbb   (ex: cor #50fa7b)", "err");
        root.style.setProperty("--purple", hex);
        background.applyPalette();
        print(`cor de destaque agora é ${hex} ✓`, "ok");
      },
    },
    party: {
      description: "agita o fundo",
      run() {
        background.party();
        print("🎉 party mode por 4 segundos!", "hl");
      },
    },
    date: { description: "data e hora", run: () => print(new Date().toLocaleString("pt-BR")) },
    history: {
      description: "comandos já digitados",
      run: () => commandHistory.forEach((cmd, i) => print(`  ${String(i + 1).padStart(3)}  ${cmd}`)),
    },
    sudo: { description: "tenta ser admin", run: () => print("permissão negada: boa tentativa 😄", "err") },
    clear: { description: "limpa o terminal", run: () => output.replaceChildren() },
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.slice(0, MAX_LENGTH).trim();
    input.value = "";
    if (!text) return;

    commandHistory.push(text);
    historyIndex = commandHistory.length;
    print(`bruno@dev ~ $ ${text}`, "dim");

    const [name, ...args] = text.split(/\s+/);
    const key = name.toLowerCase();

    // Object.hasOwn evita nomes herdados como "constructor" ou "__proto__"
    if (Object.hasOwn(commands, key)) commands[key].run(args);
    else print(`comando não encontrado: ${name}. digite "help"`, "err");

    body.scrollTop = body.scrollHeight;
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && historyIndex > 0) {
      event.preventDefault();
      input.value = commandHistory[--historyIndex];
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      historyIndex = Math.min(historyIndex + 1, commandHistory.length);
      input.value = commandHistory[historyIndex] ?? "";
    } else if (event.key === "Tab" && input.value.trim()) {
      // com o campo vazio, o Tab segue o fluxo normal do teclado
      event.preventDefault();
      const partial = input.value.trim().toLowerCase();
      const match = Object.keys(commands).find((name) => name.startsWith(partial));
      if (match) input.value = `${match} `;
    }
  });

  // Clicar em qualquer parte do terminal foca o campo (sem atrapalhar links e seleção de texto)
  document.querySelector(".terminal").addEventListener("click", (event) => {
    if (event.target.closest("a") || window.getSelection().toString()) return;
    input.focus({ preventScroll: true });
  });
}
