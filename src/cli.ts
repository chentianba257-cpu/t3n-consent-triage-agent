import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { triage, type Ticket } from "./triage.js";

// npm omits the argument separator while some package managers preserve it.
const inputPath = process.argv.slice(2).find((argument) => argument !== "--");

if (!inputPath) {
  console.error("Usage: npm run triage -- examples/sanitized-ticket.json");
  process.exitCode = 1;
} else {
  const raw = await readFile(resolve(inputPath), "utf8");
  const ticket = JSON.parse(raw) as Ticket;
  console.log(JSON.stringify(triage(ticket), null, 2));
}

