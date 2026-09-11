# Assets — o que você precisa colocar aqui

## 1. Background do hero  →  `hero-bg.webp` ✅ já configurado
- Arquivo atual: `assets/hero-bg.webp` (1520×2688, ~9:16).
- Se quiser trocar por outro arquivo/extensão, edite a linha `--hero-img` no topo de `../styles.css`:
  ```css
  --hero-img: url("assets/hero-bg.jpg");
  ```
- O texto do hero fica ancorado na **parte de baixo** da imagem. Deixe a metade
  inferior do seu background mais “limpa” para a copy respirar (ou ajuste
  `.hero__content { justify-content }` em `styles.css`).

## 2. Depoimentos (prints do WhatsApp)  →  `depoimentos/` ✅ já configurado
- 6 prints (`01.webp` a `06.webp`), verticais, listados em `../script.js` (`CONFIG.depoimentos`).
- O card (`.proof-card` em `styles.css`) usa a proporção exata dos prints (1520×2688), então nada é cortado.
- Pra trocar/adicionar: solte o arquivo aqui e ajuste a lista em `CONFIG.depoimentos`.

## 3. Logos dos marketplaces  →  `logos/` (pendente)
- Coloque as logos aqui (`mercado-livre.svg`, `amazon.svg`, `shopee.svg`, ...).
- Formato ideal: **PNG/SVG com fundo transparente**, altura ~120 px.
- A lista já está montada em `../script.js` (`marketplaces`). Se o arquivo da
  logo não existir, o site mostra um selo de texto com o nome — some assim que
  você adicionar a imagem certa.
