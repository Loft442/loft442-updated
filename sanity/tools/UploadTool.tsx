"use client";

/**
 * Studio "Upload" tool: one column per gallery category, each with its own drop zone
 * right under the heading. Files dropped in a column are uploaded as Sanity file assets
 * and saved as *draft* galleryItems in that category. Each column lists its uploads and
 * the drafts waiting to publish; nothing reaches /gallery until it is published.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { useClient } from "sanity";
import { apiVersion } from "../env";
import { GALLERY_CATEGORIES, defaultAltFor, type GalleryCategoryValue } from "../galleryCategories";
import { galleryItems as BUILT_IN_PHOTOS } from "../../src/lib/galleryItems";

/** Marker document: once it exists, the website gallery reads only from Sanity. */
const IMPORT_DOC_ID = "galleryImport";
const importedId = (legacyId: number | string) => `gallery-original-${legacyId}`;

const MAX_PARALLEL = 3;
const LARGE_VIDEO_BYTES = 100 * 1024 * 1024;

type Status = "waiting" | "uploading" | "saved" | "failed";

type QueueItem = {
  key: string;
  file: File;
  previewUrl: string;
  isVideo: boolean;
  status: Status;
  percent: number;
  error?: string;
  category: GalleryCategoryValue;
  alt: string;
};

type DraftRow = {
  _id: string;
  _createdAt: string;
  category?: string;
  alt?: string;
  url?: string;
  mimeType?: string;
};

const DRAFTS_QUERY = `*[_type == "galleryItem" && _id in path("drafts.**")] | order(_createdAt desc){
  _id, _createdAt, category, alt,
  "url": media.asset->url,
  "mimeType": media.asset->mimeType
}`;

// Everything currently on the website gallery (published items), newest first.
const LIVE_QUERY = `{
  "live": *[_type == "galleryItem" && !(_id in path("drafts.**")) && defined(media.asset)] | order(_createdAt desc){
    _id, _createdAt, category, alt,
    "url": media.asset->url,
    "mimeType": media.asset->mimeType
  },
  "importDone": defined(*[_id == "${IMPORT_DOC_ID}"][0].completedAt)
}`;

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

// Loft 442 brand palette (matches the website's globals.css tokens).
const ui = {
  bg: "#070708",
  panel: "#0c0c0d",
  ivory: "#f4efe6",
  text: "rgba(244, 239, 230, 0.86)",
  muted: "rgba(244, 239, 230, 0.55)",
  line: "rgba(244, 239, 230, 0.12)",
  lineStrong: "rgba(244, 239, 230, 0.24)",
  gold: "#c9a961",
  goldLight: "#e8d9b0",
  goldSoft: "rgba(201, 169, 97, 0.45)",
  ink: "#0a0a0a",
  danger: "#f2a7a7",
};

// The website loads these fonts globally; fall back to similar system fonts.
const font = {
  display: 'var(--font-display, "Gilda Display"), Georgia, "Times New Roman", serif',
  body: 'var(--font-inter, Inter), system-ui, -apple-system, "Segoe UI", sans-serif',
};

const eyebrow = {
  fontFamily: font.body,
  fontSize: 11.2,
  fontWeight: 500,
  letterSpacing: "0.32em",
  textTransform: "uppercase" as const,
  color: ui.gold,
};

const buttonStyle = (primary = false, disabled = false, small = false) => ({
  appearance: "none" as const,
  border: `1px solid ${primary ? ui.gold : ui.lineStrong}`,
  background: primary ? ui.gold : "transparent",
  color: primary ? ui.ink : ui.ivory,
  padding: small ? "7px 10px" : "12px 20px",
  borderRadius: 0,
  fontFamily: font.body,
  fontSize: 11.2,
  fontWeight: 600,
  letterSpacing: small ? "0.14em" : "0.22em",
  textTransform: "uppercase" as const,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.4 : 1,
  whiteSpace: "nowrap" as const,
  transition: "background 200ms, border-color 200ms, color 200ms",
});

const UploadGlyph = ({ color }: { color: string }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" aria-hidden="true">
    <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M4.5 15v4.5h15V15" />
  </svg>
);

