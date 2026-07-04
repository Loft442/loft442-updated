"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type MagnifierImageProps = {
  src: string;
  alt: string;
  zoom?: number;
};

const DESKTOP_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const PANE_HEIGHT_SCALE = 0.5;
const MIN_TOUCH_SCALE = 1;
const MAX_TOUCH_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const DOUBLE_TAP_MS = 300;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getTouchDistance(touches: React.TouchList | TouchList) {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function getTouchCenter(touches: React.TouchList | TouchList) {
  if (touches.length < 2) {
    return { x: touches[0].clientX, y: touches[0].clientY };
  }
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

export default function MagnifierImage({
  src,
  alt,
  zoom = 2,
}: MagnifierImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const zoomPaneRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const touchContainerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const activeRef = useRef(false);

  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [touchScale, setTouchScale] = useState(MIN_TOUCH_SCALE);
  const [touchTranslate, setTouchTranslate] = useState({ x: 0, y: 0 });
  const [showMobileHint, setShowMobileHint] = useState(true);
  const [isTouchActive, setIsTouchActive] = useState(false);

  const touchGestureRef = useRef({
    initialDistance: 0,
    initialScale: MIN_TOUCH_SCALE,
    initialTranslate: { x: 0, y: 0 },
    initialCenter: { x: 0, y: 0 },
    lastPanPoint: { x: 0, y: 0 },
    isPinching: false,
    isPanning: false,
    lastTapTime: 0,
  });

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_POINTER_QUERY);
    const syncEnabled = () => setMagnifierEnabled(media.matches);
    syncEnabled();
    media.addEventListener("change", syncEnabled);
    return () => media.removeEventListener("change", syncEnabled);
  }, []);

  const dismissMobileHint = useCallback(() => {
    setShowMobileHint(false);
  }, []);

  const clampTouchTranslate = useCallback(
    (nextScale: number, nextTranslate: { x: number; y: number }) => {
      const container = touchContainerRef.current;
      const img = imgRef.current;
      if (!container || !img || nextScale <= MIN_TOUCH_SCALE) {
        return { x: 0, y: 0 };
      }

      const containerRect = container.getBoundingClientRect();
      const baseWidth = img.offsetWidth;
      const baseHeight = img.offsetHeight;
      if (baseWidth === 0 || baseHeight === 0) {
        return { x: 0, y: 0 };
      }

      const scaledWidth = baseWidth * nextScale;
      const scaledHeight = baseHeight * nextScale;

      const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2);
      const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2);

      return {
        x: clamp(nextTranslate.x, -maxX, maxX),
        y: clamp(nextTranslate.y, -maxY, maxY),
      };
    },
    []
  );

  const applyTouchTransform = useCallback(
    (scale: number, translate: { x: number; y: number }) => {
      const clampedScale = clamp(scale, MIN_TOUCH_SCALE, MAX_TOUCH_SCALE);
      const clampedTranslate =
        clampedScale <= MIN_TOUCH_SCALE
          ? { x: 0, y: 0 }
          : clampTouchTranslate(clampedScale, translate);

      setTouchScale(clampedScale);
      setTouchTranslate(clampedTranslate);
    },
    [clampTouchTranslate]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (magnifierEnabled) return;

      dismissMobileHint();

      const touches = event.touches;
      const gesture = touchGestureRef.current;

      if (touches.length === 2) {
        setIsTouchActive(true);
        gesture.isPinching = true;
        gesture.isPanning = false;
        gesture.initialDistance = getTouchDistance(touches);
        gesture.initialScale = touchScale;
        gesture.initialTranslate = { ...touchTranslate };
        gesture.initialCenter = getTouchCenter(touches);
        return;
      }

      if (touches.length === 1) {
        const now = Date.now();
        const timeSinceLastTap = now - gesture.lastTapTime;

        if (timeSinceLastTap < DOUBLE_TAP_MS) {
          event.preventDefault();
          gesture.lastTapTime = 0;

          if (touchScale > MIN_TOUCH_SCALE + 0.05) {
            applyTouchTransform(MIN_TOUCH_SCALE, { x: 0, y: 0 });
            return;
          }

          const container = touchContainerRef.current;
          const img = imgRef.current;
          if (!container || !img) return;

          const containerRect = container.getBoundingClientRect();
          const tapX = touches[0].clientX;
          const tapY = touches[0].clientY;

          const offsetX = tapX - (containerRect.left + containerRect.width / 2);
          const offsetY = tapY - (containerRect.top + containerRect.height / 2);

          const nextScale = DOUBLE_TAP_SCALE;
          const scaleRatio = nextScale / touchScale;
          const nextTranslate = {
            x: touchTranslate.x - offsetX * (scaleRatio - 1),
            y: touchTranslate.y - offsetY * (scaleRatio - 1),
          };

          applyTouchTransform(nextScale, nextTranslate);
          return;
        }

        gesture.lastTapTime = now;

        if (touchScale > MIN_TOUCH_SCALE) {
          setIsTouchActive(true);
          gesture.isPanning = true;
          gesture.isPinching = false;
          gesture.lastPanPoint = {
            x: touches[0].clientX,
            y: touches[0].clientY,
          };
        }
      }
    },
    [
      magnifierEnabled,
      dismissMobileHint,
      touchScale,
      touchTranslate,
      applyTouchTransform,
    ]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (magnifierEnabled) return;

      const touches = event.touches;
      const gesture = touchGestureRef.current;

      if (gesture.isPinching && touches.length >= 2) {
        event.preventDefault();
        dismissMobileHint();

        const distance = getTouchDistance(touches);
        if (gesture.initialDistance === 0) return;

        const scaleFactor = distance / gesture.initialDistance;
        const nextScale = clamp(
          gesture.initialScale * scaleFactor,
          MIN_TOUCH_SCALE,
          MAX_TOUCH_SCALE
        );

        const center = getTouchCenter(touches);
        const centerDeltaX = center.x - gesture.initialCenter.x;
        const centerDeltaY = center.y - gesture.initialCenter.y;

        const scaleRatio = nextScale / gesture.initialScale;
        const nextTranslate = {
          x:
            gesture.initialTranslate.x * scaleRatio +
            centerDeltaX * (scaleRatio - 1),
          y:
            gesture.initialTranslate.y * scaleRatio +
            centerDeltaY * (scaleRatio - 1),
        };

        applyTouchTransform(nextScale, nextTranslate);
        return;
      }

      if (gesture.isPanning && touches.length === 1 && touchScale > MIN_TOUCH_SCALE) {
        event.preventDefault();
        dismissMobileHint();

        const deltaX = touches[0].clientX - gesture.lastPanPoint.x;
        const deltaY = touches[0].clientY - gesture.lastPanPoint.y;

        gesture.lastPanPoint = {
          x: touches[0].clientX,
          y: touches[0].clientY,
        };

        applyTouchTransform(touchScale, {
          x: touchTranslate.x + deltaX,
          y: touchTranslate.y + deltaY,
        });
      }
    },
    [
      magnifierEnabled,
      dismissMobileHint,
      touchScale,
      touchTranslate,
      applyTouchTransform,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    if (magnifierEnabled) return;

    const gesture = touchGestureRef.current;
    gesture.isPinching = false;
    gesture.isPanning = false;
    gesture.initialDistance = 0;
    setIsTouchActive(false);

    if (touchScale <= MIN_TOUCH_SCALE + 0.05) {
      applyTouchTransform(MIN_TOUCH_SCALE, { x: 0, y: 0 });
    }
  }, [magnifierEnabled, touchScale, applyTouchTransform]);

  const hideZoomPane = useCallback(() => {
    activeRef.current = false;
    setIsHovering(false);
    if (lensRef.current) {
      lensRef.current.style.opacity = "0";
    }
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const update = useCallback(() => {
    frameRef.current = null;
    if (!activeRef.current) return;

    const img = imgRef.current;
    const pane = zoomPaneRef.current;
    if (!img || !pane) return;

    const rect = img.getBoundingClientRect();
    const x = pointerRef.current.x - rect.left;
    const y = pointerRef.current.y - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setIsHovering(false);
      if (lensRef.current) {
        lensRef.current.style.opacity = "0";
      }
      return;
    }

    setIsHovering(true);

    const paneWidth = pane.offsetWidth;
    const paneHeight = pane.offsetHeight;

    if (paneWidth === 0 || paneHeight === 0) return;

    const scaledWidth = rect.width * zoom;
    const scaledHeight = rect.height * zoom;
    const minX = Math.min(0, paneWidth - scaledWidth);
    const minY = Math.min(0, paneHeight - scaledHeight);
    const bgX = clamp(-(x * zoom - paneWidth / 2), minX, 0);
    const bgY = clamp(-(y * zoom - paneHeight / 2), minY, 0);

    pane.style.backgroundImage = `url("${src}")`;
    pane.style.backgroundRepeat = "no-repeat";
    pane.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
    pane.style.backgroundPosition = `${bgX}px ${bgY}px`;

    const lens = lensRef.current;
    if (lens) {
      lens.style.left = `${-bgX / zoom}px`;
      lens.style.top = `${-bgY / zoom}px`;
      lens.style.width = `${paneWidth / zoom}px`;
      lens.style.height = `${paneHeight / zoom}px`;
      lens.style.opacity = "1";
    }
  }, [src, zoom]);

  const queueUpdate = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      update();
    });
  }, [update]);

  const syncPaneSize = useCallback(() => {
    const img = imgRef.current;
    const pane = zoomPaneRef.current;
    if (!img || !pane) return;

    const { width, height } = img.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    pane.style.width = "";
    pane.style.height = `${height * PANE_HEIGHT_SCALE}px`;

    if (activeRef.current) {
      queueUpdate();
    }
  }, [queueUpdate]);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLImageElement>) => {
      if (!magnifierEnabled) return;
      activeRef.current = true;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      queueUpdate();
    },
    [magnifierEnabled, queueUpdate]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLImageElement>) => {
      if (!magnifierEnabled) return;
      activeRef.current = true;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      queueUpdate();
    },
    [magnifierEnabled, queueUpdate]
  );

  const handleMouseLeave = useCallback(() => {
    hideZoomPane();
  }, [hideZoomPane]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!magnifierEnabled) return;

    const img = imgRef.current;
    if (!img) return;

    syncPaneSize();

    const observer = new ResizeObserver(() => {
      syncPaneSize();
    });

    observer.observe(img);
    if (zoomPaneRef.current) {
      observer.observe(zoomPaneRef.current);
    }
    return () => observer.disconnect();
  }, [magnifierEnabled, src, syncPaneSize]);

  useEffect(() => {
    if (magnifierEnabled) {
      setTouchScale(MIN_TOUCH_SCALE);
      setTouchTranslate({ x: 0, y: 0 });
      setShowMobileHint(true);
    }
  }, [magnifierEnabled, src]);

  useEffect(() => {
    if (magnifierEnabled) return;

    const container = touchContainerRef.current;
    if (!container) return;

    const resetTouchView = () => {
      applyTouchTransform(MIN_TOUCH_SCALE, { x: 0, y: 0 });
    };

    const observer = new ResizeObserver(resetTouchView);
    observer.observe(container);

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", resetTouchView);
    viewport?.addEventListener("scroll", resetTouchView);

    return () => {
      observer.disconnect();
      viewport?.removeEventListener("resize", resetTouchView);
      viewport?.removeEventListener("scroll", resetTouchView);
    };
  }, [magnifierEnabled, src, applyTouchTransform]);

  const touchTransformStyle =
    !magnifierEnabled
      ? {
          transform: `translate(${touchTranslate.x}px, ${touchTranslate.y}px) scale(${touchScale})`,
          transformOrigin: "center center",
          transition: isTouchActive ? "none" : "transform 0.2s ease-out",
        }
      : undefined;

  const gridClassName = magnifierEnabled
    ? "grid h-full min-h-0 w-full grid-cols-1 [grid-template-rows:minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-6"
    : "grid h-full min-h-0 w-full grid-cols-1 [grid-template-rows:minmax(0,1fr)]";

  return (
    <div className={gridClassName}>
      <div
        ref={touchContainerRef}
        className={`relative flex h-full min-h-0 w-full items-center justify-center${
          magnifierEnabled ? "" : " touch-none overflow-hidden"
        }`}
        onTouchStart={magnifierEnabled ? undefined : handleTouchStart}
        onTouchMove={magnifierEnabled ? undefined : handleTouchMove}
        onTouchEnd={magnifierEnabled ? undefined : handleTouchEnd}
        onTouchCancel={magnifierEnabled ? undefined : handleTouchEnd}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={touchTransformStyle}
        >
          <div className="relative flex h-full w-full max-h-full max-w-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              draggable={false}
              className="block h-auto max-h-full w-auto max-w-full select-none object-contain"
              onLoad={magnifierEnabled ? syncPaneSize : undefined}
              onMouseEnter={magnifierEnabled ? handleMouseEnter : undefined}
              onMouseMove={magnifierEnabled ? handleMouseMove : undefined}
              onMouseLeave={magnifierEnabled ? handleMouseLeave : undefined}
            />
            {magnifierEnabled ? (
              <div
                ref={lensRef}
                aria-hidden
                className="pointer-events-none absolute border-2 border-[#d4af37] opacity-0 shadow-[0_0_12px_rgba(212,175,55,0.65),0_0_24px_rgba(212,175,55,0.35)]"
              />
            ) : null}
          </div>
        </div>

        {!magnifierEnabled && showMobileHint ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center px-4 md:hidden"
          >
            <p className="rounded-sm border border-white/30 bg-black/70 px-3 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/90">
              Pinch or double-tap to zoom
            </p>
          </div>
        ) : null}
      </div>

      {magnifierEnabled ? (
        <div className="hidden min-h-0 w-full md:flex md:items-center">
          <div
            ref={zoomPaneRef}
            aria-hidden
            className="relative w-full shrink-0 overflow-hidden rounded-sm border-2 border-white/30 bg-black/80 shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
          >
            {!isHovering ? (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <p className="rounded-sm border border-black bg-white px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.35em] text-black">
                  Hover the flyer to zoom
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
