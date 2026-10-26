"""Vetoriza escudos simples (poucas cores chapadas) em SVG, para o fundo do editor ficar nítido em qualquer tamanho.

Usado por baixar_escudos_retro.py nas entradas com "vetorizar" em src/escudos-retro.json:
  "vetorizar": "monocromo"  um desenho de uma cor sobre fundo branco (JPG ou PNG); o JSON traz a cor em "cor".
  "vetorizar": "cores"      um escudo de poucas cores chapadas com fundo transparente: preto, vermelho e branco.
  "vetorizarAuto": true     como "vetorizarPaleta", mas a paleta é descoberta na própria imagem (cores mais frequentes).
  "vetorizarPaleta": [...]  escudo de poucas cores chapadas e fundo transparente, com a lista de cores em hex (a primeira é a da silhueta e das letras).
Método: separa cada cor numa máscara, amplia 4x com suavização (some o serrilhado) e traça os contornos com potrace.
Precisa de numpy, scipy, Pillow e potracer (import potrace).
"""
import numpy as np
import potrace
from PIL import Image
from scipy import ndimage

ESCALA = 4


def _caminho(mascara, turdsize):
    """Contornos de uma máscara booleana como atributo `d` de um <path> SVG (coordenadas na escala ampliada)."""
    # O potrace trata o que é False como figura; por isso a máscara entra invertida.
    try:
        plist = potrace.Bitmap(~mascara).trace(turdsize=turdsize, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.3)
    except ValueError:
        # um caminho degenerado (minúsculo) quebra a otimização de curvas do potrace; sem ela o traçado sai igual, só com mais pontos
        plist = potrace.Bitmap(~mascara).trace(turdsize=turdsize, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=False)
    partes = []
    for curva in plist:
        p = curva.start_point
        partes.append(f"M{p.x:.1f},{p.y:.1f}")
        for seg in curva.segments:
            if seg.is_corner:
                partes.append(f"L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}")
            else:
                partes.append(f"C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} {seg.end_point.x:.1f},{seg.end_point.y:.1f}")
        partes.append("z")
    return "".join(partes)


def _escala(altura, largura):
    """Imagens pequenas são ampliadas 4x antes de traçar; as grandes (silhuetas de 1000 px ou mais) quase não precisam, e 4x pesaria demais."""
    maior = max(altura, largura)
    return ESCALA if maior < 700 else 2 if maior < 1400 else 1


def _suavizar(cobertura, escala=ESCALA):
    """cobertura: matriz 0..1 (quanto cada pixel pertence à forma). Amplia e suaviza, devolve a máscara booleana."""
    grande = ndimage.zoom(cobertura.astype(float), escala, order=3) if escala > 1 else cobertura.astype(float)
    grande = ndimage.gaussian_filter(grande, escala * 0.35)
    return grande > 0.5


def _caixa(mascara):
    linhas, colunas = np.where(mascara)
    return linhas.min(), linhas.max() + 1, colunas.min(), colunas.max() + 1


def _svg(largura, altura, camadas):
    corpo = "".join(f'<path fill="{cor}" fill-rule="evenodd" d="{d}"/>' for cor, d in camadas)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {largura} {altura}">{corpo}</svg>\n'


def monocromo_para_svg(origem, destino, cor=None):
    """Desenho de uma cor sobre fundo branco: a intensidade da cor vem de quanto o pixel escurece o canal verde."""
    rgb = np.array(Image.open(origem).convert("RGB")).astype(float)
    verde_da_cor = np.median(rgb[..., 1][rgb[..., 1] < 140]) if (rgb[..., 1] < 140).any() else 0
    if not cor:  # sem cor no JSON: a mediana dos pixels da figura
        mediana = [int(np.median(rgb[..., i][rgb[..., 1] < 140])) for i in range(3)]
        cor = "#%02x%02x%02x" % tuple(mediana)
    cobertura = np.clip((255 - rgb[..., 1]) / max(1.0, 255 - verde_da_cor), 0, 1)
    l0, l1, c0, c1 = _caixa(cobertura > 0.5)
    cobertura = cobertura[l0:l1, c0:c1]
    mascara = _suavizar(cobertura)
    h, w = mascara.shape
    open(destino, "w", encoding="utf8").write(_svg(w, h, [(cor, _caminho(mascara, 30))]))
    return w / h


