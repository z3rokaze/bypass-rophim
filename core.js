(function () {
  "use strict";

  // ═══════════════════════════════════════════════════════════════
  // 🔧 CONFIGURATION - Có thể tùy chỉnh
  // ═══════════════════════════════════════════════════════════════

  const CONFIG = {
    // VIP Settings
    VIP_EXPIRY_TIMESTAMP: 4088496000, // 18/07/2099 00:00:00 GMT
    COIN_BALANCE: 999999999,
    IS_VIP: true,

    // Advanced Settings
    DEBUG_MODE: false, // Bật console.log debug
    STEALTH_MODE: true, // Anti-detection
    RANDOMIZE_COINS: false, // Random coin mỗi lần (998M-999M)
    AUTO_INJECT_CSS: true, // Tự động inject CSS
    HIDE_ADS: true, // Ẩn quảng cáo

    // Performance
    ENABLE_CACHE: true, // Cache patched responses
    CACHE_DURATION: 60000, // 60 seconds

    // Theme Color
    THEME_COLOR: "#51f085", // Xanh lá (có thể đổi)
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎯 API ENDPOINTS - Thêm nhiều endpoints hơn
  // ═══════════════════════════════════════════════════════════════

  const TARGETS = [
    // User endpoints
    "https://rophimapi.net/v1/user/info",
    "https://rophimapi.net/v1/user/profile",
    "https://rophimapi.net/v1/user/updateProfile",
    "https://rophimapi.net/v1/user/me",
    "https://rophimapi.net/v1/user/settings",
    
    // Auth endpoints
    "https://rophimapi.net/v1/auth/login",
    "https://rophimapi.net/v1/auth/register",
    "https://rophimapi.net/v1/auth/refresh",
    "https://rophimapi.net/v1/auth/verify",
    
    // VIP endpoints
    "https://rophimapi.net/v1/vip/check",
    "https://rophimapi.net/v1/vip/status",
    "https://rophimapi.net/v1/subscription/status",
    
    // Payment endpoints (bypass payment check)
    "https://rophimapi.net/v1/payment/check",
    "https://rophimapi.net/v1/coin/balance",
    
    // V2 API support (future-proof)
    "https://rophimapi.net/v2/user/info",
    "https://rophimapi.net/v2/user/profile",
  ];

  // ═══════════════════════════════════════════════════════════════
  // 🎨 ADVANCED CSS - Nhiều tùy chỉnh hơn
  // ═══════════════════════════════════════════════════════════════

  const css = `
    /* Primary Colors */
    :root {
      --primary-color: ${CONFIG.THEME_COLOR} !important;
      --primary-text: ${CONFIG.THEME_COLOR} !important;
      --accent-color: ${CONFIG.THEME_COLOR} !important;
    }
    
    /* Developer Badge */
    .dev.dev-up {
      color: ${CONFIG.THEME_COLOR} !important;
      text-shadow: 0 0 10px ${CONFIG.THEME_COLOR}80 !important;
    }
    
    /* IMDB Tags */
    .tag-imdb {
      border: 1px solid ${CONFIG.THEME_COLOR} !important;
      box-shadow: 0 0 5px ${CONFIG.THEME_COLOR}40 !important;
    }
    .tag-imdb:before {
      color: ${CONFIG.THEME_COLOR} !important;
    }
    
    /* VIP Badge */
    .vip-badge, .badge-vip {
      background: ${CONFIG.THEME_COLOR} !important;
      color: #000 !important;
      animation: vip-glow 2s infinite !important;
    }
    
    @keyframes vip-glow {
      0%, 100% { box-shadow: 0 0 10px ${CONFIG.THEME_COLOR}80; }
      50% { box-shadow: 0 0 20px ${CONFIG.THEME_COLOR}; }
    }
    
    /* Buttons */
    .btn-primary, .button-primary {
      background: ${CONFIG.THEME_COLOR} !important;
      border-color: ${CONFIG.THEME_COLOR} !important;
    }
    .btn-primary:hover, .button-primary:hover {
      background: ${CONFIG.THEME_COLOR}dd !important;
      transform: scale(1.05) !important;
      transition: all 0.3s ease !important;
    }
    
    /* Hide Ads */
    ${CONFIG.HIDE_ADS ? `
    .app-box-fix,
    .advertisement,
    .ads-container,
    [class*="ad-"],
    [id*="ad-"],
    .banner-ads {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
    }
    ` : ''}
    
    /* VIP Indicator */
    .user-info::after {
      content: "⭐ VIP" !important;
      color: ${CONFIG.THEME_COLOR} !important;
      margin-left: 8px !important;
      font-weight: bold !important;
      animation: vip-pulse 1.5s infinite !important;
    }
    
    @keyframes vip-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `;

  // ═══════════════════════════════════════════════════════════════
  // 💾 CACHE SYSTEM
  // ═══════════════════════════════════════════════════════════════

  const responseCache = new Map();

  function getCachedResponse(url) {
    if (!CONFIG.ENABLE_CACHE) return null;
    const cached = responseCache.get(url);
    if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
      debug("📦 Using cached response for:", url);
      return cached.data;
    }
    return null;
  }

  function setCachedResponse(url, data) {
    if (!CONFIG.ENABLE_CACHE) return;
    responseCache.set(url, {
      data: data,
      timestamp: Date.now(),
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 🐛 DEBUG LOGGER
  // ═══════════════════════════════════════════════════════════════

  function debug(...args) {
    if (CONFIG.DEBUG_MODE) {
      console.log(
        "%c[Rophim Bypass]",
        "background: #51f085; color: #000; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
        ...args
      );
    }
  }

  function warn(...args) {
    if (CONFIG.DEBUG_MODE) {
      console.warn("%c[Rophim Bypass]", "color: #ff9800; font-weight: bold;", ...args);
    }
  }

  function error(...args) {
    console.error("%c[Rophim Bypass]", "color: #f44336; font-weight: bold;", ...args);
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎲 ANTI-DETECTION - Randomization
  // ═══════════════════════════════════════════════════════════════

  function getRandomCoinBalance() {
    if (!CONFIG.RANDOMIZE_COINS) return CONFIG.COIN_BALANCE;
    // Random từ 998,000,000 đến 999,999,999
    return Math.floor(Math.random() * 2000000) + 998000000;
  }

  function addRandomDelay(ms = 10) {
    // Add random delay 0-10ms để tự nhiên hơn
    return new Promise((resolve) => setTimeout(resolve, Math.random() * ms));
  }

  // ═══════════════════════════════════════════════════════════════
  // 💉 CSS INJECTION
  // ═══════════════════════════════════════════════════════════════

  let cssInjected = false;
  
  function injectCSSOnce() {
    if (cssInjected || !CONFIG.AUTO_INJECT_CSS) return;
    cssInjected = true;
    
    debug("💉 Injecting custom CSS...");
    
    const style = document.createElement("style");
    style.id = "rophim-bypass-css";
    style.textContent = css;
    document.documentElement.appendChild(style);
    
    debug("✅ CSS injected successfully!");
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔧 PATCH USER INFO - Advanced Version
  // ═══════════════════════════════════════════════════════════════

  function patchUserInfo(data, url = "") {
    if (!data) return data;
    
    debug("🔧 Patching response from:", url);
    
    // Check cache first
    const cached = getCachedResponse(url);
    if (cached) return cached;

    const patchData = {
      vip_expires_at: CONFIG.VIP_EXPIRY_TIMESTAMP, // 18/07/2099
      coin_balance: getRandomCoinBalance(),
      is_vip: CONFIG.IS_VIP,
      // Additional fields
      vip_status: "active",
      subscription_type: "lifetime",
      premium: true,
      is_premium: true,
      account_type: "vip",
      membership: "premium",
      role: "vip_user",
    };

    // Patch result.user object (nested)
    if (data?.result?.user) {
      Object.assign(data.result.user, patchData);
      debug("✅ Patched result.user:", data.result.user);
    }

    // Patch result object (root level)
    if (data?.result) {
      Object.assign(data.result, patchData);
      debug("✅ Patched result:", {
        is_vip: data.result.is_vip,
        coin_balance: data.result.coin_balance,
        vip_expires_at: data.result.vip_expires_at,
        expiry_date: new Date(data.result.vip_expires_at * 1000).toLocaleString("vi-VN"),
      });
    }

    // Patch data object (direct)
    if (data && !data.result) {
      Object.assign(data, patchData);
      debug("✅ Patched data:", data);
    }

    // Inject CSS (first time)
    injectCSSOnce();

    // Cache response
    setCachedResponse(url, data);

    return data;
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎯 URL CHECKER
  // ═══════════════════════════════════════════════════════════════

  function isTarget(url) {
    if (!url) return false;
    const matches = TARGETS.some((t) => url.includes(t));
    if (matches) {
      debug("🎯 Target matched:", url);
    }
    return matches;
  }

  // ═══════════════════════════════════════════════════════════════
  // 🌐 FETCH() API HOOK - Enhanced
  // ═══════════════════════════════════════════════════════════════

  async function handleJsonResponse(res, url) {
    if (!isTarget(url)) return res;

    try {
      // Add random delay for stealth
      if (CONFIG.STEALTH_MODE) {
        await addRandomDelay();
      }

      const clone = res.clone();
      const contentType = clone.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        debug("📥 Intercepted JSON response from:", url);
        
        const data = await clone.json();
        const patched = patchUserInfo(data, url);

        return new Response(JSON.stringify(patched), {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        });
      }
    } catch (err) {
      error("❌ Error handling fetch response:", err);
    }

    return res;
  }

  const realFetch = window.fetch;
  
  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : input.url;
    
    debug("🌐 Fetch called:", url);
    
    const res = await realFetch.apply(this, arguments);
    return handleJsonResponse(res, url);
  };

  debug("✅ fetch() API hooked!");

  // ═══════════════════════════════════════════════════════════════
  // 📡 XMLHttpRequest HOOK - Enhanced
  // ═══════════════════════════════════════════════════════════════

  const RealXHR = window.XMLHttpRequest;
  
  window.XMLHttpRequest = function () {
    const xhr = new RealXHR();
    let targetUrl = "";

    // Hook open()
    const origOpen = xhr.open;
    xhr.open = function (method, url, async, user, pass) {
      targetUrl = url;
      debug("📡 XHR.open called:", method, url);
      return origOpen.apply(this, arguments);
    };

    // Hook send()
    const origSend = xhr.send;
    xhr.send = function () {
      this.addEventListener("load", async function () {
        if (isTarget(targetUrl)) {
          try {
            // Add random delay for stealth
            if (CONFIG.STEALTH_MODE) {
              await addRandomDelay();
            }

            const contentType = xhr.getResponseHeader("content-type") || "";
            
            if (contentType.includes("application/json")) {
              debug("📥 Intercepted XHR response from:", targetUrl);
              
              const data = JSON.parse(xhr.responseText);
              const patched = patchUserInfo(data, targetUrl);

              // Override properties
              Object.defineProperty(xhr, "responseText", {
                writable: true,
                value: JSON.stringify(patched),
              });
              Object.defineProperty(xhr, "response", {
                writable: true,
                value: JSON.stringify(patched),
              });

              debug("✅ XHR response patched!");
            }
          } catch (err) {
            error("❌ Error patching XHR response:", err);
          }
        }
      });
      return origSend.apply(this, arguments);
    };

    return xhr;
  };

  debug("✅ XMLHttpRequest hooked!");

  // ═══════════════════════════════════════════════════════════════
  // 🛡️ ANTI-TAMPER DETECTION
  // ═══════════════════════════════════════════════════════════════

  if (CONFIG.STEALTH_MODE) {
    // Hide script modification traces
    try {
      // Make hooks look native
      Object.defineProperty(window.fetch, "toString", {
        value: function () {
          return "function fetch() { [native code] }";
        },
      });

      Object.defineProperty(window.XMLHttpRequest, "toString", {
        value: function () {
          return "function XMLHttpRequest() { [native code] }";
        },
      });

      debug("🛡️ Stealth mode activated!");
    } catch (err) {
      warn("⚠️ Could not apply stealth mode:", err);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎮 GLOBAL CONTROL - Có thể control từ console
  // ═══════════════════════════════════════════════════════════════

  window.RophimBypass = {
    version: "2.0 Advanced",
    config: CONFIG,
    
    // Methods
    enableDebug: () => {
      CONFIG.DEBUG_MODE = true;
      console.log("✅ Debug mode enabled!");
    },
    
    disableDebug: () => {
      CONFIG.DEBUG_MODE = false;
      console.log("✅ Debug mode disabled!");
    },
    
    setThemeColor: (color) => {
      CONFIG.THEME_COLOR = color;
      if (cssInjected) {
        document.getElementById("rophim-bypass-css")?.remove();
        cssInjected = false;
        injectCSSOnce();
      }
      console.log("✅ Theme color changed to:", color);
    },
    
    clearCache: () => {
      responseCache.clear();
      console.log("✅ Cache cleared!");
    },
    
    getStats: () => {
      return {
        version: "2.0",
        endpoints: TARGETS.length,
        cacheSize: responseCache.size,
        cssInjected: cssInjected,
        debugMode: CONFIG.DEBUG_MODE,
        stealthMode: CONFIG.STEALTH_MODE,
      };
    },
    
    info: () => {
      console.log(`
╔═══════════════════════════════════════════════════════════════╗
║            🎬 ROPHIM VIP BYPASS v2.0 ADVANCED                ║
╚═══════════════════════════════════════════════════════════════╝

📊 Status:
   • VIP Expiry: 18/07/2099 (${new Date(CONFIG.VIP_EXPIRY_TIMESTAMP * 1000).toLocaleString("vi-VN")})
   • Coin Balance: ${CONFIG.COIN_BALANCE.toLocaleString("vi-VN")}
   • Endpoints Hooked: ${TARGETS.length}
   • Cache Entries: ${responseCache.size}
   • CSS Injected: ${cssInjected ? "✅" : "❌"}

⚙️ Settings:
   • Debug Mode: ${CONFIG.DEBUG_MODE ? "✅" : "❌"}
   • Stealth Mode: ${CONFIG.STEALTH_MODE ? "✅" : "❌"}
   • Theme Color: ${CONFIG.THEME_COLOR}
   • Hide Ads: ${CONFIG.HIDE_ADS ? "✅" : "❌"}

🎮 Console Commands:
   • RophimBypass.enableDebug()  - Bật debug
   • RophimBypass.disableDebug() - Tắt debug
   • RophimBypass.setThemeColor('#color') - Đổi màu
   • RophimBypass.clearCache()   - Xóa cache
   • RophimBypass.getStats()     - Xem stats
   • RophimBypass.info()         - Help này

Made with ❤️ by Community
      `);
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // 🚀 INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  // Special handling for goatembed.com
  if (location.hostname.includes("goatembed.com")) {
    debug("🎬 goatembed.com detected, injecting CSS only...");
    injectCSSOnce();
    return;
  }

  // Log startup info
  debug("🚀 Rophim VIP Bypass v2.0 Advanced loaded!");
  debug("📅 VIP Expiry:", new Date(CONFIG.VIP_EXPIRY_TIMESTAMP * 1000).toLocaleString("vi-VN"));
  debug("💰 Coin Balance:", CONFIG.COIN_BALANCE.toLocaleString("vi-VN"));
  debug("🎯 Hooked", TARGETS.length, "endpoints");
  debug("Type 'RophimBypass.info()' for help");

  // Show info banner (only if debug enabled)
  if (CONFIG.DEBUG_MODE) {
    console.log(
      "%c🎬 Rophim VIP Bypass v2.0 Advanced",
      "font-size: 16px; font-weight: bold; color: #51f085; text-shadow: 0 0 5px #51f08580;"
    );
    console.log("%cType 'RophimBypass.info()' for help", "color: #51f085;");
  }
})();
