(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const media=$('#mediaPlane'), imageMotion=$('#imageMotion'), shade=$('#mediaShade'), caption=$('#mediaCaption');
  const runway=$('#runway'), opening=$('#opening'), perspective=$('#perspective'), operating=$('#operating');
  const layers=[opening,perspective,operating], widgets=[...document.querySelectorAll('.widget')];
  const lines=[...document.querySelectorAll('.reveal-line')], sceneButtons=[...document.querySelectorAll('[data-scene]')];
  const progress=$('#progress'), playButton=$('#playButton'), playLabel=$('#playLabel'), announcement=$('#announcement');
  const stops=[0,.43,1];
  const names=['连接供需','平台视角','经营方法'];
  const topics=[
    {title:'看清供需。',desc:'建立城市底盘，识别份额、效率与覆盖机会。',scope:'单站 → 区块 → 城市',scopeDetail:'把局部表现，放回市场全局',output:'供需底盘',focus:'供给与需求，在这里连接',href:'#4',x:0,zoom:1},
    {title:'配置策略。',desc:'匹配城市阶段，组合人群定价与生命周期动作。',scope:'阶段 × 人群 × 时段',scopeDetail:'把经营判断，变成执行方案',output:'策略组合',focus:'不同阶段，匹配不同投入',href:'#5',x:-1.8,zoom:1.045},
    {title:'验证经营。',desc:'联查效率、价格、设备与会员，让结果回到下一轮判断。',scope:'观察 → 执行 → 复盘',scopeDetail:'用反馈校准，让经验可以复用',output:'可复用规则',focus:'每次反馈，开启下一轮经营',href:'#10',x:1.5,zoom:1.025}
  ];
  let p=0, w=innerWidth,h=innerHeight,maxScroll=1,activeScene=-1,topic=0;
  let raf=0,autoRaf=0,auto=false,autoStarted=0,autoOffset=0,lastFrame=0,pausedTime=null;
  let topicTimer=0,topicAnimTimer=0,pose={x:0,zoom:1},poseFrom={x:0,zoom:1},poseTarget={x:0,zoom:1},poseStart=0;
  const clamp=x=>Math.min(1,Math.max(0,x));
  const mix=(a,b,t)=>a+(b-a)*t;
  const range=(v,a,b)=>clamp((v-a)/(b-a));
  const smooth=x=>x*x*(3-2*x);
  const ease=x=>1-Math.pow(1-x,5);
  function setLayer(el,alpha,offset=0,blur=0){
    el.style.opacity=alpha.toFixed(3);
    el.style.transform=`translateY(${offset.toFixed(2)}px)`;
    el.style.filter=blur>.05?`blur(${blur.toFixed(2)}px)`:'none';
    const hidden=alpha<.4;el.inert=hidden;el.setAttribute('aria-hidden',String(hidden));
  }
  function sceneIndex(value){return value<.22?0:value<.68?1:2;}
  function measure(){w=innerWidth;h=innerHeight;maxScroll=Math.max(1,runway.offsetHeight-h);requestDraw();}
  function mediaRect(value){
    const mobile=w<=760,short=h<=720;
    const full={x:0,y:0,width:w,height:h,r:0};
    const split=mobile?{x:22,y:h*.145,width:w-44,height:h*(short?.26:.28),r:12}:{x:w*.044,y:h*.235,width:w*.445,height:h*.47,r:18};
    const end=mobile?{x:22,y:h*(short?.29:.265),width:w-44,height:h*(short?.205:.23),r:12}:{x:w*.46,y:h*.165,width:w*.496,height:h*.45,r:18};
    let from,to,t;
    if(value<.57){from=full;to=split;t=smooth(range(value,.055,.29));}
    else{from=split;to=end;t=smooth(range(value,.57,.82));}
    return Object.fromEntries(Object.keys(full).map(k=>[k,mix(from[k],to[k],t)]));
  }
  function updateSceneState(){
    const current=sceneIndex(p);
    if(current!==activeScene){activeScene=current;document.body.dataset.scene=current;sceneButtons.forEach(b=>{if(+b.dataset.scene===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});}
    document.body.classList.toggle('is-light',p>.115);
    progress.value=Math.round(p*1000);progress.style.setProperty('--track',`${(p*100).toFixed(2)}%`);
    progress.setAttribute('aria-valuetext',`第${current+1}幕：${names[current]}`);
    if(!auto&&!document.body.classList.contains('motion-paused'))playLabel.textContent=p>=.995?'重新演示':'自动演示';
  }
  function draw(ts=performance.now()){
    raf=0;if(reduced.matches){
      let current=0;layers.forEach((el,i)=>{if(el.getBoundingClientRect().top<h*.45)current=i;});
      activeScene=current;sceneButtons.forEach(b=>{if(+b.dataset.scene===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});return;
    }
    p=clamp(scrollY/maxScroll);
    const rect=mediaRect(p);
    media.style.width=`${rect.width}px`;media.style.height=`${rect.height}px`;
    media.style.transform=`translate3d(${rect.x}px,${rect.y}px,0)`;
    media.style.borderRadius=`${rect.r}px`;
    const movement=range(poseStart?ts-poseStart:1600,0,1600);
    pose.x=mix(poseFrom.x,poseTarget.x,ease(movement));pose.zoom=mix(poseFrom.zoom,poseTarget.zoom,ease(movement));
    const camera=1+.035*(1-range(p,0,.28));
    imageMotion.style.transform=`translateX(${pose.x.toFixed(3)}%) scale(${(camera*pose.zoom).toFixed(4)})`;
    shade.style.opacity=(1-.65*smooth(range(p,.08,.3))).toFixed(3);
    caption.style.opacity=smooth(range(p,.18,.31)).toFixed(3);
    setLayer(opening,1-range(p,.015,.16),-h*.06*range(p,.015,.16),16*range(p,.015,.16));
    const midIn=range(p,.18,.31),midOut=range(p,.53,.66);
    setLayer(perspective,midIn*(1-midOut),(1-midIn)*40-midOut*35,midOut*10);
    lines.forEach((line,i)=>{const v=range(p,.21+i*.035,.31+i*.035);line.style.opacity=v.toFixed(3);line.style.transform=`translateY(${((1-v)*35).toFixed(2)}px)`;line.style.filter=v>.99?'none':`blur(${((1-v)*8).toFixed(2)}px)`;});
    const finalIn=range(p,.68,.85);
    setLayer(operating,finalIn,(1-finalIn)*28,(1-finalIn)*6);
    widgets.forEach((widget,i)=>{const v=ease(range(p,.79+i*.018,.89+i*.018));widget.style.opacity=v.toFixed(3);widget.style.transform=`translateY(${((1-v)*65).toFixed(2)}px) scale(${(.96+v*.04).toFixed(3)})`;});
    updateSceneState();
    if(movement<1)requestDraw();
    lastFrame=ts;
  }
  function requestDraw(){if(!raf)raf=requestAnimationFrame(draw);}
  function stopAuto(){
    if(auto)pausedTime=(performance.now()-autoStarted)/1000+autoOffset;
    auto=false;cancelAnimationFrame(autoRaf);autoRaf=0;document.body.classList.remove('is-playing');
    playLabel.textContent=p>=.995?'重新演示':'自动演示';playButton.setAttribute('aria-label','自动播放三幕开场');playButton.setAttribute('aria-pressed','false');
  }
  const beats=[{t:0,p:0},{t:3.6,p:0},{t:7.7,p:.43},{t:13,p:.43},{t:18,p:1},{t:23,p:1}];
  function inverseSmooth(value){let low=0,high=1;for(let i=0;i<16;i++){const m=(low+high)/2;if(smooth(m)<value)low=m;else high=m;}return (low+high)/2;}
  function timeAtProgress(value){if(value<.43)return 3.6+inverseSmooth(value/.43)*4.1;if(value===.43)return 7.7;return 13+inverseSmooth((value-.43)/.57)*5;}
  function autoTick(ts){
    if(!auto||document.hidden)return;
    const elapsed=(ts-autoStarted)/1000+autoOffset;
    let target=1;
    for(let i=0;i<beats.length-1;i++)if(elapsed>=beats[i].t&&elapsed<beats[i+1].t){const a=beats[i],b=beats[i+1];target=mix(a.p,b.p,smooth(range(elapsed,a.t,b.t)));break;}
    scrollTo(0,target*maxScroll);requestDraw();
    if(elapsed>=23){stopAuto();announcement.textContent='三幕开场播放结束。可以切换经营主题，或进入完整汇报。';return;}
    autoRaf=requestAnimationFrame(autoTick);
  }
  function startAuto(reset=false){
    if(reduced.matches)return;
    stopAuto();if(reset||p>=.995){scrollTo(0,0);p=0;poseTarget=topics[0];setTopic(0,true);autoOffset=0;}else autoOffset=pausedTime??(p<.01?0:timeAtProgress(p));pausedTime=null;
    auto=true;autoStarted=performance.now();document.body.classList.add('is-playing');document.body.classList.remove('motion-paused');playLabel.textContent='暂停演示';playButton.setAttribute('aria-label','暂停开场动画');playButton.setAttribute('aria-pressed','true');autoRaf=requestAnimationFrame(autoTick);
  }
  function goScene(n,instant=false){
    stopAuto();pausedTime=null;document.body.classList.remove('motion-paused');n=Math.max(0,Math.min(2,n));
    if(reduced.matches){layers[n].scrollIntoView({behavior:'instant',block:'start'});return;}
    scrollTo({top:stops[n]*maxScroll,behavior:instant?'instant':'smooth'});announcement.textContent=`第${n+1}幕：${names[n]}`;
  }
  function fillTopic(n){const t=topics[n];$('#topicNumber').textContent=`0${n+1} / 03`;$('#topicTitle').textContent=t.title;$('#topicDescription').textContent=t.desc;$('#topicScope').textContent=t.scope;$('#topicScopeDetail').textContent=t.scopeDetail;$('#topicOutput').textContent=t.output;$('#focusCaption').textContent=t.focus;$('#topicLink').href='https://sofia-shieh.github.io/charging-strategy-demo/'+t.href;document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.topic===n)));}
  function setTopic(n,instant=false){
    topic=(n+topics.length)%topics.length;clearTimeout(topicTimer);clearTimeout(topicAnimTimer);
    const copy=$('#topicCopy');copy.classList.remove('topic-enter','topic-exit');
    poseFrom={...pose};poseTarget={x:topics[topic].x,zoom:topics[topic].zoom};poseStart=performance.now();
    if(reduced.matches||instant){fillTopic(topic);pose={...poseTarget};poseFrom={...poseTarget};requestDraw();return;}
    copy.classList.add('topic-exit');topicTimer=setTimeout(()=>{fillTopic(topic);copy.classList.remove('topic-exit');copy.classList.add('topic-enter');topicAnimTimer=setTimeout(()=>copy.classList.remove('topic-enter'),700);},210);requestDraw();announcement.textContent=`经营主题：${topics[topic].title}`;
  }
  sceneButtons.forEach(button=>button.addEventListener('click',()=>goScene(+button.dataset.scene)));
  $('.brand').addEventListener('click',event=>{event.preventDefault();goScene(0);});
  playButton.addEventListener('click',()=>{if(auto){stopAuto();document.body.classList.add('motion-paused');playLabel.textContent='继续演示';playButton.setAttribute('aria-label','继续开场动画');}else startAuto();});
  $('#replayButton').addEventListener('click',()=>startAuto(true));
  progress.addEventListener('input',()=>{stopAuto();pausedTime=null;scrollTo(0,+progress.value/1000*maxScroll);requestDraw();});
  $('#previousTopic').addEventListener('click',()=>{stopAuto();setTopic(topic-1);});
  $('#nextTopic').addEventListener('click',()=>{stopAuto();setTopic(topic+1);});
  document.querySelectorAll('[data-topic]').forEach(b=>b.addEventListener('click',()=>{stopAuto();setTopic(+b.dataset.topic);}));
  addEventListener('scroll',requestDraw,{passive:true});
  addEventListener('resize',measure,{passive:true});
  addEventListener('wheel',()=>{if(auto)stopAuto();pausedTime=null;},{passive:true});
  addEventListener('touchmove',event=>{if(event.target.closest('#playback,button,a,input'))return;if(auto)stopAuto();pausedTime=null;},{passive:true});
  addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
    if(event.code==='Space'&&event.target===document.body){event.preventDefault();auto?stopAuto():startAuto();return;}
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
      event.preventDefault();stopAuto();const direction=event.key==='ArrowRight'?1:-1;
      if(p>.94&&!reduced.matches)setTopic(topic+direction);else goScene(activeScene+direction);
    }
    if(event.key==='Home'){event.preventDefault();goScene(0);}if(event.key==='End'){event.preventDefault();goScene(2);}
    if(event.key==='Escape')stopAuto();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAuto();document.body.classList.add('motion-paused');cancelAnimationFrame(raf);raf=0;}else{document.body.classList.remove('motion-paused');requestDraw();}});
  function applyReduced(){
    stopAuto();
    if(reduced.matches){layers.forEach(el=>{el.inert=false;el.setAttribute('aria-hidden','false');});$('#modeNote').textContent='静态阅读模式 · 已遵循系统减少动态效果设置';document.body.classList.remove('is-light');requestDraw();}
    else{$('#modeNote').innerHTML='滚动探索 <span>·</span> ← → 切换分镜';measure();}
  }
  reduced.addEventListener('change',applyReduced);
  $('#heroImage').addEventListener('error',()=>{media.style.background='radial-gradient(ellipse at 65% 40%,#3c3933,#121211 65%)';caption.style.opacity=0;});
  addEventListener('pagehide',()=>{stopAuto();cancelAnimationFrame(raf);clearTimeout(topicTimer);clearTimeout(topicAnimTimer);});
  addEventListener('pageshow',()=>{measure();});
  if('scrollRestoration' in history)history.scrollRestoration='manual';
  scrollTo(0,0);measure();fillTopic(0);applyReduced();
})();
