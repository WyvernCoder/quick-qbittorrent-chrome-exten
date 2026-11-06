"""Generate the extension's PNG icons from one high-resolution drawing."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / "icons"
SIZES = (16, 32, 48, 128)
CANVAS = 1024


def rounded_mask(size: int, radius: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size - 1, size - 1), radius=radius, fill=255
    )
    return mask


def diagonal_gradient(size: int) -> Image.Image:
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    diagonal = (x + y) / (2 * (size - 1))
    diagonal = np.clip(diagonal, 0, 1)

    top = np.array([47, 139, 255], dtype=np.float32)
    middle = np.array([27, 102, 232], dtype=np.float32)
    bottom = np.array([9, 57, 160], dtype=np.float32)

    blend = np.zeros((size, size, 3), dtype=np.float32)
    first_half = diagonal <= 0.55
    t1 = diagonal[first_half] / 0.55
    blend[first_half] = top + (middle - top) * t1[:, None]

    second_half = ~first_half
    t2 = (diagonal[second_half] - 0.55) / 0.45
    blend[second_half] = middle + (bottom - middle) * t2[:, None]

    return Image.fromarray(blend.clip(0, 255).astype(np.uint8), "RGB")


def draw_icon() -> Image.Image:
    size = CANVAS
    mask = rounded_mask(size, 232)

    base = diagonal_gradient(size).convert("RGBA")

    # Soft highlight in the upper-left corner.
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((-260, -360, 760, 620), fill=(167, 219, 255, 62))
    glow = glow.filter(ImageFilter.GaussianBlur(130))
    base.alpha_composite(glow)

    # Faint orbit ring gives the mark some depth at larger sizes.
    ring = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(ring)
    ring_draw.ellipse((148, 148, 876, 876), outline=(204, 239, 255, 45), width=16)
    base.alpha_composite(ring)

    draw = ImageDraw.Draw(base)

    # Main download arrow.
    arrow_color = (247, 252, 255, 255)
    draw.line((512, 268, 512, 622), fill=arrow_color, width=116)
    draw.line((354, 500, 512, 664), fill=arrow_color, width=116)
    draw.line((670, 500, 512, 664), fill=arrow_color, width=116)
    for point in ((512, 268), (354, 500), (512, 664), (670, 500)):
        r = 58
        draw.ellipse(
            (point[0] - r, point[1] - r, point[0] + r, point[1] + r),
            fill=arrow_color,
        )

    # A turquoise receiving tray implies "sent to qBittorrent".
    tray_color = (88, 235, 207, 255)
    draw.rounded_rectangle(
        (282, 742, 742, 798),
        radius=28,
        fill=tray_color,
    )
    draw.ellipse((250, 742, 314, 798), fill=tray_color)
    draw.ellipse((710, 742, 774, 798), fill=tray_color)

    # Tiny highlight on the tray.
    draw.rounded_rectangle(
        (328, 758, 620, 766),
        radius=4,
        fill=(203, 255, 245, 130),
    )

    # Clip all artwork to the rounded-square silhouette.
    clipped = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    clipped.paste(base, (0, 0), mask)
    base = clipped

    # Subtle inner border.
    border = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    border_draw = ImageDraw.Draw(border)
    border_draw.rounded_rectangle(
        (1, 1, size - 2, size - 2),
        radius=231,
        outline=(210, 237, 255, 72),
        width=4,
    )
    base.alpha_composite(border)
    return base


def main() -> None:
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    (ROOT / "store-assets").mkdir(parents=True, exist_ok=True)
    master = draw_icon()
    for size in SIZES:
        icon = master.resize((size, size), Image.Resampling.LANCZOS)
        icon.save(ICON_DIR / f"icon-{size}.png", optimize=True)
    master.resize((512, 512), Image.Resampling.LANCZOS).save(
        ROOT / "store-assets" / "icon-512.png", optimize=True
    )
    print("Generated icons:", ", ".join(f"icon-{size}.png" for size in SIZES))


if __name__ == "__main__":
    main()
