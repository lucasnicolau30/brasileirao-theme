# Brasileirão Theme

[Português](README.pt.md) | English

[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80-007ACC?style=flat&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/lucasnicolau30.brasileirao-theme?style=flat&label=Marketplace&color=007ACC&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=lucasnicolau30.brasileirao-theme)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

A dark theme and an icon theme for each of 125 clubs of the Brazilian league system (Brasileirão and the lower divisions). The base is the same for all (dark background, light text, discreet syntax). What changes is the club's identity: its color shows up on the active line, line numbers, indent guides, bracket pairs, rulers, the active tab, the cursor, the selection and the status bar — and, behind your code, a faint version of the club's crest.

> Independent project. Not affiliated with any football club, with the CBF or with the Brasileirão. Club names and crests are trademarks of their owners. See [Credits and licenses](#credits-and-licenses).

> **Data last verified:** November 19, 2026 (titles, crests and dates). Found something wrong or outdated? See [how to contribute](#contributing).

Teams: Rio Branco-AC, Juventus-AC, Independência, Atlético-AC, CSA, CRB, ASA, Macapá, Trem, Ypiranga-AP, Santos-AP, Amazonas FC, Nacional-AM, Rio Negro-AM, São Raimundo-AM, Manaus FC, Bahia, Vitória, Ypiranga-BA, Fortaleza, Ceará, Ferroviário-CE, Guarany de Sobral, Brasiliense, Gama, Brasília, Rio Branco-ES, Desportiva Ferroviária, Vitória-ES, Serra, Goiás, Atlético-GO, Vila Nova, Aparecidense, Sampaio Corrêa, Moto Club, Maranhão AC, Cuiabá, Luverdense, Mixto, Operário-MS, Comercial-MS, Cruzeiro, Atlético-MG, América-MG, Uberlândia, Villa Nova-MG, Boa Esporte-MG, Tupi, Tombense, Paysandu, Remo, Tuna Luso, São Raimundo-PA, Campinense, Botafogo-PB, Treze, Athletico-PR, Coritiba, Paraná, Londrina, Operário-PR, Maringá, Sport, Santa Cruz, Náutico, Retrô, Flamengo-PI, Parnahyba, Piauí, Altos, Flamengo, Fluminense, Vasco, Botafogo, Campo Grande, Volta Redonda, Olaria, Macaé, América-RJ, Bangu, América-RN, ABC, Grêmio, Internacional, Juventude, Ji-Paraná, Vilhena, Porto Velho, Baré, São Raimundo-RR, GAS, Criciúma, Chapecoense, Joinville, Avaí, Brusque, Barra-SC, Figueirense, São Paulo, Santos, Corinthians, Palmeiras, Guarani, Paulista, Santo André, Bragantino, União São João, Portuguesa, Juventus-SP, Inter de Limeira, Novorizontino, Ituano, Mirassol, XV de Piracicaba, União Barbarense, Osasco Sporting, Ponte Preta, Botafogo-SP, Sergipe, Confiança, Itabaiana, Palmas, Tocantinópolis, Gurupi

## What you get

- **A color theme per club**, with contrast checked on every theme (editor text at 7:1 or better; comments, line numbers, status bar, buttons and bracket levels at 4.5:1 or better).
- **An icon theme per club**: the club's crest replaces the folder icon. File icons come from Material Icon Theme.
- **The crest behind the code**: the club's current crest in the editor background, in full color and faint (Flamengo shows a white monogram instead).
- **A "Titles" section in the Explorer**: the Copa do Brasil, Libertadores and Brasileirão trophies, each with the number of titles. Hover a trophy to see the years. Only the competitions where the club has a title appear, centered: Copa do Brasil, Libertadores, Brasileirão, the Club World Cup, Sudamericana, Copa do Nordeste (northeastern clubs only), Copa Verde (north and center-west clubs only), Série B, C and D and the state championship (with the trophy of each of the 27 states), each with a trophy photo. The 12 big clubs show every trophy except Série B, C and D.
- **Old crests for the editor background**: the **"Escudos"** button in the status bar, or the command **"Brasileirão: Escolher escudo do fundo"** switches the background between the current crest and the club's historical ones (947 crests for 121 of the 125 clubs, from the Wikimedia Commons and from images supplied by the project author; each file's source is in `icons/retro-CREDITS.txt`). The folder icons in the Explorer follow the chosen old crest too (each old crest has its own icon theme, which also shows up in "Set File Icon Theme"). The old crests keep their original colors. Each one shows the period it was used; a few dates are approximate.
- **A team picker with crests**, from the status bar or the command palette.
- **Indent Rainbow in the club's colors**, if you use that extension.
- **Better Comments in the club's colors**: `// !`, `// ?`, `// TODO` and `// *` each get their own look. Better Comments is installed together with the theme.

## Installation

Search for **Brasileirão Theme** in the Extensions view, or:

```bash
code --install-extension lucasnicolau30.brasileirao-theme
```

Requires VS Code 1.80 or newer. The crest in the editor background also needs the **Background** extension (see [Crest in the editor background](#crest-in-the-editor-background)); everything else works without it.

## Choosing a team

Pick the team in one of these ways:

- **The "Times" button in the status bar** (bottom left) or **`Ctrl+Shift+P` → "Brasileirão: Escolher time"**: lists the 125 clubs with the crest of each one that has it, its colors, and the current one selected. Each club says how many crest options it has ("· 5 opções de escudo"), and picking a club that has more than one opens the list with all of them (current, alternates and retro), each with its dates. This is the recommended way.
- **`Ctrl+K Ctrl+T`**: VS Code's own theme picker, with the `Brasileirão: <club>` themes among the others.
- Avoid the **Set Color Theme** and **Set File Icon Theme** buttons on the extension page. They belong to VS Code (one per kind of theme, and they can't be removed): the list opens in alphabetical order, doesn't mark the current theme, and previews the first item.

VS Code doesn't link a color theme to an icon theme. A bit of extension code does it: when it detects a `Brasileirão: <club>` theme, it writes the matching `workbench.iconTheme` to your user settings. When you leave the collection it restores the icon theme you had (if you pick another by hand, it respects that). To turn this off, set `"brasileirao.syncIconTheme": false`.

## Crest in the editor background

VS Code has no API to put an image behind the code. The extension uses the **Background** extension (`shalldie.background`), which edits a file of VS Code itself. All of this is expected:

- VS Code asks you to **restart** when you pick a team (and the first time the crest is applied). The first time, the extension explains this in a message.
- In some versions VS Code warns that the installation is **"corrupt"**. Background tries to hide the warning, but it may show up. Nothing is broken.
- A **VS Code update** erases the change; the extension reapplies it the next time you open VS Code.
- To **not use the background crest**, turn off `brasileirao.crestBackground`. That restores what you had before. Themes, icons and the "Titles" section keep working without Background.

All crests have the same total height (80% of the window), stars and crown included. The current crests are shown in full color, at 1.5 times the opacity set in `brasileirao.crestOpacity`; Flamengo shows only its monogram, in white.

## Titles

The **Titles** section at the bottom of the Explorer shows only the competitions where the club has a title, centered: Copa do Brasil, Libertadores (larger), Brasileirão, Club World Cup, Sudamericana, Copa do Nordeste (northeastern clubs only), Copa Verde (north and center-west clubs only), Série B, C and D and the state championship (with the trophy of each of the 27 states), each with a trophy photo; the 12 big clubs show every trophy except Série B, C and D. A club with a single Série C title shows just the Série C. With 4 or 5 competitions everything fits on a single line (items and text shrink to the sidebar width). The Club World Cup is the apex: right next to the Libertadores and centered when there are 5. All trophies have the same height. Each has a badge in the club's color with the number of titles ("x9"). Hovering a trophy shows the years.

The data lives in the `titles` field of `src/teams.js`, up to the 2025 season (Copa do Nordeste and Copa Verde up to 2026). The Brasileirão follows the CBF's unified criterion (1959 onwards, plus Atlético-MG's 1937); Flamengo also counts 1987. Tests check the years against a table made by hand.

## Palettes

| Club | Main color | Text accent | Status bar |
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

A club's official color doesn't always work as text on a dark background (blues, for instance, look dull). So each club has a main color, used on filled areas, and a lighter version for text.

Six clubs are black and white (Botafogo, Vasco, Corinthians, Santos, Atlético-MG and Ceará). They stand apart by subtle details: the tone of the background and of the white (cool or warm), a light or dark status bar, and the border. In those themes the six bracket levels cycle through three tones instead of six colors.

The terminal and the bottom panel use the same color as the Explorer sidebar.

## Indent Rainbow

If you use **Indent Rainbow** (`oderwat.indent-rainbow`), it paints indentation yellow, green, pink and blue, which clashes with the club's colors. A theme can't change another extension's settings, so this extension does it with a bit of code: when a `Brasileirão: <club>` theme becomes active, it replaces `indentRainbow.colors` (in your user settings) with four of the club's colors at 8% opacity. When you pick a theme outside the collection, it restores the previous value. Without Indent Rainbow installed, nothing happens.

## Better Comments

A theme can't color `// !` or `// TODO`: that is done by the **Better Comments** extension (`aaron-bond.better-comments`), which is why it is installed together with this one. When a `Brasileirão: <club>` theme becomes active, the extension writes `better-comments.tags` (in your user settings) with the club's colors:

| Tag | Look |
| --- | --- |
| `// !` | the club's highlight color, bold, on a faint background |
| `// ?` | a soft tone of the club, italic |
| `// TODO` | the club's second tone, bold and underlined |
| `// *` | the club's main tone |
| `// //` | struck-through gray (commented-out code) |

Better Comments only reads its tags at startup, so after changing club VS Code offers to reload the window. When you pick a theme outside the collection, the previous value is restored.

## File icons

If Material Icon Theme is installed on the machine that builds the package, the club's icon theme uses its file icons (hundreds of types) and replaces **all** folders with the club's crest. Material is MIT-licensed and its license ships in `icons/_material/LICENSE.txt`. Without Material, the build uses 18 icons of its own (JavaScript, TypeScript, JSX, TSX, JSON, `package.json`, HTML, CSS, Markdown, Python, Java, C#, SQL, YAML, shell, images, text, config files and the `node_modules` and `.git` folders).

## Settings

| Setting | Default | What it does |
| --- | --- | --- |
| `brasileirao.syncIconTheme` | `true` | Picking a `Brasileirão: <club>` theme also switches to the same club's icon theme. |
| `brasileirao.crestBackground` | `true` | Shows the crest in the editor background. Needs the Background extension. Turning it off restores the previous configuration. |
| `brasileirao.crestOpacity` | `0.08` | Opacity of the background crest (0.01 to 0.3). |

## Development

```bash
npm run build      # generates themes, icons and the package.json contributes block
npm run check      # checks the minimum contrasts on the 125 themes
npm test           # data, generated files and contrast tests (node --test)
npm run package    # build + check + brasileirao-theme.vsix
npm run instalar   # package + installs in VS Code (then reload the window)
npm run preview    # generates preview/index.html with the 125 clubs side by side
```

The team table is `src/teams.js`. To change a color, a label or a club's titles, edit it there and run `npm run build`. The files in `themes/` and `icons/` are generated and must not be edited by hand.

To try it without installing, open this folder in VS Code and press `F5`.

### Crest images

Crests are trademarks of the clubs. The sources live in `assets/escudos/` (and `assets/escudos/fundo/` for the editor-background silhouettes) and are in `.gitignore`, so they don't go to the repository. `npm run build` uses the ones that exist; without a file, the folder uses the club's color.

## Rules and exceptions

### Rules

- **Titles:** only the competitions where the club has a title appear. The 12 big clubs (Flamengo, Fluminense, Vasco, Botafogo, Palmeiras, Santos, São Paulo, Corinthians, Cruzeiro, Atlético-MG, Grêmio and Internacional) show every trophy except Série B, C and D; the other clubs show Série B, C and D too.
- **State championship:** the main state championship of the club's state (UF), with the state's trophy. All 27 states have the photo.
- **Years:** up to the 2025 season (Copa do Nordeste, Copa Verde and state championships up to 2026). The Brasileirão follows the CBF's unified criterion (1959 onwards, plus Atlético-MG's 1937); Flamengo also counts 1987.
- **Club order:** in the READMEs, states are alphabetical and, within each, clubs follow the picker's display order. That order is set by the number of titles: Club World Cup, Libertadores and Brasileirão first; on a tie, Copa do Brasil, Sudamericana, Copa do Nordeste, Copa Verde, Série B, C and D and, last, the state championship. With everything equal, the club that won the most important title first comes first.
- **Current crest:** just one per club, with "desde YYYY" in the name only when the source is clear.
- **Old crests:** in chronological order, with the **period** of use as the label (never a lone year); no crests nearly identical to each other or to the current one; always smooth, sharp vector.
- **Editor background:** every crest has the same height (80% of the window). Dark colors are lightened to show on the dark background; original colors are not changed when the crest is already visible.
- **Dates:** they come from Logopedia and, for clubs that are not on it, from independent research. Invented dates do not go in: without a concrete source the period is approximate and a comment in `src/teams.js` says so.
- **Club scope:** active clubs that play or have played Séries A to D, at least one per state, plus some picked by the author. Extinct clubs and all state championships are left out.

### Exceptions

Each exception has a standardized comment in `src/teams.js`, above the club's current crest name, with the exact periods.

- **Approximate dates, no concrete source:** Juventus-AC, Macapá, Gurupi and Ji-Paraná (all old crests); Campinense, Campo Grande, Olaria and Macaé (some).
- **Overlapping dates** (the club used more than one crest in the period, or there was a merger): Tuna Luso, Vasco, Botafogo, Internacional, Juventude, São Paulo, Corinthians, Palmeiras, Santos, Bragantino and Portuguesa.
- **Empty period** (the source has no crest for the interval): Boa Esporte-MG, Campo Grande, Corinthians, Mirassol and União Barbarense.
- **Light border on the outside** (a dark crest that would vanish on the editor background), on old crests: Flamengo, São Paulo, Corinthians, Santos, Grêmio, Criciúma, Botafogo-PB, Treze, Santa Cruz, Parnahyba, Piauí, Volta Redonda, Olaria, Macaé, América-RJ, Botafogo-SP, Ponte Preta, Osasco Sporting, União Barbarense, Inter de Limeira, Ituano, União São João, Bragantino, Juventus-SP, Santo André and Paulista. On the current crest: Uberlândia, Athletico-PR, Volta Redonda, Ponte Preta, União São João, Juventus-SP and Santo André.
- **Current crest with a caveat:** Atlético-AC and Palmas.
- **No old crests:** Ypiranga-AP, Manaus FC, Altos and Novorizontino.
- **Others:** Vasco has two current crests (the full one and the cross); Flamengo shows only the monogram in the background; in Paraná the two old crests are those of the clubs that merged in 1989, and the 2000 Série B title (Copa João Havelange) is included by the author's decision.

## Contributing

Everything comes from a data table, so fixing or adding a piece of data is quick. Use the issue templates:

- **[Suggest a new team](https://github.com/lucasnicolau30/brasileirao-theme/issues/new?template=sugestao-time.yml)**: tell us the club, the state and the division, with the current crest and, if you have them, the old ones (with dates and source).
- **[Wrong or outdated information](https://github.com/lucasnicolau30/brasileirao-theme/issues/new?template=informacao-incorreta.yml)**: a crest date, a title (year or count), a wrong crest or trophy photo, or a current or old crest that is missing. Say what is wrong, what is right and the source.
- **[Bug](https://github.com/lucasnicolau30/brasileirao-theme/issues/new?template=bug.yml)**: something that does not work in the extension.

Before asking for a new team, see the [rules and exceptions](#rules-and-exceptions) above. The date the data was last verified is at the top of this README and is updated when corrections land.

## Credits and licenses

This project's code is under the [MIT License](LICENSE). Third-party material, and how it is used:

### Software

| What | Author | License | How it is used |
| --- | --- | --- | --- |
| [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme) | Philipp Kief | MIT | File icons, bundled in `icons/_material/` with its license. |
| [Background](https://github.com/shalldie/vscode-background) | shalldie | MIT | Not bundled. Required only for the editor-background crest. |
| [Better Comments](https://github.com/aaron-bond/better-comments) | Aaron Bond | MIT | Not bundled. Installed as a dependency; only its tags setting is changed. |
| [Indent Rainbow](https://github.com/oderwat/vscode-indent-rainbow) | oderwat | MIT | Not bundled. Only its colors setting is changed, if it is installed. |

### Images

Author, license and source of each trophy photo are in `images/trofeus/CREDITS.txt`, and those of the old crests in `icons/retro-CREDITS.txt`. The crests are trademarks of the clubs (see the Disclaimer).

The trophy images were enhanced with AI, always using the original trophy as the base. The crests were also enhanced with AI in some low-resolution cases; others are identical to the ones on Logopedia, and some to the ones found through independent research.

### Data

Title counts and years come from the Portuguese and English Wikipedia articles on the Campeonato Brasileiro (Séries A to D), the Copa do Brasil, the Copa Libertadores, the Copa Sul-Americana, the Club World Cup, the Copa do Nordeste, the Copa Verde, the state championships and each club (text under CC BY-SA 4.0; the facts themselves are not copyrightable). The dates of the old crests come from Logopedia and, for clubs that are not on it, from independent research. Where no concrete source confirms them, the date is approximate and says so in `src/teams.js`. The state championships follow each club's state (UF), with one trophy per state. The rule for the lower divisions of the 12 big clubs stays: they do not show Série B, C or D titles.

## Disclaimer

Independent extension, with no link to any football club, the CBF or the Brasileirão. Club names, crests and the competition logo are trademarks of their respective owners and appear here only to identify each theme. If an owner asks for removal, the package comes down.

## License

MIT
