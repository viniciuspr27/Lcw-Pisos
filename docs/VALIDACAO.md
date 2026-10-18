# Validação da POC

Foram executados testes de integração com JSDOM, utilizando os eventos reais do DOM e os controles da página. Nenhuma mensagem foi enviada ao WhatsApp; a abertura externa foi interceptada no teste.

Os 12 grupos de verificação passaram:

1. Inicialização sem exceções e conteúdo visível sem IntersectionObserver.
2. Seis serviços, painel exclusivo, imagem correspondente e navegação por teclado.
3. Filtros da galeria, ampliação, setas, teclado e seleção de serviço a partir da imagem.
4. Range do comparador, atalhos e informações para leitores de tela.
5. Menu de celular, Escape e modal de privacidade.
6. Bloqueio de serviço vazio, cidade em branco e área inválida.
7. Área desconhecida, nome obrigatório e avanço entre etapas.
8. Número de destino correto, mensagem codificada, link alternativo e tratamento seguro do texto digitado.
9. Cópia da mensagem e preservação dos campos ao voltar.
10. Mudança das perguntas conforme o serviço e metragem decimal em português.
11. Metadados, dados estruturados, IDs únicos, links internos, imagens identificadas e links externos seguros.
12. Presença dos arquivos, fontes e regras de responsividade e redução de movimento.

O resultado detalhado está em `validacao.json`. O JavaScript também passou pela verificação de sintaxe do Node.

## Limite da verificação

Não foi feita inspeção visual em um navegador real nem em aparelhos físicos. O recurso `control-browser` exigido pelo ambiente não estava disponível. As regras de layout para desktop, tablet e celular foram implementadas e verificadas estruturalmente, mas o resultado visual final precisa dessa conferência.

Não houve servidor de preview, registro de Site ou publicação. O formulário abre uma conversa com texto preparado; o envio depende do visitante no WhatsApp. Preços, prazos e atendimento devem ser confirmados pela equipe da LCW.
