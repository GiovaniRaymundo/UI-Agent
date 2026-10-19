#!/usr/bin/env python3
"""
ocr-pdf.py — Extrae texto de un PDF con dos caminos:

  1. `--mode ocr`  : baidu/Unlimited-OCR (requiere GPU NVIDIA + CUDA).
  2. `--mode text` : capa de texto del PDF con PyMuPDF (rápido, sin GPU).

Uso:
  python .opencode/skills/ui-design/scripts/ocr-pdf.py --pdf libro.pdf --out salida/
  python .opencode/skills/ui-design/scripts/ocr-pdf.py --pdf libro.pdf --mode text --out libro.txt
  python .opencode/skills/ui-design/scripts/ocr-pdf.py --pdf libro.pdf --max-pages 20

Requisitos OCR (según el README de Unlimited-OCR):
  torch, torchvision, transformers, pymupdf, einops, addict, easydict, pillow
  GPU NVIDIA con CUDA 12.x y ~16 GB de VRAM recomendados.

Si el PDF ya tiene texto seleccionable, usa `--mode text`: es más rápido y exacto.
"""

import argparse
import os
import sys
import tempfile
from pathlib import Path

MODEL_DEFAULT = "baidu/Unlimited-OCR"


def pdf_to_images(pdf_path: str, dpi: int, out_dir: str, max_pages: int = 0) -> list[str]:
    import pymupdf

    doc = pymupdf.open(pdf_path)
    scale = dpi / 72.0
    matrix = pymupdf.Matrix(scale, scale)
    paths: list[str] = []
    try:
        for index, page in enumerate(doc):
            if max_pages and index >= max_pages:
                break
            image_path = os.path.join(out_dir, f"page_{index + 1:04d}.png")
            page.get_pixmap(matrix=matrix).save(image_path)
            paths.append(image_path)
    finally:
        doc.close()
    return paths


def extract_text(pdf_path: str, out_path: str, max_pages: int = 0) -> int:
    import pymupdf

    doc = pymupdf.open(pdf_path)
    chunks: list[str] = []
    pages = 0
    try:
        for index, page in enumerate(doc):
            if max_pages and index >= max_pages:
                break
            chunks.append(f"\n===== PAGE {index + 1} =====\n")
            chunks.append(page.get_text("text"))
            pages += 1
    finally:
        doc.close()

    destination = Path(out_path)
    if destination.suffix.lower() != ".txt":
        destination = destination / "texto.txt"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text("".join(chunks), encoding="utf-8")
    print(f"Texto extraído: {pages} páginas -> {destination}")
    return pages


def run_ocr(pdf_path: str, out_dir: str, dpi: int, model_name: str, max_pages: int) -> None:
    try:
        import torch
        from transformers import AutoModel, AutoTokenizer
    except ImportError as error:
        sys.exit(
            "Faltan dependencias para OCR: "
            f"{error}. Instala torch/transformers o usa --mode text."
        )

    if not torch.cuda.is_available():
        sys.exit(
            "Unlimited-OCR requiere una GPU NVIDIA con CUDA y no se detectó ninguna.\n"
            "Opciones:\n"
            "  - Usa --mode text si el PDF tiene capa de texto (recomendado).\n"
            "  - Ejecuta este script en una máquina con GPU.\n"
            "  - Usa la demo de Hugging Face Spaces (baidu/Unlimited-OCR)."
        )

    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    model = (
        AutoModel.from_pretrained(
            model_name,
            trust_remote_code=True,
            use_safetensors=True,
            torch_dtype=torch.bfloat16,
        )
        .eval()
        .cuda()
    )

    output = Path(out_dir)
    output.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="unlimited_ocr_") as tmp:
        print(f"Convirtiendo PDF a imágenes ({dpi} dpi)…")
        images = pdf_to_images(pdf_path, dpi, tmp, max_pages)
        if not images:
            sys.exit("El PDF no tiene páginas para procesar.")
        print(f"Páginas: {len(images)}. Ejecutando Unlimited-OCR…")
        model.infer_multi(
            tokenizer,
            prompt="<image>Multi page parsing.",
            image_files=images,
            output_path=str(output),
            image_size=1024,
            max_length=32768,
            no_repeat_ngram_size=35,
            ngram_window=1024,
            save_results=True,
        )
    print(f"Listo. Revisa {output}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extrae texto de PDFs con Unlimited-OCR o PyMuPDF.")
    parser.add_argument("--pdf", required=True, help="Ruta del PDF")
    parser.add_argument("--out", default="ocr-output", help="Carpeta de salida (OCR) o archivo .txt (texto)")
    parser.add_argument("--mode", choices=("ocr", "text"), default="ocr", help="ocr = Unlimited-OCR; text = capa de texto")
    parser.add_argument("--dpi", type=int, default=300, help="Resolución de render para OCR (default: 300)")
    parser.add_argument("--model", default=MODEL_DEFAULT, help="Modelo de Hugging Face")
    parser.add_argument("--max-pages", type=int, default=0, help="Limita páginas (0 = todas)")
    args = parser.parse_args()

    if not os.path.isfile(args.pdf):
        sys.exit(f"No existe el PDF: {args.pdf}")

    if args.mode == "text":
        extract_text(args.pdf, args.out, args.max_pages)
    else:
        run_ocr(args.pdf, args.out, args.dpi, args.model, args.max_pages)


if __name__ == "__main__":
    main()
