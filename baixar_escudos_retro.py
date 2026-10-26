"""Baixa os escudos antigos listados em src/escudos-retro.json da Wikimedia Commons para assets/escudos/retro/<slug>/<id>.<ext>.

Uso: python baixar_escudos_retro.py
- SVG e PNG são salvos como vieram. Entradas com "local" (arquivo fornecido pelo dono do projeto) vêm de assets/escudos/retro/<slug>/_originais/.
- PNG e SVG são recortados rente ao conteúdo (o PNG é cortado; o SVG tem o viewBox ajustado): o fundo é exibido com a mesma altura
  total para todos os escudos (80% da janela), e margem vazia faria o escudo parecer menor que os outros.
- PNG com mais de 800 px são reduzidos; cada PNG ganha também <id>.icon.png (64 px) para o ícone de pasta do tema de ícones.
- JPG, ou qualquer arquivo marcado com "semFundo" no JSON (PNG com fundo branco opaco), vira PNG com o fundo transparente, para o escudo não aparecer dentro de um retângulo claro no editor.
- Entradas com "vetorizarAuto" viram SVG com a paleta achada na imagem (true) ou com opções (objeto): as de fonte pequena ou ruidosa (Guarani 1981 e
  2007) e as de gravura ou textura (Vasco 1898, Sport 1905) usam cores_fixas e suavidade ajustadas à mão.
- "limiarFundo": N (padrão 215) em JPG e em "vetorizar": "auto": brilho mínimo (0 a 255) do que é fundo; baixar (ex.: 150) tira o filete cinza do antisserrilhado em volta do contorno escuro.
- Ao vetorizar PNG/JPG ("vetorizarAuto", "vetorizarPaleta", "vetorizar": "auto" ou "paleta"), o anel externo de 2 px é trocado pela cor sólida logo abaixo (estender_borda; "bordaPx": N muda a largura): tira o filete cinza do antisserrilhado fora do contorno escuro.
- "vetorizar" em arquivo local: "monocromo" (uma tinta, "cor"), "duas-tintas" (tinta escura sobre papel, traçado pelos tons de cinza), "suave" (poucas cores chapadas sobre papel branco, com "vetorizarPaleta" e "silhueta": "borda" ou "linha"; traça pela participação suave de cada cor; "vazarFuros": [cores] tira o branco dos vãos cercados por essas cores, como o buraco do anel da âncora; com "aroDe": cor, só os vãos fora do círculo desse aro; "vaoMinimo": N (padrão 30 px) é o menor vão de papel que "vazarFuros" considera; "preencher": false (com usarAlpha) mantém transparentes os buracos da imagem; "usarAlpha": true usa a transparência da imagem como exterior; "refinar": true escolhe o par de cores pelo segmento mais próximo e recua as camadas de baixo, tirando filetes nas bordas externas) e "auto" ou "paleta" (classificação pixel a pixel, para imagens pequenas ou sujas). "suavidade" suaviza mais o "auto".
- "vetorizar": "sombreado" (PNG transparente com sombreado de metal e vermelho: "base", "vermelho", "niveis" e "sigma"; ver sombreado_para_svg).
- "vetorizar": "alfa" (arquivo local PNG com fundo transparente; com "fundoBranco": true, JPG/PNG sobre branco, que vira transparente): traça pelo canal alfa e pela cor mais próxima de "vetorizarPaleta" (a primeira cor cobre toda a silhueta, as outras vão por cima; com "nitido": true amplia a imagem antes de classificar as cores (contornos finos, ver alfa_cores_nitido; "escala", "suavidade" e "minimo" ajustam a ampliação, o alisamento e o menor pedaço mantido); com "sobrepor": N não há camada de base e cada cor é alargada N px, de baixo para cima na ordem da paleta).
- Entradas com "fundoSolido": N (PNG opaco sobre uma cor só, ex.: os escudos do Fluminense) têm o fundo apagado; N é a tolerância de cor.
- Entradas com "copiarDe" e "atual": true são um segundo escudo ATUAL do time (cópia colorida de assets/escudos/<arquivo>), não um escudo antigo.
- Escreve assets/escudos/retro/CREDITS.txt com autor e licença de cada arquivo (vai junto no pacote, em icons/retro-CREDITS.txt).
"""
import io
import json
import os
import re
import shutil
import sys
import time
import urllib.parse
import urllib.request

import numpy as np
from PIL import Image
from scipy import ndimage

import vetorizar_escudo