def cores_para_svg(origem, destino):
    """Escudo de preto, vermelho e branco com fundo transparente: três camadas empilhadas (preto de base, vermelho e branco por cima).
    Cada cor vira uma cobertura suave (0 a 1) em vez de uma classificação pixel a pixel, o que evita bordas onduladas onde as cores se encontram."""
    rgba = np.array(Image.open(origem).convert("RGBA")).astype(float)
    l0, l1, c0, c1 = _caixa(rgba[..., 3] > 128)
    rgba = rgba[l0:l1, c0:c1]
    r, g, b, a = (rgba[..., i] for i in range(4))
    alfa = a / 255.0
    miolo = (a > 250) & (r > 140) & (g < 120) & (b < 120)
    vermelho_rgb = [float(np.median(rgba[..., i][miolo])) for i in range(3)]
    contraste_vermelho = max(1.0, vermelho_rgb[0] - max(vermelho_rgb[1], vermelho_rgb[2]))
    # branco: o menor canal sobe de ~35 (preto ou vermelho) até 255 (branco); vermelho: R acima do maior entre G e B
    branco = np.clip((np.minimum(np.minimum(r, g), b) - 35) / 220.0, 0, 1) * alfa
    vermelho = np.clip((r - np.maximum(g, b)) / contraste_vermelho, 0, 1) * alfa
    mascara_branco = _suavizar(branco)
    mascara_vermelho = _suavizar(vermelho)
    # o vermelho se estende por baixo do branco que o toca, para não aparecer uma linha preta entre as duas cores
    mascara_vermelho |= mascara_branco & ndimage.binary_dilation(mascara_vermelho, iterations=ESCALA * 2)
    camadas = [
        ("#231f20", _caminho(_suavizar(alfa), 40)),
        ("#%02x%02x%02x" % tuple(int(round(v)) for v in vermelho_rgb), _caminho(mascara_vermelho, 40)),
        ("#ffffff", _caminho(mascara_branco, 40)),
    ]
    h, w = alfa.shape
    open(destino, "w", encoding="utf8").write(_svg(w * ESCALA, h * ESCALA, camadas))
    return w / h


def paleta_para_svg(origem, destino, cores_hex):
    """Escudo de poucas cores chapadas (PNG com fundo transparente): cada pixel vai para a cor mais próxima da paleta e cada cor vira uma camada.
    A silhueta inteira é pintada com a primeira cor, depois as outras, e a primeira de novo por cima (as letras ficam na cor da borda)."""
    rgba = np.array(Image.open(origem).convert("RGBA")).astype(float)
    l0, l1, c0, c1 = _caixa(rgba[..., 3] > 128)
    rgba = rgba[l0:l1, c0:c1]
    alfa = rgba[..., 3] / 255.0
    paleta = np.array([[int(h[i:i + 2], 16) for i in (1, 3, 5)] for h in cores_hex], dtype=float)
    distancia = np.stack([np.abs(rgba[..., :3] - cor).sum(axis=2) for cor in paleta])
    classe = distancia.argmin(axis=0)
    h, w = alfa.shape
    camadas = [(cores_hex[0], _caminho(_suavizar(alfa), 40))]
    ordem = list(range(1, len(cores_hex))) + [0]
    for i in ordem:
        camadas.append((cores_hex[i], _caminho(_suavizar(((classe == i) * alfa).astype(float)), 40)))
    open(destino, "w", encoding="utf8").write(_svg(w * ESCALA, h * ESCALA, camadas))
    return w / h


def _distancia_ao_segmento(c, a, b):
    ab = b - a
    t = np.clip(np.dot(c - a, ab) / max(1.0, np.dot(ab, ab)), 0, 1)
    return np.abs(c - (a + t * ab)).sum()


def _paleta_da_imagem(rgb, alfa, maximo=9, minimo_pct=0.0006, distancia_min=70, tolerancia_mistura=80):
    """Cores chapadas de um PNG: as cores exatas mais frequentes. Ficam de fora as parecidas demais com uma já escolhida e as que são só a mistura
    de duas cores mais frequentes (o antisserrilhado faz um tom rosa entre o vermelho e o branco, por exemplo); cor pequena mas própria, como o
    dourado do "P" do Palmeiras, entra."""
    pixels = rgb[alfa > 250].astype(int)
    chaves, contagens = np.unique(pixels, axis=0, return_counts=True)
    ordem = np.argsort(-contagens)
    total = contagens.sum()
    escolhidas = []
    for i in ordem:
        c = chaves[i].astype(float)
        # cor muito saturada pode ser pequena (a cruz vermelha do Vasco de 1903 tem 0,05% dos pixels) e ainda assim ser própria do desenho
        saturada = c.max() - c.min() > 110
        if contagens[i] / total < (0.00015 if saturada else minimo_pct):
            if contagens[i] / total < 0.00015:
                break
            continue
        if len(escolhidas) >= maximo:
            break
        if any(np.abs(c - e).sum() < distancia_min for e in escolhidas):
            continue
        if any(_distancia_ao_segmento(c, a, b) < tolerancia_mistura for k, a in enumerate(escolhidas) for b in escolhidas[k + 1:]):
            continue
        escolhidas.append(c)
    return np.array(escolhidas, dtype=float)


