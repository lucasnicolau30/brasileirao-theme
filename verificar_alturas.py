"""Confere se os escudos de fundo novos e os retrô em PNG ocupam toda a altura da imagem.

O fundo do editor é exibido com a mesma altura para todos os escudos (80% da janela, estrelas e coroa incluídas). Margem
transparente em cima ou embaixo faz o escudo parecer menor que os outros. Uso: python verificar_alturas.py
Sai com código 1 se algum PNG tiver menos de 98% de altura útil.
"""
import glob
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
MINIMO = 0.98


def altura_util(caminho):
    img = Image.open(caminho).convert("RGBA")
    caixa = img.split()[3].point(lambda v: 255 if v > 20 else 0).getbbox()
    return (caixa[3] - caixa[1]) / img.height


falhas = 0
arquivos = sorted(glob.glob(os.path.join(ROOT, "assets", "escudos", "fundo", "*.png")) + glob.glob(os.path.join(ROOT, "assets", "escudos", "retro", "*", "*.png")))
for arquivo in arquivos:
    razao = altura_util(arquivo)
    if razao < MINIMO:
        falhas += 1
        print(f"FALHA  {os.path.relpath(arquivo, ROOT)}: altura útil {razao:.0%} (mínimo {MINIMO:.0%})")
if falhas:
    sys.exit(1)
print(f"Altura ok em {len(arquivos)} PNG.")
