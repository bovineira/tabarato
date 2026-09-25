/* =========================================================
   TáBarato /moda — comportamento da landing page
   (mesma lógica da home; só os assets/config são locais a /moda)
   ========================================================= */

const CONFIG = {
  /* ▸ LINK DO GRUPO */
  channelUrl: "https://chat.whatsapp.com/HUCCTzHKEGQKIHsfC4joXs?mode=gi_t",

  /* ▸ DEPOIMENTOS
     Coloque as imagens em  assets/depoimentos/  e liste os caminhos aqui.
     Ex.: ["assets/depoimentos/01.jpg", "assets/depoimentos/02.jpg"]
     Deixe [] para usar os placeholders enquanto não tiver os prints.   */
  depoimentos: [
    "assets/depoimentos/01.webp",
    "assets/depoimentos/02.webp",
    "assets/depoimentos/03.webp",
    "assets/depoimentos/04.webp",
    "assets/depoimentos/05.webp",
    "assets/depoimentos/06.webp",
  ],

  /* ▸ MARKETPLACES
     Coloque as logos em  assets/logos/  e liste aqui.
     Cada item pode ser:
       - string com o caminho da imagem:  "assets/logos/amazon.svg"
       - objeto { nome, img?, cor? } para o placeholder de texto        */
  marketplaces: [
    { nome: "Mercado Livre", img: "assets/logos/mercado-livre.svg", cor: "#FFE600" },
    { nome: "Amazon",        img: "assets/logos/amazon.svg",        cor: "#FF9900" },
    { nome: "Shopee",        img: "assets/logos/shopee.svg",        cor: "#EE4D2D" },
    { nome: "AliExpress",    img: "assets/logos/aliexpress.svg",    cor: "#FF4747" },
    { nome: "Magalu",        img: "assets/logos/magalu.svg",        cor: "#0086FF" },
  ],
};

/* Frases dos placeholders de depoimento (usadas só quando não há print) */
const WA_FAKE = [
  [["in", "Gente esse grupo é <b>surreal</b>"], ["out", "Comprei um fone que tava <b>R$ 349</b> por <b>R$ 179</b> 😱"], ["out", "chegou hoje, original 👌"]],
  [["out", "Economizei <b>R$ 210</b> na air fryer"], ["in", "Mesma coisa aqui, valeu demais 🙏"], ["in", "melhor grupo de promo disparado"]],
  [["in", "Link é seguro mesmo?"], ["out", "Sempre site oficial, nunca deu problema"], ["in", "comprei tranquilo então, obrigado!"]],
  [["out", "Tênis por <b>R$ 89</b> 🤯 tava 219"], ["in", "corre que acaba rápido"], ["out", "peguei 2 kkkk"]],
  [["in", "Já paguei o grupo só de economia essa semana"], ["out", "Real, melhor investimento"], ["in", "vou renovar com certeza"]],
  [["out", "Smart TV <b>R$ 400 mais barata</b> que na loja"], ["in", "esse grupo devia ser pago"], ["out", "aproveita que ainda tá no ar"]],
  [["in", "Achei <b>52% off</b> no perfume que eu queria"], ["out", "boa! marca aí pra galera 🔥"], ["in", "feito 👇"]],
  [["out", "3 compras esse mês, <b>R$ 640</b> economizados"], ["in", "🔥🔥🔥"], ["in", "tô sempre de olho nos alertas"]],
];
const WA_TIMES = ["09:12", "09:13", "09:15", "09:18", "09:21", "09:24"];

/* --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  wireCtas();
  buildProof();
  buildBrands();
  setupReveal();
  setupCounter();
  setupStickyCta();
  setYear();
});

/* ---------- CTAs ----------
   Objetivo: o clique tem que abrir o APP do WhatsApp (não o site), mesmo
   quando a página está sendo vista dentro do navegador embutido do
   Instagram/TikTok/Facebook etc. */

