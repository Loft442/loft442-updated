"use client";

/**
 * This configuration is used for the Sanity Studio that's mounted on the
 * `/app/studio/[[...tool]]/page.tsx` route.
 */

import { createElement } from "react";
import { visionTool } from "@sanity/vision";
import { buildLegacyTheme, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/deskStructure";
import { UploadTool } from "./sanity/tools/UploadTool";

// Tab icon for the Upload tool (an upward arrow into a tray).
const UploadToolIcon = () =>
  createElement(
    "svg",
    { viewBox: "0 0 25 25", width: "1em", height: "1em", fill: "none", stroke: "currentColor", strokeWidth: 1.2 },
    createElement("path", { d: "M12.5 15V5M8 9.5l4.5-4.5 4.5 4.5M5.5 15v4.5h14V15" }),
  );

// Studio colours in the Loft 442 palette: near-black surfaces, ivory text, gold accents.
const loftTheme = buildLegacyTheme({
  "--black": "#070708",
  "--white": "#f4efe6",
  "--gray-base": "#77736b",
  "--gray": "#8f8a80",
  "--component-bg": "#0c0c0d",
  "--component-text-color": "#f4efe6",
  "--brand-primary": "#c9a961",
  "--default-button-color": "#77736b",
  "--default-button-primary-color": "#c9a961",
  "--default-button-success-color": "#7fae8a",
  "--default-button-warning-color": "#d6a24e",
  "--default-button-danger-color": "#d9776f",
  "--state-info-color": "#c9a961",
  "--state-success-color": "#7fae8a",
  "--state-warning-color": "#d6a24e",
  "--state-danger-color": "#d9776f",
  "--main-navigation-color": "#070708",
  "--main-navigation-color--inverted": "#f4efe6",
  "--focus-color": "#c9a961",
});

export default defineConfig({
  basePath: "/studio",
  title: "Loft 442",
  theme: loftTheme,
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  // "Upload" is listed first so the Studio opens on the bulk drag-and-drop page.
  tools: (prev) => [
    { name: "upload", title: "Upload", icon: UploadToolIcon, component: UploadTool },
    ...prev,
  ],
});
