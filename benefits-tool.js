// ════════════════════════════════════════
//  THEME
// ════════════════════════════════════════
(function initTheme() {
  if (localStorage.getItem('theme') === 'light') applyTheme('light');
})();

function toggleTheme() {
  const isLight = document.body.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
}

function applyTheme(mode) {
  document.body.classList.toggle('light', mode === 'light');
  localStorage.setItem('theme', mode);
}

// ════════════════════════════════════════
//  TAB SWITCHING
// ════════════════════════════════════════
function switchTab(name, btn) {
  document.querySelectorAll('.tab-panel').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

function switchSubTab(name, btn) {
  document.querySelectorAll('.sub-panel').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sub-tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('sub-' + name).classList.add('active');
  btn.classList.add('active');
}

// ════════════════════════════════════════
//  BENEFIT FORM
// ════════════════════════════════════════
let benefitCount = 0;

function addBenefit(data = {}) {
  benefitCount++;
  const id = benefitCount;
  const el = document.createElement('div');
  el.className = 'benefit-card';
  el.id = 'benefit-' + id;
  el.dataset.id = id;

  el.innerHTML = `
    <div class="benefit-card-header">
      <span class="benefit-card-num">BENEFIT #${id}</span>
      <div class="benefit-actions">
        <button class="btn btn-danger btn-sm" onclick="removeBenefit(${id})">삭제</button>
      </div>
    </div>
    <div class="field-grid">
      <div class="field" style="grid-column:1/-1">
        <label>혜택명 *</label>
        <input type="text" name="benefit_name" placeholder="ex. 알림 신청 시 신제품 추가 할인 쿠폰 1만원 증정" value="${esc(data.benefit_name||'')}">
        <span class="field-hint">혜택 카드 타이틀에 표시되는 이름</span>
      </div>
      <div class="field">
        <label>혜택 시작일시</label>
        <div class="datetime-wrap ${data.benefit_start_datetime ? '' : 'is-null'}">
          <input type="text" name="benefit_start_datetime" value="${esc(data.benefit_start_datetime||'null')}" placeholder="2026-06-11 00:00:00" style="flex:1;" oninput="this.closest('.datetime-wrap').classList.toggle('is-null', !this.value.trim() || this.value==='null')">
          <button type="button" class="picker-btn" onclick="openDatePicker(this,'00','00','00')" title="달력으로 선택">📅</button>
          <button type="button" class="null-btn" onclick="nullDatetime(this)">NULL</button>
        </div>
        <span class="field-hint">별도 기간 없으면 NULL</span>
      </div>
      <div class="field">
        <label>혜택 종료일시</label>
        <div class="datetime-wrap ${data.benefit_end_datetime ? '' : 'is-null'}">
          <input type="text" name="benefit_end_datetime" value="${esc(data.benefit_end_datetime||'null')}" placeholder="2026-06-30 23:59:59" style="flex:1;" oninput="this.closest('.datetime-wrap').classList.toggle('is-null', !this.value.trim() || this.value==='null')">
          <button type="button" class="picker-btn" onclick="openDatePicker(this,'23','59','59')" title="달력으로 선택">📅</button>
          <button type="button" class="null-btn" onclick="nullDatetime(this)">NULL</button>
        </div>
        <span class="field-hint">별도 기간 없으면 NULL</span>
      </div>
      <div class="field" style="grid-column:1/-1">
        <label>혜택 디스크립션 *</label>
        <textarea name="benefit_description" rows="2" placeholder="ex. 알림 신청 시 신제품 추가 할인 쿠폰 1만원 증정">${esc(data.benefit_description||'')}</textarea>
        <span class="field-hint">혜택 카드 본문 내용. 쌍따옴표(") 사용 시 홀따옴표(')로 변경</span>
      </div>
      <div class="field" style="grid-column:1/-1">
        <label>혜택 유의사항</label>
        <textarea name="benefit_cautions" rows="2" placeholder="ex. 기준가 대비 쿠폰 적용가, 대상 모델 : 2026 Bespoke AI 스팀">${esc(data.benefit_cautions||'')}</textarea>
        <span class="field-hint">쉼표(,)로 항목 구분. 쌍따옴표(") 사용 시 홀따옴표(')로 변경</span>
      </div>
      <div class="field">
        <label>종료 여부 (선착순 등)</label>
        <select name="benefit_early_termination_yn">
          <option value="N" ${(data.benefit_early_termination_yn||'N')==='N'?'selected':''}>N — 해당없음</option>
          <option value="Y" ${(data.benefit_early_termination_yn||'')==='Y'?'selected':''}>Y — 선착순 종료 가능</option>
        </select>
        <span class="field-hint">선착순 종료 딱지 붙는 경우 Y</span>
      </div>
      <div class="field">
        <label>공통혜택 여부</label>
        <select name="all_yn">
          <option value="N" ${(data.all_yn||'N')==='N'?'selected':''}>N — 일부 제품만</option>
          <option value="Y" ${(data.all_yn||'')==='Y'?'selected':''}>Y — 모든 제품 공통</option>
        </select>
        <span class="field-hint">모든 제품에 적용되는 공통 혜택이면 Y</span>
      </div>
      <div class="field" style="grid-column:1/-1">
        <label>썸네일 URL</label>
        <input type="text" name="benefit_image_url" placeholder="ex. //images.samsung.com/kdp/event/..." value="${esc(data.benefit_image_url||'')}">
        <span class="field-hint">없으면 빈칸. // 또는 https:// 로 시작</span>
      </div>
    </div>
  `;
  document.getElementById('benefits-list').appendChild(el);
  updateBenefitCount();
}

function removeBenefit(id) {
  const el = document.getElementById('benefit-' + id);
  if (el) el.remove();
  updateBenefitCount();
}

function updateBenefitCount() {
  const count = document.querySelectorAll('.benefit-card').length;
  document.getElementById('benefit-count').textContent = count + '개';
}

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── 커스텀 달력 모달 ──
let _dp = null;
let _dpWrap = null;
let _dpSec = '00';
let _dpYear, _dpMonth;
let _dpSel = null; // { year, month, day }

function openDatePicker(btn, defHour, defMin, defSec) {
  _dpWrap = btn.closest('.datetime-wrap');
  _dpSec = defSec || '00';

  const val = _dpWrap.querySelector('input[type="text"]').value;
  const now = new Date();
  _dpYear = now.getFullYear();
  _dpMonth = now.getMonth();
  _dpSel = null;

  let h = defHour, m = defMin;
  if (val && val !== 'null' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
    const p = val.split(/[-\s:]/);
    _dpYear = +p[0]; _dpMonth = +p[1] - 1;
    _dpSel = { year: +p[0], month: +p[1] - 1, day: +p[2] };
    if (p[3] !== undefined) h = p[3];
    if (p[4] !== undefined) m = p[4];
  }

  if (!_dp) _dpCreate();
  document.getElementById('dp-hour').value = h;
  document.getElementById('dp-minute').value = m;
  _dpRender();
  _dp.classList.add('open');
}

function _dpCreate() {
  _dp = document.createElement('div');
  _dp.className = 'modal-overlay dp-overlay';
  _dp.onclick = e => { if (e.target === _dp) _dpClose(); };
  _dp.innerHTML = `
    <div class="dp-box">
      <div class="dp-header">
        <button type="button" class="dp-nav" onclick="dpNav(-1)">&#8249;</button>
        <span id="dp-label"></span>
        <button type="button" class="dp-nav" onclick="dpNav(1)">&#8250;</button>
      </div>
      <div class="dp-weekdays"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div>
      <div class="dp-days" id="dp-days"></div>
      <div class="dp-time">
        <input type="number" id="dp-hour" min="0" max="23" placeholder="HH">
        <span>:</span>
        <input type="number" id="dp-minute" min="0" max="59" placeholder="MM">
      </div>
      <div class="dp-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="_dpClose()">취소</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="_dpConfirm()">확인</button>
      </div>
    </div>`;
  document.body.appendChild(_dp);
}

function _dpRender() {
  document.getElementById('dp-label').textContent = `${_dpYear}년 ${_dpMonth + 1}월`;
  const first = new Date(_dpYear, _dpMonth, 1).getDay();
  const total = new Date(_dpYear, _dpMonth + 1, 0).getDate();
  let html = '<span class="dp-day dp-empty"></span>'.repeat(first);
  for (let d = 1; d <= total; d++) {
    const sel = _dpSel && _dpSel.year === _dpYear && _dpSel.month === _dpMonth && _dpSel.day === d;
    html += `<span class="dp-day${sel ? ' dp-sel' : ''}" onclick="dpPick(${d})">${d}</span>`;
  }
  document.getElementById('dp-days').innerHTML = html;
}

function dpNav(dir) {
  _dpMonth += dir;
  if (_dpMonth < 0) { _dpMonth = 11; _dpYear--; }
  if (_dpMonth > 11) { _dpMonth = 0; _dpYear++; }
  _dpRender();
}

function dpPick(d) {
  _dpSel = { year: _dpYear, month: _dpMonth, day: d };
  _dpRender();
}

function _dpConfirm() {
  if (!_dpSel) { showToast('⚠️ 날짜를 선택해주세요', 'warn'); return; }
  const h = String(document.getElementById('dp-hour').value || '0').padStart(2, '0');
  const m = String(document.getElementById('dp-minute').value || '0').padStart(2, '0');
  const { year, month, day } = _dpSel;
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  _dpWrap.querySelector('input[type="text"]').value = `${dateStr} ${h}:${m}:${_dpSec}`;
  _dpWrap.classList.remove('is-null');
  _dpClose();
}

function _dpClose() {
  if (_dp) _dp.classList.remove('open');
  _dpWrap = null;
}

function nullDatetime(btn) {
  const wrap = btn.closest('.datetime-wrap');
  wrap.querySelector('input[type="text"]').value = 'null';
  wrap.classList.add('is-null');
}

function toDatetimeLocal(str) {
  if (!str) return '';
  // "2026-06-11 10:00:00" → "2026-06-11T10:00"
  return str.replace(' ', 'T').slice(0, 16);
}

function fromDatetimeLocal(str) {
  if (!str) return null;
  // "2026-06-11T10:00" → "2026-06-11 10:00:00"
  return str.replace('T', ' ') + ':00';
}

function collectData() {
  const get = id => document.getElementById(id)?.value?.trim() || '';
  const event_data = {
    event_name: get('event_name'),
    event_url: get('event_url'),
    event_description: get('event_description'),
    event_caution: get('event_caution'),
    benefits: []
  };

  document.querySelectorAll('.benefit-card').forEach(card => {
    const g = n => card.querySelector(`[name="${n}"]`)?.value?.trim() || '';
    event_data.benefits.push({
      benefit_name: g('benefit_name'),
      benefit_start_datetime: g('benefit_start_datetime') && g('benefit_start_datetime') !== 'null' ? g('benefit_start_datetime') : null,
      benefit_end_datetime: g('benefit_end_datetime') && g('benefit_end_datetime') !== 'null' ? g('benefit_end_datetime') : null,
      benefit_description: g('benefit_description'),
      benefit_cautions: g('benefit_cautions'),
      benefit_early_termination_yn: g('benefit_early_termination_yn'),
      all_yn: g('all_yn'),
      benefit_image_url: g('benefit_image_url')
    });
  });
  return event_data;
}

function generateJSON() {
  const data = collectData();
  const json = formatJSON(data);
  document.getElementById('json-output').textContent = json;
  document.getElementById('json-preview-wrap').style.display = 'block';
  document.getElementById('json-output').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast('✅ JSON 생성 완료');
}

function formatJSON(data) {
  return JSON.stringify(data, null, 2);
}

function copyJSON() {
  const text = document.getElementById('json-output').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('📋 JSON 복사 완료'));
}

