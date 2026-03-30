// ── Sounds ────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function getAudioCtx() { if (!audioCtx) audioCtx = new AudioCtx(); return audioCtx; }

function playCorrect() {
  const ctx = getAudioCtx();
  [0,0.15,0.3].forEach((t,i) => {
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = [523,659,784][i]; osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime+t);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+t+0.3);
    osc.start(ctx.currentTime+t); osc.stop(ctx.currentTime+t+0.3);
  });
}
function playWrong() {
  const ctx = getAudioCtx();
  [330,280].forEach((freq,i) => {
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq; osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime+i*0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+i*0.15+0.2);
    osc.start(ctx.currentTime+i*0.15); osc.stop(ctx.currentTime+i*0.15+0.2);
  });
}
function playComplete() {
  const ctx = getAudioCtx();
  [523,587,659,698,784].forEach((freq,i) => {
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq; osc.type = 'sine';
    gain.gain.setValueAtTime(0.25, ctx.currentTime+i*0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+i*0.12+0.3);
    osc.start(ctx.currentTime+i*0.12); osc.stop(ctx.currentTime+i*0.12+0.3);
  });
}

// ── Auth ──────────────────────────────────
let currentUser = null;

function renderAuth(mode = 'login') {
  document.getElementById('app').innerHTML = `
    <div style="display:flex; min-height:100vh; width:100%;">
      <div style="flex:1; background:linear-gradient(135deg,#0d1b2e,#0a1628); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 40px; border-right:1px solid var(--border);">
        <div style="font-family:'Fredoka One',cursive; font-size:3rem; background:linear-gradient(135deg,#22c55e,#3b82f6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:16px;">⚡ MathQuest</div>
        <p style="color:var(--muted); font-size:1rem; font-weight:700; text-align:center; max-width:260px; line-height:1.6;">Math learning from Grade 1 to Grade 8!</p>
        <div style="margin-top:48px; display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
          ${['🔢 Grade 1–2: Numbers & Addition','➕ Grade 3–4: Multiplication','📐 Grade 5–6: Fractions & Algebra','📊 Grade 7–8: Advanced Math'].map(r => `
            <div style="background:#ffffff08; border:1px solid var(--border); border-radius:12px; padding:12px 16px; font-weight:700; font-size:.88rem;">${r}</div>
          `).join('')}
        </div>
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; padding:40px;">
        <div style="width:100%; max-width:400px;">
          <h2 style="font-family:'Fredoka One',cursive; font-size:2rem; margin-bottom:6px;">
            ${mode === 'login' ? 'Welcome back! 👋' : 'Join for free! 🚀'}
          </h2>
          <p style="color:var(--muted); font-size:.9rem; font-weight:700; margin-bottom:24px;">
            ${mode === 'login' ? 'Log in to continue your streak.' : 'Start your math adventure today.'}
          </p>
          ${mode === 'signup' ? `
            <div style="margin-bottom:16px;">
              <label style="${labelStyle()}">Your Name</label>
              <input id="authName" type="text" placeholder="e.g. Alex" style="${inputStyle()}">
            </div>
            <div style="margin-bottom:16px;">
              <label style="${labelStyle()}">Your Grade</label>
              <select id="authGrade" style="${inputStyle()}">
                ${[1,2,3,4,5,6,7,8].map(g => `<option value="${g}">Grade ${g}</option>`).join('')}
              </select>
            </div>
          ` : ''}
          <div style="margin-bottom:16px;">
            <label style="${labelStyle()}">Email</label>
            <input id="authEmail" type="email" placeholder="you@email.com" style="${inputStyle()}">
          </div>
          <div style="margin-bottom:24px;">
            <label style="${labelStyle()}">Password</label>
            <input id="authPassword" type="password" placeholder="••••••••" style="${inputStyle()}">
          </div>
          <div id="authError" style="display:none; background:#f8717118; border:1px solid var(--red); border-radius:10px; padding:10px 14px; font-size:.85rem; font-weight:700; color:var(--red); margin-bottom:16px;"></div>
          <button onclick="${mode === 'login' ? 'handleLogin()' : 'handleSignup()'}" style="${bigBtnStyle('#22c55e')}">
            ${mode === 'login' ? '🔑 Log In' : '🚀 Create Account'}
          </button>
          <div style="text-align:center; margin-top:20px; color:var(--muted); font-size:.88rem; font-weight:700;">
            ${mode === 'login'
              ? `Don't have an account? <span onclick="renderAuth('signup')" style="color:var(--green); cursor:pointer;">Sign up free →</span>`
              : `Already have an account? <span onclick="renderAuth('login')" style="color:var(--blue); cursor:pointer;">Log in →</span>`}
          </div>
          <div style="display:flex; align-items:center; gap:12px; margin:24px 0;">
            <div style="flex:1; height:1px; background:var(--border);"></div>
            <span style="color:var(--muted); font-size:.8rem; font-weight:700;">OR</span>
            <div style="flex:1; height:1px; background:var(--border);"></div>
          </div>
          <button onclick="handleGuest()" style="${bigBtnStyle('transparent', true)}">👤 Continue as Guest</button>
        </div>
      </div>
    </div>
  `;
}

function labelStyle() { return `font-size:.8rem; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; display:block; margin-bottom:6px;`; }
function inputStyle() { return `width:100%; padding:14px 16px; background:var(--panel); border:2px solid var(--border); border-radius:12px; color:var(--text); font-family:'Nunito',sans-serif; font-size:1rem; font-weight:700; outline:none; transition:border-color .2s;`; }
function bigBtnStyle(bg, ghost=false) { return `width:100%; padding:15px; background:${bg}; border:${ghost?'2px solid var(--border)':'none'}; border-radius:14px; color:${ghost?'var(--muted)':'#0d1117'}; font-family:'Nunito',sans-serif; font-size:1.05rem; font-weight:800; cursor:pointer; transition:filter .2s, transform .15s;`; }

function showAuthError(msg) {
  const el = document.getElementById('authError');
  el.textContent = msg; el.style.display = 'block';
}

function handleLogin() {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  if (!email || !password) return showAuthError('Please fill in all fields.');
  const users = JSON.parse(localStorage.getItem('mq_users') || '{}');
  if (!users[email]) return showAuthError('No account found. Sign up first!');
  if (users[email].password !== password) return showAuthError('Wrong password. Try again!');
  currentUser = { email, name: users[email].name, grade: users[email].grade || 6 };
  localStorage.setItem('mq_session', JSON.stringify(currentUser));
  renderHome();
}

function handleSignup() {
  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  const grade = parseInt(document.getElementById('authGrade').value);
  if (!name || !email || !password) return showAuthError('Please fill in all fields.');
  if (password.length < 6) return showAuthError('Password must be at least 6 characters.');
  const users = JSON.parse(localStorage.getItem('mq_users') || '{}');
  if (users[email]) return showAuthError('An account with this email already exists!');
  users[email] = { name, password, grade };
  localStorage.setItem('mq_users', JSON.stringify(users));
  currentUser = { email, name, grade };
  localStorage.setItem('mq_session', JSON.stringify(currentUser));
  renderHome();
}

function handleGuest() {
  currentUser = { name: 'Guest', email: null, grade: 6 };
  renderHome();
}

function logOut() {
  localStorage.removeItem('mq_session');
  currentUser = null;
  renderAuth('login');
}

function changeGrade(g) {
  currentUser.grade = parseInt(g);
  if (currentUser.email) {
    const users = JSON.parse(localStorage.getItem('mq_users') || '{}');
    if (users[currentUser.email]) users[currentUser.email].grade = currentUser.grade;
    localStorage.setItem('mq_users', JSON.stringify(users));
    localStorage.setItem('mq_session', JSON.stringify(currentUser));
  }
  renderHome();
}

// ── App state ─────────────────────────────
let darkMode = true;
let score = 0;
let questionIndex = 0;
let hearts = 3;
let currentQuestions = [];

// Stars per grade per realm
const allStars = {};
for (let g = 1; g <= 8; g++) allStars[g] = {1:0,2:0,3:0,4:0};

function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle('light', !darkMode);
  document.getElementById('themeBtn').textContent = darkMode ? '🌙' : '☀️';
}
function starsDisplay(n) { return [1,2,3].map(i => i <= n ? '⭐' : '☆').join(''); }

// ── Grade curriculum ───────────────────────
const curriculum = {
  1: {
    name: 'Grade 1',
    realms: [
      { id:1, name:'Counting & Numbers', icon:'🔢', color:'green', desc:'Count and recognise numbers up to 20' },
      { id:2, name:'Addition',           icon:'➕', color:'blue',  desc:'Add numbers up to 10' },
      { id:3, name:'Subtraction',        icon:'➖', color:'yellow',desc:'Subtract numbers up to 10' },
      { id:4, name:'Shapes',             icon:'🔷', color:'purple',desc:'Recognise basic 2D shapes', locked:true }
    ]
  },
  2: {
    name: 'Grade 2',
    realms: [
      { id:1, name:'Numbers to 100',     icon:'💯', color:'green', desc:'Count, order and compare numbers to 100' },
      { id:2, name:'Addition',           icon:'➕', color:'blue',  desc:'Add numbers up to 100' },
      { id:3, name:'Subtraction',        icon:'➖', color:'yellow',desc:'Subtract numbers up to 100' },
      { id:4, name:'Multiplication Intro',icon:'✖️',color:'purple',desc:'Intro to times tables', locked:true }
    ]
  },
  3: {
    name: 'Grade 3',
    realms: [
      { id:1, name:'Multiplication',     icon:'✖️', color:'green', desc:'Times tables up to 10×10' },
      { id:2, name:'Division',           icon:'➗', color:'blue',  desc:'Basic division facts' },
      { id:3, name:'Fractions Intro',    icon:'½',  color:'yellow',desc:'Halves, thirds and quarters' },
      { id:4, name:'Measurement',        icon:'📏', color:'purple',desc:'Length, mass and capacity', locked:true }
    ]
  },
  4: {
    name: 'Grade 4',
    realms: [
      { id:1, name:'Large Numbers',      icon:'🔢', color:'green', desc:'Numbers up to 10,000' },
      { id:2, name:'Multiplication',     icon:'✖️', color:'blue',  desc:'Multi-digit multiplication' },
      { id:3, name:'Fractions',          icon:'½',  color:'yellow',desc:'Equivalent fractions' },
      { id:4, name:'Geometry',           icon:'📐', color:'purple',desc:'Angles and shapes', locked:true }
    ]
  },
  5: {
    name: 'Grade 5',
    realms: [
      { id:1, name:'Decimals',           icon:'🔣', color:'green', desc:'Add and subtract decimals' },
      { id:2, name:'Fractions',          icon:'½',  color:'blue',  desc:'Add and subtract fractions' },
      { id:3, name:'Percentages',        icon:'%',  color:'yellow',desc:'Intro to percentages' },
      { id:4, name:'Area & Perimeter',   icon:'📐', color:'purple',desc:'Calculate area and perimeter', locked:true }
    ]
  },
  6: {
    name: 'Grade 6',
    realms: [
      { id:1, name:'Algebra',            icon:'🔢', color:'green', desc:'Solve for x and crack equations' },
      { id:2, name:'Geometry',           icon:'📐', color:'blue',  desc:'Areas, angles and shapes' },
      { id:3, name:'Fractions & Decimals',icon:'🔣',color:'yellow',desc:'Fractions, decimals and more' },
      { id:4, name:'Percentages',        icon:'📊', color:'purple',desc:'Ratios, percentages and rates', locked:true }
    ]
  },
  7: {
    name: 'Grade 7',
    realms: [
      { id:1, name:'Linear Equations',   icon:'📈', color:'green', desc:'Solve and graph linear equations' },
      { id:2, name:'Geometry',           icon:'📐', color:'blue',  desc:'Angles, triangles and circles' },
      { id:3, name:'Ratios & Rates',     icon:'⚖️', color:'yellow',desc:'Ratios, rates and proportions' },
      { id:4, name:'Statistics',         icon:'📊', color:'purple',desc:'Mean, median, mode and range', locked:true }
    ]
  },
  8: {
    name: 'Grade 8',
    realms: [
      { id:1, name:'Algebra',            icon:'🔢', color:'green', desc:'Quadratics and systems of equations' },
      { id:2, name:'Pythagoras',         icon:'📐', color:'blue',  desc:'Pythagorean theorem and applications' },
      { id:3, name:'Linear Functions',   icon:'📈', color:'yellow',desc:'Slope, intercept and graphing' },
      { id:4, name:'Probability',        icon:'🎲', color:'purple',desc:'Probability and statistics', locked:true }
    ]
  }
};

// ── Question generator ─────────────────────
function generateQuestions(grade, realmId) {
  const qs = [];
  const r = () => Math.floor(Math.random() * 9) + 1;
  const r2 = (min,max) => Math.floor(Math.random()*(max-min+1))+min;

  if (grade === 1) {
    if (realmId === 1) { // Counting
      for (let i=0;i<6;i++) {
        const n = r2(1,20);
        const opts = shuffle([n, n+1, n-1, n+2].filter(x=>x>0&&x<=20).slice(0,4));
        qs.push({ type:'mcq', equation:`What number comes after ${n-1}?`, options:opts.map(String), answer:String(n), explanation:`${n-1} + 1 = ${n}` });
      }
    }
    if (realmId === 2) { // Addition to 10
      for (let i=0;i<3;i++) {
        const a=r2(1,5),b=r2(1,5-(a-1));
        qs.push({ type:'fillin', equation:`${a} + ${b} = ___`, answer:String(a+b), explanation:`${a} + ${b} = ${a+b}` });
      }
      for (let i=0;i<3;i++) {
        const a=r2(1,5),b=r2(1,5);
        const ans=a+b;
        const opts=shuffle([ans,ans+1,ans-1,ans+2].filter(x=>x>0).slice(0,4));
        qs.push({ type:'mcq', equation:`${a} + ${b} = ?`, options:opts.map(String), answer:String(ans), explanation:`${a} + ${b} = ${ans}` });
      }
    }
    if (realmId === 3) { // Subtraction to 10
      for (let i=0;i<3;i++) {
        const a=r2(3,10),b=r2(1,a);
        qs.push({ type:'fillin', equation:`${a} − ${b} = ___`, answer:String(a-b), explanation:`${a} − ${b} = ${a-b}` });
      }
      for (let i=0;i<3;i++) {
        const a=r2(3,10),b=r2(1,a);
        const ans=a-b;
        const opts=shuffle([ans,ans+1,ans-1,ans+2].filter(x=>x>=0).slice(0,4));
        qs.push({ type:'mcq', equation:`${a} − ${b} = ?`, options:opts.map(String), answer:String(ans), explanation:`${a} − ${b} = ${ans}` });
      }
    }
  }

  if (grade === 2) {
    if (realmId === 1) { // Numbers to 100
      for (let i=0;i<6;i++) {
        const n=r2(10,99);
        const opts=shuffle([n,n+10,n-10,n+1].filter(x=>x>0&&x<=100).slice(0,4));
        qs.push({ type:'mcq', equation:`Which number is 10 more than ${n}?`, options:opts.map(String), answer:String(n+10<=100?n+10:n-10), explanation:`${n} + 10 = ${n+10}` });
      }
    }
    if (realmId === 2) { // Addition to 100
      for (let i=0;i<3;i++) {
        const a=r2(10,50),b=r2(10,50);
        qs.push({ type:'fillin', equation:`${a} + ${b} = ___`, answer:String(a+b), explanation:`${a} + ${b} = ${a+b}` });
      }
      for (let i=0;i<3;i++) {
        const a=r2(10,40),b=r2(10,40);
        const ans=a+b;
        const opts=shuffle([ans,ans+10,ans-10,ans+1].filter(x=>x>0).slice(0,4));
        qs.push({ type:'mcq', equation:`${a} + ${b} = ?`, options:opts.map(String), answer:String(ans), explanation:`${a} + ${b} = ${ans}` });
      }
    }
    if (realmId === 3) { // Subtraction to 100
      for (let i=0;i<3;i++) {
        const a=r2(20,99),b=r2(10,a-10);
        qs.push({ type:'fillin', equation:`${a} − ${b} = ___`, answer:String(a-b), explanation:`${a} − ${b} = ${a-b}` });
      }
      for (let i=0;i<3;i++) {
        const a=r2(20,99),b=r2(10,a-10);
        const ans=a-b;
        const opts=shuffle([ans,ans+10,ans-10,ans+1].filter(x=>x>=0).slice(0,4));
        qs.push({ type:'mcq', equation:`${a} − ${b} = ?`, options:opts.map(String), answer:String(ans), explanation:`${a} − ${b} = ${ans}` });
      }
    }
  }

  if (grade === 3) {
    if (realmId === 1) { // Multiplication
      for (let i=0;i<3;i++) {
        const a=r2(2,10),b=r2(2,10);
        qs.push({ type:'fillin', equation:`${a} × ${b} = ___`, answer:String(a*b), explanation:`${a} × ${b} = ${a*b}` });
      }
      for (let i=0;i<3;i++) {
        const a=r2(2,10),b=r2(2,10);
        const ans=a*b;
        const opts=shuffle([ans,ans+a,ans-b,ans+b].filter(x=>x>0).slice(0,4));
        qs.push({ type:'mcq', equation:`${a} × ${b} = ?`, options:opts.map(String), answer:String(ans), explanation:`${a} × ${b} = ${ans}` });
      }
    }
    if (realmId === 2) { // Division
      for (let i=0;i<3;i++) {
        const b=r2(2,9),ans=r2(2,9);
        qs.push({ type:'fillin', equation:`${b*ans} ÷ ${b} = ___`, answer:String(ans), explanation:`${b*ans} ÷ ${b} = ${ans}` });
      }
      for (let i=0;i<3;i++) {
        const b=r2(2,9),ans=r2(2,9);
        const opts=shuffle([ans,ans+1,ans-1,ans+2].filter(x=>x>0).slice(0,4));
        qs.push({ type:'mcq', equation:`${b*ans} ÷ ${b} = ?`, options:opts.map(String), answer:String(ans), explanation:`${b*ans} ÷ ${b} = ${ans}` });
      }
    }
    if (realmId === 3) { // Fractions
      const fracs = [{n:1,d:2},{n:1,d:3},{n:1,d:4},{n:2,d:4},{n:3,d:4},{n:2,d:3}];
      for (let i=0;i<6;i++) {
        const f=fracs[r2(0,fracs.length-1)];
        const opts=['1/2','1/3','1/4','2/3','3/4','2/4'];
        const ans=`${f.n}/${f.d}`;
        const wrongOpts=shuffle(opts.filter(o=>o!==ans)).slice(0,3);
        qs.push({ type:'mcq', equation:`What fraction of the shape is shaded? (${f.n} out of ${f.d} parts)`, options:shuffle([ans,...wrongOpts]), answer:ans, explanation:`${f.n} shaded out of ${f.d} total parts = ${ans}` });
      }
    }
  }

  if (grade === 4) {
    if (realmId === 1) { // Large numbers
      for (let i=0;i<3;i++) {
        const a=r2(100,999),b=r2(100,999);
        qs.push({ type:'fillin', equation:`${a} + ${b} = ___`, answer:String(a+b), explanation:`${a} + ${b} = ${a+b}` });
      }
      for (let i=0;i<3;i++) {
        const a=r2(1000,9999);
        const opts=shuffle([a,a+100,a-100,a+1000].filter(x=>x>0).slice(0,4));
        qs.push({ type:'mcq', equation:`Round ${a} to the nearest hundred`, options:opts.map(String), answer:String(Math.round(a/100)*100), explanation:`${a} rounded to nearest 100 = ${Math.round(a/100)*100}` });
      }
    }
    if (realmId === 2) { // Multi-digit multiplication
      for (let i=0;i<3;i++) {
        const a=r2(11,99),b=r2(2,9);
        qs.push({ type:'fillin', equation:`${a} × ${b} = ___`, answer:String(a*b), explanation:`${a} × ${b} = ${a*b}` });
      }
      for (let i=0;i<3;i++) {
        const a=r2(11,50),b=r2(2,9);
        const ans=a*b;
        const opts=shuffle([ans,ans+b,ans-b,ans+10].filter(x=>x>0).slice(0,4));
        qs.push({ type:'mcq', equation:`${a} × ${b} = ?`, options:opts.map(String), answer:String(ans), explanation:`${a} × ${b} = ${ans}` });
      }
    }
    if (realmId === 3) { // Equivalent fractions
      const pairs=[{a:'1/2',b:'2/4'},{a:'1/3',b:'2/6'},{a:'2/3',b:'4/6'},{a:'3/4',b:'6/8'}];
      for (let i=0;i<6;i++) {
        const p=pairs[r2(0,pairs.length-1)];
        const opts=['2/4','2/6','3/6','4/8','6/8','3/9'];
        qs.push({ type:'mcq', equation:`Which fraction is equivalent to ${p.a}?`, options:shuffle([p.b,...shuffle(opts.filter(o=>o!==p.b)).slice(0,3)]), answer:p.b, explanation:`${p.a} = ${p.b} (multiply top and bottom by the same number)` });
      }
    }
  }

  if (grade === 5) {
    if (realmId === 1) { // Decimals
      for (let i=0;i<3;i++) {
        const a=(r2(1,99)/10).toFixed(1),b=(r2(1,99)/10).toFixed(1);
        const ans=(parseFloat(a)+parseFloat(b)).toFixed(1);
        qs.push({ type:'fillin', equation:`${a} + ${b} = ___`, answer:ans, explanation:`${a} + ${b} = ${ans}` });
      }
      for (let i=0;i<3;i++) {
        const a=(r2(10,99)/10).toFixed(1),b=(r2(1,50)/10).toFixed(1);
        const ans=(parseFloat(a)-parseFloat(b)).toFixed(1);
        const opts=shuffle([ans,(parseFloat(ans)+0.1).toFixed(1),(parseFloat(ans)-0.1).toFixed(1),(parseFloat(ans)+1).toFixed(1)].filter(x=>parseFloat(x)>=0).slice(0,4));
        qs.push({ type:'mcq', equation:`${a} − ${b} = ?`, options:opts, answer:ans, explanation:`${a} − ${b} = ${ans}` });
      }
    }
    if (realmId === 2) { // Fractions
      const pairs=[{a:1,b:2,c:1,d:4},{a:1,b:3,c:1,d:6},{a:1,b:2,c:1,d:3},{a:2,b:3,c:1,d:4}];
      for (let i=0;i<6;i++) {
        const p=pairs[r2(0,pairs.length-1)];
        const num=p.a*p.d+p.c*p.b,den=p.b*p.d;
        const g=gcd(num,den);
        const ans=`${num/g}/${den/g}`;
        const opts=shuffle([ans,`${num/g+1}/${den/g}`,`${num/g-1}/${den/g}`,`${num/g}/${den/g+1}`].filter(o=>!o.startsWith('0')&&!o.startsWith('-')).slice(0,4));
        qs.push({ type:'mcq', equation:`${p.a}/${p.b} + ${p.c}/${p.d} = ?`, options:opts, answer:ans, explanation:`Find common denominator, then add numerators` });
      }
    }
    if (realmId === 3) { // Percentages
      const pcts=[10,20,25,50,75];
      for (let i=0;i<3;i++) {
        const pct=pcts[r2(0,pcts.length-1)],n=r2(1,20)*4;
        const ans=String(pct*n/100);
        qs.push({ type:'fillin', equation:`${pct}% of ${n} = ___`, answer:ans, explanation:`${pct}/100 × ${n} = ${ans}` });
      }
      for (let i=0;i<3;i++) {
        const pct=pcts[r2(0,pcts.length-1)],n=r2(1,20)*4;
        const ans=String(pct*n/100);
        const opts=shuffle([ans,String(pct*n/100+pct),String(pct*n/100-pct/2),String(n-pct)].filter(x=>parseFloat(x)>0).slice(0,4));
        qs.push({ type:'mcq', equation:`${pct}% of ${n} = ?`, options:opts, answer:ans, explanation:`${pct}/100 × ${n} = ${ans}` });
      }
    }
  }

  if (grade === 6) {
    if (realmId === 1) { // Algebra
      for (let i=0;i<3;i++) {
        const b=r2(1,10),x=r2(1,10),a=r2(2,5);
        const c=a*x+b;
        const ans=`x = ${x}`;
        const opts=shuffle([ans,`x = ${x+1}`,`x = ${x-1}`,`x = ${x+2}`].filter(o=>!o.includes('-')).slice(0,4));
        qs.push({ type:'mcq', equation:`${a}x + ${b} = ${c}`, options:opts, answer:ans, explanation:`Subtract ${b}: ${a}x = ${c-b}, then divide by ${a}: x = ${x}` });
      }
      for (let i=0;i<3;i++) {
        const x=r2(2,12),a=r2(2,9);
        qs.push({ type:'fillin', equation:`${a}x = ${a*x}, so x = ___`, answer:String(x), explanation:`Divide both sides by ${a}: x = ${a*x} ÷ ${a} = ${x}` });
      }
    }
    if (realmId === 2) { // Geometry
      for (let i=0;i<3;i++) {
        const w=r2(2,15),h=r2(2,15);
        const ans=String(w*h);
        const opts=shuffle([ans,String(w*h+w),String(2*(w+h)),String(w*h-h)].filter(x=>parseInt(x)>0).slice(0,4));
        qs.push({ type:'mcq', equation:`Area of rectangle: width=${w}, height=${h}`, options:opts, answer:ans, explanation:`Area = width × height = ${w} × ${h} = ${ans}` });
      }
      for (let i=0;i<3;i++) {
        const b=r2(2,15),h=r2(2,15);
        const ans=String(0.5*b*h);
        qs.push({ type:'fillin', equation:`Area of triangle: base=${b}, height=${h}. Area = ___`, answer:ans, explanation:`Area = ½ × base × height = ½ × ${b} × ${h} = ${ans}` });
      }
    }
    if (realmId === 3) { // Fractions & Decimals
      for (let i=0;i<3;i++) {
        const a=r2(1,9),b=r2(2,9);
        const dec=(a/b).toFixed(2);
        qs.push({ type:'fillin', equation:`Convert ${a}/${b} to a decimal (2dp): ___`, answer:dec, explanation:`${a} ÷ ${b} = ${dec}` });
      }
      for (let i=0;i<3;i++) {
        const decs=['0.25','0.5','0.75','0.1','0.2'];
        const fracs=['1/4','1/2','3/4','1/10','1/5'];
        const idx=r2(0,4);
        qs.push({ type:'mcq', equation:`Convert ${decs[idx]} to a fraction`, options:shuffle([fracs[idx],...shuffle(fracs.filter((_,j)=>j!==idx)).slice(0,3)]), answer:fracs[idx], explanation:`${decs[idx]} = ${fracs[idx]}` });
      }
    }
  }

  if (grade === 7) {
    if (realmId === 1) { // Linear equations
      for (let i=0;i<3;i++) {
        const x=r2(1,10),a=r2(2,6),b=r2(1,10);
        const c=a*x+b;
        qs.push({ type:'fillin', equation:`${a}x + ${b} = ${c}, so x = ___`, answer:String(x), explanation:`Subtract ${b}: ${a}x = ${c-b}, divide by ${a}: x = ${x}` });
      }
      for (let i=0;i<3;i++) {
        const x=r2(1,10),a=r2(2,6),b=r2(1,10),c=r2(1,5);
        const d=a*x+b-c*x;
        const ans=String(x);
        const opts=shuffle([ans,String(x+1),String(x-1),String(x+2)].filter(o=>parseInt(o)>0).slice(0,4));
        qs.push({ type:'mcq', equation:`${a}x + ${b} = ${c}x + ${d+c*x}`, options:opts, answer:ans, explanation:`Collect x terms: ${a-c}x = ${d}, so x = ${x}` });
      }
    }
    if (realmId === 2) { // Geometry
      for (let i=0;i<3;i++) {
        const r=r2(2,10);
        const ans=(Math.PI*r*r).toFixed(1);
        const opts=shuffle([ans,(Math.PI*r*r+r).toFixed(1),(2*Math.PI*r).toFixed(1),(Math.PI*r*r-r).toFixed(1)].slice(0,4));
        qs.push({ type:'mcq', equation:`Area of circle with radius ${r} (use π=3.14159, round to 1dp)`, options:opts, answer:ans, explanation:`Area = πr² = π × ${r}² = ${ans}` });
      }
      for (let i=0;i<3;i++) {
        const angles=[r2(20,80),r2(20,80)];
        const third=180-angles[0]-angles[1];
        qs.push({ type:'fillin', equation:`Triangle angles: ${angles[0]}° and ${angles[1]}°. Third angle = ___°`, answer:String(third), explanation:`Angles in triangle add to 180°: 180 - ${angles[0]} - ${angles[1]} = ${third}` });
      }
    }
    if (realmId === 3) { // Ratios
      for (let i=0;i<3;i++) {
        const a=r2(1,8),b=r2(1,8),total=r2(10,50)*(a+b);
        const share=total/(a+b)*a;
        qs.push({ type:'fillin', equation:`Share ${total} in ratio ${a}:${b}. Larger share = ___`, answer:String(Math.max(share,total-share)), explanation:`Total parts = ${a+b}. Each part = ${total/(a+b)}. Larger share = ${Math.max(share,total-share)}` });
      }
      for (let i=0;i<3;i++) {
        const a=r2(2,8),b=r2(2,8);
        const g=gcd(a,b);
        const ans=`${a/g}:${b/g}`;
        const opts=shuffle([ans,`${a}:${b}`,`${a/g+1}:${b/g}`,`${a/g}:${b/g+1}`].slice(0,4));
        qs.push({ type:'mcq', equation:`Simplify the ratio ${a}:${b}`, options:opts, answer:ans, explanation:`GCD of ${a} and ${b} is ${g}. ${a}÷${g} : ${b}÷${g} = ${ans}` });
      }
    }
  }

  if (grade === 8) {
    if (realmId === 1) { // Algebra - quadratics
      const pairs=[[1,2],[2,3],[1,4],[3,2],[1,5]];
      for (let i=0;i<3;i++) {
        const [p,q]=pairs[r2(0,pairs.length-1)];
        const b=p+q,c=p*q;
        const ans=`x = ${p} or x = ${q}`;
        const opts=shuffle([ans,`x = ${p+1} or x = ${q}`,`x = ${p} or x = ${q+1}`,`x = ${p-1} or x = ${q-1}`].slice(0,4));
        qs.push({ type:'mcq', equation:`Solve: x² − ${b}x + ${c} = 0`, options:opts, answer:ans, explanation:`Factorise: (x−${p})(x−${q})=0, so x=${p} or x=${q}` });
      }
      for (let i=0;i<3;i++) {
        const x=r2(1,10),a=r2(2,5),b=r2(1,10);
        const c=a*x+b;
        qs.push({ type:'fillin', equation:`${a}x + ${b} = ${c}, x = ___`, answer:String(x), explanation:`${a}x = ${c-b}, x = ${x}` });
      }
    }
    if (realmId === 2) { // Pythagoras
      const triples=[[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]];
      for (let i=0;i<3;i++) {
        const [a,b,c]=triples[r2(0,triples.length-1)];
        qs.push({ type:'fillin', equation:`Right triangle: legs ${a} and ${b}. Hypotenuse = ___`, answer:String(c), explanation:`c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}, so c = ${c}` });
      }
      for (let i=0;i<3;i++) {
        const [a,b,c]=triples[r2(0,triples.length-1)];
        const opts=shuffle([c,c+1,c-1,c+2].map(String).slice(0,4));
        qs.push({ type:'mcq', equation:`Find the hypotenuse: legs = ${a} and ${b}`, options:opts, answer:String(c), explanation:`√(${a}² + ${b}²) = √${a*a+b*b} = ${c}` });
      }
    }
    if (realmId === 3) { // Linear functions
      for (let i=0;i<3;i++) {
        const m=r2(1,5),b=r2(0,8),x=r2(1,6);
        const y=m*x+b;
        qs.push({ type:'fillin', equation:`y = ${m}x + ${b}. When x = ${x}, y = ___`, answer:String(y), explanation:`y = ${m}×${x} + ${b} = ${m*x} + ${b} = ${y}` });
      }
      for (let i=0;i<3;i++) {
        const m=r2(1,5),b=r2(0,8);
        const ans=`y = ${m}x + ${b}`;
        const opts=shuffle([ans,`y = ${m+1}x + ${b}`,`y = ${m}x + ${b+1}`,`y = ${m-1}x + ${b}`].filter(o=>!o.includes('0x')).slice(0,4));
        qs.push({ type:'mcq', equation:`Line with slope ${m} and y-intercept ${b}`, options:opts, answer:ans, explanation:`slope-intercept form: y = mx + b = ${m}x + ${b}` });
      }
    }
  }

  return shuffle(qs).slice(0, 6);
}

// ── Helpers ───────────────────────────────
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

// ── Home ──────────────────────────────────
function renderHome() {
  score = 0; questionIndex = 0; hearts = 3;
  const grade = currentUser.grade || 6;
  const gradeData = curriculum[grade];
  const totalStars = Object.values(allStars[grade]).reduce((a,b) => a+b, 0);
  const gems = totalStars * 10;
  const xpPct = Math.min((totalStars * 50 / 150) * 100, 100);

  document.getElementById('app').innerHTML = `
    <nav class="sidebar">
      <div class="sidebar-logo">⚡ MathQuest</div>
      <div style="padding:0 8px; margin-bottom:16px; font-size:.85rem; font-weight:700; color:var(--muted);">👋 Hey, ${currentUser.name}!</div>

      <div style="padding:0 8px; margin-bottom:20px;">
        <label style="font-size:.72rem; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; display:block; margin-bottom:6px;">Your Grade</label>
        <select onchange="changeGrade(this.value)" style="width:100%; padding:10px 12px; background:var(--panel); border:2px solid var(--border); border-radius:10px; color:var(--text); font-family:'Nunito',sans-serif; font-weight:800; font-size:.9rem; cursor:pointer;">
          ${[1,2,3,4,5,6,7,8].map(g => `<option value="${g}" ${g===grade?'selected':''}>Grade ${g}</option>`).join('')}
        </select>
      </div>

      <div class="sidebar-nav">
        <div class="nav-item active"><span class="nav-icon">🗺️</span> Learn</div>
        <div class="nav-item"><span class="nav-icon">🏆</span> Leaderboard</div>
        <div class="nav-item"><span class="nav-icon">👤</span> Profile</div>
        <div class="nav-item" onclick="toggleTheme()"><span class="nav-icon" id="themeBtn">🌙</span> Theme</div>
        <div class="nav-item" onclick="logOut()" style="color:var(--red);"><span class="nav-icon">🚪</span> Log Out</div>
      </div>
      <div class="sidebar-stats">
        <div class="sidebar-stat"><span class="ss-icon">🔥</span><div class="ss-info"><span class="ss-val">1</span><span class="ss-label">Streak</span></div></div>
        <div class="sidebar-stat"><span class="ss-icon">💎</span><div class="ss-info"><span class="ss-val">${gems}</span><span class="ss-label">Gems</span></div></div>
        <div class="sidebar-stat"><span class="ss-icon">⚡</span><div class="ss-info"><span class="ss-val">${totalStars*50} XP</span><span class="ss-label">Experience</span></div></div>
      </div>
    </nav>

    <main class="main">
      <div class="main-header">
        <div class="main-title">🗺️ ${gradeData.name} Learning Path</div>
        <div class="main-sub">Complete realms to earn gems and level up!</div>
      </div>
      <div class="xp-wrap">
        <div class="xp-label"><span>⚡ Level ${Math.floor(totalStars/3)+1}</span><span>${totalStars*50} / 150 XP</span></div>
        <div class="xp-bg"><div class="xp-fill" style="width:${xpPct}%"></div></div>
      </div>
      <div class="section-label">Your Realms — ${gradeData.name}</div>
      <div class="realm-path">
        ${gradeData.realms.map((realm, idx) => `
          <div class="path-step">
            <div class="realm-bubble c-${realm.color} ${realm.locked ? 'locked' : ''}"
              ${!realm.locked ? `onclick="startRealm(${grade}, ${realm.id})"` : ''}>
              <div class="bubble-icon">${realm.icon}</div>
              <div class="bubble-info">
                <div class="bubble-name">${realm.name}</div>
                <div class="bubble-desc">${realm.desc}</div>
                <div class="bubble-stars">${starsDisplay(allStars[grade][realm.id])}</div>
              </div>
              <span class="bubble-tag ${realm.locked ? 'tag-locked' : 'tag-'+realm.color}">${realm.locked ? '🔒' : '+10 💎'}</span>
            </div>
          </div>
          ${idx < gradeData.realms.length-1 ? `<div class="path-connector ${allStars[grade][realm.id]>0?'done':''}"></div>` : ''}
        `).join('')}
        <div class="path-connector"></div>
        <div class="path-step">
          <div class="daily-card" onclick="startRealm(${grade}, 1)">
            <span class="daily-icon">⚡</span>
            <div><div class="daily-title">Daily Challenge</div><div class="daily-sub">Bonus 💎 20 gems today!</div></div>
            <span class="daily-arrow">→</span>
          </div>
        </div>
      </div>
    </main>

    <aside class="right-panel">
      <div class="rp-card">
        <div class="rp-title">🔥 Streak</div>
        <div class="streak-box"><div class="streak-fire">🔥</div><div class="streak-num">1</div><div class="streak-label">Day streak</div></div>
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

