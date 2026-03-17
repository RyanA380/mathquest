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

renderHome();
