/* LCW Pisos — comparador por gesto e orçamento com contexto. */
(() => {
  'use strict';
  if (window.LCWQuoteUpgrade) return;
  const $ = selector => document.querySelector(selector);
  const deckServices = ['decks', 'restauracao_deck', 'limpeza_deck'];
  const services = {
    raspagem_acabamento: { name: 'Raspagem e acabamento', context: 'Conte sobre o desgaste e o acabamento desejado. A equipe avalia os procedimentos indicados para a madeira.' },
    instalacao_acabamento: { name: 'Instalação e acabamento', context: 'Informe se o material já foi escolhido e em que etapa está o ambiente.' },
    restauracao_deck: { name: 'Restauração de deck', context: 'Fotos do deck e das áreas de desgaste ajudam a orientar a avaliação.' },
    limpeza_deck: { name: 'Limpeza de deck', context: 'Conte sobre a exposição à chuva, ao sol e sobre a necessidade de limpeza do deck.' }
  };
  const conditionSets = {
    raspagem_acabamento: { label: 'O que você quer renovar no piso?', options: ['Riscos e desgaste do acabamento', 'Perda de brilho ou aspecto envelhecido', 'Quero avaliar outro acabamento', 'Preciso de uma avaliação'] },
    instalacao_acabamento: { label: 'Em que etapa está o ambiente?', options: ['Obra em andamento', 'Base pronta para receber o piso', 'Estou escolhendo a madeira e o acabamento', 'Preciso de orientação'] },
    restauracao_deck: { label: 'Como está o deck hoje?', options: ['Madeira desgastada ou sem proteção aparente', 'Perda de cor ou acabamento', 'Manchas e sinais de exposição ao tempo', 'Preciso de uma avaliação'] },
    limpeza_deck: { label: 'Qual é a necessidade de limpeza do deck?', options: ['Sujeira do uso diário', 'Limpeza após obra', 'Manchas ou sujeira acumulada para avaliar', 'Preciso de orientação'] }
  };
  const openings = {
    restauracao: 'Gostaria de avaliar a restauração do meu piso de madeira e entender como recuperar sua aparência.',
    instalacao: 'Estou planejando instalar um piso de madeira e gostaria de orientação para organizar o projeto.',
    raspagem: 'Quero avaliar se meu piso pode receber raspagem e saber quais são os próximos passos.',
    polimento: 'Quero cuidar do acabamento do meu piso e entender se o polimento é indicado para ele.',
    limpeza: 'Gostaria de solicitar uma avaliação para a limpeza do meu piso, com um cuidado adequado ao acabamento.',
    decks: 'Estou planejando um projeto com deck de madeira e gostaria de conversar sobre as possibilidades.',
    raspagem_acabamento: 'Gostaria de avaliar a raspagem e a renovação do acabamento do meu piso de madeira.',
    instalacao_acabamento: 'Quero planejar a instalação e o acabamento de um piso de madeira no meu ambiente.',
    restauracao_deck: 'Gostaria de avaliar a restauração do meu deck de madeira e o cuidado indicado para renovar seu acabamento.',
    limpeza_deck: 'Preciso de uma avaliação para limpar meu deck de madeira e conservar seu acabamento.',
    orientacao: 'Gostaria de ajuda para identificar o serviço mais indicado para o meu piso ou deck.'
  };

  function message(data) {
    const location = [data.city, data.district].filter(Boolean).join(' — ') || 'A confirmar';
    const lines = [
      'Olá, equipe LCW Pisos!' + (data.name ? ' Meu nome é ' + data.name + '.' : ''),
      'Encontrei vocês pelo site. ' + (openings[data.serviceKey] || 'Gostaria de conversar sobre o cuidado com meu piso ou deck.'),
      [
        '*Sobre o meu projeto*',
        '• Serviço: ' + data.service,
        '• Ambiente: ' + data.property,
        '• Tipo de piso: ' + (data.material === 'A confirmar' ? 'Preciso de ajuda para identificar' : data.material),
        '• Local: ' + location,
        '• Área aproximada: ' + (data.area === 'A confirmar' ? 'Ainda preciso confirmar a metragem' : data.area),
        ...(data.condition && data.condition !== 'A avaliar na conversa' ? ['• Situação atual: ' + data.condition] : []),
        '• Quando pretendo realizar: ' + data.timing
      ].join('\n')
    ];
    if (data.notes) lines.push('*Mais detalhes*\n' + data.notes);
    lines.push(data.serviceKey === 'orientacao'
      ? 'Podem me orientar sobre a melhor solução e quais informações precisam para a avaliação? Posso enviar fotos do local para ajudar.'
      : 'Podem me orientar sobre a avaliação e os próximos passos para receber um orçamento? Se ajudar, posso enviar fotos do ' + (deckServices.includes(data.serviceKey) ? 'deck.' : 'ambiente.'));
    return lines.join('\n\n');
  }
  window.LCWQuoteUpgrade = { services, conditionSets, deckServices, message };

  // Mantém todos os serviços existentes e acrescenta combinações do mesmo escopo.
  const choices = $('.service-choices');
  if (choices) {
    const anchor = choices.querySelector('input[value="orientacao"]')?.closest('label');
    Object.entries(services).forEach(([value, data]) => {
      if (choices.querySelector('input[value="' + value + '"]')) return;
      const label = document.createElement('label'); label.className = 'choice';
      const input = document.createElement('input'); input.type = 'radio'; input.name = 'service'; input.value = value;
      const text = document.createElement('span'); text.textContent = data.name;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'icon');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use'); use.setAttribute('href', '#icon-check'); svg.append(use);
      text.append(svg); label.append(input, text); choices.insertBefore(label, anchor || null);
    });
  }
  const property = $('#property');
  if (property) {
    const previous = property.value;
    const placeholder = document.createElement('option'); placeholder.value = ''; placeholder.textContent = 'Escolha o tipo de ambiente';
    property.replaceChildren(placeholder);
    const groups = [
      ['Residencial', ['Apartamento', 'Casa / Sobrado', 'Sala de estar / Jantar', 'Quarto / Suíte', 'Corredor / Hall', 'Escada interna', 'Condomínio / Área comum']],
      ['Comercial', ['Escritório / Coworking', 'Loja / Showroom', 'Clínica / Consultório', 'Restaurante / Café', 'Hotel / Pousada', 'Escola / Espaço educacional', 'Salão / Espaço de eventos']],
      ['Áreas externas', ['Deck / Área de piscina', 'Varanda / Sacada', 'Terraço / Cobertura', 'Jardim / Área de lazer']],
      ['Outras opções', ['Mais de um ambiente', 'Outro ambiente', 'Preciso de orientação sobre o ambiente']]
    ];
    groups.forEach(([title, options]) => {
      const group = document.createElement('optgroup'); group.label = title;
      options.forEach(text => { const option = document.createElement('option'); option.value = text; option.textContent = text; group.append(option); });
      property.append(group);
    });
    if (Array.from(property.options).some(option => option.value === previous)) property.value = previous;
  }
  const notes = $('#notes');
  if (notes) notes.placeholder = 'Ex.: piso com riscos na sala, deck exposto à chuva, acabamento desejado ou mais de um serviço.';
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    const floating = link.classList.contains('floating-whatsapp');
    const text = floating
      ? 'Olá, equipe LCW Pisos! Encontrei vocês pelo site e gostaria de orientação para cuidar do meu piso de madeira ou deck. Podemos conversar sobre uma avaliação e um orçamento?'
      : 'Olá, equipe LCW Pisos! Vim pelo site e gostaria de conversar sobre meu projeto. Quais informações e fotos posso enviar para vocês orientarem a avaliação?';
    link.href = 'https://wa.me/5511951149397?text=' + encodeURIComponent(text);
  });

  // Toda a área da imagem aceita gesto. O range continua acessível pelo teclado.
  const surface = $('#comparison');
  const range = $('#compare-range');
  if (!surface || !range) return;
  surface.querySelectorAll('img').forEach(image => { image.draggable = false; });
  const hint = $('#compare-hint');
  if (hint) hint.firstChild.textContent = 'Deslize o dedo para os lados ou arraste com o mouse.';
  const instruction = surface.querySelector('.compare-instruction');
  if (instruction) instruction.textContent = '← DESLIZE PARA COMPARAR →';
  let gesture = null;
  function moveTo(clientX) {
    const box = surface.getBoundingClientRect();
    if (!box.width) return;
    range.value = String(Math.round(Math.max(0, Math.min(100, (clientX - box.left) / box.width * 100))));
    range.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function begin(id, x, y, mouse) {
    if (gesture) return false;
    gesture = { id, x, y, mode: mouse ? 'horizontal' : 'pending' };
    if (mouse) { range.focus({ preventScroll: true }); moveTo(x); }
    return true;
  }
  function move(id, x, y, event) {
    if (!gesture || id !== gesture.id) return;
    if (gesture.mode === 'pending') {
      const dx = Math.abs(x - gesture.x), dy = Math.abs(y - gesture.y);
      if (Math.max(dx, dy) < 6) return;
      gesture.mode = dx > dy ? 'horizontal' : 'vertical';
      if (gesture.mode === 'horizontal') range.focus({ preventScroll: true });
    }
    if (gesture.mode !== 'horizontal') return;
    if (event.cancelable) event.preventDefault();
    moveTo(x);
  }
  function finish(id, x, cancelled) {
    if (!gesture || id !== gesture.id) return;
    const mode = gesture.mode;
    gesture = null;
    surface.classList.remove('is-dragging');
    if (!cancelled && mode !== 'vertical') moveTo(x);
  }
  surface.addEventListener('dragstart', event => event.preventDefault());
  if ('PointerEvent' in window) {
    surface.addEventListener('pointerdown', event => {
      if (event.isPrimary === false || (event.pointerType === 'mouse' && event.button !== 0)) return;
      if (!begin(event.pointerId, event.clientX, event.clientY, event.pointerType === 'mouse')) return;
      if (event.pointerType === 'mouse') event.preventDefault();
      try { surface.setPointerCapture(event.pointerId); } catch (_) { /* O gesto continua dentro da imagem. */ }
    });
    surface.addEventListener('pointermove', event => {
      move(event.pointerId, event.clientX, event.clientY, event);
      surface.classList.toggle('is-dragging', gesture?.mode === 'horizontal');
    }, { passive: false });
    function release(event, cancelled) {
      finish(event.pointerId, event.clientX, cancelled);
      try { if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId); } catch (_) { /* Captura já encerrada. */ }
    }
    surface.addEventListener('pointerup', event => release(event, false));
    surface.addEventListener('pointercancel', event => release(event, true));
    surface.addEventListener('lostpointercapture', event => finish(event.pointerId, 0, true));
  } else {
    // Compatibilidade com navegadores de toque sem Pointer Events.
    surface.addEventListener('touchstart', event => {
      if (event.touches.length !== 1) { if (gesture) finish(gesture.id, 0, true); return; }
      const touch = event.touches[0]; begin(touch.identifier, touch.clientX, touch.clientY, false);
    }, { passive: true });
    surface.addEventListener('touchmove', event => {
      if (event.touches.length !== 1) { if (gesture) finish(gesture.id, 0, true); return; }
      const touch = event.touches[0]; move(touch.identifier, touch.clientX, touch.clientY, event);
    }, { passive: false });
    surface.addEventListener('touchend', event => {
      for (const touch of Array.from(event.changedTouches)) finish(touch.identifier, touch.clientX, false);
    }, { passive: true });
    surface.addEventListener('touchcancel', () => { if (gesture) finish(gesture.id, 0, true); }, { passive: true });
    surface.addEventListener('mousedown', event => {
      if (event.button !== 0 || !begin('mouse', event.clientX, event.clientY, true)) return;
      event.preventDefault();
    });
    window.addEventListener('mousemove', event => move('mouse', event.clientX, event.clientY, event));
    window.addEventListener('mouseup', event => finish('mouse', event.clientX, false));
  }
  window.addEventListener('blur', () => { if (gesture) finish(gesture.id, 0, true); });
})();
