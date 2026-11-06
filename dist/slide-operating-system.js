/* Three connected operating capabilities; six business steps remain visible. */
(() => {
  const registry=window.DECK_ENHANCEMENTS ||= {};
  const steps=[
    ['看清供需','盘点场站与市场电量，定位平台份额。','供需底盘'],
    ['判断阶段','识别四个经营阶段，校准目标与投入。','阶段目标'],
    ['配置策略','组合分层定价、用户经营与商户策略。','策略组合'],
    ['执行落地','落实到场站、时段、人群、权益与营销。','执行清单'],
    ['监测健康','联查效率、价格、设备、覆盖与会员。','机会清单'],
    ['复盘调整','对照基线与投入，验证效果、更新规则。','可复用规则']
  ];
  const visuals=[
    `<svg viewBox="0 0 380 154" role="img" aria-label="供给与需求信息汇合，形成城市阶段判断">
      <path class="os-wire" d="M100 43C157 43 147 77 196 77M100 111C157 111 147 77 196 77M196 77H228"/><path class="os-energy" d="M100 43C157 43 147 77 196 77H228M100 111C157 111 147 77 196 77"/>
      <g class="os-source"><rect x="20" y="23" width="82" height="40" rx="9"/><rect x="20" y="91" width="82" height="40" rx="9"/><text x="61" y="49" text-anchor="middle">供给</text><text x="61" y="117" text-anchor="middle">需求</text></g>
      <circle cx="196" cy="77" r="8" class="os-junction"/>
      <g class="os-quadrants"><rect x="230" y="20" width="62" height="52" rx="7"/><rect x="298" y="20" width="62" height="52" rx="7"/><rect x="230" y="80" width="62" height="52" rx="7"/><rect x="298" y="80" width="62" height="52" rx="7"/><text x="261" y="52" text-anchor="middle">空白</text><text x="329" y="52" text-anchor="middle">劣势</text><text x="261" y="112" text-anchor="middle">进阶</text><text x="329" y="112" text-anchor="middle">优势</text></g>
    </svg>`,
    `<svg viewBox="0 0 380 154" role="img" aria-label="城市策略分解到场站时段、人群权益和营销配置">
      <path class="os-wire" d="M124 77H164V30H232M164 77H232M164 77V124H232"/><path class="os-energy" d="M124 77H164V30H232M124 77H232M124 77H164V124H232"/>
      <rect class="os-strategy" x="20" y="45" width="106" height="64" rx="13"/><text class="os-strategy-label" x="73" y="72" text-anchor="middle">城市策略</text><text class="os-strategy-sub" x="73" y="92" text-anchor="middle">统一方法</text>
      <g class="os-config"><rect x="230" y="12" width="130" height="36" rx="7"/><rect x="230" y="59" width="130" height="36" rx="7"/><rect x="230" y="106" width="130" height="36" rx="7"/><text x="295" y="35" text-anchor="middle">场站 · 时段</text><text x="295" y="82" text-anchor="middle">人群 · 权益</text><text x="295" y="129" text-anchor="middle">营销配置</text></g>
      <circle cx="164" cy="77" r="5" class="os-junction"/>
    </svg>`,
    `<svg viewBox="0 0 380 154" role="img" aria-label="效率、价格、设备、覆盖、会员信号汇集到复盘，反馈下一轮经营判断">
      <g class="os-signal-labels"><text x="25" y="26">效率</text><text x="25" y="53">价格</text><text x="25" y="80">设备</text><text x="25" y="107">覆盖</text><text x="25" y="134">会员</text></g>
      <g class="os-ribbons"><path d="M74 16C161 16 187 65 269 67V74C187 74 160 33 74 33Z"/><path d="M74 43C161 43 187 72 269 73V78C187 78 160 58 74 59Z"/><path d="M74 69C161 69 187 77 269 78V82C187 82 160 85 74 86Z"/><path d="M74 97C161 97 187 82 269 82V87C187 87 160 112 74 113Z"/><path d="M74 122C161 122 187 86 269 87V94C187 94 160 140 74 140Z"/></g>
      <path class="os-flow-thread" d="M74 24C166 24 195 77 273 77M74 78C166 78 195 80 273 80M74 132C166 132 195 85 273 85"/>
      <circle cx="307" cy="80" r="36" class="os-review-disc"/><path class="os-return" d="M295 61a22 22 0 1 1-9 31m-5-17 4 18 17-5"/><text x="307" y="85" text-anchor="middle" class="os-review-label">复盘</text>
    </svg>`
  ];
  const titles=[['01 / UNDERSTAND','看清市场','从供需底盘，找到城市位置'],['02 / ORCHESTRATE','组织行动','把判断，变成可执行的配置'],['03 / ITERATE','反馈迭代','让经营信号，回到下一轮判断']];
  const html=`<div class="report-head os-head"><div class="report-kicker">02 / THE OPERATING SYSTEM</div><h1>把经营动作，组织成一套<em>方法。</em></h1><p class="report-deck">看清市场、组织行动、反馈迭代，让不同城市共用一套经营语言。</p></div>
    <div class="report-body os-root" data-os-root>
      <div class="os-reading-bar"><span><i></i>三个环节 · 六个步骤 · 持续迭代</span><div><b data-os-position>01 / 06</b><button type="button" data-os-pause aria-pressed="false">暂停 Ⅱ</button><button type="button" data-os-replay>重播 ↻</button></div></div>
      <div class="os-panels">${titles.map((title,g)=>`<section class="os-panel ${g===0?'is-active':''}" data-os-panel="${g}"><header><span>0${g+1}</span><h2>${title[1]}</h2></header><div class="os-visual">${visuals[g]}</div><div class="os-steps">${steps.slice(g*2,g*2+2).map((s,j)=>`<button class="os-step" type="button" data-os-step="${g*2+j}" aria-pressed="${g===0&&j===0}"><span class="os-step-title"><i>0${g*2+j+1}</i><b>${s[0]}</b><strong class="os-result">${s[2]} <span>↗</span></strong></span><span class="os-step-copy">${s[1]}</span></button>`).join('')}</div></section>`).join('')}</div>
      <div class="os-feedback"><span class="os-feedback-symbol">↺</span><b>每次复盘，都进入下一轮判断。</b><span class="os-feedback-tag">城市实践 → 中台规则 → 城市验证</span></div>
    </div>`;
  registry[2]={title:'把经营动作，组织成一套方法',html,mount(root){
    const host=root.querySelector('[data-os-root]'),buttons=[...host.querySelectorAll('[data-os-step]')],panels=[...host.querySelectorAll('[data-os-panel]')],pause=host.querySelector('[data-os-pause]'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
    let selected=0,elapsed=0,last=0,frame=0,playing=!reduce.matches,printing=false,disposed=false;
    function paint(){buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));panels.forEach((p,i)=>p.classList.toggle('is-active',i===Math.floor(selected/2)));host.querySelector('[data-os-position]').textContent='0'+(selected+1)+' / 06';host.style.setProperty('--os-progress',elapsed/3400);host.classList.toggle('os-paused',!playing||reduce.matches||document.hidden||printing);pause.textContent=reduce.matches?'静态模式':playing?'暂停 Ⅱ':'继续 ▶';pause.setAttribute('aria-pressed',String(!playing));pause.disabled=reduce.matches;}
    function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
    function tick(now){if(disposed)return;if(last)elapsed+=now-last;last=now;if(elapsed>=3400){elapsed=0;selected=(selected+1)%6;}paint();frame=requestAnimationFrame(tick);}
    function sync(){stop();paint();if(!disposed&&playing&&!reduce.matches&&!document.hidden&&!printing)frame=requestAnimationFrame(tick);}
    function click(e){const step=e.target.closest('[data-os-step]');if(step){selected=Number(step.dataset.osStep);elapsed=0;playing=false;sync();}if(e.target.closest('[data-os-pause]')){playing=!playing;sync();}if(e.target.closest('[data-os-replay]')){selected=0;elapsed=0;playing=!reduce.matches;sync();}}
    function preference(){playing=!reduce.matches;elapsed=0;sync();}
    const before=()=>{printing=true;sync();},after=()=>{printing=false;sync();};
    host.addEventListener('click',click);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',preference);window.addEventListener('beforeprint',before);window.addEventListener('afterprint',after);host.classList.add('os-enter');sync();
    return()=>{disposed=true;stop();host.removeEventListener('click',click);document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',preference);window.removeEventListener('beforeprint',before);window.removeEventListener('afterprint',after);};
  }};
})();
