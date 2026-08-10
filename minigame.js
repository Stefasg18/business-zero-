(() => {
  const root = document;
  const startBtn = root.getElementById("miniGameStartBtn");
  const modal = root.getElementById("miniGameModal");
  if (!startBtn || !modal) return;

  let round = 0;
  let score = 0;
  let question = null;
  let timer = null;
  let startedCash = 0;
  let totalEarned = 0;
  let locked = false;
  const TOTAL = 5;
  const ROUND_MS = 8000;

  function money(n){
    try { return fmt(n); }
    catch { return Math.floor(Number(n)||0).toLocaleString("ru-RU"); }
  }

  function makeQuestion(){
    let left, right;
    do {
      const lc = 300 + Math.floor(Math.random()*1700);
      const lp = 180 + Math.floor(Math.random()*1600);
      const rc = 300 + Math.floor(Math.random()*1700);
      const rp = 180 + Math.floor(Math.random()*1600);
      left = {cost:lc, revenue:lc+lp};
      right = {cost:rc, revenue:rc+rp};
    } while ((left.revenue-left.cost) === (right.revenue-right.cost));
    return {
      left, right,
      answer:(left.revenue-left.cost) > (right.revenue-right.cost) ? "left" : "right"
    };
  }

  function renderHomeCard(){
    const attempts = root.getElementById("miniAttempts");
    const best = root.getElementById("miniBest");
    const earned = root.getElementById("miniEarned");
    const hint = root.getElementById("miniGameVipHint");

    if (attempts) attempts.textContent = `${state?.energy ?? 0} ⚡`;
    if (best) best.textContent = "5 раундов";
    if (earned) earned.textContent = "до 5 сделок";
    if (hint) {
      hint.textContent = state?.monetization?.vipActive
        ? "👑 VIP: +20% к пассивному доходу · мини-игра использует обычную энергию"
        : "Каждый правильный ответ запускает реальную сделку за 2 ⚡";
    }

    startBtn.disabled = !ONLINE_MODE || Number(state?.energy||0) < 2;
    startBtn.textContent = !ONLINE_MODE
      ? "Открой внутри Telegram"
      : Number(state?.energy||0) >= 2
        ? "Играть сейчас"
        : "Нужно минимум 2 ⚡";
  }

  const originalRender = typeof render === "function" ? render : null;
  if (originalRender) {
    const wrapped = function(){
      const r = originalRender.apply(this, arguments);
      renderHomeCard();
      return r;
    };
    try { window.render = wrapped; } catch {}
    try { render = wrapped; } catch {}
  }

  function open(){
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
  }

  function close(){
    clearInterval(timer);
    timer = null;
    locked = false;
    modal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    renderHomeCard();
  }

  function setDisabled(v){
    root.querySelectorAll("[data-mini-choice]").forEach(b => b.disabled = v);
  }

  function startTimer(){
    clearInterval(timer);
    const bar = root.getElementById("miniTimerBar");
    const start = Date.now();
    if (bar) bar.style.width = "100%";
    timer = setInterval(() => {
      const left = Math.max(0, ROUND_MS - (Date.now()-start));
      if (bar) bar.style.width = `${left/ROUND_MS*100}%`;
      if (left <= 0) {
        clearInterval(timer);
        timer = null;
        answer("timeout");
      }
    }, 50);
  }

  function showRound(){
    locked = false;
    question = makeQuestion();
    root.getElementById("miniResult")?.classList.add("hidden");
    root.getElementById("miniQuestion")?.classList.remove("hidden");
    root.getElementById("miniRoundTitle").textContent = `Раунд ${round+1} / ${TOTAL}`;
    root.getElementById("miniScoreLine").textContent = `Счёт: ${score} / ${TOTAL}`;
    root.getElementById("miniLeftRevenue").textContent = `${money(question.left.revenue)} ₽`;
    root.getElementById("miniLeftCost").textContent = `${money(question.left.cost)} ₽`;
    root.getElementById("miniRightRevenue").textContent = `${money(question.right.revenue)} ₽`;
    root.getElementById("miniRightCost").textContent = `${money(question.right.cost)} ₽`;
    setDisabled(false);
    startTimer();
  }

  async function answer(choice){
    if (locked || !question) return;
    locked = true;
    clearInterval(timer);
    timer = null;
    setDisabled(true);

    const correct = choice === question.answer;
    const line = root.getElementById("miniScoreLine");

    if (!correct) {
      if (line) {
        line.textContent = choice === "timeout" ? "⏱ Время вышло" : "❌ Неверно — сделка пропущена";
        line.classList.add("bad");
      }
      try { haptic("heavy"); } catch {}
      setTimeout(nextRound, 520);
      return;
    }

    score++;
    if (line) {
      line.textContent = "✅ Верно — заключаем сделку…";
      line.classList.add("good");
    }

    try {
      const before = Number(state.cash||0);
      const d = await api("/api/deal", {
        method:"POST",
        body:JSON.stringify({dealId:"delivery"})
      });
      applyServerState(d.state);
      const delta = Number(state.cash||0) - before;
      if (delta > 0) totalEarned += delta;
      try { notify(d.success ? "success" : "error"); } catch {}
      if (line) {
        line.textContent = d.success
          ? `💰 ${d.message}`
          : `📉 ${d.message}`;
      }
    } catch (e) {
      if (line) line.textContent = `⚡ ${e.message}`;
      if (String(e.message||"").includes("энерг")) {
        setTimeout(() => finish(true), 650);
        return;
      }
    }

    setTimeout(nextRound, 650);
  }

  function nextRound(){
    const line = root.getElementById("miniScoreLine");
    line?.classList.remove("good","bad");
    round++;
    if (round >= TOTAL) finish(false);
    else showRound();
  }

  function finish(outOfEnergy){
    clearInterval(timer);
    timer = null;
    root.getElementById("miniQuestion")?.classList.add("hidden");
    const result = root.getElementById("miniResult");
    result?.classList.remove("hidden");
    root.getElementById("miniRoundTitle").textContent = outOfEnergy ? "Энергия закончилась" : "Результат";
    root.getElementById("miniScoreLine").textContent = outOfEnergy
      ? "Энергия восстанавливается автоматически"
      : `Бизнес-блиц завершён`;
    const bar = root.getElementById("miniTimerBar");
    if (bar) bar.style.width = "0%";

    const currentDelta = Math.max(0, Number(state.cash||0) - startedCash);
    const earned = Math.max(totalEarned, currentDelta);
    const icon = score >= 4 ? "🏆" : score >= 2 ? "💼" : "📊";

    result.innerHTML = `
      <div class="mini-result-icon">${icon}</div>
      <h3>${score}/${TOTAL} правильных</h3>
      <p>${outOfEnergy
        ? "Ты можешь продолжить позже, когда энергия восстановится."
        : `За мини-игру капитал изменился на <strong>+${money(earned)} ₽</strong>.`
      }</p>
      <div class="mini-finish-meta">
        <span>Каждый верный ответ = реальная сделка</span>
        <span>Риск сделки сохраняется</span>
      </div>
      <button id="miniResultClose" class="mini-result-btn">Продолжить бизнес</button>`;
    root.getElementById("miniResultClose")?.addEventListener("click", close);
    renderHomeCard();
  }

  function start(){
    if (!ONLINE_MODE) {
      showToast("Открой игру внутри Telegram");
      return;
    }
    if (Number(state.energy||0) < 2) {
      showToast("Нужно минимум 2 энергии");
      return;
    }
    round = 0;
    score = 0;
    totalEarned = 0;
    startedCash = Number(state.cash||0);
    open();
    showRound();
    try { haptic("medium"); } catch {}
  }

  startBtn.addEventListener("click", start);
  root.querySelectorAll("[data-mini-choice]").forEach(btn => {
    btn.addEventListener("click", () => answer(btn.dataset.miniChoice));
  });
  root.querySelectorAll("[data-close-mini]").forEach(x => x.addEventListener("click", close));

  setTimeout(renderHomeCard, 0);
})();
