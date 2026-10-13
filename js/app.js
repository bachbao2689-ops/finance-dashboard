/**
 * CYBER-ORGANIC LIQUID GLASS — FINANCE DASHBOARD CORE APPLICATION
 * Preserves 100% of Firebase Firestore cloud sync, debt tracking,
 * category drill-down, analytics, and CSV exports while adding
 * Dark Mode theme switching and Magnetic physics responsiveness.
 */

// ═══════════════════════════════════════════════════════
//  CONSTANTS & DESIGN TOKENS
// ═══════════════════════════════════════════════════════
const TODAY = '2026-09-11';
const PAGE  = 7;

// Cyber Liquid Palette for Charts & Badges
const CYBER_PALETTE = [
  '#002e6d', // Brand Navy
  '#38bdf8', // Cyan Glow
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#64748b'  // Slate
];

const QA = [
  { ico:'🍱', lbl:'Ăn trưa',    title:'Ăn trưa - Quán Cơm Quỳnh Anh', cat:'Ăn uống',            type:'expense' },
  { ico:'🥖', lbl:'Ăn sáng',    title:'Ăn sáng - Bánh Mì O Mi',        cat:'Ăn uống',            type:'expense' },
  { ico:'🚗', lbl:'Grab',       title:'Di chuyển - Grab',              cat:'Di chuyển',          type:'expense' },
  { ico:'🏪', lbl:'FamilyMart', title:'Tiện lợi - FamilyMart',         cat:'Cửa hàng tiện lợi', type:'expense' },
  { ico:'🏪', lbl:'Ministop',   title:'Tiện lợi - Ministop',           cat:'Cửa hàng tiện lợi', type:'expense' },
  { ico:'☕', lbl:'Cà phê',     title:'Cà phê - Highlands',            cat:'Ăn uống',            type:'expense' },
];

const MOCK_TX = [
  { id:1,  title:'Lương tháng 8',        amount:25000000, type:'income',  cat:'Tiền lương',         date:'2026-09-05', note:'' },
  { id:2,  title:'Thưởng Q3',            amount:3000000,  type:'income',  cat:'Tiền lương',         date:'2026-09-05', note:'' },
  { id:3,  title:'Quán cơm bình dân',    amount:-45000,   type:'expense', cat:'Ăn uống',            date:'2026-09-06', note:'' },
  { id:4,  title:'Cà phê Highlands',     amount:-55000,   type:'expense', cat:'Ăn uống',            date:'2026-09-06', note:'' },
  { id:5,  title:'Bánh mì ốp la',        amount:-20000,   type:'expense', cat:'Ăn uống',            date:'2026-09-07', note:'' },
  { id:6,  title:'Đổ xăng',             amount:-70000,   type:'expense', cat:'Di chuyển',          date:'2026-09-07', note:'' },
  { id:7,  title:'Grab đi làm',         amount:-45000,   type:'expense', cat:'Di chuyển',          date:'2026-09-08', note:'' },
  { id:8,  title:'Shopee - Mua áo',     amount:-350000,  type:'expense', cat:'Mua sắm',            date:'2026-09-08', note:'' },
  { id:9,  title:'FamilyMart',          amount:-85000,   type:'expense', cat:'Cửa hàng tiện lợi', date:'2026-09-09', note:'' },
  { id:10, title:'Ministop snack',      amount:-62000,   type:'expense', cat:'Cửa hàng tiện lợi', date:'2026-09-09', note:'' },
  { id:11, title:'Ăn tối nhà hàng',    amount:-320000,  type:'expense', cat:'Ăn uống',            date:'2026-09-10', note:'' },
  { id:12, title:'Tiền điện T8',        amount:-45000,   type:'expense', cat:'Nhà ở & Hoá đơn',   date:'2026-09-10', note:'' },
  { id:13, title:'Internet+ĐT',         amount:-250000,  type:'expense', cat:'Nhà ở & Hoá đơn',   date:'2026-09-11', note:'' },
  { id:14, title:'Grab Food tối',       amount:-89000,   type:'expense', cat:'Ăn uống',            date:'2026-09-11', note:'' },
  { id:15, title:'Khám sức khoẻ',      amount:-500000,  type:'expense', cat:'Sức khoẻ',           date:'2026-09-11', note:'' },
];

const MOCK_DEBTS = [
  { id:1, person:'Thẻ tín dụng VPBank', type:'owe',  total:15000000, paid:4500000,  due:'2026-09-14', status:'active' },
  { id:2, person:'Minh (bạn thân)',     type:'owe',  total:2000000,  paid:2000000,  due:'2026-09-30', status:'done' },
  { id:3, person:'Hoa (đồng nghiệp)',   type:'lend', total:500000,   paid:0,        due:'2026-09-13', status:'active' },
  { id:4, person:'Tuấn (em họ)',        type:'lend', total:3000000,  paid:1000000,  due:'2026-11-01', status:'active' },
];

