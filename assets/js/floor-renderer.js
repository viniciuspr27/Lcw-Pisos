/* LCW Pisos — maquete vetorial em perspectiva. Sem imagens, WebGL ou dependências. */
(function (scope) {
  'use strict';
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a.map((value, index) => Math.round(value + (b[index] - value) * t));
  const color = values => 'rgb(' + values.join(',') + ')';
  const model = [];
  const tones = [[159, 123, 85], [178, 139, 96], [147, 107, 72], [168, 125, 81], [186, 149, 104], [155, 114, 76]];

  for (let row = 0; row < 10; row++) {
    const cuts = row % 2 ? [-3, -2, 0, 2, 3] : [-3, -1, 1, 3];
    for (let column = 0; column < cuts.length - 1; column++) {
      const index = model.length;
      model.push({ index, row, x: cuts[column] + .009, y: -2.1 + row * .42 + .009, width: cuts[column + 1] - cuts[column] - .018, depth: .402, tone: tones[(row * 7 + column * 3) % tones.length] });
    }
  }

  function boardState(board, progress) {
    const local = clamp((progress - .08 - board.index / (model.length - 1) * .46) / .15);
    const settled = smooth(local);
    return { local, settled, lift: (1 - settled) * 1.8, opacity: clamp(local * 3), offset: (1 - settled) * .18 };
  }

  function stageFor(progress) {
    return progress < .08 ? 0 : progress < .74 ? 1 : 2;
  }

  function draw(ctx, width, height, value) {
    if (!ctx || width <= 0 || height <= 0) return;
    const progress = clamp(Number(value) || 0);
    const polish = smooth((progress - .74) / .26);
    const scale = Math.min(width / 10, height / 7.4);
    const origin = { x: width * .5, y: height * .61 };
    const project = (x, y, z = 0) => ({ x: origin.x + (x - y) * scale * .84, y: origin.y + (x + y) * scale * .38 - z * scale });
    const point = vertex => project(vertex[0], vertex[1], vertex[2] || 0);
    function path(vertices) {
      ctx.beginPath();
      vertices.forEach((vertex, index) => { const p = point(vertex); if (index) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
      ctx.closePath();
    }
    function quad(vertices, fill, stroke) {
      path(vertices);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = .6; ctx.stroke(); }
    }
    function line(vertices, stroke, lineWidth = 1) {
      ctx.beginPath();
      vertices.forEach((vertex, index) => { const p = point(vertex); if (index) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
      ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke();
    }
    const plane = (x, y, w, d, z) => [[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]];

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    // Luz ambiente e sombra da maquete sobre o fundo grafite.
    const halo = ctx.createRadialGradient(width * .54, height * .43, 0, width * .54, height * .43, width * .52);
    halo.addColorStop(0, 'rgba(184,156,102,.09)'); halo.addColorStop(1, 'rgba(184,156,102,0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(origin.x, origin.y + scale * .85); ctx.scale(1, .36);
    const shadow = ctx.createRadialGradient(0, 0, scale, 0, 0, scale * 4.7);
    shadow.addColorStop(0, 'rgba(0,0,0,.45)'); shadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadow; ctx.fillRect(-scale * 5, -scale * 5, scale * 10, scale * 10); ctx.restore();

    // Espessura do contrapiso, superfície mineral e juntas de referência.
    quad([[-3, 2.1, -.25], [3, 2.1, -.25], [3, 2.1, 0], [-3, 2.1, 0]], '#575748');
    quad([[3, -2.1, -.25], [3, 2.1, -.25], [3, 2.1, 0], [3, -2.1, 0]], '#77715f');
    const concrete = ctx.createLinearGradient(0, origin.y - scale * 2, width, origin.y + scale * 2);
    concrete.addColorStop(0, '#a29c88'); concrete.addColorStop(1, '#7c7b6c');
    quad(plane(-3, -2.1, 6, 4.2, 0), concrete);
    ctx.save(); path(plane(-3, -2.1, 6, 4.2, .005)); ctx.clip();
    for (let i = 0; i < 70; i++) {
      const x = -3 + ((i * 137) % 599) / 100;
      const y = -2.1 + ((i * 71) % 419) / 100;
      line([[x, y, .01], [x + .09, y + .025, .01]], i % 2 ? '#dfdbc31c' : '#242e2422', .7);
    }
    for (let i = -2; i <= 2; i++) line([[i, -2.1, .012], [i, 2.1, .012]], '#343f3020', .6);
    for (let i = -1; i <= 1; i++) line([[-3, i, .012], [3, i, .012]], '#343f3020', .6);
    ctx.restore();

    // Duas paredes em corte, com uma janela recuada e perfis finos.
    const leftWall = ctx.createLinearGradient(0, 0, width * .5, height);
    leftWall.addColorStop(0, '#b6ae97'); leftWall.addColorStop(1, '#777c6b');
    quad([[-3, -2.1, 0], [-3, 2.1, 0], [-3, 2.1, 1.65], [-3, -2.1, 1.65]], leftWall, '#ddd4b529');
    const backWall = ctx.createLinearGradient(0, 0, width, height * .5);
    backWall.addColorStop(0, '#b6ae94'); backWall.addColorStop(1, '#d6ccb0');
    quad([[-3, -2.1, 0], [3, -2.1, 0], [3, -2.1, 1.65], [-3, -2.1, 1.65]], backWall, '#ded6bb60');
    quad([[-3, -2.1, 1.65], [3, -2.1, 1.65], [3, -2.21, 1.65], [-3.11, -2.21, 1.65]], '#e0d6be');
    quad([[-3, -2.1, 1.65], [-3, 2.1, 1.65], [-3.11, 2.1, 1.65], [-3.11, -2.21, 1.65]], '#cec5ae');
    quad([[-3.11, 2.1, 0], [-3, 2.1, 0], [-3, 2.1, 1.65], [-3.11, 2.1, 1.65]], '#cbc2aa');
    const glass = ctx.createLinearGradient(0, height * .16, width, height * .4);
    glass.addColorStop(0, '#536256'); glass.addColorStop(.55, '#8e9b82'); glass.addColorStop(1, '#c9cbb0');
    quad([[-.85, -2.085, .43], [2.25, -2.085, .43], [2.25, -2.085, 1.42], [-.85, -2.085, 1.42]], '#4b5146');
    quad([[-.77, -2.07, .5], [2.17, -2.07, .5], [2.17, -2.07, 1.35], [-.77, -2.07, 1.35]], glass);
    line([[.69, -2.055, .49], [.69, -2.055, 1.38]], '#39483c', 2);
    line([[-.85, -2.03, .42], [2.25, -2.03, .42]], '#e0d8bb', 2);
    line([[-2.99, 2.1, .075], [-2.99, -2.09, .075], [3, -2.09, .075]], '#716f5c', 2);

    const boards = model.map(board => ({ board, state: boardState(board, progress) })).sort((a, b) => (a.board.x + a.board.y) - (b.board.x + b.board.y));
    // Sombras das peças que ainda estão acima da base.
    boards.forEach(({ board, state }) => {
      if (state.opacity === 0 || state.lift < .04) return;
      ctx.save(); ctx.globalAlpha = state.opacity * .18;
      quad(plane(board.x + state.lift * .12, board.y + state.lift * .15, board.width, board.depth, .015), '#1c2217');
      ctx.restore();
    });

    boards.forEach(({ board, state }) => {
      if (state.opacity === 0) return;
      const x = board.x, y = board.y - state.offset, z = .065 + state.lift;
      const wet = smooth((polish * 7 - (x + board.width * .5 + 3)) / 1.1);
      const rich = board.tone.map((channel, index) => Math.max(0, channel - [21, 30, 29][index]));
      const tone = mix(board.tone, rich, wet);
      ctx.save(); ctx.globalAlpha = state.opacity;
      quad([[x, y + board.depth, z - .065], [x + board.width, y + board.depth, z - .065], [x + board.width, y + board.depth, z], [x, y + board.depth, z]], color(tone.map(v => Math.round(v * .64))));
      quad([[x + board.width, y, z - .065], [x + board.width, y + board.depth, z - .065], [x + board.width, y + board.depth, z], [x + board.width, y, z]], color(tone.map(v => Math.round(v * .78))));
      const surface = plane(x, y, board.width, board.depth, z);
      quad(surface, color(tone), 'rgba(255,225,177,.14)');
      ctx.save(); path(surface); ctx.clip();
      for (let strand = 0; strand < 7; strand++) {
        const vertices = [];
        const lineY = y + .035 + strand * .054;
        for (let part = 0; part <= 10; part++) {
          const px = x + part / 10 * board.width;
          const py = lineY + Math.sin(part * .64 + board.index * 2.3 + strand * .8) * .018;
          vertices.push([px, py, z + .002]);
        }
        line(vertices, strand % 3 === 0 ? 'rgba(255,218,155,.22)' : 'rgba(64,35,16,.17)', strand % 2 ? .65 : .95);
      }
      if (board.index % 4 === 0) {
        const knot = [];
        for (let part = 0; part <= 24; part++) { const a = part / 24 * Math.PI * 2; knot.push([x + board.width * .63 + Math.cos(a) * .17, y + .21 + Math.sin(a) * .031, z + .003]); }
        line(knot, 'rgba(72,42,20,.24)', .7);
      }
      ctx.restore(); ctx.restore();
    });

    if (polish > 0) {
      // Reflexo da janela, revelado apenas na faixa que recebeu acabamento.
      ctx.save(); path(plane(-3, -2.1, 6 * polish, 4.2, .07)); ctx.clip();
      ctx.globalAlpha = .34 * polish;
      const light = ctx.createLinearGradient(origin.x, origin.y - scale, origin.x, origin.y + scale * 1.5);
      light.addColorStop(0, '#fff2cc'); light.addColorStop(.7, '#fff2cc75'); light.addColorStop(1, '#fff2cc00');
      quad([[-1.2, -.6, .074], [1.9, -.6, .074], [2.8, 1.75, .074], [-.3, 1.75, .074]], light);
      ctx.globalAlpha = .12 * polish;
      line([[.35, -.6, .075], [1.25, 1.75, .075]], '#343a26', scale * .055);
      line([[-.75, .58, .075], [2.35, .58, .075]], '#343a26', scale * .045);
      ctx.globalAlpha = .1 * polish;
      line([[-1.2, -.6, .076], [1.9, -.6, .076], [2.8, 1.75, .076]], '#fff5da', 1);
      ctx.restore();
    }

    if (progress > .745 && progress < .995) {
      // Cabeçote de polimento: uma passagem ilustrativa sobre a madeira.
      const phase = clamp((progress - .745) / .25);
      const x = -2.7 + 5.4 * phase, y = .15 + Math.sin(phase * Math.PI * 3) * .9;
      const ring = (r, z) => Array.from({ length: 41 }, (_, index) => { const a = index / 40 * Math.PI * 2; return [x + Math.cos(a) * r, y + Math.sin(a) * r, z]; });
      ctx.save(); ctx.globalAlpha = Math.min(1, phase * 12, (1 - phase) * 18);
      quad(ring(.41, .078), '#181e1770');
      quad(ring(.31, .12), '#b9ad8d');
      quad(ring(.26, .19), '#454e40', '#d9c59d');
      quad(ring(.11, .23), '#c7ae83');
      line([[x, y, .21], [x + .23, y - .32, .87]], '#d6ccb5', 2.4);
      line([[x + .08, y - .32, .87], [x + .38, y - .32, .87]], '#c7ae83', 3);
      ctx.restore();
    }

    // Contorno frontal e linhas de implantação, sem medidas fictícias.
    line([[-3, 2.1, -.25], [3, 2.1, -.25], [3, -2.1, -.25]], '#d8bf8638', .8);
    ctx.setLineDash([3, 5]);
    line([[-3, 2.45, -.25], [3, 2.45, -.25]], '#bdac7a32', .7);
    line([[3.35, -2.1, -.25], [3.35, 2.1, -.25]], '#bdac7a32', .7);
    ctx.setLineDash([]);
    ctx.restore();
  }

  const api = { draw, stageFor, boardState, model };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else scope.LCWFloorRenderer = api;
})(typeof window !== 'undefined' ? window : globalThis);