function detectInAppBrowser() {
  const ua = navigator.userAgent || "";
  const inApp = /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|TikTok|BytedanceWebview|musical_ly|LinkedInApp|Twitter/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  return { inApp, isAndroid, isIOS };
}

/* No Android, um link https normal costuma ficar preso dentro do navegador
   embutido do Instagram/TikTok. Um link "intent://" força o Android a
   entregar a navegação pro app do WhatsApp de verdade, pulando o navegador
   embutido — com fallback pro link original caso o app não esteja instalado. */
function buildWhatsAppHref(url, { inApp, isAndroid }) {
  if (!inApp || !isAndroid) return url;
  const semProtocolo = url.replace(/^https?:\/\//, "");
  const fallback = encodeURIComponent(url);
  return `intent://${semProtocolo}#Intent;scheme=https;package=com.whatsapp;S.browser_fallback_url=${fallback};end`;
}

/* Dispara a conversão "Subscribe" do Meta Pixel no clique do CTA. Em
   try/catch e checando se fbq existe pra nunca travar o clique (adblock,
   pixel bloqueado, etc. não podem impedir a pessoa de entrar no grupo). */
function trackSubscribe() {
  try {
    if (typeof fbq === "function") fbq("track", "Subscribe");
  } catch (e) { /* pixel indisponível — segue o jogo */ }
}

function wireCtas() {
  const url = CONFIG.channelUrl && CONFIG.channelUrl.trim();
  const env = detectInAppBrowser();

  document.querySelectorAll("[data-cta]").forEach((a) => {
    if (url && url !== "#") {
      a.href = buildWhatsAppHref(url, env);
      a.addEventListener("click", trackSubscribe);
    } else {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        console.warn("[TáBarato] Defina CONFIG.channelUrl em script.js com o link do seu canal.");
      });
    }
  });

  /* iOS dentro de navegador embutido: não existe um truque de link que force
     a troca de app (a Apple/Meta bloqueiam isso de propósito). Nesse caso
     avisamos a pessoa a abrir no navegador de verdade pra entrar de primeira. */
  if (url && url !== "#" && env.inApp && env.isIOS) showInAppHint();
}

function showInAppHint() {
  try {
    if (sessionStorage.getItem("tb_inapp_hint_dismissed")) return;
  } catch (e) { /* localStorage bloqueado — segue sem persistir a dispensa */ }

  const bar = el("div", "inapp-hint");
  const p = el("p");
  p.innerHTML = "Pra abrir o grupo <strong>direto no WhatsApp</strong>, toque em <strong>⋯</strong> (ou no ícone de compartilhar) aqui em cima e escolha <strong>“Abrir no navegador”</strong>.";
  const btn = el("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Fechar aviso");
  btn.textContent = "×";
  btn.addEventListener("click", () => {
    bar.classList.remove("show");
    setTimeout(() => bar.remove(), 300);
    try { sessionStorage.setItem("tb_inapp_hint_dismissed", "1"); } catch (e) {}
  });

  bar.append(p, btn);
  document.body.appendChild(bar);
  requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add("show")));
}

/* ---------- Carrossel de depoimentos ---------- */
function buildProof() {
  const track = document.querySelector('[data-marquee="proof"] [data-track]');
  if (!track) return;

  const items = (CONFIG.depoimentos.length ? CONFIG.depoimentos : WA_FAKE.map(() => null));

  const makeCard = (src, i) => {
    const card = el("div", "marquee__item proof-card");
    if (src) {
      const img = el("img");
      img.loading = "lazy";
      img.alt = "Print de conversa de um membro do grupo TáBarato";
      img.src = src;
      img.onerror = () => { card.innerHTML = ""; card.appendChild(waPlaceholder(i)); };
      card.appendChild(img);
    } else {
      card.appendChild(waPlaceholder(i));
    }
    return card;
  };

  // dois conjuntos idênticos = loop perfeito com translateX(-50%)
  const set = () => items.map(makeCard);
  [...set(), ...set()].forEach((c) => track.appendChild(c));
}

