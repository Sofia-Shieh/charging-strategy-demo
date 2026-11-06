/* Tool capability concept. Interface previews do not represent deployed software. */
(() => {
  const registry = window.DECK_ENHANCEMENTS ||= {};
  const icons = {
    data: '<path d="M5 30V17h6v13m6 0V9h6v21m6 0V3h6v27M3 35h34"/>',
    configure: '<path d="M9 4v30M20 4v30M31 4v30"/><rect x="5" y="11" width="8" height="8" rx="2"/><rect x="16" y="23" width="8" height="8" rx="2"/><rect x="27" y="7" width="8" height="8" rx="2"/>',
    report: '<path d="M9 3h16l8 8v24H7V3h2m16 0v9h8M13 19h14m-14 6h11"/><path d="m23 28 3 3 6-7"/>',
    source: '<ellipse cx="20" cy="8" rx="14" ry="5"/><path d="M6 8v22c0 7 28 7 28 0V8M6 19c0 7 28 7 28 0"/>'
  };
  const svg = key => `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>`;
  const capabilities = [
    {name:'查准数据',label:'数据看板',key:'data',copy:'大盘供需、新站表现、单站异动；按周、月、季、年联查订单、电量、价格与设备。',condition:'先统一指标口径，减少找数与对数。'},
    {name:'配准动作',label:'配置工具',key:'configure',copy:'定价查询、批量调价与营销设置，串联查询、测算和配置。',condition:'依赖可用接口；变更须可核对、可追溯。'},
    {name:'加快复盘',label:'AI 辅助分析',key:'report',copy:'整理材料、生成商户复盘、选址与经营报告草稿，让结论对应数据和规则。',condition:'AI 辅助产出，关键判断由业务核验。'}
  ];
  const dashboard = `<div class="wb-preview wb-dashboard" data-wb-preview="0">
    <div class="wb-view-title"><span>经营全景</span><small>示意界面 · 非实时数据</small></div>
    <div class="wb-scope"><span>全国</span><i>／</i><span>城市</span><i>／</i><span>区块</span><i>／</i><b>单站</b><small>周 · 月 · 季 · 年</small></div>
    <div class="wb-monitor"><div class="wb-monitor-label"><b>关联信号</b><span>从变化定位问题</span></div><div class="wb-signal-bars" aria-hidden="true">${[30,44,39,65,48,54,77,68,57,84,62,73,57,67,48,81,66,57,70,60,82,72,89,78].map((h,i)=>`<i style="--bar:${h}%;--delay:${i*30}ms"></i>`).join('')}<span class="wb-scan-line"></span></div><span class="wb-chart-caption">形态示意，无数值含义</span></div>
    <div class="wb-signal-types"><span>订单</span><span>电量</span><span>价格</span><span>设备</span></div>
    <div class="wb-view-foot"><span>供需盘点</span><span>新站跟踪</span><span>异常联查</span></div>
  </div>`;
  const configure = `<div class="wb-preview wb-configure" data-wb-preview="1" hidden>
    <div class="wb-view-title"><span>策略配置</span><small>示意流程 · 需内部接口支持</small></div>
    <div class="wb-command"><small>配置对象</small><strong>场站 <i>×</i> 时段 <i>×</i> 人群</strong><p>将经营规则，转成可核对的操作。</p></div>
    <div class="wb-command-flow" aria-label="查询、测算、核验、配置四个步骤"><span>查询</span><i>→</i><span>测算</span><i>→</i><span>核验</span><i>→</i><b>配置</b></div>
    <div class="wb-config-items"><span>定价查询</span><span>批量调价</span><span>营销设置</span></div>
    <div class="wb-config-review"><i>✓</i> 先核对，再应用 <span>变更留痕 · 可追溯</span></div>
  </div>`;
  const report = `<div class="wb-preview wb-report" data-wb-preview="2" hidden>
    <div class="wb-view-title"><span>AI 复盘助手</span><small>辅助草稿 · 业务核验</small></div>
    <div class="wb-report-composition"><div class="wb-report-inputs"><span>业务数据</span><span>经营规则</span><span>现场反馈</span></div><div class="wb-report-join" aria-hidden="true"><svg viewBox="0 0 110 162" preserveAspectRatio="none"><path d="M0 19C58 19 45 80 108 80M0 81H108M0 143C58 143 45 80 108 80"/></svg></div><div class="wb-report-sheet"><span>REPORT / 草稿</span><strong>让判断有依据。</strong><p><i>01</i> 数据来源</p><p><i>02</i> 规则依据</p><p><i>03</i> 待核验结论</p><b>业务复核 →</b></div></div>
    <div class="wb-report-outputs"><span>商户复盘</span><span>选址分析</span><span>经营报告</span></div>
  </div>`;
  const html = `<div class="report-head wb-head"><div class="report-kicker">13 / BUILD THE CAPABILITY</div><h1>把重复动作，交给<em>工具。</em></h1><p class="report-deck">数据看清、动作配准、复盘更快，把时间留给经营判断。</p></div>
    <div class="report-body wb-root" data-wb-root>
      <div class="wb-main">
        <section class="wb-workbench" aria-label="运营工具工作台概念预览" data-deck-no-swipe>
          <div class="wb-window-bar"><div><i></i><span>CHARGING / OPS</span></div><span>能力建设建议</span></div>
          <div class="wb-tabs" role="group" aria-label="选择工作台预览">${capabilities.map((c,i)=>`<button type="button" data-wb-tab="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${c.label}</button>`).join('')}</div>
          ${dashboard}${configure}${report}
        </section>
        <div class="wb-capabilities">${capabilities.map((c,i)=>`<article class="wb-capability${i===0?' is-active':''}" data-wb-capability="${i}"><div class="wb-capability-title"><span class="wb-capability-icon">${svg(c.key)}</span><h2><small>0${i+1}</small>${c.name}</h2></div><p>${c.copy}</p><span class="wb-condition">${c.condition}</span></article>`).join('')}</div>
      </div>
      <div class="wb-data-foundation"><span class="wb-source-icon">${svg('source')}</span><div><h3>外部数据校准 <small>共同的数据底座</small></h3><p>采买价格、电量数据补足市场覆盖，交叉核对竞争价格与全量电量估计。</p></div><span class="wb-source-check"><span>覆盖范围</span><span>更新时间</span><span>统计口径</span></span></div>
      <div class="wb-bottom"><p>界面为能力建设示意，非已上线系统。稳定数据、清晰规则与可用接口，是工具生效的前提。</p><div><button type="button" data-wb-pause aria-pressed="false">暂停预览 Ⅱ</button><button type="button" data-wb-replay>重播 ↻</button></div></div>
    </div>`;
  registry[13] = {title:'把重复动作，交给工具',html,mount(root){
    const host=root.querySelector('[data-wb-root]');
    if(!host)return()=>{};
    const tabs=[...host.querySelectorAll('[data-wb-tab]')],views=[...host.querySelectorAll('[data-wb-preview]')],cards=[...host.querySelectorAll('[data-wb-capability]')],pause=host.querySelector('[data-wb-pause]'),replay=host.querySelector('[data-wb-replay]'),query=matchMedia('(prefers-reduced-motion: reduce)');
    let index=0,playing=!query.matches,timer=0,disposed=false,printing=false;
    function paint(){tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));views.forEach((view,i)=>{view.hidden=i!==index;});cards.forEach((card,i)=>card.classList.toggle('is-active',i===index));host.dataset.wbMode=String(index);}
    function stop(){clearInterval(timer);timer=0;}
    function sync(){stop();const running=playing&&!query.matches&&!document.hidden&&!printing&&!disposed;host.classList.toggle('wb-paused',!running);pause.textContent=query.matches?'静态模式':playing?'暂停预览 Ⅱ':'继续预览 ▶';pause.disabled=query.matches;pause.setAttribute('aria-pressed',String(!playing));if(running)timer=setInterval(()=>{index=(index+1)%3;paint();},5200);}
    function click(event){const tab=event.target.closest('[data-wb-tab]');if(tab){index=Number(tab.dataset.wbTab);playing=false;paint();sync();}if(event.target.closest('[data-wb-pause]')){playing=!playing;sync();}if(event.target.closest('[data-wb-replay]')){index=0;playing=!query.matches;paint();sync();}}
    function changed(){playing=!query.matches;sync();}
    const beforePrint=()=>{printing=true;sync();},afterPrint=()=>{printing=false;sync();};
    host.addEventListener('click',click);document.addEventListener('visibilitychange',sync);query.addEventListener('change',changed);window.addEventListener('beforeprint',beforePrint);window.addEventListener('afterprint',afterPrint);paint();sync();
    return()=>{disposed=true;stop();host.removeEventListener('click',click);document.removeEventListener('visibilitychange',sync);query.removeEventListener('change',changed);window.removeEventListener('beforeprint',beforePrint);window.removeEventListener('afterprint',afterPrint);};
  }};
})();
