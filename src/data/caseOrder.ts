/** Lightweight case-order map for cross-case navigation (Up Next links).
 *  Heavy per-case data (descriptions, images, video IDs) lives in WorkPage.tsx's
 *  `CASES` array. This file is just the order + title + path lookup so case
 *  study pages can compute their next/prev neighbor without importing the whole
 *  work-page dataset. Keep in sync with WorkPage.tsx CASES order. */
export interface CaseRef {
  id: string;
  title: string;
  /** Route path if the case has a dedicated case study page; otherwise undefined (link falls back to /work). */
  path?: string;
}

export const CASE_ORDER: CaseRef[] = [
  { id: "erased-font", title: "The VANISHED TYPEFACE", path: "/work/erased-font" },
  { id: "showreel", title: "PERSPECTIVE FESTIVAL — Perspectives Are Beautiful" },
  { id: "project-03", title: "The Wearable RELIC" },
  { id: "ambrosia", title: "FRACTAL SNACKS Collisions — The Livestream Battle" },
  { id: "project-05", title: "PRISMA ELECTRONICS — The Gaze Marathon" },
  // Add more entries here as new case study pages get dedicated routes.
];

/** Find the next case after `currentId` in CASE_ORDER (wraps around).
 *  Returns the next CaseRef, or the first one if currentId is unknown. */
export function nextCaseAfter(currentId: string): CaseRef {
  const idx = CASE_ORDER.findIndex((c) => c.id === currentId);
  if (idx === -1) return CASE_ORDER[0];
  return CASE_ORDER[(idx + 1) % CASE_ORDER.length];
}
