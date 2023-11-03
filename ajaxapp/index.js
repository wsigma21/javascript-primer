async function main() {
  try {
    const userId = getUserId();
    console.log(`${userId}`);
    const userInfo = await fetchUserInfo(userId);
    const view = createView(userInfo);
    displayView(view);
  } catch(error) {
      console.error(`エラーが発生しました：${error}`);
  };
}

/**
 * `特殊記号に対するエスケープ処理を行う`
 * @param {string} - replaceする文字列
 * @returns {string} - replaceした文字列
 */
function escapeSpecialChars(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * `文字列リテラルと値が順番通りに並ぶよう文字列を組み立てつつ、文字列型はエスケープするタグ関数`
 * @param {string} - 文字列リテラルの配列 
 * @param  {...any} - 埋め込まれる値の配列
 * @returns {string} - 結果
 */
function escapeHTML(strings, ...values) {
  // console.log("strings=", strings);
  // reduceの初期値（第二引数）が省略されているので、初期値はstrings[0]
  return strings.reduce((result, str, i) => {
    // console.log("result=", result);
    const value = values[i - 1];
    // console.log(`str=${str}`);
    // console.log(`value=${value}`);
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}

/**
 * `HTML文字列を組み立てる`
 * @param {Object} - fetchしたuserInfo
 * @returns {string} - userInfoをHTMLに加工した文字列
 */
function createView(userInfo) {
  return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt=$"${userInfo.login}" height="100">
    <dl>
      <dt>Location</dt>
      <dd>${userInfo.location}</dd>
      <dt>Repositories</dt>
      <dd>${userInfo.public_repos}</dd>
    </dl>
  `;
}

/**
 * `HTMLを画面に表示する`
 * @param {string} view - HTMLに加工された文字列
 */
function displayView(view) {
  const result = document.getElementById('result');
  result.innerHTML = view;
}

/**
 * `入力されたUserIdを返す`
 * @returns {int} - userId
 */
function getUserId() {
  return document.getElementById('userId').value;
}

/**
 * `GitHubからユーザー情報を取得する`
 * @param {string} userId 
 */
function fetchUserInfo(userId) {
  return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then(response => {
      if (!response.ok) {
        // エラーレスポンスからRejectedなPromiseを作成して返す
        return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
        // console.error("エラーレスポンス", response);
      } else {
        return response.json();
      }
    });
}