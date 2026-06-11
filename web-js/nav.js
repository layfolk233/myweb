/**
 * 共享导航组件
 * 在页面中自动创建浮动导航面板
 * 使用方式：在 <body> 末尾引入此脚本，并设置 data-nav-current 属性标记当前页
 */

(function () {
  'use strict';

  // 页面配置 —— 在此添加新页面即可（href 为相对于项目根目录的 clean URL）
  const pages = [
    { id: 'index',       name: '首页',               icon: '🏠', href: '' },
    { id: 'showcase',    name: '网站橱窗',           icon: '🪟', href: 'showcase/' },
    { id: 'guestbook',   name: '留言广场',           icon: '💬', href: 'guestbook/' },
    { id: 'probe',       name: '网站探测',           icon: '🔍', href: 'probe/' },
    { id: 'catpark',     name: '猫咪乐园',           icon: '🐈', href: 'catpark/' },
    { id: 'cat',         name: '猫图工坊',           icon: '🐱', href: 'cat/' },
    { id: 'joke',        name: '随机笑话',           icon: '😂', href: 'joke/' },
    { id: 'navigation',  name: '网站导航',           icon: '🔗', href: 'navigation/' },
    { id: 'tmdb-netlify',name: 'TMDb 电影(Netlify)', icon: '🎬', href: 'tmdb-netlify/' },
    { id: 'tmdb-vercel', name: 'TMDb 电影(Vercel)',  icon: '🎞️', href: 'tmdb-vercel/' },
  ];

  // 当前页检测：优先 body 属性，回退到 URL 路径推断
  let currentPage = document.body.getAttribute('data-nav-current');
  if (!currentPage) {
    const path = window.location.pathname;
    // Clean URL: /showcase/ → showcase, / → index
    const segs = path.replace(/\/+$/, '').split('/').filter(Boolean);
    const last = segs.length > 0 ? segs[segs.length - 1] : 'index';
    if (last && pages.find(p => p.id === last)) {
      currentPage = last;
    }
  }
  currentPage = currentPage || 'index';

  // 计算路径前缀：子页面中需要 ../ 回到项目根目录
  const isSubPage = currentPage !== 'index';
  const pathPrefix = isSubPage ? '../' : '';

  // 解析 href：空 href 为首页，子页面路径加 ../ 前缀
  function resolveHref(href) {
    if (href === '') return isSubPage ? '../' : './';
    return pathPrefix + href;
  }

  // 创建导航触发器按钮
  const trigger = document.createElement('button');
  trigger.className = 'nav-trigger';
  trigger.setAttribute('aria-label', '打开导航菜单');
  trigger.innerHTML = `
    <svg class="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
      <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
    <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  `;

  // 创建导航面板
  const panel = document.createElement('nav');
  panel.className = 'nav-panel';
  panel.setAttribute('aria-label', '页面导航');
  panel.innerHTML = `
    <div class="nav-panel__title">📂 页面导航</div>
    <ul class="nav-panel__list">
      ${pages.map(p => `
        <li>
          <a class="nav-panel__link ${p.id === currentPage ? 'active' : ''}"
             href="${resolveHref(p.href)}"
             ${p.id === currentPage ? 'aria-current="page"' : ''}>
            <span class="nav-panel__icon">${p.icon}</span>
            ${p.name}
          </a>
        </li>
      `).join('')}
    </ul>
  `;

  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';

  // 状态管理
  let isOpen = false;

  function open() {
    isOpen = true;
    trigger.classList.add('active');
    panel.classList.add('open');
    overlay.classList.add('visible');
    trigger.setAttribute('aria-label', '关闭导航菜单');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    isOpen = false;
    trigger.classList.remove('active');
    panel.classList.remove('open');
    overlay.classList.remove('visible');
    trigger.setAttribute('aria-label', '打开导航菜单');
    trigger.setAttribute('aria-expanded', 'false');
  }

  // 延迟关闭计时器
  let closeTimer = null;

  function scheduleClose() {
    closeTimer = setTimeout(close, 200);
  }

  function cancelClose() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  // Hover 事件：鼠标悬停弹出，移走后延迟消失
  trigger.addEventListener('mouseenter', function () {
    cancelClose();
    open();
  });
  trigger.addEventListener('mouseleave', scheduleClose);
  panel.addEventListener('mouseenter', cancelClose);
  panel.addEventListener('mouseleave', scheduleClose);

  // 触屏回退：点击触发器也可打开
  trigger.addEventListener('click', function () {
    cancelClose();
    open();
  });

  // 点击遮罩关闭
  overlay.addEventListener('click', close);

  // ESC 关闭
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  // 注入 DOM
  document.body.appendChild(trigger);
  document.body.appendChild(panel);
  document.body.appendChild(overlay);

  // 初始状态
  trigger.setAttribute('aria-expanded', 'false');
})();
