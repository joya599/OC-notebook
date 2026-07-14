/* 
 * hexo theme meow
 * main scripts (纯净架构版)
 */

import initMenu from "./theme/menu.js";
import initToolbar from "./theme/toolbar.js";
import { initScroll, initTOCHighlight } from "./theme/tools/scroll.js";
import initDatetime from "./theme/tools/datetime.js";
import initCategoryPage from "./theme/category.js";
import initLazyLoad from "./theme/tools/lazyload.js";
import initImageView from "./theme/tools/imageview.js";
import initFriendLink from "./theme/friendLink.js";
import { initAlbum, initLinkAlbum } from "./theme/albums.js";
import initCopy from "./theme/tools/copy.js";
import initCodeBlock from "./theme/code.js";
import { initTags, initMusicPlayer } from "./theme/tags.js";
import initKeyboard from "./theme/tools/keyboard.js";
import initPageFocus from "./theme/focus.js";
import initMouse from "./theme/tools/mouse.js";
import initSearch from "./theme/search.js";

// 引入 Turbo
import "https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.6/dist/turbo.es2017-esm.min.js";

// ==========================================
//          状态控制
// ==========================================
let hasInitialized = false; 
let isTransition = false;   

// 首次整站初始化
const initMain = () => {
  initMenu();
  if (GLOBALCONFIG.toolbar) initToolbar();
  initScroll();
  initDatetime();
  if (GLOBALCONFIG.category) initCategoryPage();
  initLazyLoad();
  initImageView();
  if (GLOBALCONFIG.friends) initFriendLink();
  if (GLOBALCONFIG.album) {
    if (GLOBALCONFIG.album != 'external') {
      GLOBALCONFIG.encrypt ? initAlbum(2) : initAlbum(0);
    } else {
      if (GLOBALCONFIG.encrypt) initLinkAlbum(2);
    }
  }
  initCopy();
  if (GLOBALCONFIG.codeblock) initCodeBlock();
  initTags();
  initKeyboard();
  if (GLOBALCONFIG.onblur_title && GLOBALCONFIG.onblur_title != 'false') initPageFocus();
  if (GLOBALCONFIG.mouse_click) initMouse();
  if (GLOBALCONFIG.search.enable) initSearch();

  console.log("%c🐱 Theme：Meow | Author：小橘猫chanwj", "color:#fff; background:#ffc76c; padding: 8px 15px; border-radius: 8px");
};

// 切页时的局部重载
const refreshFn = () => {
  initLazyLoad();
  if (GLOBALCONFIG.codeblock) initCodeBlock();
  initTags();
  initMusicPlayer(); // MetingJS 的重载逻辑
  if (GLOBALCONFIG.album) {
    GLOBALCONFIG.album != 'external' ? initAlbum(1) : initLinkAlbum(1);
  }
  initTOCHighlight();
};

const bootstrap = () => {
  if (hasInitialized) return;
  hasInitialized = true;
  initMain();
};

// ==========================================
//          生命周期与 Turbo 路由
// ==========================================

// 1. 常规冷启动
if (document.readyState === "complete" || document.readyState === "interactive") {
  bootstrap();
} else {
  document.addEventListener("DOMContentLoaded", bootstrap);
}
// 2. Turbo 切页前：清理旧对象 & 保护主题状态 & 拦截致命报错
document.addEventListener("turbo:before-render", (event) => {
  isTransition = true;
  
  if (event.detail && event.detail.newBody) {
    // 【拆除地雷】：在 Turbo 将新脚本塞入 DOM 执行前，强行在内存中拦截。
    // 将 Aplayer/Meting 的 const 强行改为 var，彻底防止 replaceWith 时的 SyntaxError 崩溃。
    event.detail.newBody.querySelectorAll("script").forEach(script => {
      if (script.textContent && script.textContent.includes("apFn_")) {
        script.textContent = script.textContent.replace(/const\s+(apFn_\d+)/g, "var $1");
      }
    });
    
    event.detail.newBody.className = currentBodyClass;
    if (currentTheme) {
      event.detail.newBody.setAttribute('data-theme', currentTheme);
    }
  }

  // 销毁旧页面的鼠标特效，防止 Canvas 叠加卡顿
  if (window.destroyMouse) window.destroyMouse();
});
// 3. Turbo 切页完成：局部重载
document.addEventListener("turbo:load", () => {
  bootstrap(); 
  if (isTransition) {
    refreshFn();
    if (GLOBALCONFIG.mouse_click) initMouse();
    isTransition = false;
  }
});

// 其他监听事件
if (GLOBALCONFIG.encrypt) {
  window.addEventListener("hexo-blog-decrypt", () => {
    refreshFn();
    const tocDiv = document.getElementById("toc-div");
    if (tocDiv) tocDiv.style.display = 'block';
  });
}

if (GLOBALCONFIG.album && GLOBALCONFIG.album != 'external') {
  window.addEventListener("album-load-new-image", initLazyLoad);
}

export default initMain;