ROOT = os.path.dirname(os.path.abspath(__file__))
UA = {"User-Agent": "brasileirao-theme/1.0 (nicolau.lucas04@gmail.com)"}
API = "https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800&iiextmetadatafilter=LicenseShortName|Artist&format=json&titles="


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()


def sem_fundo_branco(path_in, path_out, limiar=215):
    """Tira o fundo branco: todo branco (ou quase) ligado a QUALQUER ponto da borda da imagem fica transparente.
    (O preenchimento a partir dos 4 cantos deixava bolsões de branco encostados na borda, entre as pontas do desenho.)"""
    cores = np.array(Image.open(path_in).convert("RGB")).astype(int)
    rotulos, _ = ndimage.label(cores.min(axis=2) >= limiar)
    na_borda = set(np.unique(np.concatenate([rotulos[0], rotulos[-1], rotulos[:, 0], rotulos[:, -1]]))) - {0}
    fundo = np.isin(rotulos, list(na_borda))
    rgba = np.dstack([cores.astype(np.uint8), np.where(fundo, 0, 255).astype(np.uint8)])
    Image.fromarray(rgba, "RGBA").save(path_out)


def sem_fundo_solido(path_in, path_out, tolerancia):
    """PNG opaco com fundo de uma cor só (a do canto): apaga tudo o que está ligado à borda e é parecido com essa cor (soma das diferenças
    dos canais até `tolerancia`; o brilho em degradê em volta do escudo cai junto) e tira 2 px de franja entre o fundo e o escudo."""
    cores = np.array(Image.open(path_in).convert("RGB")).astype(int)
    parecido = np.abs(cores - cores[0, 0]).sum(axis=2) <= tolerancia
    rotulos, _ = ndimage.label(parecido)
    na_borda = set(np.unique(np.concatenate([rotulos[0], rotulos[-1], rotulos[:, 0], rotulos[:, -1]]))) - {0}
    escudo = ndimage.binary_erosion(~np.isin(rotulos, list(na_borda)), iterations=2)
    rgba = np.dstack([cores.astype(np.uint8), np.where(escudo, 255, 0).astype(np.uint8)])
    Image.fromarray(rgba, "RGBA").save(path_out)


def estender_borda(caminho, px=2):
    """Troca o anel de `px` pixels junto ao contorno externo pela cor sólida logo abaixo dele (o pixel opaco mais próximo, `px` para dentro).
    O antisserrilhado cinza dessa borda virava um filete ou pontinhos claros ao vetorizar, fora do contorno escuro. Vale para qualquer cor de contorno."""
    img = Image.open(caminho).convert("RGBA")
    dados = np.array(img)
    opaco = dados[..., 3] > 0
    distancia = ndimage.distance_transform_edt(np.pad(opaco, 1))[1:-1, 1:-1]
    solido = opaco & (distancia > px)
    if not solido.any():
        return
    _, (iy, ix) = ndimage.distance_transform_edt(~solido, return_indices=True)
    anel = opaco & ~solido
    dados[anel, :3] = dados[iy[anel], ix[anel], :3]
    Image.fromarray(dados, "RGBA").save(caminho)


def caixa_do_conteudo(img):
    """Caixa (esquerda, topo, direita, base) em pixels do que não é transparente."""
    return img.convert("RGBA").split()[3].point(lambda v: 255 if v > 20 else 0).getbbox()


def recortar_png(caminho):
    img = Image.open(caminho).convert("RGBA")
    caixa = caixa_do_conteudo(img)
    if caixa and caixa != (0, 0, img.width, img.height):
        img.crop(caixa).save(caminho)


def recortar_svg(caminho, miniatura_url):
    """Ajusta o viewBox do SVG ao conteúdo, medido na miniatura renderizada pela Commons (que cobre exatamente o viewBox original)."""
    texto = open(caminho, encoding="utf8").read()
    raiz = re.search(r"<svg\b[^>]*>", texto)
    if not raiz:
        return
    tag = raiz.group(0)
    vb = re.search(r'viewBox="([^"]+)"', tag)
    if vb:
        x, y, w, h = [float(v) for v in vb.group(1).replace(",", " ").split()]
    else:
        w = float(re.search(r'\swidth="([\d.]+)', tag).group(1))
        h = float(re.search(r'\sheight="([\d.]+)', tag).group(1))
        x = y = 0.0
    mini = Image.open(io.BytesIO(get(miniatura_url)))
    caixa = caixa_do_conteudo(mini)
    if not caixa:
        return
    esq, topo, dir_, base = caixa
    nx, ny = x + esq / mini.width * w, y + topo / mini.height * h
    nw, nh = (dir_ - esq) / mini.width * w, (base - topo) / mini.height * h
    novo = re.sub(r'\s(width|height|viewBox)="[^"]*"', "", tag)
    novo = novo.replace("<svg", f'<svg viewBox="{nx:.3f} {ny:.3f} {nw:.3f} {nh:.3f}" width="{nw:.2f}" height="{nh:.2f}"', 1)
    open(caminho, "w", encoding="utf8").write(texto.replace(tag, novo, 1))


