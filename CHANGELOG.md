# Changelog

## 1.0.0

Primeira versão estável. Além dos temas e dos ícones, a extensão passa a trazer o escudo do time no fundo, os títulos e um seletor de times com escudos.

**Escudo no fundo do editor**
- O escudo do time aparece em branco, bem discreto, atrás do código. Todos têm a mesma altura (80% da janela), estrelas e coroa incluídas, e acompanham o tema ativo.
- São silhuetas vetoriais: as áreas claras ficam vazadas para os detalhes aparecerem (letras, bandeira, listras), e a imagem não perde nitidez em nenhum tamanho. Alguns escudos mostram só o essencial: monograma no Flamengo, no Fluminense e no Internacional, a estrela solitária no Botafogo, as cinco estrelas do Cruzeiro do Sul no Cruzeiro e a cruz de malta no Vasco.
- Botafogo, Vasco, Corinthians, Santos e Atlético-MG usam o tom de branco do próprio time em vez de branco puro.
- Estrelas e coroa nos escudos que as têm: três no Grêmio (em arco) e no São Paulo (em fila), a coroa e duas estrelas no Santos, uma no Palmeiras e uma no Atlético-MG.
- Usa a extensão **Background** (`shalldie.background`), que altera um arquivo do VS Code: ele pede reinício ao trocar de time e, em algumas versões, avisa que a instalação está "corrompida". Na primeira vez a extensão explica isso. O README tem a seção "Escudo no fundo do editor".
- Novas configurações: `brasileirao.crestBackground` (liga e desliga; ao desligar, devolve o que estava antes) e `brasileirao.crestOpacity` (0,01 a 0,3; padrão 0,08).

**Títulos no explorador**
- Nova seção **Títulos**, no fim do explorador: os troféus da Copa do Brasil, da Libertadores (no meio, maior) e do Brasileirão, cada um com uma bolinha na cor do time e o número de títulos ("x9").
- Passar o mouse num troféu mostra os anos de cada título. Os dados ficam no campo `titles` de `src/teams.js` (Brasileirão pelo critério da CBF; o Flamengo conta também 1987), até a temporada 2025.
- As imagens dos troféus são fotos recortadas do fundo, com créditos em `images/trofeus/CREDITS.txt`.

**Escolher o time**
- O comando **Brasileirão: Escolher time** mostra o escudo de cada time e as cores em quadradinhos, com o atual marcado.
- Novo botão **Times** na barra de status, que abre esse seletor. Os botões "Set Color Theme" e "Set File Icon Theme" da página da extensão são do VS Code e abrem o seletor padrão.

**Tema**
- O terminal e o painel inferior (problemas, saída) passam a usar a mesma cor da lateral do explorador, em vez de um tom derivado do fundo do editor.

**Projeto**
- Testes automáticos (`npm test`): conferem os dados dos 12 times, os anos dos títulos contra uma tabela feita à mão, a coerência com os arquivos gerados e o contraste dos temas.
- A prévia (`npm run preview`) mostra o escudo de fundo e a seção Títulos de cada time.
- O `package.json` ganha o campo `repository`.
- O README passa a existir em inglês (`README.md`) e em português (`README.pt.md`), com espaço para as capturas de tela e a seção de créditos e licenças.

## 0.3.6

- A lateral do explorador de arquivos deixa de ser quase preta e ganha um tom do time: vinho no Fluminense, no Internacional e no São Paulo (mais rosado), vermelho-escuro no Flamengo, verde no Palmeiras, e cinzas com um toque de cor nos clubes pretos e brancos. Cruzeiro e Grêmio já tinham a lateral azulada e não mudam. Novo campo opcional `side` em `src/teams.js`.

## 0.3.5

- Novo comando **Brasileirão: Escolher time**, que abre a lista de times com o atual já selecionado (o botão "Set Color Theme" da página da extensão abre em ordem alfabética e mostra uma prévia do primeiro item, o Atlético-MG).

## 0.3.4

- Os clubes pretos ganham identidade pela moldura (barra de atividades, de título e de status), cada um com um padrão próprio:
  - Flamengo: barra de atividades e de status vermelhas, título preto.
  - São Paulo: título vermelho, corpo preto, status branca (tricolor de cima para baixo).
  - Botafogo: atividades e status brancas, título preto.
  - Vasco: título branco, atividades e status pretas, com borda.
  - Corinthians: atividades e título brancos, status preta.
  - Santos: atividades e título pretos, status creme.
  - Atlético-MG: atividades claras, título e status pretos.
- Novos campos opcionais `activity` e `title` em `src/teams.js`; o texto sobre molduras claras passa a ser escuro.

## 0.3.3

- Cruzeiro, Fluminense, Palmeiras, Grêmio e Internacional deixam de ser quase pretos: o fundo do editor e da lateral passam a um tom escuro da cor do time, e a barra de atividades e a de título ficam numa cor mais forte do clube (azul, verde, vinho). Os clubes pretos e brancos e os rubro-negros continuam pretos. O Fluminense usa o verde como segunda cor, na borda da aba ativa.
- A checagem de contraste passou a cobrir a barra de título, a barra de atividades e as abas inativas.

## 0.3.2

- O tema de ícones passa a acompanhar o tema de cores: ao escolher `Brasileirão: <time>`, a extensão liga o tema de ícones do mesmo time (antes ficava o escudo do último tema de ícones escolhido). Configuração `brasileirao.syncIconTheme` para desligar.

## 0.3.1

- Um pacote só, igual para todos: com os escudos nas pastas, o Material Icon Theme nos ícones de arquivo e o logo do Brasileirão como ícone da extensão. Acabou a separação entre versão pessoal e pública.

## 0.3.0

- Renomeada para **Brasileirão Theme**. Os temas passam a se chamar `Brasileirão: <time>` e os ids dos temas de ícones passam a começar com `brasileirao-`.

## 0.2.1

- Ao ativar um tema da coleção, a extensão ajusta o `indentRainbow.colors` para as cores do time e devolve o valor anterior ao trocar de tema.
- Versão pessoal: o tema de ícones usa os ícones de arquivo do Material Icon Theme, com todas as pastas trocadas pelo ícone do time.

## 0.2.0

- A extensão virou a coleção **Camisa 12** (depois renomeada para Brasileirão Theme), com um tema de cores e um tema de ícones para cada um dos 12 grandes do Brasileirão.
- O tema do Flamengo parte do antigo Rubro-Negro, com comentários e números de linha mais claros para cumprir o contraste mínimo.
- Cores do time na linha ativa, no número da linha, nas guias de indentação, nos colchetes, nas réguas, na aba ativa, no cursor, na seleção e na barra de status.
- Ícones de pasta na cor do time (ou com o escudo, se o arquivo for fornecido) e ícones para 18 tipos de arquivo e as pastas `node_modules` e `.git`.
- Checagem automática de contraste (`npm run check`).

## 0.1.0

- Primeira versão (não publicada): tema escuro Rubro-Negro.
