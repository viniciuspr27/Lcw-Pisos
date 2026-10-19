# Validação — experiência 3D

O relatório `validacao-3d.json` registra os testes da pasta organizada desta versão. Esta entrega contém somente o projeto editável e seu index.html atualizado.

Foram executados 17 grupos de testes:

1. Inicialização e análise do CSS, sem exceções.
2. Imagens originais recuperadas; interface sem rótulos de IA e com identificação ilustrativa.
3. Dimensões reduzidas da galeria, dos serviços e do comparador; parallax mais discreto.
4. Geometria de 35 réguas; progresso monotônico e instalação completa ao final.
5. Renderização Canvas real em quatro tamanhos e nove posições da animação.
6. Controle manual, etapas e descrições acessíveis sincronizados.
7. Avanço e retorno pela rolagem, com retomada após uso do controle manual.
8. Menos movimento: estado estático, controles disponíveis e rolagem ignorada.
9. Serviços, imagens, legendas, perguntas e pré-seleção do orçamento.
10. Dicas expansíveis, compatibilidade de produtos e CTA de restauração.
11. Filtros, ampliação, navegação e CTA da galeria.
12. Comparador: porcentagem, atalhos e descrições para leitores de tela.
13. Menu móvel, Escape e modal de privacidade.
14. Validação de serviço, cidade, metragem e nome.
15. Destino do WhatsApp, mensagem, cópia, fallback e tratamento seguro do texto.
16. Arquivos, metadados, links, IDs e independência do HTML entregue.
17. Alternativa sem Canvas e início com preferência por menos movimento.

Também foram conferidos a sintaxe dos três scripts, o diff e a integridade do ZIP. Os quatro WebP originais foram preservados byte a byte. Nenhuma mensagem real foi enviada no teste.

## Limite da verificação

Os testes de interação usam JSDOM. A rolagem é exercitada com geometria simulada. A maquete foi desenhada pelo mesmo renderizador da página em Canvas real e inspecionada isoladamente em imagens, inclusive em dimensão de celular.

Não houve inspeção visual do layout completo em navegador ou aparelho físico. O recurso `control-browser` não estava disponível no ambiente, e por isso não foi iniciado servidor de preview. É necessário abrir a entrega no navegador para avaliar o layout, o toque, a fluidez da animação e o comportamento real da seção fixa.

Nenhum registro de Site, deploy, commit ou push foi realizado.
