import { createClient, type SanityClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || "";

const isValidProjectId = /^[a-z0-9-]+$/.test(projectId) && projectId.length > 0;

// Server-only: authenticated client for private documents (never import from client components).
export const sanityWriteClient: SanityClient | null =
  isValidProjectId && token
    ? createClient({
        projectId,
        dataset,
        apiVersion: "2024-01-01",
        useCdn: false,
        token,
      })
    : null;