// ── Start realm ───────────────────────────
let currentGrade = 6;
let currentRealmId = 1;

function startRealm(grade, realmId) {
  currentGrade = grade;
  currentRealmId = realmId;
  score = 0; questionIndex = 0; hearts = 3;
  window.lessonStreak = 0;
  window.lessonGems = Object.values(allStars[grade]).reduce((a,b)=>a+b,0)*10;
  currentQuestions = generateQuestions(grade, realmId);

  const realm = curriculum[grade].realms.find(r => r.id === realmId);

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
          <div class="mascot-bubble" id="mascotBubble">Let's do some ${realm ? realm.name : 'math'}! You got this! 💪</div>
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

function showRealm(n) { startRealm(currentUser.grade || 6, n); }

// ── Load question ─────────────────────────
function loadQuestion() {
  if (questionIndex >= currentQuestions.length) { showResult(); return; }
  const q = currentQuestions[questionIndex];
  document.getElementById('progressFill').style.width = (questionIndex / currentQuestions.length * 100) + '%';
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
          <button class="mcq-tile" onclick="checkMCQ(this, \`${opt}\`, \`${q.answer}\`, \`${q.explanation}\`)">
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
    score++; playCorrect(); launchConfetti(); updateStreak(true); updateGems(10); setMascot('correct');
    showFeedback(true, explanation);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.mcq-tile').forEach(b => { if (b.textContent.trim() === correct) b.classList.add('correct'); });
    playWrong(); loseHeart(); updateStreak(false); setMascot('wrong');
    showFeedback(false, explanation);
  }
}

