// ==UserScript==
// @name         Rophim VIP Bypass v2.0 Stable
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  VIP đến 2099 + 999M Coin + 8 Endpoints - Stable & Tested
// @author       z3rokaze (Based on tearrs)
// @match        *://www.rophim.li/*
// @match        *://www.rophim.me/*
// @match        *://www.rophim.mx/*
// @match        *://goatembed.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @icon         https://www.rophim.li/images/favicon.ico
// @homepageURL  https://github.com/z3rokaze/bypass-rophim
// @downloadURL  https://raw.githubusercontent.com/z3rokaze/bypass-rophim/main/rophim-vip-bypass.user.js
// @updateURL    https://raw.githubusercontent.com/z3rokaze/bypass-rophim/main/rophim-vip-bypass.user.js
// ==/UserScript==

(function () {
  "use strict";

  // ═══════════════════════════════════════════════════════════════
  // 🎯 CONFIGURATION
  // ═══════════════════════════════════════════════════════════════
  
  // VIP expiry: 18/07/2099 00:00:00 UTC
  const VIP_EXPIRY_DATE = new Date(2099, 6, 18, 0, 0, 0); // Month 6 = July
  const VIP_EXPIRY_TIMESTAMP = Math.floor(VIP_EXPIRY_DATE.getTime() / 1000);
  const COIN_BALANCE = 999999999;

  // ═══════════════════════════════════════════════════════════════
  // 🎯 API ENDPOINTS
  // ═══════════════════════════════════════════════════════════════
  
  const TARGETS = [
    // Core endpoints (original)
    "https://rophimapi.net/v1/user/info",
    "https://rophimapi.net/v1/user/updateProfile",
    "https://rophimapi.net/v1/auth/login",
    
    // Additional important endpoints
    "https://rophimapi.net/v1/user/profile",
    "https://rophimapi.net/v1/vip/check",
    "https://rophimapi.net/v1/vip/status",
    
    // V2 API support
    "https://rophimapi.net/v2/user/info",
    "https://rophimapi.net/v2/user/profile",
  ];

  // ═══════════════════════════════════════════════════════════════
  // 🎨 CUSTOM CSS
  // ═══════════════════════════════════════════════════════════════
  
  const css = `
    :root {
      --primary-color: #51f085 !important;
      --primary-text: #51f085 !important;
    }
    .dev.dev-up {
      color: #51f085 !important;
    }
    .tag-imdb {
      border: 1px solid #51f085 !important;
    }
    .tag-imdb:before {
      color: #51f085 !important;
    }
    .app-box-fix {
      display: none !important;
    }
  `;

  // ═══════════════════════════════════════════════════════════════
  // 💉 CSS INJECTION
  // ═══════════════════════════════════════════════════════════════
  
  let cssInjected = false;
  
  function injectCSSOnce() {
    if (cssInjected) return;
    cssInjected = true;
    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  // Special handling for goatembed.com
  if (location.hostname.includes("goatembed.com")) {
    injectCSSOnce();
    return;
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔧 PATCH USER INFO
  // ═══════════════════════════════════════════════════════════════
  
  function patchUserInfo(data) {
    if (data?.result) {
      // Patch nested user object
      if (data.result.user) {
        Object.assign(data.result.user, {
          vip_expires_at: VIP_EXPIRY_TIMESTAMP,
          coin_balance: COIN_BALANCE,
          is_vip: true,
        });
      }
      // Patch result object
      Object.assign(data.result, {
        vip_expires_at: VIP_EXPIRY_TIMESTAMP,
        coin_balance: COIN_BALANCE,
        is_vip: true,
      });
    }
    injectCSSOnce();
    return data;
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎯 URL CHECKER
  // ═══════════════════════════════════════════════════════════════
  
  function isTarget(url) {
    return TARGETS.some((t) => url.includes(t));
  }

  // ═══════════════════════════════════════════════════════════════
  // 🌐 FETCH API HOOK
  // ═══════════════════════════════════════════════════════════════
  
  async function handleJsonResponse(res, url) {
    if (!isTarget(url)) return res;
    try {
      const clone = res.clone();
      if ((clone.headers.get("content-type") || "").includes("application/json")) {
        const data = await clone.json();
        const patched = patchUserInfo(data);
        return new Response(JSON.stringify(patched), {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        });
      }
    } catch (_) {}
    return res;
  }

  const realFetch = window.fetch;
  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : input.url;
    const res = await realFetch.apply(this, arguments);
    return handleJsonResponse(res, url);
  };

  // ═══════════════════════════════════════════════════════════════
  // 📡 XMLHttpRequest HOOK
  // ═══════════════════════════════════════════════════════════════
  
  const RealXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    const xhr = new RealXHR();
    let targetUrl = "";

    const origOpen = xhr.open;
    xhr.open = function (method, url, async, user, pass) {
      targetUrl = url;
      return origOpen.apply(this, arguments);
    };

    const origSend = xhr.send;
    xhr.send = function () {
      this.addEventListener("load", function () {
        if (isTarget(targetUrl)) {
          try {
            if ((xhr.getResponseHeader("content-type") || "").includes("application/json")) {
              const data = JSON.parse(xhr.responseText);
              const patched = patchUserInfo(data);
              Object.defineProperty(xhr, "responseText", {
                writable: true,
                value: JSON.stringify(patched),
              });
              Object.defineProperty(xhr, "response", {
                writable: true,
                value: JSON.stringify(patched),
              });
            }
          } catch (_) {}
        }
      });
      return origSend.apply(this, arguments);
    };

    return xhr;
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎮 CONSOLE INFO (Optional - can be removed)
  // ═══════════════════════════════════════════════════════════════
  
  console.log(
    "%c🎬 Rophim VIP Bypass",
    "font-size: 14px; font-weight: bold; color: #51f085;"
  );
  console.log(
    "%cVIP đến: " + VIP_EXPIRY_DATE.toLocaleDateString("vi-VN"),
    "color: #51f085;"
  );
  console.log(
    "%cCoin: " + COIN_BALANCE.toLocaleString("vi-VN"),
    "color: #51f085;"
  );
})();