def _sem_poeira(alfa, fracao=0.02):
    """Tira do canal alfa as manchas soltas (restos do fundo apagado) menores que `fracao` do maior pedaço do escudo."""
    rotulos, n = ndimage.label(alfa > 0.5)
    if n < 2:
        return alfa
    areas = ndimage.sum(np.ones_like(alfa), rotulos, range(1, n + 1))
    manter = [i + 1 for i, a in enumerate(areas) if a >= areas.max() * fracao]
    return alfa * np.isin(rotulos, manter)


def auto_para_svg(origem, destino, suavidade=None, **paleta):
    """Escudo de poucas cores chapadas em PNG: acha a paleta na imagem, dá a cada pixel a cor mais próxima e traça uma camada por cor.
    As camadas são empilhadas da cor mais frequente para a menos frequente, e cada camada cobre a sua cor E todas as que vêm depois dela:
    assim não sobra fresta entre duas cores vizinhas, e a borda entre elas é a da camada de cima.
    `suavidade` (em pixels da imagem original) borra de leve cada máscara antes de ampliar: tira o serrilhado de PNG pequenos.
    Sem valor, ela cresce quanto menor é a imagem (0,6 px acima de 300 px de largura, até 1,2 px em imagens de 140 px)."""
    rgba = np.array(Image.open(origem).convert("RGBA")).astype(float)
    rgba[..., 3] = _sem_poeira(rgba[..., 3] / 255.0) * 255.0
    l0, l1, c0, c1 = _caixa(rgba[..., 3] > 128)
    rgba = rgba[l0:l1, c0:c1]
    alfa = rgba[..., 3] / 255.0
    rgb = rgba[..., :3]
    fixas = paleta.pop("cores_fixas", None)
    cores = np.array([[int(h[i:i + 2], 16) for i in (1, 3, 5)] for h in fixas], dtype=float) if fixas else _paleta_da_imagem(rgb, rgba[..., 3], **paleta)
    distancia = np.stack([np.abs(rgb - cor).sum(axis=2) for cor in cores])
    classe = distancia.argmin(axis=0)
    areas = [int(((classe == i) & (alfa > 0.5)).sum()) for i in range(len(cores))]
    ordem = list(np.argsort(areas)[::-1])  # da maior área para a menor
    # A camada de base cobre a silhueta inteira; ela precisa ter a cor do contorno externo. Com outra cor (o branco do miolo, num escudo de contorno
    # preto), a máscara escura ficava um pouco menor que a silhueta e sobrava um filete claro do lado de fora.
    dentro = alfa > 0.5
    anel = dentro & (ndimage.distance_transform_edt(np.pad(dentro, 1))[1:-1, 1:-1] <= 3)
    if anel.any():
        da_borda = int(np.bincount(classe[anel], minlength=len(cores)).argmax())
        ordem = [da_borda] + [i for i in ordem if i != da_borda]
    h, w = alfa.shape
    if suavidade is None:
        suavidade = float(np.clip(0.6 + (300 - w) / 250.0, 0.6, 1.2))
    escala = _escala(h, w)
    camadas = []
    for posicao, i in enumerate(ordem):
        restantes = np.isin(classe, ordem[posicao:])
        cobertura = ndimage.gaussian_filter((restantes * alfa).astype(float), suavidade)
        cor = "#%02x%02x%02x" % tuple(int(round(v)) for v in cores[i])
        camadas.append((cor, _caminho(_suavizar(cobertura, escala), 40)))
    open(destino, "w", encoding="utf8").write(_svg(w * escala, h * escala, camadas))
    return w / h


def duas_tintas_para_svg(origem, destino, tinta="#000000", papel="#ffffff"):
    """Escudo de duas tintas (tinta escura sobre papel claro, com o fundo externo branco): traça pela cobertura em tons de cinza, não por pixel
    preto ou branco. O antisserrilhado da imagem dá a posição da borda com precisão de subpixel, e o contorno sai liso e fiel ao original
    (a classificação pixel a pixel deixava as bordas serrilhadas). Duas camadas: a silhueta inteira na tinta e o papel interno por cima."""
    cinza = np.array(Image.open(origem).convert("L")).astype(float)
    escuro = float(np.median(cinza[cinza < 100])) if (cinza < 100).any() else 0.0
    cobertura = np.clip((255.0 - cinza) / max(1.0, 255.0 - escuro), 0, 1)
    rotulos, _ = ndimage.label(cobertura < 0.15)
    borda = set(np.unique(np.concatenate([rotulos[0], rotulos[-1], rotulos[:, 0], rotulos[:, -1]]))) - {0}
    preenchido = ~np.isin(rotulos, list(borda))
    miolo = ndimage.binary_erosion(preenchido, iterations=2)
    silhueta = np.where(miolo, 1.0, cobertura * preenchido)
    interno = ndimage.binary_erosion(preenchido, iterations=3)
    papel_suave = (1.0 - cobertura) * interno
    l0, l1, c0, c1 = _caixa(silhueta > 0.5)
    silhueta, papel_suave = silhueta[l0:l1, c0:c1], papel_suave[l0:l1, c0:c1]
    h, w = silhueta.shape
    escala = _escala(h, w)

    def mascara(m):
        grande = ndimage.zoom(m, escala, order=3)
        return ndimage.gaussian_filter(grande, escala * 0.25) > 0.5

    camadas = [(tinta, _caminho(mascara(silhueta), 40)), (papel, _caminho(mascara(papel_suave), 40))]
    open(destino, "w", encoding="utf8").write(_svg(w * escala, h * escala, camadas))
    return w / h