// ── Fill in the blank ─────────────────────
function renderFillin(q, area) {
  area.innerHTML = `
    <div class="duo-question">
      <div class="duo-label">Fill in the blank</div>
      <div class="duo-equation">${q.equation}</div>
      <input id="fillInput" class="fill-input" type="text" placeholder="Type your answer...">
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
    score++; playCorrect(); launchConfetti(); updateStreak(true); updateGems(10); setMascot('correct');
    showFeedback(true, explanation);
  } else {
    input.classList.add('input-wrong');
    input.value = `✗ Answer: ${correct}`;
    playWrong(); loseHeart(); updateStreak(false); setMascot('wrong');
    showFeedback(false, explanation);
  }
}

// ── Drag ──────────────────────────────────
function renderDrag(q, area) {
  const shuffled = shuffle(q.tiles);
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
  return [...container.querySelectorAll('.drag-tile:not(.dragging)')].reduce((closest, tile) => {
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
  tiles.forEach((t,i) => t.classList.add(t.dataset.text === correct[i] ? 'correct' : 'wrong'));
  document.getElementById('checkBtn').disabled = true;
  if (isCorrect) {
    score++; playCorrect(); launchConfetti(); updateStreak(true); updateGems(10); setMascot('correct');
    showFeedback(true, explanation);
  } else {
    playWrong(); loseHeart(); updateStreak(false); setMascot('wrong');
    showFeedback(false, explanation);
  }
}

// ── Feedback ──────────────────────────────
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
    <button class="btn-next" id="continueBtn" onclick="nextQuestion()">
      ${questionIndex + 1 >= currentQuestions.length ? 'Finish 🏁' : 'Continue →'}
    </button>
  `;
  area.appendChild(bar);
  bar.scrollIntoView({ behavior: 'smooth', block: 'end' });

  const bubble = document.getElementById('mascotBubble');
  if (bubble) {
    bubble.textContent = correct
      ? `✅ ${explanation} Keep it up!`
      : `💡 ${explanation} You'll get it next time!`;
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
      <button class="btn-check" style="margin-top:24px" onclick="startRealm(${currentGrade}, ${currentRealmId})">Try Again 🔄</button>
      <br><br>
      <button class="btn-back" onclick="renderHome()">← Home</button>
    </div>
  `;
}

// ── Result ────────────────────────────────
function showResult() {
  playComplete(); setMascot('finish'); launchConfetti();
  document.getElementById('progressFill').style.width = '100%';
  const total = currentQuestions.length;
  const earned = score >= total ? 3 : score >= total * 0.6 ? 2 : score >= 1 ? 1 : 0;
  allStars[currentGrade][currentRealmId] = Math.max(allStars[currentGrade][currentRealmId], earned);

  document.getElementById('questionArea').innerHTML = `
    <div class="result-box">
      <div class="result-emoji">${score === total ? '🏆' : score >= 3 ? '🎉' : '💪'}</div>
      <h3>Realm Complete!</h3>
      <p>You scored <strong>${score} / ${total}</strong></p>
      <div class="result-stars">${starsDisplay(earned)}</div>
      <button class="btn-check" style="margin-top:24px" onclick="startRealm(${currentGrade}, ${currentRealmId})">Play Again 🔄</button>
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
    correct: ['Amazing! 🎉','You\'re on fire! 🔥','Nailed it! ⭐','Brilliant! 🏆'][Math.floor(Math.random()*4)],
    wrong:   ['Keep trying! 💙','Almost there!','Don\'t give up! 💪','You\'ll get the next one!'][Math.floor(Math.random()*4)],
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

// ── Streak & Gems ─────────────────────────
function updateStreak(correct) {
  window.lessonStreak = correct ? window.lessonStreak + 1 : 0;
  const el = document.getElementById('streakCount');
  if (el) { el.textContent = window.lessonStreak; el.parentElement.classList.toggle('streak-hot', window.lessonStreak >= 3); }
}
function updateGems(amount) {
  window.lessonGems = Math.max(0, window.lessonGems + amount);
  const el = document.getElementById('gemCount');
  if (el) el.textContent = window.lessonGems;
}

// ── Hint ──────────────────────────────────
function useHint() {
  const bubble = document.getElementById('mascotBubble');
  if (window.lessonGems < 5) {
    if (bubble) bubble.textContent = "Not enough gems! 😢 Keep answering correctly to earn more!";
    return;
  }
  updateGems(-5);
  const q = currentQuestions[questionIndex];
  const hints = {
    mcq:    'Try eliminating wrong answers first, then substitute the remaining options.',
    fillin: 'Work step by step — isolate the unknown on one side.',
    drag:   'Start with what you know comes first, then build from there.'
  };
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
