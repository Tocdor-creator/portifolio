# Portfólio · Bruno Schutz

Portfólio pessoal com a cara de um editor de código: tema inspirado no Dracula, seções em forma de arquivos (`sobre.md`, `projetos.json`, `skills.py`, `contato.sh`) e um terminal interativo na página inicial.

## Destaques

- **Terminal interativo**: aceita comandos como `help`, `hello`, `tema matrix` e `cor #50fa7b`. Só comandos de uma lista fechada são aceitos e toda saída é escrita como texto, sem `eval` nem `innerHTML`.
- **Temas**: Dracula (padrão), Matrix, Oceano e Sunset, todos feitos com variáveis CSS.
- **Fundo 3D**: rede de pontos e conexões com Three.js que reage ao mouse e muda de cor junto com o tema.
- **Projetos arrastáveis**: cards em formato JSON que podem ser arrastados com o mouse, com o dedo ou com as setas do teclado.
- **Responsivo**: no celular a barra lateral some e as abas viram o menu.

## Tecnologias

- HTML, CSS e JavaScript (ES Modules), sem etapa de build
- [Three.js](https://threejs.org/) para o fundo animado
- [Typed.js](https://github.com/mattboldt/typed.js) para o texto digitando
- [Devicon](https://devicon.dev/) para os ícones

## Estrutura

```
portfolio/
├── index.html
├── css/
│   └── style.css      # variáveis, temas e estilos
└── js/
    ├── main.js        # ponto de entrada
    ├── background.js  # fundo 3D (Three.js)
    ├── terminal.js    # comandos do terminal
    └── ui.js          # navegação, faixa de projetos e animações
```

## Rodando localmente

Como o projeto usa ES Modules, ele precisa ser aberto por um servidor (abrir o `index.html` direto no navegador não funciona):

```bash
python -m http.server 5500
```

Depois é só acessar `http://localhost:5500`. A extensão Live Server do VS Code também funciona.

## Publicação

O site é estático e roda direto no **GitHub Pages**: em *Settings → Pages*, selecione a branch `main` e a pasta `/ (root)`.
