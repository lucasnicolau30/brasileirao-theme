const { mix, pickText, contrast } = require('./color');
const { PREFIX } = require('./brand');

// Cores de sintaxe compartilhadas por todos os times. Só a palavra-chave/tag/título usa o destaque do time.
const SYNTAX = {
  comment: '#8a8a8a',
  string: '#e6c79c',
  number: '#e0a070',
  func: '#a8c7e6',
  type: '#c9d6a8',
  variable: '#e6e6e6',
  property: '#cfcfcf',
  operator: '#9a9a9a',
  punctuation: '#8a8a8a',
  escape: '#f0b890'
};

// Cores com significado fixo: não mudam de time para time.
const SEMANTIC = {
  error: '#ff6b5a',
  warning: '#d9a441',
  info: '#6fa8dc',
  added: '#5fb760',
  deleted: '#e8452c',
  modified: '#d9a441'
};

const LINE_NUMBER = '#858585';

function colors(t) {
  const { bg, fg, primary, accent, statusBg, statusFg } = t;
  const deep = t.chrome || mix(bg, '#000000', 0.55);
  const secondary = t.secondary || primary;
  // Barra de atividades e de título podem ter cores diferentes (e claras); o texto escolhe sozinho preto ou branco.
  const actBg = t.activity || deep;
  const titleBg = t.title || deep;
  const actFg = pickText(actBg);
  const titleFg = pickText(titleBg) === '#ffffff' ? (contrast(fg, titleBg) >= 7 ? fg : '#ffffff') : '#0d0d0d';
  const actBorder = contrast(secondary, actBg) >= 3 ? secondary : actFg;
  const side = mix(bg, '#000000', 0.25);
  // Lateral do explorador de arquivos: pode ter um tom próprio do time (sem `side`, é o `side` derivado do fundo).
  const sideBg = t.side || side;
  const widget = mix(bg, '#ffffff', 0.07);
  const hover = mix(bg, '#ffffff', 0.05);
  const border = mix(bg, '#ffffff', 0.12);
  const border2 = mix(bg, '#ffffff', 0.18);
  const lineHL = mix(bg, primary, 0.12);
  const onPrimary = pickText(primary);
  const primaryHover = mix(primary, '#ffffff', 0.15);
  const [b1, b2, b3, b4, b5, b6] = t.brackets;

  return {
    focusBorder: primary,
    foreground: mix(fg, bg, 0.12),
    descriptionForeground: '#9a9a9a',
    errorForeground: SEMANTIC.error,
    'icon.foreground': '#bdbdbd',
    'selection.background': primary + '66',
    'widget.shadow': '#00000099',

    'editor.background': bg,
    'editor.foreground': fg,
    'editorLineNumber.foreground': LINE_NUMBER,
    'editorLineNumber.activeForeground': accent,
    'editorCursor.foreground': accent,
    'editor.selectionBackground': primary + '55',
    'editor.inactiveSelectionBackground': primary + '28',
    'editor.selectionHighlightBackground': primary + '30',
    'editor.wordHighlightBackground': primary + '28',
    'editor.wordHighlightStrongBackground': primary + '45',
    'editor.findMatchBackground': primary + '80',
    'editor.findMatchHighlightBackground': primary + '45',
    'editor.findRangeHighlightBackground': '#ffffff10',
    'editor.lineHighlightBackground': lineHL,
    'editor.lineHighlightBorder': '#00000000',
    'editor.rangeHighlightBackground': primary + '20',
    'editorWhitespace.foreground': border,
    'editorIndentGuide.background1': border,
    'editorIndentGuide.activeBackground1': mix(bg, primary, 0.7),
    'editorRuler.foreground': mix(bg, primary, 0.35),
    'editorBracketMatch.background': primary + '40',
    'editorBracketMatch.border': accent,
    'editorBracketHighlight.foreground1': b1,
    'editorBracketHighlight.foreground2': b2,
    'editorBracketHighlight.foreground3': b3,
    'editorBracketHighlight.foreground4': b4,
    'editorBracketHighlight.foreground5': b5,
    'editorBracketHighlight.foreground6': b6,
    'editorBracketHighlight.unexpectedBracket.foreground': SEMANTIC.error,
    'editorBracketPairGuide.activeBackground1': b1,
    'editorBracketPairGuide.activeBackground2': b2,
    'editorBracketPairGuide.activeBackground3': b3,
    'editorBracketPairGuide.activeBackground4': b4,
    'editorBracketPairGuide.activeBackground5': b5,
    'editorBracketPairGuide.activeBackground6': b6,
    'editorLink.activeForeground': accent,
    'editorCodeLens.foreground': '#8a8a8a',
    'editorGutter.background': bg,
    'editorGutter.modifiedBackground': SEMANTIC.modified,
    'editorGutter.addedBackground': SEMANTIC.added,
    'editorGutter.deletedBackground': SEMANTIC.deleted,
    'editorError.foreground': SEMANTIC.error,
    'editorWarning.foreground': SEMANTIC.warning,
    'editorInfo.foreground': SEMANTIC.info,
    'editorHoverWidget.background': widget,
    'editorHoverWidget.border': border2,
    'editorSuggestWidget.background': widget,
    'editorSuggestWidget.border': border2,
    'editorSuggestWidget.selectedBackground': primary + '40',
    'editorSuggestWidget.highlightForeground': accent,
    'editorWidget.background': widget,
    'editorWidget.border': border2,
    'editorOverviewRuler.border': '#00000000',
    'editorGroup.border': border,
    'editorGroupHeader.tabsBackground': side,
    'editorGroupHeader.noTabsBackground': bg,

    'tab.activeBackground': bg,
    'tab.activeForeground': '#ffffff',
    'tab.activeBorderTop': secondary,
    'tab.inactiveBackground': side,
    'tab.inactiveForeground': '#8f8f8f',
    'tab.border': border,
    'tab.hoverBackground': hover,
    'tab.unfocusedActiveBorderTop': mix(bg, primary, 0.4),

    'activityBar.background': actBg,
    'activityBar.foreground': actFg,
    'activityBar.inactiveForeground': mix(actFg, actBg, 0.3),
    'activityBar.border': mix(actBg, actFg, 0.12),
    'activityBar.activeBorder': actBorder,
    'activityBarBadge.background': primary,
    'activityBarBadge.foreground': onPrimary,

    'sideBar.background': sideBg,
    'sideBar.foreground': '#bdbdbd',
    'sideBar.border': border,
    'sideBarTitle.foreground': fg,
    'sideBarSectionHeader.background': hover,
    'sideBarSectionHeader.foreground': fg,
    'sideBarSectionHeader.border': border,

    'list.activeSelectionBackground': primary + '40',
    'list.activeSelectionForeground': '#ffffff',
    'list.inactiveSelectionBackground': mix(bg, '#ffffff', 0.09),
    'list.inactiveSelectionForeground': fg,
    'list.hoverBackground': hover,
    'list.focusBackground': primary + '40',
    'list.highlightForeground': accent,
    'list.errorForeground': SEMANTIC.error,
    'list.warningForeground': SEMANTIC.warning,
    'tree.indentGuidesStroke': border2,

    'statusBar.background': statusBg,
    'statusBar.foreground': statusFg,
    'statusBar.border': t.statusBorder || statusBg,
    'statusBar.noFolderBackground': mix(bg, '#ffffff', 0.12),
    'statusBar.noFolderForeground': '#ffffff',
    'statusBar.debuggingBackground': '#7a4a0d',
    'statusBar.debuggingForeground': '#ffffff',
    'statusBarItem.hoverBackground': statusFg + '22',
    'statusBarItem.remoteBackground': mix(statusBg, '#000000', 0.35),
    'statusBarItem.remoteForeground': '#ffffff',

    'titleBar.activeBackground': titleBg,
    'titleBar.activeForeground': titleFg,
    'titleBar.inactiveBackground': titleBg,
    'titleBar.inactiveForeground': mix(titleFg, titleBg, 0.3),
    'titleBar.border': mix(titleBg, titleFg, 0.12),
    'menu.background': widget,
    'menu.foreground': fg,
    'menu.selectionBackground': primary + '40',
    'menu.selectionForeground': '#ffffff',
    'menu.separatorBackground': border2,

    'panel.background': sideBg,
    'panel.border': border,
    'panelTitle.activeForeground': '#ffffff',
    'panelTitle.activeBorder': secondary,
    'panelTitle.inactiveForeground': '#8f8f8f',

    'terminal.background': sideBg,
    'terminal.foreground': fg,
    'terminal.selectionBackground': primary + '55',
    'terminalCursor.foreground': accent,
    'terminal.ansiBlack': '#1a1a1a',
    'terminal.ansiRed': '#e8452c',
    'terminal.ansiGreen': '#5fb760',
    'terminal.ansiYellow': '#d9a441',
    'terminal.ansiBlue': '#6fa8dc',
    'terminal.ansiMagenta': '#c586c0',
    'terminal.ansiCyan': '#56b6c2',
    'terminal.ansiWhite': '#d8d8d8',
    'terminal.ansiBrightBlack': '#5a5a5a',
    'terminal.ansiBrightRed': '#ff6b5a',
    'terminal.ansiBrightGreen': '#7ed07f',
    'terminal.ansiBrightYellow': '#f0c36a',
    'terminal.ansiBrightBlue': '#8fbfe8',
    'terminal.ansiBrightMagenta': '#d7a0d2',
    'terminal.ansiBrightCyan': '#7fd0da',
    'terminal.ansiBrightWhite': '#ffffff',

    'input.background': widget,
    'input.border': border2,
    'input.foreground': fg,
    'input.placeholderForeground': '#8a8a8a',
    'inputOption.activeBorder': primary,
    'inputOption.activeBackground': primary + '40',
    'inputValidation.errorBackground': '#3a0f0a',
    'inputValidation.errorBorder': SEMANTIC.deleted,
    'dropdown.background': widget,
    'dropdown.border': border2,
    'dropdown.foreground': fg,

    'button.background': primary,
    'button.foreground': onPrimary,
    'button.hoverBackground': primaryHover,
    'button.secondaryBackground': border,
    'button.secondaryForeground': fg,
    'button.secondaryHoverBackground': border2,
    'badge.background': primary,
    'badge.foreground': onPrimary,
    'progressBar.background': primary,
    'textLink.foreground': accent,
    'textLink.activeForeground': mix(accent, '#ffffff', 0.25),
    'textCodeBlock.background': widget,
    'textBlockQuote.background': widget,
    'textBlockQuote.border': primary,
    'textSeparator.foreground': border2,

    'scrollbar.shadow': '#00000000',
    'scrollbarSlider.background': '#ffffff14',
    'scrollbarSlider.hoverBackground': '#ffffff22',
    'scrollbarSlider.activeBackground': primary + '80',
    'peekView.border': primary,
    'peekViewEditor.background': mix(bg, '#ffffff', 0.025),
    'peekViewResult.background': side,
    'peekViewTitle.background': mix(bg, '#ffffff', 0.025),
    'peekViewResult.selectionBackground': primary + '40',
    'peekViewEditor.matchHighlightBackground': primary + '66',

    'notifications.background': widget,
    'notifications.border': border2,
    'notificationCenterHeader.background': mix(bg, '#ffffff', 0.025),
    'breadcrumb.foreground': '#8f8f8f',
    'breadcrumb.focusForeground': '#ffffff',
    'breadcrumb.activeSelectionForeground': accent,
    'pickerGroup.foreground': accent,
    'pickerGroup.border': border2,
    'quickInput.background': widget,
    'quickInputList.focusBackground': primary + '40',
    'gitDecoration.modifiedResourceForeground': SEMANTIC.modified,
    'gitDecoration.untrackedResourceForeground': SEMANTIC.added,
    'gitDecoration.deletedResourceForeground': SEMANTIC.deleted,
    'gitDecoration.ignoredResourceForeground': '#6a6a6a',
    'gitDecoration.conflictingResourceForeground': '#ff8a65',
    'diffEditor.insertedTextBackground': '#5fb76022',
    'diffEditor.removedTextBackground': '#e8452c26',
    'merge.currentHeaderBackground': primary + '66',
    'merge.incomingHeaderBackground': '#3a6ea533',
    'debugToolBar.background': widget,
    'debugToolBar.border': border2,
    'settings.headerForeground': '#ffffff',
    'settings.modifiedItemIndicator': primary,
    'extensionButton.prominentBackground': primary,
    'extensionButton.prominentForeground': onPrimary,
    'extensionButton.prominentHoverBackground': primaryHover,
    'minimap.selectionHighlight': primary + '80',
    'minimapSlider.background': '#ffffff10',
    'minimapSlider.hoverBackground': '#ffffff1a'
  };
}

