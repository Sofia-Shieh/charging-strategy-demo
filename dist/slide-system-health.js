/* Six visible dimensions, one guided reading path. No live business data. */
(() => {
  'use strict';
  const registry = window.DECK_ENHANCEMENTS ||= {};
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
  const pauseIcon = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M7 4v12m6-12v12"/></svg>';
  const replayIcon = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 8a6 6 0 1 1 0 4M4 3v5h5"/></svg>';
  const toolbar = (label) => '<div class="mx-toolbar"><div class="mx-guide"><span class="mx-guide-dot"></span><span>'+label+'</span><b data-mx-position>01 / 06</b></div><div class="mx-controls"><button type="button" data-mx-pause aria-label="暂停顺序演示">'+pauseIcon+'<span data-mx-pause-label>暂停</span></button><button type="button" data-mx-replay aria-label="从第一项重播">'+replayIcon+'<span>重播</span></button></div></div>';
  const head = (kicker,title,desc) => '<div class="report-head mx-head"><span class="report-kicker">'+kicker+'</span><h1>'+title+'</h1><p class="report-deck">'+desc+'</p></div>';
  const steps = [
    ['看清供需','盘点全量场站和市场电量，明确平台份额与竞争位置。','供需底盘'],
    ['判断阶段','识别空白、劣势、进阶或优势阶段，校准投入重点。','阶段目标'],
    ['配置策略','将分层定价、用户经营和商户阶段组合为行动方案。','策略组合'],
    ['执行落地','映射到场站、时段、人群、权益和营销配置。','执行清单'],
    ['监测健康','观察效率、价格、设备、覆盖和会员指标，定位异常。','机会清单'],
    ['复盘调整','对照基线和投入，验证效果，更新判断与策略模板。','可复用规则']
  ];
  const connections = [
    'M220 95H662', 'M662 95H1104', 'M1104 95H1306Q1320 95 1320 109V303Q1320 317 1306 317H1104',
    'M1104 317H662', 'M662 317H220', 'M220 317H18Q4 317 4 303V109Q4 95 18 95H220'
  ];
  const methodHtml = head('02 / THE OPERATING SYSTEM','把经营动作，组织成一套<em>方法。</em>','从市场判断到复盘反馈，让不同城市能够使用同一种经营语言。')+
    '<div class="report-body mx-method" data-mx-scene="method">'+toolbar('六个步骤 · 一个经营闭环')+
    '<div class="mx-loop-stage"><svg class="mx-loop-wires" viewBox="0 0 1324 412" preserveAspectRatio="none" aria-hidden="true">'+connections.map((path,i)=>'<path data-mx-wire="'+i+'" d="'+path+'"/>').join('')+'<circle class="mx-traveller-halo" data-mx-traveller-halo r="10" cx="220" cy="95"/><circle class="mx-traveller" data-mx-traveller r="4" cx="220" cy="95"/></svg><div class="mx-loop-nodes">'+steps.map((step,i)=>'<button type="button" class="mx-node mx-step-'+i+'" data-mx-node="'+i+'" aria-label="固定查看第 '+(i+1)+' 步：'+step[0]+'" aria-pressed="'+(i===0)+'"><span class="mx-node-heading"><span class="mx-step-number">0'+(i+1)+'</span><span class="mx-node-title">'+step[0]+'</span>'+arrow+'</span><span class="mx-node-description">'+step[1]+'</span><span class="mx-node-output"><span>阶段产出</span><b>'+step[2]+'</b></span></button>').join('')+'</div><span class="mx-return-label">持续迭代</span></div>'+
    '<div class="mx-system-summary"><span class="mx-return-symbol" aria-hidden="true">↺</span><div><strong>经营变化，反馈到下一轮判断</strong><p>定价是策略，生命周期决定对象与时机；营销承接目标，工具提升执行与复盘效率。</p></div><span class="mx-interaction-hint">点击节点 · 固定查看</span></div></div>';

  const icons = {
    efficiency:'<path d="M7 37h34"/><rect class="mx-icon-bar mx-bar-a" x="10" y="25" width="6" height="12" rx="1"/><rect class="mx-icon-bar mx-bar-b" x="22" y="18" width="6" height="19" rx="1"/><rect class="mx-icon-bar mx-bar-c" x="34" y="10" width="6" height="27" rx="1"/><path class="mx-icon-trace" d="M9 19l12-7 8 2 11-9m-8 0h8v8"/>',
    price:'<path d="M10 10h22l8 9-19 21L7 26V13z"/><circle cx="17" cy="18" r="2.5"/><path class="mx-icon-trace" d="M29 20v13m-6-6 6 6 6-6"/>',
    rational:'<path d="M10 9v30m14-30v30m14-30v30" opacity=".35"/><path d="M5 17h38M5 31h38"/><rect class="mx-icon-trace" x="8" y="12" width="8" height="10" rx="2"/><rect x="20" y="26" width="8" height="10" rx="2"/><rect class="mx-icon-trace" x="34" y="12" width="8" height="10" rx="2"/>',
    device:'<path d="M14 7h14a3 3 0 0 1 3 3v29H11V10a3 3 0 0 1 3-3zM7 40h28M31 17h6l4 5v10a3 3 0 0 1-6 0V24"/><rect x="16" y="12" width="10" height="7" rx="1"/><path class="mx-icon-trace" d="m23 23-5 7h6l-3 6"/>',
    grid:'<path d="M6 9h35v32H6zM6 20h35M6 31h35M17 9v32M29 9v32" opacity=".45"/><path class="mx-icon-trace" d="M26 6a9 9 0 0 1 9 9c0 6-9 14-9 14s-9-8-9-14a9 9 0 0 1 9-9z"/><circle cx="26" cy="15" r="3"/>',
    member:'<circle cx="21" cy="17" r="7"/><path d="M7 39v-5a12 12 0 0 1 24 0v5M33 12a6 6 0 0 1 0 12m1 4a9 9 0 0 1 8 9v2"/><path class="mx-icon-trace" d="m30 5 3-3 3 3m-3-3v7"/>'
  };
  const health = [
    {key:'efficiency',title:'单枪效率',metric:'&gt; 1',reference:'效率比 · 参考 1.2 / 1.5',definition:'本站单枪电量或单量 ÷ 周边同口径水平',action:'低于周边时，联查价格、位置与设备。'},
    {key:'price',title:'人群价格比',metric:'&lt; 1',reference:'本站 / 周边 · 同人群比较',definition:'比较同人群、同优惠口径的最终支付价格',action:'识别价格竞争力与可优化的收益空间。'},
    {key:'rational',title:'定价合理性',metric:'价差匹配',reference:'避免不合理的过大价差',definition:'检查人群之间、时段之间的价格梯度',action:'核验身份规则、优惠叠加与价格跳变。'},
    {key:'device',title:'设备异常率',metric:'&lt; 10% / 15%',reference:'经验观察线 · 示例',definition:'检查异常设备对有效可用供给的影响',action:'定位故障，推进修复并核对恢复情况。'},
    {key:'grid',title:'网格覆盖率',metric:'覆盖匹配',reference:'热力网格 × 驾驶可达性',definition:'判断需求热力与有效场站覆盖是否匹配',action:'对供给不足的热点网格补站、补枪。'},
    {key:'member',title:'付费会员渗透',metric:'渗透 × 价值',reference:'统一活跃用户分母',definition:'结合会员占比、频次、留存与价值判断',action:'优化开卡、续费、权益感知与提频。'}
  ];
  const healthHtml = head('09 / SIGNALS INTO ACTION','健康度，要能指向下一步<em>动作。</em>','定义指标、对标对象和观察窗口，再把异常信号连接到具体经营判断。')+
    '<div class="report-body mx-health" data-mx-scene="health">'+toolbar('六个维度 · 依次查看诊断逻辑')+
    '<div class="mx-health-grid">'+health.map((item,i)=>'<button type="button" class="mx-health-card mx-metric-'+item.key+'" data-mx-node="'+i+'" aria-label="固定查看'+item.title+'诊断逻辑" aria-pressed="'+(i===0)+'"><span class="mx-health-top"><span class="mx-health-icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[item.key]+'</svg></span><span class="mx-health-title">'+item.title+'</span><span class="mx-health-number">0'+(i+1)+'</span></span><span class="mx-health-value"><strong>'+item.metric+'</strong><small>'+item.reference+'</small></span><span class="mx-health-definition">'+item.definition+'</span><span class="mx-health-action"><b>行动</b><span>'+item.action+'</span></span><span class="mx-card-scan" aria-hidden="true"></span></button>').join('')+'</div>'+
    '<div class="mx-health-footer"><div class="mx-health-scope"><b>同口径贯穿</b><span>单站</span><i>→</i><span>区块</span><i>→</i><span>城市</span><i>→</i><span>全国</span></div><span>诊断维度示意 · 非实时业务数据</span></div><p class="mx-health-note">效率与异常率阈值为经验示例，需按城市阶段校准；单枪电量与单枪单量不可混用。</p></div>';

  function mountSequence(root) {
    const scene = root?.querySelector('[data-mx-scene]');
    if (!scene) return () => {};
    const nodes = Array.from(scene.querySelectorAll('[data-mx-node]'));
    const wires = Array.from(scene.querySelectorAll('[data-mx-wire]'));
    const movingDot = scene.querySelector('[data-mx-traveller]');
    const movingHalo = scene.querySelector('[data-mx-traveller-halo]');
    const pause = scene.querySelector('[data-mx-pause]');
    const replay = scene.querySelector('[data-mx-replay]');
    const pauseLabel = scene.querySelector('[data-mx-pause-label]');
    const position = scene.querySelector('[data-mx-position]');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const durations = scene.dataset.mxScene === 'method' ? 2400 : 2600;
    let selected = 0, elapsed = 0, lastTime = 0, raf = 0, disposed = false, printing = false;
    let reduced = preference.matches, playing = !reduced;
    const pathLengths = wires.map(path => path.getTotalLength());
    const removals = [];
    const on = (target, name, callback) => { target.addEventListener(name, callback); removals.push(() => target.removeEventListener(name, callback)); };

    function paint() {
      scene.dataset.mxActive = String(selected);
      scene.dataset.mxPaused = String(!playing || document.hidden || reduced || printing);
      scene.dataset.mxHidden = String(document.hidden);
      scene.dataset.mxReduced = String(reduced);
      scene.style.setProperty('--mx-progress',String(elapsed / durations));
      nodes.forEach((node,i) => { node.classList.toggle('mx-is-active',i === selected); node.setAttribute('aria-pressed',String(i === selected)); });
      wires.forEach((wire,i) => wire.classList.toggle('mx-is-active',i === selected));
      position.textContent = String(selected + 1).padStart(2,'0') + ' / 06';
      pauseLabel.textContent = reduced ? '静态展示' : playing ? '暂停' : '继续';
      pause.disabled = reduced;
      pause.setAttribute('aria-label',reduced ? '已遵循系统减少动态效果设置' : playing ? '暂停顺序演示' : '继续顺序演示');
      updateTraveller();
    }
    function updateTraveller() {
      if (!movingDot || !wires[selected]) return;
      // The signal travels through the visible connecting gaps, with no business-value simulation.
      const progress = Math.min(1, Math.max(0, (elapsed / durations - .2) / .8));
      const point = wires[selected].getPointAtLength(progress * pathLengths[selected]);
      movingDot.setAttribute('cx',String(point.x)); movingDot.setAttribute('cy',String(point.y));
      movingHalo.setAttribute('cx',String(point.x)); movingHalo.setAttribute('cy',String(point.y));
    }
    function stopFrame() { if (raf) cancelAnimationFrame(raf); raf = 0; lastTime = 0; }
    function schedule() { if (!disposed && playing && !reduced && !document.hidden && !printing && !raf) raf = requestAnimationFrame(tick); }
    function tick(time) {
      raf = 0;
      if (disposed || !playing || reduced || document.hidden || printing) { lastTime = 0; return; }
      if (lastTime) elapsed += Math.min(time - lastTime,80);
      lastTime = time;
      if (elapsed >= durations) { elapsed %= durations; selected = (selected + 1) % nodes.length; paint(); }
      updateTraveller();
      scene.style.setProperty('--mx-progress',String(elapsed / durations));
      schedule();
    }
    nodes.forEach((node,i) => on(node,'click',() => { selected = i; elapsed = 0; playing = false; stopFrame(); paint(); }));
    on(pause,'click',() => { if (reduced) return; playing = !playing; stopFrame(); paint(); schedule(); });
    on(replay,'click',() => { selected = 0; elapsed = 0; playing = !reduced; stopFrame(); scene.style.setProperty('--mx-progress','0'); paint(); schedule(); });
    on(document,'visibilitychange',() => { stopFrame(); paint(); schedule(); });
    const preferenceChanged = () => { reduced = preference.matches; playing = !reduced; elapsed = 0; stopFrame(); paint(); schedule(); };
    if (preference.addEventListener) on(preference,'change',preferenceChanged);
    else { preference.addListener(preferenceChanged); removals.push(() => preference.removeListener(preferenceChanged)); }
    const beforePrint = () => { printing = true; stopFrame(); paint(); };
    const afterPrint = () => { printing = false; paint(); schedule(); };
    on(window,'beforeprint',beforePrint); on(window,'afterprint',afterPrint);
    paint(); scene.classList.add('mx-is-ready'); schedule();
    return () => { disposed = true; stopFrame(); removals.forEach(remove => remove()); scene.classList.remove('mx-is-ready'); };
  }
  registry[2] = {title:'把经营动作，组织成一套方法',html:methodHtml,mount:mountSequence};
  registry[9] = {title:'健康度，要能指向下一步动作',html:healthHtml,mount:mountSequence};
})();