def cortar_argola(caminho):
    """Medalhas têm uma argola de pendurar no topo: ela deixa o disco menor e deslocado quando o escudo é exibido na altura padrão.
    Corta as linhas do topo até a largura do desenho chegar a 30% da máxima (onde o disco começa a se abrir; a argola é bem mais estreita)."""
    img = Image.open(caminho).convert("RGBA")
    alfa = img.split()[3].point(lambda v: 255 if v > 20 else 0)
    larguras = []
    for y in range(img.height):
        linha = alfa.crop((0, y, img.width, y + 1)).getbbox()
        larguras.append(0 if not linha else linha[2] - linha[0])
    limite = max(larguras) * 0.3
    topo = next(y for y, w in enumerate(larguras) if w >= limite)
    img.crop((0, topo, img.width, img.height)).save(caminho)
    recortar_png(caminho)


def icone_png(caminho):
    """Versão de 64 px para o ícone de pasta (o escudo de 800 px dentro de um ícone de 16 px pesaria demais no tema de ícones)."""
    img = Image.open(caminho).convert("RGBA")
    img.thumbnail((64, 64), Image.LANCZOS)
    img.save(caminho[:-4] + ".icon.png", optimize=True)


def reduzir(caminho, maximo=800):
    """Escudo de fundo não precisa de mais que ~800 px; PNG grandes só engordam o pacote."""
    img = Image.open(caminho)
    if max(img.size) > maximo:
        img.thumbnail((maximo, maximo), Image.LANCZOS)
        img.save(caminho, optimize=True)


