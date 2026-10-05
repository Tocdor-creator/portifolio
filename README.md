# Portfólio · Bruno Schutz

Esse é o meu portfólio. Como passo boa parte do dia dentro do VS Code, resolvi fazer o site com a cara de um editor: tema inspirado no Dracula e cada seção sendo um "arquivo" (`sobre.md`, `projetos.json`, `skills.py`, `contato.sh`).

A parte que eu mais curti fazer foi o terminal da página inicial. Ele funciona de verdade, então pode testar: digita `help` lá e vê o que dá pra fazer. Tem até troca de tema (`tema matrix` é o meu favorito).

## O que tem aqui

- Terminal interativo com uns comandos simples (`hello`, `tema`, `cor`, `party`...)
- 4 temas de cor: dracula, matrix, oceano e sunset
- Fundo animado com Three.js, uma rede de pontos que reage ao mouse
- Cards de projetos que dá pra arrastar pro lado
- Versão em português e inglês (botão PT | EN no topo, ou `lang en` no terminal)

Sobre o terminal: como qualquer pessoa pode digitar ali, tomei cuidado pra ele não executar nada. Só os comandos que eu defini funcionam, a cor só é aceita no formato `#rrggbb` e o texto sempre é exibido como texto, nunca como HTML. Pode tentar um `echo <script>` que não vai rolar 😄

## Feito com

- HTML, CSS e JavaScript puro (com ES Modules)
- [Three.js](https://threejs.org/) no fundo
- [Typed.js](https://github.com/mattboldt/typed.js) no texto digitando
- [Devicon](https://devicon.dev/) nos ícones

## Organização

```
portfolio/
├── index.html
├── css/
│   └── style.css      # cores, temas e estilos
└── js/
    ├── main.js        # junta tudo
    ├── background.js  # fundo com Three.js
    ├── terminal.js    # comandos do terminal
    └── ui.js          # menu, cards arrastáveis e animações
```

## Pra rodar na sua máquina

Como uso módulos no JS, abrir o `index.html` direto não funciona. Precisa de um servidor local, tipo o Live Server do VS Code ou:

```bash
python -m http.server 5500
```

Aí é só abrir `http://localhost:5500`.

---

Curtiu ou quer trocar uma ideia? Me chama no [LinkedIn](https://www.linkedin.com/in/bruno-schutz/) ou manda um e-mail pra bruno10.schutz@hotmail.com.