// ── SheetJS 공통 로더 ──
function loadXLSX(callback) {
  if (typeof XLSX !== 'undefined') { callback(); return; }
  showToast('⏳ 엑셀 라이브러리 로드 중...', 'info');
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  s.onload = callback;
  s.onerror = () => showToast('⚠️ 엑셀 라이브러리 로드 실패 — 네트워크 연결을 확인해주세요', 'warn');
  document.head.appendChild(s);
}

// ── Excel import ──
function importExcel(input) {
  const file = input.files[0];
  if (!file) return;
  const nameWithoutExt = file.name.replace(/\.[^.]+$/, '');
  document.getElementById('excel-filename').value = nameWithoutExt;
  input.value = '';

  loadXLSX(() => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const sheetRows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const allText = sheetRows.map(r =>
          (r || []).map(c => c != null ? String(c).trim() : '').join('\t')
        ).join('\n');
        const scriptMatch = allText.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        const jsonStr = scriptMatch ? scriptMatch[1] : allText;
        const { cleaned, issues } = cleanAndValidate(jsonStr);
        const errors = issues.filter(i => i.type === 'error');
        if (errors.length > 0) {
          showToast('⚠️ ' + errors[0].msg + ': ' + errors[0].detail, 'warn');
          return;
        }
        fillForm(JSON.parse(cleaned));
        showToast('✅ 엑셀 불러오기 완료');
      } catch(err) {
        showToast('⚠️ 파일을 읽을 수 없습니다', 'warn');
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function fillForm(data) {
  document.getElementById('event_name').value = data.event_name || '';
  document.getElementById('event_url').value = data.event_url || '';
  document.getElementById('event_description').value = data.event_description || '';
  document.getElementById('event_caution').value = data.event_caution || '';
  document.getElementById('benefits-list').innerHTML = '';
  benefitCount = 0;
  if (Array.isArray(data.benefits)) data.benefits.forEach(b => addBenefit(b));
  updateBenefitCount();
  document.getElementById('json-preview-wrap').style.display = 'none';
}

// ── Excel export ──
function exportExcel() {
  const data = collectData();
  if (!data.event_name) { showToast('⚠️ 기획전 명을 입력해주세요', 'warn'); return; }

  const defaultName = `benefits_${data.event_name.replace(/[\/\\?%*:|"<>]/g, '_')}`;
  const inputEl = document.getElementById('excel-filename');
  const fileName = (inputEl?.value.trim() || defaultName);

  const rows = buildJSONRows(data);
  loadXLSX(() => doExport(rows, fileName));
}

function buildJSONRows(data) {
  const rows = [];
  const qv = v => v === null ? 'null' : JSON.stringify(String(v));

  rows.push(['<script type="application/json" id="benefits-data">', '']);
  rows.push(['{', '']);
  rows.push([`"event_name" : ${qv(data.event_name)},`, '기획전 명']);
  rows.push([`"event_url" : ${qv(data.event_url)},`, '기획전 URL']);
  rows.push([`"event_description" : ${qv(data.event_description)},`, '기획전 상세설명']);
  rows.push([`"event_caution" : ${qv(data.event_caution)},`, '기획전 유의사항']);
  rows.push(['"benefits" : [', '']);

  data.benefits.forEach((b, i) => {
    const isLast = i === data.benefits.length - 1;
    rows.push(['{', '']);
    rows.push([`"benefit_name" : ${qv(b.benefit_name)},`, '혜택명']);
    rows.push([`"benefit_start_datetime" : ${qv(b.benefit_start_datetime)},`, '혜택 시작일시 (없으면 null)']);
    rows.push([`"benefit_end_datetime" : ${qv(b.benefit_end_datetime)},`, '혜택 종료일시 (없으면 null)']);
    rows.push([`"benefit_description" : ${qv(b.benefit_description)},`, '혜택 디스크립션']);
    rows.push([`"benefit_cautions" : ${qv(b.benefit_cautions)},`, '혜택 유의사항 (쉼표 구분)']);
    rows.push([`"benefit_early_termination_yn" : ${qv(b.benefit_early_termination_yn)},`, '종료 여부 Y/N']);
    rows.push([`"all_yn" : ${qv(b.all_yn)},`, '공통혜택 여부 Y/N']);
    rows.push([`"benefit_image_url" : ${qv(b.benefit_image_url)}`, '썸네일 URL']);
    rows.push([isLast ? '}' : '},', '']);
  });

  rows.push([']}', '']);
  rows.push(['</script>', '']);

  return rows;
}

function doExport(rows, fileName) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{wch: 120}, {wch: 25}];
  XLSX.utils.book_append_sheet(wb, ws, '혜택데이터');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
  showToast('✅ 엑셀 내보내기 완료');
}

