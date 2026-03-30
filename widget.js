
(function () {
  const CONFIG = {
    botName: window.AivaConfig?.botName || "Aiva",
    primaryColor: window.AivaConfig?.primaryColor || "#6c47ff",
    greeting: window.AivaConfig?.greeting || "Hi there! 👋 How can I help you today?",
    apiKey: window.AivaConfig?.apiKey || "demo",
    position: window.AivaConfig?.position || "right",
  };

  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

    #aiva-widget-btn {
      position: fixed;
      bottom: 28px;
      ${CONFIG.position === "left" ? "left: 28px;" : "right: 28px;"}
      width: 60px; height: 60px;
      background: ${CONFIG.primaryColor};
      border-radius: 50%;
      border: none;
      cursor: pointer;
      box-shadow: 0 8px 32px ${CONFIG.primaryColor}66;
      display: flex; align-items: center; justify-content: center;
      z-index: 99999;
      transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
    }
    #aiva-widget-btn:hover {
      transform: scale(1.12);
      box-shadow: 0 12px 40px ${CONFIG.primaryColor}88;
    }
    #aiva-widget-btn svg { transition: transform 0.3s; }
    #aiva-widget-btn.open svg { transform: rotate(45deg); }

    #aiva-pulse {
      position: absolute;
      width: 60px; height: 60px;
      border-radius: 50%;
      background: ${CONFIG.primaryColor};
      animation: aivaPulse 2s ease-out infinite;
      z-index: -1;
    }
    @keyframes aivaPulse {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.7); opacity: 0; }
    }

    #aiva-chat-box {
      position: fixed;
      bottom: 100px;
      ${CONFIG.position === "left" ? "left: 28px;" : "right: 28px;"}
      width: 370px;
      max-height: 560px;
      background: #0d0d12;
      border-radius: 20px;
      overflow: hidden;
      z-index: 99998;
      display: none;
      flex-direction: column;
      box-shadow: 0 24px 80px #00000080, 0 0 0 1px #ffffff12;
      font-family: 'DM Sans', sans-serif;
      transform: translateY(20px);
      opacity: 0;
      transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.3s;
    }
    #aiva-chat-box.visible {
      transform: translateY(0);
      opacity: 1;
    }

    #aiva-header {
      background: linear-gradient(135deg, ${CONFIG.primaryColor}ee, ${CONFIG.primaryColor}99);
      padding: 18px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    #aiva-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: #ffffff22;
      border: 2px solid #ffffff44;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    }
    #aiva-header-info h4 {
      margin: 0;
      color: #fff;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 15px;
    }
    #aiva-header-info span {
      color: #ffffff99;
      font-size: 12px;
    }
    #aiva-online-dot {
      width: 8px; height: 8px;
      background: #4ade80;
      border-radius: 50%;
      display: inline-block;
      margin-right: 5px;
      animation: blink 2s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    #aiva-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 360px;
      scrollbar-width: thin;
      scrollbar-color: #ffffff22 transparent;
    }

    .aiva-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      animation: msgIn 0.3s ease;
    }
    @keyframes msgIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .aiva-msg.bot {
      background: #1e1e2e;
      color: #e2e2f0;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      border: 1px solid #ffffff0f;
    }
    .aiva-msg.user {
      background: ${CONFIG.primaryColor};
      color: #fff;
      border-bottom-right-radius: 4px;
      align-self: flex-end;
    }

    .aiva-typing {
      display: flex; gap: 5px; align-items: center;
      padding: 10px 14px;
      background: #1e1e2e;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      border: 1px solid #ffffff0f;
    }
    .aiva-typing span {
      width: 7px; height: 7px;
      background: #ffffff55;
      border-radius: 50%;
      animation: typingDot 1.2s infinite;
    }
    .aiva-typing span:nth-child(2) { animation-delay: 0.2s; }
    .aiva-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    #aiva-input-area {
      padding: 12px;
      background: #13131f;
      display: flex;
      gap: 8px;
      align-items: center;
      border-top: 1px solid #ffffff0f;
    }
    #aiva-input {
      flex: 1;
      background: #1e1e2e;
      border: 1px solid #ffffff15;
      border-radius: 12px;
      padding: 10px 14px;
      color: #e2e2f0;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    #aiva-input::placeholder { color: #ffffff44; }
    #aiva-input:focus { border-color: ${CONFIG.primaryColor}88; }
    #aiva-send-btn {
      width: 40px; height: 40px;
      background: ${CONFIG.primaryColor};
      border: none;
      border-radius: 10px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, opacity 0.2s;
      flex-shrink: 0;
    }
    #aiva-send-btn:hover { transform: scale(1.08); }
    #aiva-send-btn:disabled { opacity: 0.4; cursor: default; transform: none; }

    #aiva-footer {
      text-align: center;
      font-size: 11px;
      color: #ffffff33;
      padding: 6px;
      background: #13131f;
      font-family: 'DM Sans', sans-serif;
    }
    #aiva-footer a { color: ${CONFIG.primaryColor}; text-decoration: none; }

    @media (max-width: 420px) {
      #aiva-chat-box { width: calc(100vw - 24px); right: 12px; left: 12px; }
    }
  `;
  document.head.appendChild(style);

  // Build widget HTML
  const btn = document.createElement("button");
  btn.id = "aiva-widget-btn";
  btn.innerHTML = `
    <div id="aiva-pulse"></div>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  `;

  const box = document.createElement("div");
  box.id = "aiva-chat-box";
  box.innerHTML = `
    <div id="aiva-header">
      <div id="aiva-avatar">🤖</div>
      <div id="aiva-header-info">
        <h4>${CONFIG.botName}</h4>
        <span><span id="aiva-online-dot"></span>Online — typically replies instantly</span>
      </div>
    </div>
    <div id="aiva-messages"></div>
    <div id="aiva-input-area">
      <input id="aiva-input" type="text" placeholder="Type your message..." autocomplete="off" />
      <button id="aiva-send-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
    <div id="aiva-footer">Powered by <a href="#" target="_blank">Aiva AI</a></div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(box);

  const messagesEl = box.querySelector("#aiva-messages");
  const inputEl = box.querySelector("#aiva-input");
  const sendBtn = box.querySelector("#aiva-send-btn");

  const conversationHistory = [];

  function addMessage(text, role) {
    const msg = document.createElement("div");
    msg.className = `aiva-msg ${role}`;
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "aiva-typing";
    el.id = "aiva-typing-indicator";
    el.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById("aiva-typing-indicator");
    if (el) el.remove();
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = "";
    sendBtn.disabled = true;
    addMessage(text, "user");
    conversationHistory.push({ role: "user", content: text });
    showTyping();

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { 
  "Content-Type": "application/json",
  "x-api-key": "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",
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true"
},
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are ${CONFIG.botName}, a helpful AI assistant embedded on a website. Be concise, friendly, and helpful. Keep responses under 3 sentences when possible.`,
          messages: conversationHistory,
        }),
      });

      const data = await res.json();
      hideTyping();

      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again.";
      conversationHistory.push({ role: "assistant", content: reply });
      addMessage(reply, "bot");
    } catch (e) {
      hideTyping();
      addMessage("Oops! Something went wrong. Please try again.", "bot");
    }

    sendBtn.disabled = false;
    inputEl.focus();
  }

  // Toggle open/close
  let isOpen = false;
  btn.addEventListener("click", () => {
    isOpen = !isOpen;
    btn.classList.toggle("open", isOpen);
    if (isOpen) {
      box.style.display = "flex";
      requestAnimationFrame(() => box.classList.add("visible"));
      if (messagesEl.children.length === 0) {
        addMessage(CONFIG.greeting, "bot");
      }
      inputEl.focus();
    } else {
      box.classList.remove("visible");
      setTimeout(() => (box.style.display = "none"), 350);
    }
  });

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
