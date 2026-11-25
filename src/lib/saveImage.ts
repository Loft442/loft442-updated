function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function withExtension(filename: string, ext: string) {
  const base = filename.replace(/\.[^.]+$/, "") || "image";
  return `${base}.${ext}`;
}

function prefersPhoneSave() {
  if (typeof navigator === "undefined") return false;

  const uaData = (
    navigator as Navigator & { userAgentData?: { mobile?: boolean } }
  ).userAgentData;
  if (uaData?.mobile) return true;

  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return true;

  return (
    navigator.maxTouchPoints > 0 &&
    window.matchMedia("(pointer: coarse)").matches &&
    window.matchMedia("(max-width: 768px)").matches
  );
}

async function blobToPng(blob: Blob): Promise<Blob> {
  if (blob.type === "image/png") return blob;

  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(bitmap, 0, 0);

    const png = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result ? resolve(result) : reject(new Error("PNG encode failed")),
        "image/png"
      );
    });
    return png;
  } finally {
    bitmap.close?.();
  }
}

export async function saveImageFile(
  src: string,
  filename: string
): Promise<void> {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const sourceBlob = await response.blob();
  const phoneSave = prefersPhoneSave();

  if (phoneSave) {
    // Keep a shareable file so iOS/Android can offer "Save Image" / Files.
    const shareName = withExtension(
      filename,
      sourceBlob.type === "image/png" ? "png" : "webp"
    );
    const file = new File([sourceBlob], shareName, {
      type: sourceBlob.type || "image/webp",
    });

    if (
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({ files: [file] });
      return;
    }

    try {
      downloadBlob(sourceBlob, shareName);
    } catch (error) {
      console.error("Failed to download image:", error);
      window.open(src, "_blank", "noopener,noreferrer");
    }
    return;
  }

  // Desktop: always save a PNG download.
  const pngBlob = await blobToPng(sourceBlob);
  downloadBlob(pngBlob, withExtension(filename, "png"));
}

export function getImageFileName(
  src: string,
  imageFileName?: string
): string {
  return imageFileName ?? src.split("/").pop() ?? "image.webp";
}
