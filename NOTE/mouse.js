/* mouse.js - 重构为受控模块 */
let animationId = null; // 用于存储 requestAnimationFrame 的 ID
let isInitialized = false;

const initMouse = () => {
  // 1. 防重入：如果已经初始化过，直接退出，防止重复循环
  if (isInitialized) return;
  isInitialized = true;

  const s = [];

  // 初始化 CSS
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = ".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);z-index:99999;}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}";
  document.head.appendChild(style);

  // 循环渲染函数
  function r() {
    for (let e = 0; e < s.length; e++) {
      if (s[e].alpha <= 0) {
        if (s[e].el.parentNode) s[e].el.parentNode.removeChild(s[e].el);
        s.splice(e, 1);
        e--;
      } else {
        s[e].y--;
        s[e].scale += 0.004;
        s[e].alpha -= 0.013;
        s[e].el.style.cssText = `left:${s[e].x}px;top:${s[e].y}px;opacity:${s[e].alpha};transform:scale(${s[e].scale},${s[e].scale}) rotate(45deg);background:${s[e].color};position:fixed;`;
      }
    }
    animationId = requestAnimationFrame(r);
  }

  // 点击事件处理
  const clickHandler = (e) => {
    const a = document.createElement("div");
    a.className = "heart";
    s.push({
      el: a,
      x: e.clientX - 5,
      y: e.clientY - 5,
      scale: 1,
      alpha: 1,
      color: `rgb(${~~(255 * Math.random())},${~~(255 * Math.random())},${~~(255 * Math.random())})`
    });
    document.body.appendChild(a);
  };

  document.addEventListener("click", clickHandler);
  r(); // 启动循环

  // 暴露销毁方法，供 Main.js 调用
  window.destroyMouse = () => {
    cancelAnimationFrame(animationId);
    document.removeEventListener("click", clickHandler);
    s.forEach(item => { if (item.el.parentNode) item.el.parentNode.removeChild(item.el); });
    style.remove();
    isInitialized = false;
  };
};

export default initMouse;