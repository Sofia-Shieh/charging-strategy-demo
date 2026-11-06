/* Stage-based resource and pricing priorities. All values are experience examples. */
(() => {
  const registry = window.DECK_ENHANCEMENTS ||= {};
  const stages = [
    {name:'空白', en:'ESTABLISH', share:'0', suffix:'%', shareLabel:'供给 0% / 需求 0%', goal:'供给优先', action:'先建立有效场站覆盖，再承接初始需求。', focus:'先有可用的供给', price:'低 0.10 元＋', dir:'低于区块均价', from:22, to:130, side:'low', icon:'<path d="M5 5h12v12H5zM25 5h12v12H25zM5 25h12v12H5z"/><path d="M31 23v16m-8-8h16"/>'},
    {name:'劣势', en:'EXPAND', share:'1–30', suffix:'%', shareLabel:'供给 / 需求两侧约 1%–30%', goal:'新增供给，获取需求', action:'补覆盖，同时增强价格与触达竞争力。', focus:'补覆盖，也促转化', price:'低约 0.05 元', dir:'低于区块均价', from:75, to:130, side:'low', icon:'<path d="M5 36h33M9 36V23h7v13M22 36V14h7v22M35 36V7"/><path d="M7 15 21 5l8 3m-6-5 6 5-6 5"/>'},
    {name:'进阶', en:'ACTIVATE', share:'30–50', suffix:'%', shareLabel:'供给 / 需求两侧约 30%–50%', goal:'需求优先，提高效率', action:'提升现有供给利用，识别高贡献区块。', focus:'让现有供给更高效', price:'持平至高 0.05 元', dir:'持平到适度溢价', from:130, to:184, side:'high', icon:'<path d="M22 5a17 17 0 1 1-12 5M7 4v9h9"/><path d="m25 10-10 14h8l-4 11 12-17h-8z"/>'},
    {name:'优势', en:'OPTIMIZE', share:'50', suffix:'%＋', shareLabel:'供给 / 需求两侧约 50% 及以上', goal:'维稳与收益优化', action:'维护用户和商户关系，减少无效让利。', focus:'稳定经营，优化收益', price:'高 0.05–0.10 元＋', dir:'校准收益空间', from:184, to:238, side:'high', icon:'<path d="m22 4 15 6v12c0 9-15 17-15 17S7 31 7 22V10z"/><path d="m14 22 6 6 11-13"/>'}
  ];
  const range = value => value.replace(/–/g, '<i class="numeric-range-dash">–</i>');
  const priceGlyph = s => `<svg class="ss-price-glyph" viewBox="0 0 260 42" aria-hidden="true"><path class="ss-zero-rail" d="M13 22H247"/><path class="ss-zero-tick" d="M130 10V33"/><path class="ss-offset" d="M${s.from} 22H${s.to}"/><circle class="ss-offset-dot" cx="${s.side==='low'?s.from:s.to}" cy="22" r="4"/><text x="130" y="41" text-anchor="middle">0</text><text x="13" y="41">低</text><text x="247" y="41" text-anchor="end">高</text></svg>`;
  const html = `<div class="report-head ss-head"><div class="report-kicker">04 / STAGE-BASED STRATEGY</div><h1>阶段不同，目标与投入就<em>不同。</em></h1><p class="report-deck">先判断供需位置，再决定资源投向；城市与区块共用框架，策略随经营表现校准。</p></div>
    <div class="report-body ss-root" data-ss-root>
      <div class="ss-toolbar"><span><i></i>经营阶段 → 投入重点 → 价格策略</span><div><b data-ss-position>01 / 04</b><button type="button" data-ss-pause aria-pressed="false">暂停 Ⅱ</button><button type="button" data-ss-replay>重播 ↻</button></div></div>
      <div class="ss-stage-grid" role="group" aria-label="四阶段策略图谱，点击固定查看">${stages.map((s,i)=>`<article class="ss-stage${i===0?' is-active':''}" data-ss-stage="${i}">
        <button type="button" class="ss-stage-select" data-ss-select="${i}" aria-pressed="${i===0}" aria-label="固定查看${s.name}阶段"><span class="ss-stage-overline">0${i+1}<small>${s.en}</small></span><span class="ss-stage-title"><b>${s.name}</b><svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${s.icon}</svg></span><span class="ss-share"><strong>${range(s.share)}</strong><small>${s.suffix}</small></span><span class="ss-share-caption">${s.shareLabel}</span></button>
        <div class="ss-strategy"><span class="ss-focus-label">资源投向</span><h2>${s.goal}</h2><p>${s.action}</p><span class="ss-focus-line"><i></i>${s.focus}</span></div>
        <div class="ss-pricing"><div class="ss-pricing-label"><span>相对区块均价</span><small>元 / 度 · 示例</small></div><strong>${range(s.price)}</strong>${priceGlyph(s)}<span class="ss-price-direction">${s.dir}</span></div>
      </article>`).join('')}</div>
      <div class="ss-diagnostics"><div class="ss-diagnostic"><span class="ss-imbalance" aria-hidden="true"><i></i><i></i></span><div><b>供给高，需求低</b><p>排查价格、设备体验、用户触达与位置匹配。</p></div><span class="ss-diagnostic-action">先查转化 ↗</span></div><div class="ss-diagnostic"><span class="ss-imbalance ss-imbalance-reverse" aria-hidden="true"><i></i><i></i></span><div><b>供给低，需求高</b><p>补充有效供给，识别热点网格与承接能力。</p></div><span class="ss-diagnostic-action">先补供给 ↗</span></div></div>
      <p class="ss-note">份额与价差为历史经验示例，非统一标准；边界、价格口径与人群梯度需按城市校准。价差图仅表达方向；四阶段不等于完整四象限。</p>
    </div>`;
  registry[4] = {title:'阶段不同，目标与投入就不同',html,mount(root){
    const host=root.querySelector('[data-ss-root]'),cards=[...host.querySelectorAll('[data-ss-stage]')],buttons=[...host.querySelectorAll('[data-ss-select]')],pause=host.querySelector('[data-ss-pause]'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
    let selected=0,elapsed=0,last=0,frame=0,playing=!reduce.matches,printing=false,disposed=false;
    function paint(){cards.forEach((card,i)=>card.classList.toggle('is-active',i===selected));buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));host.querySelector('[data-ss-position]').textContent='0'+(selected+1)+' / 04';host.style.setProperty('--ss-progress',elapsed/4100);host.classList.toggle('ss-paused',!playing||reduce.matches||document.hidden||printing);pause.textContent=reduce.matches?'静态模式':playing?'暂停 Ⅱ':'继续 ▶';pause.setAttribute('aria-pressed',String(!playing));pause.disabled=reduce.matches;}
    function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
    function tick(now){if(disposed)return;if(last)elapsed+=now-last;last=now;if(elapsed>=4100){elapsed=0;if(selected===3){playing=false;sync();return;}selected++;}paint();frame=requestAnimationFrame(tick);}
    function sync(){stop();paint();if(!disposed&&playing&&!reduce.matches&&!document.hidden&&!printing)frame=requestAnimationFrame(tick);}
    function click(e){const target=e.target.closest('[data-ss-select]');if(target){selected=Number(target.dataset.ssSelect);elapsed=0;playing=false;sync();}if(e.target.closest('[data-ss-pause]')){playing=!playing;if(playing&&selected===3){selected=0;elapsed=0;}sync();}if(e.target.closest('[data-ss-replay]')){selected=0;elapsed=0;playing=!reduce.matches;sync();}}
    function preference(){playing=!reduce.matches;elapsed=0;sync();}
    const before=()=>{printing=true;sync();},after=()=>{printing=false;sync();};
    host.addEventListener('click',click);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',preference);window.addEventListener('beforeprint',before);window.addEventListener('afterprint',after);host.classList.add('ss-ready');sync();
    return()=>{disposed=true;stop();host.removeEventListener('click',click);document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',preference);window.removeEventListener('beforeprint',before);window.removeEventListener('afterprint',after);};
  }};
})();
