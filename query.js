// ===================== query.js =====================

// URLのクエリを解析
function getQueryParams() {
  const params = {};
  const search = window.location.search;
  if (search){
    search.substring(1).split("&").forEach(pair => {
      const [key, value] = pair.split("=");
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  return params;
}

// booklet.js の setCurrentPage を呼ぶ
window.addEventListener('load', ()=>{
  const params = getQueryParams();
  // idをセット
  window.currentId = params.id || 'grade3';

  // ページ番号をセット
  if(params.page){
    const pageNum = parseInt(params.page, 10);
    if(!isNaN(pageNum)){
      setCurrentPage(pageNum);
    }
  } else {
    setCurrentPage(1);
  }
});
