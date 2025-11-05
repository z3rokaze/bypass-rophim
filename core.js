(function () {
  "use strict";

  // ═══════════════════════════════════════════════════════════════
  // 🎯 CONFIGURATION
  // ═══════════════════════════════════════════════════════════════
  
  // VIP expiry: 18/07/2099 00:00:00 UTC
  const VIP_EXPIRY_DATE = new Date(2099, 6, 18, 0, 0, 0);
  const VIP_EXPIRY_TIMESTAMP = Math.floor(VIP_EXPIRY_DATE.getTime() / 1000);
  const COIN_BALANCE = 999999999;

  // ═══════════════════════════════════════════════════════════════
  // 🎯 API ENDPOINTS - Optimized với Set cho O(1) lookup
  // ═══════════════════════════════════════════════════════════════
  
  const TARGETS = new Set([
    // Core endpoints
    "https://rophimapi.net/v1/user/info",
    "https://rophimapi.net/v1/user/updateProfile",
    "https://rophimapi.net/v1/auth/login",
    
    // Additional endpoints
    "https://rophimapi.net/v1/user/profile",
    "https://rophimapi.net/v1/vip/check",
    "https://rophimapi.net/v1/vip/status",
    
    // V2 API
    "https://rophimapi.net/v2/user/info",
    "https://rophimapi.net/v2/user/profile",
  ]);

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
  // 🔧 PATCH USER INFO - Optimized
  // ═══════════════════════════════════════════════════════════════
  
  const VIP_PATCH = {
    vip_expires_at: VIP_EXPIRY_TIMESTAMP,
    coin_balance: COIN_BALANCE,
    is_vip: true,
  };

  function patchUserInfo(data) {
    if (!data?.result) return data;
    
    // Single pass - patch all nested levels
    const targets = [data.result];
    if (data.result.user) {
      targets.push(data.result.user);
    }
    
    targets.forEach(target => Object.assign(target, VIP_PATCH));
    
    injectCSSOnce();
    return data;
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎯 URL CHECKER - Optimized với Set
  // ═══════════════════════════════════════════════════════════════
  
  function isTarget(url) {
    if (!url) return false;
    
    // Fast check: exact match first
    if (TARGETS.has(url)) return true;
    
    // Fallback: substring check
    for (const target of TARGETS) {
      if (url.includes(target)) return true;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════════════
  // 🌐 FETCH API HOOK - Improved error handling
  // ═══════════════════════════════════════════════════════════════
  
  async function handleJsonResponse(res, url) {
    if (!isTarget(url)) return res;
    
    try {
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        return res;
      }
      
      const clone = res.clone();
      const data = await clone.json();
      const patched = patchUserInfo(data);
      
      return new Response(JSON.stringify(patched), {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
    } catch (error) {
      // Log error for debugging but don't break
      console.warn("[Rophim Bypass] Failed to patch response:", error.message);
      return res;
    }
  }

  const realFetch = window.fetch;
  window.fetch = async function (input, init) {
    // Extract URL safely
    let url;
    try {
      url = typeof input === "string" ? input : input?.url || "";
    } catch (e) {
      url = "";
    }
    
    const res = await realFetch.apply(this, arguments);
    return handleJsonResponse(res, url);
  };

  // ═══════════════════════════════════════════════════════════════
  // 📡 XMLHttpRequest HOOK - Fixed memory leak
  // ═══════════════════════════════════════════════════════════════
  
  const RealXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    const xhr = new RealXHR();
    let targetUrl = "";

    const origOpen = xhr.open;
    xhr.open = function (method, url, async, user, pass) {
      targetUrl = url || "";
      return origOpen.apply(this, arguments);
    };

    const origSend = xhr.send;
    xhr.send = function () {
      // Use named function for cleanup capability
      const loadHandler = function () {
        if (!isTarget(targetUrl)) return;
        
        try {
          const contentType = xhr.getResponseHeader("content-type");
          if (!contentType?.includes("application/json")) return;
          
          const data = JSON.parse(xhr.responseText);
          const patched = patchUserInfo(data);
          const patchedText = JSON.stringify(patched);
          
          // Override response properties
          Object.defineProperty(xhr, "responseText", {
            writable: true,
            configurable: true,
            value: patchedText,
          });
          Object.defineProperty(xhr, "response", {
            writable: true,
            configurable: true,
            value: patchedText,
          });
        } catch (error) {
          console.warn("[Rophim Bypass] Failed to patch XHR response:", error.message);
        }
      };
      
      this.addEventListener("load", loadHandler, { once: true });
      return origSend.apply(this, arguments);
    };

    return xhr;
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎮 CONSOLE INFO
  // ═══════════════════════════════════════════════════════════════
  
  console.log(
    "%c🎬 Rophim VIP Bypass (Optimized)",
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
