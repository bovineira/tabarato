# Assets — /moda

Mesma lógica da pasta `/assets` da home, só que independente (os arquivos
daqui não afetam a home, e vice-versa).

## 1. Background do hero  →  `hero-bg.webp` ✅ já configurado
- Arquivo atual: `assets/hero-bg.webp` (1520×2688, ~9:16) — o mesmo mockup do
  celular da home, só que na versão rosa/clara.
- Se quiser trocar por outro arquivo/extensão, edite a linha `--hero-img` no
  topo de `../styles.css`.
- O texto do hero fica ancorado na **parte de baixo** da imagem, e o texto é
  **escuro** (identidade clara) — o `.hero__scrim` clareia o fundo o
  suficiente pra continuar legível em cima de qualquer imagem.

## 2. Depoimentos (prints do WhatsApp)  →  `depoimentos/` ✅ já copiado da home
- Os mesmos 6 prints da home (`01.webp` a `06.webp`), já listados em
  `../script.js` (`CONFIG.depoimentos`). Troque os arquivos aqui se quiser
  prints diferentes pra essa página.

## 3. Logos dos marketplaces  →  `logos/` (pendente, igual à home)
- Mesmo esquema de `../script.js` (`CONFIG.marketplaces`). Solte os arquivos
  aqui e eles substituem os selos de texto automaticamente.
