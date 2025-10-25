// ===================== sidebar.js =====================

// -------------------- 要素取得 --------------------
const sidebarLeft = document.getElementById('sidebarLeft');
const sidebarRight = document.getElementById('sidebarRight');
const toggleLeftSwitch = document.getElementById('toggleLeftSwitch');
const toggleRightSwitch = document.getElementById('toggleRightSwitch');
const connectorLeft = document.getElementById('connectorLeft');
const connectorRight = document.getElementById('connectorRight');
const subSidebarLeft = document.getElementById('subSidebarLeft');
const subSidebarRight = document.getElementById('subSidebarRight');

// -------------------- 記憶用 --------------------
let lastOpenedAction = null; // 最後に開いたサブサイドバーのアクション
let lastOpenedSide = null;   // 左右どちらで開いたか

// -------------------- サイドバー切替 --------------------
function loadSidebarPosition() {
  const pos = localStorage.getItem('sidebarPosition');
  if(pos === 'right'){
    sidebarLeft.style.display = 'none';
    sidebarRight.style.display = 'flex';
    toggleLeftSwitch.style.display = 'block';
    toggleRightSwitch.style.display = 'none';
  } else {
    sidebarLeft.style.display = 'flex';
    sidebarRight.style.display = 'none';
    toggleLeftSwitch.style.display = 'none';
    toggleRightSwitch.style.display = 'block';
  }
}
function saveSidebarPosition(pos){ localStorage.setItem('sidebarPosition', pos); }

// サイドバー切替ボタン
toggleRightSwitch.addEventListener('click',()=>{
  sidebarLeft.style.display='none';
  sidebarRight.style.display='flex';
  toggleRightSwitch.style.display='none';
  toggleLeftSwitch.style.display='block';
  saveSidebarPosition('right');

  if(lastOpenedAction) handleSidebarClick(lastOpenedAction, 'right', true);
});

toggleLeftSwitch.addEventListener('click',()=>{
  sidebarRight.style.display='none';
  sidebarLeft.style.display='flex';
  toggleLeftSwitch.style.display='none';
  toggleRightSwitch.style.display='block';
  saveSidebarPosition('left');

  if(lastOpenedAction) handleSidebarClick(lastOpenedAction, 'left', true);
});

// -------------------- サブサイドバー設定 --------------------
const sidebarConfig = {
  video: ['key-sentence.svg','preview.svg','siryo.svg'],
  timer: ['ti-timer.svg','it-stop-watch.svg','ti-wpm.svg'],
  shoChu: ['rhythm-box.svg','alphabet-chart.svg','song.svg'],
  worksheet: ['grammer.svg','word-room.svg'],
  hyoji: ['kakudai.svg','shukusho.svg','booklet.svg']
};

// -------------------- サブサイドバー操作 --------------------
function hideAllSubSidebars(excludeSide = null){
  if(excludeSide !== 'left'){
    connectorLeft.style.display = 'none';
    subSidebarLeft.style.display = 'none';
    subSidebarLeft.innerHTML = '';
  }
  if(excludeSide !== 'right'){
    connectorRight.style.display = 'none';
    subSidebarRight.style.display = 'none';
    subSidebarRight.innerHTML = '';
  }
  if(!excludeSide){
    lastOpenedAction = null;
    lastOpenedSide = null;
  }
}

// action: サイドバーアクション
// side: 'left' or 'right'
// forceOpen: 切替ボタン押下など例外時に強制的に開く場合
function handleSidebarClick(action, side, forceOpen=false){
  let connector, subSidebar;
  if(side === 'left'){ connector = connectorLeft; subSidebar = subSidebarLeft; }
  else { connector = connectorRight; subSidebar = subSidebarRight; }

  const currentlyVisible = subSidebar.style.display === 'flex';

  // 同じボタン押下の場合は toggle
  if(currentlyVisible && !forceOpen){
    hideAllSubSidebars();
    return;
  }

  // 他のサブが開いている場合は閉じつつ、今のサブは開く
  if(lastOpenedAction && (lastOpenedAction !== action || lastOpenedSide !== side)){
    hideAllSubSidebars(side);
  }

  // サブを開く
  lastOpenedAction = action;
  lastOpenedSide = side;

  const btn = document.querySelector(`#sidebar${side==='left'?'Left':'Right'} .sidebarItem[data-action="${action}"]`);
  connector.style.top = btn.offsetTop + 'px';
  connector.style.height = btn.offsetHeight + 'px';
  connector.style.display = 'block';

  subSidebar.innerHTML = '';
  sidebarConfig[action].forEach(src=>{
    const img = document.createElement('img');
    img.src = src;
    img.addEventListener('click', ()=>{ console.log('クリック:', src); });
    subSidebar.appendChild(img);
  });

  subSidebar.style.top = btn.offsetTop + 'px';
  subSidebar.style.display = 'flex';
}

// -------------------- サイドバーイベント追加 --------------------
function addSidebarListeners(sidebar, side){
  sidebar.querySelectorAll('.sidebarItem').forEach(btn=>{
    btn.addEventListener('click', ()=>handleSidebarClick(btn.dataset.action, side));
  });
}
addSidebarListeners(sidebarLeft,'left');
addSidebarListeners(sidebarRight,'right');

// -------------------- 画面外クリックでサブ閉じる --------------------
document.addEventListener('click', (e)=>{
  const isSidebarClick = e.target.closest('.sidebar') || e.target.closest('.sub-sidebar') || e.target.closest('#toggleLeftSwitch') || e.target.closest('#toggleRightSwitch');
  if(!isSidebarClick){
    hideAllSubSidebars();
  }
});

// -------------------- 初期ロード --------------------
window.addEventListener('load', loadSidebarPosition);
