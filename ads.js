/* ============================================================
   ASCENSION ARCADE — REWARDED AD ENGINE
   Drop-in rewarded interstitial wrapper.

   CONFIG:
     Set AD_MODE to one of:
       "placeholder"  → built-in mock ad (default, no setup)
       "adsterra"     → Adsterra direct link (recommended for zero-budget)
       "adsense"      → Google AdSense rewarded (needs approval)

   For Adsterra:
     1. Sign up at adsterra.com (no minimum traffic required)
     2. Create a "Direct Link" campaign
     3. Paste the URL into ADSTERRA_URL below
     4. Set AD_MODE = "adsterra"

   The player MUST wait the full countdown. Closing early = no reward.
   ============================================================ */

const AdConfig = {
  AD_MODE: "placeholder",           // "placeholder" | "adsterra" | "adsense"
  ADSTERRA_URL: "",                 // paste your direct link here
  COUNTDOWN_SECONDS: 15,
  REWARD_AMOUNT: 15
};

/**
 * Show a rewarded ad overlay.
 * @param {Object} opts
 * @param {string} opts.rewardLabel - e.g. "15 Coins"
 * @param {Function} opts.onComplete - called when ad finishes successfully
 * @param {Function} opts.onCancel   - called if user closes early
 */
function showRewardedAd({ rewardLabel = "Coins", onComplete, onCancel } = {}) {
  // Build overlay
  const overlay = document.createElement("div");
  overlay.className = "ad-overlay";
  overlay.innerHTML = `
    <div class="ad-shell">
      <div class="ad-topbar">
        <span class="ad-topbar-title">Sponsored Break</span>
        <button class="ad-close" id="ad-close-btn" aria-label="Close ad">✕</button>
      </div>
      <div class="ad-frame-holder" id="ad-frame-holder">
        <!-- Ad content injected below -->
      </div>
      <div class="ad-footer">
        <div class="ad-countdown" id="ad-countdown">Watch to unlock ${rewardLabel}…</div>
        <div class="ad-progress-track"><div class="ad-progress-fill" id="ad-progress-fill"></div></div>
        <button class="ad-claim-btn" id="ad-claim-btn" disabled>Claim Reward</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const holder = overlay.querySelector("#ad-frame-holder");
  const countdownEl = overlay.querySelector("#ad-countdown");
  const progressFill = overlay.querySelector("#ad-progress-fill");
  const claimBtn = overlay.querySelector("#ad-claim-btn");
  const closeBtn = overlay.querySelector("#ad-close-btn");

  // ---- Inject ad content based on mode ----
  if (AdConfig.AD_MODE === "adsterra" && AdConfig.ADSTERRA_URL) {
    // Direct link opens in a new tab. We can't iframe it (X-Frame-Options),
    // so we open it on first interaction and let the countdown run in parallel.
    const adLink = document.createElement("a");
    adLink.href = AdConfig.ADSTERRA_URL;
    adLink.target = "_blank";
    adLink.rel = "noopener";
    adLink.className = "ad-external-link";
    adLink.innerHTML = `
      <div class="ad-external-inner">
        <div class="ad-external-icon">🎁</div>
        <h3>Support the Creator</h3>
        <p>Tap to view our sponsor's offer. Your coins unlock when the timer ends.</p>
        <span class="ad-external-cta">View Sponsor Offer →</span>
      </div>
    `;
    holder.appendChild(adLink);
  } else if (AdConfig.AD_MODE === "adsense" && window.adsbygoogle) {
    // AdSense rewarded slot — user must already have the script loaded
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.style.width = "100%";
    ins.style.height = "250px";
    ins.setAttribute("data-ad-client", "ca-pub-XXXXXXXXXXXX");
    ins.setAttribute("data-ad-slot", "0000000000");
    holder.appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  } else {
    // Placeholder mode — mock ad for testing
    holder.innerHTML = `
      <div class="ad-placeholder">
        <div class="ad-placeholder-glow"></div>
        <div class="ad-placeholder-inner">
          <div class="ad-placeholder-eyebrow">YOUR AD HERE</div>
          <div class="ad-placeholder-icon">⚔️</div>
          <div class="ad-placeholder-title">Ascension Comics</div>
          <div class="ad-placeholder-sub">This space reserved for a rewarded sponsor. Real ad networks drop in via config.</div>
        </div>
      </div>
    `;
  }

  // ---- Countdown engine ----
  let secondsLeft = AdConfig.COUNTDOWN_SECONDS;
  const totalMs = AdConfig.COUNTDOWN_SECONDS * 1000;
  const startedAt = Date.now();
  let completed = false;

  const tick = setInterval(() => {
    const elapsed = Date.now() - startedAt;
    const progress = Math.min(1, elapsed / totalMs);
    progressFill.style.width = (progress * 100) + "%";

    secondsLeft = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
    countdownEl.textContent = `Reward unlocks in ${secondsLeft}s…`;

    if (elapsed >= totalMs) {
      clearInterval(tick);
      completed = true;
      countdownEl.textContent = "✅ Ad complete — claim your reward!";
      claimBtn.disabled = false;
      claimBtn.classList.add("ready");
    }
  }, 100);

  // ---- Close / cancel ----
  closeBtn.onclick = () => {
    if (completed) {
      // Ad already finished, let them claim via button
      return;
    }
    if (confirm("Close early and forfeit your reward?")) {
      clearInterval(tick);
      overlay.remove();
      if (typeof onCancel === "function") onCancel();
    }
  };

  // ---- Claim reward ----
  claimBtn.onclick = () => {
    if (!completed) return;
    overlay.remove();
    clearInterval(tick);
    if (typeof onComplete === "function") onComplete();
  };
}

/* ---- Overlay styles (injected so you don't need to edit CSS files) ---- */
(function injectAdStyles() {
  if (document.getElementById("ad-engine-styles")) return;
  const style = document.createElement("style");
  style.id = "ad-engine-styles";
  style.textContent = `
    .ad-overlay {
      position: fixed; inset: 0;
      background: rgba(5, 3, 9, 0.92);
      backdrop-filter: blur(6px);
      z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      animation: adFadeIn .25s ease;
    }
    @keyframes adFadeIn { from { opacity: 0 } to { opacity: 1 } }

    .ad-shell {
      background: linear-gradient(145deg, #1e1530, #0f0a1c);
      border: 1px solid rgba(126, 232, 255, 0.35);
      border-radius: 18px;
      width: 100%; max-width: 480px;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,.6);
      font-family: "Noto Sans", "DM Sans", system-ui, sans-serif;
      color: #eaeaf2;
    }
    .ad-topbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 16px;
      background: rgba(0,0,0,.35);
      border-bottom: 1px solid rgba(126,232,255,.12);
    }
    .ad-topbar-title {
      font-size: 11px; letter-spacing: .14em;
      text-transform: uppercase;
      color: rgba(230,225,245,.6);
      font-weight: 700;
    }
    .ad-close {
      background: transparent; border: 0;
      color: rgba(230,225,245,.5);
      font-size: 18px; cursor: pointer;
      padding: 4px 8px; border-radius: 6px;
      transition: background .15s;
    }
    .ad-close:hover { background: rgba(255,77,94,.15); color: #ff4d5e; }

    .ad-frame-holder {
      min-height: 260px;
      display: flex; align-items: center; justify-content: center;
      background: radial-gradient(ellipse at center, rgba(126,232,255,.08), transparent 70%);
      position: relative;
    }

    .ad-placeholder {
      position: relative;
      width: 100%; height: 260px;
      display: flex; align-items: center; justify-content: center;
      text-align: center;
    }
    .ad-placeholder-glow {
      position: absolute;
      width: 200px; height: 200px; border-radius: 50%;
      background: radial-gradient(circle, rgba(126,232,255,.35), transparent 70%);
      filter: blur(20px);
      animation: adPulse 2.5s ease-in-out infinite;
    }
    @keyframes adPulse { 0%,100%{ transform: scale(1); opacity:.6 } 50%{ transform: scale(1.15); opacity:.95 } }
    .ad-placeholder-inner { position: relative; z-index: 1; padding: 20px; }
    .ad-placeholder-eyebrow {
      font-size: 10px; letter-spacing: .18em;
      color: rgba(126,232,255,.7); font-weight: 700;
      margin-bottom: 10px;
    }
    .ad-placeholder-icon { font-size: 44px; margin-bottom: 8px; }
    .ad-placeholder-title {
      font-size: 18px; font-weight: 700;
      color: #fff; margin-bottom: 6px;
    }
    .ad-placeholder-sub {
      font-size: 12px; color: rgba(230,225,245,.55);
      max-width: 300px; margin: 0 auto; line-height: 1.5;
    }

    .ad-external-link {
      display: block; width: 100%; height: 260px;
      text-decoration: none; color: inherit;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s;
    }
    .ad-external-link:hover { background: rgba(126,232,255,.05); }
    .ad-external-inner { text-align: center; padding: 20px; }
    .ad-external-icon { font-size: 44px; margin-bottom: 10px; }
    .ad-external-inner h3 { color: #fff; margin: 0 0 6px; font-size: 18px; }
    .ad-external-inner p { color: rgba(230,225,245,.6); font-size: 13px; max-width: 300px; margin: 0 auto 14px; }
    .ad-external-cta {
      display: inline-block;
      background: linear-gradient(135deg, #b58bff, #7ee8ff);
      color: #0a0714; font-weight: 700;
      padding: 10px 22px; border-radius: 999px;
      font-size: 13px;
      box-shadow: 0 0 20px rgba(126,232,255,.5);
    }

    .ad-footer {
      padding: 16px 20px 20px;
      background: rgba(0,0,0,.25);
      border-top: 1px solid rgba(126,232,255,.12);
    }
    .ad-countdown {
      font-size: 12px; color: rgba(230,225,245,.7);
      text-align: center; margin-bottom: 10px;
      font-weight: 600;
    }
    .ad-progress-track {
      height: 5px; background: rgba(255,255,255,.08);
      border-radius: 99px; overflow: hidden;
      margin-bottom: 14px;
    }
    .ad-progress-fill {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, #b58bff, #7ee8ff);
      border-radius: 99px;
      transition: width .12s linear;
      box-shadow: 0 0 12px rgba(126,232,255,.6);
    }
    .ad-claim-btn {
      width: 100%;
      background: rgba(255,255,255,.06);
      color: rgba(230,225,245,.4);
      border: 1px solid rgba(255,255,255,.1);
      padding: 13px;
      border-radius: 10px;
      font-weight: 700; font-size: 14px;
      cursor: not-allowed;
      font-family: inherit;
      transition: all .25s;
    }
    .ad-claim-btn.ready {
      background: linear-gradient(135deg, #b58bff, #7ee8ff);
      color: #0a0714;
      border-color: transparent;
      cursor: pointer;
      box-shadow: 0 0 24px rgba(126,232,255,.5);
    }
    .ad-claim-btn.ready:hover { transform: translateY(-1px); }
  `;
  document.head.appendChild(style);
})();
