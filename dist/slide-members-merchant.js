/* Slide enhancements: user-count intervals and merchant lifecycle.
   Values are supplied experience ranges; merchant windows are not cumulative dates. */
(() => {
  'use strict';
  const registry = window.DECK_ENHANCEMENTS ||= {};
  const head = (kicker, title, description) => `<div class="report-head mm-head"><span class="report-kicker">${kicker}</span><h1>${title}</h1><p class="report-deck">${description}</p></div>`;
  const listen = (target, type, fn, options, disposers) => {
    target.addEventListener(type, fn, options);
    disposers.push(() => target.removeEventListener(type, fn, options));
  };
  const motionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)');

  registry[5] = {
    title: '会员，是持续经营的用户基础',
    html: head('05 / CUSTOMER MIX & MEMBERSHIP', '会员，是持续经营的<em>用户基础。</em>', '先看用户人数结构，再用分层价格与权益承接不同的补能需求。') + `
      <div class="report-body mm-members" data-mm-members>
        <div class="mm-members-top">
          <section class="mm-share-chart" aria-label="三类用户人数占比区间，使用相同的百分之零至百分之一百刻度">
            <div class="mm-chart-heading"><h2>用户人数占比</h2><span>同一 0–100% 尺度</span></div>
            <div class="mm-share-axis" aria-hidden="true"><span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100%</span></div>
            <div class="mm-share-row"><div class="mm-share-label"><b>私家车</b><span>非会员 · 非营运</span></div><div class="mm-range-track"><span class="mm-range-fill" style="--start:0%;--span:10%;--delay:0ms"></span><strong class="mm-range-value" style="--label:12%">0<i class="numeric-range-dash">–</i>10%</strong></div></div>
            <div class="mm-share-row"><div class="mm-share-label"><b>营运车</b><span>非会员 · 已认证</span></div><div class="mm-range-track"><span class="mm-range-fill" style="--start:10%;--span:20%;--delay:120ms"></span><strong class="mm-range-value" style="--label:32%">10<i class="numeric-range-dash">–</i>30%</strong></div></div>
            <div class="mm-share-row mm-share-member"><div class="mm-share-label"><b>付费会员</b><span>会员权益用户</span></div><div class="mm-range-track"><span class="mm-range-fill" style="--start:40%;--span:20%;--delay:240ms"></span><strong class="mm-range-value" style="--label:62%">40<i class="numeric-range-dash">–</i>60%</strong></div></div>
            <p class="mm-chart-note">各区间为经验范围，分别呈现；不加总为 100%。</p>
          </section>
          <aside class="mm-members-focus">
            <div class="mm-focus-top"><span>MEMBERSHIP / 经营重点</span><span class="mm-focus-signal" aria-hidden="true"></span></div>
            <div class="mm-member-number">40<i class="numeric-range-dash">–</i>60<span>%</span></div>
            <p class="mm-member-caption">付费会员用户人数占比</p>
            <div class="mm-member-actions"><div data-mm-member-value="0"><span>01</span><div><b>提频</b><p>会员价稳预期，券包与会员日促复购。</p></div></div><div data-mm-member-value="1"><span>02</span><div><b>续费</b><p>持续、可感知的权益，承接长期补能需求。</p></div></div></div>
            <p class="mm-member-boundary">人数占比 ≠ 订单、收入或利润贡献</p>
          </aside>
        </div>
        <div class="mm-personas">
          <article><div class="mm-persona-title"><span>01</span><h3>效率与体验</h3><b>私家车</b></div><p>相对低价敏、低频次。工作日路线固定；周末、节假日关注目的地补能。</p><div class="mm-price"><span>初始价差倾向</span><strong>高 0.05 <small>元 / 度左右</small></strong></div></article>
          <article><div class="mm-persona-title"><span>02</span><h3>日常补能效率</h3><b>营运车</b></div><p>中价敏、中频次。综合比较价格、可用枪数与补能时间，减少等待。</p><div class="mm-price"><span>初始价差倾向</span><strong>高 0～0.03 <small>元 / 度</small></strong></div></article>
          <article class="mm-persona-member"><div class="mm-persona-title"><span>03</span><h3>持续节省</h3><b>付费会员</b></div><p>高价敏、高频次。会员价、会员券包与会员日共同形成长期价值感。</p><div class="mm-price"><span>初始价差倾向</span><strong>低 0.03–0.05 <small>元 / 度</small></strong></div></article>
        </div>
        <div class="mm-members-rule"><p><b>规则先行</b>会员与营运身份可重合，明确适用优先级、活动叠加与最终到手价。</p><button class="source-button" type="button" data-image="segmentation">查看分层方法原图 <span>↗</span></button></div>
        <p class="mm-footnote">价差为经验示例，以单站竞争基准与城市阶段校准；原图 +3% 为限定样本实验结论，不是本次分享者业绩。</p>
      </div>`,
    mount(root) {
      const host = root.querySelector('[data-mm-members]');
      if (!host) return () => {};
      const disposers = [];
      const query = motionQuery();
      const values = [...host.querySelectorAll('[data-mm-member-value]')];
      let frame = 0, previous = 0, elapsed = 0, stopped = false;
      const show = index => values.forEach((item, i) => item.classList.toggle('is-emphasis', index === i));
      const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; previous = 0; };
      const tick = now => {
        frame = 0;
        if (stopped || document.hidden || query.matches) return;
        if (previous) elapsed += Math.min(now - previous, 100);
        previous = now;
        show(Math.floor(elapsed / 3200) % 2);
        frame = requestAnimationFrame(tick);
      };
      const sync = () => {
        stop();
        host.classList.toggle('mm-motion-paused', document.hidden || query.matches);
        if (query.matches) { host.classList.remove('mm-enter'); show(-1); }
        else if (!document.hidden && !stopped) frame = requestAnimationFrame(tick);
      };
      if (!query.matches) host.classList.add('mm-enter');
      listen(document, 'visibilitychange', sync, undefined, disposers);
      listen(query, 'change', sync, undefined, disposers);
      sync();
      return () => { stopped = true; stop(); disposers.forEach(fn => fn()); host.classList.remove('mm-enter', 'mm-motion-paused'); show(-1); };
    }
  };

  const stages = [
    {name:'新站', en:'LAUNCH', window:'约 7 日', days:'7', goal:'先起量，获得首次体验', action:'低价引流、全渠道推送，帮助用户发现并首次体验场站。', rule:'核对位置、设备与配置，观察初始电量和新客来源。', metric:'单枪电量 / 拉新', icon:'<path d="M12 5h15a3 3 0 0 1 3 3v28H9V8a3 3 0 0 1 3-3zM6 37h28M30 15h5l4 5v10a3 3 0 0 1-6 0v-8"/><path d="m22 11-8 12h7l-3 9 9-13h-7z"/>'},
    {name:'次新站', en:'CALIBRATE', window:'约 14 日', days:'14', goal:'稳电量，逐步提升收益', action:'根据竞争和用户反馈小步提价，逐步减少对低价引流的依赖。', rule:'在电量稳定的前提下提升度均收益，避免价格一次性跳涨。', metric:'电量稳定 / 度均收益', icon:'<path d="M10 6v32M22 6v32M34 6v32"/><rect x="6" y="13" width="8" height="9" rx="2"/><rect x="18" y="25" width="8" height="9" rx="2"/><rect x="30" y="9" width="8" height="9" rx="2"/>'},
    {name:'稳定站', en:'SUSTAIN', window:'14–30 日', days:'14–30', goal:'以单枪收益为长期目标', action:'价格逐步对齐竞争区块均价，持续跟踪用户、设备与竞争变化。', rule:'以单枪收益稳定经营，再决定维持投入或追加资源。', metric:'单枪收益 / 持续经营', icon:'<path d="m22 4 15 6v12c0 9-15 17-15 17S7 31 7 22V10z"/><path d="m14 22 6 6 11-13"/>'}
  ];
  registry[11] = {
    title: '让新站，从起量走向稳定经营',
    html: head('11 / MERCHANT LIFECYCLE', '让新站，从起量走向<em>稳定经营。</em>', '按阶段管理价格、流量与成本，逐步将经营目标从起量转向单枪收益。') + `
      <div class="report-body mm-merchant mm-life" data-mm-merchant>
        <div class="mm-life-toolbar"><span><i></i>按阶段推进，而非到点切换</span><div><span data-mm-position>01 / 03</span><button type="button" data-mm-pause aria-pressed="false">暂停演示 Ⅱ</button><button type="button" data-mm-replay>重播 ↺</button></div></div>
        <section class="mm-life-journey" aria-label="商户生命周期时间轴：新站、次新站、稳定站">
          <div class="mm-life-rail" aria-hidden="true"><span data-mm-rail></span><i data-mm-traveller></i></div>
          <div class="mm-life-grid">${stages.map((s,i)=>`<article class="mm-life-stage${i===0?' is-active':''}" data-mm-card="${i}">
            <button type="button" class="mm-life-select" data-mm-stage="${i}" aria-pressed="${i===0}" aria-label="固定查看${s.name}阶段，观察窗口${s.window}"><span class="mm-life-eyebrow">0${i+1} / ${s.en}</span><strong class="mm-life-days">${i<2?'<small>约</small>':''}${s.days}<small>日</small></strong><span class="mm-life-node"><svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${s.icon}</svg></span><span class="mm-life-name">${s.name}<small>阶段观察窗口</small></span></button>
            <div class="mm-life-content"><div class="mm-life-content-head"><span>阶段目标</span><b>0${i+1}</b></div><h2>${s.goal}</h2><p>${s.action}</p><p class="mm-life-rule">${s.rule}</p><div class="mm-life-metric"><span>持续观察</span><b>${s.metric}</b></div></div>
          </article>`).join('')}</div>
        </section>
        <div class="mm-life-cost"><span class="mm-life-cost-icon" aria-hidden="true">↔</span><div><b>成本一起核算</b><p>商户共担比例＋平台补贴，与单枪电量、收益和拉新效果联查。</p></div><span>贯穿每个阶段</span></div>
        <p class="mm-footnote">7 日 / 14 日 / 14–30 日为各阶段观察窗口，不是累计时间；转段根据场站表现调整。</p>
      </div>`,
    mount(root) {
      const host = root.querySelector('[data-mm-merchant]');
      if (!host) return () => {};
      const disposers = [], query = motionQuery();
      const buttons = [...host.querySelectorAll('[data-mm-stage]')];
      const cards = [...host.querySelectorAll('[data-mm-card]')];
      const rail = host.querySelector('[data-mm-rail]');
      const traveller = host.querySelector('[data-mm-traveller]');
      const position = host.querySelector('[data-mm-position]');
      const pause = host.querySelector('[data-mm-pause]');
      const replay = host.querySelector('[data-mm-replay]');
      const duration = 4200, endTime = duration * 3;
      let frame=0, previous=0, elapsed=0, stopped=false, paused=false, printing=false, stage=-1;
      const draw = progress => {const value=Math.min(progress*1.5,1)*100+'%';rail.style.setProperty('--life-fill',value);traveller.style.setProperty('--life-travel',value);};
      const select = index => {
        if (index === stage) return;
        stage = index;
        buttons.forEach((button,i) => {button.classList.toggle('is-active',i===index);button.setAttribute('aria-pressed',String(i===index));});
        cards.forEach((card,i) => card.classList.toggle('is-active',i===index));
        position.textContent='0'+(index+1)+' / 03';
      };
      const refreshControl = () => {
        pause.textContent = paused ? '继续演示 ▶' : '暂停演示 Ⅱ';
        pause.setAttribute('aria-pressed', String(paused));
        pause.disabled = query.matches;
        if (query.matches) pause.textContent = '静态展示';
      };
      const stop = () => {if(frame) cancelAnimationFrame(frame); frame=0; previous=0;};
      const tick = now => {
        frame=0;
        if(stopped || paused || printing || document.hidden || query.matches) return;
        if(previous) elapsed+=Math.min(now-previous,100);
        previous=now;
        draw(Math.min(elapsed/endTime,1));
        select(Math.min(Math.floor(elapsed/duration),2));
        if(elapsed < endTime) frame=requestAnimationFrame(tick);
        else {paused=true;host.classList.add('mm-motion-paused');refreshControl();}
      };
      const sync = () => {
        stop(); refreshControl();
        host.classList.toggle('mm-motion-paused',paused||printing||document.hidden||query.matches);
        if(query.matches)draw(1);
        else if(!paused&&!printing&&!document.hidden&&!stopped)frame=requestAnimationFrame(tick);
      };
      const jump = index => {paused=true;elapsed=index*duration;draw(elapsed/endTime);select(index);sync();};
      buttons.forEach((button,index) => {
        listen(button,'click',()=>jump(index),undefined,disposers);
        listen(button,'keydown',event=>{
          let next;
          if(event.key==='ArrowRight'||event.key==='ArrowDown') next=(index+1)%3;
          else if(event.key==='ArrowLeft'||event.key==='ArrowUp') next=(index+2)%3;
          else if(event.key==='Home') next=0;
          else if(event.key==='End') next=2;
          else if(event.key===' '||event.key==='Enter'){event.preventDefault();event.stopPropagation();jump(index);return;}
          else return;
          event.preventDefault();event.stopPropagation();buttons[next].focus();jump(next);
        },undefined,disposers);
      });
      [pause,replay].forEach(button => listen(button,'keydown',event=>{
        if(event.key===' '||event.key==='Enter'){event.preventDefault();event.stopPropagation();button.click();}
      },undefined,disposers));
      listen(pause,'click',()=>{if(elapsed>=endTime){elapsed=0;select(0);draw(0);}paused=!paused;sync();},undefined,disposers);
      listen(replay,'click',()=>{elapsed=0;paused=query.matches;select(0);draw(query.matches?1:0);sync();},undefined,disposers);
      listen(document,'visibilitychange',sync,undefined,disposers);
      listen(query,'change',sync,undefined,disposers);
      listen(window,'beforeprint',()=>{printing=true;sync();},undefined,disposers);
      listen(window,'afterprint',()=>{printing=false;sync();},undefined,disposers);
      select(0);draw(query.matches?1:0);sync();
      return () => {stopped=true;stop();disposers.forEach(fn=>fn());draw(1);host.classList.remove('mm-motion-paused');};
    }
  };
})();
