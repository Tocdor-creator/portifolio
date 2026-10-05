// Terminal interativo da página inicial.
//
// Segurança: nada do que o visitante digita é executado ou interpretado como HTML.
// Só os comandos da lista abaixo existem, os argumentos são validados
// e toda saída é escrita com textContent.

import { getLang, setLang } from "./i18n.js?v=3";

const MAX_LENGTH = 80;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

// nome digitado -> tema (aceita os nomes em português e em inglês)
const THEMES = { dracula: "dracula", matrix: "matrix", oceano: "oceano", ocean: "oceano", sunset: "sunset" };
const THEME_NAMES = { pt: "dracula, matrix, oceano, sunset", en: "dracula, matrix, ocean, sunset" };

// devolve o texto no idioma atual
const tr = (pt, en) => (getLang() === "en" ? en : pt);

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

  // Cada comando tem um nome em português e outro em inglês (iguais quando não precisa traduzir)
  const commands = [
    {
      pt: "help", en: "help",
      description: () => tr("lista os comandos", "lists the commands"),
      run() {
        print(tr("comandos disponíveis:", "available commands:"), "info");
        const lang = getLang();
        commands.forEach((command) => print(`  ${command[lang].padEnd(9)} ${command.description()}`));
        print(tr("dica: Tab completa o comando e ↑ ↓ navegam no histórico", "tip: Tab completes the command and ↑ ↓ browse the history"), "dim");
      },
    },
    {
      pt: "hello", en: "hello",
      description: () => tr("o clássico", "the classic"),
      run() {
        print("Hello, World! 👋", "big");
        print(tr("obrigado por visitar meu portfólio :)", "thanks for visiting my portfolio :)"), "dim");
      },
    },
    {
      pt: "echo", en: "echo",
      description: () => tr("repete o texto (echo oi)", "repeats the text (echo hi)"),
      run: (args) => print(args.join(" ")),
    },
    {
      pt: "whoami", en: "whoami",
      description: () => tr("quem sou eu", "who I am"),
      run() {
        print("Bruno Schutz", "hl");
        print(tr(
          "desenvolvedor frontend e de sistemas · estudando Python, C# e Node",
          "frontend and systems developer · studying Python, C# and Node"
        ));
      },
    },
    {
      pt: "sobre", en: "about",
      description: () => tr("abre sobre.md", "opens about.md"),
      run: () => openSection("sobre", tr("abrindo sobre.md...", "opening about.md...")),
    },
    {
      pt: "projetos", en: "projects",
      description: () => tr("abre projetos.json", "opens projects.json"),
      run: () => openSection("projetos", tr("abrindo projetos.json...", "opening projects.json...")),
    },
    {
      pt: "skills", en: "skills",
      description: () => tr("abre skills.py", "opens skills.py"),
      run: () => openSection("skills", tr("executando skills.py...", "running skills.py...")),
    },
    {
      pt: "contato", en: "contact",
      description: () => tr("abre contato.sh", "opens contact.sh"),
      run: () => openSection("contato", tr("abrindo contato.sh...", "opening contact.sh...")),
    },
    {
      pt: "tema", en: "theme",
      description: () => tr(`muda as cores (${THEME_NAMES.pt})`, `changes the colors (${THEME_NAMES.en})`),
      run([name = ""]) {
        name = name.toLowerCase();
        if (!Object.hasOwn(THEMES, name)) {
          const list = THEME_NAMES[getLang()].replaceAll(", ", "|");
          return print(tr(`uso: tema <${list}>`, `usage: theme <${list}>`), "err");
        }
        setTheme(THEMES[name]);
        print(tr(`tema "${name}" aplicado ✓`, `theme "${name}" applied ✓`), "ok");
      },
    },
    {
      pt: "cor", en: "color",
      description: () => tr("cor de destaque (cor #ff79c6)", "accent color (color #ff79c6)"),
      run([hex = ""]) {
        if (!HEX_COLOR.test(hex)) {
          return print(tr("uso: cor #rrggbb   (ex: cor #50fa7b)", "usage: color #rrggbb   (e.g. color #50fa7b)"), "err");
        }
        root.style.setProperty("--purple", hex);
        background.applyPalette();
        print(tr(`cor de destaque agora é ${hex} ✓`, `accent color is now ${hex} ✓`), "ok");
      },
    },
    {
      pt: "idioma", en: "lang",
      description: () => tr("troca o idioma (idioma en)", "switches the language (lang pt)"),
      run([code = ""]) {
        code = code.toLowerCase();
        if (code !== "pt" && code !== "en") return print(tr("uso: idioma <pt|en>", "usage: lang <pt|en>"), "err");
        setLang(code);
        print(tr("idioma: português ✓", "language: English ✓"), "ok");
      },
    },
    {
      pt: "party", en: "party",
      description: () => tr("agita o fundo", "shakes up the background"),
      run() {
        background.party();
        print(tr("🎉 party mode por 4 segundos!", "🎉 party mode for 4 seconds!"), "hl");
      },
    },
    {
      pt: "date", en: "date",
      description: () => tr("data e hora", "date and time"),
      run: () => print(new Date().toLocaleString(tr("pt-BR", "en-US"))),
    },
    {
      pt: "history", en: "history",
      description: () => tr("comandos já digitados", "commands typed so far"),
      run: () => commandHistory.forEach((cmd, i) => print(`  ${String(i + 1).padStart(3)}  ${cmd}`)),
    },
    {
      pt: "sudo", en: "sudo",
      description: () => tr("tenta ser admin", "tries to be admin"),
      run: () => print(tr("permissão negada: boa tentativa 😄", "permission denied: nice try 😄"), "err"),
    },
    {
      pt: "clear", en: "clear",
      description: () => tr("limpa o terminal", "clears the terminal"),
      run: () => output.replaceChildren(),
    },
  ];

  // aceita o nome em qualquer um dos dois idiomas
  const findCommand = (name) => commands.find((command) => command.pt === name || command.en === name);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.slice(0, MAX_LENGTH).trim();
    input.value = "";
    if (!text) return;

    commandHistory.push(text);
    historyIndex = commandHistory.length;
    print(`bruno@dev ~ $ ${text}`, "dim");

    const [name, ...args] = text.split(/\s+/);
    const command = findCommand(name.toLowerCase());

    if (command) command.run(args);
    else print(tr(`comando não encontrado: ${name}. digite "help"`, `command not found: ${name}. type "help"`), "err");

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
      const match = commands.map((command) => command[getLang()]).find((name) => name.startsWith(partial));
      if (match) input.value = `${match} `;
    }
  });

  // Clicar em qualquer parte do terminal foca o campo (sem atrapalhar links e seleção de texto)
  document.querySelector(".terminal").addEventListener("click", (event) => {
    if (event.target.closest("a") || window.getSelection().toString()) return;
    input.focus({ preventScroll: true });
  });
}