// ═══════════════════════════════════════════════════════
//  APPLICATION STATE
// ═══════════════════════════════════════════════════════
let TX = [], DEBTS = [], budget = 10000000, whURL = '';
let dwType = 'expense', dateMode = 'month', cfrom = '', cto = '';
let catFilter = null, dashP = 0, txP = 0, payID = null;

// ═══════════════════════════════════════════════════════
//  THEME ENGINE (LIGHT & DARK MODE)
// ═══════════════════════════════════════════════════════
function initTheme() {
  const saved = localStorage.getItem('fv_theme') || 'light';
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeUI();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('fv_theme', isDark ? 'dark' : 'light');
  updateThemeUI();
  // Re-render charts with updated theme contrast
  renderBar('bar-chart', filteredTX());
  renderPie('pie-svg', 'pie-leg', true);
  if (document.getElementById('view-analytics').classList.contains('on')) {
    renderAnalytics();
  }
}

function updateThemeUI() {
  const isDark = document.documentElement.classList.contains('dark');
  const label = document.getElementById('theme-lbl');
  const icon = document.getElementById('theme-icon');
  if (label) label.textContent = isDark ? 'Chế độ Tối (Dark)' : 'Chế độ Sáng (Light)';
  if (icon) icon.textContent = isDark ? '🌙' : '☀️';
}

// ═══════════════════════════════════════════════════════
//  STORAGE & FIREBASE CLOUD SYNC
// ═══════════════════════════════════════════════════════
firebase.initializeApp({
  apiKey: "AIzaSyBdLbwBnFqg2Jr0XipraisiOqTp7QkF_70",
  authDomain: "finance-app-57771.firebaseapp.com",
  projectId: "finance-app-57771",
  storageBucket: "finance-app-57771.firebasestorage.app",
  messagingSenderId: "134670825398",
  appId: "1:134670825398:web:8d2a430042ec8977117317"
});
const db = firebase.firestore();
const docRef = db.collection('financeData').doc('v4_sync');
let isFirstLoad = true;

function load() {
  docRef.onSnapshot((snap) => {
    if (snap.exists) {
      const data = snap.data();
      TX = data.transactions || [];
      DEBTS = data.debts || [];
      budget = data.budget || 10000000;
      whURL = data.whURL || '';
    } else {
      const localTX = JSON.parse(localStorage.getItem('fv3_tx') || 'null');
      if (localTX) {
        TX = localTX;
        DEBTS = JSON.parse(localStorage.getItem('fv3_debt') || 'null') || [];
        budget = parseFloat(localStorage.getItem('fv3_budget') || '10000000');
        whURL = localStorage.getItem('fv3_wh') || '';
      } else {
        TX = [...MOCK_TX];
        DEBTS = [...MOCK_DEBTS];
        budget = 10000000;
        whURL = '';
      }
      save();
    }

    const syncEl = document.getElementById('sync-status');
    if (syncEl) {
      syncEl.innerHTML = '<span style="color:var(--brand-emerald)">●</span> Live Cloud Sync';
    }

    if (isFirstLoad) {
      isFirstLoad = false;
      buildChips();
      setDF('month');
      renderDebtAll();
      renderTxFull();
      updateWHStatus();
    } else {
      renderDash();
      renderTxFull();
      renderDebtAll();
      renderAnalytics();
      updateWHStatus();
    }

    if (window.initMagneticCards) {
      window.initMagneticCards();
    }
  }, (error) => {
    const syncEl = document.getElementById('sync-status');
    if (syncEl) {
      syncEl.innerHTML = '<span style="color:var(--brand-rose)">●</span> Lỗi mạng / Offline';
    }
    console.error("Lỗi Firebase:", error);
  });
}

function save(k) {
  docRef.set({ transactions: TX, debts: DEBTS, budget: budget, whURL: whURL });
}

// ═══════════════════════════════════════════════════════
//  CURRENCY FORMATTER
// ═══════════════════════════════════════════════════════
const fmt = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

// ═══════════════════════════════════════════════════════
//  DATE RANGE FILTER
// ═══════════════════════════════════════════════════════
const DF_LABELS = { week: 'Tuần này', month: 'Tháng 9/2026', lastmonth: 'Tháng trước', year: 'Năm 2026', custom: 'Tùy chỉnh' };
const DF_H1     = { week: 'Tuần này', month: 'Tháng 9, 2026', lastmonth: 'Tháng 8, 2026', year: 'Năm 2026', custom: 'Tùy chỉnh' };

