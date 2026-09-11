# TáBarato — Landing page

Landing page mobile-first para o canal **TáBarato**: comunidade de ofertas do
Mercado Livre, Amazon e Shopee.

## Stack
HTML + CSS + JavaScript puro. Sem build, sem dependências. É só abrir.

```
index.html      estrutura + copy
styles.css      design system, hero 9:16, carrosséis, animações
script.js       CONFIG (link do canal + assets), carrosséis, reveals
assets/         background do hero, prints de depoimento, logos  (ver assets/README.md)
```

## Antes de publicar — 3 ajustes

1. **Link do canal** — em `script.js`, `CONFIG.channelUrl = "https://..."`.
2. **Background do hero** — substitua `assets/hero-bg.svg` por sua arte **1080×1920**.
3. **Prints e logos** — veja [`assets/README.md`](assets/README.md).

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra <http://localhost:8000>.

## Detalhes de design

- **Hero** no formato exato **1080×1920 (9:16)** para mostrar o background inteiro;
  no desktop vira um "story" centralizado.
- Palavras-chave da copy com **gradiente animado** (classe `.shine`).
- Dois carrosséis infinitos, lentos e com fade nas bordas (depoimentos ~60s, logos ~40s).
- Botão CTA com pulso + brilho; aviso vermelho com triângulo amarelo.
- Barra fixa de CTA aparece no mobile depois que o hero sai da tela.
- Respeita `prefers-reduced-motion`.
