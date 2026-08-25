(() => {
  'use strict';

  const REPORTS = {
    bc1: {
      src: 'modules/bc1/index.html',
      title: 'BC1 – Doanh số theo khung giờ',
      description: 'Theo dõi doanh số ngày theo khung giờ và tiến độ thời gian của 16 showroom.'
    },
    bc2: {
      src: 'modules/bc2/index.html',
      title: 'BC2 – BXH doanh số 16 showroom',
      description: 'Xếp hạng 16 showroom theo HTTG, so với tiến độ thời gian và tổng hệ thống.'
    },
    bc3: {
      src: 'modules/bc3/index.html',
      title: 'BC3 – KPI hệ thống bán lẻ',
      description: 'Theo dõi Target tháng, thực đạt, tiến độ, GAP, hiệu suất và nhu cầu doanh số/ngày.'
    },
    bc4: {
      src: 'modules/bc4/index.html',
      title: 'BC4 – BXH bán túi toàn hệ thống',
      description: 'Theo dõi KPI bán túi tháng, tiến độ thời gian, forecast và cửa hàng cần ưu tiên.'
    },
    bc5: {
      src: 'modules/bc5/index.html',
      title: 'BC5 – Dashboard điều hành hệ thống bán lẻ',
      description: 'Tổng hợp KPI hệ thống, nguồn khách hàng, Top/Bottom Store, hiệu quả nhân sự, quản trị và thiếu/thừa nhân sự.'
    }
  };

  const STORAGE = 'sevenam-internal-reporting-hub-active-tab-v1';
  const frame = document.getElementById('reportFrame');
  const description = document.getElementById('moduleDescription');
  const loading = document.getElementById('loading');
  const tabs = [...document.querySelectorAll('.tab')];
  const openStandalone = document.getElementById('openStandalone');
  const toggleFocus = document.getElementById('toggleFocus');
  const restoreNav = document.getElementById('restoreNav');
  let active = 'bc1';

  function cleanTab(value) {
    return REPORTS[value] ? value : 'bc1';
  }

  function initialTab() {
    const hash = location.hash.replace(/^#\/?/, '').toLowerCase();
    if (REPORTS[hash]) return hash;
    try { return cleanTab(localStorage.getItem(STORAGE) || 'bc1'); }
    catch (_) { return 'bc1'; }
  }

  function selectTab(key, options = {}) {
    key = cleanTab(key);
    const report = REPORTS[key];
    const shouldLoad = active !== key || !frame.src;
    active = key;

    tabs.forEach(btn => {
      const on = btn.dataset.tab === key;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', String(on));
      btn.tabIndex = on ? 0 : -1;
    });

    description.textContent = report.description;
    document.title = `Seven.AM – ${report.title}`;
    frame.title = report.title;

    if (shouldLoad || options.force) {
      loading.classList.add('show');
      frame.src = report.src;
    }

    if (!options.skipHash) history.replaceState(null, '', `#${key}`);
    try { localStorage.setItem(STORAGE, key); } catch (_) {}
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => selectTab(btn.dataset.tab));
    btn.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const i = tabs.indexOf(btn);
      let next = i;
      if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      tabs[next].focus();
      selectTab(tabs[next].dataset.tab);
    });
  });

  frame.addEventListener('load', () => loading.classList.remove('show'));
  window.addEventListener('hashchange', () => selectTab(cleanTab(location.hash.replace(/^#\/?/, '')), {skipHash:true}));

  openStandalone.addEventListener('click', () => {
    window.open(REPORTS[active].src, '_blank', 'noopener');
  });

  function setFocusMode(on) {
    document.body.classList.toggle('focus-mode', on);
    toggleFocus.setAttribute('aria-pressed', String(on));
  }
  toggleFocus.addEventListener('click', () => setFocusMode(true));
  restoreNav.addEventListener('click', () => setFocusMode(false));

  selectTab(initialTab(), {force:true});
})();
