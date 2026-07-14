/* 
 * hexo theme meow
 * scroll scripts
 */

const initScroll = () => {
  const scrollHeader = () => {
    const updateHeaderStyle = () => {
      const scroll_y = window.scrollY || window.pageYOffset || document.body.scrollTop;
      const bg_color = document.body.getAttribute('data-mode') == 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(45, 45, 45, 0.85)';
      const new_color = scroll_y >= (window.innerHeight * 0.6) ? bg_color : 'transparent';
      const headerElement = document.querySelector('header');
      requestAnimationFrame(() => {
        headerElement.style.background = new_color;
      });
      if (new_color == 'transparent') {
        headerElement.setAttribute('custom', '');
      } else {
        headerElement.removeAttribute('custom');
      }
    };

    window.addEventListener('scroll', meow.debounce(() => updateHeaderStyle(), 200));
  };

  const scrollHomeBg = () => {
    if (document.body.getAttribute('bg-style') != 'fixed') return;
    const updateBgStyle = () => {
      const scroll_y = window.scrollY || window.pageYOffset || document.body.scrollTop;
      if (scroll_y >= (window.innerHeight * 0.6)) {
        document.body.setAttribute('blur', '');
      } else {
        document.body.removeAttribute('blur');
      }
    };
    window.addEventListener('scroll', meow.debounce(() => updateBgStyle(), 200));
  };

  const scrollToMain = () => {
    const scroll_down = document.getElementById('scroll-to-main');
    if (scroll_down) {
      scroll_down.addEventListener('click', function () { meow.scrollFn(document.getElementById('home-container').offsetTop - 59) });
    }
  };

  const scrollTOC = () => {
    const clickTOC = event => {
      event.preventDefault();
      const target = event.target.closest(".toc-list-link");
      if (!target) return;
      meow.debounce(meow.scrollFn(document.getElementById(decodeURI(target.getAttribute("href")).replace("#", "")).offsetTop - window.innerHeight * 0.15), 300);
    };

    const toc = document.getElementById('toc-container');
    if (toc) {
      toc.addEventListener('click', clickTOC, true);
    }
  };

  const scrollTOCHighlight = () => {
    if (GLOBALCONFIG.encrypt) return;
    initTOCHighlight();
  };

  const scrollToTop = () => {
    const toolbar = document.getElementById('toolbar');
    if (toolbar) {
      document.getElementById('tool-gototop').addEventListener('click', function () { meow.scrollFn(0) });
    }
  };

  const scrollToolbar = () => {
    const changeToolbarStatus = () => {
      const scroll_y = window.scrollY || window.pageYOffset || document.body.scrollTop;
      if (scroll_y >= (window.innerHeight * 0.15) && scroll_y <= (document.documentElement.scrollHeight - window.innerHeight - 16)) {
        document.getElementById('toolbar').removeAttribute("hide");
      } else {
        document.getElementById('toolbar').setAttribute("hide", "");
      }
    };

    window.addEventListener('scroll', meow.debounce(() => changeToolbarStatus(), 150));
  };

  scrollHeader();
  scrollToMain();
  scrollHomeBg();
  scrollToolbar();
  scrollToTop();
  scrollTOC();
  scrollTOCHighlight();
};

const initTOCHighlight = () => {
  const toc = document.querySelector('.toc-content');
  if (!toc) return;

  const tocList = document.querySelectorAll('.toc-list-link');
  
  tocList.forEach(item => {
    const href = item.getAttribute("href");
    if (!href) return;
    
    // 获取真实的 DOM 元素
    const section = document.getElementById(decodeURI(href).replace("#", ""));
    
    // 关键修复：只有当 section 确实存在时才进行观察
    if (section) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let titleId = entry.target.id;
            tocList.forEach(link => { link.removeAttribute('active') });
            
            // 安全地查询目标 TOC 链接
            let targetToc = document.querySelector(`.toc-list-link[href='${"#" + encodeURI(titleId)}']`);
            if (!targetToc) return; // 防止找不到目标的情况
            
            targetToc.setAttribute('active', '');

            // 滚动 TOC 容器逻辑
            let targetView = targetToc.getBoundingClientRect();
            let tocView = toc.getBoundingClientRect();
            if (targetView.top >= (tocView.top + tocView.height)) {
              requestAnimationFrame(() => { toc.scrollTop += 35; });
            } else if (targetView.top <= tocView.top) {
              requestAnimationFrame(() => { toc.scrollTop -= 35; });
            }
          }
        });
      }, { threshold: [1], rootMargin: '-10% 0% -60%' });
      
      observer.observe(section);
    } else {
      // 调试用：可选，如果某个目录链接找不到对应的内容，可以在控制台输出
      // console.warn('找不到对应标题内容:', href);
    }
  });
}

export { initScroll, initTOCHighlight };
