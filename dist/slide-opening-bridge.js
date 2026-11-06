/* A city charging network becomes a working perspective: three operating questions. */
(() => {
  'use strict';
  const point = (u, v, height = 0) => [260 + (u - v) * .98, 145 + (u + v) * .43 - height];
  const polygon = points => points.map(p => p.join(',')).join(' ');
  const line = points => points.map((p, i) => `${i ? 'L' : 'M'}${point(...p).join(' ')}`).join(' ');
  const buildings = [
    [-77, -77, 24, 24, 17], [-39, -78, 20, 25, 11],
    [-80, 38, 23, 22, 12], [-79, 79, 23, 24, 8],
    [77, -79, 24, 22, 19], [79, 39, 22, 22, 11],
    [77, 79, 23, 25, 15], [39, 79, 20, 23, 8]
  ].map(([u, v, w, d, h], i) => {
    const base = [[u-w/2,v-d/2],[u+w/2,v-d/2],[u+w/2,v+d/2],[u-w/2,v+d/2]].map(p => point(...p));
    const roof = base.map(([x,y]) => [x,y-h]);
    return `<g class="network-building" style="--building-delay:${i * 80}ms"><polygon class="network-building-side" points="${polygon([roof[1],roof[2],base[2],base[1]])}"/><polygon class="network-building-front" points="${polygon([roof[2],roof[3],base[3],base[2]])}"/><polygon class="network-building-roof" points="${polygon(roof)}"/><path class="network-building-detail" d="M${roof[2][0]} ${roof[2][1]}V${base[2][1]} M${roof[1][0]} ${roof[1][1]+h*.55}L${roof[2][0]} ${roof[2][1]+h*.55}L${roof[3][0]} ${roof[3][1]+h*.55}"/></g>`;
  }).join('');
  const roads = [-108,-72,-36,0,36,72,108].map(n => `<path d="${line([[-108,n],[108,n]])} ${line([[n,-108],[n,108]])}"/>`).join('');
  const routes = [
    [[-72,-12],[-36,-12],[-36,0],[-18,0]],
    [[12,-72],[12,-36],[0,-36],[0,-18]],
    [[72,-12],[36,-12],[36,0],[18,0]],
    [[12,72],[12,36],[0,36],[0,18]]
  ].map((path,i) => `<path class="network-route-base" d="${line(path)}"/><path class="network-route-flow" pathLength="100" style="--flow-delay:${i * -1.15}s" d="${line(path)}"/>`).join('');
  const demandRoutes = [
    [[-108,36],[-72,36],[-72,-12]],
    [[-36,-108],[12,-108],[12,-72]],
    [[108,-36],[72,-36],[72,-12]],
    [[36,108],[12,108],[12,72]]
  ].map((path,i) => `<path class="network-demand-path" d="${line(path)}"/><path class="network-demand-flow" pathLength="100" style="--flow-delay:${i * -.85}s" d="${line(path)}"/>`).join('');
  const stations = [[-72,-12],[12,-72],[72,-12],[12,72]].map(([u,v],i) => {
    const [x,y] = point(u,v);
    return `<g class="network-station" style="--node-delay:${i * -.9}s" transform="translate(${x} ${y})"><ellipse class="network-station-halo" cy="3" rx="18" ry="8"/><path class="network-station-pad" d="M0 -5L14 2L0 9L-14 2Z"/><path class="network-station-tower" d="M-5 -20H4L8 -17V1L4 3H-5Z"/><path class="network-station-edge" d="M4 -20V3M4 -16H-2M8 -17L4 -16"/><path class="network-station-bolt" d="M1 -13L-2 -8H1L-1 -4"/><circle class="network-station-led" cx="-.5" cy="-17" r="1"/></g>`;
  }).join('');
  const demands = [[-108,36],[-36,-108],[108,-36],[36,108]].map(([u,v],i) => {
    const [x,y] = point(u,v);
    return `<g class="network-demand-node" style="--node-delay:${i * -1.2}s" transform="translate(${x} ${y})"><ellipse class="network-demand-ring" rx="11" ry="5"/><circle class="network-demand-light" r="2.4"/><path d="M-6 8H6"/></g>`;
  }).join('');
  const networkHTML = `<div class="opening-network" data-network-phase="0" data-network-motion="paused" aria-label="城市充电网络概念示意：场站连接需求，经营信号汇入中心并反馈">
    <div class="network-label"><span><i></i>CITY CHARGING NETWORK</span><span data-network-status>供给连接</span></div>
    <svg class="network-map" viewBox="0 0 520 292" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path class="network-ground-edge" d="M260 55L472 148L260 241L48 148"/>
      <polygon class="network-ground" points="260,52 472,145 260,238 48,145"/>
      <g class="network-roads">${roads}</g>
      <path class="network-main-road" d="${line([[-108,0],[108,0]])} ${line([[0,-108],[0,108]])}"/>
      <g class="network-city">${buildings}</g>
      <g class="network-demand-routes">${demandRoutes}</g>
      <g class="network-supply-routes">${routes}</g>
      <g class="network-demand-nodes">${demands}</g>
      <g class="network-stations">${stations}</g>
      <g class="network-operations">
        <ellipse class="network-feedback-ring network-feedback-ring-a" cx="260" cy="146" rx="46" ry="20"/>
        <ellipse class="network-feedback-ring network-feedback-ring-b" cx="260" cy="146" rx="46" ry="20"/>
        <path class="network-hub-base" d="M260 126L301 144L260 162L219 144Z"/>
        <path class="network-hub-lower" d="M242 136L260 144L278 136V151L260 159L242 151Z"/>
        <path class="network-hub-top" d="M260 128L278 136L260 144L242 136Z"/>
        <path class="network-hub-edge" d="M260 144V159M248 143L255 146M265 146L272 143"/>
        <path class="network-hub-mark" d="M254 134L260 131L266 134L260 137Z"/>
        <circle class="network-hub-beacon" cx="260" cy="119" r="2"/>
        <path class="network-hub-stem" d="M260 123V128"/>
      </g>
      <g class="network-cartography"><path d="M29 71V56H44M476 56H491V71M29 221V236H44M476 236H491V221"/><path d="M34 145H42M478 145H486M260 43V47M260 245V249"/></g>
    </svg>
    <div class="network-caption"><span>场站 <i>·</i> 需求 <i>·</i> 运营反馈</span><span>概念示意</span></div>
  </div>`;

  function mountNetwork(container) {
    const root = container?.matches?.('.opening-network') ? container : container?.querySelector('.opening-network');
    if (!root) return () => {};
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const labels = ['供给连接', '需求流动', '经营反馈'];
    const status = root.querySelector('[data-network-status]');
    let phase = 0, timer = null, disposed = false;
    const setPhase = value => {
      phase = value;
      root.dataset.networkPhase = String(value);
      if (status) status.textContent = labels[value];
    };
    function stop() { clearTimeout(timer); timer = null; }
    function advance() {
      if (disposed || !root.isConnected) { cleanup(); return; }
      setPhase((phase + 1) % 3);
      timer = setTimeout(advance, 3400);
    }
    function sync() {
      stop();
      const moving = !disposed && !document.hidden && !query.matches;
      root.dataset.networkMotion = moving ? 'playing' : 'paused';
      if (query.matches) setPhase(2);
      if (moving) timer = setTimeout(advance, 3400);
    }
    function cleanup() {
      if (disposed) return;
      disposed = true; stop();
      root.dataset.networkMotion = 'paused';
      document.removeEventListener('visibilitychange', sync);
      query.removeEventListener('change', sync);
    }
    document.addEventListener('visibilitychange', sync);
    query.addEventListener('change', sync);
    setPhase(0); sync();
    return cleanup;
  }
  window.OpeningNetwork = { html: networkHTML, mount: mountNetwork };
  const metrics = [
    {
      number: '01', label: 'VOLUME', title: '订单',
      icon: '<path d="M4 17V12M10 17V8M16 17V4M3 21H21"/><path d="M15 5H20V10"/>',
      question: '用户是否持续选择平台？',
      description: '拆分新客、复购与频次，区分市场自然增长和运营动作带来的变化。',
      takeaway: '看增长来源，也看后续留存。'
    },
    {
      number: '02', label: 'SHARE', title: '份额',
      icon: '<circle cx="12" cy="12" r="8"/><path d="M12 4V12L18 17M12 12H20"/>',
      question: '平台在当地处于什么位置？',
      description: '对齐城市与区块的供给、需求份额，判断是覆盖不足，还是需求承接不足。',
      takeaway: '份额变化要放回大盘比较。'
    },
    {
      number: '03', label: 'PROFIT', title: '利润',
      icon: '<path d="M4 18L9 13L13 16L21 6M15 6H21V12"/><path d="M4 6H9M6.5 3.5V8.5"/>',
      question: '现有增长能否长期维持？',
      description: '结合价格、平台补贴与商户共担，观察订单增长对应的经营贡献。',
      takeaway: '提价与补贴都要看持续效果。'
    }
  ];
  const html = `<div class="opening-bridge">
    <div class="opening-top">
      <figure class="opening-scene" aria-label="城市充电网络动态概念图">${networkHTML}</figure>
      <header class="opening-statement">
        <div class="opening-kicker opening-reveal" style="--opening-order:0">01 / THE OPERATING QUESTION</div>
        <h1 class="opening-reveal" style="--opening-order:1">增长，要有<em>质量。</em></h1>
        <p class="opening-premise opening-reveal" style="--opening-order:2">从一次充电，看到一座城市的经营。</p>
        <p class="opening-description opening-reveal" style="--opening-order:3">订单、份额、利润一起看，<br>才能知道增长来自哪里、能否持续。</p>
        <div class="opening-thread opening-reveal" style="--opening-order:4"><span>城市实践</span><i>→</i><span>共同判断</span><i>→</i><b>中台方法</b></div>
      </header>
    </div>
    <div class="opening-metrics">${metrics.map((item, index) => `<article class="opening-metric opening-reveal" style="--opening-order:${5 + index}">
      <div class="opening-metric-heading"><span class="opening-metric-index">${item.number} / ${item.label}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.icon}</svg></div>
      <h2>${item.title}<span>${item.question}</span></h2>
      <p>${item.description}</p>
      <div class="opening-takeaway"><i></i>${item.takeaway}</div>
    </article>`).join('')}</div>
    <div class="opening-experience opening-reveal" style="--opening-order:8">
      <div class="opening-years"><strong>4<span>年＋</span></strong><small>城市策略运营实践</small></div>
      <div class="opening-outcome"><strong>劣势阶段 <i>↗</i> 进阶阶段</strong><span>为平台订单增长与城市份额负责</span></div>
      <div class="opening-outcome"><strong>亏损 <i>↗</i> 盈利</strong><span>持续校准价格、投入与经营效率</span></div>
    </div>
    <div class="opening-method opening-reveal" style="--opening-order:9"><span>中台的价值</span><p>把一线判断，沉淀为<strong>可比较的数据、可选择的策略、可验证的执行规则。</strong></p></div>
  </div>`;

  function mount(slide) {
    if (!slide) return () => {};
    slide.classList.add('opening-slide');
    const cleanupNetwork = mountNetwork(slide);
    return () => {
      cleanupNetwork();
      slide.classList.remove('opening-slide');
    };
  }
  window.DECK_ENHANCEMENTS = window.DECK_ENHANCEMENTS || {};
  window.DECK_ENHANCEMENTS[1] = { title: '增长，要有质量', html, mount };
})();