def _pesos_das_cores(rgb, cores):
    """Participação (0 a 1) de cada cor da paleta em cada pixel. Num pixel de borda, mistura de duas cores vizinhas, a participação vem da projeção do
    pixel no segmento entre as duas cores mais próximas: assim a posição da borda sai com precisão de subpixel, não pixel a pixel."""
    k = len(cores)
    d = np.stack([np.sqrt(((rgb - c) ** 2).sum(axis=2)) for c in cores])
    ordem = np.argsort(d, axis=0)
    i, j = ordem[0], ordem[1]
    pi, pj = cores[i], cores[j]
    seg = pi - pj
    s = np.clip(((rgb - pj) * seg).sum(axis=2) / np.maximum(1e-6, (seg * seg).sum(axis=2)), 0, 1)
    pesos = np.zeros((k,) + i.shape)
    np.put_along_axis(pesos, i[None], s[None], axis=0)
    np.put_along_axis(pesos, j[None], (1 - s)[None], axis=0)
    return pesos


def _pesos_pelo_segmento(rgb, cores):
    """Participação (0 a 1) de cada cor da paleta em cada pixel. Um pixel de borda é uma mistura de duas cores vizinhas: acha-se o par de cores cujo
    segmento passa mais perto do pixel, e a participação vem da projeção nesse segmento. Assim a borda sai com precisão de subpixel, e o tom
    avermelhado que o JPEG deixa na transição entre preto e branco não vira um pouco de vermelho (o par preto-branco é o que passa mais perto)."""
    k = len(cores)
    melhor = np.full(rgb.shape[:2], np.inf)
    pesos = np.zeros((k,) + rgb.shape[:2])
    for a in range(k):
        for b in range(a + 1, k):
            seg = cores[a] - cores[b]
            t = np.clip(((rgb - cores[b]) * seg).sum(axis=2) / max(1e-6, float((seg * seg).sum())), 0, 1)
            proj = cores[b] + t[..., None] * seg
            dist = np.sqrt(((rgb - proj) ** 2).sum(axis=2))
            melhor_aqui = dist < melhor - 1e-9
            melhor = np.where(melhor_aqui, dist, melhor)
            pesos[a] = np.where(melhor_aqui, t, pesos[a])
            pesos[b] = np.where(melhor_aqui, 1 - t, pesos[b])
            # limpa as outras cores dos pixels que mudaram de par
            for c in range(k):
                if c not in (a, b):
                    pesos[c] = np.where(melhor_aqui, 0.0, pesos[c])
    return pesos


