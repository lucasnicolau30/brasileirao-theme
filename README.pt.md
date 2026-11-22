# Brasileirão Theme

Leia em: Português | [English](README.md)

[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80-007ACC?style=flat&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/lucasnicolau30.brasileirao-theme?style=flat&label=Marketplace&color=007ACC&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=lucasnicolau30.brasileirao-theme)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

Um tema escuro e um tema de ícones para cada um de 125 times do Brasileirão e das divisões de acesso. A base é a mesma em todos (fundo escuro, texto claro, sintaxe discreta). Muda a identidade do time: a cor aparece na linha ativa, no número da linha, nas guias de indentação, nos pares de colchetes, nas réguas, na aba ativa, no cursor, na seleção e na barra de status — e, atrás do código, uma versão discreta do escudo do clube.

> Projeto independente. Sem ligação com nenhum clube de futebol, com a CBF ou com o Brasileirão. Os nomes e os escudos dos clubes são marcas dos respectivos donos. Veja [Créditos e licenças](#créditos-e-licenças).

> **Última verificação dos dados:** 19 de novembro de 2026 (títulos, escudos e datas). Achou algo errado ou desatualizado? Veja [como contribuir](#contribuir).

Times: Rio Branco-AC, Juventus-AC, Independência, Atlético-AC, CSA, CRB, ASA, Macapá, Trem, Ypiranga-AP, Santos-AP, Amazonas FC, Nacional-AM, Rio Negro-AM, São Raimundo-AM, Manaus FC, Bahia, Vitória, Ypiranga-BA, Fortaleza, Ceará, Ferroviário-CE, Guarany de Sobral, Brasiliense, Gama, Brasília, Rio Branco-ES, Desportiva Ferroviária, Vitória-ES, Serra, Goiás, Atlético-GO, Vila Nova, Aparecidense, Sampaio Corrêa, Moto Club, Maranhão AC, Cuiabá, Luverdense, Mixto, Operário-MS, Comercial-MS, Cruzeiro, Atlético-MG, América-MG, Uberlândia, Villa Nova-MG, Boa Esporte-MG, Tupi, Tombense, Paysandu, Remo, Tuna Luso, São Raimundo-PA, Campinense, Botafogo-PB, Treze, Athletico-PR, Coritiba, Paraná, Londrina, Operário-PR, Maringá, Sport, Santa Cruz, Náutico, Retrô, Flamengo-PI, Parnahyba, Piauí, Altos, Flamengo, Fluminense, Vasco, Botafogo, Campo Grande, Volta Redonda, Olaria, Macaé, América-RJ, Bangu, América-RN, ABC, Grêmio, Internacional, Juventude, Ji-Paraná, Vilhena, Porto Velho, Baré, São Raimundo-RR, GAS, Criciúma, Chapecoense, Joinville, Avaí, Brusque, Barra-SC, Figueirense, São Paulo, Santos, Corinthians, Palmeiras, Guarani, Paulista, Santo André, Bragantino, União São João, Portuguesa, Juventus-SP, Inter de Limeira, Novorizontino, Ituano, Mirassol, XV de Piracicaba, União Barbarense, Osasco Sporting, Ponte Preta, Botafogo-SP, Sergipe, Confiança, Itabaiana, Palmas, Tocantinópolis, Gurupi

## O que você recebe

- **Um tema de cores por clube**, com o contraste checado em todos (texto do editor com 7:1 ou mais; comentários, números de linha, barra de status, botões e níveis de colchete com 4,5:1 ou mais).
- **Um tema de ícones por clube**: o escudo do clube no lugar do ícone de pasta. Os ícones de arquivo vêm do Material Icon Theme.
- **O escudo atrás do código**: o escudo atual do clube no fundo do editor, colorido e discreto (o Flamengo mostra só o monograma, em branco).
- **Uma seção "Títulos" no explorador**: os troféus da Copa do Brasil, da Libertadores e do Brasileirão, cada um com o número de títulos. Passe o mouse num troféu para ver os anos. Só aparecem as competições em que o clube tem título, centralizadas: Copa do Brasil, Libertadores, Brasileirão, Mundial, Sul-Americana, Copa do Nordeste (só os clubes do Nordeste), Copa Verde (só os do Norte e do Centro-Oeste), Séries B, C e D e o estadual (com a taça de cada um dos 27 estados), cada uma com foto do troféu. Os 12 grandes mostram todos os troféus, menos os das Séries B, C e D.
- **Escudos antigos no fundo do editor**: o botão **Escudos** na barra de status, ou o comando **"Brasileirão: Escolher escudo do fundo"** troca o fundo entre o escudo atual e os históricos do clube (947 escudos de 121 dos 125 clubes, da Wikimedia Commons e de imagens enviadas pelo autor do projeto; a fonte de cada arquivo está em `icons/retro-CREDITS.txt`). O ícone das pastas no explorador também acompanha o escudo antigo escolhido (cada escudo antigo tem o seu tema de ícones, que também aparece em "Set File Icon Theme"). Os antigos mantêm as cores originais. Cada um mostra o período em que foi usado; algumas datas são aproximadas.
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

- **Botão "Times" na barra de status** (canto inferior esquerdo) ou **`Ctrl+Shift+P` e "Brasileirão: Escolher time"**: lista os 125 times com o escudo de cada um que o tem, as cores e o atual já selecionado. Cada time diz quantas opções de escudo tem ("· 5 opções de escudo"), e escolher um time com mais de uma abre a lista com todas (atuais e retrô), cada uma com as suas datas. É o jeito recomendado.
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

A seção **Títulos**, no fim do explorador, mostra só as competições em que o clube tem título, centralizadas: Copa do Brasil, Libertadores (maior), Brasileirão, Mundial, Sul-Americana, Copa do Nordeste (só os clubes do Nordeste), Copa Verde (só os do Norte e do Centro-Oeste), Séries B, C e D e o estadual (com a taça de cada um dos 27 estados), cada uma com foto do troféu; os 12 grandes mostram todos os troféus, menos os das Séries B, C e D. Um clube que só tem uma Série C mostra apenas a Série C. Com 4 ou 5 competições, tudo cabe numa linha só (itens e texto encolhem para a largura da barra). O Mundial é o ápice: fica ao lado da Libertadores e no centro quando há 5. Todos os troféus têm a mesma altura. Cada um tem uma bolinha na cor do clube com o número de títulos ("x9"). Passar o mouse num troféu mostra os anos.

Os dados ficam no campo `titles` de `src/teams.js`, até a temporada 2025 (Brasileirão, Copa do Nordeste e Copa Verde até 2026). O Brasileirão segue o critério unificado da CBF (1959 em diante, mais o de 1937 do Atlético-MG); o Flamengo conta também 1987. Os testes conferem os anos contra uma tabela feita à mão.

## Paletas

| Time | Cor principal | Destaque no texto | Barra de status |
|---|---|---|---|
| Rio Branco-AC | `#d6232a` | `#e67b7f` | `#d6232a` |
| Juventus-AC | `#d3202c` | `#e7848b` | `#d3202c` |
| Independência | `#238e51` | `#65b085` | `#238e51` |
| Atlético-AC | `#2a3fb8` | `#949fdc` | `#2a3fb8` |
| CSA | `#2f6fdc` | `#7fa9ff` | `#0f3a99` |
| CRB | `#d12a32` | `#ff737a` | `#b8141d` |
| ASA | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Macapá | `#2a7fd4` | `#6aa5e1` | `#2a7fd4` |
| Trem | `#d3202c` | `#e7848b` | `#d3202c` |
| Ypiranga-AP | `#2a4a8c` | `#8a9bc0` | `#2a4a8c` |
| Santos-AP | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Amazonas FC | `#f2c200` | `#ffd84d` | `#f2c200` |
| Nacional-AM | `#2a66e0` | `#7fb0ff` | `#0a3cb4` |
| Rio Negro-AM | `#d4d4d4` | `#f4f4f4` | `#000000` |
| São Raimundo-AM | `#4a7be8` | `#86a6ff` | `#1f45ac` |
| Manaus FC | `#3aa84a` | `#6fdc86` | `#0b6b2e` |
| Bahia | `#1f5fd1` | `#6ea4ff` | `#0d3f9a` |
| Vitória | `#c8102e` | `#ff4d63` | `#c8102e` |
| Ypiranga-BA | `#f0a018` | `#f4c46a` | `#f0a018` |
| Fortaleza | `#2a52c9` | `#7c9bff` | `#12308f` |
| Ceará | `#d8d8d8` | `#f4f4f4` | `#000000` |
| Ferroviário-CE | `#e0161f` | `#ff6a6f` | `#b8101a` |
| Guarany de Sobral | `#e6122f` | `#ff6a7e` | `#b30f26` |
| Brasiliense | `#d9b400` | `#ffe14d` | `#0b7a3a` |
| Gama | `#1a8f5f` | `#5be3a7` | `#0f6b45` |
| Brasília | `#db2426` | `#ff6a6e` | `#b2121a` |
| Rio Branco-ES | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Desportiva Ferroviária | `#8a2a45` | `#c494a2` | `#8a2a45` |
| Vitória-ES | `#2a4ab8` | `#8a9bd8` | `#2a4ab8` |
| Serra | `#d3202c` | `#e7848b` | `#d3202c` |
| Goiás | `#0aa876` | `#3fe0b0` | `#0a7a5c` |
| Atlético-GO | `#c82018` | `#ff5a52` | `#000000` |
| Vila Nova | `#e01820` | `#ff6a6a` | `#b8151a` |
| Aparecidense | `#dabf50` | `#f0dc8a` | `#16335f` |
| Sampaio Corrêa | `#e6b800` | `#ffd84d` | `#0b6a30` |
| Moto Club | `#d81818` | `#ff5a5a` | `#b01212` |
| Maranhão AC | `#1f6fc0` | `#6fb0ff` | `#0f4c8f` |
| Cuiabá | `#e0b800` | `#ffd84d` | `#0a6b34` |
| Luverdense | `#3a9b46` | `#9ad12b` | `#1f6b2a` |
| Mixto | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Operário-MS | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Comercial-MS | `#d81f28` | `#ff6a70` | `#b3121b` |
| Cruzeiro | `#1d4fc4` | `#7aa2ff` | `#0f3fa8` |
| Atlético-MG | `#d0d0d0` | `#f5f5f5` | `#000000` |
| América-MG | `#12935a` | `#4cdc98` | `#0a6b3f` |
| Uberlândia | `#12a05a` | `#5be3a0` | `#0b7a3f` |
| Villa Nova-MG | `#e0201f` | `#ff6a66` | `#b30f14` |
| Boa Esporte-MG | `#1fa557` | `#6ee3a0` | `#0d7a3e` |
| Tupi | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Tombense | `#e81828` | `#ff6a73` | `#b9141f` |
| Paysandu | `#1b8fd6` | `#8fd6ff` | `#0a6aa8` |
| Remo | `#2a56c6` | `#7a9dff` | `#0d2a73` |
| Tuna Luso | `#1fa557` | `#6ee3a0` | `#0d7a3e` |
| São Raimundo-PA | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Campinense | `#e8141c` | `#ff5d63` | `#000000` |
| Botafogo-PB | `#d83040` | `#ff6a78` | `#000000` |
| Treze | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Athletico-PR | `#d4161c` | `#ff5a60` | `#b8121a` |
| Coritiba | `#0f9a4f` | `#3fd98a` | `#0a7a3f` |
| Paraná | `#1b5fc0` | `#6aa8ff` | `#0b4aa0` |
| Londrina | `#1ea7e6` | `#7fd0f5` | `#0e7db3` |
| Operário-PR | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Maringá | `#00a859` | `#5be3a0` | `#007a40` |
| Sport | `#d4141c` | `#ff5959` | `#b50f16` |
| Santa Cruz | `#c81414` | `#ff6060` | `#a80f0f` |
| Náutico | `#d6232d` | `#ff5f68` | `#b81a22` |
| Retrô | `#eda72f` | `#ffc65a` | `#0f2e7e` |
| Flamengo-PI | `#d3202c` | `#e7848b` | `#d3202c` |
| Parnahyba | `#2a4a8a` | `#8a9bbf` | `#2a4a8a` |
| Piauí | `#2a4ab0` | `#8a9bd4` | `#2a4ab0` |
| Altos | `#1f9d3a` | `#62ba75` | `#1f9d3a` |
| Flamengo | `#c52613` | `#ff5a45` | `#c52613` |
| Fluminense | `#8f1d3d` | `#ec7898` | `#8f1d3d` |
| Vasco | `#e0e0e0` | `#f0f0f0` | `#000000` |
| Botafogo | `#eef3f9` | `#ffffff` | `#eef3f9` |
| Campo Grande | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Volta Redonda | `#ffcd00` | `#ffd84d` | `#ffcd00` |
| Olaria | `#2f66d6` | `#7fa3ff` | `#0f3590` |
| Macaé | `#4a52c8` | `#9aa0ff` | `#2f3592` |
| América-RJ | `#c8252c` | `#ff6a70` | `#b4141b` |
| Bangu | `#e2001a` | `#ff5f6d` | `#b8101c` |
| América-RN | `#e41920` | `#ff6b6f` | `#b9141a` |
| ABC | `#d4d4d4` | `#f4f4f4` | `#000000` |
| Grêmio | `#0b76b0` | `#4db8f5` | `#0a6aa3` |
| Internacional | `#d4161c` | `#ff5d5d` | `#b8121a` |
| Juventude | `#0b9a3c` | `#3ddc78` | `#08812f` |
| Ji-Paraná | `#2a8fd8` | `#6ab1e4` | `#2a8fd8` |
| Vilhena | `#2a5ab8` | `#7f9cd4` | `#2a5ab8` |
| Porto Velho | `#2a5ab8` | `#7f9cd4` | `#2a5ab8` |
| Baré | `#d3202c` | `#e7848b` | `#d3202c` |
| São Raimundo-RR | `#2a5ad0` | `#7f9ce3` | `#2a5ad0` |
| GAS | `#d52b1e` | `#e68078` | `#d52b1e` |
| Criciúma | `#f2c200` | `#ffd84d` | `#f2c200` |
| Chapecoense | `#17a344` | `#4fe08a` | `#0b7a32` |
| Joinville | `#d9131f` | `#ff6a6f` | `#b30f1a` |
| Avaí | `#1a7db5` | `#7ccaf0` | `#0a6a9c` |
| Brusque | `#f2cb14` | `#ffdd55` | `#f2cb14` |
| Barra-SC | `#2f7fe0` | `#7fb3ff` | `#0c4ca3` |
| Figueirense | `#d4d4d4` | `#f4f4f4` | `#000000` |
| São Paulo | `#d3112d` | `#ff5c6c` | `#f4f4f4` |
| Santos | `#f3ead8` | `#f6eedc` | `#e8dfcc` |
| Corinthians | `#bdbdbd` | `#ffffff` | `#000000` |
| Palmeiras | `#0b7a43` | `#3ccf8a` | `#006437` |
| Guarani | `#18a35a` | `#4fe08f` | `#0b6b3b` |
| Paulista | `#e0252b` | `#ff6a6e` | `#000000` |
| Santo André | `#3a3fb8` | `#8a92ff` | `#2b2f96` |
| Bragantino | `#d81f3c` | `#ff5a6e` | `#b8142b` |
| União São João | `#e02424` | `#ff6b6b` | `#a81818` |
| Portuguesa | `#16924a` | `#46d68a` | `#0e773e` |
| Juventus-SP | `#b32468` | `#e87fb0` | `#7d0f47` |
| Inter de Limeira | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Novorizontino | `#fbe51f` | `#ffee66` | `#fbe51f` |
| Ituano | `#e2041b` | `#ff5a6a` | `#000000` |
| Mirassol | `#f2d21a` | `#ffe45c` | `#0b6b27` |
| XV de Piracicaba | `#d0d0d0` | `#f5f5f5` | `#000000` |
| União Barbarense | `#d0d0d0` | `#f5f5f5` | `#000000` |
| Osasco Sporting | `#0aa0f2` | `#5cc3f8` | `#0a7bbf` |
| Ponte Preta | `#cfcfd6` | `#f2f2f6` | `#000000` |
| Botafogo-SP | `#d42424` | `#ff7b7b` | `#a81a1a` |
| Sergipe | `#d3202c` | `#e7848b` | `#d3202c` |
| Confiança | `#2a5ad0` | `#7f9ce3` | `#2a5ad0` |
| Itabaiana | `#2a5ad0` | `#7f9ce3` | `#2a5ad0` |
| Palmas | `#f2c230` | `#f6d46e` | `#f2c230` |
| Tocantinópolis | `#1f9d4a` | `#62ba80` | `#1f9d4a` |
| Gurupi | `#1f9d3a` | `#62ba75` | `#1f9d3a` |

A cor oficial do clube nem sempre serve como texto sobre fundo escuro (os azuis, por exemplo, ficam apagados). Por isso cada time tem a cor principal, usada em áreas preenchidas, e uma versão mais clara para texto.

Sete temas são preto e branco (Botafogo, Vasco, Corinthians, Santos, Atlético-MG, Ceará e Ponte Preta). Eles se diferenciam por detalhes sutis: o tom do fundo e do branco (frio ou quente), a barra de status clara ou escura e a borda. Nesses temas os seis níveis de colchete alternam três tons, em vez de seis cores.

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
npm run check      # confere os contrastes mínimos nos 125 temas
npm test           # testes dos dados, dos arquivos gerados e do contraste (node --test)
npm run package    # build + check + brasileirao-theme.vsix
npm run instalar   # package + instala no VS Code (depois, recarregue a janela)
npm run preview    # gera preview/index.html com os 125 times lado a lado
```

A tabela de times é `src/teams.js`. Para mudar uma cor, o rótulo ou os títulos de um time, edite lá e rode `npm run build`. Os arquivos em `themes/` e `icons/` são gerados e não devem ser editados à mão.

Para testar sem instalar, abra esta pasta no VS Code e aperte `F5`.

### Imagens dos escudos

Os escudos são marca registrada dos clubes. As fontes ficam em `assets/escudos/` (e em `assets/escudos/fundo/`, as silhuetas do fundo do editor) e estão no `.gitignore`, então não sobem para o repositório. O `npm run build` usa as que existirem; sem o arquivo, a pasta usa a cor do time.

## Regras e exceções

### Regras

- **Títulos:** só aparecem as competições em que o clube tem título. Os 12 grandes (Flamengo, Fluminense, Vasco, Botafogo, Palmeiras, Santos, São Paulo, Corinthians, Cruzeiro, Atlético-MG, Grêmio e Internacional) mostram todos os troféus, menos os das Séries B, C e D; os demais clubes mostram também as Séries B, C e D.
- **Estadual:** é o campeonato estadual principal do estado do clube (UF), com a taça do estado. Os 27 estados têm a foto.
- **Anos:** vão até a temporada 2025 (Brasileirão, Copa do Nordeste, Copa Verde e estaduais até 2026). O Brasileirão segue o critério unificado da CBF (1959 em diante, mais o Atlético-MG em 1937); o Flamengo conta também 1987.
- **Ordem dos times:** nos READMEs, os estados vão em ordem alfabética e, dentro de cada um, os times seguem a ordem de exibição do seletor. Essa ordem vale a quantidade de títulos: Mundial, Libertadores e Brasileirão primeiro; no empate, Copa do Brasil, Sul-Americana, Copa do Nordeste, Séries B, C e D, Copa Verde e, por último, o Estadual. Com tudo igual, vem antes quem ganhou antes o título mais importante.
- **Escudo atual:** um só por clube, com "desde AAAA" no nome só quando a fonte é clara.
- **Escudos antigos:** em ordem cronológica, com o **período** de uso no rótulo (nunca um ano solto); sem escudos quase idênticos entre si ou ao atual; sempre em vetor liso e nítido.
- **Fundo do editor:** todos os escudos têm a mesma altura (80% da janela). Cores escuras sobem de tom para aparecer sobre o fundo escuro; as cores originais não mudam quando o escudo já se vê.
- **Datas:** vêm da Logopedia e, nos clubes que não estão nela, de pesquisas independentes. Data inventada não entra: sem fonte concreta, o período é aproximado e isso fica dito num comentário em `src/teams.js`.
- **Escopo dos clubes:** clubes ativos que disputam ou disputaram as Séries A a D, pelo menos um por estado e alguns escolhidos pelo autor. Clubes extintos e todos os campeonatos estaduais ficam de fora.

### Exceções

Cada exceção tem um comentário padronizado em `src/teams.js`, acima do nome do escudo atual do clube, com os períodos exatos.

- **Datas aproximadas, sem fonte concreta:** Juventus-AC, Macapá, Gurupi e Ji-Paraná (todos os retrôs); Campinense, Campo Grande, Olaria e Macaé (alguns).
- **Datas que se sobrepõem** (o clube usou mais de um escudo no período, ou houve fusão): Tuna Luso, Vasco, Botafogo, Internacional, Juventude, São Paulo, Corinthians, Palmeiras, Santos, Bragantino e Portuguesa.
- **Período vazio** (a fonte não tem escudo para o intervalo): Boa Esporte-MG, Campo Grande, Corinthians, Mirassol e União Barbarense.
- **Borda clara por fora** (escudo escuro que sumiria no fundo do editor), em escudos antigos: Flamengo, São Paulo, Corinthians, Santos, Grêmio, Criciúma, Botafogo-PB, Treze, Santa Cruz, Parnahyba, Piauí, Volta Redonda, Olaria, Macaé, América-RJ, Botafogo-SP, Ponte Preta, Osasco Sporting, União Barbarense, Inter de Limeira, Ituano, União São João, Bragantino, Juventus-SP, Santo André e Paulista. No escudo atual: Uberlândia, Athletico-PR, Volta Redonda, Ponte Preta, União São João, Juventus-SP e Santo André.
- **Escudo atual com ressalva:** Atlético-AC e Palmas.
- **Sem escudos antigos:** Ypiranga-AP, Manaus FC, Altos e Novorizontino.
- **Usados só pelos goleiros:** Santos (1913–1915, 1916–1925/1942–1944 e 1918).
- **Símbolo em branco em vez de preto** (o preto não seria visível no fundo do editor): Santa Cruz, no escudo de 1914–1947.
- **Outras:** o Vasco tem dois escudos atuais (o completo e a cruz); o Flamengo mostra só o monograma no fundo; no Paraná os dois retrôs são os escudos dos clubes que se fundiram em 1989, e o título da Série B de 2000 (Copa João Havelange) entra por decisão do autor.

## Contribuir

Tudo sai de uma tabela de dados, então corrigir ou acrescentar um dado é rápido. Use os modelos de issue:

- **[Sugerir um time novo](https://github.com/lucasnicolau30/brasileirao-theme/issues/new?template=sugestao-time.yml)**: diga o clube, o estado e a divisão, com o escudo atual e, se tiver, os antigos (com as datas e a fonte).
- **[Informação errada ou desatualizada](https://github.com/lucasnicolau30/brasileirao-theme/issues/new?template=informacao-incorreta.yml)**: uma data de escudo, um título (ano ou quantidade), um escudo ou uma foto de troféu errados, ou um escudo atual ou antigo que falta. Conte o que está errado, o que é o certo e a fonte.
- **[Bug](https://github.com/lucasnicolau30/brasileirao-theme/issues/new?template=bug.yml)**: algo que não funciona na extensão.

Antes de pedir um time novo, veja as [regras e exceções](#regras-e-exceções) acima. A data da última verificação dos dados fica no topo deste README e é atualizada quando as correções entram.

## Créditos e licenças

O código deste projeto está sob a [Licença MIT](LICENSE). Material de terceiros e como é usado:

### Software

| O quê | Autor | Licença | Como é usado |
| --- | --- | --- | --- |
| [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme) | Philipp Kief | MIT | Ícones de arquivo, embutidos em `icons/_material/` com a licença. |
| [Background](https://github.com/shalldie/vscode-background) | shalldie | MIT | Não vem junto. Necessária só para o escudo no fundo do editor. |
| [Better Comments](https://github.com/aaron-bond/better-comments) | Aaron Bond | MIT | Não vem junto. É instalado como dependência; só a configuração de tags dele é alterada. |
| [Indent Rainbow](https://github.com/oderwat/vscode-indent-rainbow) | oderwat | MIT | Não vem junto. Só a configuração de cores dele é alterada, se estiver instalado. |

### Imagens

Autoria, licença e fonte de cada foto de troféu estão em `images/trofeus/CREDITS.txt`, e as dos escudos antigos em `icons/retro-CREDITS.txt`. Os escudos são marcas dos clubes (veja o Aviso).

As imagens dos troféus foram melhoradas com IA, sempre usando o troféu original como base. Os escudos também foram melhorados com IA em alguns casos de baixa resolução; outros são iguais aos da Logopedia e alguns iguais aos da pesquisa independente.

### Dados

As contagens e os anos dos títulos vêm dos artigos da Wikipédia (em português e em inglês) sobre o Campeonato Brasileiro (Séries A a D), a Copa do Brasil, a Copa Libertadores, a Copa Sul-Americana, o Mundial de Clubes, a Copa do Nordeste, a Copa Verde, os campeonatos estaduais e cada clube (texto sob CC BY-SA 4.0; os fatos em si não têm direito autoral). As datas dos escudos antigos vêm da Logopedia e, nos times que não estão nela, de pesquisas independentes. Quando nenhuma fonte concreta as confirma, a data é aproximada e isso está dito em `src/teams.js`. Os campeonatos estaduais seguem o estado de cada clube (UF), com um troféu por estado. A regra das séries inferiores para os 12 grandes permanece: eles não mostram títulos de Série B, C nem D.

## Aviso

Extensão independente, sem ligação com nenhum clube de futebol, com a CBF ou com o Brasileirão. Os nomes dos clubes, os escudos e o logo do campeonato são marcas dos respectivos donos e aparecem aqui só para identificar cada tema. Se um titular pedir a retirada, o pacote sai do ar.

## Licença

MIT
