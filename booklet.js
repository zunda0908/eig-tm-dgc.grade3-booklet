// ===================== booklet.js =====================

// -------------------- ページ制御 --------------------
let currentPage = 1;
const maxPage = 10;
const pageImage = document.getElementById("pageImage");
const pageContainer = document.getElementById("pageContainer");
const pageLeftBtn = document.getElementById("pageLeftBtn");
const pageRightBtn = document.getElementById("pageRightBtn");

// ズーム＆ドラッグ設定
let scale = 1;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let startX = 0, startY = 0;
const scaleStep = 0.25; // 25%

// -------------------- ページ読込 --------------------
function loadPage(pageNum){
  pageImage.src = `pages/${pageNum}.png?v=${Date.now()}`;
  resetTransform();
  updateURL();
}

function resetTransform(){
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  applyTransform();
}

// -------------------- 変形適用 --------------------
function applyTransform(){
  pageImage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  pageImage.style.transformOrigin = "center top";
}

// -------------------- ページ切替 --------------------
pageRightBtn.addEventListener("click", ()=>{
  if(currentPage < maxPage){
    currentPage++;
    loadPage(currentPage);
  }
});
pageLeftBtn.addEventListener("click", ()=>{
  if(currentPage > 1){
    currentPage--;
    loadPage(currentPage);
  }
});

// -------------------- マウスドラッグ --------------------
pageContainer.addEventListener("mousedown",(e)=>{
  isDragging = true;
  startX = e.pageX - offsetX;
  startY = e.pageY - offsetY;
  pageContainer.style.cursor = "grabbing";
});
window.addEventListener("mouseup",()=>{
  isDragging = false;
  pageContainer.style.cursor = "default";
});
window.addEventListener("mousemove",(e)=>{
  if(!isDragging) return;
  offsetX = e.pageX - startX;
  offsetY = e.pageY - startY;
  applyTransform();
});

// -------------------- タッチ操作 --------------------
pageContainer.addEventListener("touchstart",(e)=>{
  if(e.touches.length === 1){
    isDragging = true;
    startX = e.touches[0].pageX - offsetX;
    startY = e.touches[0].pageY - offsetY;
  }
}, {passive: false});

pageContainer.addEventListener("touchmove",(e)=>{
  if(!isDragging) return;
  offsetX = e.touches[0].pageX - startX;
  offsetY = e.touches[0].pageY - startY;
  applyTransform();
  e.preventDefault();
}, {passive: false});

pageContainer.addEventListener("touchend",(e)=>{
  isDragging = false;
}, {passive: false});

// -------------------- マウスホイールズーム無効 --------------------
pageContainer.addEventListener("wheel",(e)=>{
  e.preventDefault();
}, {passive: false});

// -------------------- サブサイドバーズームボタン --------------------
function setupSubSidebarZoom(){
  const zoomInBtns = document.querySelectorAll('img[src="kakudai.svg"]');
  const zoomOutBtns = document.querySelectorAll('img[src="shukusho.svg"]');
  const resetBtns  = document.querySelectorAll('img[src="booklet.svg"]');

  zoomInBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
      scale += scaleStep;
      applyTransform();
    });
  });
  zoomOutBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(scale - scaleStep > 0) scale -= scaleStep;
      applyTransform();
    });
  });
  resetBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
      resetTransform();
    });
  });
}

// -------------------- サブサイドバー更新時にズームボタン登録 --------------------
function hookSubSidebarZoom(subSidebar){
  const observer = new MutationObserver(()=>{
    setupSubSidebarZoom();
  });
  observer.observe(subSidebar,{childList:true});
}

hookSubSidebarZoom(document.getElementById('subSidebarLeft'));
hookSubSidebarZoom(document.getElementById('subSidebarRight'));

// -------------------- 親コンテナリサイズ --------------------
function resizeContainer(){
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const baseW = 1920;
  const baseH = 1080;
  const scaleFactor = (vw/vh > baseW/baseH)? vh/baseH : vw/baseW;
  document.getElementById('parentContainer').style.transform = `translate(-50%,-50%) scale(${scaleFactor})`;
}

window.addEventListener('resize', resizeContainer);
window.addEventListener('load', resizeContainer);

// -------------------- URL パラメータ管理 --------------------
function updateURL(){
  const params = new URLSearchParams(window.location.search);
  if(currentPage) params.set('page', currentPage);
  if(window.currentId) params.set('id', window.currentId);
  // textは undefined の場合は削除
  if(params.get('text') === 'undefined'){
    params.delete('text');
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

// -------------------- 外部からページ指定用 --------------------
function setCurrentPage(pageNum){
  if(pageNum < 1 || pageNum > maxPage) return;
  currentPage = pageNum;
  loadPage(currentPage);
}

// -------------------- URL 読み込み時に初期設定 --------------------
window.addEventListener('load', ()=>{
  const params = new URLSearchParams(window.location.search);
  window.currentId = params.get('id') || 'grade3';
  const pageParam = parseInt(params.get('page'), 10);
  if(!isNaN(pageParam)) setCurrentPage(pageParam);
  else setCurrentPage(1);
  // text=undefined 削除
  if(params.get('text') === 'undefined'){
    params.delete('text');
    const cleanUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', cleanUrl);
  }
});
