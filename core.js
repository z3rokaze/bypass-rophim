(function () {
  "use strict";

  const TARGETS = [
    "https://rophimapi.net/v1/user/info",
    "https://rophimapi.net/v1/user/updateProfile",
    "https://rophimapi.net/v1/auth/login",
  ];

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

  let cssInjected = false;
  function injectCSSOnce() {
    if (cssInjected) return;
    cssInjected = true;
    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  if (location.hostname.includes("goatembed.com")) {
    injectCSSOnce();
    return;
  }

  function patchUserInfo(data) {
    if (data?.result) {
      if (data.result.user) {
        Object.assign(data.result.user, {
          vip_expires_at: 2524608000,
          coin_balance: 999999999,
          is_vip: true,
        });
      }
      Object.assign(data.result, {
        vip_expires_at: 2524608000,
        coin_balance: 999999999,
        is_vip: true,
      });
    }
    injectCSSOnce();
    return data;
  }

  function isTarget(url) {
    return TARGETS.some((t) => url.includes(t));
  }

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
              Object.defineProperty(this, "responseText", { value: JSON.stringify(patched) });
              Object.defineProperty(this, "response", { value: JSON.stringify(patched) });
            }
          } catch (_) {}
        }
      });
      return origSend.apply(this, arguments);
    };

    return xhr;
  };
})();
