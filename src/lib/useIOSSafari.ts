"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

export function getScrollY(): number {
    if (typeof window === "undefined") {
        return 0;
    }

    return (
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
    );
}

/**
 * Detects if the current browser is iOS Safari.
 * Uses useSyncExternalStore for proper SSR/hydration handling.
 */
function getIsIOSSafari(): boolean {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return false;
    }
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return isIOS && isSafari;
}

const subscribe = () => () => { }; // Browser detection doesn't change

export function useIsIOSSafari(): boolean {
    return useSyncExternalStore(
        subscribe,
        getIsIOSSafari,
        () => false // Server snapshot
    );
}

/**
 * Lock body scroll for modals on iOS Safari.
 * Uses position fixed approach to prevent scroll-behind.
 */
export function useLockBodyScroll(lock: boolean, scrollY?: number): void {
    useLayoutEffect(() => {
        if (!lock) return;

        const lockedScrollY = scrollY ?? getScrollY();
        const body = document.body;
        const html = document.documentElement;

        // Save original styles
        const originalBodyPosition = body.style.position;
        const originalBodyTop = body.style.top;
        const originalBodyLeft = body.style.left;
        const originalBodyRight = body.style.right;
        const originalBodyWidth = body.style.width;
        const originalBodyOverflow = body.style.overflow;
        const originalHtmlOverflow = html.style.overflow;

        // Apply scroll lock
        body.style.position = "fixed";
        body.style.top = `-${lockedScrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        html.style.overflow = "hidden";

        return () => {
            // Restore original styles
            body.style.position = originalBodyPosition;
            body.style.top = originalBodyTop;
            body.style.left = originalBodyLeft;
            body.style.right = originalBodyRight;
            body.style.width = originalBodyWidth;
            body.style.overflow = originalBodyOverflow;
            html.style.overflow = originalHtmlOverflow;

            // Restore scroll position
            window.scrollTo(0, lockedScrollY);
        };
    }, [lock, scrollY]);
}

/**
 * Safely observe elements with IntersectionObserver on iOS.
 * Handles iOS Safari quirks with delayed callbacks.
 */
export function createSafeIntersectionObserver(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
): IntersectionObserver | null {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
        return null;
    }

    // iOS Safari has issues with large rootMargin values
    // Clamp rootMargin to reasonable values
    const safeOptions: IntersectionObserverInit = {
        ...options,
        // iOS Safari works better with explicit root: null
        root: options?.root ?? null,
        // Use threshold array for more reliable callbacks on iOS
        threshold: options?.threshold ?? [0, 0.1, 0.25, 0.5],
    };

    return new IntersectionObserver(callback, safeOptions);
}