function waPlaceholder(i) {
  const msgs = WA_FAKE[i % WA_FAKE.length];
  const wrap = el("div", "wa");
  wrap.setAttribute("aria-hidden", "true");

  const bar = el("div", "wa__bar");
  bar.textContent = "Membro TáBarato";

  const body = el("div", "wa__body");
  msgs.forEach(([dir, html], j) => {
    const m = el("div", "wa__msg" + (dir === "in" ? " wa__msg--in" : ""));
    m.innerHTML = html;
    m.dataset.t = WA_TIMES[(i + j) % WA_TIMES.length];
    body.appendChild(m);
  });

  const foot = el("div", "wa__foot");
  foot.appendChild(el("span")).textContent = "Mensagem";

  wrap.append(bar, body, foot);
  return wrap;
}

/* ---------- Carrossel de marketplaces ---------- */
function buildBrands() {
  const track = document.querySelector('[data-marquee="brands"] [data-track]');
  if (!track) return;

  const list = CONFIG.marketplaces.map((m) => (typeof m === "string" ? { img: m, nome: "" } : m));

  const makePill = (m) => {
    const pill = el("div", "marquee__item brand-pill");
    const showText = () => {
      pill.innerHTML = "";
      if (m.cor) {
        const dot = el("span", "brand-pill__dot");
        dot.style.background = m.cor;
        pill.appendChild(dot);
      }
      const t = el("span", "brand-pill__txt");
      t.textContent = m.nome || "Marketplace";
      pill.appendChild(t);
    };
    if (m.img) {
      const img = el("img");
      img.loading = "lazy";
      img.alt = m.nome || "Marketplace parceiro";
      img.src = m.img;
      img.onerror = showText;
      pill.appendChild(img);
    } else {
      showText();
    }
    return pill;
  };

  const set = () => list.map(makePill);
  [...set(), ...set()].forEach((p) => track.appendChild(p));
}

/* ---------- Reveal ao rolar ---------- */
function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  els.forEach((e, i) => {
    e.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
    io.observe(e);
  });
}

/* ---------- Contador animado (seção "Comunidade") ----------
   Só começa a contar quando a seção entra na tela, com um pequeno atraso
   (pra pessoa não descer e já ver o número parado no final) e um blur/fade
   de entrada suave antes de disparar a contagem. */
function setupCounter() {
  const el = document.querySelector("[data-counter]");
  const wrap = document.querySelector("[data-counter-wrap]");
  if (!el || !wrap) return;

  const target = parseInt(el.dataset.target, 10) || 0;
  const format = (n) => Math.round(n).toLocaleString("pt-BR");

  if (!("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches) {
    wrap.classList.add("in");
    el.textContent = format(target);
    return;
  }

  const START_DELAY = 550; // ms — dá tempo de ver o número "nascer" antes de contar
  const DURATION = 2200;   // ms — duração da contagem

  const run = () => {
    wrap.classList.add("in");
    setTimeout(() => {
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / DURATION);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic — acelera e chega suave
        el.textContent = format(target * eased);
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = format(target);
          el.classList.add("counter--done");
        }
      };
      requestAnimationFrame(tick);
    }, START_DELAY);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        run();
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  io.observe(wrap);
}

/* ---------- Barra fixa depois do hero ---------- */
function setupStickyCta() {
  const bar = document.getElementById("stickyCta");
  const hero = document.getElementById("hero");
  if (!bar || !hero || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(([entry]) => {
    bar.classList.toggle("show", !entry.isIntersecting);
    bar.setAttribute("aria-hidden", entry.isIntersecting ? "true" : "false");
  }, { threshold: 0, rootMargin: "-40% 0px 0px 0px" });
  io.observe(hero);
}

/* ---------- Ano no rodapé ---------- */
function setYear() {
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- util ---------- */
function el(tag, cls) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  return n;
}
