// Tabela dos times. Para renomear o rótulo de um time (nome oficial -> apelido), mude só `label`.
//
// bg          fundo do editor (os demais fundos derivam dele)
// primary     cor do time: barra de status, aba ativa, botões, seleção, pasta
// accent      versão da cor do time que serve como TEXTO sobre o fundo escuro
// statusBg/statusFg   barra de status (statusFg precisa de contraste >= 4.5 com statusBg)
// brackets    6 cores dos pares de colchetes
// activity/title  (opcional) cor da barra de atividades e da barra de título, quando diferem de `chrome`
//                  (podem ser claras: o texto escolhe preto ou branco)
// side        (opcional) fundo da lateral do explorador de arquivos; sem ele, um tom mais escuro do bg
// chrome      (opcional) barra de atividades e barra de título; sem ele, um tom mais escuro do bg
// secondary   (opcional) segunda cor do time: borda da aba ativa, da barra de atividades e do painel
// bgPosition  (opcional) posição do escudo no fundo do editor, como em background-position; padrão: calc(50% - 50px) 50%
// titles      anos dos títulos de Brasileirão (critério CBF, 1959 em diante; o Flamengo conta também 1987), Copa do Brasil e Libertadores, até a temporada 2025
// bgColor     (opcional) cor do escudo no fundo do editor, em vez de branco puro (só vale para escudo em SVG de uma cor, assets/escudos/fundo/<slug>.svg)
// swatch      quadradinhos coloridos (emoji) com as cores do time, para o seletor 'Escolher time'
// fg          cor do texto principal (um tom do branco, mais frio ou mais quente)
module.exports = [
  { slug: 'flamengo', bgPosition: '42.4% 50%', swatch: '🟥⬛⬜', titles: { brasileirao: [1980, 1982, 1983, 1987, 1992, 2009, 2019, 2020, 2025], copaDoBrasil: [1990, 2006, 2013, 2022, 2024], libertadores: [1981, 2019, 2022, 2025] }, label: 'Flamengo', side: '#2a100c', bg: '#0d0d0d', activity: '#c52613', title: '#000000', secondary: '#ffffff', fg: '#e6e6e6', primary: '#c52613', accent: '#ff5a45', statusBg: '#c52613', statusFg: '#ffffff',
    brackets: ['#ff5a45', '#ffffff', '#ff9a8a', '#bdbdbd', '#e0402c', '#8f8f8f'] },
  { slug: 'fluminense', swatch: '🟥🟩⬜', titles: { brasileirao: [1970, 1984, 2010, 2012], copaDoBrasil: [2007], libertadores: [2023] }, label: 'Fluminense', side: '#2c0f1b', bg: '#1a0b12', chrome: '#0b3d27', secondary: '#2fa866', fg: '#ece6e8', primary: '#8f1d3d', accent: '#ec7898', statusBg: '#8f1d3d', statusFg: '#ffffff',
    brackets: ['#ec7898', '#3fc07b', '#ffffff', '#d94f77', '#7fdba5', '#bdbdbd'] },
  { slug: 'botafogo', bgColor: '#eef3f9', swatch: '⬛⬜', titles: { brasileirao: [1968, 1995, 2024], copaDoBrasil: [], libertadores: [2024] }, label: 'Botafogo', side: '#151a21', bg: '#0b0b0c', activity: '#eef3f9', title: '#000000', fg: '#e8ecf0', primary: '#eef3f9', accent: '#ffffff', statusBg: '#eef3f9', statusFg: '#0b0b0c',
    brackets: ['#ffffff', '#c3ccd6', '#8f9aa6', '#ffffff', '#c3ccd6', '#8f9aa6'] },
  { slug: 'vasco', bgColor: '#e0e0e0', swatch: '⬛⬜', titles: { brasileirao: [1974, 1989, 1997, 2000], copaDoBrasil: [2011], libertadores: [1998] }, label: 'Vasco', side: '#141414', bg: '#080808', activity: '#000000', title: '#e6e6e6', fg: '#e8e8e8', primary: '#e0e0e0', accent: '#f0f0f0', statusBg: '#000000', statusFg: '#ffffff', statusBorder: '#e0e0e0',
    brackets: ['#f0f0f0', '#b5b5b5', '#8a8a8a', '#f0f0f0', '#b5b5b5', '#8a8a8a'] },
  { slug: 'corinthians', bgColor: '#f2f2f2', swatch: '⬛⬜', titles: { brasileirao: [1990, 1998, 1999, 2005, 2011, 2015, 2017], copaDoBrasil: [1995, 2002, 2009, 2025], libertadores: [2012] }, label: 'Corinthians', side: '#1c1c1c', bg: '#101010', activity: '#f2f2f2', title: '#f2f2f2', fg: '#eaeaea', primary: '#bdbdbd', accent: '#ffffff', statusBg: '#000000', statusFg: '#ffffff', statusBorder: '#f2f2f2',
    brackets: ['#ffffff', '#c9c9c9', '#9a9a9a', '#ffffff', '#c9c9c9', '#9a9a9a'] },
  { slug: 'palmeiras', swatch: '🟩⬜', titles: { brasileirao: [1960, 1967, 1967, 1969, 1972, 1973, 1993, 1994, 2016, 2018, 2022, 2023], copaDoBrasil: [1998, 2012, 2015, 2020], libertadores: [1999, 2020, 2021] }, label: 'Palmeiras', side: '#0e2b1b', bg: '#08170f', chrome: '#0a4a2a', fg: '#e4ece7', primary: '#0b7a43', accent: '#3ccf8a', statusBg: '#006437', statusFg: '#ffffff',
    brackets: ['#3ccf8a', '#ffffff', '#8fe3b9', '#bdbdbd', '#1fa569', '#8f8f8f'] },
  { slug: 'sao-paulo', swatch: '🟥⬛⬜', titles: { brasileirao: [1977, 1986, 1991, 2006, 2007, 2008], copaDoBrasil: [2023], libertadores: [1992, 1993, 2005] }, label: 'São Paulo', side: '#32101a', bg: '#0d0d0d', activity: '#000000', title: '#d3112d', secondary: '#ffffff', fg: '#e9e6e6', primary: '#d3112d', accent: '#ff5c6c', statusBg: '#f4f4f4', statusFg: '#0d0d0d',
    brackets: ['#ff5c6c', '#ffffff', '#ff9aa4', '#bdbdbd', '#e23a4c', '#8f8f8f'] },
  { slug: 'santos', bgColor: '#f3ead8', swatch: '⬛⬜', titles: { brasileirao: [1961, 1962, 1963, 1964, 1965, 1968, 2002, 2004], copaDoBrasil: [2010], libertadores: [1962, 1963, 2011] }, label: 'Santos', side: '#1b1814', bg: '#0e0d0c', activity: '#000000', title: '#000000', fg: '#ece6da', primary: '#f3ead8', accent: '#f6eedc', statusBg: '#e8dfcc', statusFg: '#0e0d0c',
    brackets: ['#f6eedc', '#cfc6b3', '#9a927f', '#f6eedc', '#cfc6b3', '#9a927f'] },
  { slug: 'cruzeiro', swatch: '🟦⬜', titles: { brasileirao: [1966, 2003, 2013, 2014], copaDoBrasil: [1993, 1996, 2000, 2003, 2017, 2018], libertadores: [1976, 1997] }, label: 'Cruzeiro', bg: '#0b1536', chrome: '#0a2a85', fg: '#e3e9f6', primary: '#1d4fc4', accent: '#7aa2ff', statusBg: '#0f3fa8', statusFg: '#ffffff',
    brackets: ['#7aa2ff', '#ffffff', '#a9c1ff', '#bdbdbd', '#4f7be8', '#8f8f8f'] },
  { slug: 'atletico-mg', bgColor: '#dcdcdc', swatch: '⬛⬜', titles: { brasileirao: [1937, 1971, 2021], copaDoBrasil: [2014, 2021], libertadores: [2013] }, label: 'Atlético-MG', side: '#1a1a1a', bg: '#111111', activity: '#dcdcdc', title: '#000000', fg: '#ececec', primary: '#d0d0d0', accent: '#f5f5f5', statusBg: '#000000', statusFg: '#ffffff', statusBorder: '#dcdcdc',
    brackets: ['#f5f5f5', '#d0d0d0', '#9d9d9d', '#f5f5f5', '#d0d0d0', '#9d9d9d'] },
  { slug: 'gremio', swatch: '🟦⬛⬜', titles: { brasileirao: [1981, 1996], copaDoBrasil: [1989, 1994, 1997, 2001, 2016], libertadores: [1983, 1995, 2017] }, label: 'Grêmio', bg: '#07131f', chrome: '#0a4d7c', fg: '#e2ecf4', primary: '#0b76b0', accent: '#4db8f5', statusBg: '#0a6aa3', statusFg: '#ffffff',
    brackets: ['#4db8f5', '#ffffff', '#9bd8fa', '#bdbdbd', '#1e98dd', '#8f8f8f'] },
  { slug: 'internacional', swatch: '🟥⬜', titles: { brasileirao: [1975, 1976, 1979], copaDoBrasil: [1992], libertadores: [2006, 2010] }, label: 'Internacional', side: '#2e0d11', bg: '#1b0a0c', chrome: '#6a0f15', fg: '#efe6e6', primary: '#d4161c', accent: '#ff5d5d', statusBg: '#b8121a', statusFg: '#ffffff',
    brackets: ['#ff5d5d', '#ffffff', '#ff9a9a', '#bdbdbd', '#e43a3a', '#8f8f8f'] }
];
