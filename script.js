// ── Sounds ────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playCorrect() {
  const ctx = getAudioCtx();
  const times = [0, 0.15, 0.3];
  const freqs = [523, 659, 784];
  times.forEach((t, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freqs[i];
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime + t);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
    osc.start(ctx.currentTime + t);
    osc.stop(ctx.currentTime + t + 0.3);
  });
}

function playWrong() {
  const ctx = getAudioCtx();
  const freqs = [330, 280];
  freqs.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.2);
    osc.start(ctx.currentTime + i * 0.15);
    osc.stop(ctx.currentTime + i * 0.15 + 0.2);
  });
}

function playComplete() {
  const ctx = getAudioCtx();
  const melody = [523, 587, 659, 698, 784];
  melody.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.3);
  });
}

// ── Auth ──────────────────────────────────
let currentUser = null;

function renderAuth(mode = 'login') {
  document.getElementById('app').innerHTML = `
    <div style="display:flex; min-height:100vh; width:100%;">
      <div style="flex:1; background:linear-gradient(135deg,#0d1b2e,#0a1628); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 40px; border-right:1px solid var(--border);">
        <div style="font-family:'Fredoka One',cursive; font-size:3rem; background:linear-gradient(135deg,#22c55e,#3b82f6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:16px;">⚡ MathQuest</div>
        <p style="color:var(--muted); font-size:1rem; font-weight:700; text-align:center; max-width:260px; line-height:1.6;">Master middle school math one realm at a time.</p>
        <div style="margin-top:48px; display:flex; flex-direction:column; gap:16px; width:100%; max-width:280px;">
          ${['🔢 Algebra', '📐 Geometry', '🔣 Fractions', '📊 Percentages'].map(r => `
            <div style="background:#ffffff08; border:1px solid var(--border); border-radius:12px; padding:14px 18px; font-weight:700; font-size:.95rem;">${r}</div>
          `).join('')}
        </div>
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; padding:40px;">
        <div style="width:100%; max-width:400px;">
          <h2 style="font-family:'Fredoka One',cursive; font-size:2rem; margin-bottom:6px;">
            ${mode === 'login' ? 'Welcome back! 👋' : 'Join for free! 🚀'}
          </h2>
          <p style="color:var(--muted); font-size:.9rem; font-weight:700; margin-bottom:32px;">
            ${mode === 'login' ? 'Log in to continue your streak.' : 'Start your math adventure today.'}
          </p>
          ${mode === 'signup' ? `
            <div style="margin-bottom:16px;">
              <label style="font-size:.8rem; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; display:block; margin-bottom:6px;">Your Name</label>
              <input id="authName" type="text" placeholder="e.g. Alex" style="${inputStyle()}">
            </div>
          ` : ''}
          <div style="margin-bottom:16px;">
            <label style="font-size:.8rem; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; display:block; margin-bottom:6px;">Email</label>
            <input id="authEmail" type="email" placeholder="you@email.com" style="${inputStyle()}">
          </div>
          <div style="margin-bottom:24px;">
            <label style="font-size:.8rem; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; display:block; margin-bottom:6px;">Password</label>
            <input id="authPassword" type="password" placeholder="••••••••" style="${inputStyle()}">
          </div>
          <div id="authError" style="display:none; background:#f8717118; border:1px solid var(--red); border-radius:10px; padding:10px 14px; font-size:.85rem; font-weight:700; color:var(--red); margin-bottom:16px;"></div>
          <button onclick="${mode === 'login' ? 'handleLogin()' : 'handleSignup()'}" style="${bigBtnStyle('#22c55e')}">
            ${mode === 'login' ? '🔑 Log In' : '🚀 Create Account'}
          </button>
          <div style="text-align:center; margin-top:20px; color:var(--muted); font-size:.88rem; font-weight:700;">
            ${mode === 'login'
              ? `Don't have an account? <span onclick="renderAuth('signup')" style="color:var(--green); cursor:pointer;">Sign up free →</span>`
              : `Already have an account? <span onclick="renderAuth('login')" style="color:var(--blue); cursor:pointer;">Log in →</span>`
            }
          </div>
          <div style="display:flex; align-items:center; gap:12px; margin:24px 0;">
            <div style="flex:1; height:1px; background:var(--border);"></div>
            <span style="color:var(--muted); font-size:.8rem; font-weight:700;">OR</span>
            <div style="flex:1; height:1px; background:var(--border);"></div>
          </div>
          <button onclick="handleGuest()" style="${bigBtnStyle('transparent', true)}">
            👤 Continue as Guest
          </button>
        </div>
      </div>
    </div>
  `;
}

function inputStyle() {
  return `width:100%; padding:14px 16px; background:var(--panel); border:2px solid var(--border); border-radius:12px; color:var(--text); font-family:'Nunito',sans-serif; font-size:1rem; font-weight:700; outline:none; transition:border-color .2s;`;
}

function bigBtnStyle(bg, ghost = false) {
  return `width:100%; padding:15px; background:${bg}; border:${ghost ? '2px solid var(--border)' : 'none'}; border-radius:14px; color:${ghost ? 'var(--muted)' : '#0d1117'}; font-family:'Nunito',sans-serif; font-size:1.05rem; font-weight:800; cursor:pointer; transition:filter .2s, transform .15s;`;
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  el.textContent = msg;
  el.style.display = 'block';
}

function handleLogin() {
  const email    = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  if (!email || !password) return showAuthError('Please fill in all fields.');
  const users = JSON.parse(localStorage.getItem('mq_users') || '{}');
  if (!users[email]) return showAuthError('No account found. Sign up first!');
  if (users[email].password !== password) return showAuthError('Wrong password. Try again!');
  currentUser = { email, name: users[email].name };
  localStorage.setItem('mq_session', JSON.stringify(currentUser));
  renderHome();
}

function handleSignup() {
  const name     = document.getElementById('authName').value.trim();
  const email    = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  if (!name || !email || !password) return showAuthError('Please fill in all fields.');
  if (password.length < 6) return showAuthError('Password must be at least 6 characters.');
  const users = JSON.parse(localStorage.getItem('mq_users') || '{}');
  if (users[email]) return showAuthError('An account with this email already exists!');
  users[email] = { name, password };
  localStorage.setItem('mq_users', JSON.stringify(users));
  currentUser = { email, name };
  localStorage.setItem('mq_session', JSON.stringify(currentUser));
  renderHome();
}

function handleGuest() {
  currentUser = { name: 'Guest', email: null };
  renderHome();
}

function logOut() {
  localStorage.removeItem('mq_session');
  currentUser = null;
  renderAuth('login');
}

// ── App state ─────────────────────────────
const stars = { 1: 0, 2: 0, 3: 0, 4: 0 };
let darkMode = true;
let score = 0;
let questionIndex = 0;
let hearts = 3;

function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle('light', !darkMode);
  document.getElementById('themeBtn').textContent = darkMode ? '🌙' : '☀️';
}

function starsDisplay(n) {
  return [1,2,3].map(i => i <= n ? '⭐' : '☆').join('');
}

// ── Home ──────────────────────────────────
function renderHome() {
  score = 0;
  questionIndex = 0;
  hearts = 3;

  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);
  const gems = totalStars * 10;
  const xpPct = Math.min((totalStars * 50 / 150) * 100, 100);

  document.getElementById('app').innerHTML = `
    <nav class="sidebar">
      <div class="sidebar-logo">⚡ MathQuest</div>
      <div style="padding:0 8px; margin-bottom:24px; font-size:.85rem; font-weight:700; color:var(--muted);">
        👋 Hey, ${currentUser.name}!
      </div>
      <div class="sidebar-nav">
        <div class="nav-item active"><span class="nav-icon">🗺️</span> Learn</div>
        <div class="nav-item"><span class="nav-icon">🏆</span> Leaderboard</div>
        <div class="nav-item"><span class="nav-icon">👤</span> Profile</div>
        <div class="nav-item"><span class="nav-icon">⚙️</span> Settings</div>
        <div class="nav-item" onclick="toggleTheme()"><span class="nav-icon" id="themeBtn">🌙</span> Theme</div>
        <div class="nav-item" onclick="logOut()" style="color:var(--red);"><span class="nav-icon">🚪</span> Log Out</div>
      </div>
      <div class="sidebar-stats">
        <div class="sidebar-stat">
          <span class="ss-icon">🔥</span>
          <div class="ss-info"><span class="ss-val">1</span><span class="ss-label">Day Streak</span></div>
        </div>
        <div class="sidebar-stat">
          <span class="ss-icon">💎</span>
          <div class="ss-info"><span class="ss-val">${gems}</span><span class="ss-label">Gems</span></div>
        </div>
        <div class="sidebar-stat">
          <span class="ss-icon">⚡</span>
          <div class="ss-info"><span class="ss-val">${totalStars * 50} XP</span><span class="ss-label">Experience</span></div>
        </div>
      </div>
    </nav>

    <main class="main">
      <div class="main-header">
        <div class="main-title">🗺️ Learning Path</div>
        <div class="main-sub">Complete realms to earn gems and level up!</div>
      </div>
      <div class="xp-wrap">
        <div class="xp-label"><span>⚡ Level 1</span><span>${totalStars * 50} / 150 XP</span></div>
        <div class="xp-bg"><div class="xp-fill" style="width:${xpPct}%"></div></div>
      </div>
      <div class="section-label">Your Realms</div>
      <div class="realm-path">

        <div class="path-step">
          <div class="realm-bubble c-green" onclick="showRealm(1)">
            <div class="bubble-icon">🔢</div>
            <div class="bubble-info">
              <div class="bubble-name">Realm 1: Algebra</div>
              <div class="bubble-desc">Solve for x and crack equations</div>
              <div class="bubble-stars">${starsDisplay(stars[1])}</div>
            </div>
            <span class="bubble-tag tag-green">+10 💎</span>
          </div>
        </div>

        <div class="path-connector ${stars[1] > 0 ? 'done' : ''}"></div>

        <div class="path-step">
          <div class="realm-bubble c-blue locked">
            <div class="bubble-icon">📐</div>
            <div class="bubble-info">
              <div class="bubble-name">Realm 2: Geometry</div>
              <div class="bubble-desc">Areas, angles and shapes</div>
              <div class="bubble-stars">${starsDisplay(stars[2])}</div>
            </div>
            <span class="bubble-tag tag-locked">🔒</span>
          </div>
        </div>

        <div class="path-connector"></div>

        <div class="path-step">
          <div class="realm-bubble c-yellow locked">
            <div class="bubble-icon">🔣</div>
            <div class="bubble-info">
              <div class="bubble-name">Realm 3: Fractions</div>
              <div class="bubble-desc">Fractions, decimals and more</div>
              <div class="bubble-stars">${starsDisplay(stars[3])}</div>
            </div>
            <span class="bubble-tag tag-locked">🔒</span>
          </div>
        </div>

        <div class="path-connector"></div>

        <div class="path-step">
          <div class="realm-bubble locked">
            <div class="bubble-icon">🔒</div>
            <div class="bubble-info">
              <div class="bubble-name">Realm 4: Percentages</div>
              <div class="bubble-desc">Ratios, percentages and rates</div>
              <div class="bubble-stars">☆☆☆</div>
            </div>
            <span class="bubble-tag tag-locked">🔒</span>
          </div>
        </div>

        <div class="path-connector"></div>

        <div class="path-step">
          <div class="daily-card" onclick="showAlgebra()">
            <span class="daily-icon">⚡</span>
            <div>
              <div class="daily-title">Daily Challenge</div>
              <div class="daily-sub">Bonus 💎 20 gems today!</div>
            </div>
            <span class="daily-arrow">→</span>
          </div>
        </div>

      </div>
    </main>

    <aside class="right-panel">
      <div class="rp-card">
        <div class="rp-title">🔥 Streak</div>
        <div class="streak-box">
          <div class="streak-fire">🔥</div>
          <div class="streak-num">1</div>
          <div class="streak-label">Day streak</div>
        </div>
      </div>
      <div class="rp-card">
        <div class="rp-title">🏆 Leaderboard</div>
        <div class="leaderboard-row"><span class="lb-rank">🥇</span><span class="lb-name">You</span><span class="lb-gems">💎 ${gems}</span></div>
        <div class="leaderboard-row"><span class="lb-rank">🥈</span><span class="lb-name">Alex</span><span class="lb-gems">💎 30</span></div>
        <div class="leaderboard-row"><span class="lb-rank">🥉</span><span class="lb-name">Sam</span><span class="lb-gems">💎 20</span></div>
        <div class="leaderboard-row"><span class="lb-rank">4</span><span class="lb-name">Jordan</span><span class="lb-gems">💎 10</span></div>
      </div>
    </aside>
  `;
}

function showRealm(n) {
  if (n === 1) showAlgebra();
  if (n === 2) showGeometry();
  if (n === 3) showFractions();
}

function showGeometry() { alert('Realm 2 — coming soon!'); }
function showFractions() { alert('Realm 3 — coming soon!'); }

// ── Realm 1: Algebra ──────────────────────
function showAlgebra() {
  score = 0;
  questionIndex = 0;
  hearts = 3;
  window.lessonStreak = 0;
  window.lessonGems = Object.values(stars).reduce((a, b) => a + b, 0) * 10;

  document.getElementById('app').innerHTML = `
    <div class="lesson-shell">
      <div class="lesson-topbar">
        <button class="btn-back" onclick="renderHome()">✕</button>
        <div class="duo-progress-wrap">
          <div class="duo-progress-bg">
            <div class="duo-progress-fill" id="progressFill" style="width:0%"></div>
          </div>
        </div>
        <div class="lesson-stats">
          <div class="lesson-stat" id="streakStat">🔥 <span id="streakCount">0</span></div>
          <div class="lesson-stat" id="gemStat">💎 <span id="gemCount">${window.lessonGems}</span></div>
          <div class="lesson-stat" id="heartStat">❤️❤️❤️</div>
        </div>
      </div>
      <div class="lesson-body">
        <div class="mascot-wrap">
          <div class="mascot" id="mascot">🦊</div>
          <div class="mascot-bubble" id="mascotBubble">Let's solve some algebra! You got this! 💪</div>
        </div>
        <div class="lesson-question" id="questionArea"></div>
      </div>
      <div class="hint-wrap">
        <button class="btn-hint" onclick="useHint()">💡 Hint (costs 5 💎)</button>
      </div>
    </div>
  `;

  loadQuestion();
}

// ── Questions ─────────────────────────────
const algebraQuestions = [
  {
    type: 'mcq',
    equation: '2x + 3 = 11',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 7'],
    answer: 'x = 4',
    explanation: '2x = 11 − 3 = 8, so x = 4'
  },
  {
    type: 'drag',
    equation: '3x = 15',
    tiles: ['x = 5', 'Divide both sides by 3', '3x = 15', 'x = 15 ÷ 3'],
    correctOrder: ['3x = 15', 'Divide both sides by 3', 'x = 15 ÷ 3', 'x = 5'],
    explanation: 'Divide both sides by 3 to isolate x'
  },
  {
    type: 'fillin',
    equation: 'x ÷ 4 = 9, so x = ___',
    answer: '36',
    explanation: 'Multiply both sides by 4: x = 9 × 4 = 36'
  },
  {
    type: 'mcq',
    equation: '5x − 10 = 20',
    options: ['x = 4', 'x = 5', 'x = 6', 'x = 8'],
    answer: 'x = 6',
    explanation: '5x = 20 + 10 = 30, so x = 6'
  },
  {
    type: 'drag',
    equation: '2x + 6 = 14',
    tiles: ['x = 4', '2x = 8', 'Subtract 6 from both sides', '2x + 6 = 14'],
    correctOrder: ['2x + 6 = 14', 'Subtract 6 from both sides', '2x = 8', 'x = 4'],
    explanation: 'First subtract 6, then divide by 2'
  },
  {
    type: 'fillin',
    equation: '3x + 7 = 22, so x = ___',
    answer: '5',
    explanation: '3x = 22 − 7 = 15, so x = 15 ÷ 3 = 5'
  }
];

function loadQuestion() {
  if (questionIndex >= algebraQuestions.length) { showResult(); return; }
  const q = algebraQuestions[questionIndex];
  document.getElementById('progressFill').style.width = (questionIndex / algebraQuestions.length * 100) + '%';
  const area = document.getElementById('questionArea');
  if (q.type === 'mcq')    renderMCQ(q, area);
  if (q.type === 'fillin') renderFillin(q, area);
  if (q.type === 'drag')   renderDrag(q, area);
}

// ── MCQ ───────────────────────────────────
function renderMCQ(q, area) {
  area.innerHTML = `
    <div class="duo-question">
      <div class="duo-label">Choose the correct answer</div>
      <div class="duo-equation">${q.equation}</div>
      <div class="mcq-grid">
        ${q.options.map(opt => `
          <button class="mcq-tile" onclick="checkMCQ(this, '${opt}', '${q.answer}', '${q.explanation}')">
            ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function checkMCQ(btn, selected, correct, explanation) {
  document.querySelectorAll('.mcq-tile').forEach(b => b.disabled = true);
  if (selected === correct) {
    btn.classList.add('correct');
    score++;
    playCorrect();
    launchConfetti();
    updateStreak(true);
    updateGems(10);
    setMascot('correct');
    showFeedback(true, explanation);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.mcq-tile').forEach(b => { if (b.textContent.trim() === correct) b.classList.add('correct'); });
    playWrong();
    loseHeart();
    updateStreak(false);
    setMascot('wrong');
    showFeedback(false, explanation);
  }
}

// ── Fill in the blank ─────────────────────
function renderFillin(q, area) {
  area.innerHTML = `
    <div class="duo-question">
      <div class="duo-label">Fill in the blank</div>
      <div class="duo-equation">${q.equation}</div>
      <input id="fillInput" class="fill-input" type="number" placeholder="Type your answer...">
      <button class="btn-check" id="checkBtn" onclick="checkFillin('${q.answer}', '${q.explanation}')">Check ✅</button>
    </div>
  `;
  document.getElementById('fillInput').focus();
  document.getElementById('fillInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkFillin(q.answer, q.explanation);
  });
}

function checkFillin(correct, explanation) {
  const input = document.getElementById('fillInput');
  const val = input.value.trim();
  if (!val) return;
  input.disabled = true;
  document.getElementById('checkBtn').disabled = true;
  if (val === correct) {
    input.classList.add('input-correct');
    score++;
    playCorrect();
    launchConfetti();
    updateStreak(true);
    updateGems(10);
    setMascot('correct');
    showFeedback(true, explanation);
  } else {
    input.classList.add('input-wrong');
    input.value = `✗  Answer: ${correct}`;
    playWrong();
    loseHeart();
    updateStreak(false);
    setMascot('wrong');
    showFeedback(false, explanation);
  }
}

// ── Drag ──────────────────────────────────
function renderDrag(q, area) {
  const shuffled = [...q.tiles].sort(() => Math.random() - 0.5);
  window.currentDragAnswer = q.correctOrder;
  window.currentDragExplanation = q.explanation;
  area.innerHTML = `
    <div class="duo-question">
      <div class="duo-label">Drag to put the steps in order</div>
      <div class="duo-equation">${q.equation}</div>
      <div class="drag-list" id="dragList">
        ${shuffled.map(tile => `
          <div class="drag-tile" draggable="true" data-text="${tile}">
            <span class="drag-handle">☰</span> ${tile}
          </div>
        `).join('')}
      </div>
      <br>
      <button class="btn-check" id="checkBtn" onclick="checkDrag()">Check ✅</button>
    </div>
  `;
  initDrag();
}

function initDrag() {
  const list = document.getElementById('dragList');
  let dragging = null;
  list.querySelectorAll('.drag-tile').forEach(tile => {
    tile.addEventListener('dragstart', () => { dragging = tile; setTimeout(() => tile.classList.add('dragging'), 0); });
    tile.addEventListener('dragend',   () => { tile.classList.remove('dragging'); dragging = null; });
    tile.addEventListener('dragover',  e => {
      e.preventDefault();
      const after = getDragAfter(list, e.clientY);
      if (after == null) list.appendChild(dragging);
      else list.insertBefore(dragging, after);
    });
  });
}

function getDragAfter(container, y) {
  const tiles = [...container.querySelectorAll('.drag-tile:not(.dragging)')];
  return tiles.reduce((closest, tile) => {
    const box = tile.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: tile };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkDrag() {
  const correct = window.currentDragAnswer;
  const explanation = window.currentDragExplanation;
  const tiles = [...document.querySelectorAll('.drag-tile')];
  const userOrder = tiles.map(t => t.dataset.text);
  const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correct);
  tiles.forEach((t, i) => t.classList.add(t.dataset.text === correct[i] ? 'correct' : 'wrong'));
  document.getElementById('checkBtn').disabled = true;
  if (isCorrect) {
    score++;
    playCorrect();
    launchConfetti();
    updateStreak(true);
    updateGems(10);
    setMascot('correct');
    showFeedback(true, explanation);
  } else {
    playWrong();
    loseHeart();
    updateStreak(false);
    setMascot('wrong');
    showFeedback(false, explanation);
  }
}

// ── Feedback ──────────────────────────────
async function showFeedback(correct, explanation) {
  const area = document.getElementById('questionArea');
  const existing = document.getElementById('feedbackBar');
  if (existing) existing.remove();

  const bar = document.createElement('div');
  bar.id = 'feedbackBar';
  bar.className = `feedback-bar ${correct ? 'fb-correct' : 'fb-wrong'}`;
  bar.innerHTML = `
    <div class="fb-left">
      <span class="fb-icon">${correct ? '✅' : '❌'}</span>
      <div>
        <div class="fb-title">${correct ? 'Correct!' : 'Not quite!'}</div>
        <div class="fb-explain" id="feedbackExplain">${explanation}</div>
      </div>
    </div>
    <button class="btn-next" id="continueBtn" onclick="nextQuestion()">
      ${questionIndex + 1 >= algebraQuestions.length ? 'Finish 🏁' : 'Continue →'}
    </button>
  `;
  area.appendChild(bar);
  bar.scrollIntoView({ behavior: 'smooth', block: 'end' });

  const bubble = document.getElementById('mascotBubble');
  if (bubble) bubble.textContent = '🦊 thinking...';

  const q = algebraQuestions[questionIndex];
  const prompt = correct
    ? `A middle school student correctly answered: "${q.equation}". Answer: ${q.answer}. Give an enthusiastic 3-4 sentence explanation: (1) why it's correct, (2) step-by-step solution, (3) a memory tip. Simple language, 2 emojis.`
    : `A middle school student got wrong: "${q.equation}". Correct answer: ${q.answer}. Give a kind 3-4 sentence explanation: (1) step-by-step solution, (2) key concept missed, (3) memory tip. Encouraging, 2 emojis.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    const text = data?.content?.[0]?.text;
    if (text && bubble) {
      bubble.textContent = text;
      bubble.classList.add('bubble-pop');
      setTimeout(() => bubble.classList.remove('bubble-pop'), 600);
    }
    const explainEl = document.getElementById('feedbackExplain');
    if (text && explainEl) explainEl.textContent = text;
  } catch (e) {
    if (bubble) bubble.textContent = correct ? '✅ ' + explanation : '❌ ' + explanation;
  }
}

function nextQuestion() {
  questionIndex++;
  const bar = document.getElementById('feedbackBar');
  if (bar) bar.remove();
  if (hearts <= 0) { showGameOver(); return; }
  loadQuestion();
}

// ── Hearts ────────────────────────────────
function loseHeart() {
  hearts = Math.max(0, hearts - 1);
  const display = document.getElementById('heartStat');
  if (display) display.textContent = '❤️'.repeat(hearts) + '🖤'.repeat(3 - hearts);
}

// ── Game over ─────────────────────────────
function showGameOver() {
  document.getElementById('questionArea').innerHTML = `
    <div class="result-box">
      <div class="result-emoji">💔</div>
      <h3>Out of hearts!</h3>
      <p>Don't give up — try again!</p>
      <button class="btn-check" style="margin-top:24px" onclick="showAlgebra()">Try Again 🔄</button>
      <br><br>
      <button class="btn-back" onclick="renderHome()">← Home</button>
    </div>
  `;
}

// ── Result ────────────────────────────────
function showResult() {
  playComplete();
  setMascot('finish');
  launchConfetti();
  document.getElementById('progressFill').style.width = '100%';
  const total = algebraQuestions.length;
  const earned = score >= total ? 3 : score >= total * 0.6 ? 2 : score >= 1 ? 1 : 0;
  stars[1] = Math.max(stars[1], earned);
  document.getElementById('questionArea').innerHTML = `
    <div class="result-box">
      <div class="result-emoji">${score === total ? '🏆' : score >= 3 ? '🎉' : '💪'}</div>
      <h3>Realm Complete!</h3>
      <p>You scored <strong>${score} / ${total}</strong></p>
      <div class="result-stars">${starsDisplay(earned)}</div>
      <button class="btn-check" style="margin-top:24px" onclick="showAlgebra()">Play Again 🔄</button>
      <br><br>
      <button class="btn-back" style="margin-top:12px" onclick="renderHome()">← Home</button>
    </div>
  `;
}

// ── Mascot ────────────────────────────────
function setMascot(mood) {
  const mascot = document.getElementById('mascot');
  const bubble = document.getElementById('mascotBubble');
  if (!mascot || !bubble) return;
  const moods = {
    idle:    "Take your time! You've got this! 💪",
    correct: ['Amazing! 🎉', "You're on fire! 🔥", 'Nailed it! ⭐', 'Brilliant! 🏆'][Math.floor(Math.random()*4)],
    wrong:   ['Keep trying! 💙', 'Almost there!', "Don't give up! 💪", "You'll get the next one!"][Math.floor(Math.random()*4)],
    hint:    "Here's a hint to help you out! 🔍",
    finish:  'Incredible work! Realm complete! 🏆'
  };
  mascot.classList.add('mascot-bounce');
  bubble.textContent = moods[mood] || moods.idle;
  bubble.classList.add('bubble-pop');
  setTimeout(() => { mascot.classList.remove('mascot-bounce'); bubble.classList.remove('bubble-pop'); }, 600);
}

// ── Confetti ──────────────────────────────
function launchConfetti() {
  const colors = ['#22c55e','#3b82f6','#fbbf24','#f87171','#a78bfa','#34d399'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `left:${Math.random()*100}vw; background:${colors[Math.floor(Math.random()*colors.length)]}; animation-duration:${0.8+Math.random()*1.2}s; animation-delay:${Math.random()*0.4}s; width:${6+Math.random()*8}px; height:${6+Math.random()*8}px; border-radius:${Math.random()>0.5?'50%':'2px'};`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

// ── Streak ────────────────────────────────
function updateStreak(correct) {
  window.lessonStreak = correct ? window.lessonStreak + 1 : 0;
  const el = document.getElementById('streakCount');
  if (el) {
    el.textContent = window.lessonStreak;
    el.parentElement.classList.toggle('streak-hot', window.lessonStreak >= 3);
  }
}

// ── Gems ──────────────────────────────────
function updateGems(amount) {
  window.lessonGems = Math.max(0, window.lessonGems + amount);
  const el = document.getElementById('gemCount');
  if (el) el.textContent = window.lessonGems;
}

// ── Hint ──────────────────────────────────
function useHint() {
  if (window.lessonGems < 5) {
    const bubble = document.getElementById('mascotBubble');
    if (bubble) bubble.textContent = "Not enough gems! 😢 Keep answering correctly to earn more!";
    return;
  }
  updateGems(-5);
  const q = algebraQuestions[questionIndex];
  const hints = {
    mcq:    'Try working backwards — substitute each option in and see which one balances the equation.',
    fillin: 'Isolate x by doing the opposite operation to both sides.',
    drag:   'Start with the original equation at the top, and end with the value of x at the bottom.'
  };
  const bubble = document.getElementById('mascotBubble');
  if (bubble) bubble.textContent = '💡 ' + (hints[q.type] || 'Think step by step!');
}

// ── Init ──────────────────────────────────
const savedSession = localStorage.getItem('mq_session');
if (savedSession) {
  currentUser = JSON.parse(savedSession);
  renderHome();
} else {
  renderAuth('login');
}