function getRange() {
  const N = new Date(TODAY);
  let f, t;
  if (dateMode === 'week') {
    const d = N.getDay() || 7;
    f = new Date(N); f.setDate(N.getDate() - d + 1);
    t = new Date(f); t.setDate(f.getDate() + 6);
  } else if (dateMode === 'month') {
    f = new Date(N.getFullYear(), N.getMonth(), 1);
    t = new Date(N.getFullYear(), N.getMonth() + 1, 0);
  } else if (dateMode === 'lastmonth') {
    f = new Date(N.getFullYear(), N.getMonth() - 1, 1);
    t = new Date(N.getFullYear(), N.getMonth(), 0);
  } else if (dateMode === 'year') {
    f = new Date(N.getFullYear(), 0, 1);
    t = new Date(N.getFullYear(), 11, 31);
  } else {
    f = cfrom ? new Date(cfrom) : new Date(2000, 0, 1);
    t = cto ? new Date(cto) : new Date(2099, 11, 31);
  }
  return { f: f.toISOString().split('T')[0], t: t.toISOString().split('T')[0] };
}

function filteredTX() {
  const { f, t } = getRange();
  return TX.filter(x => x.date >= f && x.date <= t);
}

function visibleTX() {
  let l = filteredTX();
  if (catFilter) l = l.filter(x => x.cat === catFilter);
  return l;
}

function setDF(m) {
  dateMode = m;
  document.getElementById('dp-lbl').textContent = DF_LABELS[m];
  document.getElementById('period-lbl').textContent = DF_H1[m];
  document.getElementById('dp-custom').classList.toggle('on', m === 'custom');
  document.querySelectorAll('.dp-opt').forEach(b => b.classList.remove('sel'));
  if (m !== 'custom') {
    closeDP();
    catFilter = null;
    dashP = 0;
    renderDash();
  }
}

function applyCustom() {
  cfrom = document.getElementById('cf').value;
  cto = document.getElementById('ct').value;
  if (!cfrom || !cto) {
    alert('Vui lòng chọn cả 2 mốc ngày.');
    return;
  }
  document.getElementById('period-lbl').textContent = `${cfrom} → ${cto}`;
  closeDP();
  catFilter = null;
  dashP = 0;
  renderDash();
}

function toggleDP() { document.getElementById('dp-menu').classList.toggle('on'); }
function closeDP()  { document.getElementById('dp-menu').classList.remove('on'); }
document.addEventListener('click', e => { if (!e.target.closest('.dp-wrap')) closeDP(); });

// ═══════════════════════════════════════════════════════
//  VIEW ROUTING (DESKTOP & MOBILE TABS)
// ═══════════════════════════════════════════════════════
function sv(name, el) {
  // Sync Desktop Sidebar
  document.querySelectorAll('#sb .ni').forEach(b => b.classList.remove('on'));
  const desktopBtn = document.querySelector(`#sb [data-view="${name}"]`);
  if (desktopBtn) desktopBtn.classList.add('on');
  else if (el && el.classList.contains('ni')) el.classList.add('on');

  // Sync Mobile Bottom Bar
  document.querySelectorAll('.mobile-tab-btn').forEach(b => b.classList.remove('active'));
  const mobileBtn = document.querySelector(`.mobile-tab-btn[data-view="${name}"]`);
  if (mobileBtn) mobileBtn.classList.add('active');

  // Switch View
  document.querySelectorAll('.view').forEach(v => v.classList.remove('on'));
  const viewEl = document.getElementById('view-' + name);
  if (viewEl) viewEl.classList.add('on');

  if (name === 'analytics') renderAnalytics();
  if (name === 'transactions') { txP = 0; renderTxFull(); }
  if (name === 'debts') renderDebtAll();
  if (name === 'settings') renderSettings();

  if (window.initMagneticCards) {
    window.initMagneticCards();
  }
}

// ═══════════════════════════════════════════════════════
//  DRAWER (ADD TRANSACTION)
// ═══════════════════════════════════════════════════════
function openDW() {
  document.getElementById('drawer').classList.add('on');
  document.getElementById('dw-overlay').classList.add('on');
  document.getElementById('dw-date').value = TODAY;
  setTimeout(() => document.getElementById('dw-amt').focus(), 350);
}

function closeDW() {
  document.getElementById('drawer').classList.remove('on');
  document.getElementById('dw-overlay').classList.remove('on');
}

function setDWT(t) {
  dwType = t;
  document.getElementById('tb-exp').classList.toggle('on', t === 'expense');
  document.getElementById('tb-inc').classList.toggle('on', t === 'income');
}

function fmtHint(inp) {
  const v = parseFloat(inp.value);
  document.getElementById('dw-hint').textContent = v > 0 ? fmt(v) : '';
}

function applyQA(qa, btn) {
  setDWT(qa.type);
  document.getElementById('dw-title').value = qa.title;
  document.getElementById('dw-cat').value = qa.cat;
  document.getElementById('dw-amt').focus();
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('sel'));
  if (btn) btn.classList.add('sel');
}

function buildChips() {
  const w = document.getElementById('qa-chips');
  if (!w) return;
  w.innerHTML = '';
  QA.forEach(qa => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.type = 'button';
    b.innerHTML = `${qa.ico} ${qa.lbl}`;
    b.onclick = (e) => applyQA(qa, b);
    w.appendChild(b);
  });
}

