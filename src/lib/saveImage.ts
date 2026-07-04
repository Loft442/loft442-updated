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

export async function saveImageFile(
  src: string,
  filename: string
): Promise<void> {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const blob = await response.blob();
  const file = new File([blob], filename, {
    type: blob.type || "image/webp",
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
    downloadBlob(blob, filename);
  } catch (error) {
    console.error("Failed to download image:", error);
    window.open(src, "_blank", "noopener,noreferrer");
  }
}

export function getImageFileName(
  src: string,
  imageFileName?: string
): string {
  return imageFileName ?? src.split("/").pop() ?? "image.webp";
}
