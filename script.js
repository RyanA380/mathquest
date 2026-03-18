const stars = { 1: 0, 2: 0, 3: 0, 4: 0 };

function starsDisplay(n) {
  return [1,2,3].map(i => i <= n ? '⭐' : '☆').join('');
}
function renderHome() {
  document.getElementById('app').innerHTML = `
    <div class="card">
      <h1 class="home-title">Math Quest 🚀</h1>
      <p class="home-sub">Middle school math — pick a realm!</p>

      <div class="realms-grid">

        <div class="realm-card green" onclick="showRealm(1)">
          <div class="realm-icon">🔢</div>
          <div class="realm-name">Realm 1: Algebra</div>
          <div class="realm-desc">Solve for x and crack equations.</div>
          <div class="realm-stars">${starsDisplay(stars[1])}</div>
          <span class="realm-tag tag-green">Available</span>
        </div>

        <div class="realm-card blue" onclick="showRealm(2)">
          <div class="realm-icon">📐</div>
          <div class="realm-name">Realm 2: Geometry</div>
          <div class="realm-desc">Areas, angles and shapes.</div>
          <div class="realm-stars">${starsDisplay(stars[2])}</div>
          <span class="realm-tag tag-blue">Available</span>
        </div>

        <div class="realm-card yellow" onclick="showRealm(3)">
          <div class="realm-icon">🔣</div>
          <div class="realm-name">Realm 3: Fractions</div>
          <div class="realm-desc">Fractions, decimals and more.</div>
          <div class="realm-stars">${starsDisplay(stars[3])}</div>
          <span class="realm-tag tag-yellow">Available</span>
        </div>

        <div class="realm-card locked">
          <div class="realm-icon">🔒</div>
          <div class="realm-name">Realm 4: Percentages</div>
          <div class="realm-desc">Ratios, percentages and rates.</div>
          <div class="realm-stars">☆☆☆</div>
          <span class="realm-tag tag-locked">Coming soon</span>
        </div>

      </div>
    </div>
  `;
}
function showRealm(n) {
  if (n === 1) showAlgebra();
  if (n === 2) showGeometry();
  if (n === 3) showFractions();
}

function showAlgebra()  { alert('Realm 1 — next session!'); }
function showGeometry() { alert('Realm 2 — next session!'); }
function showFractions(){ alert('Realm 3 — next session!'); }

/* ── Realm 1: Algebra ─────────────────── */
function showAlgebra() {
  score = 0;
  questionIndex = 0;
  hearts = 3;

  document.getElementById('app').innerHTML = `
    <div class="card realm-page">

      <div class="duo-topbar">
        <button class="btn-back" onclick="renderHome()">✕</button>
        <div class="duo-progress-wrap">
          <div class="duo-progress-bg">
            <div class="duo-progress-fill" id="progressFill" style="width:0%"></div>
          </div>
        </div>
        <div class="duo-hearts" id="heartsDisplay">❤️❤️❤️</div>
      </div>

      <div id="questionArea"></div>

    </div>
  `;

  loadQuestion();
}
/* ── Questions ────────────────────────── */
const algebraQuestions = [
  {
    type: 'mcq',
    question: 'Solve for x',
    equation: '2x + 3 = 11',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 7'],
    answer: 'x = 4',
    explanation: '2x = 11 − 3 = 8, so x = 4'
  },
  {
    type: 'drag',
    question: 'Arrange the steps to solve:',
    equation: '3x = 15',
    tiles: ['x = 5', 'Divide both sides by 3', '3x = 15', 'x = 15 ÷ 3'],
    correctOrder: ['3x = 15', 'Divide both sides by 3', 'x = 15 ÷ 3', 'x = 5'],
    explanation: 'Divide both sides by 3 to isolate x'
  },
  {
    type: 'fillin',
    question: 'Fill in the blank',
    equation: 'x ÷ 4 = 9, so x = ___',
    answer: '36',
    explanation: 'Multiply both sides by 4: x = 9 × 4 = 36'
  },
  {
    type: 'mcq',
    question: 'Solve for x',
    equation: '5x − 10 = 20',
    options: ['x = 4', 'x = 5', 'x = 6', 'x = 8'],
    answer: 'x = 6',
    explanation: '5x = 20 + 10 = 30, so x = 6'
  },
  {
    type: 'drag',
    question: 'Arrange the steps to solve:',
    equation: '2x + 6 = 14',
    tiles: ['x = 4', '2x = 8', 'Subtract 6 from both sides', '2x + 6 = 14'],
    correctOrder: ['2x + 6 = 14', 'Subtract 6 from both sides', '2x = 8', 'x = 4'],
    explanation: 'First subtract 6, then divide by 2'
  },
  {
    type: 'fillin',
    question: 'Fill in the blank',
    equation: '3x + 7 = 22, so x = ___',
    answer: '5',
    explanation: '3x = 22 − 7 = 15, so x = 15 ÷ 3 = 5'
  }
];

