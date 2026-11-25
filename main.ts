// World News, 25 November 2026: one-image news summary.
// The entry is a single 1024x1024 PNG, drawn by draw.py from the day's
// headlines. This program's only job is to place that image where the
// sealed scorer reads it, and to refuse to run if the image is missing
// or the wrong size, so a broken entry never ships silently.
// The size check is the whole point: a truncated PNG would score zero,
// so this fails loudly instead of shipping a broken entry.
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY_FILE = "entry.png";
const EXPECTED_BYTES = 96125;
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Resolve the image next to this script, wherever the grader runs it.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, ENTRY_FILE);

// Fail loudly on a missing or truncated image; the gate reads the bytes.
const info = statSync(source);
if (!info.isFile() || info.size !== EXPECTED_BYTES) {
  throw new Error(
    `entry image ${ENTRY_FILE} is ${info.size} bytes, expected ${EXPECTED_BYTES}`,
  );
}

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(source, join(OUT_DIR, ENTRY_FILE));
