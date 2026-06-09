/**
 * 共享导航组件
 * 在页面中自动创建浮动导航面板
 * 使用方式：在 <body> 末尾引入此脚本，并设置 data-nav-current 属性标记当前页
 */

(function () {
  'use strict';

  // 页面配置
  const pages = [
    { id: 'index',   name: '首页导览', icon: '🏠', href: 'index.html' },
    { id: 'demo1',   name: '网站橱窗', icon: '🪟', href: 'demo1.html' },
    { id: 'demo2',   name: '留言广场', icon: '💬', href: 'demo2.html' },
    { id: 'demo3',   name: '猫咪乐园', icon: '🐱', href: 'demo3.html' },
  ];

  // 当前页标识（从 body data 属性读取）
  const currentPage = document.body.getAttribute('data-nav-current') || 'index';

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
             href="${p.href}"
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

  function toggle() {
    isOpen ? close() : open();
  }

  // 事件绑定
  trigger.addEventListener('click', toggle);
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