def suave_para_svg(origem, destino, cores_hex, papel="#ffffff", silhueta="borda", suavidade=None, vazar_furos=None, aro=None, refinar=False, usar_alpha=False, vao_min=30, preencher=True):
    """Escudo de poucas cores chapadas sobre papel branco, traçado pela participação suave de cada cor (ver _pesos_das_cores): contornos lisos e fiéis
    ao original, sem o serrilhado de classificar pixel a pixel. `papel` é a cor do fundo externo; `silhueta`: "borda" (o papel ligado à borda da imagem é
    fundo; serve quando o escudo tem contorno que o separa do papel) ou "linha" (o escudo é o trecho entre o primeiro e o último pixel que não é papel,
    em cada linha; serve para escudos sem contorno, cujo branco interno encosta no fundo)."""
    if usar_alpha:
        # imagem com fundo transparente: o que é transparente é o exterior (a cor por baixo dos pixels transparentes não vale), assentado sobre branco
        rgba = np.array(Image.open(origem).convert("RGBA")).astype(float)
        alfa_img = rgba[..., 3] / 255.0
        rgb = rgba[..., :3] * alfa_img[..., None] + 255.0 * (1 - alfa_img[..., None])
    else:
        rgb = np.array(Image.open(origem).convert("RGB")).astype(float)
    cores = np.array([[int(h[i:i + 2], 16) for i in (1, 3, 5)] for h in list(cores_hex) + [papel]], dtype=float)
    # refinar: par de cores pelo segmento mais próximo (o JPEG deixa um tom avermelhado entre preto e branco) e camadas de baixo só dentro da silhueta
    pesos = (_pesos_pelo_segmento if refinar else _pesos_das_cores)(rgb, cores)
    k = len(cores) - 1                       # a última é o papel
    cobertura = np.clip(1.0 - pesos[k], 0, 1)
    if silhueta == "linha":
        tinta = cobertura > 0.5
        cheio = np.zeros_like(tinta)
        for y in range(tinta.shape[0]):
            xs = np.where(tinta[y])[0]
            if len(xs):
                cheio[y, xs.min():xs.max() + 1] = True
        # linhas de papel puro (a faixa branca que vai de lado a lado) ficam sem desenho e recuam a silhueta: fecha essas frestas
        cheio = ndimage.binary_closing(np.pad(cheio, 12), structure=np.ones((13, 1)))[12:-12, 12:-12]
    else:
        rotulos, _ = ndimage.label(pesos[k] > 0.85)
        borda = set(np.unique(np.concatenate([rotulos[0], rotulos[-1], rotulos[:, 0], rotulos[:, -1]]))) - {0}
        cheio = ~np.isin(rotulos, list(borda))
    if vazar_furos:
        # Vãos de papel cercados em boa parte por uma das cores de `vazar_furos` (o buraco do anel da âncora, os vãos entre a âncora e os remos) são fundo,
        # não branco do desenho. Com `aro` (cor do aro da boia), só valem os vãos que ficam FORA do círculo do aro: o disco branco do mapa do Brasil,
        # num quadro vermelho dentro do aro, também é cercado de vermelho, mas é desenho.
        alvo = {i for i, h in enumerate(cores_hex) if h.lower() in {x.lower() for x in vazar_furos}}
        centro, raio = None, None
        if aro:
            idx = [h.lower() for h in cores_hex].index(aro.lower())
            tinta_aro = np.argmax(pesos[:k], axis=0) == idx
            tinta_aro &= pesos[idx] > 0.5
            rot_a, n_a = ndimage.label(tinta_aro)
            maior_a = 1 + int(np.argmax(ndimage.sum(tinta_aro, rot_a, range(1, n_a + 1))))
            ya, xa = np.where(rot_a == maior_a)
            centro = ((ya.min() + ya.max()) / 2, (xa.min() + xa.max()) / 2)
            raio = max(ya.max() - ya.min(), xa.max() - xa.min()) / 2
        rot, n = ndimage.label(pesos[k] > 0.85)
        for j in range(1, n + 1):
            vao = rot == j
            if (vao & ~cheio).any() or vao.sum() < vao_min:
                continue
            anel = ndimage.binary_dilation(vao, iterations=2) & ~vao
            soma = [float(pesos[c][anel].sum()) for c in range(k)]
            dono = int(np.argmax(soma))
            if dono not in alvo or soma[dono] < (0.5 if aro else 0.9) * sum(soma):
                continue
            if aro:
                cy, cx = ndimage.center_of_mass(vao)
                if np.hypot(cy - centro[0], cx - centro[1]) < raio:
                    continue
            cheio = cheio & ~ndimage.binary_dilation(vao, iterations=1)
    if usar_alpha:
        # preencher=False: os buracos transparentes da imagem (o aro da âncora, por exemplo) continuam transparentes
        cheio = ndimage.binary_fill_holes(alfa_img >= 0.5) if preencher else (alfa_img >= 0.5)
        cobertura = alfa_img
    miolo = ndimage.binary_erosion(cheio, iterations=3)
    alfa = np.where(miolo, 1.0, cobertura * ndimage.binary_dilation(cheio, iterations=1))
    # o papel branco DENTRO do escudo (monograma) é cor de desenho, não fundo: conta como a última cor da paleta de desenho
    paleta = [i for i in range(k)] + [k]
    pesos_d = pesos.copy()
    l0, l1, c0, c1 = _caixa(alfa > 0.5)
    pesos_d, alfa = pesos_d[:, l0:l1, c0:c1], alfa[l0:l1, c0:c1]
    h, w = alfa.shape
    escala = _escala(h, w)
    areas = [float((pesos_d[i] * (alfa > 0.5)).sum()) for i in paleta]
    ordem = [paleta[i] for i in np.argsort(areas)[::-1]]
    rim = (alfa > 0.5) & ~ndimage.binary_erosion(alfa > 0.5, iterations=3)
    if rim.any():
        da_borda = int(np.argmax([float((pesos_d[i] * rim).sum()) for i in paleta]))
        ordem = [da_borda] + [i for i in ordem if i != da_borda]
    camadas = []
    interior = ndimage.binary_erosion(_suavizar(alfa, escala), iterations=max(2, escala)) if refinar else None
    for pos, i in enumerate(ordem):
        resto = sum(pesos_d[m] for m in ordem[pos:]) * alfa
        if suavidade:
            resto = ndimage.gaussian_filter(resto, suavidade)
        mascara = _suavizar(resto, escala)
        if refinar and pos < len(ordem) - 1:
            # As camadas de baixo (a base e as que cobrem "a cor e todas as seguintes") coincidem com as de cima na borda externa, e o navegador deixa a cor
            # delas aparecer como um filete fino. Por isso ficam só DENTRO da silhueta, meio pixel recuadas; as fronteiras internas continuam exatas.
            mascara = mascara & interior
        cor = "#%02x%02x%02x" % tuple(int(round(c)) for c in cores[i])
        camadas.append((cor, _caminho(mascara, 40)))
    if refinar and len(ordem) > 1:
        # a cor da base é repintada por cima, só onde ela é desenho, para as bordas externas dela não ficarem recuadas
        propria = pesos_d[ordem[0]] * alfa
        if suavidade:
            propria = ndimage.gaussian_filter(propria, suavidade)
        camadas.append(("#%02x%02x%02x" % tuple(int(round(c)) for c in cores[ordem[0]]), _caminho(_suavizar(propria, escala), 40)))
    open(destino, "w", encoding="utf8").write(_svg(w * escala, h * escala, camadas))
    return w / h


