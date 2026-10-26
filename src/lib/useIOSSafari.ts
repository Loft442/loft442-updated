"use client";

import { useLayoutEffect, type RefObject } from "react";

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
 * Lock body scroll for modals on iOS Safari.
 * Uses position fixed approach to prevent scroll-behind.
 * Pass the ref the opener saved the scroll position into; it is read when the lock starts,
 * not during render.
 */
export function useLockBodyScroll(lock: boolean, scrollYRef?: RefObject<number>): void {
    useLayoutEffect(() => {
        if (!lock) return;

        const lockedScrollY = scrollYRef?.current ?? getScrollY();
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

            // Restore scroll position instantly. The global smooth scroll-behavior would
            // otherwise animate from the top back down to the section.
            const originalScrollBehavior = html.style.scrollBehavior;
            html.style.scrollBehavior = "auto";
            window.scrollTo(0, lockedScrollY);
            html.style.scrollBehavior = originalScrollBehavior;
        };
    }, [lock, scrollYRef]);
}