function loadQuestion() {
  if (questionIndex >= algebraQuestions.length) {
    showResult();
    return;
  }

  const q = algebraQuestions[questionIndex];
  const pct = (questionIndex / algebraQuestions.length) * 100;
  document.getElementById('progressFill').style.width = pct + '%';

  const area = document.getElementById('questionArea');

  if (q.type === 'mcq')    renderMCQ(q, area);
  if (q.type === 'fillin') renderFillin(q, area);
  if (q.type === 'drag')   renderDrag(q, area);
}
/* ── MCQ ──────────────────────────────── */
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
  const allBtns = document.querySelectorAll('.mcq-tile');
  allBtns.forEach(b => b.disabled = true);

  if (selected === correct) {
    btn.classList.add('correct');
    score++;
    showFeedback(true, explanation);
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => { if (b.textContent.trim() === correct) b.classList.add('correct'); });
    loseHeart();
    showFeedback(false, explanation);
  }
}

/* ── Fill in the blank ────────────────── */
function renderFillin(q, area) {
  area.innerHTML = `
    <div class="duo-question">
      <div class="duo-label">Fill in the blank</div>
      <div class="duo-equation">${q.equation}</div>
      <input id="fillInput" class="fill-input" type="number" placeholder="Type your answer...">
      <button class="btn-check" id="checkBtn" onclick="checkDrag(${JSON.stringify(q.correctOrder)}, '${q.explanation}')">Check ✅</button>
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
  document.querySelector('.btn-check').disabled = true;

  if (val === correct) {
    input.classList.add('input-correct');
    score++;
    showFeedback(true, explanation);
  } else {
    input.classList.add('input-wrong');
    input.value = correct;
    loseHeart();
    showFeedback(false, explanation);
  }
}

/* ── Drag to order ────────────────────── */
function renderDrag(q, area) {
  const shuffled = [...q.tiles].sort(() => Math.random() - 0.5);
  window.currentDragAnswer = q.correctOrder;
  window.currentDragExplanation = q.explanation;

  area.innerHTML = `
    <div class="duo-question">
      <div class="duo-label">Drag to put the steps in order</div>
      <div class="duo-equation">${q.equation}</div>
      <div class="drag-list" id="dragList">
        ${shuffled.map((tile, i) => `
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
    tile.addEventListener('dragstart', () => {
      dragging = tile;
      setTimeout(() => tile.classList.add('dragging'), 0);
    });
    tile.addEventListener('dragend', () => {
      tile.classList.remove('dragging');
      dragging = null;
    });
    tile.addEventListener('dragover', e => {
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

  tiles.forEach((t, i) => {
    t.classList.add(t.dataset.text === correct[i] ? 'correct' : 'wrong');
  });

  document.getElementById('checkBtn').disabled = true;

  if (isCorrect) {
    score++;
    showFeedback(true, explanation);
  } else {
    loseHeart();
    showFeedback(false, explanation);
  }
}

/* ── Feedback bar ─────────────────────── */
function showFeedback(correct, explanation) {
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
        <div class="fb-explain">${explanation}</div>
      </div>
    </div>
    <button class="btn-next" onclick="nextQuestion()">
      ${questionIndex + 1 >= algebraQuestions.length ? 'Finish 🏁' : 'Continue →'}
    </button>
  `;
  area.appendChild(bar);
  bar.scrollIntoView({ behavior: 'smooth', block: 'end' });
}
function nextQuestion() {
  questionIndex++;
  document.querySelector('.feedback-bar')?.remove();
  if (hearts <= 0) { showGameOver(); return; }
  loadQuestion();
}

/* ── Hearts ───────────────────────────── */
function loseHeart() {
  hearts = Math.max(0, hearts - 1);
  const display = document.getElementById('heartsDisplay');
  display.textContent = '❤️'.repeat(hearts) + '🖤'.repeat(3 - hearts);
  display.classList.add('heart-shake');
  setTimeout(() => display.classList.remove('heart-shake'), 400);
}

/* ── Game over ────────────────────────── */
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

/* ── Result ───────────────────────────── */
function showResult() {
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

renderHome();

renderHome();