def silhueta_para_svg(origem, destino, cor="#ffffff"):
    """Silhueta de uma cor (PNG com fundo transparente, como os fundos dos times novos): o contorno vira vetor."""
    # sem _sem_poeira: numa silhueta as manchas pequenas são detalhes (manchas e olhos da onça do Amazonas), não restos de fundo
    alfa = np.array(Image.open(origem).convert("RGBA").split()[3]).astype(float) / 255.0
    l0, l1, c0, c1 = _caixa(alfa > 0.5)
    alfa = alfa[l0:l1, c0:c1]
    h, w = alfa.shape
    escala = _escala(h, w)
    open(destino, "w", encoding="utf8").write(_svg(w * escala, h * escala, [(cor, _caminho(_suavizar(alfa, escala), 30))]))
    return w / h


def alfa_cores_para_svg(origem, destino, cores_hex, sobrepor=0):
    """PNG com fundo transparente e poucas cores chapadas, em que a transparência também faz parte do desenho (as frestas finas das letras do CAP do Athletico).
    A cobertura vem do canal alfa, então as frestas continuam vazadas; a cor de cada pixel é a mais próxima da lista. A primeira cor cobre toda a silhueta
    e as demais vão por cima (sem fresta clara entre uma cor e outra)."""
    rgba = np.array(Image.open(origem).convert("RGBA")).astype(float)
    alfa = rgba[..., 3] / 255.0
    l0, l1, c0, c1 = _caixa(alfa > 0.5)
    rgba, alfa = rgba[l0:l1, c0:c1], alfa[l0:l1, c0:c1]
    h, w = alfa.shape
    escala = 6 if max(h, w) < 700 else 3  # frestas de 1 a 2 px do original pedem mais ampliação e menos suavização que o resto (cantos vivos das letras góticas)
    def mascara(cobertura):
        grande = ndimage.gaussian_filter(ndimage.zoom(cobertura.astype(float), escala, order=3), escala * 0.2)
        return grande > 0.5
    cores = np.array([[int(x[i:i + 2], 16) for i in (1, 3, 5)] for x in cores_hex], dtype=float)
    mais_proxima = np.argmin(((rgba[..., None, :3] - cores[None, None]) ** 2).sum(-1), axis=-1)
    if sobrepor:
        # sem camada de base: cada cor é alargada `sobrepor` pixels do original (só para dentro da silhueta), e as de cima cobrem as de baixo. Assim não
        # sobra filete da cor de baixo no contorno externo (o de um leão dourado sobre base escura) nem fresta entre uma cor e outra.
        silhueta = mascara(alfa)
        camadas = []
        for i in range(len(cores_hex)):
            m = mascara(alfa * (mais_proxima == i))
            m = ndimage.binary_dilation(m, iterations=max(1, round(sobrepor * escala))) & silhueta
            camadas.append((cores_hex[i], _caminho(m, 30)))
    else:
        camadas = [(cores_hex[0], _caminho(mascara(alfa), 30))]
        for i in range(1, len(cores_hex)):
            camadas.append((cores_hex[i], _caminho(mascara(alfa * (mais_proxima == i)), 30)))
    open(destino, "w", encoding="utf8").write(_svg(w * escala, h * escala, camadas))
    return w / h


def branco_para_alfa(origem, destino, minimo=18, faixa=40):
    """JPG ou PNG sobre fundo branco: o branco vira transparente (de forma gradual, para manter o antisserrilhado) e sai um PNG RGBA.
    A transparência é medida pelo canal mais escuro (as cores do escudo têm sempre um canal baixo; o branco puro, não)."""
    rgb = np.array(Image.open(origem).convert("RGB")).astype(float)
    alfa = np.clip((255 - rgb.min(axis=2) - minimo) / faixa, 0, 1)
    # cor sem a mistura com o branco do fundo: um pixel de borda meio transparente volta a ser a cor pura do desenho (sem isso, a borda de um
    # desenho dourado era traçada como vermelha ou escura, e aparecia um filete em volta)
    pura = np.clip(255 - (255 - rgb) / np.maximum(alfa, 0.05)[..., None], 0, 255)
    pura = np.where((alfa < 1)[..., None], pura, rgb)
    saida = np.dstack([pura, alfa * 255]).astype(np.uint8)
    Image.fromarray(saida, "RGBA").save(destino)