function loadSample() {
  document.getElementById('event_name').value = '전시컨텐츠[BESPOKE 청소기 | vacuum-cleaner]';
  document.getElementById('event_url').value = 'https://www.samsung.com/sec/event/vacuum-cleaner/';
  document.getElementById('event_description').value = 'Bespoke AI 스팀 신제품과 12개월 구독료 포인트 혜택 놓치지 마세요';
  document.getElementById('event_caution').value = '모든 혜택은 본 프로모션 페이지에 노출된 행사모델에 한하여 적용됩니다. 본 행사는 삼성닷컴 온라인 단독 행사이며, 삼성전자 오프라인 매장과는 무관합니다. 본 이벤트는 삼성닷컴 회원만 참여 가능하며, 만 14세 미만은 이벤트 참여가 불가능합니다.';
  document.getElementById('benefits-list').innerHTML = '';
  benefitCount = 0;
  const samples = [
    { benefit_name:'알림 신청 시 신제품 추가 할인 쿠폰 1만원 증정', benefit_start_datetime:'2026-06-11 10:00:00', benefit_end_datetime:'2026-06-30 23:59:59', benefit_description:'알림 신청 시 신제품 추가 할인 쿠폰 1만원 증정', benefit_cautions:"기준가 대비 쿠폰 적용가, 대상 모델 : 2026 Bespoke AI 스팀", benefit_early_termination_yn:'N', all_yn:'N', benefit_image_url:'//images.samsung.com/kdp/event/sec/2026/new_release_0101_bespoke_jet/benefit/2605/bj_bnf_ico_document_260501_pc.png' },
    { benefit_name:'카드사 결제일 할인 7% 혜택', benefit_start_datetime:'2026-06-01 00:00:00', benefit_end_datetime:'2026-06-30 23:59:59', benefit_description:'카드사 결제일 할인 7% 혜택', benefit_cautions:'삼성/KB국민/롯데카드, 50만원 이상 결제 시 적용', benefit_early_termination_yn:'N', all_yn:'Y', benefit_image_url:'//images.samsung.com/kdp/event/sec/2026/new_release_0101_bespoke_jet/benefit/2601/bj_bnf_ico_membership_pc.png' }
  ];
  samples.forEach(s => addBenefit(s));
  showToast('✅ 샘플 데이터 로드 완료');
}

