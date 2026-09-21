"""Print the downloadable guides (downloads-src/*.html) to public/downloads/*.pdf
with headless Chrome. Run from the repo root:  python downloads-src/build_pdfs.py

Added Sep 2026 when the PDFs were rebuilt (content review, commit 2a). Before that
the PDFs had no source in the repo. Edit the HTML, then re-run this script."""
import os, pathlib, subprocess, sys

SRC = pathlib.Path(__file__).resolve().parent
OUT = SRC.parent / "public" / "downloads"
CHROME = os.environ.get("CHROME_PATH", r"C:\Program Files\Google\Chrome\Application\chrome.exe")

pages = sorted(SRC.glob("*.html"))
if not pages:
    sys.exit("no .html sources found")
for page in pages:
    pdf = OUT / (page.stem + ".pdf")
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         f"--print-to-pdf={pdf}", page.as_uri()],
        check=True, capture_output=True,
    )
    print(f"{pdf.relative_to(SRC.parent)}  ({pdf.stat().st_size:,} bytes)")
