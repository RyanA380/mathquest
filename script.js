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


renderHome();
