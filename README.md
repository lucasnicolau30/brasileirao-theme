# Brasileirão Theme

[Português](README.pt.md) | English

[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80-007ACC?style=flat&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/lucasnicolau30.brasileirao-theme?style=flat&label=Marketplace&color=007ACC&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=lucasnicolau30.brasileirao-theme)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

A dark theme and an icon theme for each of the 12 big clubs of the Brazilian league (Brasileirão). The base is the same for all (dark background, light text, discreet syntax). What changes is the club's identity: its color shows up on the active line, line numbers, indent guides, bracket pairs, rulers, the active tab, the cursor, the selection and the status bar — and, behind your code, a faint white silhouette of the club's crest.

> Independent project. Not affiliated with any football club, with the CBF or with the Brasileirão. Club names and crests are trademarks of their owners. See [Credits and licenses](#credits-and-licenses).

Teams: Flamengo, Fluminense, Botafogo, Vasco, Corinthians, Palmeiras, São Paulo, Santos, Cruzeiro, Atlético-MG, Grêmio and Internacional.

## What you get

- **A color theme per club**, with contrast checked on every theme (editor text at 7:1 or better; comments, line numbers, status bar, buttons and bracket levels at 4.5:1 or better).
- **An icon theme per club**: the club's crest replaces the folder icon. File icons come from Material Icon Theme.
- **The crest behind the code**: a white, matte silhouette of the crest in the editor background, with the light areas cut out so the details show.
- **A "Titles" section in the Explorer**: the Copa do Brasil, Libertadores and Brasileirão trophies, each with the number of titles. Hover a trophy to see the years.
- **A team picker with crests**, from the status bar or the command palette.
- **Indent Rainbow in the club's colors**, if you use that extension.

## Screenshots

> Placeholders: add one image per club in `images/screenshots/<slug>.png` (about 1280×720). The names are in the table.

| Club | Screenshot |
| --- | --- |
| Flamengo | ![Flamengo](images/screenshots/flamengo.png) |
| Fluminense | ![Fluminense](images/screenshots/fluminense.png) |
| Botafogo | ![Botafogo](images/screenshots/botafogo.png) |
| Vasco | ![Vasco](images/screenshots/vasco.png) |
| Corinthians | ![Corinthians](images/screenshots/corinthians.png) |
| Palmeiras | ![Palmeiras](images/screenshots/palmeiras.png) |
| São Paulo | ![São Paulo](images/screenshots/sao-paulo.png) |
| Santos | ![Santos](images/screenshots/santos.png) |
| Cruzeiro | ![Cruzeiro](images/screenshots/cruzeiro.png) |
| Atlético-MG | ![Atlético-MG](images/screenshots/atletico-mg.png) |
| Grêmio | ![Grêmio](images/screenshots/gremio.png) |
| Internacional | ![Internacional](images/screenshots/internacional.png) |

Extra images, if you want them:

| What | File |
| --- | --- |
| The "Titles" section, with a trophy hovered (years box) | `images/screenshots/titulos.png` |
| The team picker with crests | `images/screenshots/seletor.png` |
| The status bar "Times" button | `images/screenshots/botao-times.png` |

## Installation

Search for **Brasileirão Theme** in the Extensions view, or:

```bash
code --install-extension lucasnicolau30.brasileirao-theme
```

Requires VS Code 1.80 or newer. The crest in the editor background also needs the **Background** extension (see [Crest in the editor background](#crest-in-the-editor-background)); everything else works without it.

## Choosing a team

Pick the team in one of these ways:

- **The "Times" button in the status bar** (bottom left) or **`Ctrl+Shift+P` → "Brasileirão: Escolher time"**: lists the 12 clubs with each crest, its colors, and the current one selected. This is the recommended way.
- **`Ctrl+K Ctrl+T`**: VS Code's own theme picker, with the `Brasileirão: <club>` themes among the others.
- Avoid the **Set Color Theme** and **Set File Icon Theme** buttons on the extension page. They belong to VS Code (one per kind of theme, and they can't be removed): the list opens in alphabetical order, doesn't mark the current theme, and previews the first item.

VS Code doesn't link a color theme to an icon theme. A bit of extension code does it: when it detects a `Brasileirão: <club>` theme, it writes the matching `workbench.iconTheme` to your user settings. When you leave the collection it restores the icon theme you had (if you pick another by hand, it respects that). To turn this off, set `"brasileirao.syncIconTheme": false`.

## Crest in the editor background

VS Code has no API to put an image behind the code. The extension uses the **Background** extension (`shalldie.background`), which edits a file of VS Code itself. All of this is expected:

- VS Code asks you to **restart** when you pick a team (and the first time the crest is applied). The first time, the extension explains this in a message.
- In some versions VS Code warns that the installation is **"corrupt"**. Background tries to hide the warning, but it may show up. Nothing is broken.
- A **VS Code update** erases the change; the extension reapplies it the next time you open VS Code.
- To **not use the background crest**, turn off `brasileirao.crestBackground`. That restores what you had before. Themes, icons and the "Titles" section keep working without Background.

All crests have the same total height (80% of the window), stars and crown included. Some show only the essence of the crest: the monogram for Flamengo, Fluminense and Internacional, the lone star for Botafogo, the five stars of the Southern Cross for Cruzeiro and the Maltese cross for Vasco.

## Titles

The **Titles** section at the bottom of the Explorer shows the Copa do Brasil, Libertadores (in the middle, larger) and Brasileirão trophies. Each has a badge in the club's color with the number of titles ("x9"). Hovering a trophy shows the years.

The data lives in the `titles` field of `src/teams.js`, up to the 2025 season. The Brasileirão follows the CBF's unified criterion (1959 onwards, plus Atlético-MG's 1937); Flamengo also counts 1987. Tests check the years against a table made by hand.

## Palettes

| Club | Main color | Text accent | Status bar |
|---|---|---|---|
| Flamengo | `#c52613` | `#ff5a45` | `#c52613` |
| Fluminense | `#8f1d3d` | `#ec7898` | `#8f1d3d` |
| Botafogo | `#eef3f9` | `#ffffff` | `#eef3f9` |
| Vasco | `#e0e0e0` | `#f0f0f0` | `#000000` |
| Corinthians | `#bdbdbd` | `#ffffff` | `#2b2b2b` |
| Palmeiras | `#0b7a43` | `#3ccf8a` | `#006437` |
| São Paulo | `#d3112d` | `#ff5c6c` | `#000000` |
| Santos | `#f3ead8` | `#f6eedc` | `#e8dfcc` |
| Cruzeiro | `#1d4fc4` | `#7aa2ff` | `#0f3fa8` |
| Atlético-MG | `#d0d0d0` | `#f5f5f5` | `#1c1c1c` |
| Grêmio | `#0b76b0` | `#4db8f5` | `#0a6aa3` |
| Internacional | `#d4161c` | `#ff5d5d` | `#b8121a` |

A club's official color doesn't always work as text on a dark background (blues, for instance, look dull). So each club has a main color, used on filled areas, and a lighter version for text.

Five clubs are black and white (Botafogo, Vasco, Corinthians, Santos and Atlético-MG). They stand apart by subtle details: the tone of the background and of the white (cool or warm), a light or dark status bar, and the border. In those themes the six bracket levels cycle through three tones instead of six colors.

The terminal and the bottom panel use the same color as the Explorer sidebar.

## Indent Rainbow

If you use **Indent Rainbow** (`oderwat.indent-rainbow`), it paints indentation yellow, green, pink and blue, which clashes with the club's colors. A theme can't change another extension's settings, so this extension does it with a bit of code: when a `Brasileirão: <club>` theme becomes active, it replaces `indentRainbow.colors` (in your user settings) with four of the club's colors at 8% opacity. When you pick a theme outside the collection, it restores the previous value. Without Indent Rainbow installed, nothing happens.

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
npm run check      # checks the minimum contrasts on the 12 themes
npm test           # data, generated files and contrast tests (node --test)
npm run package    # build + check + brasileirao-theme.vsix
npm run instalar   # package + installs in VS Code (then reload the window)
npm run preview    # generates preview/index.html with the 12 clubs side by side
```

The team table is `src/teams.js`. To change a color, a label or a club's titles, edit it there and run `npm run build`. The files in `themes/` and `icons/` are generated and must not be edited by hand.

To try it without installing, open this folder in VS Code and press `F5`.

### Crest images

Crests are trademarks of the clubs. The sources live in `assets/escudos/` (and `assets/escudos/fundo/` for the editor-background silhouettes) and are in `.gitignore`, so they don't go to the repository. `npm run build` uses the ones that exist; without a file, the folder uses the club's color.

## Credits and licenses

This project's code is under the [MIT License](LICENSE). Third-party material, and how it is used:

### Software

| What | Author | License | How it is used |
| --- | --- | --- | --- |
| [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme) | Philipp Kief | MIT | File icons, bundled in `icons/_material/` with its license. |
| [Background](https://github.com/shalldie/vscode-background) | shalldie | MIT | Not bundled. Required only for the editor-background crest. |
| [Indent Rainbow](https://github.com/oderwat/vscode-indent-rainbow) | oderwat | MIT | Not bundled. Only its colors setting is changed, if it is installed. |

### Trophy photos

Cut out from their background and resized, via Wikimedia Commons.

| Trophy | Work | Author | License |
| --- | --- | --- | --- |
| Brasileirão | [Troféu Campeonato Brasileiro 2024.jpg](https://commons.wikimedia.org/wiki/File:Trof%C3%A9u_Campeonato_Brasileiro_2024.jpg) | Phill ad | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) |
| Libertadores | [328-3287452 copa-libertadores-primer-trofeo-hd-png-download.png](https://commons.wikimedia.org/wiki/File:328-3287452_copa-libertadores-primer-trofeo-hd-png-download.png) | Mathiaseditorxd | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Copa do Brasil | Image supplied by the project author (render of the trophy) | Not stated | Not stated |

The adapted Libertadores image (`images/trofeus/libertadores.png`) is distributed under the same license as the original, CC BY-SA 4.0. The rest of the project stays under MIT.

### Crests and marks

| What | Source |
| --- | --- |
| Atlético-MG shield | [Clube Atlético Mineiro logo.svg](https://commons.wikimedia.org/wiki/File:Clube_Atl%C3%A9tico_Mineiro_logo.svg), Wikimedia Commons (public domain as to copyright) |
| Santos shield | [Santos Futebol Clube logo (with stars but without the crown).svg](https://commons.wikimedia.org/wiki/File:Santos_Futebol_Clube_logo_(with_stars_but_without_the_crown).svg) and [(with stars and crown).png](https://commons.wikimedia.org/wiki/File:Santos_Futebol_Clube_logo_(with_stars_and_crown).png), Wikimedia Commons (public domain as to copyright) |
| Other crests, club names | Trademarks of the respective clubs |
| Extension icon | The Brasileirão Série A logo, a trademark of the CBF |

Public-domain status on Wikimedia Commons concerns copyright only; the crests remain trademarks of the clubs.

### Data

Title counts and years come from the Portuguese and English Wikipedia articles on the Campeonato Brasileiro Série A, the Copa do Brasil and the Copa Libertadores (text under CC BY-SA 4.0; the facts themselves are not copyrightable).

## Disclaimer

Independent extension, with no link to any football club, the CBF or the Brasileirão. Club names, crests and the competition logo are trademarks of their respective owners and appear here only to identify each theme. If an owner asks for removal, the package comes down.

## License

MIT
