/* Presenter page 01. App owns navigation; this module owns its local interactions. */
(function () {
  'use strict';

  const nameArt = ['王', '榕', '榕'].map((character, characterIndex) =>
    '<span class="profile-name-char" style="--char-index:' + characterIndex + '">' +
      '<span class="profile-letter-rest">' + character + '</span>' +
      '<span class="profile-letter-shutter">' + Array.from({ length: 6 }, (_, bandIndex) =>
        '<span class="profile-letter-band" style="--band-index:' + bandIndex + '"><i>' + character + '</i></span>'
      ).join('') + '</span>' +
    '</span>'
  ).join('');

  const localScene = `<div class="profile-scene profile-scene-local profile-record-graphic" aria-hidden="true">
                  <div class="profile-scene-layer">
                    <div class="profile-city-sun"></div>
                    <div class="profile-city-orbit"></div>
                    <div class="profile-city-ground"></div>
                    <div class="profile-city-road"><i></i></div>
                    <div class="profile-building profile-building-one"></div>
                    <div class="profile-building profile-building-two"></div>
                    <div class="profile-building profile-building-three"></div>
                    <div class="profile-building profile-building-four"></div>
                    <div class="profile-shop"><div class="profile-shop-sign">LOCAL</div><div class="profile-shop-awning"></div><div class="profile-shop-window"></div><div class="profile-shop-door"></div></div>
                    <div class="profile-tree profile-tree-one"></div><div class="profile-tree profile-tree-two"></div>
                    <div class="profile-city-pin profile-city-pin-one"><i></i></div><div class="profile-city-pin profile-city-pin-two"><i></i></div>
                    <div class="profile-city-route"><i></i></div>
                  </div>
                </div>`;

  const chargingScene = `<div class="profile-scene profile-scene-charging profile-record-graphic" aria-hidden="true">
                  <div class="profile-scene-layer">
                    <div class="profile-network-grid"></div>
                    <div class="profile-network-halo profile-network-halo-one"></div><div class="profile-network-halo profile-network-halo-two"></div>
                    <div class="profile-network-line profile-network-line-one"><i></i></div><div class="profile-network-line profile-network-line-two"><i></i></div><div class="profile-network-line profile-network-line-three"><i></i></div>
                    <div class="profile-network-node profile-network-node-one"></div><div class="profile-network-node profile-network-node-two"></div><div class="profile-network-node profile-network-node-three"></div><div class="profile-network-node profile-network-node-four"></div>
                    <div class="profile-charger profile-charger-back"><div class="profile-charger-display"><i></i></div><div class="profile-charger-cable"></div></div>
                    <div class="profile-charger profile-charger-side"><div class="profile-charger-display"><i></i></div><div class="profile-charger-cable"></div></div>
                    <div class="profile-charger profile-charger-main"><div class="profile-charger-display"><i></i></div><div class="profile-charger-cable"></div><span>ENERGY</span></div>
                    <div class="profile-energy-mark">+</div>
                  </div>
                </div>`;

  // The original three-charger illustration stays visible as the page 01 to 02 transition source.
  const sceneHTML = chargingScene;
  const sceneSelector = '.profile-record-charging .profile-record-graphic';
  const sceneBaseSize = { width: 420, height: 350 };
  const sceneScale = 1.1;

  const html = `
    <section class="profile-dialog profile-page" aria-labelledby="profile-title">
      <div class="profile-shell">
        <header class="profile-header profile-reveal" style="--profile-delay:0ms">
          <button class="profile-back" type="button" data-go="0"><span>00</span>返回首页</button>
          <span class="profile-page-label"><b>01</b><span>自我介绍<span class="profile-page-en"> / THE OPERATOR</span></span></span>
          <span class="profile-header-mark" aria-hidden="true">rowan<span>.</span></span>
        </header>

        <div class="profile-main">
          <div class="profile-intro">
            <p class="profile-kicker profile-reveal" style="--profile-delay:80ms">ABOUT THE OPERATOR<span></span></p>
            <h1 id="profile-title" class="profile-name" aria-label="王榕榕 rowan"><span class="profile-name-art" aria-hidden="true">${nameArt}<span class="profile-name-dot">.</span></span><span class="profile-name-alias profile-reveal" style="--profile-delay:720ms" aria-hidden="true">rowan</span></h1>
            <p class="profile-role profile-reveal" style="--profile-delay:230ms"><small>曾任 · 滴滴充电</small><span>区域策略运营负责人</span></p>
            <div class="profile-viewpoint profile-reveal" style="--profile-delay:310ms"><span class="profile-small-label">运营成就</span><p>推动城市份额提升与利润扭亏，<br>将一线实践沉淀为精细化运营方法。</p></div>
            <div class="profile-intro-foot profile-reveal" style="--profile-delay:390ms"><span class="profile-skill-pill">供需运营</span><span class="profile-skill-pill">分层定价</span><span class="profile-skill-pill">生命周期</span></div>
          </div>

          <div class="profile-experience profile-reveal" style="--profile-delay:220ms">
            <div class="profile-experience-heading"><h2>从本地生活，到充电业务。</h2><span>EXPERIENCE / 01—02</span></div>
            <div class="profile-cards profile-records" aria-label="工作经历">
              <article class="profile-card profile-card-local profile-record profile-record-local" data-profile-card="local" data-expanded="false">
                ${localScene}
                <div class="profile-card-top"><span class="profile-card-index">01<span>LOCAL LIFE</span></span><button class="profile-card-toggle" type="button" data-profile-toggle="local" aria-expanded="false" aria-controls="profile-detail-local" aria-label="查看阿里巴巴经历"><span data-profile-toggle-label>查看经历</span></button></div>
                <div class="profile-card-body">
                  <div class="profile-card-facts"><div><h3>阿里巴巴</h3><p>本地生活</p></div><p class="profile-tenure"><strong>5<span>+</span></strong><span>年</span></p></div>
                  <div class="profile-card-detail" id="profile-detail-local" aria-hidden="true"><div class="profile-card-detail-inner"><div class="profile-detail-rule"></div><h4 class="profile-detail-title">城市经理 · 区域商户运营</h4><p>拓展连锁品牌与区域商户，围绕商户全生命周期开展运营；联动品牌、商户与平台资源，通过营销活动带动订单与 GMV 增长。</p><span class="profile-detail-proof"><span>城市经理阶段 · 覆盖12省市</span><span>区域商户运营阶段 · 深耕34家LKA商户</span></span></div></div>
                </div>
              </article>

              <article class="profile-card profile-card-charging profile-record profile-record-charging" data-profile-card="charging" data-expanded="true">
                ${chargingScene}
                <div class="profile-card-top"><span class="profile-card-index">02<span>CHARGING</span></span><button class="profile-card-toggle" type="button" data-profile-toggle="charging" aria-expanded="true" aria-controls="profile-detail-charging" aria-label="查看滴滴充电经历"><span data-profile-toggle-label>正在查看</span></button></div>
                <div class="profile-card-body">
                  <div class="profile-card-facts"><div><h3>滴滴充电</h3><p>策略运营</p></div><p class="profile-tenure"><strong>4<span>+</span></strong><span>年</span></p></div>
                  <div class="profile-card-detail" id="profile-detail-charging" aria-hidden="false"><div class="profile-card-detail-inner"><div class="profile-detail-rule"></div><h4 class="profile-detail-title">区域策略运营负责人</h4><p>统筹城市供需、分层定价与生命周期策略。推动城市份额提升与利润扭亏，沉淀可复用的精细化运营方法。</p><span class="profile-detail-proof">供需判断 / 定价策略 / 经营复盘</span></div></div>
                </div>
              </article>
            </div>
          </div>
        </div>

        <footer class="profile-footer profile-reveal" style="--profile-delay:460ms">
          <div class="profile-motion-controls" aria-label="页面动效控制"><button type="button" class="profile-motion-button" data-profile-pause aria-pressed="false" aria-label="暂停动效" title="暂停动效"><span class="profile-pause-symbol" aria-hidden="true"></span><span class="profile-sr-only" data-profile-pause-label>暂停动效</span></button><button type="button" class="profile-motion-button profile-replay" data-profile-replay aria-label="重播动画" title="重播动画"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a8 8 0 1 1 .9 7M4 4v6h6"/></svg></button></div>
          <button class="profile-next" type="button" data-go="2"><span>02</span><strong>进入经验分享</strong><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12H20M14 6L20 12L14 18"/></svg></button>
        </footer>
        <p class="profile-sr-only" data-profile-announcement role="status" aria-live="polite" aria-atomic="true"></p>
      </div>
    </section>`;

  function mount(dialogElement) {
    if (!dialogElement) return function () {};
    const root = dialogElement;
    const cards = Array.from(root.querySelectorAll('[data-profile-card]'));
    const toggles = cards.map(card => card.querySelector('[data-profile-toggle]'));
    const pauseButton = root.querySelector('[data-profile-pause]');
    const pauseLabel = root.querySelector('[data-profile-pause-label]');
    const liveRegion = root.querySelector('[data-profile-announcement]');
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fineQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const listeners = [];
    const frames = new Set();
    const timers = new Set();
    const names = { local: '阿里巴巴', charging: '滴滴充电' };
    let userPaused = false;
    let disposed = false;
    let pointerFrame = null;
    let pointerTarget = null;
    let pointerX = 0;
    let pointerY = 0;
    let entryVersion = 0;
    let hoverTimer = null;
    let hoverCandidate = null;
    let lastMousePoint = null;
    let lastSelectionPoint = null;

    function listen(target, event, handler, options) {
      target.addEventListener(event, handler, options);
      listeners.push(() => target.removeEventListener(event, handler, options));
    }

    function listenQuery(query, handler) {
      if (query.addEventListener) listen(query, 'change', handler);
      else {
        query.addListener(handler);
        listeners.push(() => query.removeListener(handler));
      }
    }

    function frame(callback) {
      const id = window.requestAnimationFrame(() => {
        frames.delete(id);
        if (!disposed) callback();
      });
      frames.add(id);
      return id;
    }

    function clearTimers() {
      timers.forEach(id => window.clearTimeout(id));
      timers.clear();
      hoverTimer = null;
      hoverCandidate = null;
    }

    function cancelHoverIntent() {
      if (hoverTimer !== null) {
        window.clearTimeout(hoverTimer);
        timers.delete(hoverTimer);
      }
      hoverTimer = null;
      hoverCandidate = null;
    }

    function queueHoverIntent(card, event) {
      if (event.pointerType !== 'mouse' || !fineQuery.matches || document.hidden) return;
      lastMousePoint = { x: event.clientX, y: event.clientY };
      if (card.dataset.expanded === 'true') {
        cancelHoverIntent();
        return;
      }
      // Resizing an accordion can generate pointerenter without a real pointer move.
      // Require a little physical movement after a selection before accepting another.
      if (lastSelectionPoint && Math.hypot(lastMousePoint.x - lastSelectionPoint.x, lastMousePoint.y - lastSelectionPoint.y) < 4) return;
      if (hoverCandidate === card) return;
      cancelHoverIntent();
      hoverCandidate = card;
      const timeoutId = window.setTimeout(() => {
        timers.delete(timeoutId);
        hoverTimer = null;
        const candidate = hoverCandidate;
        hoverCandidate = null;
        if (disposed || !candidate || !lastMousePoint || !fineQuery.matches || document.hidden) return;
        const hit = document.elementFromPoint(lastMousePoint.x, lastMousePoint.y);
        if (hit && hit.closest('[data-profile-card]') === candidate) selectCard(candidate.dataset.profileCard, false);
      }, 90);
      hoverTimer = timeoutId;
      timers.add(timeoutId);
    }

    function playEntry(version) {
      if (disposed || version !== entryVersion) return;
      if (reducedQuery.matches) {
        root.classList.remove('profile-preparing', 'profile-restarting', 'profile-entering');
        return;
      }
      frame(() => frame(() => {
        if (version !== entryVersion) return;
        if (reducedQuery.matches) {
          root.classList.remove('profile-preparing', 'profile-restarting', 'profile-entering');
          return;
        }
        root.classList.add('profile-entering');
        root.classList.remove('profile-preparing', 'profile-restarting');
      }));
    }

    function prepareEntry(waitForFonts) {
      const version = ++entryVersion;
      clearTimers();
      root.classList.remove('profile-entering');
      if (reducedQuery.matches) {
        root.classList.remove('profile-preparing', 'profile-restarting');
        return;
      }
      root.classList.add('profile-preparing');
      if (!waitForFonts) {
        playEntry(version);
        return;
      }
      let finished = false;
      let timeoutId;
      function fontsSettled() {
        if (finished) return;
        finished = true;
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
          timers.delete(timeoutId);
        }
        if (!disposed && version === entryVersion) playEntry(version);
      }
      timeoutId = window.setTimeout(fontsSettled, 700);
      timers.add(timeoutId);
      // A missing or stalled FontFaceSet never leaves the page hidden indefinitely.
      if (document.fonts && document.fonts.ready) Promise.resolve(document.fonts.ready).then(fontsSettled, fontsSettled);
      else fontsSettled();
    }

    function resetParallax() {
      pointerTarget = null;
      cards.forEach(card => {
        card.style.setProperty('--profile-pan-x', '0px');
        card.style.setProperty('--profile-pan-y', '0px');
      });
    }

    function updateMotion() {
      const reduced = reducedQuery.matches;
      root.dataset.profileReduced = String(reduced);
      root.dataset.profilePaused = String(userPaused || reduced || document.hidden);
      pauseButton.disabled = reduced;
      pauseButton.setAttribute('aria-pressed', String(userPaused));
      pauseLabel.textContent = reduced ? '已减少动效' : userPaused ? '继续动效' : '暂停动效';
      pauseButton.setAttribute('aria-label', pauseLabel.textContent);
      pauseButton.title = pauseLabel.textContent;
      if (userPaused || reduced || document.hidden || !fineQuery.matches) resetParallax();
      if (document.hidden || !fineQuery.matches) cancelHoverIntent();
      if (reduced) root.classList.remove('profile-preparing', 'profile-restarting');
    }

    function selectCard(key, announce) {
      cancelHoverIntent();
      if (lastMousePoint) lastSelectionPoint = { x: lastMousePoint.x, y: lastMousePoint.y };
      cards.forEach(card => {
        const selected = card.dataset.profileCard === key;
        const button = card.querySelector('[data-profile-toggle]');
        const detail = card.querySelector('.profile-card-detail');
        card.dataset.expanded = String(selected);
        button.setAttribute('aria-expanded', String(selected));
        button.querySelectorAll('[data-profile-toggle-label]').forEach(label => {
          label.textContent = selected ? '正在查看' : '查看经历';
        });
        button.setAttribute('aria-label', '查看' + names[card.dataset.profileCard] + '经历');
        detail.setAttribute('aria-hidden', String(!selected));
      });
      if (announce) liveRegion.textContent = '已展开' + names[key] + '经历。';
    }

    function replay() {
      userPaused = false;
      resetParallax();
      selectCard('charging', false);
      updateMotion();
      root.classList.add('profile-restarting');
      prepareEntry(false);
      liveRegion.textContent = reducedQuery.matches ? '已重置经历卡片。' : '已重新播放页面动效。';
    }

    listen(root, 'click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const toggle = target.closest('[data-profile-toggle]');
      if (toggle && root.contains(toggle)) {
        const key = toggle.dataset.profileToggle;
        selectCard(key, true);
        return;
      }
      if (target.closest('[data-profile-pause]')) {
        if (!reducedQuery.matches) {
          userPaused = !userPaused;
          updateMotion();
        }
        return;
      }
      if (target.closest('[data-profile-replay]')) {
        replay();
        return;
      }
      const card = target.closest('[data-profile-card]');
      if (card && root.contains(card)) selectCard(card.dataset.profileCard, true);
    });

    listen(root, 'keydown', event => {
      const index = toggles.indexOf(event.target);
      if (index < 0) return;
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % toggles.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + toggles.length) % toggles.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = toggles.length - 1;
      else return;
      event.preventDefault();
      event.stopPropagation();
      toggles[next].focus({ preventScroll: true });
      selectCard(toggles[next].dataset.profileToggle, true);
    });

    listen(root, 'pointermove', event => {
      if (event.pointerType === 'mouse' && fineQuery.matches) lastMousePoint = { x: event.clientX, y: event.clientY };
    }, { passive: true });

    cards.forEach(card => {
      listen(card, 'pointerenter', event => queueHoverIntent(card, event));
      listen(card, 'pointermove', event => {
        queueHoverIntent(card, event);
        if (event.pointerType !== 'mouse' || !fineQuery.matches || userPaused || reducedQuery.matches || document.hidden) return;
        const bounds = card.getBoundingClientRect();
        pointerTarget = card;
        pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
        pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
        if (pointerFrame !== null) return;
        pointerFrame = frame(() => {
          pointerFrame = null;
          if (!pointerTarget) return;
          pointerTarget.style.setProperty('--profile-pan-x', pointerX.toFixed(2) + 'px');
          pointerTarget.style.setProperty('--profile-pan-y', pointerY.toFixed(2) + 'px');
        });
      }, { passive: true });
      listen(card, 'pointerleave', () => {
        if (hoverCandidate === card) cancelHoverIntent();
        card.style.setProperty('--profile-pan-x', '0px');
        card.style.setProperty('--profile-pan-y', '0px');
        if (pointerTarget === card) pointerTarget = null;
      });
    });

    listen(document, 'visibilitychange', updateMotion);
    listenQuery(reducedQuery, updateMotion);
    listenQuery(fineQuery, updateMotion);
    selectCard('charging', false);
    updateMotion();
    prepareEntry(true);

    return function cleanup() {
      if (disposed) return;
      disposed = true;
      entryVersion += 1;
      listeners.forEach(remove => remove());
      clearTimers();
      frames.forEach(id => window.cancelAnimationFrame(id));
      frames.clear();
      pointerFrame = null;
      resetParallax();
      root.classList.remove('profile-entering', 'profile-restarting', 'profile-preparing');
    };
  }

  window.PresenterProfile = { html, mount, sceneHTML, sceneSelector, sceneBaseSize, sceneScale };
}());
