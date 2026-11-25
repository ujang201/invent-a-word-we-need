// showergument — one invented word, one clear line.
// The program assembles the entry from its parts, checks the gate
// (1–140 UTF-8 characters, not whitespace-only), and writes it to
// /output/entry.txt. Fully deterministic: same input, same bytes.

// ------------------------------------------------------------------
// 1. The coinage: two morphemes fused the way English fuses words.
// ------------------------------------------------------------------
const HEAD = "shower"; // where the thought happens
const TAIL = "gument"; // the tail of "argument", the thing replayed

// ------------------------------------------------------------------
// 2. The definition, built as one sentence from three clauses so the
//    meaning lands in a single reading: what it is, where it happens,
//    and why it stings.
// ------------------------------------------------------------------
const CLAUSES = [
  "the argument you finally win", // what it is
  "in the shower", // where it happens
  "hours after losing it in real life", // why it stings
];

function joinClauses(clauses: string[]): string {
  // First two clauses flow together with a space; the last clause,
  // the sting, is set off with a comma.
  const [first, second, ...rest] = clauses;
  const head = second ? `${first} ${second}` : first;
  return [head, ...rest].join(", ");
}

// ------------------------------------------------------------------
// 3. Assemble the entry line: word, part of speech, definition.
// ------------------------------------------------------------------
function buildEntry(): string {
  const word = HEAD + TAIL; // "showergument"
  const definition = joinClauses(CLAUSES) + ".";
  return `${word} (n.) — ${definition}`;
}

// ------------------------------------------------------------------
// 4. Gate check, mirroring the sealed scorer: 1–140 characters,
//    not only whitespace. Fail loudly instead of shipping bad text.
// ------------------------------------------------------------------
function gate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 140) {
    throw new Error(`entry is ${chars} characters, must be 1–140`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

// ------------------------------------------------------------------
// 5. Write it out.
// ------------------------------------------------------------------
const entry = buildEntry();
gate(entry);

const outDir = "/output";
const outFile = `${outDir}/entry.txt`;
await import("node:fs/promises").then(async ({ mkdir, writeFile }) => {
  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, entry, "utf8");
});

console.log(entry);
console.log(`(${[...entry].length} characters -> ${outFile})`);
