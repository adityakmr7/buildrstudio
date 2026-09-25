/*!
 * Buildr Studio embeddable agent widget.
 * Usage:
 *   <script src="https://buildrstudio.in/widget.js"
 *           data-agent-id="support-agent-starter"
 *           data-key="pk_live_xxxxxxxx"></script>
 * Optional overrides via window.BuildrAgentConfig = { greeting, color, position, apiUrl }
 * set *before* this script tag. Renders in a Shadow DOM so host page CSS
 * never leaks in (and this widget's CSS never leaks out).
 */
(function () {
  "use strict";

  var scriptTag = document.currentScript;
  if (!scriptTag) return;

  var agentId = scriptTag.getAttribute("data-agent-id");
  var apiKey = scriptTag.getAttribute("data-key");
  var apiUrlAttr = scriptTag.getAttribute("data-api-url");
  if (!agentId || !apiKey) {
    console.error("[BuildrAgent] Missing data-agent-id or data-key on the widget script tag.");
    return;
  }

  var userConfig = window.BuildrAgentConfig || {};
  var config = {
    greeting: userConfig.greeting || "Hi! How can I help you today?",
    color: userConfig.color || "#2563EB",
    position: userConfig.position || "bottom-right", // "bottom-right" | "bottom-left"
    apiUrl: userConfig.apiUrl || apiUrlAttr || "https://buildrstudio.in/api/v1/chat",
  };

  var STORAGE_KEY = "buildr_agent_session_" + agentId;
  var sessionId = null;
  try {
    sessionId = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* localStorage unavailable (privacy mode etc.) — session just won't persist */
  }

  var side = config.position === "bottom-left" ? "left" : "right";

  // ── Host + Shadow root ─────────────────────────────────────────────────
  var host = document.createElement("div");
  host.id = "buildr-agent-widget-host";
  host.style.cssText = "position:fixed;bottom:0;" + side + ":0;z-index:2147483000;";
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: "open" });

  var style = document.createElement("style");
  style.textContent =
    ":host{all:initial}" +
    "*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}" +
    ".bubble{position:fixed;bottom:20px;" + side + ":20px;width:56px;height:56px;border-radius:50%;" +
      "background:" + config.color + ";box-shadow:0 8px 24px rgba(0,0,0,0.2);border:none;cursor:pointer;" +
      "display:flex;align-items:center;justify-content:center;transition:transform .15s;}" +
    ".bubble:hover{transform:scale(1.06)}" +
    ".bubble svg{width:26px;height:26px;fill:#fff}" +
    ".panel{position:fixed;bottom:88px;" + side + ":20px;width:340px;max-width:calc(100vw - 40px);" +
      "height:480px;max-height:calc(100vh - 140px);background:#fff;border-radius:16px;" +
      "box-shadow:0 16px 48px rgba(0,0,0,0.22);display:none;flex-direction:column;overflow:hidden;}" +
    ".panel.open{display:flex}" +
    ".head{background:" + config.color + ";color:#fff;padding:14px 16px;font-size:14px;font-weight:600;" +
      "display:flex;align-items:center;justify-content:space-between;flex-shrink:0}" +
    ".head button{background:none;border:none;color:#fff;cursor:pointer;padding:4px;opacity:.85}" +
    ".head button:hover{opacity:1}" +
    ".msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#F7F8FA}" +
    ".msg{max-width:80%;padding:9px 13px;border-radius:12px;font-size:13.5px;line-height:1.5;white-space:pre-wrap;word-break:break-word}" +
    ".msg.user{align-self:flex-end;background:" + config.color + ";color:#fff;border-bottom-right-radius:3px}" +
    ".msg.assistant{align-self:flex-start;background:#fff;color:#1a1a1a;border:1px solid #eaeaea;border-bottom-left-radius:3px}" +
    ".msg.error{align-self:flex-start;background:#FEF2F2;color:#B91C1C;border:1px solid #FCA5A5}" +
    ".typing{align-self:flex-start;display:flex;gap:4px;padding:10px 13px;background:#fff;border:1px solid #eaeaea;border-radius:12px}" +
    ".typing span{width:6px;height:6px;border-radius:50%;background:#c4c4c4;animation:bounce 1.2s infinite}" +
    ".typing span:nth-child(2){animation-delay:.15s}.typing span:nth-child(3){animation-delay:.3s}" +
    "@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}" +
    ".inputRow{display:flex;gap:8px;padding:10px;border-top:1px solid #eee;flex-shrink:0;background:#fff}" +
    ".inputRow input{flex:1;border:1px solid #ddd;border-radius:10px;padding:9px 12px;font-size:13.5px;outline:none}" +
    ".inputRow input:focus{border-color:" + config.color + "}" +
    ".inputRow button{background:" + config.color + ";border:none;border-radius:10px;width:38px;height:38px;" +
      "cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}" +
    ".inputRow button svg{width:16px;height:16px;fill:#fff}" +
    ".inputRow button:disabled{opacity:.5;cursor:default}";
  root.appendChild(style);

  var wrap = document.createElement("div");
  wrap.innerHTML =
    '<button class="bubble" aria-label="Open chat">' +
      '<svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3V4z"/></svg>' +
    "</button>" +
    '<div class="panel">' +
      '<div class="head"><span>Chat with us</span><button aria-label="Close chat">&#10005;</button></div>' +
      '<div class="msgs"></div>' +
      '<div class="inputRow">' +
        '<input type="text" placeholder="Type a message…" />' +
        '<button aria-label="Send"><svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>' +
      "</div>" +
    "</div>";
  root.appendChild(wrap);

  var bubble = root.querySelector(".bubble");
  var panel = root.querySelector(".panel");
  var closeBtn = root.querySelector(".head button");
  var msgsEl = root.querySelector(".msgs");
  var input = root.querySelector(".inputRow input");
  var sendBtn = root.querySelector(".inputRow button");

  var greeted = false;

  function addMessage(role, text) {
    var el = document.createElement("div");
    el.className = "msg " + role;
    el.textContent = text;
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function showTyping() {
    var el = document.createElement("div");
    el.className = "typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return el;
  }

  function togglePanel() {
    var isOpen = panel.classList.toggle("open");
    if (isOpen && !greeted) {
      greeted = true;
      addMessage("assistant", config.greeting);
    }
    if (isOpen) input.focus();
  }

  bubble.addEventListener("click", togglePanel);
  closeBtn.addEventListener("click", togglePanel);

  function send() {
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendBtn.disabled = true;
    addMessage("user", text);
    var typingEl = showTyping();

    fetch(config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({ agent_id: agentId, message: text, session_id: sessionId }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        typingEl.remove();
        if (!result.ok) {
          addMessage("error", (result.data && result.data.error) || "Something went wrong.");
          return;
        }
        if (result.data.session_id) {
          sessionId = result.data.session_id;
          try {
            localStorage.setItem(STORAGE_KEY, sessionId);
          } catch {
            /* localStorage unavailable — session just won't persist */
          }
        }
        addMessage("assistant", result.data.reply || "…");
      })
      .catch(function () {
        typingEl.remove();
        addMessage("error", "Something went wrong. Please try again.");
      })
      .finally(function () {
        sendBtn.disabled = false;
      });
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") send();
  });
})();
