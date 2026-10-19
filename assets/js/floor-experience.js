/* Rolagem e acessibilidade da experiência. Funciona também abrindo index.html diretamente. */
(() => {
  'use strict';
  const section = document.getElementById('experiencia');
  const canvas = document.getElementById('floor-canvas');
  const renderer = window.LCWFloorRenderer;
  if (!section || !canvas || !renderer) return;
  let context;
  try { context = canvas.getContext('2d'); } catch (_) { return; }
  if (!context) return; // O estudo SVG e as informações continuam visíveis.

  const sticky = section.querySelector('.floor-sticky');
  const viewport = section.querySelector('.floor-canvas-wrap');
  const slider = document.getElementById('floor-progress');
  const output = document.getElementById('floor-percent');
  const label = document.getElementById('floor-stage-label');
  const description = document.getElementById('floor-description');
  const instruction = document.getElementById('floor-instruction');
  const buttons = Array.from(section.querySelectorAll('[data-floor-stage]'));
  const media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const clamp = value => Math.max(0, Math.min(1, value));
  const descriptions = [
    'O cuidado começa na avaliação e na preparação da superfície que vai receber a madeira.',
    'Cada régua encontra o seu lugar. O desenho, o material e a instalação dão forma ao ambiente.',
    'O acabamento revela os veios e valoriza a madeira. Produtos e brilho são escolhidos para cada piso.'
  ];
  const labels = ['01 / PREPARAÇÃO', '02 / INSTALAÇÃO', '03 / ACABAMENTO'];
  const accessible = ['preparação da base', 'instalação das réguas de madeira', 'polimento e acabamento'];
  let progress = media.matches ? 1 : 0;
  let width = 0, height = 0, pending = false, inView = true, manual = false;
  let lastScrollY = window.scrollY || 0;

  function render() {
    const index = renderer.stageFor(progress);
    const percent = Math.round(progress * 100);
    renderer.draw(context, width, height, progress);
    slider.value = String(percent);
    slider.setAttribute('aria-valuetext', percent + '%: ' + accessible[index]);
    output.textContent = percent + '%';
    label.textContent = labels[index];
    description.textContent = descriptions[index];
    canvas.setAttribute('aria-label', 'Maquete ilustrativa: ' + accessible[index] + '. Progresso de ' + percent + '%.');
    section.dataset.stage = String(index);
    slider.style.setProperty('--floor-progress', percent + '%');
    buttons.forEach((button, position) => button.setAttribute('aria-pressed', String(position === index)));
  }

  function measure() {
    const box = viewport.getBoundingClientRect();
    width = Math.max(1, box.width || viewport.clientWidth || 600);
    height = Math.max(1, box.height || viewport.clientHeight || 400);
    const density = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    context.setTransform(density, 0, 0, density, 0, 0);
  }

  function fromScroll() {
    if (media.matches || manual) return;
    const box = section.getBoundingClientRect();
    const style = window.getComputedStyle(sticky);
    if (style.position === 'sticky') {
      const top = parseFloat(style.top) || 0;
      const distance = Math.max(1, box.height - sticky.offsetHeight);
      progress = clamp((top - box.top) / distance);
    } else {
      // Em telas baixas a seção segue o fluxo; o controle manual continua disponível.
      progress = clamp((window.innerHeight * .58 - box.top) / Math.max(1, box.height * .82));
    }
  }

  function requestRender() {
    if (pending || !inView) return;
    pending = true;
    window.requestAnimationFrame(() => {
      pending = false;
      if (!inView) return;
      fromScroll(); render();
    });
  }

  function choose(value) {
    manual = true;
    progress = clamp(Number(value) / 100);
    render();
  }
  slider.addEventListener('input', () => choose(slider.value));
  buttons.forEach(button => button.addEventListener('click', () => choose(button.dataset.floorStage)));
  window.addEventListener('scroll', () => {
    const position = window.scrollY || 0;
    if (position === lastScrollY) return;
    lastScrollY = position;
    manual = false;
    if (!media.matches) requestRender();
  }, { passive: true });
  window.addEventListener('resize', () => { measure(); requestRender(); }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); requestRender(); }).observe(viewport);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      if (inView) requestRender();
    }, { rootMargin: '160px 0px', threshold: 0 }).observe(section);
  }
  function syncMotion() {
    section.classList.toggle('floor-reduced-motion', media.matches);
    instruction.textContent = media.matches ? 'Explore as etapas pelos botões ou pelo controle abaixo.' : 'Role a página e acompanhe cada detalhe da transformação.';
    if (media.matches) { progress = 1; manual = true; }
    else manual = false;
    measure(); fromScroll(); render();
  }
  if (media.addEventListener) media.addEventListener('change', syncMotion);
  canvas.hidden = false;
  section.querySelector('.floor-fallback').hidden = true;
  section.querySelector('.floor-steps').hidden = false;
  section.querySelector('.floor-controls').hidden = false;
  section.classList.add('is-interactive');
  syncMotion();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); requestRender(); });
})();
