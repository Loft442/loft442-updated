"use client";

/**
 * Studio "Upload" tool: one column per gallery category, each with its own drop zone.
 * Uploads become drafts; deletes, moves, and the one-time import are staged in a
 * Changes box. Nothing hits the live /gallery until Publish is pressed — then every
 * staged change is applied together and the website cache is refreshed once.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { useClient } from "sanity";
import { revalidateGalleryAction } from "@/lib/revalidateGalleryAction";
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

type PendingDelete = {
  kind: "delete";
  id: string;
  label: string;
  url?: string;
  mimeType?: string;
  category?: string;
};

type PendingMove = {
  kind: "move";
  id: string;
  from: string;
  to: GalleryCategoryValue;
  label: string;
  url?: string;
  mimeType?: string;
};

type PendingImport = {
  kind: "import";
};

type PendingChange = PendingDelete | PendingMove | PendingImport;

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

const categoryTitle = (value: string) =>
  GALLERY_CATEGORIES.find((c) => c.value === value)?.title ?? value;

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
  publishing: boolean;
  onFiles: (files: FileList | File[], category: GalleryCategoryValue) => void;
  onRetry: (key: string) => void;
  onDiscardDraft: (id: string) => void;
  live: DraftRow[];
  pendingDeleteIds: Set<string>;
  pendingMoves: Map<string, GalleryCategoryValue>;
  onMove: (id: string, category: GalleryCategoryValue) => void;
  onStageDelete: (item: DraftRow) => void;
};

function CategoryColumn({
  title,
  value,
  queue,
  drafts,
  publishing,
  onFiles,
  onRetry,
  onDiscardDraft,
  live,
  pendingDeleteIds,
  pendingMoves,
  onMove,
  onStageDelete,
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
          Drop to queue move to {title}
        </div>
      ) : null}
      <header style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${ui.line}` }}>
        <h2 style={{ margin: 0, fontFamily: font.display, fontWeight: 400, fontSize: 22, lineHeight: 1.2, color: ui.ivory, ...ellipsis }}>
          {title}
        </h2>
        <div style={{ ...eyebrow, marginTop: 8, color: drafts.length || inProgress ? ui.gold : ui.muted, letterSpacing: "0.22em" }}>
          {drafts.length} to add{inProgress ? ` · ${inProgress} uploading` : ""}
        </div>
      </header>

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
                        ? "Queued in Changes"
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

      <div style={{ borderTop: `1px solid ${ui.line}`, padding: 16, display: "grid", gap: 12 }}>
        <span style={{ ...eyebrow, letterSpacing: "0.2em", color: ui.muted, whiteSpace: "nowrap" }}>Waiting to add</span>
        {drafts.length ? (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
            {drafts.map((d) => {
              const isVideo = d.mimeType?.startsWith("video/") ?? false;
              return (
                <li key={d._id} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <Thumb url={d.url} isVideo={isVideo} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: font.body, fontSize: 13, color: ui.text, ...ellipsis }}>{d.alt || "No description"}</div>
                    <div style={{ fontFamily: font.body, fontSize: 11.2, color: ui.muted }}>In Changes box</div>
                  </div>
                  <button
                    type="button"
                    aria-label="Discard draft"
                    title="Discard draft"
                    style={buttonStyle(false, publishing, true)}
                    disabled={publishing}
                    onClick={() => onDiscardDraft(d._id)}
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

      <div style={{ borderTop: `1px solid ${ui.line}`, padding: 16 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <span style={{ ...eyebrow, letterSpacing: "0.2em", color: ui.gold }}>On the website</span>
            <span style={{ fontFamily: font.body, fontSize: 12, color: ui.muted }}>
              {live.length} {live.length === 1 ? "photo" : "photos"}
            </span>
          </div>
          <span style={{ fontFamily: font.body, fontSize: 11.5, color: ui.muted }}>
            Drag to another column to queue a move · ✕ to queue a delete. Publish applies them together.
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
              const isVideo = item.mimeType?.startsWith("video/") ?? false;
              const dragging = draggingId === item._id;
              const willDelete = pendingDeleteIds.has(item._id);
              const moveTo = pendingMoves.get(item._id);
              return (
                <li
                  key={item._id}
                  draggable={!publishing && !willDelete}
                  title={`${item.alt || "No description"} · drag onto another column to queue a move`}
                  onDragStart={(e) => {
                    e.dataTransfer.setData(ITEM_MIME, JSON.stringify({ id: item._id, from: value }));
                    e.dataTransfer.effectAllowed = "move";
                    setDraggingId(item._id);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    border: `1px solid ${willDelete ? "rgba(242, 167, 167, 0.55)" : moveTo ? ui.goldSoft : ui.line}`,
                    background: "#1a1a1b",
                    cursor: publishing || willDelete ? "default" : "grab",
                    opacity: willDelete ? 0.45 : dragging ? 0.35 : 1,
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
                  {willDelete || moveTo || isVideo ? (
                    <span
                      style={{
                        position: "absolute",
                        left: 6,
                        bottom: 6,
                        padding: "2px 6px",
                        background: "rgba(7,7,8,0.75)",
                        color: willDelete ? ui.danger : ui.goldLight,
                        fontFamily: font.body,
                        fontSize: 10.5,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {willDelete ? "Will delete" : moveTo ? `→ ${categoryTitle(moveTo)}` : "Video"}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    aria-label={willDelete ? `Undo delete for ${item.alt || "this photo"}` : `Queue delete for ${item.alt || "this photo"}`}
                    title={willDelete ? "Undo delete" : "Queue delete"}
                    disabled={publishing}
                    onClick={() => onStageDelete(item)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 28,
                      height: 28,
                      display: "grid",
                      placeItems: "center",
                      border: `1px solid ${willDelete ? ui.goldSoft : "rgba(242, 167, 167, 0.6)"}`,
                      background: "rgba(7, 7, 8, 0.8)",
                      color: willDelete ? ui.goldLight : ui.danger,
                      fontSize: 14,
                      lineHeight: 1,
                      cursor: publishing ? "not-allowed" : "pointer",
                      borderRadius: 0,
                    }}
                  >
                    {willDelete ? "↺" : "✕"}
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
  const [live, setLive] = useState<DraftRow[]>([]);
  const [importDone, setImportDone] = useState<boolean | null>(null);
  const [importProgress, setImportProgress] = useState<{ done: number; total: number; failed: number } | null>(null);
  const [pending, setPending] = useState<PendingChange[]>([]);
  const [publishing, setPublishing] = useState(false);
  const activeRef = useRef(0);
  /** Keys currently being uploaded — prevents the scheduler from starting the same item twice. */
  const inFlightKeysRef = useRef(new Set<string>());

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

  const queueRef = useRef(queue);
  queueRef.current = queue;
  useEffect(() => () => queueRef.current.forEach((q) => URL.revokeObjectURL(q.previewUrl)), []);

  const update = (key: string, patch: Partial<QueueItem>) =>
    setQueue((prev) => prev.map((q) => (q.key === key ? { ...q, ...patch } : q)));

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

  useEffect(() => {
    const waiting = queue.filter(
      (q) => q.status === "waiting" && !inFlightKeysRef.current.has(q.key),
    );
    const free = MAX_PARALLEL - activeRef.current;
    const toStart = waiting.slice(0, Math.max(0, free));
    if (!toStart.length) return;

    // Mark in React state before starting work so a re-run can't pick the same items.
    const startKeys = new Set(toStart.map((item) => item.key));
    toStart.forEach((item) => inFlightKeysRef.current.add(item.key));
    activeRef.current += toStart.length;
    setQueue((prev) =>
      prev.map((q) => (startKeys.has(q.key) ? { ...q, status: "uploading" as const, percent: 0, error: undefined } : q)),
    );

    toStart.forEach((item) => {
      uploadOne(item).finally(() => {
        inFlightKeysRef.current.delete(item.key);
        activeRef.current = Math.max(0, activeRef.current - 1);
        // Nudge the effect so the next waiting items can start.
        setQueue((prev) => [...prev]);
      });
    });
  }, [queue, uploadOne]);

  const addFiles = (files: FileList | File[], category: GalleryCategoryValue) => {
    const list = Array.from(files);
    const media = list.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    const rejected = list.length - media.length;
    const bigVideos = media.filter((f) => f.type.startsWith("video/") && f.size > LARGE_VIDEO_BYTES).length;
    const alt = (batchAlt.trim() || defaultAltFor(category)).slice(0, 140);
    const title = categoryTitle(category);

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
    if (media.length) parts.push(`${media.length} file${media.length === 1 ? "" : "s"} added to ${title} — they appear in Changes when upload finishes.`);
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

  const pushToWebsite = useCallback(async (): Promise<boolean> => {
    try {
      await revalidateGalleryAction();
      return true;
    } catch (err) {
      console.error("[gallery] Failed to refresh website cache", err);
      return false;
    }
  }, []);

  const pendingDeletes = useMemo(
    () => pending.filter((c): c is PendingDelete => c.kind === "delete"),
    [pending],
  );
  const pendingMoves = useMemo(
    () => pending.filter((c): c is PendingMove => c.kind === "move"),
    [pending],
  );
  const pendingImport = useMemo(
    () => pending.find((c): c is PendingImport => c.kind === "import"),
    [pending],
  );
  const pendingDeleteIds = useMemo(() => new Set(pendingDeletes.map((c) => c.id)), [pendingDeletes]);
  const pendingMoveMap = useMemo(() => {
    const map = new Map<string, GalleryCategoryValue>();
    pendingMoves.forEach((c) => map.set(c.id, c.to));
    return map;
  }, [pendingMoves]);

  /** Live items as they will look after Publish (moves applied, deletes still visible but marked). */
  const previewLive = useMemo(
    () =>
      live.map((item) => {
        const to = pendingMoveMap.get(item._id);
        return to ? { ...item, category: to } : item;
      }),
    [live, pendingMoveMap],
  );

  const changeCount = drafts.length + pending.length;

  const stageDelete = (item: DraftRow) => {
    setPending((prev) => {
      const already = prev.some((c) => c.kind === "delete" && c.id === item._id);
      if (already) {
        return prev.filter((c) => !(c.kind === "delete" && c.id === item._id));
      }
      // Delete wins over a queued move for the same item.
      const withoutMove = prev.filter((c) => !(c.kind === "move" && c.id === item._id));
      return [
        ...withoutMove,
        {
          kind: "delete",
          id: item._id,
          label: item.alt || "Untitled photo",
          url: item.url,
          mimeType: item.mimeType,
          category: item.category,
        },
      ];
    });
    setNotice("Delete queued in Changes. Press Publish to apply it with any other changes.");
  };

  const stageMove = (id: string, category: GalleryCategoryValue) => {
    const item = live.find((row) => row._id === id);
    if (!item) return;
    if (pendingDeleteIds.has(id)) {
      setNotice("That photo is queued to delete. Undo the delete first if you want to move it.");
      return;
    }
    const from = item.category || "Unknown";
    if (from === category) {
      setPending((prev) => prev.filter((c) => !(c.kind === "move" && c.id === id)));
      return;
    }
    setPending((prev) => {
      const others = prev.filter((c) => !(c.kind === "move" && c.id === id));
      return [
        ...others,
        {
          kind: "move",
          id,
          from,
          to: category,
          label: item.alt || "Untitled photo",
          url: item.url,
          mimeType: item.mimeType,
        },
      ];
    });
    setNotice(`Move to ${categoryTitle(category)} queued in Changes. Press Publish to apply.`);
  };

  const stageImport = () => {
    if (pendingImport) {
      setPending((prev) => prev.filter((c) => c.kind !== "import"));
      setNotice("Import removed from Changes.");
      return;
    }
    if (
      !window.confirm(
        `Queue importing the website's ${BUILT_IN_PHOTOS.length} original gallery photos? They will be copied when you press Publish.`,
      )
    ) {
      return;
    }
    setPending((prev) => [...prev.filter((c) => c.kind !== "import"), { kind: "import" }]);
    setNotice("Import queued in Changes. Press Publish to copy the original photos into Sanity.");
  };

  const removePending = (change: PendingChange) => {
    setPending((prev) =>
      prev.filter((c) => {
        if (change.kind === "import") return c.kind !== "import";
        if (change.kind === "delete") return !(c.kind === "delete" && c.id === change.id);
        if (change.kind === "move") return !(c.kind === "move" && c.id === change.id);
        return true;
      }),
    );
  };

  const clearPending = () => {
    if (!pending.length) return;
    if (!window.confirm("Clear all queued deletes, moves, and import from Changes? Draft uploads are kept.")) return;
    setPending([]);
    setNotice("Queued website changes cleared. Draft uploads are still waiting to be published.");
  };

  const discardDraft = async (id: string) => {
    if (!window.confirm("Discard this upload? It will not be published.")) return;
    try {
      await client.delete(id);
      setNotice("Draft discarded.");
    } catch (err) {
      setNotice(`Discard failed: ${(err as Error).message}`);
    } finally {
      loadDrafts();
    }
  };

  const runImportNow = async (): Promise<{ failed: number }> => {
    const existing = new Set(
      await client.fetch<string[]>(`*[_type == "galleryItem" && defined(legacyId)]._id`).catch(() => [] as string[]),
    );
    let done = 0;
    let failed = 0;
    setImportProgress({ done, total: BUILT_IN_PHOTOS.length, failed });
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
    }
    return { failed };
  };

  const publishAllChanges = async () => {
    if (!changeCount) return;
    if (publishing) return;
    if (
      !window.confirm(
        `Publish ${changeCount} change${changeCount === 1 ? "" : "s"} to the website now? New uploads, deletes, moves, and import (if queued) will all apply together.`,
      )
    ) {
      return;
    }

    setPublishing(true);
    setNotice("Publishing all changes…");
    const hadImport = Boolean(pendingImport);
    const appliedCount = changeCount;

    try {
      // Transaction first (adds / moves / deletes). Import runs after so a failed
      // commit does not leave newly imported originals live on their own.
      const draftIds = drafts.map((d) => d._id);
      const docs = draftIds.length
        ? await client.fetch<Record<string, unknown>[]>(`*[_id in $ids]`, { ids: draftIds })
        : [];

      const movesToApply = pendingMoves.filter((move) => !pendingDeleteIds.has(move.id));
      const moveDraftIds = movesToApply.map((move) => `drafts.${move.id}`);
      const existingMoveDrafts = moveDraftIds.length
        ? new Set(
            await client
              .fetch<string[]>(`*[_id in $ids]._id`, { ids: moveDraftIds })
              .catch(() => [] as string[]),
          )
        : new Set<string>();

      const tx = client.transaction();
      docs.forEach((doc) => {
        const draftId = doc._id as string;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _rev, _updatedAt, _createdAt, ...rest } = doc;
        tx.createOrReplace({ ...rest, _id: draftId.replace(/^drafts\./, ""), _type: "galleryItem" });
        tx.delete(draftId);
      });

      movesToApply.forEach((move) => {
        tx.patch(move.id, (p) => p.set({ category: move.to }));
        const draftId = `drafts.${move.id}`;
        if (existingMoveDrafts.has(draftId)) {
          tx.patch(draftId, (p) => p.set({ category: move.to }));
        }
      });

      pendingDeletes.forEach((del) => {
        tx.delete(del.id);
        tx.delete(`drafts.${del.id}`);
      });

      if (docs.length || movesToApply.length || pendingDeletes.length) {
        await tx.commit();
      }

      // Clears applied staging; keep import queued until it finishes successfully.
      setPending((prev) => prev.filter((c) => c.kind === "import"));

      if (hadImport) {
        const result = await runImportNow();
        if (result.failed) {
          throw new Error(
            `${result.failed} original photo${result.failed === 1 ? "" : "s"} could not be imported. Other changes were saved — retry Publish for the import.`,
          );
        }
        setPending([]);
      }

      const refreshed = await pushToWebsite();
      if (!refreshed) {
        // One retry — Sanity can lag briefly after a large commit.
        const retried = await pushToWebsite();
        if (!retried) {
          setNotice(
            `Saved ${appliedCount} change${appliedCount === 1 ? "" : "s"} in Sanity, but the live gallery cache did not refresh. Click “Push to website now”, then hard-refresh /gallery.`,
          );
          return;
        }
      }

      setNotice(`Published ${appliedCount} change${appliedCount === 1 ? "" : "s"} together. Website gallery is updated.`);
    } catch (err) {
      setNotice(`Publish failed: ${(err as Error).message}`);
    } finally {
      setPublishing(false);
      setImportProgress(null);
      loadDrafts();
    }
  };

  const forcePushToWebsite = async () => {
    setNotice("Refreshing the live gallery…");
    const refreshed = await pushToWebsite();
    setNotice(
      refreshed
        ? "Website gallery refreshed. Open /gallery and hard-refresh (Ctrl+Shift+R) if needed."
        : "Could not refresh the website cache. Redeploy the site, or wait up to an hour.",
    );
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
              Queue uploads, deletes, moves, and import in the Changes box. Press Publish once to apply everything to the
              website together.
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
            <button type="button" style={buttonStyle(false, publishing)} disabled={publishing} onClick={forcePushToWebsite}>
              Push to website now
            </button>
            <button
              type="button"
              style={buttonStyle(false, !savedCount || publishing)}
              disabled={!savedCount || publishing}
              onClick={clearFinished}
            >
              Clear finished
            </button>
            <button
              type="button"
              style={buttonStyle(true, !changeCount || publishing)}
              disabled={!changeCount || publishing}
              onClick={publishAllChanges}
            >
              {publishing ? "Publishing…" : `Publish (${changeCount})`}
            </button>
          </div>
        </header>

        {notice ? (
          <div role="status" style={{ borderLeft: `2px solid ${ui.gold}`, background: "rgba(201, 169, 97, 0.06)", padding: "12px 16px", fontSize: 14, color: ui.goldLight }}>
            {notice}
          </div>
        ) : null}

        {/* Changes box: every staged website update before Publish */}
        <section
          aria-label="Changes waiting to publish"
          style={{
            border: `1px solid ${changeCount ? ui.goldSoft : ui.line}`,
            background: changeCount ? "rgba(201, 169, 97, 0.05)" : ui.panel,
            padding: "20px 24px",
            display: "grid",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={eyebrow}>Changes</div>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6, color: ui.text, maxWidth: 720 }}>
                {changeCount
                  ? `${changeCount} change${changeCount === 1 ? "" : "s"} waiting. Publish applies adds, deletes, moves, and import at the same time.`
                  : "No changes yet. Upload photos, queue deletes or moves, or queue the original-photo import — then Publish."}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button type="button" style={buttonStyle(false, !pending.length || publishing, true)} disabled={!pending.length || publishing} onClick={clearPending}>
                Clear queued
              </button>
              <button type="button" style={buttonStyle(true, !changeCount || publishing)} disabled={!changeCount || publishing} onClick={publishAllChanges}>
                {publishing ? "Publishing…" : `Publish all (${changeCount})`}
              </button>
            </div>
          </div>

          {changeCount ? (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
              {drafts.map((d) => {
                const isVideo = d.mimeType?.startsWith("video/") ?? false;
                return (
                  <li
                    key={`add-${d._id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      border: `1px solid ${ui.line}`,
                      background: "rgba(7,7,8,0.35)",
                      minWidth: 0,
                    }}
                  >
                    <Thumb url={d.url} isVideo={isVideo} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...eyebrow, letterSpacing: "0.18em", color: ui.gold, marginBottom: 4 }}>Add</div>
                      <div style={{ fontFamily: font.body, fontSize: 14, color: ui.ivory, ...ellipsis }}>{d.alt || "No description"}</div>
                      <div style={{ fontFamily: font.body, fontSize: 12, color: ui.muted }}>
                        {categoryTitle(d.category || "")} · {isVideo ? "Video" : "Photo"}
                      </div>
                    </div>
                    <button type="button" style={buttonStyle(false, publishing, true)} disabled={publishing} onClick={() => discardDraft(d._id)}>
                      Remove
                    </button>
                  </li>
                );
              })}

              {pendingMoves.map((move) => {
                const isVideo = move.mimeType?.startsWith("video/") ?? false;
                return (
                  <li
                    key={`move-${move.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      border: `1px solid ${ui.line}`,
                      background: "rgba(7,7,8,0.35)",
                      minWidth: 0,
                    }}
                  >
                    <Thumb url={move.url} isVideo={isVideo} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...eyebrow, letterSpacing: "0.18em", color: ui.gold, marginBottom: 4 }}>Move</div>
                      <div style={{ fontFamily: font.body, fontSize: 14, color: ui.ivory, ...ellipsis }}>{move.label}</div>
                      <div style={{ fontFamily: font.body, fontSize: 12, color: ui.muted }}>
                        {categoryTitle(move.from)} → {categoryTitle(move.to)}
                      </div>
                    </div>
                    <button type="button" style={buttonStyle(false, publishing, true)} disabled={publishing} onClick={() => removePending(move)}>
                      Undo
                    </button>
                  </li>
                );
              })}

              {pendingDeletes.map((del) => {
                const isVideo = del.mimeType?.startsWith("video/") ?? false;
                return (
                  <li
                    key={`del-${del.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      border: `1px solid rgba(242, 167, 167, 0.35)`,
                      background: "rgba(7,7,8,0.35)",
                      minWidth: 0,
                    }}
                  >
                    <Thumb url={del.url} isVideo={isVideo} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...eyebrow, letterSpacing: "0.18em", color: ui.danger, marginBottom: 4 }}>Delete</div>
                      <div style={{ fontFamily: font.body, fontSize: 14, color: ui.ivory, ...ellipsis }}>{del.label}</div>
                      <div style={{ fontFamily: font.body, fontSize: 12, color: ui.muted }}>
                        {categoryTitle(del.category || "")} · removed from site on Publish
                      </div>
                    </div>
                    <button type="button" style={buttonStyle(false, publishing, true)} disabled={publishing} onClick={() => removePending(del)}>
                      Undo
                    </button>
                  </li>
                );
              })}

              {pendingImport ? (
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    border: `1px solid ${ui.line}`,
                    background: "rgba(7,7,8,0.35)",
                    minWidth: 0,
                  }}
                >
                  <div style={{ width: 40, height: 40, border: `1px solid ${ui.line}`, display: "grid", placeItems: "center", color: ui.gold, fontSize: 18 }}>
                    ↓
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...eyebrow, letterSpacing: "0.18em", color: ui.gold, marginBottom: 4 }}>Import</div>
                    <div style={{ fontFamily: font.body, fontSize: 14, color: ui.ivory }}>
                      Copy {BUILT_IN_PHOTOS.length} original website photos into Sanity
                    </div>
                    <div style={{ fontFamily: font.body, fontSize: 12, color: ui.muted }}>Runs when you press Publish</div>
                  </div>
                  <button
                    type="button"
                    style={buttonStyle(false, publishing, true)}
                    disabled={publishing}
                    onClick={() => removePending(pendingImport)}
                  >
                    Undo
                  </button>
                </li>
              ) : null}
            </ul>
          ) : null}

          {publishing && importProgress ? (
            <div>
              <div style={{ fontSize: 12, color: ui.goldLight }}>
                Importing {importProgress.done} of {importProgress.total}
                {importProgress.failed ? ` · ${importProgress.failed} failed` : ""}
              </div>
              <div style={{ height: 2, background: ui.line, marginTop: 6 }}>
                <div
                  style={{ height: 2, width: `${(importProgress.done / importProgress.total) * 100}%`, background: ui.gold }}
                />
              </div>
            </div>
          ) : null}
        </section>

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
                The website&apos;s original {BUILT_IN_PHOTOS.length} gallery photos aren&apos;t in Sanity yet. Queue the import
                into Changes, then Publish with any other edits.
              </p>
            </div>
            <button type="button" style={buttonStyle(true, publishing)} disabled={publishing} onClick={stageImport}>
              {pendingImport ? "Remove import from Changes" : "Queue import in Changes"}
            </button>
          </section>
        ) : null}

        <div style={{ display: "grid", gap: 1, background: ui.line, border: `1px solid ${ui.line}`, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", alignItems: "stretch" }}>
          {GALLERY_CATEGORIES.map((c) => (
            <CategoryColumn
              key={c.value}
              title={c.title}
              value={c.value}
              queue={queue.filter((q) => q.category === c.value)}
              drafts={drafts.filter((d) => d.category === c.value)}
              publishing={publishing}
              onFiles={addFiles}
              onRetry={retry}
              onDiscardDraft={discardDraft}
              live={previewLive.filter(
                (item) => item.category === c.value || (c.value === "Birthdays" && item.category === "Kids Parties"),
              )}
              pendingDeleteIds={pendingDeleteIds}
              pendingMoves={pendingMoveMap}
              onMove={stageMove}
              onStageDelete={stageDelete}
            />
          ))}
        </div>

        {drafts.some((d) => !GALLERY_CATEGORIES.some((c) => c.value === d.category)) ? (
          <p style={{ margin: 0, fontSize: 12, color: ui.muted }}>
            Some drafts have no category; open them from the Gallery list to set one before publishing.
          </p>
        ) : null}
      </div>
    </div>
  );
}
