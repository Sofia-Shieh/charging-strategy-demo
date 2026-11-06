/* Two independent city-market shares. All quantities are teaching examples. */
(() => {
  'use strict';
  const registry = window.DECK_ENHANCEMENTS ||= {};
  const controlIcon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${name === 'replay' ? '<path d="M4 10a8 8 0 1 1 .9 7M4 4v6h6"/>' : '<path class="sp-pause-bars" d="M9 5v14M15 5v14"/><path class="sp-play-triangle" d="m9 5 10 7-10 7z"/>'}</svg>`;
  const example = {supply:60000, supplyShare:.58, demand:160000*24, demandShare:7/16};
  const totalGuns = Math.round(example.supply/example.supplyShare).toLocaleString('en-US');
  const totalEnergyWan = (example.demand/example.demandShare/10000).toFixed(2);
  const guns = Array.from({length:50}, (_, i) => {
    const x = 17 + (i % 10) * 36, y = 4 + Math.floor(i / 10) * 28;
    return `<g class="sp-gun${i < 29 ? ' sp-platform-gun' : ''}" data-sp-gun="${i}" transform="translate(${x} ${y}) scale(.54)"><path class="sp-gun-ground" d="M-3 47H24"/><rect class="sp-gun-body" x="1" y="0" width="18" height="43" rx="3"/><path class="sp-gun-window" d="M5 7h10v12H5z"/><path class="sp-gun-bolt" d="m11 8-5 7h4l-1 5 6-8h-4z"/><path class="sp-gun-cable" d="M19 10h3v23c0 5 6 5 6 0V18l-3-3v-5"/><path class="sp-gun-foot" d="M0 43h21"/></g>`;
  }).join('');
  const supplyPicture = `<svg class="sp-gun-field" viewBox="0 0 380 146" role="img" aria-label="示例：50格代表全城公共充电枪，29格橙色代表平台连接的60000枪，占百分之五十八。"><path class="sp-grid-line" d="M5 31H375M5 59H375M5 87H375M5 115H375M5 143H375"/>${guns}<path class="sp-scan" d="M1 2V142"/></svg>`;
  const energyPicture = `<svg class="sp-energy-field" viewBox="0 0 380 136" role="img" aria-label="示例：全城公共充电电量分为16等份，7份橙色代表平台订单电量384万度，占百分之四十三点七五。"><g class="sp-energy-routes"><path d="M4 23C70 23 60 62 109 62H375"/><path d="M4 67H375"/><path d="M4 111C70 111 60 72 109 72H375"/></g><g class="sp-energy-particles"><circle r="2.5" cx="27" cy="27"/><circle r="2.5" cx="58" cy="67"/><circle r="2.5" cx="37" cy="106"/></g>${Array.from({length:16},(_,i)=>`<g class="sp-energy-unit${i<7?' sp-platform-energy':''}" data-sp-energy="${i}" transform="translate(${8+i*23} 38)"><rect width="19" height="58" rx="2"/><path d="M5 13h9M5 22h9M5 31h9M5 40h9M5 49h9"/></g>`).join('')}<path class="sp-energy-bracket" d="M8 113v5H372v-5"/><text x="189" y="134" text-anchor="middle">同周期全城公共充电电量 100%</text></svg>`;
  const html = `<div class="report-head sp-head"><span class="report-kicker">03 / SUPPLY & DEMAND SHARE</span><h1><span class="sp-title-lead">两种份额，</span>看清平台的<em>位置。</em></h1><p class="report-deck">供给数枪，需求计电量。把平台放回城市大盘，才能看清覆盖与承接。</p></div>
  <div class="report-body sp-root" data-sp-root data-sp-view="platform">
    <div class="sp-topline"><span class="sp-example"><i></i>口径演示 · 非真实城市数据</span><div class="sp-controls"><div class="sp-view-switch" role="group" aria-label="切换份额观察视角"><button type="button" data-sp-view-button="city" aria-pressed="false">全城大盘</button><button type="button" data-sp-view-button="platform" aria-pressed="true">平台部分</button></div><button type="button" class="sp-icon-button" data-sp-pause aria-label="暂停份额演示" aria-pressed="false" title="暂停份额演示">${controlIcon('pause')}</button><button type="button" class="sp-icon-button" data-sp-replay aria-label="重播份额演示" title="重播份额演示">${controlIcon('replay')}</button></div></div>
    <div class="sp-panels">
      <section class="sp-panel sp-supply" aria-labelledby="sp-supply-heading">
        <header class="sp-panel-heading"><div><span class="sp-overline">01 / SUPPLY</span><h2 id="sp-supply-heading">供给份额</h2></div><span class="sp-unit-tag">连接覆盖 · 枪数</span></header>
        <p class="sp-question">全城公共充电枪中，有多少接入了平台？</p>
        <div class="sp-chart-row"><div class="sp-chart"><div class="sp-chart-caption">同一城市 · 同一统计截至日</div>${supplyPicture}<div class="sp-chart-scale">50 格代表全城 · 每格 2% · 点亮 29 格</div></div><div class="sp-share-number"><strong aria-label="供给份额百分之五十八"><span data-sp-count="supply" aria-hidden="true">58</span><small>%</small></strong><span>平台有效连接</span><i></i></div></div>
        <div class="sp-legend"><span><i class="sp-platform-key"></i>平台有效连接</span><span><i></i>平台未连接</span></div>
        <div class="sp-calculation" data-sp-calc><span>已知平台有效连接</span><b>60,000</b><span>枪</span></div>
        <div class="sp-equation" aria-label="平台连接60000枪，除以全城约103448枪，约等于58%"><div class="sp-operand sp-platform-operand"><span>平台连接枪数</span><strong>60,000</strong><small>枪 · 分子</small></div><b class="sp-math-operator">÷</b><div class="sp-operand sp-city-operand"><span>全城公共枪数</span><strong>${totalGuns}</strong><small>枪 · 反推近似值</small></div><b class="sp-math-operator">≈</b><div class="sp-operand sp-answer"><span>供给份额</span><strong>58<small>%</small></strong><small>平台 / 全城</small></div></div>
        <p class="sp-derived">全城枪数按 60,000 ÷ 58% 反推，取近似值。</p>
      </section>
      <section class="sp-panel sp-demand" aria-labelledby="sp-demand-heading">
        <header class="sp-panel-heading"><div><span class="sp-overline">02 / DEMAND</span><h2 id="sp-demand-heading">需求份额</h2></div><span class="sp-unit-tag">需求承接 · 电量</span></header>
        <p class="sp-question">全城公共充电电量中，有多少通过平台完成？</p>
        <div class="sp-chart-row"><div class="sp-chart"><div class="sp-chart-caption">同一城市 · 同一统计周期</div>${energyPicture}<div class="sp-chart-scale">16 等份 · 平台占 7 份</div></div><div class="sp-share-number"><strong aria-label="需求份额百分之四十三点七五"><span data-sp-count="demand" aria-hidden="true">43.75</span><small>%</small></strong><span>7 / 16 · 平台订单电量</span><i></i></div></div>
        <div class="sp-legend"><span><i class="sp-platform-key"></i>平台订单电量</span><span><i></i>非平台电量（含直充）</span></div>
        <div class="sp-calculation" data-sp-calc><span>160,000 × 24 =</span><b data-sp-volume aria-label="3840000">3,840,000</b><span>度</span></div>
        <div class="sp-equation" aria-label="平台订单电量384万度，除以全城约877.71万度，约等于43.75%"><div class="sp-operand sp-platform-operand"><span>平台订单电量</span><strong>384</strong><small>万度 · 分子</small></div><b class="sp-math-operator">÷</b><div class="sp-operand sp-city-operand"><span>全城公共电量</span><strong>${totalEnergyWan}</strong><small>万度 · 反推近似值</small></div><b class="sp-math-operator">≈</b><div class="sp-operand sp-answer"><span>需求份额</span><strong>43.75<small>%</small></strong><small>7 ÷ 16 = 43.75%</small></div></div>
        <p class="sp-derived">全城电量按 384 ÷（7 / 16）反推，取近似值。</p>
      </section>
    </div>
    <div class="sp-lens"><div class="sp-reading-steps" aria-label="理解份额的三个步骤"><span data-sp-step="0"><b>01</b>代入示例数据</span><i></i><span data-sp-step="1"><b>02</b>计算平台份额</span><i></i><span data-sp-step="2"><b>03</b>看清平台占比</span></div><p><strong>两项份额独立看</strong>不同分母，分别计算，不可相加。</p></div>
    <div class="sp-foundations"><div><span>供给底盘</span><p>盘点公快、超充、慢充；交叉核对充电 App、地图与地方平台。</p></div><div><span>需求底盘</span><p>结合车型测算、地方公开信息与运营商数据，校准全城电量。</p></div><button type="button" class="sp-method-button" data-sp-method>查看统计口径<span aria-hidden="true">＋</span></button></div>
    <p class="sp-footnote">本页为给定数据的计算示例，两个全城总量均由给定份额反推，非独立实测数据。实际使用时须统一公共充电范围、供给截至日与需求统计周期。</p>
    <dialog class="sp-method-dialog" data-sp-dialog aria-labelledby="sp-method-title"><div class="sp-method-top"><div><span>MEASUREMENT NOTES</span><h2 id="sp-method-title">先统一口径，再计算份额。</h2></div><button type="button" class="sp-icon-button" data-sp-close aria-label="关闭统计口径"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div><div class="sp-method-columns"><section><h3>供给：数清公共充电枪</h3><p><b>分子</b>平台有效连接的公共充电枪数。</p><p><b>分母</b>全城同口径公共充电枪数；公快、超充、慢充分别记录，再按一致范围汇总。</p><p><b>基本字段</b>场站名、枪数、商户、运营商、底层接入、场站属性、地址、区域及配套。</p><p><b>盘点路径</b>充电 App、图商 App、地方充电平台 / 小程序交叉核验，按场站及设备去重。</p><p><b>边界</b>供给是截至同一天的存量；有效连接的判定与设备可用性规则要一致。平台连接不意味着资产自有或独家接入。</p></section><section><h3>需求：量清实际充电电量</h3><p><b>分子</b>通过平台完成订单对应的充电电量，不能用已连接运营商的全部电量代替。</p><p><b>分母</b>同城、同一统计周期、同公共充电范围内的总电量，包含平台内外渠道。</p><p><b>测算路径</b>车型数量 × 充电频次 × 单次电量 × 公共充电比例，结合私家车、网约车、物流车与公交车结构。</p><p><b>交叉校准</b>地方平台月报 / 季报 / 年报，以及运营商电量数据；明确样本覆盖与外推依据。</p><p><b>边界</b>统计周期、地域、公共范围与单位一致。订单量、用户数和电量分别统计，不互相替代。</p></section></div><p class="sp-method-note">本例已知平台连接 60,000 枪，给定供给份额 58%，反推全城约 103,448 枪；平台电量 160,000 × 24＝3,840,000 度，给定需求份额 7/16＝43.75%，反推全城约 877.71 万度。分母均为反推近似值，不能替代独立市场盘点。乘数 24 未指定单位，暂按给定算式展示，不指定日或月。</p></dialog>
  </div>`;

  registry[3] = {title:'两种份额，看清平台的位置',html,mount(root){
    const host=root.querySelector('[data-sp-root]');
    if(!host)return()=>{};
    const pause=host.querySelector('[data-sp-pause]'),dialog=host.querySelector('[data-sp-dialog]'),method=host.querySelector('[data-sp-method]');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)'),guns=[...host.querySelectorAll('.sp-platform-gun')],energy=[...host.querySelectorAll('.sp-platform-energy')],steps=[...host.querySelectorAll('[data-sp-step]')];
    const supplyCount=host.querySelector('[data-sp-count="supply"]'),demandCount=host.querySelector('[data-sp-count="demand"]'),volume=host.querySelector('[data-sp-volume]'),calculations=[...host.querySelectorAll('[data-sp-calc]')];
    const duration=4200,clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>1-Math.pow(1-v,3);
    let elapsed=0,previous=0,frame=0,playing=!reduce.matches,disposed=false,printing=false,lastProgress=-1;
    function stop(){if(frame)cancelAnimationFrame(frame);frame=0;previous=0;}
    function paint(){
      const p=printing?1:Math.min(1,elapsed/duration),stage=p<.28?0:p<.85?1:2;
      const amountProgress=ease(clamp((p-.08)/.32)),shareProgress=ease(clamp((p-.30)/.62));
      if(p!==lastProgress){host.style.setProperty('--sp-progress',p.toFixed(3));host.dataset.spPhase=String(stage);lastProgress=p;}
      supplyCount.textContent=String(Math.round(example.supplyShare*100*shareProgress));
      demandCount.textContent=(example.demandShare*100*shareProgress).toFixed(2);
      volume.textContent=Math.round(example.demand*amountProgress).toLocaleString('en-US');
      guns.forEach((el,i)=>el.classList.toggle('is-lit',shareProgress>=(i+1)/guns.length));
      energy.forEach((el,i)=>el.classList.toggle('is-lit',shareProgress>=(i+1)/energy.length));
      calculations.forEach(el=>el.classList.toggle('is-current',stage===0));
      steps.forEach((el,i)=>el.classList.toggle('is-current',i===stage));
      host.classList.toggle('sp-paused',!playing||reduce.matches||document.hidden||printing);
      host.classList.toggle('sp-finished',p>=1);
      pause.setAttribute('aria-pressed',String(!playing));pause.disabled=reduce.matches;
      const label=reduce.matches?'静态显示':playing?'暂停份额演示':elapsed>=duration?'重新播放份额演示':'继续份额演示';
      pause.setAttribute('aria-label',label);pause.title=label;
    }
    function tick(now){frame=0;if(disposed)return;if(previous)elapsed+=Math.min(100,now-previous);previous=now;if(elapsed>=duration){elapsed=duration;playing=false;paint();previous=0;return;}paint();frame=requestAnimationFrame(tick);}
    function sync(){stop();paint();if(!disposed&&playing&&!document.hidden&&!reduce.matches&&!printing)frame=requestAnimationFrame(tick);}
    function replay(){elapsed=reduce.matches?duration:0;playing=!reduce.matches;sync();}
    function closeMethod(){if(dialog.open)dialog.close();}
    function click(e){
      if(e.target.closest('[data-sp-pause]')){if(elapsed>=duration)elapsed=0;playing=!playing;sync();}
      if(e.target.closest('[data-sp-replay]'))replay();
      const view=e.target.closest('[data-sp-view-button]');
      if(view){elapsed=duration;playing=false;host.dataset.spView=view.dataset.spViewButton;host.querySelectorAll('[data-sp-view-button]').forEach(b=>b.setAttribute('aria-pressed',String(b===view)));sync();}
      if(e.target.closest('[data-sp-method]')){playing=false;sync();dialog.showModal();host.querySelector('[data-sp-close]').focus();}
      if(e.target.closest('[data-sp-close]'))closeMethod();
      if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeMethod();}
    }
    function close(){if(method.isConnected)method.focus({preventScroll:true});}
    function dialogKey(e){e.stopPropagation();}
    function preference(){elapsed=duration;playing=false;sync();}
    const before=()=>{printing=true;closeMethod();sync();},after=()=>{printing=false;sync();};
    if(reduce.matches)elapsed=duration;
    host.addEventListener('click',click);dialog.addEventListener('close',close);dialog.addEventListener('keydown',dialogKey);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',preference);window.addEventListener('beforeprint',before);window.addEventListener('afterprint',after);host.classList.add('sp-ready');sync();
    return()=>{disposed=true;stop();dialog.removeEventListener('close',close);closeMethod();host.removeEventListener('click',click);dialog.removeEventListener('keydown',dialogKey);document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',preference);window.removeEventListener('beforeprint',before);window.removeEventListener('afterprint',after);};
  }};
})();
