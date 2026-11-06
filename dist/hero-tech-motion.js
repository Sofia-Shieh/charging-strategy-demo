/* Procedural EV digital twin. All geometry is original; no network or live data. */
(() => {
  'use strict';
  const PLAYBACK_RATE = 1.8;
  const clamp = (n, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
  const smooth = n => { const t = clamp(n); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;
  const P = (x, y, z) => ({ x, y, z });
  const interpolate = (a, b, t) => P(mix(a.x, b.x, t), mix(a.y, b.y, t), mix(a.z, b.z, t));
  const ORANGE = '#ff710e';
  const profiles = [
    [-272, 62, 66, 59], [-258, 85, 78, 70], [-230, 97, 85, 78],
    [-190, 101, 91, 82], [-145, 102, 97, 85], [-90, 102, 99, 87],
    [-25, 102, 100, 88], [50, 102, 101, 89], [120, 101, 100, 89],
    [180, 99, 99, 85], [220, 95, 96, 81], [247, 83, 87, 75], [260, 65, 77, 65]
  ];
  const roofProfiles = [
    [-121, 89, 100], [-96, 82, 122], [-65, 75, 140], [-38, 74, 145],
    [25, 74, 146], [72, 76, 143], [106, 82, 133], [134, 88, 113], [157, 92, 102]
  ];
  const wheelXs = [-174, 176];

  function profileAt(x, entries = profiles) {
    let a = entries[0], b = entries[1];
    for (let i = 1; i < entries.length; i++) {
      a = entries[i - 1]; b = entries[i];
      if (x <= b[0]) break;
    }
    const t = clamp((x - a[0]) / (b[0] - a[0]));
    return a.map((value, i) => mix(value, b[i], t));
  }

  function wheelArch(x, radius = 50) {
    let height = 25;
    wheelXs.forEach(cx => {
      const distance = Math.abs(x - cx);
      if (distance < radius) height = Math.max(height, 43 + Math.sqrt(radius * radius - distance * distance));
    });
    return height;
  }

  function bodyPoint(x, u) {
    const [, width, top, shoulder] = profileAt(x);
    // Wheel openings belong to the side panel; keep the hood's upper loft smooth.
    const edge = Math.max(shoulder, top - 1);
    return P(x, mix(top + 1.8, edge, Math.pow(Math.abs(u), 1.7)), width * u);
  }

  function roofPoint(x, u) {
    const [, width, top] = profileAt(x, roofProfiles);
    return P(x, top - 8 * Math.pow(Math.abs(u), 1.7), width * u);
  }

  function range(from, to, step, point) {
    const result = [];
    for (let n = from; n <= to + .001; n += step) result.push(point(n));
    if ((to - from) % step) result.push(point(to));
    return result;
  }

  function ring(center, radius, plane = 'xy', count = 64) {
    return Array.from({ length: count + 1 }, (_, i) => {
      const a = i * Math.PI * 2 / count;
      return plane === 'xz' ? P(center.x + Math.cos(a) * radius, center.y, center.z + Math.sin(a) * radius) :
        P(center.x + Math.cos(a) * radius, center.y + Math.sin(a) * radius, center.z);
    });
  }

  function rounded(points, ratio = .09) {
    const result = [];
    points.forEach((point, i) => {
      const before = interpolate(point, points[(i - 1 + points.length) % points.length], ratio);
      const after = interpolate(point, points[(i + 1) % points.length], ratio);
      for (let step = 0; step <= 5; step++) {
        const t = step / 5;
        result.push(interpolate(interpolate(before, point, t), interpolate(point, after, t), t));
      }
    });
    return result;
  }

  function bezier(a, b, c, d, t) {
    const s = 1 - t;
    return P(s * s * s * a.x + 3 * s * s * t * b.x + 3 * s * t * t * c.x + t * t * t * d.x,
      s * s * s * a.y + 3 * s * s * t * b.y + 3 * s * t * t * c.y + t * t * t * d.y,
      s * s * s * a.z + 3 * s * s * t * b.z + 3 * s * t * t * c.z + t * t * t * d.z);
  }

  const cable = range(0, 1, .025, t => bezier(P(202, 87, 103), P(239, 17, 157), P(334, 17, 145), P(351, 116, 96), t));
  const feedback = Array.from({ length: 97 }, (_, i) => {
    const angle = i / 96 * Math.PI * 2;
    return P(Math.cos(angle) * 326, 1, Math.sin(angle) * 147);
  });

  function createRenderer(canvas) {
    const baseContext = canvas?.getContext('2d', { alpha: true });
    if (!baseContext) return { resize() {}, render() {}, valid: false };
    let ctx = baseContext;
    // Reuse one small compositing surface. No image fetch or per-frame PNG encoding.
    const revealCanvas = document.createElement('canvas');
    const revealContext = revealCanvas.getContext('2d', { alpha: true });
    let width = 992, height = 620, dpr = 1, scale = 1;
    let yaw = .41, pitch = .34, centerX = 0, centerY = 0, cameraScale = 1;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width > 1 ? rect.width : 992;
      height = rect.height > 1 ? rect.height : 620;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      revealCanvas.width = canvas.width;
      revealCanvas.height = canvas.height;
      scale = Math.min(width / 845, height / 500);
      centerX = width * .435;
      centerY = height * .657;
    }

    function project(point, lift = 0) {
      const rx = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
      const depth = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
      const perspective = 1 / (1 - depth / 1500);
      return { x: centerX + rx * scale * perspective * cameraScale,
        y: centerY + (depth * pitch - (point.y + lift)) * scale * perspective * cameraScale, depth };
    }

    function path(points, color, lineWidth = 1, amount = 1, lift = 0, dash = null) {
      if (points.length < 2 || amount <= 0) return;
      const projected = points.map(point => project(point, lift));
      const lengths = projected.slice(1).map((point, i) => Math.hypot(point.x - projected[i].x, point.y - projected[i].y));
      let remaining = lengths.reduce((sum, n) => sum + n, 0) * clamp(amount);
      ctx.beginPath(); ctx.moveTo(projected[0].x, projected[0].y);
      for (let i = 1; i < projected.length; i++) {
        const a = projected[i - 1], b = projected[i], length = lengths[i - 1];
        if (remaining >= length) { ctx.lineTo(b.x, b.y); remaining -= length; }
        else { const t = length ? remaining / length : 0; ctx.lineTo(mix(a.x, b.x, t), mix(a.y, b.y, t)); break; }
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(.45, lineWidth * Math.min(1.35, scale));
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
    }

    function polygon(points, fill, stroke, lineWidth = .7, lift = 0) {
      const screen = points.map(point => project(point, lift));
      ctx.beginPath(); screen.forEach((point, i) => i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = Math.max(.4, lineWidth * scale); ctx.stroke(); }
    }

    function pointGlow(point, size = 2, alpha = 1, color = ORANGE) {
      const p = project(point);
      ctx.save(); ctx.globalAlpha *= alpha;
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 10 * scale;
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1, size * scale), 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    function layer(amount, draw) {
      if (amount <= 0) return;
      ctx.save(); ctx.globalAlpha *= clamp(amount); draw(); ctx.restore();
    }

    function drawGround(progress, t, phase) {
      layer(progress, () => {
        for (let z = -230; z <= 230; z += 46) {
          const alpha = .045 + (1 - Math.abs(z) / 300) * .05;
          path([P(-415, 0, z), P(435, 0, z)], 'rgba(174,184,193,' + alpha + ')', .6, progress);
        }
        for (let x = -414; x <= 414; x += 46) path([P(x, 0, -230), P(x, 0, 230)], 'rgba(174,184,193,.075)', .6, progress);
        const corners = [P(-308, .5, -132), P(291, .5, -132), P(291, .5, 132), P(-308, .5, 132), P(-308, .5, -132)];
        path(corners, 'rgba(201,207,211,.2)', .8, progress, 0, [7 * scale, 9 * scale]);
        [-1, 1].forEach(s => {
          path([P(-309, 1, s * 104), P(-309, 1, s * 132), P(-274, 1, s * 132)], 'rgba(255,111,16,.66)', 1.1, progress);
          path([P(255, 1, s * 132), P(292, 1, s * 132), P(292, 1, s * 105)], 'rgba(255,111,16,.46)', 1.1, progress);
        });
        const route = [P(-389, 1, 92), P(-349, 1, 92), P(-349, 1, -166), P(350, 1, -166), P(350, 1, 55)];
        path(route, phase === 0 ? 'rgba(255,111,16,.28)' : 'rgba(255,111,16,.11)', .85, progress);
        [route[0], route[2], route[3], route[4]].forEach(p => {
          path(ring(p, 4, 'xz', 16), 'rgba(255,111,16,.55)', .8);
        });
        if (phase === 2) {
          path(feedback, 'rgba(255,111,16,.2)', .9);
          for (let n = 0; n < 3; n++) {
            const a = ((t * .1 + n / 3) % 1) * Math.PI * 2;
            pointGlow(P(Math.cos(a) * 326, 1, Math.sin(a) * 147), 1.6, .85);
            const trail = range(a - .28, a, .035, angle => P(Math.cos(angle) * 326, 1, Math.sin(angle) * 147));
            path(trail, 'rgba(255,154,77,.68)', 1.4);
          }
        }
      });
    }

    function drawWheel(x, z, progress, near) {
      const lift = (1 - progress) * 16;
      layer(progress, () => {
        const center = P(x, 43, z), face = z + (near ? 7 : -7);
        polygon(ring(center, 44), '#080a0c', near ? 'rgba(211,218,224,.65)' : 'rgba(146,158,168,.22)', .8, lift);
        path(ring(P(x, 43, face), 44), near ? 'rgba(200,210,218,.57)' : 'rgba(150,165,174,.23)', 1.2, progress, lift);
        path(ring(P(x, 43, face), 37), near ? 'rgba(229,234,237,.55)' : 'rgba(180,193,202,.22)', .8, 1, lift);
        path(ring(P(x, 43, face + 1), 29), near ? 'rgba(226,233,238,.65)' : 'rgba(180,193,202,.26)', 1, 1, lift);
        path(ring(P(x, 43, face + 2), 9), near ? 'rgba(255,128,40,.8)' : 'rgba(218,228,235,.25)', .8, 1, lift);
        for (let n = 0; n < 10; n++) {
          const a = n / 10 * Math.PI * 2 + .13;
          const inside = P(x + Math.cos(a) * 10, 43 + Math.sin(a) * 10, face + 2);
          const outside = P(x + Math.cos(a + .12) * 29, 43 + Math.sin(a + .12) * 29, face + 1);
          path([inside, outside], near ? 'rgba(217,227,234,.7)' : 'rgba(164,180,191,.23)', 1.4, progress, lift);
          path([P(x + Math.cos(a + .1) * 12, 43 + Math.sin(a + .1) * 12, face + 2),
            P(x + Math.cos(a + .22) * 29, 43 + Math.sin(a + .22) * 29, face + 1)], near ? 'rgba(174,187,199,.33)' : 'rgba(164,180,191,.13)', .65, progress, lift);
        }
        for (let n = 0; n < 32; n++) {
          const a = n / 32 * Math.PI * 2;
          path([P(x + Math.cos(a) * 40, 43 + Math.sin(a) * 40, face), P(x + Math.cos(a + .025) * 44, 43 + Math.sin(a + .025) * 44, z)],
            near ? 'rgba(169,184,197,.2)' : 'rgba(169,184,197,.09)', .55, 1, lift);
        }
      });
    }

    function drawBody(progress, roofProgress, t, phase) {
      const lift = (1 - progress) * 28;
      layer(progress, () => {
        const nearTop = range(-272, 260, 14, x => bodyPoint(x, 1));
        const farTop = range(-272, 260, 14, x => bodyPoint(x, -1));
        polygon([...farTop, ...nearTop.slice().reverse()], 'rgba(17,21,25,.96)', 'rgba(225,233,239,.37)', 1, lift);
        [-1, 1].forEach(side => {
          const top = range(-272, 260, 7, x => bodyPoint(x, side));
          const bottom = range(-272, 260, 7, x => {
            const width = profileAt(x)[1];
            return P(x, Math.max(x < -250 || x > 240 ? 36 : 25, wheelArch(x, 48)), width * side * .98);
          });
          polygon([...top, ...bottom.slice().reverse()], side > 0 ? '#12171c' : '#0b0e11', side > 0 ? 'rgba(220,231,239,.6)' : 'rgba(160,180,194,.2)', .9, lift);
          path(bottom, side > 0 ? 'rgba(208,222,233,.52)' : 'rgba(160,180,194,.18)', .8, progress, lift);
          const crease = range(-245, 235, 10, x => {
            const topPoint = bodyPoint(x, side);
            return P(x, Math.max(topPoint.y - 15, wheelArch(x, 50) + 1), topPoint.z * 1.008);
          });
          path(crease, side > 0 ? 'rgba(199,214,225,.28)' : 'rgba(160,180,194,.12)', .65, progress, lift);
        });
        for (let u = -.8; u <= .81; u += .2) {
          path(range(-272, 260, 10, x => bodyPoint(x, u)), 'rgba(199,214,225,.15)', .6, progress, lift);
        }
        for (let x = -258; x <= 247; x += 26) {
          path(range(-1, 1, .1, u => bodyPoint(x, u)), 'rgba(210,223,233,.22)', .65, progress, lift);
        }
        path(range(-272, 260, 10, x => bodyPoint(x, 1)), 'rgba(239,245,249,.7)', 1.25, progress, lift);
        path(range(-260, 245, 12, x => bodyPoint(x, -.98)), 'rgba(228,237,243,.44)', 1, progress, lift);
        // Door apertures, flush handles, fender and sill details.
        [18, 131].forEach(x => path([P(x, 99, 103), P(x + 3, 71, 104), P(x + 5, 30, 101)], 'rgba(224,235,242,.4)', .85, progress, lift));
        path([P(-112, 95, 103), P(-118, 71, 104), P(-117, 29, 101)], 'rgba(224,235,242,.31)', .75, progress, lift);
        path([P(-120, 28, 100), P(121, 28, 100)], 'rgba(255,126,33,.64)', 1.4, progress, lift);
        [[-14, 8], [95, 118]].forEach(([a, b]) => path([P(a, 85, 104), P(b, 85, 104)], 'rgba(233,242,247,.78)', 1.3, progress, lift));
        polygon([P(-269, 67, -60), P(-269, 67, 60), P(-266, 39, 69), P(-266, 39, -69)], '#0b1014', 'rgba(187,205,218,.26)', .65, lift);
        path([P(-268, 69, -62), P(-272, 71, -25), P(-273, 71, 27), P(-267, 72, 66)], 'rgba(244,249,252,.96)', 2.1, progress, lift);
        path([P(-251, 83, 89), P(-265, 75, 70), P(-269, 71, 49)], 'rgba(244,249,252,.84)', 1.3, progress, lift);
        path([P(-265, 40, -64), P(-271, 37, 0), P(-265, 40, 65)], 'rgba(255,113,14,.5)', 1.1, progress, lift);
        path([P(255, 76, -64), P(260, 76, 0), P(254, 76, 66)], 'rgba(255,104,10,.92)', 1.8, progress, lift);
      });
      layer(roofProgress, () => {
        const roofLift = (1 - roofProgress) * 40;
        const near = range(-121, 157, 8, x => roofPoint(x, 1));
        const far = range(-121, 157, 8, x => roofPoint(x, -1));
        polygon([...far, ...near.slice().reverse()], 'rgba(16,22,28,.96)', 'rgba(221,233,242,.65)', 1.1, roofLift);
        const windscreen = [P(-119, 101, -88), P(-119, 101, 88), P(-63, 133, 75), P(-63, 133, -75)];
        polygon(rounded(windscreen, .07), 'rgba(22,31,39,.96)', 'rgba(218,232,242,.61)', 1, roofLift);
        for (let row = 1; row < 6; row++) {
          const a = interpolate(windscreen[0], windscreen[3], row / 6);
          const b = interpolate(windscreen[1], windscreen[2], row / 6);
          path([a, b], 'rgba(151,173,190,.14)', .55, roofProgress, roofLift);
        }
        [-1, 1].forEach(side => {
          const s = side;
          const frontGlass = [P(-107, 102, 92 * s), P(-58, 133, 77 * s), P(-39, 137, 76 * s), P(15, 138, 76 * s), P(17, 101, 100 * s)];
          const backGlass = [P(29, 101, 100 * s), P(29, 137, 77 * s), P(77, 134, 79 * s), P(111, 120, 85 * s), P(141, 102, 94 * s)];
          polygon(rounded(frontGlass), '#0c1218', side > 0 ? 'rgba(229,240,248,.79)' : 'rgba(175,198,213,.25)', .9, roofLift);
          polygon(rounded(backGlass), '#0e151c', side > 0 ? 'rgba(229,240,248,.72)' : 'rgba(175,198,213,.22)', .9, roofLift);
          path([P(-119, 99, 94 * s), P(157, 100, 94 * s)], side > 0 ? 'rgba(231,242,248,.65)' : 'rgba(175,198,213,.2)', .8, roofProgress, roofLift);
        });
        for (let u = -.8; u <= .81; u += .4) path(range(-60, 127, 8, x => roofPoint(x, u)), 'rgba(203,222,236,.18)', .55, roofProgress, roofLift);
        for (let x = -45; x <= 110; x += 25) path(range(-1, 1, .1, u => roofPoint(x, u)), 'rgba(203,222,236,.24)', .6, roofProgress, roofLift);
        path(near, 'rgba(244,249,252,.9)', 1.25, roofProgress, roofLift);
        path(far, 'rgba(213,231,243,.45)', .9, roofProgress, roofLift);
        path([P(-112, 103, 91), P(-61, 134, 76)], 'rgba(255,143,62,.75)', 1, roofProgress, roofLift);
        // A sculpted mirror and its small support complete the recognizable silhouette.
        path([P(-89, 107, 94), P(-94, 109, 117)], 'rgba(219,232,241,.7)', 1.6, roofProgress, roofLift);
        polygon([P(-108, 109, 116), P(-95, 116, 123), P(-76, 112, 125), P(-79, 104, 118)], '#17212a', 'rgba(234,244,250,.72)', .8, roofLift);
      });
    }

    function drawCharger(progress, t, phase) {
      layer(progress, () => {
        const lift = (1 - progress) * 35;
        const x0 = 333, x1 = 369, z0 = 66, z1 = 103, y1 = 190;
        polygon([P(x0 - 8, 2, z0 - 8), P(x1 + 8, 2, z0 - 8), P(x1 + 8, 2, z1 + 8), P(x0 - 8, 2, z1 + 8)], '#11171d', 'rgba(165,184,198,.31)', .8);
        polygon([P(x0, 7, z0), P(x0, y1, z0), P(x1, y1, z0), P(x1, 7, z0)], '#131920', 'rgba(175,193,207,.43)', .8, lift);
        polygon([P(x1, 7, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, 7, z1)], '#181d22', 'rgba(205,222,235,.55)', .9, lift);
        polygon([P(x0, 7, z1), P(x0, y1, z1), P(x1, y1, z1), P(x1, 7, z1)], '#11171b', 'rgba(236,244,249,.67)', 1, lift);
        polygon([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], '#212931', 'rgba(214,230,241,.63)', .8, lift);
        polygon([P(x0 + 2, 13, z1 + .2), P(x0 + 2, y1 - 5, z1 + .2), P(x0 + 7, y1 - 5, z1 + .2), P(x0 + 7, 13, z1 + .2)], '#e05a08', null, 0, lift);
        path([P(x0 + 5, 13, z1 + 1), P(x0 + 5, y1 - 5, z1 + 1)], '#ff8a37', 1.1, progress, lift);
        polygon([P(344, 141, z1 + 1), P(344, 172, z1 + 1), P(362, 172, z1 + 1), P(362, 141, z1 + 1)], '#070b0e', 'rgba(185,210,229,.48)', .7, lift);
        path([P(353, 166, z1 + 2), P(348, 156, z1 + 2), P(354, 156, z1 + 2), P(351, 147, z1 + 2), P(359, 160, z1 + 2), P(353, 160, z1 + 2)], ORANGE, 1.1, progress, lift);
        [122, 128, 134].forEach(y => path([P(346, y, z1 + 1), P(362, y, z1 + 1)], 'rgba(199,219,234,.23)', .5, progress, lift));
        path([P(351, 112, z1 + 3), P(351, 123, z1 + 3)], '#dce8ef', 3, progress, lift);
        if (progress >= .99) pointGlow(P(359, 180, z1 + 1), 1.2, .6 + .25 * Math.sin(t * 2));
      });
    }

    function drawCable(progress, t, phase) {
      layer(progress, () => {
        path(cable, '#0a0c0e', 6.5, progress);
        path(cable, 'rgba(227,235,239,.32)', 3.8, progress);
        ctx.save(); ctx.shadowColor = ORANGE; ctx.shadowBlur = 7 * scale;
        path(cable, 'rgba(255,111,16,.93)', 2.05, progress);
        ctx.restore();
        polygon([P(192, 80, 104), P(192, 94, 104), P(211, 94, 104), P(211, 80, 104)], '#1a1d1d', 'rgba(255,119,24,.85)', .8);
        path([P(202, 87, 103), P(208, 82, 115)], '#f4d8bd', 3, progress);
        if (progress < .99) return;
        for (let n = 0; n < (phase === 1 ? 3 : 2); n++) {
          const amount = 1 - ((t * .19 + n * .43) % 1);
          const p = bezier(P(202, 87, 103), P(239, 17, 157), P(334, 17, 145), P(351, 116, 96), amount);
          for (let tail = 4; tail >= 0; tail--) {
            const start = clamp(amount + tail * .022), end = clamp(start + .028);
            path(range(start, end, .007, a => bezier(P(202, 87, 103), P(239, 17, 157), P(334, 17, 145), P(351, 116, 96), a)), 'rgba(255,193,142,' + (.7 - tail * .12) + ')', 2.5);
          }
          pointGlow(p, 2.8, .5 + .5 * Math.pow(Math.sin(amount * Math.PI), .5));
          pointGlow(p, 1.15, .85, '#ffe0bd');
        }
        pointGlow(P(202, 87, 106), 2.3, .7 + .22 * Math.sin(t * 2.5));
        const pulse = (t * .7) % 1;
        path(ring(P(202, 87, 106), 4 + pulse * 15, 'xy', 28), 'rgba(255,144,63,' + ((1 - pulse) * .36) + ')', .8);
      });
    }

    function drawScan(progress, t, phase) {
      if (progress < .99) return;
      const cycle = (Math.max(0, t - 3.5) % 7.8) / 4.6;
      if (cycle > 1) return;
      const x = -258 + smooth(cycle) * 506;
      const strength = (phase === 1 ? .8 : .48) * Math.pow(Math.sin(cycle * Math.PI), .35);
      layer(strength, () => {
        polygon([P(x, 2, -117), P(x, 166, -117), P(x, 166, 117), P(x, 2, 117)], 'rgba(255,112,18,.035)', null);
        path([P(x, 2, -117), P(x, 166, -117), P(x, 166, 117), P(x, 2, 117)], 'rgba(255,117,25,.22)', .7);
        path(range(-1, 1, .06, u => { const p = bodyPoint(x, u); p.y += 1; return p; }), '#ff8c3a', 1.65);
        if (x > -120 && x < 157) path(range(-1, 1, .07, u => { const p = roofPoint(x, u); p.y += 1; return p; }), '#ffa565', 1.5);
        path([P(x, 1, -122), P(x, 1, 122)], 'rgba(255,121,30,.42)', 1);
      });
    }

    function drawInspection(spot, t) {
      if (!revealContext || !spot || spot.alpha < .008 || t < 3.3) return;
      if (spot.x + spot.radius < 0 || spot.x - spot.radius > width || spot.y + spot.radius < 0 || spot.y - spot.radius > height) return;
      ctx = revealContext;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      const strength = spot.alpha * smooth((t - 3.3) / .8);
      ctx.globalAlpha = strength;
      // The second layer exposes engineering detail in the same original model.
      for (let x = -250; x < 245; x += 23) path(range(-1, 1, .1, u => bodyPoint(x, u)), 'rgba(255,159,82,.84)', .9);
      for (let u = -.8; u <= .81; u += .2) path(range(-268, 250, 12, x => bodyPoint(x, u)), 'rgba(255,191,137,.55)', .75);
      for (let x = -60; x <= 125; x += 23) path(range(-1, 1, .1, u => roofPoint(x, u)), 'rgba(255,170,101,.9)', .9);
      [-1, 1].forEach(side => {
        path(range(-120, 153, 9, x => roofPoint(x, side)), '#ffd1a5', 1.4);
        path(range(-265, 255, 10, x => bodyPoint(x, side)), '#ffad6e', 1.3);
      });
      path([P(333,7,104),P(333,190,104),P(369,190,104),P(369,7,104)], '#ffbc88', 1.8);
      path(cable, '#ffd2a9', 3.1);
      wheelXs.forEach(x => {
        path(ring(P(x,43,113),37), 'rgba(255,173,103,.85)', 1.1);
        pointGlow(P(x,43,114),2.8,.85,'#ffc994');
      });
      [-1,1].forEach(side => {
        path([P(-330,1,side*150),P(-290,1,side*150),P(-290,1,side*130),P(290,1,side*130),P(290,1,side*150),P(370,1,side*150)], 'rgba(255,151,70,.75)', 1);
        pointGlow(P(-330,1,side*150),2.4,.9);
        pointGlow(P(370,1,side*150),2.4,.9);
      });
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      const mask = ctx.createRadialGradient(spot.x,spot.y,0,spot.x,spot.y,spot.radius);
      mask.addColorStop(0,'#000'); mask.addColorStop(.35,'#000');
      mask.addColorStop(.6,'rgba(0,0,0,.72)'); mask.addColorStop(.82,'rgba(0,0,0,.18)'); mask.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=mask; ctx.fillRect(0,0,width,height); ctx.restore();
      ctx=baseContext;
      ctx.save(); ctx.globalCompositeOperation='screen';
      ctx.drawImage(revealCanvas,0,0,width,height); ctx.restore();
    }

    function render(time = 3, phase = 0, pointerX = 0, pointerY = 0, staticMode = false, camera = null, spotlight = null) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const t = staticMode ? 5.8 : time;
      // One time-derived camera is shared by the cover, flight and landing preview.
      // The original composition and geometry stay intact; only the viewing motion changes.
      const arrive = staticMode ? 1 : smooth(t / 3.8);
      const orbit = staticMode ? 0 : Math.max(0, t - 3.8);
      yaw = (camera?.yaw ?? (.41 + .14 * (1 - arrive) + Math.sin(orbit * .22) * .065)) + pointerX * .045;
      pitch = (camera?.pitch ?? (.34 + .045 * (1 - arrive) + Math.sin(orbit * .18) * .015)) + pointerY * .025;
      cameraScale = staticMode ? 1 : 1 + .07 * (1 - arrive) + Math.sin(orbit * .16) * .012;
      const grid = smooth(t / .9);
      const wheels = smooth((t - .35) / .95);
      const body = smooth((t - .55) / 1.6);
      const roof = smooth((t - 1.25) / 1.6);
      const charger = smooth((t - .4) / 1.6);
      const energy = smooth((t - 2.3) / 1.15);
      const haze = ctx.createRadialGradient(width * .58, height * .62, 0, width * .58, height * .62, width * .42);
      haze.addColorStop(0, 'rgba(107,123,137,.035)'); haze.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = haze; ctx.fillRect(0, 0, width, height);
      drawGround(grid, t, phase);
      wheelXs.forEach(x => drawWheel(x, -103, wheels, false));
      drawCharger(charger, t, phase);
      drawBody(body, roof, t, phase);
      wheelXs.forEach(x => drawWheel(x, 106, wheels, true));
      drawScan(energy, t, phase);
      drawCable(energy, t, phase);
      if (!staticMode) drawInspection(spotlight, t);
    }
    resize();
    return { resize, render, valid: true };
  }

  let current = null;
  function unmount() { current?.cleanup(); }
  function leave(done) { if (current) current.leave(done); else if (typeof done === 'function') done(); }
  function drawPoster(canvas) { const renderer = createRenderer(canvas); renderer.render(3.2, 2, 0, 0, true); }

  // The opening transition and its landing scene share the same camera/time seed.
  let previewSeed = null;
  function seedPreview(seed) { previewSeed = seed; }
  function capture() { return current?.state() || { elapsed: 5.8, phase: 2, px: 0, py: 0 }; }
  function mountPreview(canvas, seed = previewSeed || { elapsed: 5.8, phase: 2, px: 0, py: 0 }) {
    const renderer = createRenderer(canvas);
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    let elapsed = seed.elapsed, raf = null, previous = null, disposed = false;
    const paint = () => renderer.render(elapsed, seed.phase, seed.px || 0, seed.py || 0, query.matches);
    const resize = () => { if (!disposed) { renderer.resize(); paint(); } };
    const observer = new ResizeObserver(resize);
    function stop() { if (raf !== null) cancelAnimationFrame(raf); raf = null; previous = null; }
    function frame(time) {
      raf = null;
      if (disposed || !canvas.isConnected) { cleanup(); return; }
      if (document.hidden || query.matches) return;
      if (previous !== null) elapsed += Math.min((time - previous) / 1000, .05) * PLAYBACK_RATE;
      previous = time; paint(); raf = requestAnimationFrame(frame);
    }
    function sync() { stop(); paint(); if (!disposed && !document.hidden && !query.matches) raf = requestAnimationFrame(frame); }
    function cleanup() {
      if (disposed) return;
      disposed = true; stop(); observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('resize', resize);
      query.removeEventListener('change', sync);
    }
    observer.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('resize', resize, { passive: true });
    query.addEventListener('change', sync);
    sync(); return cleanup;
  }

  function mount(root) {
    unmount();
    if (!root?.isConnected) return () => {};
    const canvas = root.querySelector('.tech-canvas');
    if (!canvas) return () => {};
    const renderer = createRenderer(canvas);
    const pause = root.querySelector('.tech-pause'), replay = root.querySelector('.tech-replay');
    const buttons = Array.from(root.querySelectorAll('[data-tech-phase]'));
    const briefTitle = root.querySelector('.tech-brief-title'), briefCopy = root.querySelector('.tech-brief-copy');
    const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const fineQuery = matchMedia('(hover:hover) and (pointer:fine)');
    const texts = [
      ['场站 · 用户 · 区域', '看清市场，识别供需缺口'],
      ['人群 · 定价 · 生命周期', '匹配阶段，让资源投入形成合力'],
      ['订单 · 份额 · 利润', '持续监测，用经营反馈校准策略']
    ];
    const listeners = [], frozen = new Set();
    let raf = null, previous = null, elapsed = 0, disposed = false, paused = false;
    let reduced = reducedQuery.matches, phase = -1, manual = false, entering = true, exit = null, suspended = false;
    let px = 0, py = 0, targetX = 0, targetY = 0;
    const inspect = { engaged:false, touch:false, x:0, y:0, tx:0, ty:0, alpha:0, radius:200, rootRect:null, canvasRect:null };
    const inspectVars = new Map();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;

    function listen(target, type, handler, options) {
      target?.addEventListener(type, handler, options);
      listeners.push(() => target?.removeEventListener(type, handler, options));
    }
    function watch(query, handler) {
      if (query.addEventListener) listen(query, 'change', handler);
      else { query.addListener(handler); listeners.push(() => query.removeListener(handler)); }
    }
    function stop() { if (raf !== null) cancelAnimationFrame(raf); raf = null; previous = null; }
    function active() { return !disposed && root.isConnected && !document.hidden && !suspended && (!!exit || (!paused && !reduced)); }
    function freeze() {
      root.getAnimations?.({ subtree: true }).forEach(animation => {
        if (animation.playState === 'running') {
          try { animation.pause(); frozen.add(animation); } catch (_) { /* Detached. */ }
        }
      });
      root.classList.add('is-paused');
    }
    function thaw() {
      root.classList.remove('is-paused');
      frozen.forEach(animation => { try { if (animation.playState === 'paused') animation.play(); } catch (_) { /* Detached. */ } });
      frozen.clear();
    }
    function controls() {
      root.dataset.motion = exit ? 'leaving' : reduced ? 'reduced' : paused ? 'paused' : 'playing';
      if (pause) {
        pause.disabled = reduced || !!exit;
        pause.setAttribute('aria-pressed', String(paused && !reduced));
        pause.setAttribute('aria-label', reduced ? '已按系统偏好简化动效' : paused ? '继续封面动效' : '暂停封面动效');
        pause.textContent = reduced ? '静态模式' : paused ? '继续 ▶' : '暂停 Ⅱ';
      }
      if (replay) replay.disabled = reduced || !!exit;
      buttons.forEach(button => {
        const selected = Number(button.dataset.techPhase) === phase;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
        button.disabled = !!exit;
      });
    }
    function setPhase(next) {
      if (phase === next) return;
      phase = next; root.dataset.phase = String(next);
      if (briefTitle) briefTitle.textContent = texts[next][0];
      if (briefCopy) briefCopy.textContent = texts[next][1];
      root.classList.remove('phase-changing');
      void root.offsetWidth;
      if (!paused && !reduced) root.classList.add('phase-changing');
      controls();
    }
    function setInspectVar(name, value) {
      if (inspectVars.get(name) === value) return;
      inspectVars.set(name,value); root.style.setProperty(name,value);
    }
    function hideInspection(immediate = false) {
      inspect.engaged = false; inspect.touch = false;
      if (immediate) {
        inspect.alpha = 0;
        setInspectVar('--inspect-alpha','0');
        root.dataset.inspectControl = 'false';
      }
    }
    function engageInspection(event) {
      if (reduced || paused || exit || suspended || disposed || document.hidden || root.classList.contains('bridge-exiting')) return;
      if (event.pointerType === 'mouse' && !fineQuery.matches) return;
      if (!inspect.engaged) { inspect.x = event.clientX; inspect.y = event.clientY; }
      inspect.engaged = true; inspect.tx = event.clientX; inspect.ty = event.clientY;
      inspect.rootRect = root.getBoundingClientRect();
      inspect.canvasRect = canvas.getBoundingClientRect();
      inspect.radius = clamp(Math.min(inspect.rootRect.width,inspect.rootRect.height)*.3,100,250);
      root.dataset.inspectControl = String(!!event.target.closest?.('button,a'));
    }
    function updateInspection(dt) {
      if (!inspect.rootRect || (!inspect.engaged && inspect.alpha === 0)) return;
      const follow = 1-Math.exp(-14*dt), fade = 1-Math.exp(-12*dt);
      inspect.x += (inspect.tx-inspect.x)*follow; inspect.y += (inspect.ty-inspect.y)*follow;
      inspect.alpha += ((inspect.engaged?1:0)-inspect.alpha)*fade;
      if (!inspect.engaged && inspect.alpha < .006) inspect.alpha=0;
      const rect=inspect.rootRect, scale=rect.width?root.clientWidth/rect.width:1;
      setInspectVar('--inspect-x',((inspect.x-rect.left)*scale).toFixed(2)+'px');
      setInspectVar('--inspect-y',((inspect.y-rect.top)*scale).toFixed(2)+'px');
      setInspectVar('--inspect-radius',(inspect.radius*scale).toFixed(1)+'px');
      setInspectVar('--inspect-alpha',inspect.alpha.toFixed(3));
    }
    function paint() {
      const rect=inspect.canvasRect;
      const spot=rect && inspect.alpha>.006 ? { x:inspect.x-rect.left,y:inspect.y-rect.top,radius:inspect.radius,alpha:inspect.alpha } : null;
      renderer.render(reduced ? 3.2 : elapsed, phase, px, py, reduced, null, spot);
    }
    function resize() { if (!disposed) { hideInspection(true); renderer.resize(); paint(); } }
    function start() { if (active() && raf === null) { previous = null; raf = requestAnimationFrame(frame); } }
    function finishLeave() {
      const done = exit?.done;
      if (exit) exit.done = null;
      stop();
      if (typeof done === 'function') done();
    }
    function frame(timestamp) {
      raf = null;
      if (!root.isConnected) { cleanup(); return; }
      if (!active()) return;
      const dt = previous === null ? 0 : clamp((timestamp - previous) / 1000, 0, .05);
      previous = timestamp;
      if (exit) {
        exit.elapsed += dt;
        if (exit.elapsed >= .3) { finishLeave(); return; }
      } else {
        elapsed += dt * PLAYBACK_RATE;
        // Let the model assemble and the first charging pulse connect before copy enters.
        if (entering && elapsed >= 3.6) {
          entering = false; root.classList.add('is-ready');
        }
        if (!manual) setPhase(Math.floor(Math.max(0, elapsed - 3.8) / 7) % 3);
        const amount = 1 - Math.exp(-5 * dt);
        px += (targetX - px) * amount; py += (targetY - py) * amount;
        if (root.classList.contains('bridge-exiting')) hideInspection(true);
        else updateInspection(dt);
        paint();
      }
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      stop();
      if (active()) { thaw(); start(); }
      else { hideInspection(true); paint(); freeze(); }
      controls();
    }
    function onPause() { if (!reduced && !exit) { paused = !paused; sync(); } }
    function onReplay() {
      if (reduced || exit || disposed) return;
      stop(); thaw(); paused = false; manual = false; elapsed = 0;
      px = py = targetX = targetY = 0;
      hideInspection(true);
      root.classList.remove('is-ready');
      void root.offsetWidth;
      entering = true; setPhase(0); paint(); sync();
    }
    function onPointer(event) {
      if (event.pointerType === 'mouse' || inspect.touch) engageInspection(event);
      if (!fineQuery.matches || reduced || paused || exit || suspended || event.pointerType === 'touch') return;
      const bounds = root.getBoundingClientRect();
      targetX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1) * 2 - 1;
      targetY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1) * 2 - 1;
    }
    function resetPointer() { targetX = targetY = 0; hideInspection(); }
    function onPointerDown(event) {
      if (event.pointerType === 'mouse') return;
      inspect.touch=true; engageInspection(event);
    }
    function onPointerUp(event) { if (event.pointerType !== 'mouse') hideInspection(); }
    function onPhase(event) {
      const button = event.target.closest('[data-tech-phase]');
      if (!button || !root.contains(button) || exit) return;
      const next = Number(button.dataset.techPhase);
      if (!Number.isInteger(next) || next < 0 || next > 2) return;
      manual = true; setPhase(next); paint();
      if (paused) { void root.offsetWidth; freeze(); }
    }
    function onReduced(event) {
      reduced = event.matches;
      if (reduced) {
        entering = false; root.classList.add('is-ready'); px = py = targetX = targetY = 0;
        if (exit) { finishLeave(); return; }
        paint();
      }
      sync();
    }
    function onVisibility() {
      if (document.hidden && exit) { finishLeave(); return; }
      sync();
    }
    function beginLeave(done) {
      if (disposed) { if (typeof done === 'function') done(); return; }
      if (exit) { exit.done = done; return; }
      exit = { elapsed: 0, done };
      hideInspection(true); paint();
      if (reduced || document.hidden) { finishLeave(); return; }
      thaw(); root.classList.add('is-leaving'); sync();
    }
    function cleanup() {
      if (disposed) return;
      disposed = true; stop(); observer?.disconnect();
      hideInspection(true);
      listeners.splice(0).forEach(remove => remove());
      if (exit) exit.done = null;
      frozen.clear(); root.classList.add('is-paused');
      if (current === controller) current = null;
    }
    const controller = { cleanup, leave: beginLeave, state: () => ({ elapsed, phase, px, py }), suspend: value => { suspended = !!value; sync(); } };
    current = controller;
    observer?.observe(canvas);
    listen(window, 'resize', resize, { passive: true });
    listen(root, 'pointerenter', event => { if (event.pointerType==='mouse') engageInspection(event); }, { passive: true });
    listen(root, 'pointermove', onPointer, { passive: true });
    listen(root, 'pointerdown', onPointerDown, { passive: true });
    listen(root, 'pointerup', onPointerUp, { passive: true });
    listen(root, 'pointercancel', onPointerUp, { passive: true });
    listen(root, 'pointerleave', resetPointer, { passive: true });
    listen(window, 'blur', resetPointer);
    // Scrolling changes the transformed slide's screen coordinates without pointermove.
    listen(document, 'scroll', () => { hideInspection(true); if (!disposed) paint(); }, { passive:true, capture:true });
    listen(root, 'click', onPhase);
    listen(pause, 'click', onPause); listen(replay, 'click', onReplay);
    listen(document, 'visibilitychange', onVisibility);
    watch(reducedQuery, onReduced);
    watch(fineQuery, resetPointer);
    root.classList.add('is-mounted');
    setPhase(0); paint();
    if (reduced) { entering = false; root.classList.add('is-ready'); }
    sync();
    return cleanup;
  }
  window.EVHero = { mount, unmount, leave, drawPoster, capture, seedPreview, mountPreview, createWireframeRenderer: createRenderer, suspend: value => current?.suspend(value) };
})();
