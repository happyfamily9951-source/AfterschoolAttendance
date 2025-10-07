// ===== 基础引用 =====
const API = (typeof API_URL !== 'undefined') ? API_URL : '';
const showTip = (msg, type = 'info') => {
  if (typeof showNotification === 'function') return showNotification(msg, type);
  const el = document.getElementById('notify');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type==='error'? 'var(--danger)' : (type==='success'? 'var(--ok)' : '#111');
  setTimeout(()=>{ el.textContent=''; }, 2500);
};
const qs = (s, p=document) => p.querySelector(s);
const qsa = (s, p=document) => Array.from(p.querySelectorAll(s));

// ===== 状态 =====
let selectedStudentId = null;
let selectedCourseId = null;

// ===== 事件绑定 =====
document.addEventListener('DOMContentLoaded', () => {
  // 课程加载
  loadCourses();

  // 学生搜索
  qs('#btnSearch')?.addEventListener('click', onSearchStudent);
  qs('#btnClearStudent')?.addEventListener('click', clearStudentSelection);

  // 提交报名
  qs('#btnSubmit')?.addEventListener('click', onSubmit);
});

// ===== 学生搜索逻辑 =====
async function onSearchStudent(){
  const name = qs('#studentNameInput').value.trim();
  if(!name){ showTip('请输入学生姓名再搜索'); return; }
  try{
    qs('#btnSearch').disabled = true;
    showTip('正在查询学生…');
    const body = new URLSearchParams({ action: 'searchStudentByName', name });
    const res = await fetch(API, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body });
    const data = await res.json();
    if(Array.isArray(data) && data.length){
      renderStudentList(data);
      showTip(`找到 ${data.length} 位学生`, 'success');
    } else {
      renderStudentList([]);
      showTip('未找到匹配的学生', 'error');
    }
  }catch(err){
    console.error(err);
    showTip('查询失败，请稍后重试', 'error');
  }finally{
    qs('#btnSearch').disabled = false;
  }
}

function clearStudentSelection(){
  selectedStudentId = null;
  renderStudentList([]);
  updateSubmitButton();
}

function renderStudentList(list){
  const ul = qs('#studentResult');
  ul.innerHTML = '';
  list.forEach(item => {
    // 期望数据：studentId, studentName, gender
    const li = document.createElement('li');
    li.className = 'list-item';
    li.dataset.sid = item.studentId;

    const ck = document.createElement('input');
    ck.type = 'checkbox'; ck.name = 'studentSingle'; ck.value = item.studentId;
    ck.addEventListener('change', () => onPickSingleStudent(ck, li));

    const id = document.createElement('span'); id.className='badge'; id.textContent = item.studentId || '-';
    const name = document.createElement('div'); name.innerHTML = `<strong>${escapeHtml(item.studentName||'-')}</strong>`;
    const gd = document.createElement('div'); gd.className='muted'; gd.style.textAlign='right';
    gd.innerHTML = genderIcon(item.gender);

    li.appendChild(ck);
    li.appendChild(id);
    li.appendChild(name);
    li.appendChild(gd);
    ul.appendChild(li);
  });
}

function onPickSingleStudent(ck, li){
  // 互斥：只允许选一个学生
  qsa('input[name="studentSingle"]').forEach(n => { if(n !== ck) n.checked = false; });
  qsa('#studentResult .list-item').forEach(el => el.classList.remove('selected'));
  if(ck.checked){ li.classList.add('selected'); selectedStudentId = ck.value; }
  else { selectedStudentId = null; }
  updateSubmitButton();
}

function genderIcon(g){
  const t = (g||'').toString().toUpperCase();
  if(t==='M' || t==='MALE') return '♂️ 男';
  if(t==='F' || t==='FEMALE') return '♀️ 女';
  return '⚪ 其它';
}

