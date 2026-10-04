"""Common utilities I keep reaching for."""
from pathlib import Path
from typing import Iterable


def human_bytes(n: int) -> str:
    units = ("B", "KB", "MB", "GB", "TB")
    i = 0
    while n >= 1024 and i < len(units) - 1:
        n /= 1024.0
        i += 1
    return f"{n:.1f} {units[i]}"


def chunked(seq: Iterable, n: int):
    buf = []
    for x in seq:
        buf.append(x)
        if len(buf) == n:
            yield buf
            buf = []
    if buf:
        yield buf


def read_lines(p: Path) -> list[str]:
    return [ln.strip() for ln in p.read_text(encoding="utf-8").splitlines() if ln.strip()]