function Thumb({ url, isVideo, size = 44 }: { url?: string; isVideo: boolean; size?: number }) {
  const box = { width: size, height: size, flexShrink: 0, borderRadius: 0, objectFit: "cover" as const, background: "#1a1a1b", border: `1px solid ${ui.line}` };
  if (!url) return <div style={box} />;
  return isVideo ? (
    <video src={`${url}#t=0.1`} muted preload="metadata" style={box} />
  ) : (
    // Local previews (blob URLs) and Studio thumbnails, so next/image doesn't apply.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" style={box} />
  );
}

/** Drag payload when moving an on-the-website photo to another column. */
const ITEM_MIME = "application/x-loft442-gallery-item";
const isItemDrag = (e: DragEvent) => Array.from(e.dataTransfer.types).includes(ITEM_MIME);
const isFileDrag = (e: DragEvent) => Array.from(e.dataTransfer.types).includes("Files");

const ellipsis = { whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" };

type ColumnProps = {
  title: string;
  value: GalleryCategoryValue;
  queue: QueueItem[];
  drafts: DraftRow[];
  busyIds: Set<string>;
  onFiles: (files: FileList | File[], category: GalleryCategoryValue) => void;
  onRetry: (key: string) => void;
  onPublish: (ids: string[]) => void;
  onDelete: (id: string) => void;
  live: DraftRow[];
  onMove: (id: string, category: GalleryCategoryValue) => void;
  onDeleteLive: (id: string) => void;
};

function CategoryColumn({
  title,
  value,
  queue,
  drafts,
  busyIds,
  onFiles,
  onRetry,
  onPublish,
  onDelete,
  live,
  onMove,
  onDeleteLive,
}: ColumnProps) {
  const [dragOver, setDragOver] = useState(false);
  const [moveOver, setMoveOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inProgress = queue.filter((q) => q.status === "waiting" || q.status === "uploading").length;

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files?.length) onFiles(event.dataTransfer.files, value);
  };

  return (
    <section
      aria-label={`${title} uploads`}
      // Drop a photo dragged from another column anywhere on this column to move it here.
      onDragOver={(e) => {
        if (!isItemDrag(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setMoveOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMoveOver(false);
      }}
      onDrop={(e) => {
        if (!isItemDrag(e)) return;
        e.preventDefault();
        setMoveOver(false);
        try {
          const { id, from } = JSON.parse(e.dataTransfer.getData(ITEM_MIME)) as { id: string; from: string };
          if (from !== value) onMove(id, value);
        } catch {
          // Ignore malformed drags.
        }
      }}
      style={{
        border: `1px solid ${moveOver ? ui.gold : ui.line}`,
        boxShadow: moveOver ? `inset 0 0 0 1px ${ui.gold}` : "none",
        background: moveOver ? "rgba(201, 169, 97, 0.07)" : ui.panel,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        position: "relative",
        transition: "background 150ms, border-color 150ms",
      }}
    >
      {moveOver ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "auto 12px 12px",
            zIndex: 2,
            padding: "10px 12px",
            background: ui.gold,
            color: ui.ink,
            fontFamily: font.body,
            fontSize: 11.2,
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          Drop to move to {title}
        </div>
      ) : null}
      {/* Column heading */}
      <header style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${ui.line}` }}>
        <h2 style={{ margin: 0, fontFamily: font.display, fontWeight: 400, fontSize: 22, lineHeight: 1.2, color: ui.ivory, ...ellipsis }}>
          {title}
        </h2>
        <div style={{ ...eyebrow, marginTop: 8, color: drafts.length || inProgress ? ui.gold : ui.muted, letterSpacing: "0.22em" }}>
          {drafts.length} waiting{inProgress ? ` · ${inProgress} uploading` : ""}
        </div>
      </header>

      {/* Drop zone, right under the heading */}
      <div style={{ padding: 16 }}>
        <div
          role="button"
          tabIndex={0}
          aria-label={`Drop photos and videos for ${title}`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            if (!isFileDrag(e)) return;
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            if (isFileDrag(e)) onDrop(e);
          }}
          style={{
            border: `1px dashed ${dragOver ? ui.gold : ui.goldSoft}`,
            padding: "30px 12px",
            textAlign: "center",
            cursor: "pointer",
            background: dragOver ? "rgba(201, 169, 97, 0.09)" : "rgba(201, 169, 97, 0.02)",
            transition: "border-color 200ms, background 200ms",
            display: "grid",
            justifyItems: "center",
            gap: 10,
          }}
        >
          <UploadGlyph color={dragOver ? ui.goldLight : ui.gold} />
          <div style={{ fontFamily: font.display, fontSize: 18, color: ui.ivory }}>Drop files here</div>
          <div style={{ ...eyebrow, fontSize: 11.2, letterSpacing: "0.2em", color: ui.muted }}>or click to choose</div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files?.length) onFiles(e.target.files, value);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Uploads in progress / just finished */}
      {queue.length ? (
        <ul style={{ listStyle: "none", margin: 0, padding: "0 16px 16px", display: "grid", gap: 10 }}>
          {queue.map((q) => (
            <li key={q.key} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <Thumb url={q.previewUrl} isVideo={q.isVideo} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: font.body, fontSize: 13, color: ui.text, ...ellipsis }}>{q.file.name}</div>
                <div style={{ fontFamily: font.body, fontSize: 11.2, color: q.status === "failed" ? ui.danger : q.status === "saved" ? ui.gold : ui.muted, ...ellipsis }}>
                  {q.status === "waiting"
                    ? `${formatSize(q.file.size)} · Waiting…`
                    : q.status === "uploading"
                      ? `Uploading ${q.percent}%`
                      : q.status === "saved"
                        ? "Saved as draft"
                        : `Failed${q.error ? `: ${q.error}` : ""}`}
                </div>
                {q.status === "uploading" ? (
                  <div style={{ height: 2, background: ui.line, marginTop: 6 }}>
                    <div style={{ height: 2, width: `${q.percent}%`, background: ui.gold, transition: "width 200ms" }} />
                  </div>
                ) : null}
              </div>
              {q.status === "failed" ? (
                <button type="button" style={buttonStyle(false, false, true)} onClick={() => onRetry(q.key)}>
                  Retry
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Drafts waiting to publish in this category */}
      <div style={{ borderTop: `1px solid ${ui.line}`, padding: 16, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span style={{ ...eyebrow, letterSpacing: "0.2em", color: ui.muted, whiteSpace: "nowrap" }}>To publish</span>
          <button
            type="button"
            style={buttonStyle(true, !drafts.length || busyIds.size > 0, true)}
            disabled={!drafts.length || busyIds.size > 0}
            onClick={() => onPublish(drafts.map((d) => d._id))}
          >
            Publish {drafts.length || ""}
          </button>
        </div>
        {drafts.length ? (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
            {drafts.map((d) => {
              const busy = busyIds.has(d._id);
              const isVideo = d.mimeType?.startsWith("video/") ?? false;
              return (
                <li key={d._id} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <Thumb url={d.url} isVideo={isVideo} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: font.body, fontSize: 13, color: ui.text, ...ellipsis }}>{d.alt || "No description"}</div>
                    <div style={{ fontFamily: font.body, fontSize: 11.2, color: ui.muted }}>{isVideo ? "Video" : "Photo"}</div>
                  </div>
                  <button type="button" style={buttonStyle(true, busy, true)} disabled={busy} onClick={() => onPublish([d._id])}>
                    Publish
                  </button>
                  <button
                    type="button"
                    aria-label="Delete draft"
                    title="Delete draft"
                    style={buttonStyle(false, busy, true)}
                    disabled={busy}
                    onClick={() => onDelete(d._id)}
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ margin: 0, fontFamily: font.body, fontSize: 12, color: ui.muted }}>Nothing waiting.</p>
        )}
      </div>

      {/* Photos/videos currently on the website in this category: move or delete */}
      <div style={{ borderTop: `1px solid ${ui.line}`, padding: 16 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <span style={{ ...eyebrow, letterSpacing: "0.2em", color: ui.gold }}>On the website</span>
            <span style={{ fontFamily: font.body, fontSize: 12, color: ui.muted }}>
              {live.length} {live.length === 1 ? "photo" : "photos"}
            </span>
          </div>
          <span style={{ fontFamily: font.body, fontSize: 11.5, color: ui.muted }}>
            Drag a photo onto another column to move it · ✕ to delete.
          </span>
        </div>
        {live.length ? (
          <ul
            style={{
              listStyle: "none",
              margin: "14px 0 0",
              padding: 0,
              display: "grid",
              gap: 8,
              gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))",
            }}
          >
            {live.map((item) => {
              const busy = busyIds.has(item._id);
              const isVideo = item.mimeType?.startsWith("video/") ?? false;
              const dragging = draggingId === item._id;
              return (
                <li
                  key={item._id}
                  draggable={!busy}
                  title={`${item.alt || "No description"} · drag onto another column to move`}
                  onDragStart={(e) => {
                    e.dataTransfer.setData(ITEM_MIME, JSON.stringify({ id: item._id, from: value }));
                    e.dataTransfer.effectAllowed = "move";
                    setDraggingId(item._id);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    border: `1px solid ${ui.line}`,
                    background: "#1a1a1b",
                    cursor: busy ? "progress" : "grab",
                    opacity: busy ? 0.4 : dragging ? 0.35 : 1,
                    overflow: "hidden",
                  }}
                >
                  {isVideo ? (
                    <video
                      src={`${item.url}#t=0.1`}
                      muted
                      preload="metadata"
                      style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url ? `${item.url}` : undefined}
                      alt={item.alt || ""}
                      draggable={false}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  )}
                  {isVideo ? (
                    <span
                      style={{
                        position: "absolute",
                        left: 6,
                        bottom: 6,
                        padding: "2px 6px",
                        background: "rgba(7,7,8,0.75)",
                        color: ui.goldLight,
                        fontFamily: font.body,
                        fontSize: 10.5,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      Video
                    </span>
                  ) : null}
                  <button
                    type="button"
                    aria-label={`Delete ${item.alt || "this photo"} from the website`}
                    title="Delete from the website"
                    disabled={busy}
                    onClick={() => onDeleteLive(item._id)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 28,
                      height: 28,
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid rgba(242, 167, 167, 0.6)",
                      background: "rgba(7, 7, 8, 0.8)",
                      color: ui.danger,
                      fontSize: 14,
                      lineHeight: 1,
                      cursor: busy ? "not-allowed" : "pointer",
                      borderRadius: 0,
                    }}
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ margin: "12px 0 0", fontFamily: font.body, fontSize: 12, color: ui.muted }}>
            Nothing in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}

