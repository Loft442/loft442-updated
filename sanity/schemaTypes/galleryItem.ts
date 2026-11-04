import { createElement } from "react";
import { defineField, defineType } from "sanity";

import { GALLERY_CATEGORIES } from "../galleryCategories";

// Same categories (and names) as the tabs on the website's /gallery page.
const CATEGORIES = GALLERY_CATEGORIES.map(({ title, value }) => ({ title, value }));

function previewMedia(url: string | undefined, mimeType: string | undefined) {
  if (!url) return undefined;
  const style = { width: "100%", height: "100%", objectFit: "cover" as const };
  return mimeType?.startsWith("video/")
    ? createElement("video", { src: `${url}#t=0.1`, muted: true, preload: "metadata", style })
    : createElement("img", { src: `${url}?w=120&h=120&fit=crop`, alt: "", style });
}

export default defineType({
  name: "galleryItem",
  title: "Gallery photo or video",
  type: "document",
  fields: [
    defineField({
      name: "media",
      title: "Photo or video",
      description:
        "Drag a photo or video here. To add many files at once, use the Upload tab at the top. Keep videos short (under about 100 MB).",
      type: "file",
      options: { accept: "image/*,video/*" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: CATEGORIES, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Short description",
      description:
        "Describe the photo or video for search engines and screen readers, e.g. \"Wedding reception with gold uplighting\".",
      type: "string",
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      // Set only on photos copied in from the website's original built-in gallery.
      name: "legacyId",
      title: "Original gallery photo number",
      type: "number",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "poster",
      title: "Video cover image (optional)",
      description: "Only used for videos. If left empty, the first frame of the video is shown.",
      type: "image",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "alt",
      subtitle: "category",
      url: "media.asset.url",
      mimeType: "media.asset.mimeType",
    },
    prepare({ title, subtitle, url, mimeType }) {
      return {
        title: title || "Untitled",
        subtitle: [subtitle, mimeType?.startsWith("video/") ? "Video" : "Photo"]
          .filter(Boolean)
          .join(" · "),
        media: previewMedia(url, mimeType),
      };
    },
  },
});
