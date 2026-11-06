/* Shared editorial scenes: 00 cover → 01 presenter → 02 operating perspective. */
(() => {
  'use strict';
  let active = null;
  let committing = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.22,.72,.16,1)';
  const supported = new Set(['0:1', '0:2', '1:2', '2:1']);
  const energyHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden="true"><path pathLength="100" d="M8 72C30 72 30 50 50 50S70 28 92 28"/><path pathLength="100" d="M8 28C30 28 30 50 50 50S70 72 92 72"/><circle cx="50" cy="50" r="1.2"/></svg>';

  function sceneFor(index) {
    if (index === 1) {
      const profile = window.PresenterProfile;
      if (!profile?.sceneHTML) return null;
      return {
        selector: profile.sceneSelector || '.profile-record-charging .profile-record-graphic',
        className: 'opening-flight-profile',
        profile: true,
        html: profile.sceneHTML,
        mount: typeof profile.mountScene === 'function' ? container => profile.mountScene(container) : null,
        background: '#25281f'
      };
    }
    if (index === 2 && window.OpeningNetwork?.html) {
      return {
        selector: '.opening-scene', className: '', html: window.OpeningNetwork.html,
        mount: container => window.OpeningNetwork.mount(container), background: '#090a0b'
      };
    }
    return null;
  }
  function finish() { active?.finish(); }
  function actualBackground(element, fallback) {
    const color = element && getComputedStyle(element).backgroundColor;
    return !color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)' ? fallback : color;
  }
  function actualRadius(element, bounds) {
    return (parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0) * bounds.width / (element.offsetWidth || bounds.width);
  }
  function mostlyOutsideViewport(bounds) {
    const width = window.innerWidth || document.documentElement?.clientWidth || 1440;
    const height = window.innerHeight || document.documentElement?.clientHeight || 900;
    const visibleWidth = Math.max(0, Math.min(width, bounds.left + bounds.width) - Math.max(0, bounds.left));
    const visibleHeight = Math.max(0, Math.min(height, bounds.top + bounds.height) - Math.max(0, bounds.top));
    return visibleWidth * visibleHeight < bounds.width * bounds.height * .15;
  }

  function play(commit, options = {}) {
    const from = Number(options.from ?? 0), to = Number(options.to ?? 1);
    if (active || reduced.matches || document.hidden || !supported.has(`${from}:${to}`)) return false;
    const destinationScene = sceneFor(to);
    const sourceScene = sceneFor(from);
    const cover = from === 0;
    const source = document.querySelector(cover ? '#stage .tech-hero' : `#stage ${sourceScene?.selector || '.missing-scene'}`);
    const sourcePage = document.querySelector('#stage > .slide, #stage > .profile-page');
    if (!source || !sourcePage || !destinationScene || typeof commit !== 'function') return false;
    const sourceBounds = source.getBoundingClientRect();
    if (!sourceBounds.width || !sourceBounds.height) return false;
    const sourceRadius = actualRadius(source, sourceBounds);
    const offscreen = !cover && mostlyOutsideViewport(sourceBounds);

    const animations = [], cleanups = [];
    let timer = null, doneTimer = null, handoffTimer = null, frame = null, outgoing = null, target = null;
    let committed = false, disposed = false;
    const state = { finish: end };
    active = state;
    document.body.classList.add('bridge-running');
    document.body.dataset.bridgeDirection = `${from}-${to}`;

    function animate(element, keyframes, timing) {
      const animation = element.animate(keyframes, timing);
      animations.push(animation);
      return animation;
    }
    function mount(definition, container) {
      const cleanup = definition?.mount?.(container);
      if (typeof cleanup === 'function') cleanups.push(cleanup);
      else if (cleanup?.cleanup) cleanups.push(() => cleanup.cleanup());
    }
    function fillScene(layer, definition, markup, original = null) {
      if (!definition.profile) { layer.innerHTML = markup; mount(definition, layer); return; }
      // Keep the diagram's actual career-card ancestors so inherited colors,
      // type and SVG flow rules stay identical while it travels outside #stage.
      const context = document.createElement('div');
      context.className = 'opening-flight-profile-context profile-dialog';
      const card = document.createElement('div');
      card.className = 'profile-card profile-card-charging profile-record profile-record-charging';
      card.dataset.expanded = 'true';
      const graphic = original ? original.cloneNode(true) : document.createElement('div');
      if (!original) { graphic.className = 'profile-record-graphic'; graphic.innerHTML = markup; }
      graphic.classList.remove('bridge-target-scene', 'bridge-source-scene', 'bridge-scene-settled');
      graphic.classList.add('opening-flight-profile-art');
      card.append(graphic); context.append(card); layer.append(context);
      const bounds = original?.getBoundingClientRect();
      const artWidth = original?.offsetWidth || bounds?.width || 320;
      const artHeight = original?.offsetHeight || bounds?.height || 220;
      graphic.style.setProperty('--flight-art-width', artWidth + 'px');
      graphic.style.setProperty('--flight-art-height', artHeight + 'px');
      if (original) {
        const originalStyle = getComputedStyle(original);
        ['--profile-scene-scale', '--profile-pan-x', '--profile-pan-y'].forEach(token => {
          const value = originalStyle.getPropertyValue?.(token);
          if (value) graphic.style.setProperty(token, value);
        });
      }
      // CSS-built chargers have a fixed 420 × 350 drawing plane. Preserve the
      // source's resolved pan/scale and uniformly scale its whole viewport.
      // Resizing individual CSS pieces would otherwise crop or distort them.
      const originalDrawing = original?.querySelector('.profile-scene-layer');
      const clonedDrawing = graphic.querySelector('.profile-scene-layer');
      if (originalDrawing && clonedDrawing) {
        const drawingTransform = getComputedStyle(originalDrawing).transform;
        if (drawingTransform && drawingTransform !== 'none') clonedDrawing.style.setProperty('transform', drawingTransform, 'important');
        clonedDrawing.style.setProperty('transition', 'none', 'important');
      }
      function fitArtwork() {
        const box = layer.getBoundingClientRect();
        const ratio = Math.min((box.width || artWidth) / artWidth, (box.height || artHeight) / artHeight);
        graphic.style.setProperty('--flight-art-scale', String(ratio));
      }
      fitArtwork();
      if (typeof ResizeObserver === 'function') {
        const observer = new ResizeObserver(fitArtwork);
        observer.observe(layer);
        cleanups.push(() => observer.disconnect());
      }
      mount(definition, graphic);
    }
    function changePage() {
      if (committed) return;
      committed = true; committing = true;
      try { commit(); } finally { committing = false; }
    }
    function end() {
      if (disposed) return;
      disposed = true;
      clearTimeout(timer); clearTimeout(doneTimer); clearTimeout(handoffTimer);
      animations.forEach(animation => animation.cancel());
      cleanups.splice(0).forEach(cleanup => cleanup());
      frame?.remove();
      source.classList.remove('bridge-exiting', 'bridge-source-scene');
      target?.classList.remove('bridge-target-scene');
      if (active === state) active = null;
      document.body.classList.remove('bridge-running', 'bridge-arriving');
      delete document.body.dataset.bridgeDirection;
      changePage();
    }
    function buildFrame() {
      frame = document.createElement('div');
      frame.className = 'opening-flight';
      frame.setAttribute('aria-hidden', 'true');
      Object.assign(frame.style, {
        left: sourceBounds.left + 'px', top: sourceBounds.top + 'px',
        width: sourceBounds.width + 'px', height: sourceBounds.height + 'px',
        borderRadius: sourceRadius + 'px',
        backgroundColor: actualBackground(source, cover ? '#090a0b' : sourceScene.background)
      });
      document.body.append(frame);
      if (!cover && !offscreen) {
        outgoing = document.createElement('div');
        outgoing.className = `opening-flight-layer opening-flight-source ${sourceScene.className}`;
        frame.append(outgoing);
        fillScene(outgoing, sourceScene, source.innerHTML, source);
      }
    }
    function arrive() {
      if (disposed) return;
      if (!frame) buildFrame();
      const incoming = document.createElement('div');
      incoming.className = `opening-flight-layer opening-flight-visual ${destinationScene.className}`;
      frame.append(incoming);
      if (!destinationScene.profile) fillScene(incoming, destinationScene, destinationScene.html);
      const energy = document.createElement('div');
      energy.className = 'opening-flight-energy'; energy.innerHTML = energyHTML;
      frame.append(energy);

      document.body.classList.add('bridge-arriving');
      changePage();
      if (disposed) return;
      target = document.querySelector(`#stage ${destinationScene.selector}`);
      if (!target) { end(); return; }
      if (to === 1) {
        target.classList.add('bridge-scene-settled');
        target.closest('.profile-record-charging')?.classList.add('bridge-scene-settled');
        target.closest('.profile-experience')?.classList.add('bridge-scene-settled');
      }
      const destination = target.getBoundingClientRect();
      if (!destination.width || !destination.height) { end(); return; }
      if (mostlyOutsideViewport(destination)) { end(); return; }
      if (destinationScene.profile) fillScene(incoming, destinationScene, destinationScene.html, target);
      target.classList.add('bridge-target-scene');
      const duration = offscreen ? 620 : cover ? 1150 : 1280;
      const destinationBackground = actualBackground(target, destinationScene.background);
      const direction = to > from ? 1 : -1;
      // A scrolled-away mobile source should not fly in from an invisible point.
      // In that case the destination scene unfolds in place during the page fade.
      const departure = offscreen ? destination : sourceBounds;
      if (offscreen) Object.assign(frame.style, { left: destination.left + 'px', top: destination.top + 'px', width: destination.width + 'px', height: destination.height + 'px', backgroundColor: destinationBackground });
      animate(frame, [
        { left: departure.left + 'px', top: departure.top + 'px', width: departure.width + 'px', height: departure.height + 'px', borderRadius: (offscreen ? actualRadius(target, destination) : sourceRadius) + 'px', backgroundColor: frame.style.backgroundColor },
        { left: destination.left + 'px', top: destination.top + 'px', width: destination.width + 'px', height: destination.height + 'px', borderRadius: actualRadius(target, destination) + 'px', backgroundColor: destinationBackground }
      ], { duration, easing: ease, fill: 'forwards' });
      if (outgoing) animate(outgoing, [
        { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0)', clipPath: 'inset(0% 0% 0% 0%)' },
        { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0)', clipPath: 'inset(0% 0% 0% 0%)', offset: .27 },
        { opacity: 0, transform: `translateX(${-14 * direction}px) scale(.94)`, filter: 'blur(5px)', clipPath: 'inset(14% 28% 14% 28%)' }
      ], { duration: 760, easing: ease, fill: 'forwards' });
      animate(incoming, [
        { opacity: 0, transform: `translateX(${12 * direction}px) scale(1.035)`, filter: 'blur(5px)', clipPath: 'inset(10% 36% 10% 36%)' },
        { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0)', clipPath: 'inset(0% 0% 0% 0%)' }
      ], { duration: offscreen ? 520 : cover ? 870 : 820, delay: offscreen ? 40 : cover ? 90 : 300, easing: ease, fill: 'both' });
      animate(energy, [
        { opacity: 0, transform: 'scale(.9)' },
        { opacity: .7, transform: 'scale(1)', offset: .35 },
        { opacity: 0, transform: 'scale(1.06)' }
      ], { duration: offscreen ? 540 : 880, delay: cover ? 50 : 160, easing: 'ease-out', fill: 'both' });

      const page = document.querySelector('#stage > .slide, #stage > .profile-page');
      const reveals = [...document.querySelectorAll('#stage .opening-reveal, #stage .profile-reveal')].filter(element => element !== target && !element.contains(target));
      if (page) animate(page, [{ opacity: 0 }, { opacity: 1 }], { duration: 540, delay: 180, easing: ease, fill: 'both' });
      reveals.forEach((element, i) => animate(element, [
        { opacity: 0, transform: 'translateY(15px)', filter: 'blur(3px)' },
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }
      ], { duration: 480, delay: 230 + Math.min(i, 12) * 35, easing: ease, fill: 'both' }));

      // The live destination replaces the independently mounted travelling scene.
      handoffTimer = setTimeout(() => target?.classList.remove('bridge-target-scene'), duration - 20);
      animate(frame, [{ opacity: 1 }, { opacity: 0 }], { duration: 150, delay: duration, fill: 'forwards' });
      doneTimer = setTimeout(end, duration + 240);
    }

    if (cover) {
      source.classList.add('bridge-exiting');
      timer = setTimeout(arrive, 250);
    } else {
      buildFrame();
      source.classList.add('bridge-source-scene');
      animate(sourcePage, [{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: 'ease-out', fill: 'forwards' });
      timer = setTimeout(arrive, 150);
    }
    return true;
  }
  window.addEventListener('resize', finish);
  window.addEventListener('beforeprint', finish);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
  reduced.addEventListener('change', event => { if (event.matches) finish(); });
  window.OpeningTransition = { play, finish, get active() { return !!active; }, get committing() { return committing; } };
})();
