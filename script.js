/* =========================================================
   TáBarato — comportamento da home
   ========================================================= */

const CONFIG = {
  /* ▸ LINK DO GRUPO */
  channelUrl: "https://chat.whatsapp.com/HUCCTzHKEGQKIHsfC4joXs?mode=gi_t",

  /* ▸ DEPOIMENTOS (prints do WhatsApp em assets/depoimentos/) */
  depoimentos: [
    "assets/depoimentos/01.webp",
    "assets/depoimentos/02.webp",
    "assets/depoimentos/03.webp",
    "assets/depoimentos/04.webp",
    "assets/depoimentos/05.webp",
    "assets/depoimentos/06.webp",
  ],

  /* ▸ LOJAS
     Coloque as logos em assets/logos/ — enquanto o arquivo não existir,
     aparece o nome da loja em texto, na cor da marca.                    */
  marketplaces: [
    { nome: "Mercado Livre", img: "assets/logos/mercado-livre.svg", cor: "#2D3277" },
    { nome: "Amazon",        img: "assets/logos/amazon.svg",        cor: "#232F3E" },
    { nome: "Shopee",        img: "assets/logos/shopee.svg",        cor: "#EE4D2D" },
    { nome: "Magalu",        img: "assets/logos/magalu.svg",        cor: "#0086FF" },
    { nome: "AliExpress",    img: "assets/logos/aliexpress.svg",    cor: "#E62E04" },
  ],
};

/* Placeholder de depoimento (só aparece se a imagem não carregar) */
const WA_FAKE = [
  [["in", "Gente esse grupo é <b>surreal</b>"], ["out", "Comprei um fone que tava <b>R$ 349</b> por <b>R$ 179</b> 😱"]],
  [["out", "Economizei <b>R$ 210</b> na air fryer"], ["in", "Mesma coisa aqui, valeu demais 🙏"]],
  [["in", "Link é seguro mesmo?"], ["out", "Sempre site oficial, nunca deu problema"]],
];

document.addEventListener("DOMContentLoaded", () => {
  wireCtas();
  buildProof();
  buildBrands();
  setupReveal();
  setupCounters();
  setupSlider();
  setupFaq();
  setupToTop();
  setYear();
});

/* ---------- CTAs ----------
   O clique tem que abrir o APP do WhatsApp (não o site), mesmo dentro do
   navegador embutido do Instagram/TikTok/Facebook. */

function detectInAppBrowser() {
  const ua = navigator.userAgent || "";
  const inApp = /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|TikTok|BytedanceWebview|musical_ly|LinkedInApp|Twitter/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  return { inApp, isAndroid, isIOS };
}

/* Android + navegador embutido: um link "intent://" entrega a navegação
   direto pro app do WhatsApp, com fallback pro link normal. */
function buildWhatsAppHref(url, { inApp, isAndroid }) {
  if (!inApp || !isAndroid) return url;
  const semProtocolo = url.replace(/^https?:\/\//, "");
  const fallback = encodeURIComponent(url);
  return `intent://${semProtocolo}#Intent;scheme=https;package=com.whatsapp;S.browser_fallback_url=${fallback};end`;
}

/* Conversão "Subscribe" do Meta Pixel no clique de qualquer CTA. Em try/catch
   pra um pixel bloqueado nunca impedir a pessoa de entrar no grupo. */
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
        console.warn("[TáBarato] Defina CONFIG.channelUrl em script.js com o link do grupo.");
      });
    }
  });

  /* iOS dentro de navegador embutido: não existe truque de link que force a
     troca de app. Avisamos a pessoa a abrir no navegador de verdade. */
  if (url && url !== "#" && env.inApp && env.isIOS) showInAppHint();
}

