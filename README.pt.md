# Brasileirão Theme

Português | [English](README.md)

[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80-007ACC?style=flat&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/lucasnicolau30.brasileirao-theme?style=flat&label=Marketplace&color=007ACC&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=lucasnicolau30.brasileirao-theme)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

Um tema escuro e um tema de ícones para cada um de 27 times do Brasileirão e das divisões de acesso. A base é a mesma em todos (fundo escuro, texto claro, sintaxe discreta). Muda a identidade do time: a cor aparece na linha ativa, no número da linha, nas guias de indentação, nos pares de colchetes, nas réguas, na aba ativa, no cursor, na seleção e na barra de status — e, atrás do código, uma versão discreta do escudo do clube.

> Projeto independente. Sem ligação com nenhum clube de futebol, com a CBF ou com o Brasileirão. Os nomes e os escudos dos clubes são marcas dos respectivos donos. Veja [Créditos e licenças](#créditos-e-licenças).

Times: Flamengo, Fluminense, Vasco, Botafogo, Palmeiras, Santos, São Paulo, Corinthians, Guarani, Bragantino, Mirassol, Cruzeiro, Atlético-MG, Grêmio, Internacional, Bahia, Vitória, Fortaleza, Ceará, Athletico-PR, Coritiba, Sport, Remo, Paysandu, Amazonas, Goiás e Chapecoense.

## O que você recebe

- **Um tema de cores por clube**, com o contraste checado em todos (texto do editor com 7:1 ou mais; comentários, números de linha, barra de status, botões e níveis de colchete com 4,5:1 ou mais).
- **Um tema de ícones por clube**: o escudo do clube no lugar do ícone de pasta. Os ícones de arquivo vêm do Material Icon Theme.
- **O escudo atrás do código**: o escudo atual do clube no fundo do editor, colorido e discreto (o Flamengo mostra só o monograma, em branco).
- **Uma seção "Títulos" no explorador**: os troféus da Copa do Brasil, da Libertadores e do Brasileirão, cada um com o número de títulos. Passe o mouse num troféu para ver os anos. Só aparecem as competições em que o clube tem título, centralizadas: Copa do Brasil, Libertadores, Brasileirão, Mundial, Sul-Americana, Copa do Nordeste (só os clubes do Nordeste) e Séries B, C e D, cada uma com foto do troféu. Os 12 grandes não mostram títulos de Série B, C nem D.
- **Escudos antigos no fundo do editor**: o botão **Escudos** na barra de status, ou o comando **"Brasileirão: Escolher escudo do fundo"** troca o fundo entre o escudo atual e os históricos do clube (62 escudos dos 27 clubes, da Wikimedia Commons e de imagens enviadas pelo autor do projeto; a fonte de cada arquivo está em `icons/retro-CREDITS.txt`). O ícone das pastas no explorador também acompanha o escudo antigo escolhido (cada escudo antigo tem o seu tema de ícones, que também aparece em "Set File Icon Theme"). Os antigos mantêm as cores originais. Cada um mostra o período em que foi usado; algumas datas são aproximadas.
- **Um seletor de times com escudos**, pela barra de status ou pela paleta de comandos.
- **O Indent Rainbow nas cores do clube**, se você usa essa extensão.
- **O Better Comments nas cores do clube**: `// !`, `// ?`, `// TODO` e `// *` ganham cada um o seu visual. O Better Comments é instalado junto com o tema.

## Instalação

Procure por **Brasileirão Theme** na aba de extensões, ou:

```bash
code --install-extension lucasnicolau30.brasileirao-theme
```

Requer o VS Code 1.80 ou mais novo. O escudo no fundo do editor precisa também da extensão **Background** (veja [Escudo no fundo do editor](#escudo-no-fundo-do-editor)); o resto funciona sem ela.

## Como escolher o time

Escolha o time de um destes jeitos:

- **Botão "Times" na barra de status** (canto inferior esquerdo) ou **`Ctrl+Shift+P` e "Brasileirão: Escolher time"**: lista os 27 times com o escudo de cada um que o tem, as cores e o atual já selecionado. Cada time diz quantas opções de escudo tem ("· 5 opções de escudo"), e escolher um time com mais de uma abre a lista com todas (atuais e retrô), cada uma com as suas datas. É o jeito recomendado.
- **`Ctrl+K Ctrl+T`**: o seletor de temas do VS Code, com os temas `Brasileirão: <time>` no meio dos outros.
- Evite os botões **Set Color Theme** e **Set File Icon Theme** da página da extensão. São do próprio VS Code (um para cada tipo de tema, e não dá para removê-los): a lista abre em ordem alfabética, sem marcar o tema atual, e já mostra uma prévia do primeiro item.

O VS Code não liga um tema de cores a um de ícones. Quem faz isso é um pouco de código da extensão: ao detectar um tema `Brasileirão: <time>`, ela grava o `workbench.iconTheme` correspondente nas configurações do usuário. Ao sair da coleção, devolve o tema de ícones que existia antes (se você escolher outro à mão, ela respeita). Para desligar, ponha `"brasileirao.syncIconTheme": false`.

## Escudo no fundo do editor

O VS Code não tem API para pôr imagem atrás do código. Por isso a extensão usa a extensão **Background** (`shalldie.background`), que altera um arquivo do próprio VS Code. Consequências, todas esperadas:

- O VS Code pede para **reiniciar** quando você escolhe um time (e na primeira vez que o escudo é aplicado). Na primeira vez, a extensão explica isso numa mensagem.
- Em algumas versões aparece o aviso de que a instalação está **"corrompida"**. A Background tenta escondê-lo, mas ele pode aparecer. Não há nada quebrado.
- Uma **atualização do VS Code** apaga a alteração; a extensão reaplica na próxima abertura.
- Para **não usar o escudo de fundo**, desligue `brasileirao.crestBackground`. Isso devolve o que estava antes. Os temas, os ícones e a seção "Títulos" continuam funcionando sem a Background.

Todos os escudos têm a mesma altura total (80% da janela), estrelas e coroa incluídas. Os escudos atuais aparecem em cores, com 1,5 vez a opacidade definida em `brasileirao.crestOpacity`; o Flamengo mostra só o monograma, em branco.

## Títulos

A seção **Títulos**, no fim do explorador, mostra só as competições em que o clube tem título, centralizadas: Copa do Brasil, Libertadores (maior), Brasileirão, Mundial, Sul-Americana, Copa do Nordeste (só os clubes do Nordeste) e Séries B, C e D, cada uma com foto do troféu; os 12 grandes não mostram títulos de Série B, C nem D. Um clube que só tem uma Série C mostra apenas a Série C. Com 4 ou 5 competições, tudo cabe numa linha só (itens e texto encolhem para a largura da barra). O Mundial é o ápice: fica ao lado da Libertadores e no centro quando há 5. Todos os troféus têm a mesma altura. Cada um tem uma bolinha na cor do clube com o número de títulos ("x9"). Passar o mouse num troféu mostra os anos.

Os dados ficam no campo `titles` de `src/teams.js`, até a temporada 2025 (Copa do Nordeste até 2026). O Brasileirão segue o critério unificado da CBF (1959 em diante, mais o de 1937 do Atlético-MG); o Flamengo conta também 1987. Os testes conferem os anos contra uma tabela feita à mão.

## Paletas

| Time | Cor principal | Destaque no texto | Barra de status |
|---|---|---|---|
| Flamengo | `#c52613` | `#ff5a45` | `#c52613` |
| Fluminense | `#8f1d3d` | `#ec7898` | `#8f1d3d` |
| Vasco | `#e0e0e0` | `#f0f0f0` | `#000000` |
| Botafogo | `#eef3f9` | `#ffffff` | `#eef3f9` |
| Palmeiras | `#0b7a43` | `#3ccf8a` | `#006437` |
| Santos | `#f3ead8` | `#f6eedc` | `#e8dfcc` |
| São Paulo | `#d3112d` | `#ff5c6c` | `#f4f4f4` |
| Corinthians | `#bdbdbd` | `#ffffff` | `#000000` |
| Guarani | `#18a35a` | `#4fe08f` | `#0b6b3b` |
| Bragantino | `#d81f3c` | `#ff5a6e` | `#b8142b` |
| Mirassol | `#f2d21a` | `#ffe45c` | `#0b6b27` |
| Cruzeiro | `#1d4fc4` | `#7aa2ff` | `#0f3fa8` |
| Atlético-MG | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Grêmio | `#0b76b0` | `#4db8f5` | `#0a6aa3` |
| Internacional | `#d4161c` | `#ff5d5d` | `#b8121a` |
| Bahia | `#1f5fd1` | `#6ea4ff` | `#0d3f9a` |
| Vitória | `#c8102e` | `#ff4d63` | `#c8102e` |
| Fortaleza | `#2a52c9` | `#7c9bff` | `#12308f` |
| Ceará | `#d8d8d8` | `#f4f4f4` | `#000000` |
| Athletico-PR | `#d4161c` | `#ff5a60` | `#b8121a` |
| Coritiba | `#0f9a4f` | `#3fd98a` | `#0a7a3f` |
| Sport | `#d4141c` | `#ff5959` | `#b50f16` |
| Remo | `#2a56c6` | `#7a9dff` | `#0d2a73` |
| Paysandu | `#1b8fd6` | `#8fd6ff` | `#0a6aa8` |
| Amazonas | `#f2c200` | `#ffd84d` | `#f2c200` |
| Goiás | `#0aa876` | `#3fe0b0` | `#0a7a5c` |
| Chapecoense | `#17a344` | `#4fe08a` | `#0b7a32` |

A cor oficial do clube nem sempre serve como texto sobre fundo escuro (os azuis, por exemplo, ficam apagados). Por isso cada time tem a cor principal, usada em áreas preenchidas, e uma versão mais clara para texto.

Seis clubes são preto e branco (Botafogo, Vasco, Corinthians, Santos, Atlético-MG e Ceará). Eles se diferenciam por detalhes sutis: o tom do fundo e do branco (frio ou quente), a barra de status clara ou escura e a borda. Nesses temas os seis níveis de colchete alternam três tons, em vez de seis cores.

O terminal e o painel inferior usam a mesma cor da lateral do explorador.

## Indent Rainbow

Se você usa o **Indent Rainbow** (`oderwat.indent-rainbow`), ele pinta a indentação com amarelo, verde, rosa e azul, o que briga com as cores do time. Um tema não consegue mudar a configuração de outra extensão, então a Brasileirão Theme faz isso com um pouco de código: ao ativar um tema `Brasileirão: <time>`, ela troca `indentRainbow.colors` (nas configurações do usuário) por quatro cores do time, a 8% de opacidade. Ao escolher um tema que não é da coleção, devolve o valor que estava antes. Sem o Indent Rainbow instalado, nada acontece.

## Better Comments

Um tema não consegue colorir `// !` ou `// TODO`: quem faz isso é a extensão **Better Comments** (`aaron-bond.better-comments`), por isso ela é instalada junto com esta. Ao ativar um tema `Brasileirão: <time>`, a extensão grava `better-comments.tags` (nas configurações do usuário) com as cores do time:

| Tag | Visual |
| --- | --- |
| `// !` | a cor de destaque do time, em negrito, sobre um fundo leve |
| `// ?` | um tom suave do time, em itálico |
| `// TODO` | o segundo tom do time, em negrito e sublinhado |
| `// *` | o tom principal do time |
| `// //` | cinza riscado (código comentado) |

O Better Comments só lê as tags ao iniciar, então, ao trocar de time, o VS Code oferece recarregar a janela. Ao escolher um tema que não é da coleção, devolve o valor que estava antes.

## Ícones de arquivo

Se o Material Icon Theme estiver instalado na máquina que gera o pacote, o tema de ícones do time usa os ícones de arquivo dele (centenas de tipos) e troca **todas** as pastas pelo escudo do time. O Material é MIT, e a licença vai junto em `icons/_material/LICENSE.txt`. Sem o Material, o build usa 18 ícones próprios (JavaScript, TypeScript, JSX, TSX, JSON, `package.json`, HTML, CSS, Markdown, Python, Java, C#, SQL, YAML, shell, imagens, texto, arquivos de configuração e as pastas `node_modules` e `.git`).

## Configurações

| Configuração | Padrão | O que faz |
| --- | --- | --- |
| `brasileirao.syncIconTheme` | `true` | Ao escolher um tema `Brasileirão: <time>`, troca também para o tema de ícones do mesmo time. |
| `brasileirao.crestBackground` | `true` | Mostra o escudo no fundo do editor. Precisa da extensão Background. Ao desligar, devolve a configuração anterior. |
| `brasileirao.crestOpacity` | `0.08` | Opacidade do escudo de fundo (0,01 a 0,3). |

## Desenvolvimento

```bash
npm run build      # gera temas, ícones e o bloco contributes do package.json
npm run check      # confere os contrastes mínimos nos 27 temas
npm test           # testes dos dados, dos arquivos gerados e do contraste (node --test)
npm run package    # build + check + brasileirao-theme.vsix
npm run instalar   # package + instala no VS Code (depois, recarregue a janela)
npm run preview    # gera preview/index.html com os 27 times lado a lado
```

A tabela de times é `src/teams.js`. Para mudar uma cor, o rótulo ou os títulos de um time, edite lá e rode `npm run build`. Os arquivos em `themes/` e `icons/` são gerados e não devem ser editados à mão.

Para testar sem instalar, abra esta pasta no VS Code e aperte `F5`.

### Imagens dos escudos

Os escudos são marca registrada dos clubes. As fontes ficam em `assets/escudos/` (e em `assets/escudos/fundo/`, as silhuetas do fundo do editor) e estão no `.gitignore`, então não sobem para o repositório. O `npm run build` usa as que existirem; sem o arquivo, a pasta usa a cor do time.

## Créditos e licenças

O código deste projeto está sob a [Licença MIT](LICENSE). Material de terceiros e como é usado:

### Software

| O quê | Autor | Licença | Como é usado |
| --- | --- | --- | --- |
| [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme) | Philipp Kief | MIT | Ícones de arquivo, embutidos em `icons/_material/` com a licença. |
| [Background](https://github.com/shalldie/vscode-background) | shalldie | MIT | Não vem junto. Necessária só para o escudo no fundo do editor. |
| [Better Comments](https://github.com/aaron-bond/better-comments) | Aaron Bond | MIT | Não vem junto. É instalado como dependência; só a configuração de tags dele é alterada. |
| [Indent Rainbow](https://github.com/oderwat/vscode-indent-rainbow) | oderwat | MIT | Não vem junto. Só a configuração de cores dele é alterada, se estiver instalado. |

### Fotos dos troféus

Recortadas do fundo e redimensionadas, via Wikimedia Commons.

| Troféu | Obra | Autor | Licença |
| --- | --- | --- | --- |
| Brasileirão | [Troféu Campeonato Brasileiro 2024.jpg](https://commons.wikimedia.org/wiki/File:Trof%C3%A9u_Campeonato_Brasileiro_2024.jpg) | Phill ad | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) |
| Libertadores | [328-3287452 copa-libertadores-primer-trofeo-hd-png-download.png](https://commons.wikimedia.org/wiki/File:328-3287452_copa-libertadores-primer-trofeo-hd-png-download.png) | Mathiaseditorxd | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Copa do Brasil | Imagem fornecida pelo autor do projeto (render do troféu) | Não informado | Não informada |

A imagem adaptada da Libertadores (`images/trofeus/libertadores.png`) é distribuída sob a mesma licença da original, CC BY-SA 4.0. O resto do projeto continua sob MIT.

### Escudos e marcas

| O quê | Fonte |
| --- | --- |
| Escudo do Atlético-MG | [Clube Atlético Mineiro logo.svg](https://commons.wikimedia.org/wiki/File:Clube_Atl%C3%A9tico_Mineiro_logo.svg), Wikimedia Commons (domínio público quanto ao direito autoral) |
| Escudo do Santos | [Santos Futebol Clube logo (with stars but without the crown).svg](https://commons.wikimedia.org/wiki/File:Santos_Futebol_Clube_logo_(with_stars_but_without_the_crown).svg) e [(with stars and crown).png](https://commons.wikimedia.org/wiki/File:Santos_Futebol_Clube_logo_(with_stars_and_crown).png), Wikimedia Commons (domínio público quanto ao direito autoral) |
| Escudos dos demais clubes | Imagem principal do artigo de cada clube na Wikipédia, ou imagens enviadas pelo autor do projeto (escudos antigos: veja `icons/retro-CREDITS.txt`). Marcas dos respectivos clubes |
| Nomes dos clubes | Marcas dos respectivos clubes |
| Ícone da extensão | O logo do Brasileirão Série A, marca da CBF |

Estar em domínio público na Wikimedia Commons diz respeito só ao direito autoral; os escudos continuam sendo marcas dos clubes.

### Dados

As contagens e os anos dos títulos vêm dos artigos da Wikipédia (em português e em inglês) sobre o Campeonato Brasileiro (Séries A a D), a Copa do Brasil, a Copa Libertadores, a Copa Sul-Americana, o Mundial de Clubes, a Copa do Nordeste e cada clube (texto sob CC BY-SA 4.0; os fatos em si não têm direito autoral).

## Aviso

Extensão independente, sem ligação com nenhum clube de futebol, com a CBF ou com o Brasileirão. Os nomes dos clubes, os escudos e o logo do campeonato são marcas dos respectivos donos e aparecem aqui só para identificar cada tema. Se um titular pedir a retirada, o pacote sai do ar.

## Licença

MIT
