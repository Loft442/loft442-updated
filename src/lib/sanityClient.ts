import { createClient, type SanityClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Validate projectId format (only a-z, 0-9, and dashes allowed)
const isValidProjectId = /^[a-z0-9-]+$/.test(projectId) && projectId.length > 0;

// Create client only if valid, otherwise create a dummy that returns empty results
export const sanity: SanityClient = isValidProjectId
  ? createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
  })
  : (createClient({
    projectId: "placeholder",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: true,
  }) as SanityClient);

export const isSanityConfigured = isValidProjectId;
