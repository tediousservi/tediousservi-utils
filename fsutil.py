"""Filesystem helpers."""
from pathlib import Path
import shutil


def ensure_dir(p: Path) -> Path:
    p.mkdir(parents=True, exist_ok=True)
    return p


def safe_rmtree(p: Path) -> None:
    if p.exists():
        shutil.rmtree(p)


def copy_newer(src: Path, dst: Path) -> bool:
    if not src.exists():
        raise FileNotFoundError(src)
    if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
        return False
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    return True