function showInAppHint() {
  try {
    if (sessionStorage.getItem("tb_inapp_hint_dismissed")) return;
  } catch (e) { /* storage bloqueado — segue sem persistir */ }

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

/* ---------- Depoimentos (carrossel lento e infinito) ---------- */
function buildProof() {
  const track = document.querySelector('[data-marquee="proof"] [data-track]');
  if (!track) return;
  const items = CONFIG.depoimentos.length ? CONFIG.depoimentos : WA_FAKE.map(() => null);

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
  msgs.forEach(([dir, html]) => {
    const m = el("div", "wa__msg" + (dir === "in" ? " wa__msg--in" : ""));
    m.innerHTML = html;
    body.appendChild(m);
  });
  const foot = el("div", "wa__foot");
  foot.appendChild(el("span")).textContent = "Mensagem";
  wrap.append(bar, body, foot);
  return wrap;
}

/* ---------- Lojas ---------- */
function buildBrands() {
  const box = document.querySelector("[data-brands]");
  if (!box) return;
  CONFIG.marketplaces.forEach((m) => {
    const item = el("span", "brand");
    item.style.setProperty("--c", m.cor || "#333");
    const showText = () => { item.innerHTML = ""; item.textContent = m.nome; };
    if (m.img) {
      const img = el("img");
      img.loading = "lazy";
      img.alt = m.nome;
      img.src = m.img;
      img.onerror = showText;
      item.appendChild(img);
    } else {
      showText();
    }
    box.appendChild(item);
  });
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
  }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
  els.forEach((e) => io.observe(e));
}

/* ---------- Contador (números) ----------
   Só começa quando o card entra na tela, com um respiro antes (pra pessoa
   não descer e já encontrar o número parado). Entra com blur/fade, conta
   bem devagar com desaceleração suave e termina com um "pop". */
function setupCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;
  const fmt = (n) => Math.round(n).toLocaleString("pt-BR");

  counters.forEach((node) => {
    const target = parseInt(node.dataset.target, 10) || 0;
    const prefix = node.dataset.prefix || "";
    const final = () => { node.textContent = prefix + fmt(target); };

    if (!("IntersectionObserver" in window) ||
        matchMedia("(prefers-reduced-motion: reduce)").matches) {
      final();
      return;
    }

    node.textContent = prefix + "0";
    node.classList.add("pre");               // começa borrado/invisível

    const START_DELAY = 700;                 // ms — respiro antes de começar
    const DURATION = 3600;                   // ms — contagem lenta
    const run = () => {
      node.classList.remove("pre");          // blur/fade de entrada
      setTimeout(() => {
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / DURATION);
          const eased = 1 - Math.pow(1 - p, 3.4);   // desacelera até parar
          node.textContent = prefix + fmt(target * eased);
          if (p < 1) {
            requestAnimationFrame(tick);
          } else {
            final();
            node.classList.add("pop");
          }
        };
        requestAnimationFrame(tick);
      }, START_DELAY);
    };

    const watch = node.closest(".stat") || node;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { run(); io.unobserve(entry.target); }
      });
    }, { threshold: 0.45 });
    io.observe(watch);
  });
}

/* ---------- Slider de vantagens (bolinhas) ---------- */
function setupSlider() {
  const slider = document.querySelector("[data-slider]");
  const dotsBox = document.querySelector("[data-dots]");
  if (!slider || !dotsBox) return;
  const slides = [...slider.children];
  const dots = slides.map((_, i) => {
    const d = el("i");
    d.addEventListener("click", () => slider.scrollTo({ left: slides[i].offsetLeft - slider.offsetLeft, behavior: "smooth" }));
    dotsBox.appendChild(d);
    return d;
  });
  const update = () => {
    const w = slider.clientWidth || 1;
    const idx = Math.max(0, Math.min(slides.length - 1, Math.round(slider.scrollLeft / w)));
    dots.forEach((d, i) => d.classList.toggle("on", i === idx));
  };
  slider.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  update();
}

/* ---------- FAQ: só uma pergunta aberta por vez ---------- */
function setupFaq() {
  const list = document.querySelector("[data-faq]");
  if (!list) return;
  list.addEventListener("toggle", (e) => {
    if (!e.target.open) return;
    list.querySelectorAll("details[open]").forEach((d) => { if (d !== e.target) d.open = false; });
  }, true);
}

/* ---------- Voltar ao topo ---------- */
function setupToTop() {
  const btn = document.querySelector("[data-totop]");
  if (!btn) return;
  const onScroll = () => btn.classList.toggle("show", window.scrollY > 700);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
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
