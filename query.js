// ===================== query.js =====================

// -------------------- URLのクエリを解析 --------------------
function getQueryParams() {
  const params = {};
  const search = window.location.search;
  if (!search) return params; // クエリがない場合は空オブジェクト

  search.substring(1).split("&").forEach(pair => {
    if (!pair) return;
    const [key, value] = pair.split("=");
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });
  return params;
}

// -------------------- ページ初期化 --------------------
window.addEventListener('load', () => {
  const params = getQueryParams();

  // id パラメータ（存在しなければ grade3 をデフォルト）
  window.currentId = params.id || 'grade3';

  // page パラメータ（存在しなければ 1 をデフォルト）
  let pageNum = 1;
  if (params.page) {
    const num = parseInt(params.page, 10);
    if (!isNaN(num) && num >= 1) {
      pageNum = num;
    }
  }

  // booklet.js の setCurrentPage を呼ぶ
  if (typeof setCurrentPage === 'function') {
    setCurrentPage(pageNum);
  } else {
    console.warn('setCurrentPage 関数が未定義です。booklet.js を読み込んでください。');
  }
});