function escapeHtml(s=''){
  return s.replace(/[&<>\"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

// ===== 课程加载与渲染（按 dayOfWeek 折叠）=====
async function loadCourses(){
  try{
    showTip('正在载入课程…');
    // const body = new URLSearchParams({ action:'listActiveCourses' });
    const body = new URLSearchParams({action:'getActiveClasses'});
    const res = await fetch(API, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body });
    const list = await res.json(); // 期望字段：classId, className, dayOfWeek, startTime, endTime, location
    renderCourseAccordion(Array.isArray(list) ? list : []);
    showTip('课程已载入', 'success');
  }catch(e){
    console.error(e);
    renderCourseAccordion([]);
    showTip('载入课程失败', 'error');
  }
}

function renderCourseAccordion(list){
  const acc = qs('#courseAccordion');
  acc.innerHTML = '';
  const map = new Map();
  list.forEach(c => {
    const k = (c.dayOfWeek || '未分配');
    if(!map.has(k)) map.set(k, []);
    map.get(k).push(c);
  });

  const order = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','未分配'];
  const days = Array.from(map.keys()).sort((a,b)=> order.indexOf(a) - order.indexOf(b));

  days.forEach(day => {
    const classes = map.get(day) || [];
    const panel = document.createElement('div'); panel.className='panel';
    const header = document.createElement('div'); header.className='panel-header';
    header.innerHTML = `<h3>${day}</h3><span class="count-pill">${classes.length} classes</span>`;
    const content = document.createElement('div'); content.className='panel-content';

    const ul = document.createElement('ul'); ul.className='list';
    classes.forEach(c => {
      const li = document.createElement('li'); li.className='list-item'; li.dataset.cid = c.classId;
      const ck = document.createElement('input'); ck.type='checkbox'; ck.name='courseSingle'; ck.value=c.classId;
      ck.addEventListener('change', ()=> onPickSingleCourse(ck, li));
      const cid = document.createElement('span'); cid.className='badge'; cid.textContent=c.classId || '-';
      const main = document.createElement('div');
      main.innerHTML = `<strong>${escapeHtml(c.className||'-')}</strong><div class="muted">${escapeHtml(c.startTime||'')} - ${escapeHtml(c.endTime||'')} · ${escapeHtml(c.location||'')}</div>`;
      const dow = document.createElement('div'); dow.className='muted'; dow.style.textAlign='right'; dow.textContent = day;

      li.appendChild(ck); li.appendChild(cid); li.appendChild(main); li.appendChild(dow);
      ul.appendChild(li);
    });

    content.appendChild(ul);
    panel.appendChild(header); panel.appendChild(content);
    acc.appendChild(panel);

    // 折叠交互
    header.addEventListener('click', ()=> panel.classList.toggle('active'));
  });

  // 默认展开第一个
  const first = qs('.accordion .panel'); if(first) first.classList.add('active');
}

function onPickSingleCourse(ck, li){
  // 全局互斥：仅允许选择一门课程
  qsa('input[name="courseSingle"]').forEach(n => { if(n !== ck) n.checked = false; });
  qsa('#courseAccordion .list-item').forEach(el => el.classList.remove('selected'));
  if(ck.checked){ li.classList.add('selected'); selectedCourseId = ck.value; }
  else { selectedCourseId = null; }
  updateSubmitButton();
}

function updateSubmitButton(){
  const ok = !!(selectedStudentId && selectedCourseId);
  const btn = qs('#btnSubmit');
  if (btn) btn.disabled = !ok;
}

// ===== 提交报名（最小数据交换）=====
async function onSubmit(){
  if(!selectedStudentId || !selectedCourseId){ return; }
  try{
    qs('#btnSubmit').disabled = true;
    showTip('正在提交报名…');
    const body = new URLSearchParams({
      action: 'applyStudentToClass',
      studentId: selectedStudentId,
      classId: selectedCourseId
    });
    const res = await fetch(API, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body });
    const data = await res.json();
    if(data && (data.success || data.status==='ok')){
      showTip('报名成功！', 'success');
      // 成功后清空选择
      selectedCourseId = null; selectedStudentId = null;
      qsa('input[name="studentSingle"]').forEach(n=> n.checked=false);
      qsa('#studentResult .list-item').forEach(el=> el.classList.remove('selected'));
      qsa('input[name="courseSingle"]').forEach(n=> n.checked=false);
      qsa('#courseAccordion .list-item').forEach(el=> el.classList.remove('selected'));
      updateSubmitButton();
    }else{
      const msg = (data && (data.message||data.error)) || '报名失败';
      showTip(msg, 'error');
    }
  }catch(e){
    console.error(e);
    showTip('提交失败，请稍后再试', 'error');
  }finally{
    updateSubmitButton();
  }
}
