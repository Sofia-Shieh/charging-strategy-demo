/* Shared decision-making and the next city: conceptual workflows, not live data. */
(() => {
  'use strict';
  const registry = window.DECK_ENHANCEMENTS ||= {};
  const svg = (body, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const pauseIcon = svg('<path d="M8 5v14M16 5v14"/>');
  const playIcon = svg('<path d="m8 5 11 7-11 7Z"/>');
  const replayIcon = svg('<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>');
  const steps = [
    {name:'市场判断',out:'阶段目标',middle:'统一供需口径、阶段框架与比较方法。',city:'补充本地场站、竞争格局与需求变化。',rule:'先对齐同一张市场底盘，再判断城市处于什么阶段。',label:'同一口径'},
    {name:'策略配置',out:'行动清单',middle:'沉淀分层定价、生命周期与营销模板。',city:'结合商户和用户情况，调整可执行的策略组合。',rule:'规则给出选择范围，现场信息决定策略如何落地。',label:'同一目标'},
    {name:'异常处置',out:'问题闭环',middle:'通过看板发现异常，提供关联指标与定位路径。',city:'核实设备、商户、价格与体验问题，推进处理。',rule:'把数据信号与现场事实连起来，避免只用补贴处理异常。',label:'同一问题'},
    {name:'效果复盘',out:'更新规则',middle:'统一观察窗口与效果评价，沉淀验证有效的规则。',city:'反馈执行结果、例外情况，以及新出现的约束。',rule:'结果回到规则，下一座城市就有更清晰的判断起点。',label:'同一窗口'}
  ];
  const controls = key => `<div class="cc-controls"><button type="button" data-${key}-pause aria-label="暂停动效" title="暂停动效" aria-pressed="false">${pauseIcon}</button><button type="button" data-${key}-replay aria-label="重播动效" title="重播动效">${replayIcon}</button></div>`;
  const collabHTML = `<div class="report-head cc-head"><span class="report-kicker">14 / WORK BETTER TOGETHER</span><h1>中台与城市，共同完成<em>策略验证。</em></h1><p class="report-deck">一套方法连接两个视角，让现场反馈成为下一轮策略的依据。</p></div>
    <div class="cc-root" data-cc-root>
      <div class="cc-board">
        <nav class="cc-topics" aria-label="选择协同事项">${steps.map((s,i)=>`<button type="button" data-cc-step="${i}" aria-pressed="${i===0}"><span class="cc-topic-index">0${i+1}</span><span><strong>${s.name}</strong><small>${s.out}</small></span><i aria-hidden="true"></i></button>`).join('')}</nav>
        <div class="cc-dispatch">
          <div class="cc-dispatch-caption"><span>两侧协同 · 一份共同产出</span><span class="cc-counter" data-cc-count>01 / 04</span></div>
          <div class="cc-roles">
            <article class="cc-role cc-platform"><div class="cc-role-label"><span>PLATFORM</span><i aria-hidden="true"></i></div><h2>中台</h2><span class="cc-role-tag">统一与支持</span><div class="cc-copy-stack">${steps.map((s,i)=>`<p data-cc-middle="${i}"${i?' hidden':''}>${s.middle}</p>`).join('')}</div><div class="cc-role-base"><span>方法</span><span>规则</span><span>工具</span></div></article>
            <div class="cc-joint" aria-label="共同产出"><span class="cc-joint-label">共同产出</span><div class="cc-output-stack">${steps.map((s,i)=>`<strong data-cc-output="${i}"${i?' hidden':''}>${s.out}</strong>`).join('')}</div><svg viewBox="0 0 180 76" aria-hidden="true"><path class="cc-wire" d="M0 38H43L65 16H115L137 38H180M0 38H43L65 60H115L137 38H180"/><path class="cc-packet" d="M0 38H43L65 16H115L137 38H180"/><circle cx="90" cy="38" r="5"/></svg><small data-cc-common>同一口径</small></div>
            <article class="cc-role cc-city"><div class="cc-role-label"><span>CITY</span><i aria-hidden="true"></i></div><h2>城市</h2><span class="cc-role-tag">现场与执行</span><div class="cc-copy-stack">${steps.map((s,i)=>`<p data-cc-city="${i}"${i?' hidden':''}>${s.city}</p>`).join('')}</div><div class="cc-role-base"><span>场站</span><span>商户</span><span>用户</span></div></article>
          </div>
          <div class="cc-shared-rule"><i aria-hidden="true"></i><p data-cc-rule>${steps[0].rule}</p></div>
        </div>
      </div>
      <section class="cc-feedback" aria-label="一次反馈示例"><div class="cc-feedback-intro"><span>FEEDBACK IN PRACTICE</span><h3>一次现场反馈，<br>改变动作顺序。</h3></div><div class="cc-feedback-step"><small>01 / 原判断</small><p>需求偏低</p><span>计划通过补贴拉动</span></div><div class="cc-feedback-step"><small>02 / 现场核实</small><p>设备限制了转化</p><span>需求未必是首要问题</span></div><div class="cc-feedback-step cc-feedback-result"><small>03 / 共同调整</small><p>先修复有效供给</p><span>再验证需求策略</span></div></section>
      <div class="cc-bottom"><p>计划、执行、监测、反馈，放在同一观察周期内验证。点击左侧事项可固定讲解。</p>${controls('cc')}</div>
      <div class="cc-print-detail">${steps.map(s=>`<article><h3>${s.name} · ${s.out}</h3><p>中台：${s.middle}</p><p>城市：${s.city}</p></article>`).join('')}</div>
    </div>`;

  const principles = [
    {title:'看清供需',en:'UNDERSTAND',copy:'统一市场口径，盘点有效供给与真实需求，明确平台位置和优先机会。'},
    {title:'匹配阶段',en:'MATCH',copy:'把城市、区块、人群与场站所处阶段，转化为价格、运营和资源投入组合。'},
    {title:'持续验证',en:'VALIDATE',copy:'以健康度监测和经营复盘校准策略，用数据、规则与工具积累可复用经验。'}
  ];
  const questions = [
    {name:'市场判断',text:'先核对供需份额与有效覆盖：我们找到的，是真正的优先机会吗？'},
    {name:'价格策略',text:'在同人群、同时段、同优惠口径下，价格是否兼顾竞争力与收益？'},
    {name:'用户与商户运营',text:'策略是否对应生命周期阶段，带来了可持续使用与单枪收益？'}
  ];
  const cityGraphic = `<svg class="cv-city" viewBox="0 0 500 238" aria-hidden="true"><defs><pattern id="cv-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#deded9" stroke-width=".6"/></pattern></defs><rect x="0" y="0" width="500" height="238" fill="url(#cv-grid)"/><g class="cv-city-blocks" fill="#fff" stroke="#bbbdb7" stroke-width="1"><path d="m82 111 40-22 42 22v51l-42 24-40-24Z"/><path d="m177 62 38-22 42 22v77l-42 24-38-24Z"/><path d="m300 101 36-21 39 21v44l-39 23-36-23Z"/><path d="m355 43 32-18 34 18v35l-34 20-32-20Z"/><path d="m221 171 32-18 34 18v30l-34 19-32-19Z"/><path d="m82 111 40 24 42-24m-42 24v51m55-124 38 23 42-23m-42 23v78m85-62 36 23 39-23m-39 23v44m19-125 32 20 34-20m-34 20v35m-166 73 32 19 34-19m-34 19v30"/></g><g class="cv-connections" fill="none" stroke="#ff6800" stroke-width="1.4"><path d="M122 186h45l48-23h55l66 5 51-70"/><path d="M215 163v30h38v27"/></g><g class="cv-moving" fill="none" stroke="#ff6800" stroke-width="3"><path d="M122 186h45l48-23h55l66 5 51-70"/></g><circle class="cv-city-pulse" cx="215" cy="163" r="23" fill="none" stroke="#ff6800"/><circle cx="215" cy="163" r="7" fill="#ff6800"/><g fill="#fff" stroke="#ff6800" stroke-width="2"><circle cx="122" cy="186" r="4"/><circle cx="336" cy="168" r="4"/><circle cx="387" cy="98" r="4"/><circle cx="253" cy="220" r="4"/></g><path d="M16 20h14m-7-7v14M470 215h14m-7-7v14" stroke="#171717"/><text x="22" y="218" fill="#8b8b86" font-size="9" letter-spacing="1.5">ONE CITY / ONE LEARNING LOOP</text></svg>`;
  const closingHTML = `<div class="report-head cv-head"><span class="report-kicker">15 / FROM EXPERIENCE TO WHAT’S NEXT</span><h1>从一座城市开始，<em>验证下一步。</em></h1><p class="report-deck">先统一判断，再持续验证。让一线经验，成为可复用的运营方法。</p></div>
    <div class="cv-root" data-cv-root>
      <div class="cv-composition"><section class="cv-city-panel"><div class="cv-city-title"><span class="cv-one">01<span>座城市</span></span><p>一个试点，<br>一轮完整验证。</p></div>${cityGraphic}<span class="cv-city-caption">选定试点与观察窗口，建立可比较的起点。</span></section><div class="cv-principles">${principles.map((p,i)=>`<article class="cv-principle${i===0?' is-active':''}" data-cv-principle="${i}"><span class="cv-principle-no">0${i+1}</span><div><h2>${p.title}<small>${p.en}</small></h2><p>${p.copy}</p></div><i aria-hidden="true"></i></article>`).join('')}</div></div>
      <div class="cv-runway" aria-label="试点验证路径"><span class="cv-runway-label">把方法带回现场</span><div><span><b>01</b>对齐基线与目标</span><span><b>02</b>配置可验证动作</span><span><b>03</b>复盘订单 · 份额 · 收益 · 成本</span><span class="cv-runway-end">扩展 / 调整</span></div></div>
      <section class="cv-discussion"><div class="cv-discussion-prompt"><span>LET’S TALK</span><h2>最优先验证什么？</h2></div><div class="cv-discussion-options"><div class="cv-question-tabs" role="group" aria-label="选择讨论方向">${questions.map((q,i)=>`<button type="button" data-cv-question="${i}" aria-pressed="${i===0}">${q.name}</button>`).join('')}</div><p data-cv-question-text>${questions[0].text}</p></div></section>
      <div class="cv-footer"><span>THANK YOU · 让经验产生下一次行动。</span><div class="cv-actions"><button type="button" class="cv-overview" data-action="overview">回顾全部页面 ${svg('<rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/>')}</button><button type="button" data-go="0">回到开场</button>${controls('cv')}</div></div>
    </div>`;

  function autoplay(host, key, count, interval, apply) {
    const query=matchMedia('(prefers-reduced-motion: reduce)');
    const pause=host.querySelector(`[data-${key}-pause]`), replay=host.querySelector(`[data-${key}-replay]`);
    let selected=0, running=!query.matches, timer=0, disposed=false, printing=false;
    function stop(){clearTimeout(timer);timer=0;}
    function sync(){
      stop();
      const active=running&&!query.matches&&!document.hidden&&!printing&&!disposed;
      host.classList.toggle('cc-motion-paused',!active);
      pause.innerHTML=running?pauseIcon:playIcon;
      pause.setAttribute('aria-label',query.matches?'已开启减少动态效果':running?'暂停自动演示':'继续自动演示');
      pause.title=query.matches?'已开启减少动态效果':running?'暂停自动演示':'继续自动演示';
      pause.setAttribute('aria-pressed',String(!running));
      pause.disabled=query.matches;
      if(active)timer=setTimeout(()=>{selected=(selected+1)%count;apply(selected);sync();},interval);
    }
    function select(i, fixed=true){selected=i;apply(selected);if(fixed)running=false;sync();}
    function clickPause(){running=!running;sync();}
    function clickReplay(){running=!query.matches;selected=0;apply(0);host.classList.remove('cc-replaying');void host.offsetWidth;host.classList.add('cc-replaying');sync();}
    function motionChange(){running=!query.matches;sync();}
    function beforePrint(){printing=true;sync();}
    function afterPrint(){printing=false;sync();}
    pause.addEventListener('click',clickPause);replay.addEventListener('click',clickReplay);
    document.addEventListener('visibilitychange',sync);query.addEventListener('change',motionChange);
    window.addEventListener('beforeprint',beforePrint);window.addEventListener('afterprint',afterPrint);
    apply(0);sync();
    return {select,dispose(){disposed=true;stop();pause.removeEventListener('click',clickPause);replay.removeEventListener('click',clickReplay);document.removeEventListener('visibilitychange',sync);query.removeEventListener('change',motionChange);window.removeEventListener('beforeprint',beforePrint);window.removeEventListener('afterprint',afterPrint);}};
  }
  registry[14]={title:'中台与城市，共同完成策略验证',html:collabHTML,mount(root){
    const host=root.querySelector('[data-cc-root]');if(!host)return()=>{};
    const buttons=[...host.querySelectorAll('[data-cc-step]')];
    const player=autoplay(host,'cc',steps.length,5800,i=>{
      buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
      ['middle','city','output'].forEach(key=>host.querySelectorAll(`[data-cc-${key}]`).forEach((el,j)=>{el.hidden=j!==i;}));
      host.querySelector('[data-cc-count]').textContent=`0${i+1} / 04`;
      host.querySelector('[data-cc-common]').textContent=steps[i].label;
      host.querySelector('[data-cc-rule]').textContent=steps[i].rule;
      host.dataset.ccStep=String(i);
    });
    const listeners=buttons.map((b,i)=>{const fn=()=>player.select(i);b.addEventListener('click',fn);return()=>b.removeEventListener('click',fn);});
    return()=>{player.dispose();listeners.forEach(fn=>fn());};
  }};
  registry[15]={title:'从一座城市开始，验证下一步',html:closingHTML,mount(root){
    const host=root.querySelector('[data-cv-root]');if(!host)return()=>{};
    const principles=[...host.querySelectorAll('[data-cv-principle]')];
    const player=autoplay(host,'cv',principles.length,3700,i=>principles.forEach((el,j)=>el.classList.toggle('is-active',j===i)));
    const buttons=[...host.querySelectorAll('[data-cv-question]')];
    const listeners=buttons.map((b,i)=>{const fn=()=>{buttons.forEach((el,j)=>el.setAttribute('aria-pressed',String(i===j)));const text=host.querySelector('[data-cv-question-text]');text.textContent=questions[i].text;text.classList.remove('is-revealing');void text.offsetWidth;text.classList.add('is-revealing');};b.addEventListener('click',fn);return()=>b.removeEventListener('click',fn);});
    return()=>{player.dispose();listeners.forEach(fn=>fn());};
  }};
})();