function saveDW() {
  const amt   = parseFloat(document.getElementById('dw-amt').value);
  const title = document.getElementById('dw-title').value.trim();
  const cat   = document.getElementById('dw-cat').value;
  const date  = document.getElementById('dw-date').value || TODAY;
  const note  = document.getElementById('dw-note').value.trim();

  if (!title || !amt || amt <= 0) {
    alert('Vui lòng nhập đầy đủ diễn giải và số tiền lớn hơn 0.');
    return;
  }

  const tx = {
    id: Date.now(),
    title,
    amount: dwType === 'expense' ? -Math.abs(amt) : Math.abs(amt),
    type: dwType,
    cat,
    date,
    note
  };

  TX.unshift(tx);
  save('tx');
  dashP = 0;
  txP = 0;
  renderDash();
  renderTxFull();
  postWebhook(tx);

  ['dw-amt', 'dw-title', 'dw-note'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('dw-hint').textContent = '';
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('sel'));
  closeDW();
}

// ═══════════════════════════════════════════════════════
//  WEBHOOK & INTEGRATIONS
// ═══════════════════════════════════════════════════════
function saveWH() {
  whURL = document.getElementById('wh-url').value.trim();
  save('wh');
  updateWHStatus();
}

function updateWHStatus() {
  const dot = document.getElementById('wh-dot');
  if (dot) dot.classList.toggle('ok', !!whURL);
}

async function postWebhook(tx) {
  if (!whURL) return;
  const payload = {
    timestamp: new Date().toISOString(),
    date:      tx.date,
    title:     tx.title,
    category:  tx.cat,
    amount:    tx.amount,
    type:      tx.type,
    note:      tx.note || ''
  };
  const log = document.getElementById('wh-log');
  if (log) log.textContent = 'Đang đồng bộ Webhook…';
  try {
    await fetch(whURL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), mode: 'no-cors' });
    if (log) log.textContent = `✓ Đã gửi lúc ${new Date().toLocaleTimeString('vi-VN')}`;
  } catch(e) {
    if (log) log.textContent = `✗ Lỗi: ${e.message}`;
  }
}

async function testWebhook() {
  const url = document.getElementById('wh-url').value.trim();
  if (!url) { alert('Vui lòng nhập URL Webhook trước.'); return; }
  const testTx = { id: -1, title: '[Test] Ping từ Finance Cyber Dashboard', amount: -10000, type: 'expense', cat: 'Khác', date: TODAY, note: 'webhook test' };
  whURL = url;
  save('wh');
  await postWebhook(testTx);
}

function renderSettings() {
  document.getElementById('wh-url').value = whURL || '';
  document.getElementById('budget-set').value = budget > 0 ? budget : '';
  updateWHStatus();
  const sampleTx = { id: '...', title: 'Ăn trưa - Quán Cơm Quỳnh Anh', amount: -45000, type: 'expense', category: 'Ăn uống', date: TODAY, note: '', timestamp: new Date().toISOString() };
  document.getElementById('payload-preview').textContent = JSON.stringify(sampleTx, null, 2);
}

function saveBudgetFromSettings() {
  const v = parseFloat(document.getElementById('budget-set').value);
  if (!v || v <= 0) { alert('Vui lòng nhập ngân sách hợp lệ.'); return; }
  budget = v;
  save('budget');
  document.getElementById('budget-set-log').textContent = `✓ Đã cập nhật ngân sách: ${fmt(v)}`;
  renderBudget();
}

