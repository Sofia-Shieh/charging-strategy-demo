/* Fictional geography and prices demonstrate the pricing method, not real market data. */
(() => {
  const registry = window.DECK_ENHANCEMENTS ||= {};
  const stations = [['A','2.4','0.56','西侧居住区'],['B','3.2','0.58','东侧商务区'],['C','4.6','0.60','南侧交通节点']];
  const html = `<div class="report-head"><span class="report-kicker">06 / PRECISION PRICING</span><h1>精细化定价：一站一策，<em>一群一价。</em></h1><p class="report-deck">沿驾驶路径识别周边替代场站，将竞争盘点转化为分时、分人群的报价。</p></div>
  <div class="report-body pm-root" data-route="0">
    <div class="pm-layout">
      <div class="pm-map-panel" data-deck-no-swipe>
        <div class="pm-map-top"><span><i></i>本站与周边竞争场站</span><b>3–5 <small>km 驾驶范围</small></b></div>
        <div class="pm-map-stage">
          <svg class="pm-map" viewBox="0 0 760 430" preserveAspectRatio="none" aria-label="虚构地图：本站通过不同驾驶路线连接周边 A、B、C 三个充电站" role="img">
            <defs><pattern id="pm-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#d9ddd8" stroke-width=".5"/></pattern></defs>
            <rect width="760" height="430" fill="#f1f2ed"/><rect width="760" height="430" fill="url(#pm-grid)"/>
            <g fill="#e2e5de" stroke="#d9ddd5"><rect x="61" y="49" width="78" height="78" rx="8"/><rect x="194" y="47" width="97" height="80" rx="9"/><rect x="364" y="48" width="76" height="61" rx="8"/><rect x="497" y="44" width="63" height="60" rx="8"/><rect x="620" y="45" width="76" height="61" rx="8"/><rect x="58" y="180" width="92" height="72" rx="8"/><rect x="199" y="180" width="91" height="72" rx="8"/><rect x="365" y="249" width="59" height="28" rx="6"/><rect x="500" y="166" width="59" height="31" rx="5"/><rect x="620" y="165" width="79" height="87" rx="8"/><rect x="364" y="334" width="59" height="48" rx="7"/><rect x="486" y="359" width="72" height="35" rx="6"/><rect x="585" y="298" width="113" height="82" rx="8"/></g>
            <path d="M-30 350C90 292 176 322 222 404L260 462" fill="none" stroke="#d5ddd9" stroke-width="53"/>
            <path d="M0 150H760M330 0V430M470 0V430M0 300H760M165 0V270M592 0V430M0 218H760M470 134H760M450 300V430" fill="none" stroke="#d1d5ce" stroke-width="23" stroke-linejoin="round"/>
            <path d="M0 150H760M330 0V430M470 0V430M0 300H760M165 0V270M592 0V430M0 218H760M470 134H760M450 300V430" fill="none" stroke="#fff" stroke-width="19" stroke-linejoin="round"/>
            <g fill="#a4aaa2" font-size="10" font-family="sans-serif"><text x="66" y="94">居住组团</text><text x="214" y="95">生活配套</text><text x="628" y="212">商务园区</text><text x="603" y="345">交通枢纽</text><text x="78" y="231">公共停车</text></g>
            <ellipse cx="330" cy="218" rx="238" ry="163" fill="none" stroke="#b3b8ae" stroke-dasharray="5 8" opacity=".6"/>
            <g class="pm-route pm-route-a"><path class="pm-path-base" d="M330 218V150H165V93"/><path class="pm-route-flow" d="M330 218V150H165V93"/></g>
            <g class="pm-route pm-route-b"><path class="pm-path-base" d="M330 218H470V134H592"/><path class="pm-route-flow" d="M330 218H470V134H592"/></g>
            <g class="pm-route pm-route-c"><path class="pm-path-base" d="M330 218V300H450V333H533"/><path class="pm-route-flow" d="M330 218V300H450V333H533"/></g>
            <g transform="translate(718 30)"><path d="m0 0-5 16 5-3 5 3z" fill="#353b36"/><text y="-6" text-anchor="middle" font-size="9" fill="#686e67">N</text></g>
          </svg>
          <div class="pm-origin" aria-hidden="true">
            <span class="pm-origin-pulse"></span>
            <span class="pm-origin-marker"><svg viewBox="0 0 24 36" focusable="false"><path d="M16 1 2 22h10L9 36 24 15H14z" fill="currentColor"/></svg></span>
            <span class="pm-origin-label">本站</span>
          </div>
          ${stations.map((s,i)=>`<button class="pm-pin pm-pin-${i}" data-map-station="${i}" aria-pressed="${i===0}" aria-label="查看 ${s[0]} 站：驾驶距离 ${s[1]} 公里，示例价格 ${s[2]} 元每度"><b>${s[0]}</b><span>${s[2]}<small>元 / 度</small></span></button>`).join('')}
          <span class="pm-map-fiction">示意区块 · 非真实地理</span>
        </div>
        <div class="pm-route-caption"><div><b class="pm-selected">A 站</b><span class="pm-distance">2.4 km</span><small class="pm-area">西侧居住区</small></div><span>驾驶路径盘点 <i>→</i> 同口径采价</span></div>
      </div>
      <aside class="pm-price-panel"><div class="pm-benchmark"><span>示例竞争均价<small>谷时 · 非会员营运车 · 总价</small></span><strong>0.58<small>元 / 度</small></strong></div><div class="pm-average">（0.56 ＋ 0.58 ＋ 0.60）÷ 3 = 0.58</div>
        <div class="pm-price-row"><span><b>原价 / 私家车</b><small>基准 ＋ 0～5 分</small></span><strong>0.58–0.63</strong></div>
        <div class="pm-price-row"><span><b>非会员营运车</b><small>竞争区块均价</small></span><strong>0.58</strong></div>
        <div class="pm-price-row pm-member-price"><span><b>会员用户</b><small>基准 － 3～5 分</small></span><strong>0.53–0.55</strong></div>
        <div class="pm-price-caption">分层报价示例 · 元 / 度<span>最终仍按城市阶段与收益空间校准</span></div>
      </aside>
    </div>
    <div class="pm-bottom"><div><b>01 对齐比较条件</b><p>同一时段、身份与优惠口径，核对用户最终支付价。</p></div><div><b>02 拆分收益空间</b><p>总价看竞争力；电费、服务费与补贴分别核算。</p></div><div><b>03 持续校准价格</b><p>新站、数据异动或竞争变化时，重新盘点与调整。</p></div></div>
    <div class="pm-foot"><p>地图、距离、价格均为演示数据；圆圈仅示意范围，选站以驾驶可达性为准。</p><div><button data-map-pause aria-pressed="false">暂停演示 Ⅱ</button><button data-map-replay>重播 ↻</button></div></div>
  </div>`;
  registry[6] = {title:'精细化定价：一站一策，一群一价',html,mount(root){
    const panel=root.querySelector('.pm-root'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const pins=[...root.querySelectorAll('[data-map-station]')], pause=root.querySelector('[data-map-pause]');
    let selected=0,timer=null,paused=false,manual=false,disposed=false;
    const stop=()=>{clearInterval(timer);timer=null};
    const select=n=>{selected=n;panel.dataset.route=String(n);pins.forEach((p,i)=>p.setAttribute('aria-pressed',String(i===n)));root.querySelector('.pm-selected').textContent=stations[n][0]+' 站';root.querySelector('.pm-distance').textContent=stations[n][1]+' km';root.querySelector('.pm-area').textContent=stations[n][3]};
    const sync=()=>{stop();const frozen=paused||document.hidden||reduced.matches;panel.classList.toggle('pm-paused',frozen);pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'继续演示 ▶':'暂停演示 Ⅱ';pause.disabled=reduced.matches;if(reduced.matches)pause.textContent='静态模式';if(!frozen&&!manual&&!disposed)timer=setInterval(()=>select((selected+1)%3),3600)};
    const click=e=>{const pin=e.target.closest('[data-map-station]');if(pin){manual=paused=true;select(Number(pin.dataset.mapStation));sync()}if(e.target.closest('[data-map-pause]')){paused=!paused;if(!paused)manual=false;sync()}if(e.target.closest('[data-map-replay]')){paused=manual=false;select(0);panel.classList.remove('pm-enter');void panel.offsetWidth;panel.classList.add('pm-enter');sync()}};
    panel.classList.add('pm-enter');root.addEventListener('click',click);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);select(0);sync();
    return ()=>{disposed=true;stop();root.removeEventListener('click',click);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync)};
  }};
})();
