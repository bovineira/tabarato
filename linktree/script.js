/* =========================================================
   TáBarato — /linktree
   Cada botão leva ao SEU grupo (href de cada <a data-group>) e força a
   abertura do app do WhatsApp mesmo no navegador embutido do Instagram,
   TikTok e Facebook.
   - Android embutido: link intent:// com package=com.whatsapp.
   - iOS embutido: tenta o esquema whatsapp://chat?code=<convite>; se a
     página continuar na tela após ~1,6 s, cai no link https normal.
   - Fora de navegador embutido: link normal (o sistema já abre o app).
   ========================================================= */

function detectEnv() {
  const ua = navigator.userAgent || "";
  return {
    inApp: /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|TikTok|BytedanceWebview|musical_ly|LinkedInApp|Twitter/i.test(ua),
    isAndroid: /Android/i.test(ua),
    isIOS: /iPhone|iPad|iPod/i.test(ua),
  };
}

function inviteCode(url) {
  const m = url.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

function androidIntent(url) {
  const semProtocolo = url.replace(/^https?:\/\//, "");
  return "intent://" + semProtocolo + "#Intent;scheme=https;package=com.whatsapp;S.browser_fallback_url=" + encodeURIComponent(url) + ";end";
}

function iosScheme(url) {
  const code = inviteCode(url);
  return code ? "whatsapp://chat?code=" + code : null;
}

document.addEventListener("DOMContentLoaded", () => {
  const env = detectEnv();

  document.querySelectorAll("[data-group]").forEach((a) => {
    const url = a.getAttribute("href");

    if (env.inApp && env.isAndroid) {
      a.href = androidIntent(url);
      a.removeAttribute("target");
    } else if (env.inApp && env.isIOS) {
      const scheme = iosScheme(url);
      if (scheme) {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = scheme;
          setTimeout(() => {
            if (document.visibilityState === "visible") window.location.href = url;
          }, 1600);
        });
      }
    }
  });

  if (env.inApp && env.isIOS) showHint();
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
});

function showHint() {
  try { if (sessionStorage.getItem("tb_inapp_hint_dismissed")) return; } catch (e) {}
  const bar = document.createElement("div");
  bar.className = "inapp-hint";
  bar.innerHTML = "<p>Se o grupo não abrir, toque em <strong>⋯</strong> (ou no ícone de compartilhar) aqui em cima e escolha <strong>“Abrir no navegador”</strong>.</p>";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Fechar aviso");
  btn.textContent = "×";
  btn.addEventListener("click", () => {
    bar.classList.remove("show");
    setTimeout(() => bar.remove(), 300);
    try { sessionStorage.setItem("tb_inapp_hint_dismissed", "1"); } catch (e) {}
  });
  bar.appendChild(btn);
  document.body.appendChild(bar);
  requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add("show")));
}