function tokenColors(t) {
  const s = SYNTAX;
  const rule = (name, scope, settings) => ({ name, scope, settings });
  return [
    rule('Comentários', ['comment', 'punctuation.definition.comment'], { foreground: s.comment, fontStyle: 'italic' }),
    rule('Palavras-chave e armazenamento', ['keyword', 'keyword.control', 'storage', 'storage.type', 'storage.modifier'], { foreground: t.accent }),
    rule('Operadores', ['keyword.operator', 'punctuation.separator', 'punctuation.terminator'], { foreground: s.operator }),
    rule('Strings', ['string', 'string.quoted', 'string.template'], { foreground: s.string }),
    rule('Escapes e interpolação', ['constant.character.escape', 'punctuation.definition.template-expression', 'string.regexp'], { foreground: s.escape }),
    rule('Números e constantes', ['constant.numeric', 'constant.language', 'constant.other', 'support.constant'], { foreground: s.number }),
    rule('Funções e métodos', ['entity.name.function', 'support.function', 'meta.function-call entity.name.function', 'variable.function'], { foreground: s.func }),
    rule('Tipos e classes', ['entity.name.type', 'entity.name.class', 'entity.other.inherited-class', 'support.class', 'support.type'], { foreground: s.type }),
    rule('Variáveis', ['variable', 'variable.other', 'variable.parameter'], { foreground: s.variable }),
    rule('this e self', ['variable.language', 'variable.language.this', 'variable.language.self'], { foreground: t.accent, fontStyle: 'italic' }),
    rule('Propriedades', ['variable.other.property', 'variable.other.object.property', 'meta.object-literal.key', 'support.type.property-name'], { foreground: s.property }),
    rule('Tags e seletores', ['entity.name.tag', 'entity.name.tag.css', 'meta.tag', 'punctuation.definition.tag'], { foreground: t.accent }),
    rule('Atributos', ['entity.other.attribute-name', 'support.type.property-name.css'], { foreground: s.func }),
    rule('Pontuação', ['punctuation', 'meta.brace', 'meta.delimiter'], { foreground: s.punctuation }),
    rule('Decoradores e anotações', ['meta.decorator', 'entity.name.function.decorator', 'punctuation.decorator'], { foreground: s.escape }),
    rule('Markdown: títulos', ['markup.heading', 'entity.name.section.markdown'], { foreground: t.accent, fontStyle: 'bold' }),
    rule('Markdown: negrito', ['markup.bold'], { foreground: '#ffffff', fontStyle: 'bold' }),
    rule('Markdown: itálico', ['markup.italic'], { fontStyle: 'italic' }),
    rule('Markdown: links', ['markup.underline.link', 'string.other.link'], { foreground: s.func }),
    rule('Markdown: código inline', ['markup.inline.raw', 'markup.fenced_code.block'], { foreground: s.string }),
    rule('Diff: adicionado', ['markup.inserted'], { foreground: SEMANTIC.added }),
    rule('Diff: removido', ['markup.deleted'], { foreground: SEMANTIC.deleted }),
    rule('Inválido', ['invalid', 'invalid.illegal'], { foreground: '#ffffff', background: '#b3261e' })
  ];
}

function buildTheme(team) {
  return {
    $schema: 'vscode://schemas/color-theme',
    name: `${PREFIX}: ${team.label}`,
    type: 'dark',
    semanticHighlighting: true,
    colors: colors(team),
    tokenColors: tokenColors(team)
  };
}

module.exports = { buildTheme, SYNTAX, LINE_NUMBER };
