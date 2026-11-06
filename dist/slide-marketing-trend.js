/* Marketing evaluation: explanatory curves, never measured business results. */
(() => {
  const registry = window.DECK_ENHANCEMENTS ||= {};
  const phases = [
    {name:'活动前',verb:'校准基线',tag:'01 / BEFORE',title:'先对齐，再比较。',body:'统一人群、频次指标与时间窗口，观察参与人群和可比人群原有差异。',metric:'观察重点',value:'活动前的使用水平'},
    {name:'活动中',verb:'观察拉升',tag:'02 / DURING',title:'起量，也要看投入。',body:'关注参与人群的频次变化，同时记录平台补贴、商户让利与权益核销。',metric:'观察重点',value:'使用变化 × 双方成本'},
    {name:'活动后',verb:'追踪持续使用',tag:'03 / AFTER',title:'活动结束，效果还在吗？',body:'追踪后续使用、复购与续费；结合可比人群走势，判断是否值得持续投入。',metric:'复盘重点',value:'持续使用 × 留存 × 成本'}
  ];
  const scenarios = [
    ['新站冷启动','周边潜在人群','曝光推送＋首次体验价','初始电量、拉新与投入'],
    ['新客转复购','完成首单的新用户','多单折扣＋梯度激励','第二、三单与后续留存'],
    ['会员提频','活跃 / 潜在会员','会员价＋券包＋会员日','频次、续费和会员价值'],
    ['流失召回','按流失时长分层','回归特价＋定向召回券','回流率、持续使用与成本']
  ];
  const html = `<div class="report-head mt-head"><div class="report-kicker">12 / PURPOSEFUL MARKETING</div><h1>让每一场活动，都有<em>经营目标。</em></h1><p class="report-deck">营销承接城市阶段与生命周期；活动中的拉升，要和活动后的持续使用一起看。</p></div>
    <div class="report-body mt-root" data-mt-root>
      <div class="mt-framework" aria-label="营销设计的五步框架">${[['目标','解决什么问题'],['人群','明确触达对象'],['活动','匹配权益形式'],['成本','确定双方共担'],['效果','验证经营价值']].map((s,i)=>`<div><span>0${i+1}</span><b>${s[0]}</b><small>${s[1]}</small></div>`).join('')}</div>
      <section class="mt-chart-panel" aria-label="以会员提频为例的营销活动趋势示意" data-deck-no-swipe>
        <div class="mt-chart-main">
          <div class="mt-chart-heading"><div><span class="mt-example">以会员提频为例</span><h2>从短期拉升，到持续使用</h2></div><div class="mt-legend"><span><i></i>活动参与人群</span><span><i></i>可比人群</span></div></div>
          <div class="mt-axis-label">人均充电频次 · 同口径比较 <span>定性走势，非实测数据</span></div>
          <svg class="mt-chart" viewBox="0 0 880 218" preserveAspectRatio="none" role="img" aria-label="示意：活动前两组频次接近，活动中参与人群频次拉升，活动后回落但仍高于参照；这种差异不等于活动的因果效果。">
            <defs><linearGradient id="mt-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6800" stop-opacity=".22"/><stop offset="1" stop-color="#ff6800" stop-opacity=".015"/></linearGradient></defs>
            <rect class="mt-active-band" x="292" y="12" width="277" height="173" rx="6"/>
            <g class="mt-grid"><path d="M48 43H846M48 89H846M48 136H846M48 182H846"/><path d="M292 12V182M569 12V182"/></g>
            <text class="mt-axis-tick" x="21" y="45">高</text><text class="mt-axis-tick" x="21" y="180">低</text>
            <path class="mt-area" d="M48 160 C120 160 211 153 292 152 C348 150 365 51 437 47 S520 49 569 64 C622 96 654 112 712 116 S801 111 846 109 L846 182H48Z"/>
            <path class="mt-reference" d="M48 160 C134 158 207 157 292 154 S470 151 569 148 S750 144 846 139"/>
            <path class="mt-participant" data-mt-curve d="M48 160 C120 160 211 153 292 152 C348 150 365 51 437 47 S520 49 569 64 C622 96 654 112 712 116 S801 111 846 109" pathLength="1"/>
            <g class="mt-annotation"><path d="M437 40V16"/><text x="437" y="9" text-anchor="middle">活动期拉升</text><path d="M744 118V137"/><path d="M739 118H749M739 137H749"/><text x="756" y="132">观察差异</text></g>
            <g data-mt-cursor class="mt-cursor" transform="translate(846 109)"><path data-mt-guide d="M0 -97V73"/><circle r="11" class="mt-dot-halo"/><circle r="5" class="mt-dot"/></g>
            <g class="mt-x-labels"><text x="167" y="206" text-anchor="middle">活动前</text><text x="431" y="206" text-anchor="middle">活动中</text><text x="707" y="206" text-anchor="middle">活动后</text></g>
          </svg>
          <div class="mt-mobile-periods" aria-hidden="true"><span>活动前</span><span>活动中</span><span>活动后</span></div>
          <div class="mt-phase-tabs" role="group" aria-label="查看营销活动阶段">${phases.map((p,i)=>`<button type="button" data-mt-phase="${i}" aria-pressed="${i===2}"><span>0${i+1}</span>${p.verb}<i>↗</i></button>`).join('')}</div>
        </div>
        <aside class="mt-insight"><span class="mt-phase-tag" data-mt-tag>${phases[2].tag}</span><h2 data-mt-title>${phases[2].title}</h2><p data-mt-copy>${phases[2].body}</p><div class="mt-observe"><small data-mt-metric>${phases[2].metric}</small><b data-mt-value>${phases[2].value}</b></div><div class="mt-controls"><button type="button" data-mt-pause aria-pressed="false">暂停演示 Ⅱ</button><button type="button" data-mt-replay>重播 ↻</button></div></aside>
      </section>
      <div class="mt-scenarios">${scenarios.map((s,i)=>`<article class="${i===2?'mt-scenario-member':''}"><h3><span>0${i+1}</span>${s[0]}${i===2?'<small>图示场景</small>':''}</h3><p class="mt-audience">${s[1]}</p><p class="mt-offer">${s[2]}</p><div><span>评价</span><b>${s[3]}</b></div></article>`).join('')}</div>
      <p class="mt-note"><b>复盘原则</b> 曲线仅为示例情形；观察差异不等于因果增量，需结合双方成本、后续留存与可比性验证。</p>
    </div>`;
  registry[12] = {title:'让每一场活动，都有经营目标',html,mount(root){
    const host=root.querySelector('[data-mt-root]'),curve=host.querySelector('[data-mt-curve]'),cursor=host.querySelector('[data-mt-cursor]'),guide=host.querySelector('[data-mt-guide]');
    const pause=host.querySelector('[data-mt-pause]'),buttons=[...host.querySelectorAll('[data-mt-phase]')],reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const total=curve.getTotalLength(),duration=16500;
    let progress=0,paused=false,frame=0,last=0,selected=-1,disposed=false,printing=false;
    function paint(){
      const point=curve.getPointAtLength(total*progress);
      cursor.setAttribute('transform',`translate(${point.x} ${point.y})`);guide.setAttribute('d',`M0 ${12-point.y}V${182-point.y}`);
      const next=point.x<292?0:point.x<569?1:2;
      if(next!==selected){selected=next;const p=phases[next];buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===next)));for(const [sel,key] of [['tag','tag'],['title','title'],['copy','body'],['metric','metric'],['value','value']])host.querySelector('[data-mt-'+sel+']').textContent=p[key];}
    }
    function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
    function tick(now){if(disposed)return;if(last)progress=Math.min(1,progress+(now-last)/duration);last=now;paint();if(progress>=1){paused=true;sync();return;}frame=requestAnimationFrame(tick);}
    function sync(){stop();host.classList.toggle('mt-paused',paused||reduce.matches||document.hidden||printing);pause.textContent=reduce.matches?'静态模式':paused?'继续演示 ▶':'暂停演示 Ⅱ';pause.setAttribute('aria-pressed',String(paused));pause.disabled=reduce.matches;if(!disposed&&!paused&&!reduce.matches&&!document.hidden&&!printing)frame=requestAnimationFrame(tick);}
    function selectPhase(index){const target=[178,434,752][index];let lo=0,hi=total;for(let i=0;i<24;i++){const mid=(lo+hi)/2;curve.getPointAtLength(mid).x<target?lo=mid:hi=mid;}progress=(lo+hi)/2/total;paused=true;paint();sync();}
    function click(event){const tab=event.target.closest('[data-mt-phase]');if(tab)selectPhase(Number(tab.dataset.mtPhase));if(event.target.closest('[data-mt-pause]')){paused=!paused;if(!paused&&progress===1)progress=0;paint();sync();}if(event.target.closest('[data-mt-replay]')){progress=reduce.matches?1:0;paused=reduce.matches;paint();sync();}}
    function motion(){if(reduce.matches){progress=1;paused=true;paint();}sync();}
    const beforePrint=()=>{printing=true;sync();},afterPrint=()=>{printing=false;sync();};
    host.addEventListener('click',click);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',motion);window.addEventListener('beforeprint',beforePrint);window.addEventListener('afterprint',afterPrint);
    progress=reduce.matches?1:0;paused=reduce.matches;paint();sync();
    return()=>{disposed=true;stop();host.removeEventListener('click',click);document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',motion);window.removeEventListener('beforeprint',beforePrint);window.removeEventListener('afterprint',afterPrint);};
  }};
})();
