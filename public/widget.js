/*!
 * Buildr Studio embeddable agent widget.
 * Usage:
 *   <script src="https://buildrstudio.in/widget.js"
 *           data-agent-id="support-agent-starter"
 *           data-key="pk_live_xxxxxxxx"></script>
 * Optional overrides via window.BuildrAgentConfig = { greeting, color, position, apiUrl, leadsUrl, configUrl }
 * set *before* this script tag. When the agent can't answer (or the visitor
 * asks for a person), the widget shows a small lead form that posts to
 * /api/v1/leads; there's also a "Talk to a person" link in the header.
 * Greeting/color/position saved in the dashboard are fetched from
 * /api/v1/config; anything set in window.BuildrAgentConfig wins.
 * Renders in a Shadow DOM so host page CSS never leaks in (and this widget's
 * CSS never leaks out).
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

  // ── Config resolution ──────────────────────────────────────────────────
  // Priority: window.BuildrAgentConfig (set on the page) > the install's
  // saved dashboard config (GET /api/v1/config) > defaults. The saved config
  // is cached in localStorage so repeat page views render instantly with the
  // right color/position; the first-ever view waits briefly (max 1.5s) for it
  // rather than flashing the wrong style. The widget is position:fixed, so it
  // never shifts the host page's layout either way.
  var userConfig = window.BuildrAgentConfig || {};
  var DEFAULTS = { greeting: "Hi! How can I help you today?", color: "#2563EB", position: "bottom-right" };
  // Default to the canonical www host: the apex (buildrstudio.in) answers
  // with a 307 to www, and browsers refuse to follow a redirect on a CORS
  // preflight ("Redirect is not allowed for a preflight request"), which
  // broke chat + lead POSTs (and the redirect response has no
  // Access-Control-Allow-Origin, so the config GET failed too) on every
  // customer site. Loading this script via the apex URL is fine — plain
  // <script> loads follow redirects — only fetch() needs the direct host.
  var apiUrl = userConfig.apiUrl || apiUrlAttr || "https://www.buildrstudio.in/api/v1/chat";
  var configUrl =
    userConfig.configUrl ||
    apiUrl.replace(/\/chat\/?$/, "/config") + "?key=" + encodeURIComponent(apiKey) + "&agent=" + encodeURIComponent(agentId);
  var CONFIG_CACHE_KEY = "buildr_agent_config_" + agentId;

  function hexColor(c) {
    return typeof c === "string" && /^#[0-9a-fA-F]{3,8}$/.test(c) ? c : null;
  }
  function pageColor(c) {
    // Site owner's own override: allow any CSS color, minus characters that
    // could break out of the style rule.
    return typeof c === "string" && c && !/[;{}<>"'\\]/.test(c) ? c : null;
  }
  function positionOf(p) {
    return p === "bottom-left" || p === "bottom-right" ? p : null;
  }
  function resolveConfig(remote) {
    remote = remote || {};
    return {
      greeting: userConfig.greeting || (typeof remote.greeting === "string" && remote.greeting) || DEFAULTS.greeting,
      color: pageColor(userConfig.color) || hexColor(remote.color) || DEFAULTS.color,
      position: positionOf(userConfig.position) || positionOf(remote.position) || DEFAULTS.position,
      apiUrl: apiUrl,
      leadsUrl: userConfig.leadsUrl || apiUrl.replace(/\/chat\/?$/, "/leads"),
    };
  }

  var cachedRemote = null;
  try {
    cachedRemote = JSON.parse(localStorage.getItem(CONFIG_CACHE_KEY) || "null");
  } catch {
    /* no cache */
  }

  var liveConfig = null;
  function start(remote) {
    if (liveConfig) return;
    liveConfig = resolveConfig(remote);
    var cfg = liveConfig;
    if (document.body) init(cfg);
    else document.addEventListener("DOMContentLoaded", function () {
      init(cfg);
    });
  }

  var needsRemote = !(userConfig.greeting && userConfig.color && userConfig.position);
  if (!needsRemote) {
    start(null);
  } else {
    if (cachedRemote) start(cachedRemote);
    else setTimeout(function () {
      start(null);
    }, 1500);
    fetch(configUrl, { credentials: "omit" })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (remote) {
        if (!remote || remote.error) return start(cachedRemote);
        var slim = { greeting: remote.greeting, color: remote.color, position: remote.position };
        try {
          localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(slim));
        } catch {
          /* ignore */
        }
        if (!liveConfig) return start(slim);
        // Already rendered from cache: the greeting is read lazily, so it can
        // update now; color/position changes apply on the next page view.
        liveConfig.greeting = resolveConfig(slim).greeting;
      })
      .catch(function () {
        start(cachedRemote);
      });
  }

  function init(config) {
    var LEAD_KEY = "buildr_agent_lead_" + agentId;

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
      ".head .human{font-size:12px;font-weight:500;text-decoration:underline;text-underline-offset:2px;margin-right:6px}" +
      ".lead{align-self:stretch;background:#fff;border:1px solid #eaeaea;border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:7px}" +
      ".lead p{margin:0 0 2px;font-size:13px;color:#1a1a1a;line-height:1.45}" +
      ".lead input,.lead textarea{width:100%;border:1px solid #ddd;border-radius:8px;padding:8px 10px;font-size:13px;outline:none;resize:vertical;color:#1a1a1a;background:#fff}" +
      ".lead input:focus,.lead textarea:focus{border-color:" + config.color + "}" +
      ".lead .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}" +
      ".lead .row{display:flex;gap:8px;align-items:center}" +
      ".lead button{background:" + config.color + ";color:#fff;border:none;border-radius:8px;padding:9px 12px;font-size:13px;font-weight:600;cursor:pointer}" +
      ".lead button.ghost{background:none;color:#666;font-weight:500;padding:9px 4px}" +
      ".lead button:disabled{opacity:.6;cursor:default}" +
      ".lead .err{color:#B91C1C;font-size:12px}" +
      ".lead a.wa{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:#25D366;color:#fff;text-decoration:none;border-radius:8px;padding:9px 12px;font-size:13px;font-weight:600}" +
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
        '<div class="head"><span>Chat with us</span><span><button class="human" type="button">Talk to a person</button><button class="close" aria-label="Close chat">&#10005;</button></span></div>' +
        '<div class="msgs"></div>' +
        '<div class="inputRow">' +
          '<input type="text" placeholder="Type a message…" />' +
          '<button aria-label="Send"><svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>' +
        "</div>" +
      "</div>";
    root.appendChild(wrap);

    var bubble = root.querySelector(".bubble");
    var panel = root.querySelector(".panel");
    var closeBtn = root.querySelector(".head .close");
    var humanBtn = root.querySelector(".head .human");
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

    // ── Lead form (handoff to a person) ─────────────────────────────────────
    var leadFormOpen = false;

    function leadAlreadySent() {
      try {
        return localStorage.getItem(LEAD_KEY) === "1";
      } catch {
        return false;
      }
    }

    function el(tag, attrs, text) {
      var node = document.createElement(tag);
      for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) node.setAttribute(k, attrs[k]);
      if (text) node.textContent = text;
      return node;
    }

    function showLeadForm(trigger) {
      if (leadFormOpen) return;
      leadFormOpen = true;
      var form = el("form", { class: "lead", novalidate: "" });
      form.appendChild(
        el(
          "p",
          {},
          trigger === "manual"
            ? "Leave your details and someone from the team will get back to you."
            : "Want someone from the team to get back to you? Leave your details.",
        ),
      );
      var name = el("input", { type: "text", name: "name", placeholder: "Your name", autocomplete: "name", maxlength: "120", required: "" });
      var email = el("input", { type: "email", name: "email", placeholder: "Email", autocomplete: "email", maxlength: "200", required: "" });
      var phone = el("input", { type: "tel", name: "phone", placeholder: "Phone (optional)", autocomplete: "tel", maxlength: "30" });
      var message = el("textarea", { name: "message", rows: "2", placeholder: "Anything we should know? (optional)", maxlength: "2000" });
      var hp = el("input", { type: "text", name: "website", class: "hp", tabindex: "-1", autocomplete: "off", "aria-hidden": "true" });
      var err = el("div", { class: "err", role: "alert" });
      var row = el("div", { class: "row" });
      var submit = el("button", { type: "submit" }, "Send");
      var cancel = el("button", { type: "button", class: "ghost" }, "No thanks");
      row.appendChild(submit);
      row.appendChild(cancel);
      [name, email, phone, message, hp, err, row].forEach(function (n) {
        form.appendChild(n);
      });
      msgsEl.appendChild(form);
      msgsEl.scrollTop = msgsEl.scrollHeight;
      name.focus();

      cancel.addEventListener("click", function () {
        form.remove();
        leadFormOpen = false;
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        err.textContent = "";
        if (!name.value.trim()) return (err.textContent = "Please add your name.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) return (err.textContent = "Please add a valid email.");
        submit.disabled = true;
        fetch(config.leadsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
          body: JSON.stringify({
            agent_id: agentId,
            session_id: sessionId,
            name: name.value,
            email: email.value,
            phone: phone.value,
            message: message.value,
            website: hp.value,
            trigger: trigger,
            page_url: location.href.slice(0, 500),
          }),
        })
          .then(function (res) {
            return res.json().then(function (data) {
              return { ok: res.ok, data: data };
            });
          })
          .then(function (result) {
            if (!result.ok) {
              err.textContent = (result.data && result.data.error) || "Couldn't send. Please try again.";
              submit.disabled = false;
              return;
            }
            try {
              localStorage.setItem(LEAD_KEY, "1");
            } catch {
              /* ignore */
            }
            var done = el("div", { class: "lead" });
            done.appendChild(el("p", {}, "Thanks, " + name.value.trim() + "! Someone will get back to you at " + email.value.trim() + "."));
            var wa = result.data && result.data.whatsapp_url;
            if (typeof wa === "string" && wa.indexOf("https://wa.me/") === 0) {
              var link = el("a", { class: "wa", href: wa, target: "_blank", rel: "noopener noreferrer" }, "Chat on WhatsApp now");
              done.appendChild(link);
            }
            form.replaceWith(done);
            leadFormOpen = false;
            msgsEl.scrollTop = msgsEl.scrollHeight;
          })
          .catch(function () {
            err.textContent = "Couldn't send. Please try again.";
            submit.disabled = false;
          });
      });
    }

    humanBtn.addEventListener("click", function () {
      if (!panel.classList.contains("open")) togglePanel();
      showLeadForm("manual");
    });

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
        body: JSON.stringify({
          agent_id: agentId,
          message: text,
          session_id: sessionId,
          page_url: sessionId ? undefined : location.href.slice(0, 500),
        }),
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
          // The API flags replies where the agent couldn't help or the visitor
          // asked for a person — offer the lead form once (unless already sent).
          if (result.data.handoff && !leadAlreadySent()) {
            showLeadForm(result.data.handoff.reason === "asked_human" ? "asked_human" : "no_answer");
          }
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
  }
})();
