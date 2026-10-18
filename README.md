# LCW Pisos — projeto para VS Code

Landing page em HTML, CSS e JavaScript, com todos os arquivos locais e separados por função. Não precisa de Node.js, npm ou instalação de dependências.

## Começar no Windows

1. Clique com o botão direito no ZIP e escolha **Extrair tudo**.
2. Entre na pasta **lcw-pisos** extraída.
3. Abra o VS Code e selecione **Arquivo > Abrir Pasta**, escolhendo essa pasta. Você também pode abrir o arquivo **LCW-Pisos.code-workspace**.
4. Abra **index.html** na raiz do projeto.
5. Para visualizar e acompanhar as alterações, instale a extensão **Live Server**, de Ritwick Dey, sugerida pelo VS Code. Clique com o botão direito em **index.html** e escolha **Open with Live Server**.
6. O navegador abre o endereço local da extensão, normalmente http://127.0.0.1:5500. Salve as alterações com **Ctrl+S** para atualizar a página.

Também é possível dar dois cliques em index.html para abrir o site diretamente no navegador, sem instalar a extensão.

## Onde editar

| Arquivo ou pasta | Conteúdo |
|---|---|
| index.html | Textos, títulos, seções, formulário, metadados e estrutura da página |
| assets/css/styles.css | Cores, tipografia, espaçamentos, responsividade e animações |
| assets/js/main.js | Serviços, galeria, filtros, comparador e orçamento pelo WhatsApp |
| assets/images/ | Quatro imagens demonstrativas em WebP |
| assets/fonts/ | Fontes locais Manrope e Cormorant Garamond |
| assets/icons/favicon.svg | Ícone da aba do navegador |
| docs/ | Registro das imagens, licenças das fontes e validações anteriores da POC |
| .vscode/ | Configuração e sugestão da extensão Live Server |
| LCW-Pisos.code-workspace | Atalho para abrir a pasta como projeto no VS Code |

## Personalização

- Para mudar as cores, edite as variáveis dentro de **:root** no início do CSS.
- Para trocar uma imagem, substitua o arquivo correspondente em **assets/images**, mantendo o nome, ou atualize os caminhos no HTML e no JavaScript.
- O WhatsApp configurado é **(11) 95114-9397**. Caso seja necessário trocar o número, atualize a constante **whatsappNumber** no JavaScript e os links **wa.me** no HTML.
- As perguntas e os dados visuais de cada serviço estão no JavaScript, em **serviceData** e **conditionSets**.
- O formulário abre uma mensagem pronta; o visitante confirma o envio no WhatsApp.

## Estado do projeto

Esta entrega reorganiza os arquivos da POC e preserva suas interações. As referências de imagens, fontes, estilos, scripts e links internos foram verificadas após a reorganização, assim como a sintaxe do JavaScript e a integridade do ZIP.

As imagens são geradas por IA e identificadas como demonstrações. Não representam serviços executados pela LCW Pisos. O comparador antes/depois é uma simulação.

Os relatórios em **docs** registram os testes de integração da versão anterior à organização das pastas. A conferência visual em navegador real continua pendente.

**O projeto permanece sem publicação.** O Live Server serve apenas para desenvolvimento local. A POC mantém o bloqueio de indexação em seus metadados.
