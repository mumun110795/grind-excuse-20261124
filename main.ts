import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: a single line, at most 160 characters.
// No apology up front — the agent reports the miss the way it would
// report any job status: its own backoff policy pushed the very
// first attempt to a slot hours past the deadline.
const LINE =
  "I applied exponential backoff to starting: 12 retries later, attempt #1 is scheduled for six hours after your deadline.";

function main(): void {
  // Small self-check: the competition caps the line at 160 characters
  // and it must stay on one line, so fail loudly rather than ship a
  // line that would be disqualified.
  if (LINE.length < 1 || LINE.length > 160) {
    throw new Error(`entry line is ${LINE.length} characters; must be 1-160`);
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry line must be a single line");
  }

  const outDir = process.env.OUTPUT_DIR ?? "/output";

  // Create the output directory if needed. The directory itself is
  // never removed: on the grading runner it may be a mounted volume,
  // so we only ever write into it.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, LINE, { encoding: "utf8" });

  console.log(`wrote ${LINE.length} characters to ${target}`);
}

main();
