/* LCW Pisos — interações sem bibliotecas e sem armazenamento de dados pessoais. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const whatsappNumber = '5511951149397';
  const serviceData = {
    restauracao: { name: 'Restauração', image: 'assets/images/living-room.webp', caption: 'Restaurar para valorizar.', alt: 'Exemplo demonstrativo de piso de madeira renovado em uma sala', index: '01', context: 'Fotos do piso e dos pontos de desgaste ajudam na primeira avaliação.' },
    instalacao: { name: 'Instalação', image: 'assets/images/reading-room.webp', caption: 'O começo de um novo ambiente.', alt: 'Exemplo demonstrativo de instalação de piso em chevron em uma sala de leitura', index: '02', context: 'Conte se já escolheu a madeira e se o ambiente está em obra.' },
    raspagem: { name: 'Raspagem', image: 'assets/images/living-room-before.webp', caption: 'Um novo capítulo para a madeira.', alt: 'Simulação demonstrativa de piso desgastado para avaliação de raspagem', index: '03', context: 'A indicação de raspagem depende do material e das condições do piso.' },
    polimento: { name: 'Polimento', image: 'assets/images/living-room.webp', caption: 'O detalhe faz a diferença.', alt: 'Exemplo demonstrativo de acabamento de piso de madeira', index: '04', context: 'Conte como está o acabamento e o que gostaria de melhorar.' },
    limpeza: { name: 'Limpeza de pisos', image: 'assets/images/reading-room.webp', caption: 'Cuidado para o seu dia a dia.', alt: 'Exemplo demonstrativo de piso de madeira em ambiente organizado', index: '05', context: 'Informe o tipo de piso e a necessidade de limpeza para orientar o serviço.' },
    decks: { name: 'Decks de madeira', image: 'assets/images/deck.webp', caption: 'A natureza continua aqui.', alt: 'Exemplo demonstrativo de deck de madeira junto a uma piscina', index: '06', context: 'Você quer um deck novo ou renovar o existente? Vamos entender sua ideia.' },
    orientacao: { name: 'Preciso de orientação', context: 'Tudo bem ter dúvidas. Descreva seu ambiente e converse com a equipe.' }
  };
  const projects = [
    { image: 'assets/images/living-room.webp', title: 'Restaurar a beleza natural.', category: 'RESTAURAÇÃO / INTERIORES', service: 'restauracao', alt: 'Sala com piso de madeira em espinha de peixe. Referência ilustrativa de ambiente.', description: 'Uma referência de como a madeira e a luz podem valorizar um espaço. A viabilidade de restauração depende da avaliação do piso.' },
    { image: 'assets/images/reading-room.webp', title: 'Desenhos que valorizam.', category: 'INSTALAÇÃO / INTERIORES', service: 'instalacao', alt: 'Sala de leitura com piso de madeira em desenho chevron. Referência ilustrativa de ambiente.', description: 'A textura e a paginação da madeira ajudam a criar a atmosfera do ambiente. O material e o desenho são definidos para cada projeto.' },
    { image: 'assets/images/deck.webp', title: 'Natureza em continuidade.', category: 'DECKS / ÁREAS EXTERNAS', service: 'decks', alt: 'Deck de madeira junto a uma piscina e jardim tropical. Referência ilustrativa de ambiente.', description: 'Uma possibilidade de integração entre arquitetura e área externa. Conte à LCW se você quer instalar um deck ou cuidar do existente.' }
  ];

  // Navegação responsiva.
  const header = $('#site-header');
  const menuButton = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  function closeMenu() {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    header.classList.remove('menu-open');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    header.classList.toggle('menu-open', open);
  });
  $$('a', mobileNav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
  });
  if (window.matchMedia) {
    const desktopMedia = window.matchMedia('(min-width: 1001px)');
    if (desktopMedia.addEventListener) desktopMedia.addEventListener('change', event => { if (event.matches) closeMenu(); });
  }

  // Serviços: um painel aberto por vez, com referência visual correspondente.
  const serviceArticles = $$('.service');
  const serviceTriggers = $$('.service-toggle');
  serviceTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      serviceArticles.forEach(article => {
        const active = article === trigger.closest('.service');
        article.classList.toggle('active', active);
        $('.service-toggle', article).setAttribute('aria-expanded', String(active));
        $('.service-detail', article).hidden = !active;
      });
      const data = serviceData[trigger.closest('.service').dataset.service];
      const image = $('#service-image');
      image.src = data.image;
      image.alt = data.alt;
      $('#service-caption').textContent = data.caption;
      $('#service-index').textContent = data.index + ' / 06';
    });
    trigger.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowDown') target = (index + 1) % serviceTriggers.length;
      if (event.key === 'ArrowUp') target = (index - 1 + serviceTriggers.length) % serviceTriggers.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = serviceTriggers.length - 1;
      if (target !== undefined) { event.preventDefault(); serviceTriggers[target].focus(); }
    });
  });

  // Modais nativos: foco, Escape, clique no fundo e retorno ao acionador.
  const lightbox = $('#lightbox');
  const privacyDialog = $('#privacy-dialog');
  const returnFocus = new Map();
  function syncDialogScroll() { document.body.classList.toggle('dialog-open', $$('dialog[open]').length > 0); }
  function showDialog(dialog) {
    if (dialog.open) return;
    returnFocus.set(dialog, document.activeElement);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else { dialog.setAttribute('open', ''); dialog.classList.add('dialog-fallback'); }
    syncDialogScroll();
    const firstButton = $('button', dialog);
    if (firstButton) firstButton.focus({ preventScroll: true });
  }
  function finishDialogClose(dialog) {
    syncDialogScroll();
    const previous = returnFocus.get(dialog);
    if (previous && previous.isConnected) previous.focus({ preventScroll: true });
    returnFocus.delete(dialog);
  }
  function closeDialog(dialog, restore = true) {
    if (!restore) returnFocus.delete(dialog);
    if (typeof dialog.close === 'function') dialog.close();
    else { dialog.removeAttribute('open'); finishDialogClose(dialog); }
    syncDialogScroll();
  }
  [lightbox, privacyDialog].forEach(dialog => {
    dialog.addEventListener('close', () => finishDialogClose(dialog));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(dialog);
    });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape' && typeof dialog.showModal !== 'function') { event.preventDefault(); closeDialog(dialog); }
      if (event.key === 'Tab' && typeof dialog.showModal !== 'function') {
        const focusable = $$('button:not([disabled]),a[href],input,textarea,select', dialog).filter(node => !node.hidden);
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  });
  $$('[data-open-privacy]').forEach(button => button.addEventListener('click', () => showDialog(privacyDialog)));
  $('#privacy-close').addEventListener('click', () => closeDialog(privacyDialog));
  $('#privacy-ok').addEventListener('click', () => closeDialog(privacyDialog));

  // Galeria: os controles de navegação respeitam o filtro ativo.
  const projectCards = $$('.project-card');
  let visibleProjects = [0, 1, 2];
  let currentProject = 0;
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    $$('.filter').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    $('#gallery-grid').dataset.filter = filter;
    visibleProjects = [];
    projectCards.forEach(card => {
      const visible = filter === 'todos' || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) visibleProjects.push(Number(card.dataset.project));
    });
    const count = visibleProjects.length;
    $('#gallery-count').textContent = String(count).padStart(2, '0') + (count === 1 ? ' referência' : ' referências');
  }));
  function renderProject(id) {
    currentProject = id;
    const project = projects[id];
    $('#lightbox-image').src = project.image;
    $('#lightbox-image').alt = project.alt;
    $('#lightbox-title').textContent = project.title;
    $('#lightbox-category').textContent = project.category;
    $('#lightbox-description').textContent = project.description;
    $('#lightbox-counter').textContent = String(visibleProjects.indexOf(id) + 1).padStart(2, '0') + ' / ' + String(visibleProjects.length).padStart(2, '0');
    $('#lightbox-prev').disabled = visibleProjects.length < 2;
    $('#lightbox-next').disabled = visibleProjects.length < 2;
  }
  function moveProject(direction) {
    if (visibleProjects.length < 2) return;
    const position = visibleProjects.indexOf(currentProject);
    renderProject(visibleProjects[(position + direction + visibleProjects.length) % visibleProjects.length]);
  }
  projectCards.forEach(card => card.addEventListener('click', () => { renderProject(Number(card.dataset.project)); showDialog(lightbox); }));
  $('#lightbox-close').addEventListener('click', () => closeDialog(lightbox));
  $('#lightbox-prev').addEventListener('click', () => moveProject(-1));
  $('#lightbox-next').addEventListener('click', () => moveProject(1));
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); moveProject(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveProject(-1); }
  });
  let swipeStart = null;
  $('.lightbox-image-wrap').addEventListener('touchstart', event => { if (event.touches.length === 1) swipeStart = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }, { passive: true });
  $('.lightbox-image-wrap').addEventListener('touchend', event => {
    if (!swipeStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - swipeStart.x;
    const dy = event.changedTouches[0].clientY - swipeStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) moveProject(dx < 0 ? 1 : -1);
    swipeStart = null;
  }, { passive: true });

  // Comparador: duas imagens alinhadas, range nativo e posições rápidas.
  const range = $('#compare-range');
  const comparison = $('#comparison');
  function updateComparison() {
    const value = Math.max(0, Math.min(100, Number(range.value)));
    comparison.style.setProperty('--position', value + '%');
    range.setAttribute('aria-valuetext', value + '% do antes visível');
    $('.compare-label-before').style.opacity = value < 15 ? '0' : '1';
    $('.compare-label-after').style.opacity = value > 85 ? '0' : '1';
    $$('.compare-presets button').forEach(button => {
      const active = Number(button.dataset.compare) === value;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  range.addEventListener('input', updateComparison);
  $$('.compare-presets button').forEach(button => button.addEventListener('click', () => { range.value = button.dataset.compare; updateComparison(); }));

  // Formulário: dados ficam em memória; o envio depende da ação do visitante no WhatsApp.
  const form = $('#quote-form');
  const steps = $$('.form-step');
  const formError = $('#form-error');
  let currentStep = 0;
  let lastService = '';
  const conditionSets = {
    common: { label: 'Como está o piso hoje?', options: ['Desgaste ou perda de brilho', 'Riscos ou manchas', 'Quero mudar o acabamento', 'Preciso de uma avaliação'] },
    instalacao: { label: 'Em que etapa está o ambiente?', options: ['Obra em andamento', 'Ambiente pronto para receber o piso', 'Estou escolhendo o material', 'Preciso de orientação'] },
    decks: { label: 'O que você precisa no deck?', options: ['Instalar um deck novo', 'Restaurar um deck existente', 'Limpeza ou manutenção do deck', 'Preciso de uma avaliação'] },
    limpeza: { label: 'Qual é a necessidade de limpeza?', options: ['Sujeira do uso diário', 'Limpeza após obra', 'Manchas para avaliar', 'Preciso de orientação'] }
  };
  function selectedService() { return $('input[name="service"]:checked', form)?.value || ''; }
  function updateServiceContext() {
    const key = selectedService();
    $('#service-context').textContent = serviceData[key]?.context || 'Escolha um serviço para personalizar seu pedido.';
    if (key !== lastService) {
      if (key === 'decks') $('#material').value = 'Deck de madeira';
      else if (lastService === 'decks' && $('#material').value === 'Deck de madeira') $('#material').value = '';
      const config = conditionSets[key] || conditionSets.common;
      const select = $('#condition');
      const previous = select.value;
      select.replaceChildren();
      const placeholder = document.createElement('option');
      placeholder.value = ''; placeholder.textContent = 'Prefiro explicar na conversa'; select.append(placeholder);
      config.options.forEach(text => { const option = document.createElement('option'); option.value = text; option.textContent = text; select.append(option); });
      if (config.options.includes(previous)) select.value = previous;
      const label = $('#condition-label');
      label.replaceChildren(document.createTextNode(config.label + ' '));
      const optional = document.createElement('span'); optional.textContent = 'opcional'; label.append(optional);
      lastService = key;
    }
  }
  function values() {
    const key = selectedService();
    const area = $('#area').value;
    return {
      service: serviceData[key]?.name || 'A definir',
      material: $('#material').value || 'A confirmar',
      city: $('#city').value.trim(), district: $('#district').value.trim(),
      property: $('#property').value || 'A definir',
      area: $('#unknown-area').checked || !area ? 'A confirmar' : Number(area).toLocaleString('pt-BR') + ' m²',
      condition: $('#condition').value || 'A avaliar na conversa', timing: $('#timing').value,
      name: $('#client-name').value.trim(), notes: $('#notes').value.trim()
    };
  }
  function message(data) {
    const location = (data.city || 'Cidade a confirmar') + (data.district ? ' — ' + data.district : '');
    return 'Olá, LCW Pisos!' + (data.name ? ' Meu nome é ' + data.name + '.' : '') + '\n\nGostaria de conversar sobre este projeto:\n\n' +
      '• Serviço: ' + data.service + '\n• Tipo de piso: ' + data.material + '\n• Local: ' + location + '\n• Ambiente: ' + data.property + '\n• Área aproximada: ' + data.area + '\n• Situação: ' + data.condition + '\n• Previsão: ' + data.timing +
      (data.notes ? '\n\nObservações:\n' + data.notes : '') + '\n\nPodemos conversar sobre a avaliação e o orçamento?';
  }
  function whatsappUrl() { return 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message(values())); }
  function updateSummary() {
    const data = values();
    const rows = [ ['Serviço', data.service], ['Tipo de piso', data.material], ['Local', (data.city || 'A confirmar') + (data.district ? ' / ' + data.district : '')], ['Área', data.area], ['Ambiente', data.property], ['Previsão', data.timing] ];
    const list = $('#summary-list');
    list.replaceChildren();
    rows.forEach(([title, value]) => {
      const row = document.createElement('div'); row.className = 'summary-row';
      const term = document.createElement('dt'); term.textContent = title;
      const detail = document.createElement('dd'); detail.textContent = value;
      row.append(term, detail); list.append(row);
    });
    $('#message-preview').value = message(data);
    $('#notes-count').textContent = String($('#notes').value.length);
    $('#whatsapp-fallback-link').href = whatsappUrl();
  }
  function clearError() {
    formError.hidden = true; formError.textContent = '';
    $$('[aria-invalid="true"]', form).forEach(input => { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); });
  }
  function showError(text, control) {
    formError.textContent = text; formError.hidden = false;
    if (control) { control.setAttribute('aria-invalid', 'true'); control.setAttribute('aria-describedby', 'form-error'); control.focus(); }
    return false;
  }
  function setStep(step, focus = true) {
    currentStep = Math.max(0, Math.min(2, step));
    steps.forEach((fieldset, index) => { fieldset.hidden = index !== currentStep; });
    $$('.form-steps li').forEach((item, index) => {
      item.classList.toggle('active', index === currentStep); item.classList.toggle('complete', index < currentStep);
      if (index === currentStep) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
    });
    $('#step-fraction').textContent = String(currentStep + 1).padStart(2, '0') + ' / 03';
    $('#form-progress-fill').style.width = ((currentStep + 1) / 3 * 100) + '%';
    $('#form-back').hidden = currentStep === 0;
    $('#form-next').hidden = currentStep === 2;
    $('#form-send').hidden = currentStep !== 2;
    $('#whatsapp-fallback').hidden = true;
    clearError(); updateSummary();
    if (focus) {
      const legend = $('legend', steps[currentStep]);
      legend.setAttribute('tabindex', '-1'); legend.focus({ preventScroll: true });
      if (typeof $('.quote-panel').scrollIntoView === 'function') $('.quote-panel').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    }
  }
  function validateStep(step) {
    if (step === 0 && !selectedService()) return showError('Escolha um serviço ou selecione “Preciso de orientação” para continuar.', $('input[name="service"]', form));
    if (step === 1 && !$('#city').value.trim()) return showError('Informe sua cidade para consultar o atendimento.', $('#city'));
    if (step === 1 && !$('#area').disabled && !$('#area').checkValidity()) return showError('Informe uma área entre 1 e 100.000 m², com até uma casa decimal, ou deixe em branco.', $('#area'));
    if (step === 2 && !$('#client-name').value.trim()) return showError('Informe seu nome antes de continuar no WhatsApp.', $('#client-name'));
    for (const control of $$('input,select,textarea', steps[step])) {
      if (!control.disabled && !control.checkValidity()) return showError('Confira o campo indicado para continuar.', control);
    }
    return true;
  }
  function advance() { clearError(); if (validateStep(currentStep)) setStep(currentStep + 1); }
  $('#form-next').addEventListener('click', advance);
  $('#form-back').addEventListener('click', () => setStep(currentStep - 1));
  $('#edit-project').addEventListener('click', () => setStep(0));
  $('#unknown-area').addEventListener('change', () => { $('#area').disabled = $('#unknown-area').checked; updateSummary(); });
  form.addEventListener('input', () => { clearError(); updateServiceContext(); updateSummary(); $('#whatsapp-fallback').hidden = true; });
  form.addEventListener('change', () => { clearError(); updateServiceContext(); updateSummary(); $('#whatsapp-fallback').hidden = true; });
  function chooseService(key) {
    const radio = $('input[name="service"][value="' + key + '"]', form);
    if (radio) radio.checked = true;
    updateServiceContext(); setStep(0, false);
    if (typeof $('#orcamento').scrollIntoView === 'function') $('#orcamento').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    if (radio) radio.focus({ preventScroll: true });
  }
  $$('[data-quote-service]').forEach(button => button.addEventListener('click', () => chooseService(button.dataset.quoteService)));
  $('#lightbox-quote').addEventListener('click', () => { const key = projects[currentProject].service; closeDialog(lightbox, false); chooseService(key); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (currentStep < 2) { advance(); return; }
    clearError();
    for (let index = 0; index < steps.length; index++) {
      setStep(index, false);
      if (!validateStep(index)) return;
    }
    updateSummary();
    const url = whatsappUrl();
    $('#whatsapp-fallback-link').href = url;
    $('#whatsapp-fallback').hidden = false;
    try { window.open(url, '_blank', 'noopener,noreferrer'); } catch (_) { /* O link abaixo continua disponível se o navegador bloquear a abertura. */ }
    notify('Pedido preparado. Revise e envie a mensagem no WhatsApp.');
  });

  let toastTimer;
  function notify(text) {
    const toast = $('#toast');
    window.clearTimeout(toastTimer); toast.textContent = text; toast.hidden = false;
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4800);
  }
  $('#copy-message').addEventListener('click', async () => {
    const text = message(values());
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); notify('Mensagem copiada.'); return; }
    } catch (_) { /* Tenta a seleção local quando o navegador restringe a área de transferência. */ }
    const preview = $('#message-preview');
    $('.message-details').open = true; preview.focus(); preview.select(); preview.setSelectionRange(0, preview.value.length);
    try { if (typeof document.execCommand === 'function' && document.execCommand('copy')) { notify('Mensagem copiada.'); return; } } catch (_) { /* O texto continua selecionado. */ }
    notify('O texto está selecionado. Use a opção Copiar do seu dispositivo.');
  });

  // Dicas: conserva a interação nativa de details e uma orientação aberta por vez.
  const careItems = $$('.care-list details');
  careItems.forEach(item => item.addEventListener('toggle', () => {
    if (item.open) careItems.forEach(other => { if (other !== item) other.open = false; });
  }));

  // Perguntas: mantém uma resposta aberta por vez.
  const faqItems = $$('.faq-list details');
  faqItems.forEach(item => item.addEventListener('toggle', () => { if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; }); }));

  // Efeitos leves de rolagem, respeitando a preferência por menos movimento.
  let scrollPending = false;
  function syncScroll() {
    const position = window.scrollY || 0;
    header.classList.toggle('scrolled', position > 35);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    $('.scroll-progress').style.width = (max > 0 ? Math.min(100, position / max * 100) : 0) + '%';
    if (!reducedMotion && position < $('.hero').offsetHeight + 100) $('.hero-image').style.setProperty('--hero-y', Math.min(22, position * .035) + 'px');
    scrollPending = false;
  }
  window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; window.requestAnimationFrame(syncScroll); } }, { passive: true });
  syncScroll();
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .06, rootMargin: '0px 0px -25px 0px' });
    document.documentElement.classList.add('motion-ready');
    $$('.reveal').forEach(element => observer.observe(element));
  }
  if ('IntersectionObserver' in window) {
    const navigationObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('.desktop-nav a').forEach(link => { if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    }), { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    ['servicos', 'projetos', 'experiencia', 'cuidados'].forEach(id => navigationObserver.observe(document.getElementById(id)));
  }
  updateServiceContext(); updateSummary(); updateComparison();
})();