def alfa_cores_nitido(origem, destino, cores_hex, sobrepor=1, escala=6, suavidade=1.2, minimo=30):
    """Como alfa_cores_para_svg, para imagens pequenas com contorno fino escuro (o leão do Sport, de 429 px): a imagem é ampliada com Lanczos ANTES de decidir
    a cor de cada ponto, então o traço de 1 a 2 px do contorno sai contínuo e liso (decidir a cor no tamanho original e só então ampliar deixava o contorno
    pontilhado). As camadas vão na ordem da paleta, de baixo para cima; todas menos a última são alargadas `sobrepor` px (do original) para
    não deixar fresta entre as cores, e a última (o contorno escuro, que vai por cima) fica como está."""
    img = Image.open(origem).convert("RGBA")
    w0, h0 = img.size
    grande = img.convert("RGBa").resize((w0 * escala, h0 * escala), Image.LANCZOS).convert("RGBA")
    rgba = np.array(grande).astype(float)
    alfa = rgba[..., 3] / 255.0
    caixa = np.where(alfa > 0.5)
    l0, l1, c0, c1 = caixa[0].min(), caixa[0].max() + 1, caixa[1].min(), caixa[1].max() + 1
    rgba, alfa = rgba[l0:l1, c0:c1], alfa[l0:l1, c0:c1]
    h, w = alfa.shape
    cores = np.array([[int(x[i:i + 2], 16) for i in (1, 3, 5)] for x in cores_hex], dtype=float)
    mais_proxima = np.argmin(((rgba[..., None, :3] - cores[None, None]) ** 2).sum(-1), axis=-1)
    suave = lambda m: ndimage.gaussian_filter(m.astype(float), suavidade) > 0.5
    silhueta = suave(alfa > 0.5)
    # as camadas alargadas ficam um pouco para dentro da silhueta: nos pontos em que o contorno escuro é fino, o dourado alargado não aparece do lado de fora dele
    interior = ndimage.binary_erosion(silhueta, iterations=max(2, escala))
    camadas = []
    for i in range(len(cores_hex)):
        m = suave((mais_proxima == i) & (alfa > 0.5))
        if i < len(cores_hex) - 1:
            m = ndimage.binary_dilation(m, iterations=max(1, round(sobrepor * escala))) & interior
        camadas.append((cores_hex[i], _caminho(m, minimo)))
    open(destino, "w", encoding="utf8").write(_svg(w, h, camadas))
    return w / h