export function UploadTool() {
  const client = useClient({ apiVersion });
  const [batchAlt, setBatchAlt] = useState("");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [notice, setNotice] = useState("");
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [live, setLive] = useState<DraftRow[]>([]);
  const [importDone, setImportDone] = useState<boolean | null>(null);
  const [importProgress, setImportProgress] = useState<{ done: number; total: number; failed: number } | null>(null);
  const activeRef = useRef(0);

  // ---- Drafts waiting to publish + items on the website (live-updating) ----
  const loadDrafts = useCallback(() => {
    client.fetch<DraftRow[]>(DRAFTS_QUERY).then(setDrafts).catch(() => undefined);
    client
      .fetch<{ live: DraftRow[]; importDone: boolean }>(LIVE_QUERY)
      .then((res) => {
        setLive(res.live);
        setImportDone(res.importDone);
      })
      .catch(() => undefined);
  }, [client]);

  useEffect(() => {
    loadDrafts();
    const sub = client
      .listen(`*[_type == "galleryItem"]`, {}, { includeResult: false, visibility: "query" })
      .subscribe(() => loadDrafts());
    return () => sub.unsubscribe();
  }, [client, loadDrafts]);

  // Release object URLs when the tool unmounts.
  const queueRef = useRef(queue);
  queueRef.current = queue;
  useEffect(() => () => queueRef.current.forEach((q) => URL.revokeObjectURL(q.previewUrl)), []);

  const update = (key: string, patch: Partial<QueueItem>) =>
    setQueue((prev) => prev.map((q) => (q.key === key ? { ...q, ...patch } : q)));

  // ---- Upload one queued file ----
  const uploadOne = useCallback(
    (item: QueueItem) =>
      new Promise<void>((resolve) => {
        update(item.key, { status: "uploading", percent: 0, error: undefined });
        client.observable.assets
          .upload("file", item.file, { filename: item.file.name, contentType: item.file.type })
          .subscribe({
            next: (event) => {
              if (event.type === "progress") {
                update(item.key, { percent: Math.round(event.percent ?? 0) });
              } else if (event.type === "response") {
                const asset = event.body.document as { _id: string };
                client
                  .create({
                    _id: `drafts.${crypto.randomUUID()}`,
                    _type: "galleryItem",
                    media: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
                    category: item.category,
                    alt: item.alt,
                  })
                  .then(() => {
                    update(item.key, { status: "saved", percent: 100 });
                    resolve();
                  })
                  .catch((err: Error) => {
                    update(item.key, { status: "failed", error: err.message });
                    resolve();
                  });
              }
            },
            error: (err: Error) => {
              update(item.key, { status: "failed", error: err.message || "Upload failed" });
              resolve();
            },
          });
      }),
    [client],
  );

  // ---- Keep up to MAX_PARALLEL uploads running across all columns ----
  useEffect(() => {
    const waiting = queue.filter((q) => q.status === "waiting");
    const free = MAX_PARALLEL - activeRef.current;
    waiting.slice(0, Math.max(0, free)).forEach((item) => {
      activeRef.current += 1;
      // Mark immediately so the next render doesn't schedule it twice.
      item.status = "uploading";
      uploadOne(item).finally(() => {
        activeRef.current -= 1;
        setQueue((prev) => [...prev]);
      });
    });
  }, [queue, uploadOne]);

  // ---- Add files dropped (or chosen) in a category column ----
  const addFiles = (files: FileList | File[], category: GalleryCategoryValue) => {
    const list = Array.from(files);
    const media = list.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    const rejected = list.length - media.length;
    const bigVideos = media.filter((f) => f.type.startsWith("video/") && f.size > LARGE_VIDEO_BYTES).length;
    const alt = (batchAlt.trim() || defaultAltFor(category)).slice(0, 140);
    const title = GALLERY_CATEGORIES.find((c) => c.value === category)?.title ?? category;

    setQueue((prev) => [
      ...media.map((file) => ({
        key: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        isVideo: file.type.startsWith("video/"),
        status: "waiting" as const,
        percent: 0,
        category,
        alt,
      })),
      ...prev,
    ]);

    const parts = [];
    if (media.length) parts.push(`${media.length} file${media.length === 1 ? "" : "s"} added to ${title}.`);
    if (rejected) parts.push(`${rejected} skipped (only photos and videos can be uploaded).`);
    if (bigVideos) parts.push(`${bigVideos} video${bigVideos === 1 ? " is" : "s are"} over 100 MB and may upload slowly.`);
    setNotice(parts.join(" "));
  };

  const retry = (key: string) => update(key, { status: "waiting", percent: 0, error: undefined });
  const clearFinished = () =>
    setQueue((prev) => {
      prev.filter((q) => q.status === "saved").forEach((q) => URL.revokeObjectURL(q.previewUrl));
      return prev.filter((q) => q.status !== "saved");
    });

  // ---- Publish / delete drafts ----
  const setBusy = (ids: string[], on: boolean) =>
    setBusyIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
      return next;
    });

  const publish = async (ids: string[]) => {
    if (!ids.length) return;
    setBusy(ids, true);
    try {
      const docs = await client.fetch<Record<string, unknown>[]>(`*[_id in $ids]`, { ids });
      const tx = client.transaction();
      docs.forEach((doc) => {
        const draftId = doc._id as string;
        // Drop system fields; the published copy gets fresh ones.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _rev, _updatedAt, _createdAt, ...rest } = doc;
        tx.createOrReplace({ ...rest, _id: draftId.replace(/^drafts\./, ""), _type: "galleryItem" });
        tx.delete(draftId);
      });
      await tx.commit();
      setNotice(`${docs.length} item${docs.length === 1 ? "" : "s"} published to the gallery.`);
    } catch (err) {
      setNotice(`Publishing failed: ${(err as Error).message}`);
    } finally {
      setBusy(ids, false);
      loadDrafts();
    }
  };

  const removeDraft = async (id: string) => {
    if (!window.confirm("Delete this draft? The file will not appear on the site.")) return;
    setBusy([id], true);
    try {
      await client.delete(id);
    } catch (err) {
      setNotice(`Delete failed: ${(err as Error).message}`);
    } finally {
      setBusy([id], false);
      loadDrafts();
    }
  };

  // Move a published item to another category (also updates an unpublished edit, if any).
  const moveItem = async (id: string, category: GalleryCategoryValue) => {
    const title = GALLERY_CATEGORIES.find((c) => c.value === category)?.title ?? category;
    setBusy([id], true);
    try {
      const draftId = `drafts.${id}`;
      const hasDraft = await client.fetch<boolean>(`defined(*[_id == $draftId][0]._id)`, { draftId });
      const tx = client.transaction().patch(id, (p) => p.set({ category }));
      if (hasDraft) tx.patch(draftId, (p) => p.set({ category }));
      await tx.commit();
      setNotice(`Moved to ${title}. The website gallery updates within about a minute.`);
    } catch (err) {
      setNotice(`Move failed: ${(err as Error).message}`);
    } finally {
      setBusy([id], false);
      loadDrafts();
    }
  };

  // Remove an item from the website (published copy and any unpublished edit).
  const deleteLive = async (id: string) => {
    if (!window.confirm("Remove this from the website gallery? This can't be undone.")) return;
    setBusy([id], true);
    try {
      await client.transaction().delete(id).delete(`drafts.${id}`).commit();
      setNotice("Removed from the website gallery. It disappears within about a minute.");
    } catch (err) {
      setNotice(`Delete failed: ${(err as Error).message}`);
    } finally {
      setBusy([id], false);
      loadDrafts();
    }
  };

  // One-time copy of the website's original built-in photos into Sanity (published, same
  // categories, descriptions and order). Safe to re-run: already-copied photos are skipped.
  const runImport = async () => {
    if (!window.confirm(`Copy the website's ${BUILT_IN_PHOTOS.length} original gallery photos into Sanity so they can be moved or deleted here?`)) return;
    const existing = new Set(
      await client.fetch<string[]>(`*[_type == "galleryItem" && defined(legacyId)]._id`).catch(() => [] as string[]),
    );
    let done = 0;
    let failed = 0;
    setImportProgress({ done, total: BUILT_IN_PHOTOS.length, failed });
    // Oldest first, one at a time, so the gallery keeps its current order.
    for (const photo of BUILT_IN_PHOTOS) {
      const id = importedId(photo.id);
      if (!existing.has(id)) {
        try {
          const response = await fetch(photo.src);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const blob = await response.blob();
          const filename = photo.src.split("/").pop() || `photo-${photo.id}`;
          const asset = await client.assets.upload("file", blob, { filename, contentType: blob.type || undefined });
          await client.createIfNotExists({
            _id: id,
            _type: "galleryItem",
            media: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
            category: photo.category,
            alt: photo.alt.slice(0, 140),
            legacyId: Number(photo.id),
          });
        } catch {
          failed += 1;
        }
      }
      done += 1;
      setImportProgress({ done, total: BUILT_IN_PHOTOS.length, failed });
    }
    if (!failed) {
      await client.createOrReplace({
        _id: IMPORT_DOC_ID,
        _type: "galleryImport",
        completedAt: new Date().toISOString(),
        count: BUILT_IN_PHOTOS.length,
      });
      setNotice("All original photos are now managed here. Use \"On the website\" in each column to move or delete them.");
    } else {
      setNotice(`${failed} photo${failed === 1 ? "" : "s"} could not be copied. Click Import again to retry; copied photos are skipped.`);
    }
    loadDrafts();
  };

  const savedCount = useMemo(() => queue.filter((q) => q.status === "saved").length, [queue]);

  return (
    <div style={{ height: "100%", overflow: "auto", color: ui.text, fontFamily: font.body, background: ui.bg }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px 32px 80px", display: "grid", gap: 32 }}>
        <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <div style={{ minWidth: 260, flex: "1 1 420px" }}>
            <div style={eyebrow}>Loft 442 &nbsp;·&nbsp; Gallery</div>
            <h1 style={{ margin: "14px 0 0", fontFamily: font.display, fontWeight: 400, fontSize: 40, lineHeight: 1.1, color: ui.ivory }}>
              Upload photos &amp; videos
            </h1>
            <span style={{ display: "block", width: 56, height: 1, background: ui.gold, opacity: 0.7, margin: "18px 0" }} aria-hidden="true" />
            <p style={{ margin: 0, color: ui.muted, fontSize: 15, lineHeight: 1.7, maxWidth: 620 }}>
              Drop files into the column for their category. They are saved as drafts in that column; publish them to
              show them on the website gallery.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 10 }}>
            <div style={{ minWidth: 260 }}>
              <label htmlFor="upload-alt" style={{ ...eyebrow, display: "block", letterSpacing: "0.2em", color: ui.muted, marginBottom: 10 }}>
                Description for the next files (optional)
              </label>
              <input
                id="upload-alt"
                type="text"
                maxLength={140}
                value={batchAlt}
                onChange={(e) => setBatchAlt(e.target.value)}
                placeholder="Filled in automatically per category"
                style={{
                  width: "100%",
                  padding: "10px 0",
                  borderRadius: 0,
                  border: "none",
                  borderBottom: `1px solid ${ui.lineStrong}`,
                  background: "transparent",
                  color: ui.ivory,
                  fontFamily: font.body,
                  fontSize: 15,
                  outline: "none",
                }}
              />
            </div>
            <button
              type="button"
              style={buttonStyle(false, !savedCount)}
              disabled={!savedCount}
              onClick={clearFinished}
            >
              Clear finished
            </button>
            <button
              type="button"
              style={buttonStyle(true, !drafts.length || busyIds.size > 0)}
              disabled={!drafts.length || busyIds.size > 0}
              onClick={() => publish(drafts.map((d) => d._id))}
            >
              Publish all ({drafts.length})
            </button>
          </div>
        </header>

        {notice ? (
          <div role="status" style={{ borderLeft: `2px solid ${ui.gold}`, background: "rgba(201, 169, 97, 0.06)", padding: "12px 16px", fontSize: 14, color: ui.goldLight }}>
            {notice}
          </div>
        ) : null}

        {importDone === false ? (
          <section
            style={{
              border: `1px solid ${ui.goldSoft}`,
              background: "rgba(201, 169, 97, 0.05)",
              padding: "20px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <div style={eyebrow}>One-time setup</div>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6, color: ui.text }}>
                The website&apos;s original {BUILT_IN_PHOTOS.length} gallery photos aren&apos;t in Sanity yet, so they can&apos;t be moved or
                deleted here. Import copies them in once, keeping their categories, descriptions and order; the gallery looks the same.
              </p>
              {importProgress ? (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: ui.goldLight }}>
                    Copied {importProgress.done} of {importProgress.total}
                    {importProgress.failed ? ` · ${importProgress.failed} failed` : ""}
                  </div>
                  <div style={{ height: 2, background: ui.line, marginTop: 6 }}>
                    <div
                      style={{ height: 2, width: `${(importProgress.done / importProgress.total) * 100}%`, background: ui.gold }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              style={buttonStyle(true, Boolean(importProgress && importProgress.done < importProgress.total))}
              disabled={Boolean(importProgress && importProgress.done < importProgress.total)}
              onClick={runImport}
            >
              {importProgress && importProgress.done < importProgress.total ? "Importing…" : "Import existing photos"}
            </button>
          </section>
        ) : null}

        {/* One column per category */}
        <div style={{ display: "grid", gap: 1, background: ui.line, border: `1px solid ${ui.line}`, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", alignItems: "stretch" }}>
          {GALLERY_CATEGORIES.map((c) => (
            <CategoryColumn
              key={c.value}
              title={c.title}
              value={c.value}
              queue={queue.filter((q) => q.category === c.value)}
              drafts={drafts.filter((d) => d.category === c.value)}
              busyIds={busyIds}
              onFiles={addFiles}
              onRetry={retry}
              onPublish={publish}
              onDelete={removeDraft}
              live={live.filter((item) => item.category === c.value || (c.value === "Birthdays" && item.category === "Kids Parties"))}
              onMove={moveItem}
              onDeleteLive={deleteLive}
            />
          ))}
        </div>

        {/* Drafts with a category the columns don't cover (e.g. edited elsewhere) */}
        {drafts.some((d) => !GALLERY_CATEGORIES.some((c) => c.value === d.category)) ? (
          <p style={{ margin: 0, fontSize: 12, color: ui.muted }}>
            Some drafts have no category; open them from the Gallery list to set one before publishing.
          </p>
        ) : null}
      </div>
    </div>
  );
}
