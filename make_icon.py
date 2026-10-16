"""Gera images/icon-padrao.png (128x128): faixas horizontais rubro-negras. Só biblioteca padrão."""
import struct
import zlib

SIZE = 128
RED = (197, 38, 19)
BLACK = (13, 13, 13)
STRIPE = 16  # 8 faixas de 16 px, alternando preto e vermelho


def row(y):
    color = RED if (y // STRIPE) % 2 else BLACK
    return b"\x00" + bytes(color) * SIZE


def chunk(tag, data):
    body = tag + data
    return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body))


raw = b"".join(row(y) for y in range(SIZE))
png = (
    b"\x89PNG\r\n\x1a\n"
    + chunk(b"IHDR", struct.pack(">IIBBBBB", SIZE, SIZE, 8, 2, 0, 0, 0))
    + chunk(b"IDAT", zlib.compress(raw, 9))
    + chunk(b"IEND", b"")
)
with open("images/icon-padrao.png", "wb") as f:
    f.write(png)
print("images/icon-padrao.png", len(png), "bytes")