def sombreado_para_svg(origem, destino, base="#3c3735", vermelho="#e6090b", niveis=12, sigma=1.4, escala=5, limites=(70, 235), alisar=0.0, minimo=60, tracos=0, tracos_alisar=0.8,
                       detalhes=(), detalhe_sigma=0.8, detalhe_alisar=0.8, detalhe_tracos=0, retoques=()):
    """Escudo com sombreado de metal (cinzas e bege) mais um vermelho chapado, como o primeiro escudo do Vitória (PNG com fundo transparente).
    Em vez de reduzir a poucas cores (que dava blocos), a luminosidade suavizada vira `niveis` camadas empilhadas, cada uma com a cor média da sua faixa:
    os contornos são curvas de nível lisas, e o sombreado, o texto e a corda ficam nítidos em qualquer tamanho. O que está abaixo do primeiro limite
    (contornos, bandeira preta) fica na cor `base`; o vermelho (R muito acima de G e B) entra por cima. `alisar` suaviza de novo cada camada e `tracos` liga uma
    camada de traços finos escuros (letras, corda). `detalhes`: caixas (x0, y0, x1, y1), em pixels da imagem original, onde as peças pequenas e curvas (a argola
    da âncora, a ponta do mastro) pedem menos alisamento (`detalhe_sigma`, `detalhe_alisar`) e, se quiser, um limiar de traços próprio (`detalhe_tracos`).
    `retoques`: lista de {"caixa": [x0, y0, x1, y1], "svg": "..."} para o que o traçado automático não resolve bem (a argola da âncora): a caixa é apagada de todas as
    camadas e o SVG (com coordenadas em pixels da imagem original) é desenhado no lugar, por cima. Precisa de opencv (cv2)."""
    import cv2
    im = cv2.imdecode(np.fromfile(origem, dtype=np.uint8), cv2.IMREAD_UNCHANGED)
    rgb, alfa = im[..., 2::-1].astype(np.float32), im[..., 3].astype(np.float32) / 255.0
    grande = np.clip(cv2.resize(rgb, None, fx=escala, fy=escala, interpolation=cv2.INTER_CUBIC), 0, 255)
    ab = cv2.resize(alfa, None, fx=escala, fy=escala, interpolation=cv2.INTER_CUBIC)
    sil0 = cv2.GaussianBlur((ab > 0.5).astype(np.float32), (0, 0), 2.0) > 0.5
    R, G, B = grande[..., 0], grande[..., 1], grande[..., 2]
    cinza = 0.299 * R + 0.587 * G + 0.114 * B
    lum = cv2.GaussianBlur(cinza, (0, 0), sigma)
    vermelho_bruto = (R - np.maximum(G, B)) > 70
    verm0 = (cv2.GaussianBlur(vermelho_bruto.astype(np.float32), (0, 0), sigma) > 0.5) & sil0
    metal = sil0 & ~verm0
    cor = lambda m: "#%02x%02x%02x" % tuple(int(round(x)) for x in grande[m].mean(axis=0))
    liso = lambda m, a: ndimage.gaussian_filter(m.astype(np.float32), a) > 0.5 if a else m
    # regiões de detalhe (mais fiéis): onde valem, usam menos alisamento
    det = np.zeros(sil0.shape, bool)
    for x0, y0, x1, y1 in detalhes:
        det[int(y0 * escala):int(y1 * escala), int(x0 * escala):int(x1 * escala)] = True
    lum_d = cv2.GaussianBlur(cinza, (0, 0), detalhe_sigma)
    sil = np.where(det, liso(sil0, detalhe_alisar), liso(sil0, alisar))
    verm = np.where(det, liso(verm0, detalhe_alisar), liso(verm0, alisar))
    apagar = np.zeros(sil0.shape, bool)
    yy, xx = np.mgrid[0:sil0.shape[0], 0:sil0.shape[1]]
    for r in retoques:
        # "caixa": retângulo; "elipses": lista de [cx, cy, rx, ry] (pixels da imagem original), para não apagar o que está em volta de uma peça redonda
        if r.get("caixa"):
            x0, y0, x1, y1 = r["caixa"]
            apagar[int(y0 * escala):int(y1 * escala), int(x0 * escala):int(x1 * escala)] = True
        for cx, cy, rx, ry in r.get("elipses", ()):
            apagar |= ((xx / escala - cx) / rx) ** 2 + ((yy / escala - cy) / ry) ** 2 <= 1
    sil_total = sil
    sil = sil & ~apagar
    verm = verm & ~apagar
    lim = np.linspace(limites[0], limites[1], niveis)
    camadas = [(base, _caminho(sil, minimo))]
    for i, t in enumerate(lim):
        m_g = liso(ndimage.binary_opening(((lum > t) & metal), iterations=1), alisar)
        m_d = liso(ndimage.binary_opening(((lum_d > t) & metal), iterations=1), detalhe_alisar)
        m = np.where(det, m_d, m_g) & sil
        if m.sum() < 500:
            continue
        faixa = (lum > t) & (lum <= (lim[i + 1] if i + 1 < len(lim) else 300)) & metal
        camadas.append((cor(faixa if faixa.sum() > 200 else m), _caminho(m, minimo)))
    if tracos:
        # traços finos escuros (letras, fios da corda, contornos internos): o "chapéu preto" da luminosidade (fechamento menos a imagem) mostra o que é mais
        # escuro que a vizinhança; vão por cima dos tons, na cor da base, com pouco alisamento para não perder o texto
        lum_fina = cv2.GaussianBlur(cinza, (0, 0), 0.8)
        nucleo = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * escala * 3 + 1, 2 * escala * 3 + 1))
        escuro = cv2.morphologyEx(lum_fina, cv2.MORPH_CLOSE, nucleo) - lum_fina
        limiar = np.where(det, detalhe_tracos or tracos, tracos)
        tr = (escuro > limiar) & metal & (lum_fina < limites[1])
        camadas.append((base, _caminho(liso(tr, tracos_alisar) & sil, 20)))
    camadas.append((vermelho, _caminho(verm, minimo)))
    h, w = sil.shape
    ys, xs = np.where(sil_total | apagar)
    svg = _svg(w, h, camadas).replace(f'viewBox="0 0 {w} {h}"', f'viewBox="{xs.min()} {ys.min()} {xs.max() - xs.min() + 1} {ys.max() - ys.min() + 1}"')
    if retoques:
        extra = "".join(r["svg"] for r in retoques)
        svg = svg.replace("</svg>", f'<g transform="scale({escala})">{extra}</g></svg>')
    open(destino, "w", encoding="utf8").write(svg)
    return (xs.max() - xs.min() + 1) / (ys.max() - ys.min() + 1)
