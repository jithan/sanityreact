import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "4p1xt2z5",
  dataset: "rlthub",
  apiVersion: "2024-01-01",
  useCdn: true
});