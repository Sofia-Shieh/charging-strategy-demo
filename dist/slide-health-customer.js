/* Guided diagnostics and customer journeys: illustrative signals, never live scores. */
(() => {
  'use strict';
  const registry = window.DECK_ENHANCEMENTS ||= {};
  const pauseIcon = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M7 4v12m6-12v12"/></svg>';
  const playIcon = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m7 4 9 6-9 6Z"/></svg>';
  const replayIcon = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 8a6 6 0 1 1 0 4M4 3v5h5"/></svg>';
  const iconPaths = [
    '<path d="M5 19h15M7 16V11m5 5V7m5 9V4M5 7l6-4 5 1"/>',
    '<path d="M3 4h10l7 7-9 10-9-9Z"/><circle cx="8" cy="9" r="1.5"/><path d="m12 12 4 4m0-5-5 5"/>',
    '<path d="M5 3v18m7-18v18m7-18v18M2 8h6m1 7h6m1-8h6"/>',
    '<path d="M4 21V3h11v18M2 21h16M15 8h4l3 4v6a2 2 0 0 1-4 0v-5"/><path d="m10 6-3 5h4l-3 5"/>',
    '<path d="M3 4h18v17H3Zm6 0v17m6-17v17M3 10h18M3 16h18"/><circle cx="14" cy="9" r="3"/>',
    '<circle cx="9" cy="8" r="4"/><path d="M2 21v-4a7 7 0 0 1 14 0v4m0-17a4 4 0 0 1 0 8m2 2a6 6 0 0 1 4 6"/>'
  ];
  const icon = i => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+iconPaths[i]+'</svg>';
  const head = (kicker, title, desc) => '<div class="report-head hc-head"><span class="report-kicker">'+kicker+'</span><h1>'+title+'</h1><p class="report-deck">'+desc+'</p></div>';
  const controls = total => '<div class="hc-controls"><span data-hc-position>01 / '+String(total).padStart(2,'0')+'</span><button type="button" data-hc-pause aria-label="暂停讲解动画" title="暂停讲解动画">'+pauseIcon+'</button><button type="button" data-hc-replay aria-label="重播讲解动画" title="重播讲解动画">'+replayIcon+'</button></div>';
  const health = [
    {title:'单枪效率',tag:'供给是否被充分使用',metric:'&gt; 1',ref:'效率比 · 参考 1.2 / 1.5',definition:'本站单枪电量或单量 ÷ 周边同口径水平。',action:'低于周边时，联查价格、位置与设备，找到利用不足的原因。',short:'效率'},
    {title:'人群价格比',tag:'用户支付价格是否有竞争力',metric:'&lt; 1',ref:'本站 / 周边 · 同人群比较',definition:'同一人群、同一优惠口径，比较最终支付价格。',action:'识别价格竞争力与收益空间，再校准人群价格及补贴。',short:'价格'},
    {title:'定价合理性',tag:'价格梯度是否符合规则',metric:'价差匹配',ref:'避免不合理的过大价差',definition:'检查不同人群、不同充电时段之间的价格梯度。',action:'核验身份规则、优惠叠加与价格跳变，排除配置异常。',short:'梯度'},
    {title:'设备异常率',tag:'已连接是否等于可用',metric:'&lt; 10% / 15%',ref:'经验观察线 · 非固定考核值',definition:'观察异常设备对有效可用供给的影响。',action:'定位故障并推进修复；恢复后，继续核对设备可用性。',short:'设备'},
    {title:'网格覆盖率',tag:'供给是否到达需求热点',metric:'覆盖匹配',ref:'需求热力 × 驾驶可达性',definition:'把需求热力与有效场站放在同一张网格中比较。',action:'识别供给不足的热点网格，安排补站、补枪与覆盖优化。',short:'覆盖'},
    {title:'付费会员渗透',tag:'用户关系是否沉淀价值',metric:'渗透 × 价值',ref:'统一活跃用户分母',definition:'结合会员占比、充电频次、留存与价值共同判断。',action:'优化开卡、续费、权益感知与提频，跟踪持续使用。',short:'会员'}
  ];
  const healthPoints = [[75,87],[230,46],[385,87],[385,266],[230,306],[75,266]];
  const healthVisual = '<div class="hd-visual"><div class="hd-visual-title"><span>OPERATING SIGNALS</span><i></i><span>诊断逻辑示意</span></div><svg class="hd-network" viewBox="0 0 460 350" role="img" aria-label="效率、价格、梯度、设备、覆盖、会员六类信号围绕场站汇集，逐项连接到诊断动作"><defs><pattern id="hcHealthGrid" width="27" height="27" patternUnits="userSpaceOnUse"><path d="M27 0H0V27" fill="none" stroke="#ffffff" stroke-opacity=".035"/></pattern></defs><rect width="460" height="350" fill="url(#hcHealthGrid)"/><circle class="hd-orbit" cx="230" cy="176" r="114"/><path class="hd-orbit" d="M75 87 230 46 385 87 385 266 230 306 75 266Z"/>'+healthPoints.map((p,i)=>'<g data-hc-visual="'+i+'" class="hd-sensor'+(i===0?' is-active':'')+'"><path class="hd-signal" d="M'+p[0]+' '+p[1]+' L230 176"/><circle class="hd-sensor-halo" cx="'+p[0]+'" cy="'+p[1]+'" r="24"/><circle class="hd-sensor-point" cx="'+p[0]+'" cy="'+p[1]+'" r="16"/><text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="middle">0'+(i+1)+'</text><text class="hd-sensor-name" x="'+p[0]+'" y="'+(p[1]+39)+'" text-anchor="middle">'+health[i].short+'</text></g>').join('')+'<g class="hd-station"><path d="m181 140 49-24 49 24v73l-49 23-49-23Z" fill="#202224" stroke="#53575a"/><path d="m181 140 49 24 49-24M230 164v72" fill="none" stroke="#42474a"/><path d="M217 133v-21h26v21m-22-16h18" fill="none" stroke="#e3e4e3" stroke-width="2"/><path d="m235 173-14 23h13l-9 21 22-30h-14Z" fill="#ff6800"/><path d="m191 161 23 11m-23-1 23 11m-23-1 23 11" stroke="#7b8287"/><circle class="hd-core-pulse" cx="230" cy="176" r="66"/></g></svg><div class="hd-visual-bottom"><span>经营对象</span><b>场站 · 区块 · 城市 · 全国</b></div></div>';
  const healthHtml = head('09 / SIGNALS INTO ACTION','让健康信号，变成具体<em>动作。</em>','先统一指标与对标口径，再从异常信号，追溯到运营问题。')+'<div class="report-body hc-root hd-root" data-hc-scene="health"><div class="hc-topline"><span><i></i>六个诊断入口 · 点击切换讲解</span>'+controls(6)+'</div><div class="hd-console"><nav class="hd-index" aria-label="健康度诊断维度">'+health.map((h,i)=>'<button class="hd-index-item'+(i===0?' is-active':'')+'" type="button" data-hc-select="'+i+'" aria-pressed="'+(i===0)+'">'+icon(i)+'<span><b>'+h.title+'</b><small>'+h.tag+'</small></span><em>0'+(i+1)+'</em></button>').join('')+'</nav>'+healthVisual+'<div class="hd-diagnostic">'+health.map((h,i)=>'<article class="hd-reading hc-panel'+(i===0?' is-active':'')+'" data-hc-panel="'+i+'"'+(i===0?'':' hidden')+'><div class="hd-reading-kicker"><span>诊断 / 0'+(i+1)+'</span>'+icon(i)+'</div><h2>'+h.title+'</h2><div class="hd-rule"><strong>'+h.metric+'</strong><small>'+h.ref+'</small></div><div class="hd-definition"><span>观察口径</span><p>'+h.definition+'</p></div><div class="hd-action"><span>下一步动作</span><p>'+h.action+'</p></div></article>').join('')+'</div></div><div class="hd-footer"><strong>先定位，再调整。</strong><span>指标偏离 → 联查原因 → 配置动作 → 复查恢复</span><i>同口径 · 同周期 · 可比较</i></div><p class="hc-note">效率与异常率阈值为经验示例，需按城市阶段校准；单枪电量与单枪单量不可混用。此处展示诊断逻辑，不代表实时监测值。</p><div class="hc-print-detail">'+health.map(h=>'<div><b>'+h.title+' · '+h.metric+'</b><p>'+h.definition+' '+h.action+'</p></div>').join('')+'</div></div>';

  const customer = [
    {name:'拉新',en:'DISCOVER',goal:'从曝光到首次体验',state:'潜在用户',next:'首单用户',strategy:['新用户券','前三单梯度折扣','裂变拉新'],detail:'降低首次体验门槛，让用户在合适的场景完成第一单。',observe:'首单转化、获客投入与后续留存',symbol:'01'},
    {name:'培育',en:'BUILD HABIT',goal:'促成复购，形成习惯',state:'首单用户',next:'复购用户',strategy:['多单折扣','冲单激励'],detail:'承接新用户体验，在第二、三次使用中培养充电习惯。',observe:'第二、三单转化与复购周期',symbol:'02'},
    {name:'提频',en:'ACTIVATE',goal:'增加有效活跃',state:'已有用户',next:'持续活跃',strategy:['福利大促','天降红包','抽奖 / 冲单'],detail:'围绕实际补能需求激发使用，检验活动是否带来新增订单。',observe:'充电频次、增量订单与投入产出',symbol:'03'},
    {name:'忠诚',en:'STAY CONNECTED',goal:'深化长期用户关系',state:'活跃用户',next:'长期会员',strategy:['付费会员价','会员券包','会员日'],detail:'以可持续、可感知的会员权益锁客，提升长期用户价值。',observe:'会员渗透、续费与用户价值',symbol:'04'},
    {name:'召回',en:'RECONNECT',goal:'让流失用户重新使用',state:'流失用户',next:'重新活跃',strategy:['回归特价','召回券包','开卡特惠'],detail:'按流失时长选择权益与触达方式，召回后继续观察真实使用。',observe:'回流后是否持续使用，而非只领券',symbol:'05'}
  ];
  const customerHtml = head('10 / THE CUSTOMER JOURNEY','从第一次充电，到持续<em>选择。</em>','以用户行为识别阶段，让每一次触达都有明确的运营目标。')+'<div class="report-body hc-root cj-root" data-hc-scene="customer"><div class="hc-topline"><span><i></i>用户生命周期 · 按行为进入对应阶段</span>'+controls(5)+'</div><div class="cj-journey"><div class="cj-main-path"><div class="cj-rail" aria-hidden="true"><span></span></div>'+customer.slice(0,4).map((c,i)=>'<button type="button" class="cj-stop'+(i===0?' is-active':'')+'" data-hc-select="'+i+'" aria-pressed="'+(i===0)+'"><span class="cj-stop-top"><i>'+c.symbol+'</i><small>'+c.en+'</small></span><strong>'+c.name+'</strong><span class="cj-stop-goal">'+c.goal+'</span><span class="cj-stop-dot" aria-hidden="true"></span></button>').join('')+'<div class="cj-path-caption"><span>首次体验</span><span>反复使用</span><span>长期关系</span></div></div><button type="button" class="cj-recall" data-hc-select="4" aria-pressed="false"><span class="cj-recall-top"><i>05 / RECONNECT</i><svg viewBox="0 0 50 50" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M10 23a16 16 0 1 1 5 15M10 13v10h10"/><circle cx="25" cy="25" r="4"/></svg></span><strong>召回</strong><span>按流失时长，重新连接</span><div class="cj-windows"><b>15</b><b>30</b><b>60</b><b>90<small>天</small></b></div></button></div><div class="cj-return-track"><svg viewBox="0 0 1324 32" preserveAspectRatio="none" aria-hidden="true"><path class="cj-return-base" d="M1150 0v12q0 10-12 10H132q-12 0-12-12V0"/><path class="cj-return-signal" d="M1150 0v12q0 10-12 10H132q-12 0-12-12V0"/></svg><span>流失可能发生在任一阶段；回归后，重新识别用户行为。</span></div><div class="cj-detail-stack">'+customer.map((c,i)=>'<article class="cj-detail hc-panel'+(i===0?' is-active':'')+'" data-hc-panel="'+i+'"'+(i===0?'':' hidden')+'><div class="cj-detail-lead"><small>本阶段希望发生的变化</small><h2>'+c.goal+'</h2><div class="cj-state-change"><span>'+c.state+'</span><i aria-hidden="true"></i><b>'+c.next+'</b></div></div><div class="cj-detail-strategy"><small>策略组合</small><div class="cj-strategy-tags">'+c.strategy.map(s=>'<span>'+s+'</span>').join('')+'</div><p>'+c.detail+'</p></div><div class="cj-detail-observe"><small>重点观察</small><strong>'+c.observe+'</strong><span>用持续行为验证效果</span></div></article>').join('')+'</div><div class="cj-evaluation"><b>共同评价</b><span>订单</span><span>ROI</span><span>充电频次</span><span>会员渗透</span><span>端内网约车人群渗透</span></div><p class="hc-note">同一用户可能具备多种身份，需统一去重、活动互斥与归因口径，避免重复补贴和重复计算；召回按近 15 / 30 / 60 / 90 天流失窗口分组。</p><div class="hc-print-detail">'+customer.map(c=>'<div><b>'+c.name+' · '+c.goal+'</b><p>'+c.strategy.join(' / ')+'；观察：'+c.observe+'。</p></div>').join('')+'</div></div>';

  function mount(root) {
    const scene = root.querySelector('[data-hc-scene]');
    if (!scene) return () => {};
    const buttons = [...scene.querySelectorAll('[data-hc-select]')];
    const panels = [...scene.querySelectorAll('[data-hc-panel]')];
    const visuals = [...scene.querySelectorAll('[data-hc-visual]')];
    const pause = scene.querySelector('[data-hc-pause]');
    const replay = scene.querySelector('[data-hc-replay]');
    const position = scene.querySelector('[data-hc-position]');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = preference.matches, playing = !reduced, index = 0, elapsed = 0, last = 0, raf = 0, dead = false, printing = false;
    const duration = scene.dataset.hcScene === 'health' ? 5500 : 6000;
    const listeners = [], animations = new Set();
    const on = (target,event,fn) => { target.addEventListener(event,fn); listeners.push(() => target.removeEventListener(event,fn)); };
    function render(animate = false) {
      scene.dataset.hcActive = String(index);
      scene.classList.toggle('hc-paused',!playing || reduced || printing || document.hidden);
      scene.style.setProperty('--hc-progress',String(elapsed/duration));
      scene.style.setProperty('--hc-stage',String(Math.min(index,3)/3));
      buttons.forEach((button,i) => { button.classList.toggle('is-active',i===index); button.setAttribute('aria-pressed',String(i===index)); });
      visuals.forEach((node,i) => node.classList.toggle('is-active',i===index));
      panels.forEach((panel,i) => { panel.hidden = i!==index; panel.classList.toggle('is-active',i===index); });
      position.textContent = String(index+1).padStart(2,'0')+' / '+String(buttons.length).padStart(2,'0');
      pause.innerHTML = playing ? pauseIcon : playIcon;
      pause.setAttribute('aria-label',reduced?'已遵循减少动态效果设置':playing?'暂停讲解动画':'继续讲解动画');
      pause.title = pause.getAttribute('aria-label'); pause.disabled = reduced;
      if (animate && !reduced && panels[index].animate) {
        animations.forEach(a=>a.cancel()); animations.clear();
        const animation = panels[index].animate([{opacity:0,transform:'translateY(12px)',filter:'blur(4px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0px)'}],{duration:500,easing:'cubic-bezier(.16,1,.3,1)'});
        animations.add(animation); animation.onfinish=()=>animations.delete(animation);
      }
    }
    function cancel() { if(raf)cancelAnimationFrame(raf);raf=0;last=0; }
    function schedule() { if(!dead&&playing&&!reduced&&!document.hidden&&!printing&&!raf)raf=requestAnimationFrame(tick); }
    function tick(time) {
      raf=0;
      if(dead||!playing||reduced||document.hidden||printing)return;
      if(last)elapsed+=Math.min(time-last,100);last=time;
      if(elapsed>=duration){elapsed=0;index=(index+1)%buttons.length;render(true);}
      scene.style.setProperty('--hc-progress',String(elapsed/duration));schedule();
    }
    buttons.forEach((button,i)=>on(button,'click',()=>{index=i;elapsed=0;playing=false;cancel();render(true);}));
    on(pause,'click',()=>{if(reduced)return;playing=!playing;cancel();animations.forEach(a=>playing?a.play():a.pause());render();schedule();});
    on(replay,'click',()=>{index=0;elapsed=0;playing=!reduced;cancel();render(true);schedule();});
    on(document,'visibilitychange',()=>{cancel();if(document.hidden)animations.forEach(a=>a.finish());render();schedule();});
    on(preference,'change',()=>{reduced=preference.matches;playing=!reduced;cancel();animations.forEach(a=>a.finish());render();schedule();});
    on(window,'beforeprint',()=>{printing=true;cancel();animations.forEach(a=>a.finish());render();});
    on(window,'afterprint',()=>{printing=false;render();schedule();});
    render();scene.classList.add('hc-ready');schedule();
    return ()=>{dead=true;cancel();listeners.forEach(fn=>fn());animations.forEach(a=>a.cancel());scene.classList.remove('hc-ready');};
  }
  registry[9] = {title:'让健康信号，变成具体动作',html:healthHtml,mount};
  registry[10] = {title:'从第一次充电，到持续选择',html:customerHtml,mount};
})();
