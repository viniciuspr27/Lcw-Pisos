# Mudanças solicitadas

Esta entrega parte da versão original do repositório LCW Pisos, commit `77ff90a776cdb124cc61b00f3a050e95d3608b41`, e substitui a revisão que utilizava capturas do Instagram.

## Imagens e proporções

Os quatro WebP originais foram recuperados sem recompressão. Na tela grande, a galeria passou de 652px para 510px de altura; a imagem dos serviços passou de um mínimo de 640px para 515px; o comparador passou a ter largura máxima de 980px. As dimensões menores também se aplicam aos pontos de quebra de tablet e celular.

Os rótulos “gerada por IA” foram retirados da interface. A identificação “ilustrativo”, “referência” e “simulação” evita apresentar as cenas como projetos realizados pela empresa. A origem dos arquivos permanece registrada em IMAGENS.md.

## Experiência da madeira

Uma seção nova, antes da galeria, mostra a base sem revestimento, 35 réguas instaladas progressivamente e uma passagem ilustrativa de polimento. A madeira ganha um tom mais profundo e o reflexo da janela.

As etapas acompanham a rolagem nos dois sentidos. O controle nativo permite arrastar ou usar o teclado. Os botões saltam para preparação, instalação e acabamento. Não há captura de wheel/touch nem rolagem automática.

Canvas usa densidade limitada a 2 e redesenha apenas sob demanda. A renderização fora da área visível é evitada quando IntersectionObserver está disponível. Menos movimento mantém a cena estática, com controles manuais. SVG oferece uma alternativa sem Canvas ou JavaScript.

## Dicas

As dicas remetem ao perfil fornecido, @lcw_pisos, e cobrem limpeza suave, cuidado com umidade e escolha de produtos compatíveis. A orientação para avaliar restauração não promete economia ou prazo sem avaliar as condições do piso.

## Entrega

A pasta funciona diretamente no navegador e no VS Code. Os arquivos foram preparados localmente; o repositório remoto e sua visibilidade não foram alterados.
