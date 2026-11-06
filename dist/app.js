/* Buildless, offline-ready presentation. All data comes from the supplied brief. */
(() => {
  'use strict';
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const icons = {
    arrow:'<path d="M4 12h15M13 6l6 6-6 6"/>',
    left:'<path d="M15 5l-7 7 7 7"/>',
    expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    grid:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 115 0c0 2-2.5 2-2.5 4m0 3v.1"/>',
    close:'<path d="M6 6l12 12M6 18L18 6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    minus:'<path d="M5 12h14"/>',
    check:'<path d="M5 12l4 4L19 6"/>',
    bolt:'<path d="M13 2L4 14h7l-1 8 10-13h-7z"/>',
    quote:'<path d="M5 6h6v7H6c0 3-1 4-3 5m12-12h6v7h-5c0 3-1 4-3 5"/>'
  };
  const icon=(name)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';
  const assetButton=(name,label)=>'<button class="source-button" data-image="'+name+'">'+label+' <span>↗</span></button>';
  const tag=(t)=>'<span class="tag">'+t+'</span>';
  const line=(n,title,text)=>'<div class="list-line"><span class="line-no">'+n+'</span><div><h3>'+title+'</h3><p>'+text+'</p></div></div>';
  const chips=(items)=>'<div class="chips">'+items.map(tag).join('')+'</div>';
  const section=(eyebrow,title,desc,body,extra='')=>'<div class="slide-top"><span class="eyebrow">'+eyebrow+'</span><h1>'+title+'</h1>'+(desc?'<p class="lead">'+desc+'</p>':'')+'</div><div class="slide-body '+extra+'">'+body+'</div>';
  const footer=(text)=>'<div class="slide-footnote">'+text+'</div>';
  const cityArt='<svg class="city-art" viewBox="0 0 440 240" fill="none" aria-hidden="true"><path d="M-30 72L180 200 468 35M-10 160L148 63 412 221M132-20L414 151M35 15L326 193M88 232L362 64" stroke="#b4c8d0" stroke-width="18"/><path d="M-30 72L180 200 468 35M-10 160L148 63 412 221M132-20L414 151M35 15L326 193M88 232L362 64" stroke="#f7fbfc" stroke-width="14"/><path class="route-path" d="M60 143l88-54 91 55 100-61" stroke="#456b7b" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 7"/><circle cx="239" cy="144" r="34" fill="#051a24"/><path d="M244 121l-19 27h13l-3 19 19-27h-13z" fill="#e5edcf"/><circle cx="60" cy="143" r="8" fill="#f4af8b" stroke="white" stroke-width="5"/><circle cx="339" cy="83" r="8" fill="#f4af8b" stroke="white" stroke-width="5"/></svg>';
  const reportSection=(kicker,title,description,body)=>'<div class="report-head"><span class="report-kicker">'+kicker+'</span><h1>'+title+'</h1><p class="report-deck">'+description+'</p></div><div class="report-body">'+body+'</div>';
  const reportNote=(text)=>'<div class="report-note">'+text+'</div>';
  const reportStrip=(label,text)=>'<div class="report-strip"><strong>'+label+'</strong><p>'+text+'</p></div>';
  const slides=[
    {title:'让增长，成为运营的结果。',chapter:'开场 · 实践分享',en:'INTRODUCTION',html:window.EV_HERO_HTML},
    {title:'增长，要有质量',chapter:'开场 · 经营命题',en:'THE OPERATING QUESTION',html:reportSection('01 / THE OPERATING QUESTION','增长，要有<em>质量。</em>','订单、份额、利润一起看，才能知道增长来自哪里、能否持续。',
      '<div class="report-grid report-grid-3">'+[
        ['01 / VOLUME','订单','用户是否持续选择平台？','拆分新客、复购与频次，区分市场自然增长和运营动作带来的变化。','看增长来源，也看后续留存。'],
        ['02 / SHARE','份额','平台在当地处于什么位置？','对齐城市与区块的供给、需求份额，判断是覆盖不足，还是需求承接不足。','份额变化要放回大盘比较。'],
        ['03 / PROFIT','利润','现有增长能否长期维持？','结合价格、平台补贴与商户共担，观察订单增长对应的经营贡献。','提价与补贴都要看持续效果。']
      ].map(x=>'<article class="report-box report-metric"><span class="report-overline">'+x[0]+'</span><h2>'+x[1]+'</h2><p class="report-metric-question">'+x[2]+'</p><p>'+x[3]+'</p><p class="report-metric-rule">'+x[4]+'</p></article>').join('')+'</div><div class="report-practice"><span>4 年＋城市实践</span><div><strong>劣势阶段<em>↗</em>进阶阶段</strong><small>为平台充电订单增长与城市份额负责</small></div><div><strong>亏损<em>↗</em>盈利</strong><small>在增长过程中校准价格、投入与经营效率</small></div></div>'+reportStrip('中台要解决','将一线判断沉淀为可比较的数据、可选择的策略与可验证的执行规则。'))},
    {title:'把经营动作，组织成一套方法',chapter:'开场 · 方法框架',en:'THE OPERATING SYSTEM',html:reportSection('02 / THE OPERATING SYSTEM','把经营动作，组织成一套<em>方法。</em>','从市场判断到复盘反馈，让不同城市能够使用同一种经营语言。',
      '<div class="report-grid report-system-grid">'+[
        ['01','看清供需','盘点全量场站和市场电量，明确平台份额与竞争位置。','产出：供需底盘'],
        ['02','判断阶段','识别空白、劣势、进阶或优势阶段，校准投入重点。','产出：阶段目标'],
        ['03','配置策略','将分层定价、用户经营和商户阶段组合为行动方案。','产出：策略组合'],
        ['04','执行落地','映射到场站、时段、人群、权益和营销配置。','产出：执行清单'],
        ['05','监测健康','观察效率、价格、设备、覆盖和会员指标，定位异常。','产出：机会清单'],
        ['06','复盘调整','对照基线和投入，验证效果，更新判断与策略模板。','产出：可复用规则']
      ].map(x=>'<article class="report-box"><span class="report-number">'+x[0]+'</span><div><h3>'+x[1]+'</h3><p>'+x[2]+'</p><small>'+x[3]+'</small></div></article>').join('')+'</div><div class="report-loop"><span>↺</span><b>经营变化 → 下一轮判断</b><p>定价是策略，生命周期决定对象与时机；营销承接目标，工具提升执行与复盘效率。</p></div>')},
    {title:'先看清供需，再判断机会',chapter:'一 · 市场与阶段',en:'01 / MARKET INTELLIGENCE',html:reportSection('03 / SUPPLY & DEMAND','先看清供需，再判断<em>机会。</em>','建立全国—城市—区块—单站数据底盘，支持份额、效率和投入比较。',
      '<div class="report-grid report-grid-2 report-market"><article class="report-box"><span class="report-overline">SUPPLY / 全量场站数据库</span><h2>市场上，有什么供给？</h2><div class="report-field"><strong>基础字段</strong><div>场站名、商户、运营商、底层接入、场站属性</div></div><div class="report-field"><strong>设备结构</strong><div>公共快充 / 超充 / 慢充枪数，实际可用情况</div></div><div class="report-field"><strong>位置场景</strong><div>地址、行政区域、周边配套与服务场景</div></div><div class="report-channel"><b>盘点渠道</b><p>充电 App：滴滴 / 新电途 / 星星 / 特来电 / 快电<br>图商：高德 / 百度 / 腾讯；地方充电小程序</p></div></article><article class="report-box report-dark"><span class="report-overline">DEMAND / 全城月均电量</span><h2>城市，需要多少电量？</h2><div class="report-demand-row"><span>01</span><div><h3>车辆结构 × 充电行为</h3><p>私家车、网约车、物流车、公交车分别测算。</p><span class="report-formula">车辆数 × 充电频次 × 单次电量 × 公共充电比例</span></div></div><div class="report-demand-row"><span>02</span><div><h3>地方公开数据交叉校准</h3><p>结合省市充电平台月报、季报、年报及油转电变化。</p></div></div><div class="report-demand-row"><span>03</span><div><h3>平台连接运营商电量反推</h3><p>明确样本覆盖与代表性，估计市场整体需求。</p></div></div></article></div><div class="report-shares"><div><b>供给份额</b>平台有效连接枪数 / 同口径公共枪数</div><div><b>需求份额</b>平台充电电量 / 同口径市场充电电量</div></div>'+reportNote('建议统一对象、地理范围、时间与分母；场站去重并记录更新时间，单枪电量与单枪单量分开评价。'))},
    {title:'阶段不同，目标与投入就不同',chapter:'一 · 市场与阶段',en:'01 / CITY STRATEGY',html:reportSection('04 / STAGE-BASED STRATEGY','阶段不同，目标与投入就<em>不同。</em>','城市与区块采用同一判断框架，再分解对全国、城市经营的贡献。',
      '<div class="report-table-frame"><table class="report-table report-stages"><colgroup><col style="width:13%"><col style="width:25%"><col style="width:36%"><col style="width:26%"></colgroup><thead><tr><th>经营阶段</th><th>供给 / 需求份额示例</th><th>经营目标与投入重点</th><th>相对区块均价的策略示例</th></tr></thead><tbody><tr><td>空白</td><td>供给 0% / 需求 0%</td><td><strong>供给优先</strong><small>先建立有效场站覆盖，再承接初始需求</small></td><td class="report-cell-accent">低 0.10 元＋</td></tr><tr><td>劣势</td><td>两侧约 1%–30%</td><td><strong>新增供给，获取需求</strong><small>补覆盖，同时增强价格与触达竞争力</small></td><td class="report-cell-accent">低约 0.05 元</td></tr><tr><td>进阶</td><td>两侧约 30%–50%</td><td><strong>需求优先，提高效率</strong><small>提升现有供给利用，识别高贡献区块</small></td><td class="report-cell-accent">持平至高 0.05 元</td></tr><tr><td>优势</td><td>两侧约 50% 及以上</td><td><strong>维稳与收益优化</strong><small>维护用户和商户关系，减少无效让利</small></td><td class="report-cell-accent">高 0.05–0.10 元＋</td></tr></tbody></table></div><div class="report-diagnosis"><div><b>供给高、需求低</b><p>优先排查价格、设备体验、用户触达与位置匹配。</p></div><div><b>供给低、需求高</b><p>优先补充有效供给，识别热点网格与承接能力。</p></div></div>'+reportNote('份额及价差为历史经验示例，非统一标准；边界、价格口径与人群梯度需按城市校准。四阶段不等于完整四象限。'))},
    {title:'不同人群，不同的价格与价值感',chapter:'二 · 分层定价',en:'02 / SEGMENTED PRICING',html:reportSection('05 / UNDERSTAND THE CUSTOMER','不同人群，不同的价格与<em>价值感。</em>','按身份和权益定义用户，再用实际行为验证价格敏感度与频次假设。',
      '<div class="report-grid report-grid-3">'+[
        ['01 / PRIVATE','私家车用户','非会员 · 非营运车','工作日路线较固定，重视充电效率和场站体验；周末与节假日关注目的地补能。','相对低价敏、低频次','高 0.05','元 / 度左右'],
        ['02 / OPERATING','营运车用户','非会员 · 已认证营运车','网约车、物流等日常补能频繁，综合考虑价格、可用枪数与补能时间。','中价敏、中频次','高 0～0.03','元 / 度'],
        ['03 / MEMBERSHIP','付费会员','滴滴充电会员权益用户','高频补能，希望通过会员价、券包与会员日获得持续、可感知的节省。','高价敏、高频次','低 0.03–0.05','元 / 度']
      ].map(x=>'<article class="report-box report-persona"><span class="report-overline">'+x[0]+'</span><h2>'+x[1]+'</h2><div class="report-persona-tag">'+x[2]+'</div><p>'+x[3]+'</p><dl><dt>'+x[4]+' · 初始价差倾向示例</dt><dd>'+x[5]+' <small>'+x[6]+'</small></dd></dl></article>').join('')+'</div><div class="report-action-row"><p>会员身份可能与营运身份重合；需明确适用优先级、活动叠加和最终到手价。</p>'+assetButton('segmentation','查看分层方法原图')+'</div>'+reportNote('价格偏移为原始经验口径，实际以单站竞争基准与城市阶段校准；原图 +3% 为限定样本实验结论，不作为本次分享者业绩。'))},
    {title:'单站定价，先找到真实竞争锚点',chapter:'二 · 分层定价',en:'02 / THE PRICING ANCHOR',html:reportSection('06 / DEFINE THE BENCHMARK','单站定价，先找到真实竞争<em>锚点。</em>','以用户可替代选择为基准，再叠加区块阶段和人群价格规则。',
      '<div class="report-grid report-anchor"><article class="report-radius"><div class="report-radius-number">3–5<small>km 驾驶距离</small></div><h2>盘点周边可替代场站</h2><p>按站、按时段形成竞争区块价格；不能只按直线距离或全城平均价判断竞争力。</p><div class="report-compare-tags"><span>同一充电时段</span><span>同一用户身份</span><span>同一活动口径</span><span>核对最终支付价</span></div></article><article class="report-box report-price-rules"><span class="report-overline">BENCHMARK / 竞争区块均价</span><h2>从锚点生成分层报价</h2><div class="report-price-line"><b>原价 / 私家车</b><strong>均价 ＋ 0～5 分</strong></div><div class="report-price-line"><b>非会员营运车</b><strong>竞争区块均价</strong></div><div class="report-price-line"><b>会员用户</b><strong>均价 － 3～5 分</strong></div></article></div><div class="report-three-checks"><div><b>总价看竞争力</b><p>电费＋服务费－优惠，比较用户真实到手价。</p></div><div><b>拆分看收益空间</b><p>区分商户让利与平台补贴，核对各方承担。</p></div><div><b>场景决定调整频率</b><p>新站定价、数据异动、竞争变化时重新校准。</p></div></div>'+reportNote('人群价差为示例，单位分 / 度；中台统一方法与模板，城市补充本地竞争并验证经营效果。'))},
    {title:'同一场站，如何形成分层调价方案',chapter:'二 · 分层定价',en:'02 / PRICING IN PRACTICE',html:reportSection('07 / A REAL PRICING PROPOSAL','同一场站，如何形成分层<em>调价方案。</em>','以原始定价表第一处场站的谷时段为例，把盘点结果转化为可执行报价。',
      '<div class="report-grid report-case"><div><div class="report-case-bill"><span>谷时电费保持不变</span><strong>0.32 <small>元 / 度</small></strong></div><div class="report-table-frame"><table class="report-table"><colgroup><col style="width:25%"><col style="width:20%"><col style="width:20%"><col style="width:20%"><col style="width:15%"></colgroup><thead><tr><th>用户类型</th><th>当前服务费</th><th>建议服务费</th><th>总价变化</th><th>增额</th></tr></thead><tbody><tr><td>私家车</td><td>0.11</td><td class="report-cell-accent">0.20</td><td>0.43 → 0.52</td><td>＋0.09</td></tr><tr><td>非会员营运车</td><td>0.09</td><td class="report-cell-accent">0.15</td><td>0.41 → 0.47</td><td>＋0.06</td></tr><tr><td>会员</td><td>0.09</td><td class="report-cell-accent">0.15</td><td>0.41 → 0.47</td><td>＋0.06</td></tr></tbody></table></div></div><aside class="report-case-visual"><span class="report-overline">SOURCE / 场站分层定价原表</span><button class="report-case-thumbnail" data-image="pricing" aria-label="放大完整定价表"><img src="assets/pricing.jpg" alt="原始场站分层定价方案表"></button><p>私家车与其他人群的价差由 2 分扩大到 5 分；本方案中营运车与会员同价。</p>'+assetButton('pricing','查看完整定价表')+'</aside></div><div class="report-case-conclusion"><div><b>方案说明了什么</b><p>同站、同时段可采用不同调幅；人群价格梯度允许结合场站情况调整。</p></div><div><b>落地后验证什么</b><p>订单与电量是否稳定、用户结构是否变化、补贴与度均收益是否改善。</p></div></div>'+reportNote('单位：元 / 度。本页为定价建议，不代表调价后的经营结果；原表均价样本范围需另行核对。'))},
    {title:'从策略，走到可核对的执行配置',chapter:'二 · 分层定价',en:'02 / FROM STRATEGY TO EXECUTION',html:reportSection('08 / MAKE IT EXECUTABLE','从策略，走到可核对的<em>执行配置。</em>','把价格方案拆成配置单元，让城市执行、平台核验和后续复盘对应到同一版本。',
      '<div class="report-grid report-config"><div class="report-config-visual"><div class="report-config-path"><b>场站</b><span>×</span><b>时段</b><span>×</span><b>人群</b><span>×</span><b>价格 / 优惠</b></div><button class="report-config-picture" data-image="configuration" aria-label="放大分时段与分人群配置原图"><img src="assets/configuration.jpg" alt="场站按时段和人群配置服务费、总价、优惠及变化幅度的原始表格"></button><div class="report-action-row"><p>原表同时保留服务费、总价、分层优惠与变化幅度。</p>'+assetButton('configuration','放大原图')+'</div></div><aside class="report-checklist"><h2>执行前的四项核对</h2>'+[
      ['01','价格组成','电费与服务费分别记录，核对分时总价。'],['02','人群权益','私家车、营运车、会员适用规则与优先级一致。'],['03','活动叠加','优惠券、会员价与促销组合后，最终支付价符合预期。'],['04','实际展示','核对生效时间、前端展示与商户结算口径。']
      ].map(x=>'<div class="report-check"><span>'+x[0]+'</span><div><b>'+x[1]+'</b><p>'+x[2]+'</p></div></div>').join('')+'</aside></div>'+reportStrip('中台沉淀','建立配置模板和变更记录：保留调价原因、目标人群、生效时间与观察窗口，让价格动作能够与经营变化对应。')+reportNote('本页为执行配置示例；实际价格以经核对的方案及生效版本为准。'))},
    {title:'健康度，要能指向下一步动作',chapter:'三 · 经营健康度',en:'03 / BUSINESS HEALTH',html:reportSection('09 / SIGNALS INTO ACTION','健康度，要能指向下一步<em>动作。</em>','定义指标、对标对象和观察窗口，再把异常信号连接到具体经营判断。',
      '<div class="report-table-frame"><table class="report-table report-health"><colgroup><col style="width:16%"><col style="width:33%"><col style="width:22%"><col style="width:29%"></colgroup><thead><tr><th>指标</th><th>看什么</th><th>经验参考 / 判断方式</th><th>对应动作</th></tr></thead><tbody>'+[
      ['单枪效率','本站单枪电量或单量 / 周边同口径水平','&gt;1；参考 1.2 / 1.5','低于周边时联查价格、位置与设备。'],
      ['人群价格比','同人群、同优惠口径的最终支付价格','价格比低于 1','识别竞争力与可优化的收益空间。'],
      ['定价合理性','人群之间、时段之间的价差结构','避免不合理的过大价差','核验身份规则、优惠叠加与价格跳变。'],
      ['设备异常率','异常设备对有效可用供给的影响','低于 10% / 15%（示例）','定位故障，推进修复并核对恢复情况。'],
      ['网格覆盖率','需求热力与有效场站覆盖是否匹配','热力网格与驾驶可达性','对供给不足的热点网格补站、补枪。'],
      ['付费会员渗透','会员占比及其频次、留存和价值','统一活跃用户分母','优化开卡、续费、权益感知与提频。']
      ].map(x=>'<tr><td>'+x[0]+'</td><td>'+x[1]+'</td><td class="report-cell-accent">'+x[2]+'</td><td>'+x[3]+'</td></tr>').join('')+'</tbody></table></div><div class="report-scope"><b>同口径贯穿</b><span>单站</span>→<span>区块</span>→<span>城市</span>→<span>全国</span></div>'+reportNote('效率与异常率阈值为经验示例，非固定考核线；必须结合城市阶段校准。单枪电量与单枪单量不可混用。'))},
    {title:'C端生命周期：让策略对应阶段目标',chapter:'四 · 生命周期',en:'04 / CUSTOMER LIFECYCLE',html:reportSection('10 / THE CUSTOMER JOURNEY','C 端生命周期：让策略对应<em>阶段目标。</em>','按用户行为定义人群，先明确希望发生的变化，再选择优惠与触达方式。',
      '<div class="report-table-frame"><table class="report-table report-lifecycle"><colgroup><col style="width:13%"><col style="width:23%"><col style="width:37%"><col style="width:27%"></colgroup><thead><tr><th>用户阶段</th><th>阶段目标</th><th>可用策略</th><th>重点观察</th></tr></thead><tbody>'+[
        ['拉新','曝光 → 首次体验','新用户券 / 前三单梯度折扣 / 裂变拉新','首单转化、获客投入与后续留存'],
        ['培育','促成复购，形成习惯','多单折扣 / 冲单激励，承接新用户体验','第二、三单转化与复购周期'],
        ['提频','增加有效活跃','定期福利大促 / 天降红包 / 抽奖 / 冲单','充电频次、增量订单与投入产出'],
        ['忠诚','深化长期关系','付费会员锁客：会员价 / 券包 / 会员日','会员渗透、续费与用户价值'],
        ['召回','推动流失用户回归','回归特价 / 召回券包 / 开卡特惠','回流后是否持续使用，而非只领券']
      ].map(x=>'<tr><td>'+x[0]+'</td><td>'+x[1]+'</td><td>'+x[2]+'</td><td>'+x[3]+'</td></tr>').join('')+'</tbody></table></div>'+reportStrip('统一分群与评价','召回可按近 15 / 30 / 60 / 90 天流失窗口分组；共同评价订单、ROI、充电频次、会员与端内网约车人群渗透。')+reportNote('同一用户可能具备多种身份，需统一去重、活动互斥与归因口径，避免重复补贴和重复计算。'))},
    {title:'B端生命周期：从起量到稳定收益',chapter:'四 · 生命周期',en:'04 / MERCHANT LIFECYCLE',html:reportSection('11 / THE MERCHANT JOURNEY','B 端生命周期：从起量到稳定<em>收益。</em>','以场站成熟度安排价格和运营节奏，同时看平台与商户各自承担的成本。',
      '<div class="report-grid report-merchant">'+[
        ['约 7','日','新站阶段','先获得初始流量','低价引流，全渠道推送，帮助用户发现和首次体验场站。','核对位置、设备和配置，观察新增用户与初始电量。','观察：单枪电量 / 拉新'],
        ['约 14','日','次新站阶段','稳定电量，逐步提价','根据竞争与用户反馈逐步校准价格，减少对低价引流的依赖。','在电量稳定的前提下改善度均收益，避免一次性跳涨。','观察：电量稳定性 / 度均收益'],
        ['14–30','日','稳定阶段','转向长期单枪收益','价格逐步对齐竞争区块均价，持续监测用户、设备与竞争变化。','以单枪收益为目标稳定经营，再决定维持或追加投入。','观察：单枪收益 / 长期经营质量']
      ].map((x,i)=>'<article class="report-box '+(i===2?'report-dark':'')+'"><div class="report-window"><strong>'+x[0]+'<small>'+x[1]+'</small></strong><span>'+x[2]+'</span></div><h2>'+x[3]+'</h2><p>'+x[4]+'</p><p style="margin-top:12px">'+x[5]+'</p><small class="report-step-metric">'+x[6]+'</small></article>').join('')+'</div>'+reportStrip('同步核算','商户共担比例、平台补贴、单枪电量 / 收益 / 拉新一起看。电量增长只有结合双方成本，才能判断经营质量。')+reportNote('7 日、14 日、14–30 日为原始阶段观察窗口，不机械理解为累计天数；实际节奏随场站表现调整。'))},
    {title:'让每一场活动，都有经营目标',chapter:'五 · 营销体系',en:'05 / PURPOSEFUL MARKETING',html:reportSection('12 / A FRAMEWORK TO BUILD','让每一场活动，都有<em>经营目标。</em>','建议体系：营销承接城市阶段与生命周期，沉淀场景策略，而非孤立发券。',
      '<div class="report-mini-flow">'+[['01','目标','解决什么问题'],['02','人群','明确触达对象'],['03','活动','匹配权益形式'],['04','成本','确定双方共担'],['05','效果','验证增量价值']].map(x=>'<div><b>'+x[0]+'</b><span>'+x[1]+'<small>'+x[2]+'</small></span></div>').join('')+'</div><div class="report-table-frame"><table class="report-table report-marketing"><colgroup><col style="width:17%"><col style="width:22%"><col style="width:34%"><col style="width:27%"></colgroup><thead><tr><th>经营场景</th><th>目标人群</th><th>活动组合示例</th><th>评价重点</th></tr></thead><tbody>'+[
        ['新站冷启动','周边潜在人群','曝光推送＋首次体验价','初始电量、拉新与投入'],
        ['新客转复购','完成首单的新用户','多单折扣＋梯度激励','第二、三单与后续留存'],
        ['会员提频','活跃 / 潜在会员','会员价＋券包＋会员日','频次、续费和会员价值'],
        ['流失召回','按流失时长分层','回归特价＋定向召回券','回流率、持续使用与成本']
      ].map(x=>'<tr>'+x.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+reportStrip('复盘原则','对照活动前基线或可比人群，识别新增使用；平台补贴、商户让利与后续留存同时进入评价。')+reportNote('本页为营销体系建设建议；具体活动需结合当地竞争、预算和用户数据验证。'))},
    {title:'把重复动作，交给工具',chapter:'六 · 工具与协同',en:'06 / TOOLS THAT COMPOUND',html:reportSection('13 / BUILD THE CAPABILITY','把重复动作，交给<em>工具。</em>','优先覆盖高频、重复的运营工作，把时间留给判断、商户沟通与策略验证。',
      '<div class="report-table-frame"><table class="report-table report-tool-table"><colgroup><col style="width:15%"><col style="width:28%"><col style="width:32%"><col style="width:25%"></colgroup><thead><tr><th>能力模块</th><th>输入与覆盖范围</th><th>具体应用</th><th>预期价值与必要条件</th></tr></thead><tbody>'+[
      ['数据看板','大盘供需 / 新站表现 / 单站异动','按近一周、月、季、年观察；联查订单、电量、价格与设备。','减少找数对数；统一指标口径。'],
      ['配置工具','定价查询 / 批量调价 / 营销设置','在内部接口可用时，将查询、测算和配置串成一体化操作。','减少重复操作；变更可核对、可追溯。'],
      ['AI 辅助分析','商户复盘 / 选址 / 经营报告','整理材料、生成分析草稿，将结论对应到数据与业务规则。','加快报告产出；关键判断由业务核验。'],
      ['外部数据校准','供应商价格 / 电量等采买数据','补充市场覆盖，交叉核对竞争价格和全量电量估计。','提高大盘可信度；核对覆盖、更新时间与口径。']
      ].map(x=>'<tr>'+x.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+reportStrip('建设优先级','先把数据查准，再把动作配准，最后让复盘更快。工具效果取决于稳定的数据、清晰的规则和可用接口。')+reportNote('本页为能力建设建议，不将规划中的工具描述为已上线成果；外部数据与 AI 输出均需校准。'))},
    {title:'中台与城市，共同完成策略验证',chapter:'六 · 工具与协同',en:'06 / A SHARED OPERATING MODEL',html:reportSection('14 / WORK BETTER TOGETHER','中台与城市，共同完成<em>策略验证。</em>','协同建议：中台提供一致的方法和工具，城市补充现场信息并推动落地。',
      '<div class="report-table-frame"><table class="report-table report-collab"><colgroup><col style="width:15%"><col style="width:34%"><col style="width:33%"><col style="width:18%"></colgroup><thead><tr><th>协同事项</th><th>中台：统一与支持</th><th>城市：现场与执行</th><th>共同产出</th></tr></thead><tbody>'+[
      ['市场判断','统一供需口径、阶段框架和比较方法','补充本地场站、竞争与需求变化','阶段目标'],
      ['策略配置','沉淀定价、生命周期与营销模板','结合商户和用户情况调整执行组合','行动清单'],
      ['异常处置','看板发现异常，提供定位路径','核实设备、商户、价格和体验问题','问题闭环'],
      ['效果复盘','统一观察窗口和效果评价，沉淀有效规则','反馈执行结果、例外情况与新的约束','更新后的规则']
      ].map(x=>'<tr>'+x.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><div class="report-feedback"><strong>一次反馈示例</strong><p><b>原判断</b>需求偏低，计划补贴拉动。</p><p><b>现场核实</b>设备可用性限制了转化。</p><p><b>共同调整</b>优先修复供给，再验证需求策略。</p></div>'+reportNote('将计划、执行、监测、反馈串在同一观察周期里，才能让一线经验成为跨城市可复用的方法。'))},
    {title:'先统一判断，再持续验证',chapter:'总结 · 交流',en:'LET’S KEEP THE CONVERSATION GOING',html:reportSection('15 / FROM EXPERIENCE TO WHAT’S NEXT','先统一判断，再持续<em>验证。</em>','从城市实践走向中台方法：不是复制某一次动作，而是形成可复用的判断过程。',
      '<div class="report-grid report-close-grid">'+[
        ['01 / UNDERSTAND','看清供需','统一市场口径，盘点有效供给与真实需求，明确平台位置和优先机会。'],
        ['02 / MATCH','匹配阶段','把城市、区块、人群与场站所处阶段，转化为价格、运营和资源投入组合。'],
        ['03 / VALIDATE','持续验证','以健康度监测和经营复盘校准策略，用数据、规则与工具积累可复用经验。']
      ].map(x=>'<article class="report-box"><span class="report-overline">'+x[0]+'</span><h2>'+x[1]+'</h2><p>'+x[2]+'</p></article>').join('')+'</div><div class="report-pilot"><strong>从一个城市开始</strong><p>选定试点与观察窗口 → 对齐供需基线和阶段目标 → 配置一组可验证动作 → 复盘订单、份额、收益与成本，决定扩展或调整。</p></div><div class="report-close-question"><h2>我们最优先需要验证什么？<br>市场判断、价格策略，还是用户与商户运营？</h2><div class="cover-actions"><button class="button primary" data-action="overview">回顾全部页面 '+icon('grid')+'</button><button class="button secondary" data-go="0">回到开场</button></div></div><div class="report-closing-note">THANK YOU · 让一线经验，成为下一步可执行的方法。</div>')}
  ];
  const enhancements=window.DECK_ENHANCEMENTS||{};
  Object.entries(enhancements).forEach(([key,definition])=>{const n=Number(key);if(Number.isInteger(n)&&n>=0&&n<slides.length&&typeof definition.html==='string'){slides[n].html=definition.html;slides[n].mount=definition.mount;if(definition.title)slides[n].title=definition.title}});
  slides.splice(1,0,{title:'王榕榕 · 从城市现场到运营方法',chapter:'自我介绍 · 工作经历',en:'ABOUT ROWAN',html:window.PresenterProfile.html,mount:window.PresenterProfile.mount});
  const pageLabel=n=>String(n).padStart(2,'0');
  const lastPage=slides.length-1;
  slides.forEach((slide,i)=>{if(i<2)return;slide.html=slide.html.replace(/(class="(?:report-kicker|opening-kicker)[^"]*"[^>]*>)\d{2}(\s*\/)/,(match,prefix,suffix)=>prefix+pageLabel(i)+suffix)});
  const notes=[...(window.SPEAKER_NOTES||[])];
  notes.splice(1,0,{title:'王榕榕 · 自我介绍',duration:60,paragraphs:[
    '大家好，我是王榕榕，英文名 rowan。我曾在阿里巴巴本地生活工作五年以上，之后在滴滴充电从事四年以上策略运营工作，曾任区域策略运营负责人。',
    '在阿里巴巴，我从城市经理到区域商户运营，参与连锁品牌与区域商户拓展，围绕商户全生命周期开展运营，并联动品牌、商户与平台资源，推动订单与 GMV 增长。',
    '在滴滴充电，我统筹城市供需、分层定价与生命周期策略，推动城市份额提升与利润扭亏，并将这些一线实践沉淀为可复用的精细化运营方法。接下来，我会结合这段经历展开分享。'
  ]});
  let enhancedCleanup=null;
  const tones=['blue','green','purple','blue','yellow','orange','orange','orange','orange','green','pink','pink','pink','purple','purple','blue'];
  tones.splice(1,0,'orange');
  const stage=$('#stage'), viewport=$('#viewport'), overlay=$('#overlayRoot');
  const readRoute=()=>location.hash==='#profile'?1:/^#\d{1,2}$/.test(location.hash)?Math.max(0,Math.min(lastPage,Number(location.hash.slice(1)))):0;
  let index=readRoute(),mode=null,lastFocus=null,zoom=1,currentImage=null,touchStart=null,restoringRoute=false;
  const images={
    segmentation:{src:'assets/segmentation.jpg',title:'人群分层方法 · 原始材料',caption:'图片中的 +3% 为原材料限定样本的实验结论，不作为本次分享者业绩。'},
    pricing:{src:'assets/pricing.jpg',title:'场站分层定价建议 · 完整原表',caption:'本演示引用第一处场站的谷时价格；原表平均值的样本范围需另行核对。'},
    configuration:{src:'assets/configuration.jpg',title:'分时段与分人群配置 · 原始材料',caption:'作为执行配置示例，具体价格应以实际方案及生效版本为准。'}
  };
  function resize(){
    const mobile=window.innerWidth<760;
    document.body.classList.toggle('mobile',mobile);
    if(index===1||mobile){stage.style.width='';stage.style.height='';stage.style.transform='';}
    else{const scale=Math.min(viewport.clientWidth/1440,viewport.clientHeight/810);stage.style.width='1440px';stage.style.height='810px';stage.style.transform='translate(-50%,-50%) scale('+scale+')';}
  }
  function render(){
    const previousCleanup=enhancedCleanup;enhancedCleanup=null;previousCleanup?.();
    window.EVHero?.unmount();
    document.body.classList.toggle('hero-active',index===0);
    document.body.classList.toggle('profile-active',index===1);
    document.body.dataset.tone=tones[index];
    stage.innerHTML=index===1?slides[index].html:'<section class="slide tone-'+tones[index]+' '+(index===0?'cover-slide':'report-slide')+'" tabindex="-1" aria-label="页面 '+pageLabel(index)+'，共 '+slides.length+' 页：'+slides[index].title+'">'+slides[index].html+'</section>';
    $('#pageCurrent').textContent=pageLabel(index);
    $('#pageLast').textContent=pageLabel(lastPage);
    $('#pageButton').setAttribute('aria-label','页面 '+pageLabel(index)+'，共 '+slides.length+' 页，打开目录');
    $('#chapterLabel').textContent=slides[index].en;
    $('#prevButton').disabled=index===0;$('#nextButton').disabled=index===lastPage;
    $('#progressBar').style.width=((index+1)/slides.length*100)+'%';
    $('#announcer').textContent='页面 '+pageLabel(index)+'，共 '+slides.length+' 页。'+slides[index].title;
    document.title=pageLabel(index)+' · '+slides[index].title+' — 充电运营策略';
    if(mode==='notes')renderNotes();
    viewport.scrollTop=0;
    resize();
    if(index===0)window.EVHero?.mount($('.atlas-hero',stage));
    else if(slides[index].mount)enhancedCleanup=slides[index].mount(index===1?$('.profile-dialog',stage):$('.slide',stage));
    if(!mode){const focusTarget=index===1?$('.profile-back',stage):$('.slide',stage);focusTarget?.focus({preventScroll:true})}
  }
  function go(n){
    if(window.OpeningTransition?.active){if(n===0)window.OpeningTransition.finish();else return;}
    if(!Number.isFinite(n))return;
    const next=Math.max(0,Math.min(lastPage,Math.trunc(n)));if(next===index)return;
    const previous=index;
    const commit=()=>{index=next;if(!restoringRoute){try{history.pushState({deckPage:next},'','#'+pageLabel(next));}catch{location.hash=pageLabel(next)}}render()};
    if(!mode&&((index===0&&(next===1||next===2))||(index===1&&next===2))&&window.OpeningTransition?.play(commit,{from:previous,to:next}))return;
    if(index===0&&window.EVHero?.leave){window.EVHero.leave(commit);return}
    commit();
  }
  // The introduction is an optional branch opened from the presenter's name.
  function stepPage(direction){
    const next=direction>0?(index===0?2:index+1):(index===2?0:index-1);
    go(next);
  }
  function closeOverlay(){
    overlay.innerHTML='';mode=null;currentImage=null;document.body.classList.remove('overlay-open');
    stage.inert=false;
    $('#notesButton').setAttribute('aria-expanded','false');
    if(lastFocus?.isConnected)lastFocus.focus();lastFocus=null;
  }
  function openOverlay(kind){
    window.OpeningTransition?.finish();
    if(kind==='profile'){if(mode)closeOverlay();go(1);return}
    if(mode===kind){closeOverlay();return}
    if(!mode)lastFocus=document.activeElement;
    mode=kind;document.body.classList.add('overlay-open');
    stage.inert=true;
    if(kind==='notes'){renderNotes();$('#notesButton').setAttribute('aria-expanded','true')}
    if(kind==='overview'){
      overlay.innerHTML='<div class="overlay-backdrop" data-action="close"></div><section class="dialog overview-dialog" role="dialog" aria-modal="true" aria-label="全部页面"><div class="dialog-header"><div><span class="eyebrow">THE FULL PICTURE</span><h2>把方法，串起来。</h2></div><button class="icon-button" data-action="close" aria-label="关闭目录">'+icon('close')+'</button></div><div class="overview-grid">'+slides.flatMap((s,i)=>i===1?[]:'<button class="overview-item tone-'+tones[i]+' '+(i===index?'selected':'')+'" data-jump="'+i+'"><span>'+pageLabel(i)+'</span><small>'+s.chapter+'</small><strong>'+s.title+'</strong><i>↗</i></button>').join('')+'</div><div class="dialog-footer">选择任意页面继续演示 <span>ESC 关闭</span></div></section>';
    }
    if(kind==='help'){
      overlay.innerHTML='<div class="overlay-backdrop" data-action="close"></div><section class="dialog help-dialog" role="dialog" aria-modal="true" aria-label="演示帮助"><div class="dialog-header"><div><span class="eyebrow">A FEW SHORTCUTS</span><h2>专注讲述，轻松控制。</h2></div><button class="icon-button" data-action="close" aria-label="关闭帮助">'+icon('close')+'</button></div><div class="shortcut-list">'+[['← / →','上一页 / 下一页'],['Space','下一页'],['Home / End','封面 / 总结'],['G','页面目录'],['N','打开 / 关闭逐页讲稿'],['F','进入 / 退出全屏'],['Esc','关闭当前面板或原图']].map(x=>'<div><kbd>'+x[0]+'</kbd><span>'+x[1]+'</span></div>').join('')+'</div><p class="help-note">点击案例按钮可查看原图；原图支持缩放与滚动。手机上可左右滑动翻页。</p><button class="button secondary" data-action="print">打印 / 保存为 PDF</button></section>';
    }
    setTimeout(()=>$('.dialog button, .notes-panel button, .profile-dialog button',overlay)?.focus(),0);
  }
  function renderNotes(){
    const focusAction=document.activeElement?.dataset?.action;
    const n=notes[index];
    overlay.innerHTML='<div class="notes-backdrop" data-action="close"></div><aside class="notes-panel" role="dialog" aria-modal="true" aria-label="逐页讲稿"><div class="notes-header"><span class="eyebrow">PRESENTER NOTES</span><button class="icon-button" data-action="close" aria-label="关闭讲稿">'+icon('close')+'</button></div><div class="notes-meta"><span>页面 '+pageLabel(index)+' · 共 '+slides.length+' 页</span><span>建议 '+(n?Math.floor(n.duration/60)+' 分 '+(n.duration%60?n.duration%60+' 秒':''):'')+'</span></div><h2>'+slides[index].title+'</h2><div class="notes-text" tabindex="0" aria-label="讲稿正文，可滚动">'+(n?n.paragraphs.map(p=>'<p>'+p+'</p>').join(''):'<p>请围绕本页核心内容展开讲解。</p>')+'</div><div class="notes-navigation"><button class="button secondary" data-action="notes-prev" '+(index===0?'disabled':'')+'>← 上一页</button><button class="button primary" data-action="notes-next" '+(index===lastPage?'disabled':'')+'>下一页 →</button></div></aside>';
    const focusTarget=focusAction?$('button[data-action="'+focusAction+'"]:not(:disabled)',overlay):null;
    (focusTarget||$('.notes-header button',overlay)).focus();
  }
  function showImage(name){
    if(!images[name])return;lastFocus=document.activeElement;mode='image';currentImage=name;zoom=1;
    const im=images[name];document.body.classList.add('overlay-open');stage.inert=true;
    overlay.innerHTML='<div class="overlay-backdrop" data-action="close"></div><section class="dialog image-dialog" role="dialog" aria-modal="true" aria-label="'+im.title+'"><div class="image-toolbar"><div><span class="eyebrow">SOURCE MATERIAL</span><h2>'+im.title+'</h2></div><div class="image-tools"><button class="icon-button" data-action="zoom-out" aria-label="缩小原图">'+icon('minus')+'</button><span id="zoomLabel">适应窗口</span><button class="icon-button" data-action="zoom-in" aria-label="放大原图">'+icon('plus')+'</button><button class="text-button" data-action="zoom-reset">重置</button><button class="icon-button" data-action="close" aria-label="关闭原图">'+icon('close')+'</button></div></div><div class="image-scroll" tabindex="0" aria-label="原图，可滚动"><img id="sourceImage" src="'+im.src+'" alt="'+im.title+'"></div><p class="source-caption">'+im.caption+'</p></section>';
    $('.image-tools button',overlay).focus();
  }
  function setZoom(n){zoom=Math.max(1,Math.min(4,n));$('#sourceImage').style.width=zoom*100+'%';$('#zoomLabel').textContent=zoom===1?'适应窗口':Math.round(zoom*100)+'%'}
  async function fullscreen(){
    try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else throw new Error('unsupported');}catch{toast('当前预览不支持全屏，可在独立浏览器打开后重试。')}
  }
  function toast(text){const e=document.createElement('div');e.className='toast';e.textContent=text;document.body.append(e);setTimeout(()=>e.remove(),4000)}
  function preparePrint(){window.OpeningTransition?.finish();if($('#printDeck'))return;const print=document.createElement('div');print.id='printDeck';print.innerHTML=slides.map((s,i)=>'<section class="print-slide tone-'+tones[i]+' '+(i===0?'cover-slide':i===1?'profile-print':'report-slide')+'"><div class="print-page">'+pageLabel(i)+' / '+pageLabel(lastPage)+'</div>'+s.html+'</section>').join('');document.body.append(print);$$('.tech-canvas,.opening-preview',print).forEach(poster=>window.EVHero?.drawPoster?.(poster))}
  function printDeck(){closeOverlay();preparePrint();window.print()}
  window.addEventListener('beforeprint',preparePrint);
  window.addEventListener('afterprint',()=>$('#printDeck')?.remove());
  document.addEventListener('click',e=>{
    const el=e.target.closest('button');if(!el)return;
    if(el.dataset.go!==undefined){go(Number(el.dataset.go));return}
    if(el.dataset.jump!==undefined){const n=Number(el.dataset.jump);closeOverlay();go(n);return}
    if(el.dataset.image){showImage(el.dataset.image);return}
    switch(el.dataset.action){
      case 'close':closeOverlay();break;case 'overview':openOverlay('overview');break;case 'profile':openOverlay('profile');break;case 'notes':openOverlay('notes');break;
      case 'zoom-in':setZoom(zoom+.5);break;case 'zoom-out':setZoom(zoom-.5);break;case 'zoom-reset':setZoom(1);break;
      case 'notes-prev':stepPage(-1);break;case 'notes-next':stepPage(1);break;case 'print':printDeck();break;
    }
  });
  overlay.addEventListener('click',e=>{if(e.target.dataset.action==='close')closeOverlay()});
  $('#prevButton').innerHTML=icon('left');$('#nextButton').innerHTML=icon('arrow');$('#overviewButton').innerHTML=icon('grid');$('#helpButton').innerHTML=icon('help');$('#fullscreenButton').innerHTML=icon('expand');
  $('#prevButton').onclick=()=>stepPage(-1);$('#nextButton').onclick=()=>stepPage(1);
  $('#overviewButton').onclick=$('#pageButton').onclick=()=>openOverlay('overview');
  $('#notesButton').onclick=()=>openOverlay('notes');$('#helpButton').onclick=()=>openOverlay('help');$('#fullscreenButton').onclick=fullscreen;
  $('#homeMotionButton').onclick=()=>{window.OpeningTransition?.finish();if(mode)closeOverlay();if(index===0)render();else go(0);};
  document.addEventListener('keydown',e=>{
    if(e.defaultPrevented)return;
    if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    if(e.key==='Tab'&&mode){const focusables=$$('button:not(:disabled),a[href],[tabindex="0"]',overlay).filter(element=>element.getClientRects().length&&getComputedStyle(element).visibility!=='hidden');if(!focusables.length)return;const first=focusables[0],last=focusables.at(-1);if(!overlay.contains(document.activeElement)){e.preventDefault();first.focus()}else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}return}
    if(e.key==='Escape'){if(mode)closeOverlay();else if(index===1)go(0);return}
    if(mode==='image'){if(e.key==='+'||e.key==='='){e.preventDefault();setZoom(zoom+.5)}if(e.key==='-'){e.preventDefault();setZoom(zoom-.5)}return}
    if(mode==='overview'||mode==='help')return;
    const k=e.key.toLowerCase();
    if(e.target.classList.contains('notes-text')&&['arrowup','arrowdown','pageup','pagedown','home','end',' '].includes(k))return;
    if(['arrowright','pagedown',' '].includes(k)){if(k===' '&&e.target.tagName==='BUTTON')return;e.preventDefault();stepPage(1)}
    if(['arrowleft','pageup'].includes(k)){e.preventDefault();stepPage(-1)}
    if(k==='home'){e.preventDefault();go(0)}if(k==='end'){e.preventDefault();go(lastPage)}
    if(k==='g')openOverlay('overview');if(k==='n')openOverlay('notes');if(k==='h')openOverlay('help');if(k==='f')fullscreen();
  });
  viewport.addEventListener('touchstart',e=>{const tableFrame=e.target.closest('.report-table-frame');if(e.touches.length!==1||e.target.closest('[data-deck-no-swipe]')||(tableFrame&&tableFrame.scrollWidth>tableFrame.clientWidth)){touchStart=null;return}touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}},{passive:true});
  viewport.addEventListener('touchcancel',()=>{touchStart=null},{passive:true});
  viewport.addEventListener('touchend',e=>{if(!touchStart||mode)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)stepPage(dx<0?1:-1);touchStart=null},{passive:true});
  window.addEventListener('resize',resize);
  function restoreRoute(){
    const next=readRoute();restoringRoute=true;
    try{
      window.OpeningTransition?.finish();
      if(mode)closeOverlay();
      if(index!==next){index=next;render()}
      history.replaceState({deckPage:next},'','#'+pageLabel(next));
    }finally{restoringRoute=false}
  }
  window.addEventListener('hashchange',restoreRoute);
  window.addEventListener('popstate',restoreRoute);
  document.addEventListener('fullscreenchange',()=>{$('#fullscreenButton').setAttribute('aria-label',document.fullscreenElement?'退出全屏':'进入全屏');resize()});
  history.replaceState({deckPage:index},'','#'+pageLabel(index));
  render();
})();