// ═══════════════════════════════════════════════════════
//  BUDGET MANAGEMENT
// ═══════════════════════════════════════════════════════
function renderBudget() {
  const exp = Math.abs(filteredTX().filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
  const fill = document.getElementById('budget-fill');
  if (!budget) {
    document.getElementById('budget-fig').textContent = 'Chưa thiết lập';
    return;
  }
  const pct = Math.min(Math.round((exp / budget) * 100), 100);
  const rem = Math.max(budget - exp, 0);
  fill.style.width = pct + '%';
  fill.className = 'budget-fill' + (pct >= 90 ? ' d' : pct >= 70 ? ' w' : '');
  document.getElementById('budget-fig').textContent = `${fmt(exp)} / ${fmt(budget)}`;
  const lbl = pct >= 90 ? `⛔ ${pct}% — Đã chạm ngưỡng tối đa!` : pct >= 70 ? `⚠️ ${pct}% — Cảnh báo sắp vượt ngân sách` : `${pct}% đã chi tiêu`;
  document.getElementById('budget-pct').textContent = lbl;
  document.getElementById('budget-rem').textContent = rem > 0 ? `Còn khả dụng: ${fmt(rem)}` : 'Đã vượt kế hoạch ngân sách!';
}

function openBudgetModal() {
  document.getElementById('budget-inp').value = budget || '';
  document.getElementById('budget-modal').classList.add('on');
  setTimeout(() => document.getElementById('budget-inp').focus(), 100);
}

function closeBudgetModal() {
  document.getElementById('budget-modal').classList.remove('on');
}

function saveBudgetModal() {
  const v = parseFloat(document.getElementById('budget-inp').value);
  if (!v || v <= 0) { alert('Vui lòng nhập số tiền hợp lệ.'); return; }
  budget = v;
  save('budget');
  closeBudgetModal();
  renderBudget();
}

// ═══════════════════════════════════════════════════════
//  DEBT ALERTS & STATUS
// ═══════════════════════════════════════════════════════
function addDays(s, n) {
  const d = new Date(s);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function renderDebtAlert() {
  const soon    = DEBTS.filter(d => d.status === 'active' && d.due && d.due >= TODAY && d.due <= addDays(TODAY, 7));
  const overdue = DEBTS.filter(d => d.status === 'active' && d.due && d.due < TODAY);
  const banner  = document.getElementById('debt-banner');
  const textEl  = document.getElementById('debt-banner-text');
  const badgeEl = document.getElementById('debt-banner-badge');
  const total   = soon.length + overdue.length;

  if (total > 0) {
    let msg = '';
    if (overdue.length) msg += `${overdue.length} khoản đã quá hạn. `;
    if (soon.length)    msg += `${soon.length} khoản đến hạn trong 7 ngày tới.`;
    textEl.textContent = `Có ${total} khoản công nợ cần chú ý: ${msg.trim()}`;
    badgeEl.textContent = total;
    banner.classList.remove('hidden');
    banner.className = 'banner ' + (overdue.length ? 'red' : 'amber');
    badgeEl.className = 'banner-badge ' + (overdue.length ? 'red' : '');
  } else {
    banner.classList.add('hidden');
  }

  const badge = document.getElementById('debt-badge');
  const active = DEBTS.filter(d => d.status === 'active').length;
  if (badge) {
    badge.textContent = active;
    badge.style.display = active > 0 ? '' : 'none';
  }
}

// ═══════════════════════════════════════════════════════
//  DASHBOARD RENDERING
// ═══════════════════════════════════════════════════════
function renderDash() {
  const list = filteredTX();
  const inc = list.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const exp = list.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  document.getElementById('c-bal').textContent = fmt(inc + exp);
  document.getElementById('c-inc').textContent = fmt(inc);
  document.getElementById('c-exp').textContent = fmt(Math.abs(exp));
  renderBudget();
  renderDebtAlert();
  renderBar('bar-chart', list);
  renderPie('pie-svg', 'pie-leg', true);
  renderDashTable();
  if (window.initMagneticCards) {
    window.initMagneticCards();
  }
}

function renderDashTable() {
  const list = visibleTX();
  const total = Math.ceil(list.length / PAGE);
  dashP = Math.max(0, Math.min(dashP, Math.max(total - 1, 0)));
  const page = list.slice(dashP * PAGE, (dashP + 1) * PAGE);
  const tbody = document.getElementById('dash-tbody');
  tbody.innerHTML = '';

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty"><div class="empty-ico">📭</div><div class="empty-t">Chưa có giao dịch nào</div><div class="empty-s">trong khoảng thời gian đã chọn${catFilter ? ` · Lọc danh mục: "${catFilter}"` : ''}.</div></div></td></tr>`;
  } else {
    page.forEach(t => {
      const cls = t.amount > 0 ? 'td-pos' : 'td-neg';
      const sign = t.amount > 0 ? '+' : '';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="td-b">${t.title}${t.note ? `<span style="font-size:10.5px;color:var(--text-muted);margin-left:6px">${t.note}</span>` : ''}</td>
        <td><span class="badge bg-gray">${t.cat}</span></td>
        <td class="td-m">${t.date}</td>
        <td class="${cls}">${sign}${fmt(t.amount)}</td>
        <td style="text-align:right"><button class="btn-ghost danger" onclick="delTx(${t.id})" title="Xoá">✕</button></td>`;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('dash-pg-info').textContent = total > 0 ? `Trang ${dashP + 1}/${total} · ${list.length} giao dịch` : '';
  document.getElementById('dash-prev').disabled = dashP === 0;
  document.getElementById('dash-next').disabled = dashP >= total - 1;

  const tag = document.getElementById('cat-tag');
  document.getElementById('cat-tag-lbl').textContent = catFilter || '';
  tag.style.display = catFilter ? 'inline-flex' : 'none';
}

function dashPg(dir) { dashP += dir; renderDashTable(); }

function delTx(id) {
  if (!confirm('Bạn có chắc chắn muốn xoá giao dịch này?')) return;
  TX = TX.filter(t => t.id !== id);
  save('tx');
  dashP = 0;
  txP = 0;
  renderDash();
  renderTxFull();
}

// ═══════════════════════════════════════════════════════
//  TRANSACTIONS VIEW
// ═══════════════════════════════════════════════════════
function renderTxFull() {
  const list = TX;
  const total = Math.ceil(list.length / PAGE);
  txP = Math.max(0, Math.min(txP, Math.max(total - 1, 0)));
  const page = list.slice(txP * PAGE, (txP + 1) * PAGE);
  const tbody = document.getElementById('tx-tbody');
  tbody.innerHTML = '';

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty"><div class="empty-ico">📭</div><div class="empty-t">Chưa có giao dịch</div></div></td></tr>`;
  } else {
    page.forEach(t => {
      const cls = t.amount > 0 ? 'td-pos' : 'td-neg';
      const sign = t.amount > 0 ? '+' : '';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="td-b">${t.title}</td><td><span class="badge bg-gray">${t.cat}</span></td><td class="td-m">${t.date}</td><td class="${cls}">${sign}${fmt(t.amount)}</td><td style="text-align:right"><button class="btn-ghost danger" onclick="delTx(${t.id})">✕</button></td>`;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('tx-pg-info').textContent = total > 0 ? `${list.length} giao dịch · Trang ${txP + 1}/${total}` : '';
  document.getElementById('tx-prev').disabled = txP === 0;
  document.getElementById('tx-next').disabled = txP >= total - 1;
}

function txPg(dir) { txP += dir; renderTxFull(); }

// ═══════════════════════════════════════════════════════
//  CATEGORY FILTER
// ═══════════════════════════════════════════════════════
function setCatFilter(cat) {
  catFilter = catFilter === cat ? null : cat;
  dashP = 0;
  renderDashTable();
  renderPie('pie-svg', 'pie-leg', true);
}

function clearCatFilter() {
  catFilter = null;
  dashP = 0;
  renderDashTable();
  renderPie('pie-svg', 'pie-leg', true);
}

// ═══════════════════════════════════════════════════════
//  CYBER CHARTS
// ═══════════════════════════════════════════════════════
function renderBar(id, list) {
  const byDate = {};
  list.forEach(t => {
    if (!byDate[t.date]) byDate[t.date] = { inc: 0, exp: 0 };
    if (t.amount > 0) byDate[t.date].inc += t.amount;
    else byDate[t.date].exp += Math.abs(t.amount);
  });
  const days = Object.keys(byDate).sort().slice(-10).map(d => ({ d, ...byDate[d] }));
  const maxV = Math.max(...days.flatMap(d => [d.inc, d.exp]), 1);
  const H = 140;
  const el = document.getElementById(id);
  el.innerHTML = '';

  if (!days.length) {
    el.innerHTML = `<div class="empty" style="width:100%;height:${H}px"><div class="empty-ico">📊</div><div class="empty-s">Chưa có dữ liệu giao dịch</div></div>`;
    return;
  }

  days.forEach(day => {
    const hI = Math.round((day.inc / maxV) * H);
    const hE = Math.round((day.exp / maxV) * H);
    const lbl = day.d.split('-').slice(1).join('/');
    const g = document.createElement('div');
    g.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;';
    g.innerHTML = `<div style="display:flex;align-items:flex-end;gap:3px;height:${H}px;width:100%">
      <div title="Thu: ${fmt(day.inc)}" style="flex:1;background:linear-gradient(180deg,#002e6d 0%,#2563eb 100%);border-radius:4px 4px 0 0;height:${Math.max(hI, hI > 0 ? 4 : 0)}px;transition:height .4s var(--mag-ease);box-shadow:0 -2px 6px rgba(37,99,235,0.25)"></div>
      <div title="Chi: ${fmt(day.exp)}" style="flex:1;background:linear-gradient(180deg,#f43f5e 0%,#fda4af 100%);border-radius:4px 4px 0 0;height:${Math.max(hE, hE > 0 ? 4 : 0)}px;transition:height .4s var(--mag-ease);box-shadow:0 -2px 6px rgba(244,63,94,0.25)"></div>
    </div><div style="font-size:10px;color:var(--text-muted);margin-top:6px;font-weight:500">${lbl}</div>`;
    el.appendChild(g);
  });
}

function renderPie(svgId, legId, interactive) {
  const list = filteredTX();
  const grouped = {};
  list.filter(t => t.amount < 0).forEach(t => {
    grouped[t.cat] = (grouped[t.cat] || 0) + Math.abs(t.amount);
  });
  const data = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  const total = data.reduce((s, [, v]) => s + v, 0);
  const svg = document.getElementById(svgId);
  const leg = document.getElementById(legId);
  svg.innerHTML = '';
  leg.innerHTML = '';

  if (!data.length) {
    svg.innerHTML = '<text x="55" y="60" text-anchor="middle" fill="#94a3b8" font-size="11">Chưa có chi tiêu</text>';
    return;
  }

  const cx = 55, cy = 55, R = 44, r = 26;
  let angle = -Math.PI / 2;

  data.forEach(([cat, val], i) => {
    const slice = (val / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(angle + slice), y2 = cy + R * Math.sin(angle + slice);
    const ix1 = cx + r * Math.cos(angle), iy1 = cy + r * Math.sin(angle);
    const ix2 = cx + r * Math.cos(angle + slice), iy2 = cy + r * Math.sin(angle + slice);
    const lg = slice > Math.PI ? 1 : 0;
    const color = CYBER_PALETTE[i % CYBER_PALETTE.length];
    const isDim = catFilter && catFilter !== cat;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${ix1} ${iy1} L ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${lg} 0 ${ix1} ${iy1} Z`);
    path.setAttribute('fill', color);
    path.setAttribute('stroke', document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff');
    path.setAttribute('stroke-width', '2');
    path.style.opacity = isDim ? '0.2' : '1';
    path.style.transition = 'opacity .2s, transform .2s var(--mag-ease)';
    path.style.transformOrigin = `${cx}px ${cy}px`;

    if (interactive) {
      path.style.cursor = 'pointer';
      path.onclick = () => setCatFilter(cat);
    }
    path.onmouseenter = () => { if (!isDim) path.style.transform = 'scale(1.06)'; };
    path.onmouseleave = () => { path.style.transform = ''; };
    svg.appendChild(path);
    angle += slice;

    const pct = ((val / total) * 100).toFixed(0);
    const li = document.createElement('div');
    li.className = 'pie-li' + (isDim ? ' dim' : '');
    li.innerHTML = `<div class="pie-li-l"><div class="pie-dot" style="background:${color}"></div><span>${cat}</span></div><span style="font-weight:700">${pct}%</span>`;
    if (interactive) li.onclick = () => setCatFilter(cat);
    leg.appendChild(li);
  });
}

// ═══════════════════════════════════════════════════════
//  DEBTS MANAGEMENT
// ═══════════════════════════════════════════════════════
function renderDebtAll() {
  renderDebtCards();
  renderDebtTable();
  renderDebtAlert();
  if (window.initMagneticCards) {
    window.initMagneticCards();
  }
}

function renderDebtCards() {
  const pay = DEBTS.filter(d => d.type === 'owe' && d.status === 'active').reduce((s, d) => s + (d.total - d.paid), 0);
  const rec = DEBTS.filter(d => d.type === 'lend' && d.status === 'active').reduce((s, d) => s + (d.total - d.paid), 0);
  document.getElementById('d-payable').textContent = fmt(pay);
  document.getElementById('d-recv').textContent = fmt(rec);
  document.getElementById('d-pay-cnt').textContent = `${DEBTS.filter(d => d.type === 'owe' && d.status === 'active').length} khoản đang nợ`;
  document.getElementById('d-recv-cnt').textContent = `${DEBTS.filter(d => d.type === 'lend' && d.status === 'active').length} khoản chưa thu hồi`;
}

function renderDebtTable() {
  const f = document.getElementById('d-filter').value;
  let list = [...DEBTS];
  if (f === 'owe')    list = list.filter(d => d.type === 'owe');
  if (f === 'lend')   list = list.filter(d => d.type === 'lend');
  if (f === 'active') list = list.filter(d => d.status === 'active');
  if (f === 'done')   list = list.filter(d => d.status === 'done');
  const tbody = document.getElementById('debt-tbody');
  tbody.innerHTML = '';

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty"><div class="empty-ico">🤝</div><div class="empty-t">Không có khoản nợ nào</div></div></td></tr>`;
    return;
  }

  list.forEach(d => {
    const rem = Math.max(0, d.total - d.paid);
    const pct = d.total > 0 ? Math.round((d.paid / d.total) * 100) : 0;
    const done = d.status === 'done';
    const over = !done && d.due && d.due < TODAY;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="td-b">${d.person}</td>
      <td><span class="badge ${d.type === 'owe' ? 'bg-owe' : 'bg-lend'}">${d.type === 'owe' ? 'Tôi mượn' : 'Cho mượn'}</span></td>
      <td class="td-r" style="font-weight:500">${fmt(d.total)}</td>
      <td class="td-r" style="font-weight:700;color:${rem > 0 ? 'var(--brand-rose)' : 'var(--brand-emerald)'}">${fmt(rem)}</td>
      <td><div class="prog-wrap"><div class="prog-track"><div class="prog-fill${done ? ' done' : ''}" style="width:${pct}%"></div></div><div class="prog-label">${pct}% đã thanh toán</div></div></td>
      <td class="td-m" style="${over ? 'color:var(--brand-rose);font-weight:700' : ''}">${d.due || '—'}</td>
      <td><span class="badge ${done ? 'bg-done' : 'bg-active'}">${done ? 'Đã hoàn tất' : over ? '⛔ Quá hạn' : 'Đang theo dõi'}</span></td>
      <td style="display:flex;gap:6px;justify-content:flex-end">
        ${!done ? `<button class="btn btn-out" onclick="openPayModal(${d.id})" style="padding:4px 10px;font-size:11px">💳 Trả</button>` : ''}
        <button class="btn-ghost danger" onclick="delDebt(${d.id})">✕</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function toggleDebtForm() {
  const b = document.getElementById('debt-form-box');
  b.style.display = b.style.display === 'none' ? 'block' : 'none';
}

function saveDebt() {
  const person = document.getElementById('d-person').value.trim();
  const type   = document.getElementById('d-type').value;
  const total  = parseFloat(document.getElementById('d-amount').value);
  const paid   = parseFloat(document.getElementById('d-paid').value) || 0;
  const due    = document.getElementById('d-due').value;

  if (!person || !total || total <= 0) {
    alert('Vui lòng nhập tên đối tượng và số tiền hợp lệ.');
    return;
  }

  const paidC = Math.min(paid, total);
  DEBTS.unshift({ id: Date.now(), person, type, total, paid: paidC, due, status: paidC >= total ? 'done' : 'active' });
  save('debt');
  renderDebtAll();
  ['d-person', 'd-amount', 'd-paid', 'd-due'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('debt-form-box').style.display = 'none';
}

function openPayModal(id) {
  const d = DEBTS.find(x => x.id === id);
  if (!d || d.status === 'done') return;
  payID = id;
  document.getElementById('pay-sub').textContent = `${d.person} — Số nợ còn lại: ${fmt(d.total - d.paid)}`;
  document.getElementById('pay-amt').value = '';
  document.getElementById('pay-modal').classList.add('on');
  setTimeout(() => document.getElementById('pay-amt').focus(), 100);
}

function closePayModal() {
  document.getElementById('pay-modal').classList.remove('on');
  payID = null;
}

function confirmPay() {
  const amt = parseFloat(document.getElementById('pay-amt').value);
  if (!amt || amt <= 0) { alert('Vui lòng nhập số tiền hợp lệ.'); return; }
  const d = DEBTS.find(x => x.id === payID);
  if (!d) return;
  d.paid = Math.min(d.paid + amt, d.total);
  if (d.paid >= d.total) d.status = 'done';
  save('debt');
  renderDebtAll();
  closePayModal();
}

function delDebt(id) {
  if (!confirm('Bạn có muốn xoá khoản nợ này không?')) return;
  DEBTS = DEBTS.filter(d => d.id !== id);
  save('debt');
  renderDebtAll();
}

// ═══════════════════════════════════════════════════════
//  ANALYTICS SUMMARY
// ═══════════════════════════════════════════════════════
function renderAnalytics() {
  const inc = TX.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const exp = TX.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const days = [...new Set(TX.map(t => t.date))].length || 1;
  const rate = inc > 0 ? Math.round(((inc - exp) / inc) * 100) : 0;

  document.getElementById('a-net').textContent = fmt(inc - exp);
  document.getElementById('a-save').textContent = `${rate}%`;
  document.getElementById('a-daily').textContent = fmt(exp / days);
  document.getElementById('a-cnt').textContent = TX.length;
  renderBar('a-bar', TX);
  renderPie('a-pie', 'a-pie-leg', false);
  if (window.initMagneticCards) {
    window.initMagneticCards();
  }
}

// ═══════════════════════════════════════════════════════
//  EXPORT CSV UTILITY
// ═══════════════════════════════════════════════════════
function exportCSV() {
  const h = 'ID,Diễn giải,Số tiền,Loại,Hạng mục,Ngày,Ghi chú\n';
  const r = TX.map(t => `${t.id},"${t.title}",${t.amount},${t.type},"${t.cat}",${t.date},"${t.note || ''}"`).join('\n');
  dl('\uFEFF' + h + r, `finance_tx_${TODAY}.csv`, 'text/csv;charset=utf-8;');
}

function exportDebtCSV() {
  const h = 'ID,Người/Tổ chức,Loại,Tổng nợ,Đã trả,Còn lại,Hạn chót,Trạng thái\n';
  const r = DEBTS.map(d => `${d.id},"${d.person}",${d.type === 'owe' ? 'Tôi mượn' : 'Cho mượn'},${d.total},${d.paid},${d.total - d.paid},${d.due || ''},${d.status}`).join('\n');
  dl('\uFEFF' + h + r, `finance_debts_${TODAY}.csv`, 'text/csv;charset=utf-8;');
}

function dl(content, filename, mime) {
  const b = new Blob([content], { type: mime });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(u);
}

// ═══════════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
    e.preventDefault();
    openDW();
  }
  if (e.key === 'Escape') {
    closeDW();
    closePayModal();
    closeBudgetModal();
  }
  if (e.key === 'Enter' && document.getElementById('pay-modal').classList.contains('on')) {
    confirmPay();
  }
});

document.getElementById('pay-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closePayModal();
});
document.getElementById('budget-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeBudgetModal();
});

// ═══════════════════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════════════════
initTheme();
load();