function clearAll() {
  if (!confirm('모든 입력 데이터를 초기화할까요?')) return;
  ['event_name','event_url','event_description','event_caution'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('benefits-list').innerHTML = '';
  benefitCount = 0;
  updateBenefitCount();
  document.getElementById('json-preview-wrap').style.display = 'none';
}

// ════════════════════════════════════════
//  PASTE MODAL
// ════════════════════════════════════════
function openPasteModal() {
  document.getElementById('paste-modal').classList.add('open');
  document.getElementById('paste-input').focus();
}

function closePasteModal(e) {
  if (e && e.target !== document.getElementById('paste-modal')) return;
  document.getElementById('paste-modal').classList.remove('open');
  document.getElementById('paste-input').value = '';
  document.getElementById('paste-char-count').textContent = '0자';
}

function onPasteInput() {
  const v = document.getElementById('paste-input').value;
  document.getElementById('paste-char-count').textContent = v.length.toLocaleString() + '자';
}

function applyPastedExcel() {
  const raw = document.getElementById('paste-input').value.trim();
  if (!raw) { showToast('⚠️ 내용을 먼저 붙여넣어 주세요', 'warn'); return; }

  const { cleaned, issues } = cleanAndValidate(raw);
  const errors = issues.filter(i => i.type === 'error');
  if (errors.length > 0) {
    showToast('⚠️ ' + errors[0].msg + (errors[0].detail ? ': ' + errors[0].detail : ''), 'warn');
    return;
  }

  try {
    fillForm(JSON.parse(cleaned));
    document.getElementById('paste-modal').classList.remove('open');
    document.getElementById('paste-input').value = '';
    document.getElementById('paste-char-count').textContent = '0자';
    showToast('✅ 엑셀 데이터 입력 완료');
  } catch(err) {
    showToast('⚠️ 데이터를 파싱할 수 없습니다', 'warn');
  }
}

// ════════════════════════════════════════
//  VALIDATOR TAB
// ════════════════════════════════════════
let _cleanedJSON = '';

function onRawInput() {
  const v = document.getElementById('raw-input').value;
  document.getElementById('char-count').textContent = v.length.toLocaleString() + '자';
}

function runValidation() {
  const raw = document.getElementById('raw-input').value;
  if (!raw.trim()) { showToast('⚠️ 내용을 먼저 붙여넣어 주세요', 'warn'); return; }

  const { cleaned, issues } = cleanAndValidate(raw);
  _cleanedJSON = cleaned;

  renderValidationResult(issues, cleaned);
  renderCleanJSON(cleaned);

  // switch to result tab
  switchSubTabByName('result');
  showToast(issues.filter(i=>i.type==='error').length === 0 ? '✅ 검증 완료' : '⚠️ 오류 발견', issues.some(i=>i.type==='error')?'warn':'ok');
}

function switchSubTabByName(name) {
  document.querySelectorAll('.sub-panel').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sub-tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('sub-' + name).classList.add('active');
  document.querySelectorAll('.sub-tab-btn').forEach(btn => {
    if (btn.getAttribute('onclick').includes("'" + name + "'")) btn.classList.add('active');
  });
}

function cleanAndValidate(raw) {
  const issues = [];

  let cleaned = raw;

  // ── Step 1: 줄바꿈 정규화 + 각 줄 끝 공백 제거 ──
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  cleaned = cleaned.split('\n').map(l => l.trimEnd()).join('\n');

  // ── Step 1.5: 엑셀/유니코드 특수 공백 → 일반 공백 정규화 ──
  // 엑셀 붙여넣기 시 U+00A0(non-breaking), U+FEFF(BOM), U+200B(zero-width) 등이 섞여 들어옴
  cleaned = cleaned.replace(/[ ­​‌‍‎‏﻿ -   　]/g, ' ');

  // ── Step 2: 탭 컬럼 제거 + Excel TSV 이중따옴표 해제 ──
  // Excel 복사 시 " 포함 셀은 자동 래핑됨: "value" → """value"" (내부 " 이스케이프)
  function _tsv(s) {
    const t = s.trim();
    if (t.length >= 2 && t[0] === '"' && t[t.length - 1] === '"' && t.includes('""')) {
      const u = t.slice(1, -1).replace(/""/g, '"');
      // 의미있는 JSON 토큰이거나 script 태그인 경우만 언래핑 적용
      if (/^[{}\[\]<]/.test(u) || /^"[^"]+"\s*:/.test(u)) return u;
    }
    return t;
  }
  cleaned = cleaned.split('\n').map(line => {
    const parts = line.split('\t');
    if (parts.length <= 1) return _tsv(line);

    // 구조 토큰({ } [ ] <) 또는 완전한 key:value 셀 우선 반환
    for (const part of parts) {
      const s = _tsv(part);
      if (/^[{}\[\]<]/.test(s)) return s;
      // key : "value" 형태이되, 여는 따옴표만 있는 불완전한 셀은 제외
      if (/^"[^"]+"\s*:/.test(s) && !/^"[^"]+"\s*:\s*"$/.test(s)) return s;
    }

    // 분리된 값 형식: "key" : " 셀이 어느 컬럼에 있든 탐색하여 재조합
    // A열=라벨, B열=JSON키, C열=값, D열=닫는따옴표, E·F열=주석 형식도 처리
    let keyIdx = -1;
    for (let i = 0; i < parts.length; i++) {
      if (/^"[^"]+"\s*:\s*"$/.test(parts[i].trim())) { keyIdx = i; break; }
    }
    if (keyIdx >= 0) {
      // 닫는 따옴표: " 또는 ", 형태만 허용 — " 로 시작하는 긴 주석 텍스트는 제외
      let closeIdx = -1;
      for (let i = parts.length - 1; i > keyIdx; i--) {
        if (/^"[,}\]]*$/.test(parts[i].trim())) { closeIdx = i; break; }
      }
      if (closeIdx > keyIdx) {
        const value = parts.slice(keyIdx + 1, closeIdx).join(' ').trim();
        return parts[keyIdx].trim() + value + parts[closeIdx].trim();
      }
    }

    return '';
  }).join('\n');

  // ── Step 2.5: 비-JSON 라인 제거 ──
  // 엑셀 레이블·제목·멀티라인 셀 이탈 내용 등 JSON 구조와 무관한 줄 제거
  cleaned = cleaned.split('\n')
    .filter(l => /^[{}\[\]<"]/.test(l.trim()) || l.trim() === '')
    .join('\n');

  // ── Step 3: script 태그 감지 및 JSON 블록 추출 ──
  const scriptMatch = cleaned.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  if (scriptMatch) {
    cleaned = scriptMatch[1];
    issues.push({ type: 'info', msg: 'script 태그 감지', detail: '내부 JSON만 추출했습니다.' });
  }

  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    const before = cleaned.slice(0, jsonStart).trim();
    if (before.length > 0) {
      issues.push({ type: 'info', msg: '앞쪽 불필요한 텍스트 제거', detail: `${before.length}자 제거됨` });
    }
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
  }

  // ── Step 5: 쉼표 정리 ──
  // trailing comma before } or ]
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

  // ── Step 6: JSON 파싱 검증 ──
  let parsed = null;
  try {
    parsed = JSON.parse(cleaned);
    issues.push({ type: 'ok', msg: 'JSON 파싱 성공', detail: '구문 오류 없음' });
  } catch(e) {
    // 에러 발생 위치 근처 텍스트 추출
    const posMatch = e.message.match(/position (\d+)/);
    let detail = e.message;
    if (posMatch) {
      const pos = parseInt(posMatch[1]);
      const ctx = cleaned.slice(Math.max(0, pos - 30), pos + 30).replace(/\n/g, '↵');
      detail = `${e.message} … 근처: "…${ctx}…"`;
    }
    issues.push({ type: 'error', msg: 'JSON 파싱 실패', detail });
  }

  // ── Step 6-b: 파싱된 객체 string 값 재귀 trim ──
  if (parsed) {
    function trimStrings(v) {
      if (typeof v === 'string') return v.trim();
      if (Array.isArray(v)) return v.map(trimStrings);
      if (v !== null && typeof v === 'object') {
        const r = {};
        for (const k of Object.keys(v)) r[k] = trimStrings(v[k]);
        return r;
      }
      return v;
    }
    parsed = trimStrings(parsed);
  }

  // ── Step 7: 필드 유효성 검사 ──
  if (parsed) {
    const required_top = ['event_name','event_url','benefits'];
    required_top.forEach(key => {
      if (!parsed[key]) issues.push({ type: 'error', msg: `필수 필드 누락: ${key}`, detail: '값이 비어있거나 없음' });
    });

    // URL 형식
    if (parsed.event_url && !parsed.event_url.startsWith('http')) {
      issues.push({ type: 'warn', msg: 'event_url 형식 주의', detail: 'http:// 또는 https:// 로 시작해야 합니다.' });
    }

    // 쌍따옴표 포함 여부 체크
    const jsonStr = JSON.stringify(parsed);
    if (jsonStr.includes('\\"')) {
      issues.push({ type: 'warn', msg: '이스케이프된 쌍따옴표 발견', detail: '값 내에 쌍따옴표가 포함되어 있습니다. 홀따옴표(\')로 변경을 권장합니다.' });
    }

    // benefits 배열 검증
    if (Array.isArray(parsed.benefits)) {
      if (parsed.benefits.length === 0) {
        issues.push({ type: 'warn', msg: 'benefits 배열이 비어있음', detail: '혜택 항목이 없습니다.' });
      }
      parsed.benefits.forEach((b, i) => {
        const bn = i + 1;
        const reqFields = ['benefit_name','benefit_description'];
        reqFields.forEach(f => {
          if (!b[f]) issues.push({ type: 'error', msg: `혜택 #${bn}: ${f} 누락`, detail: '' });
        });
        // Y/N 검증
        ['benefit_early_termination_yn','all_yn'].forEach(f => {
          if (b[f] && !['Y','N'].includes(b[f])) {
            issues.push({ type: 'warn', msg: `혜택 #${bn}: ${f} 값 주의`, detail: `Y 또는 N이어야 합니다. 현재값: "${b[f]}"` });
          }
        });
        // 날짜 형식
        ['benefit_start_datetime','benefit_end_datetime'].forEach(f => {
          if (b[f] && b[f] !== 'Null' && b[f] !== null) {
            if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(b[f])) {
              issues.push({ type: 'warn', msg: `혜택 #${bn}: ${f} 형식 주의`, detail: `"YYYY-MM-DD HH:MM:SS" 형식이어야 합니다. 현재: "${b[f]}"` });
            }
          }
        });
        // 이미지 URL
        if (b.benefit_image_url && !b.benefit_image_url.startsWith('//') && !b.benefit_image_url.startsWith('http')) {
          issues.push({ type: 'warn', msg: `혜택 #${bn}: benefit_image_url 형식 주의`, detail: `// 또는 https:// 로 시작해야 합니다.` });
        }
      });

      issues.push({ type: 'info', msg: `총 ${parsed.benefits.length}개 혜택 확인`, detail: '' });
    }

    // 정제된 JSON 재생성
    cleaned = JSON.stringify(parsed, null, 2);
  }

  return { cleaned, issues };
}

function renderValidationResult(issues, _cleaned) {
  const box = document.getElementById('val-result-box');
  const errors = issues.filter(i => i.type === 'error');
  const warns = issues.filter(i => i.type === 'warn');

  let html = '';
  if (errors.length === 0) {
    html += `<div class="val-status ok">✅ 유효성 검사 통과${warns.length > 0 ? ` (경고 ${warns.length}건)` : ''}</div>`;
  } else {
    html += `<div class="val-status err">❌ 오류 ${errors.length}건 발견</div>`;
  }

  issues.forEach(item => {
    const icon = item.type === 'error' ? '❌' : item.type === 'warn' ? '⚠️' : item.type === 'ok' ? '✅' : 'ℹ️';
    html += `<div class="val-item">
      <span class="val-icon">${icon}</span>
      <div>
        <div class="val-msg">${item.msg}</div>
        ${item.detail ? `<div class="val-detail">${item.detail}</div>` : ''}
      </div>
    </div>`;
  });

  box.innerHTML = html;
}

function renderCleanJSON(cleaned) {
  const box = document.getElementById('clean-result-box');
  box.innerHTML = `<pre class="clean-json">${escHTML(cleaned)}</pre>`;
}

function escHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function copyCleanJSON() {
  if (!_cleanedJSON) { showToast('⚠️ 먼저 검증을 실행해주세요', 'warn'); return; }
  navigator.clipboard.writeText(_cleanedJSON).then(() => showToast('📋 JSON 복사 완료'));
}

function copyScriptTag() {
  if (!_cleanedJSON) { showToast('⚠️ 먼저 검증을 실행해주세요', 'warn'); return; }
  const wrapped = `<script type="application/json" id="benefits-data">\n${_cleanedJSON}\n<\/script>`;
  navigator.clipboard.writeText(wrapped).then(() => showToast('📋 script 태그 포함 복사 완료'));
}

function clearValidator() {
  document.getElementById('raw-input').value = '';
  document.getElementById('char-count').textContent = '0자';
  document.getElementById('val-result-box').innerHTML = '<span style="color:var(--text-muted); font-size:12px;">검증을 먼저 실행해주세요.</span>';
  document.getElementById('clean-result-box').innerHTML = '<span style="color:var(--text-muted); font-size:12px;">검증을 먼저 실행해주세요.</span>';
  _cleanedJSON = '';
}

// ════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════
let _toastTimer;
function showToast(msg, type='ok') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  clearTimeout(_toastTimer);
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.color = type === 'warn' ? 'var(--warning)' : type === 'error' ? 'var(--error)' : 'var(--success)';
  el.textContent = msg;
  document.body.appendChild(el);
  _toastTimer = setTimeout(() => el.remove(), 2800);
}