def main():
    dados = json.load(open(os.path.join(ROOT, "src", "escudos-retro.json"), encoding="utf8"))
    base = os.path.join(ROOT, "assets", "escudos", "retro")
    creditos = []
    # Com times na linha de comando (python baixar_escudos_retro.py flamengo) só esses são refeitos; os créditos dos outros são mantidos.
    escolhidos = set(sys.argv[1:])
    for slug, lista in dados.items():
        if slug.startswith("_") or (escolhidos and slug not in escolhidos):
            continue
        os.makedirs(os.path.join(base, slug), exist_ok=True)
        for e in lista:
            if e.get("copiarDe"):
                # Segundo escudo atual do time (campo "atual"): o mesmo arquivo de assets/escudos, só que colorido, como opção no seletor.
                shutil.copyfile(os.path.join(ROOT, "assets", "escudos", e["copiarDe"]), os.path.join(base, slug, f"{e['id']}.svg"))
                print("ok", slug, e["id"], "(cópia do escudo atual)")
                continue
            if e.get("local"):
                # Arquivo fornecido pelo dono do projeto: fica em assets/escudos/retro/<slug>/_originais/<local> e é tratado como os demais.
                origem = os.path.join(base, slug, "_originais", e["local"])
                titulo, ii = None, {"extmetadata": {}}
                ext = os.path.splitext(e["local"])[1].lower().lstrip(".")
                bruto = open(origem, "rb").read()
                if e.get("vetorizar"):
                    # Escudo simples (poucas cores chapadas): vira SVG, nítido em qualquer tamanho (ver vetorizar_escudo.py).
                    destino = os.path.join(base, slug, f"{e['id']}.svg")
                    if e["vetorizar"] == "monocromo":
                        # PNG com fundo transparente: o desenho é assentado sobre branco antes (o RGB dos pixels transparentes não vale)
                        tmp = destino + ".tmp.png"
                        plano = Image.new("RGBA", Image.open(origem).size, (255, 255, 255, 255))
                        plano.alpha_composite(Image.open(origem).convert("RGBA"))
                        plano.convert("RGB").save(tmp)
                        vetorizar_escudo.monocromo_para_svg(tmp, destino, e.get("cor"))
                        os.remove(tmp)
                    elif e["vetorizar"] == "duas-tintas":
                        vetorizar_escudo.duas_tintas_para_svg(origem, destino, tinta=e.get("tinta", "#000000"))
                    elif e["vetorizar"] == "suave":
                        vetorizar_escudo.suave_para_svg(origem, destino, e["vetorizarPaleta"], silhueta=e.get("silhueta", "borda"), vazar_furos=e.get("vazarFuros"), aro=e.get("aroDe"), refinar=bool(e.get("refinar")), usar_alpha=bool(e.get("usarAlpha")), vao_min=e.get("vaoMinimo", 30), preencher=e.get("preencher", True))
                    elif e["vetorizar"] == "sombreado":
                        # PNG transparente com sombreado de metal (cinzas e bege) e vermelho chapado: camadas empilhadas por luminosidade (ver sombreado_para_svg)
                        vetorizar_escudo.sombreado_para_svg(origem, destino, e.get("base", "#3c3735"), e.get("vermelho", "#e6090b"), e.get("niveis", 12), e.get("sigma", 1.4), e.get("escala", 5), tuple(e.get("limites", (70, 235))), e.get("alisar", 0.0), e.get("minimo", 60), e.get("tracos", 0), 0.8, tuple(tuple(c) for c in e.get("detalhes", ())), e.get("detalhe_sigma", 0.8), e.get("detalhe_alisar", 0.8), e.get("detalhe_tracos", 0), e.get("retoques", ()))
                    elif e["vetorizar"] == "alfa":
                        # PNG com fundo transparente: o contorno vem do canal alfa e a cor mais próxima da paleta decide cada camada (a primeira cobre toda a silhueta)
                        if e.get("fundoBranco"):
                            # JPG ou PNG opaco sobre branco: o branco vira transparente antes de traçar
                            tmp = destino + ".tmp.png"
                            vetorizar_escudo.branco_para_alfa(origem, tmp)
                            if e.get("nitido"):
                                vetorizar_escudo.alfa_cores_nitido(tmp, destino, e["vetorizarPaleta"], e.get("sobrepor", 1), e.get("escala", 6), e.get("suavidade", 1.2), e.get("minimo", 30))
                            else:
                                vetorizar_escudo.alfa_cores_para_svg(tmp, destino, e["vetorizarPaleta"], e.get("sobrepor", 0))
                            os.remove(tmp)
                        elif e.get("nitido"):
                            vetorizar_escudo.alfa_cores_nitido(origem, destino, e["vetorizarPaleta"], e.get("sobrepor", 1), e.get("escala", 6), e.get("suavidade", 1.2), e.get("minimo", 30))
                        else:
                            vetorizar_escudo.alfa_cores_para_svg(origem, destino, e["vetorizarPaleta"], e.get("sobrepor", 0))
                    elif e["vetorizar"] == "auto":
                        # Imagem com fundo claro: o fundo é apagado antes (limiarFundo; mais baixo tira também o cinza do antisserrilhado do contorno).
                        tmp = destino + ".tmp.png"
                        sem_fundo_branco(origem, tmp, e.get("limiarFundo", 215))
                        estender_borda(tmp, e.get("bordaPx", 2))
                        vetorizar_escudo.auto_para_svg(tmp, destino, suavidade=e.get("suavidade"))
                        os.remove(tmp)
                    elif e["vetorizar"] == "paleta":
                        tmp = destino + ".tmp.png"
                        shutil.copyfile(origem, tmp)
                        estender_borda(tmp, e.get("bordaPx", 2))
                        vetorizar_escudo.paleta_para_svg(tmp, destino, e["vetorizarPaleta"])
                        os.remove(tmp)
                    else:
                        vetorizar_escudo.cores_para_svg(origem, destino)
                    for resto in (".png", ".icon.png"):
                        if os.path.exists(os.path.join(base, slug, e["id"] + resto)):
                            os.remove(os.path.join(base, slug, e["id"] + resto))
                    creditos.append(f"{slug}/{e['id']}.svg: {e['local']} (vetorizado) | fornecido pelo dono do projeto, sem autor nem licença conhecidos{(' | ' + e['nota']) if e.get('nota') else ''}")
                    print("ok", slug, e["id"], "(vetorizado)")
                    continue
            else:
                titulo = "File:" + e["commons"]
                info = json.loads(get(API + urllib.parse.quote(titulo)))
                pagina = next(iter(info["query"]["pages"].values()))
                ii = pagina["imageinfo"][0]
                ext = os.path.splitext(e["commons"])[1].lower().lstrip(".")
                bruto = get(ii["url"])
            destino_ext = "png" if ext in ("jpg", "jpeg") else ext
            destino = os.path.join(base, slug, f"{e['id']}.{destino_ext}")
            if e.get("fundoSolido"):
                tmp = destino + ".tmp." + ext
                open(tmp, "wb").write(bruto)
                sem_fundo_solido(tmp, destino, e["fundoSolido"])
                os.remove(tmp)
            elif ext in ("jpg", "jpeg") or e.get("semFundo"):
                tmp = destino + ".tmp." + ext
                open(tmp, "wb").write(bruto)
                sem_fundo_branco(tmp, destino, e.get("limiarFundo", 215))
                os.remove(tmp)
            else:
                open(destino, "wb").write(bruto)
            if destino_ext == "png":
                recortar_png(destino)
                if e.get("vetorizarPaleta") or e.get("vetorizarAuto") or e.get("modo"):
                    # Escudo de cores chapadas baixado em PNG pequeno: vira SVG, nítido em qualquer tamanho (ver vetorizar_escudo.py).
                    svg = os.path.join(base, slug, f"{e['id']}.svg")
                    if e.get("modo"):
                        # "modo": "duas-tintas" (com "tinta") ou "suave" (com "paleta"): traçam pelos tons de cinza, com contorno liso; a imagem é assentada sobre branco
                        plano = Image.new("RGBA", Image.open(destino).size, (255, 255, 255, 255))
                        plano.alpha_composite(Image.open(destino).convert("RGBA"))
                        tmp = destino + ".plano.png"
                        plano.convert("RGB").save(tmp)
                        if e["modo"] == "duas-tintas":
                            vetorizar_escudo.duas_tintas_para_svg(tmp, svg, tinta=e["tinta"])
                        else:
                            vetorizar_escudo.suave_para_svg(tmp, svg, e["paleta"], silhueta=e.get("silhueta", "borda"), refinar=True)
                        os.remove(tmp)
                    elif e.get("vetorizarPaleta"):
                        estender_borda(destino, e.get("bordaPx", 2))
                        vetorizar_escudo.paleta_para_svg(destino, svg, e["vetorizarPaleta"])
                    else:
                        estender_borda(destino, e.get("bordaPx", 2))
                        # "vetorizarAuto": true usa a paleta achada na imagem; um objeto repassa opções (suavidade, maximo, cores_fixas) a auto_para_svg
                        opcoes = e["vetorizarAuto"] if isinstance(e["vetorizarAuto"], dict) else {}
                        vetorizar_escudo.auto_para_svg(destino, svg, **opcoes)
                    for resto in (destino, destino[:-4] + ".icon.png"):
                        if os.path.exists(resto):
                            os.remove(resto)
                    meta = ii.get("extmetadata", {})
                    autor = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "?")).strip()
                    creditos.append(f"{slug}/{e['id']}.svg: {e['commons']} (vetorizado) | {autor} | {meta.get('LicenseShortName', {}).get('value', '?')} | https://commons.wikimedia.org/wiki/{urllib.parse.quote(titulo.replace(' ', '_'))}")
                    print("ok", slug, e["id"], "(vetorizado)")
                    time.sleep(0.4)
                    continue
                if e.get("cortarArgola"):
                    cortar_argola(destino)
                reduzir(destino)
                icone_png(destino)
            else:
                recortar_svg(destino, ii["thumburl"])
            if e.get("local"):
                creditos.append(f"{slug}/{e['id']}.{destino_ext}: {e['local']} | fornecido pelo dono do projeto, sem autor nem licença conhecidos{(' | ' + e['nota']) if e.get('nota') else ''}")
                print("ok", slug, e["id"], "(arquivo local)")
                continue
            meta = ii.get("extmetadata", {})
            licenca = meta.get("LicenseShortName", {}).get("value", "?")
            autor = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "?")).strip()
            creditos.append(f"{slug}/{e['id']}.{destino_ext}: {e['commons']} | {autor} | {licenca} | https://commons.wikimedia.org/wiki/{urllib.parse.quote(titulo.replace(' ', '_'))}")
            print("ok", slug, e["id"])
            time.sleep(0.4)
    arquivo_creditos = os.path.join(base, "CREDITS.txt")
    if escolhidos and os.path.exists(arquivo_creditos):
        antigos = [l for l in open(arquivo_creditos, encoding="utf8").read().split("\n") if "/" in l.split(":")[0] and l.split("/")[0] not in escolhidos]
        creditos = antigos + creditos
    texto = "Escudos antigos: Wikimedia Commons e arquivos fornecidos pelo dono do projeto. Os escudos são marcas dos clubes; as licenças abaixo são as do arquivo no Commons.\n\n" + "\n".join(creditos) + "\n"
    open(os.path.join(base, "CREDITS.txt"), "w", encoding="utf8").write(texto)


if __name__ == "__main__":
    main()
