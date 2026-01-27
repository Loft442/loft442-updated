export const apiVersion = "2024-01-01";

// Provide fallbacks for build time when env vars might not be available
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

// Validate projectId format at runtime (only alphanumeric and dashes allowed)
if (projectId && !/^[a-z0-9-]+$/.test(projectId)) {
    console.warn("Warning: Sanity projectId contains invalid characters");
}
