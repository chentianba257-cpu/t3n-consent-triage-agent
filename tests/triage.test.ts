import assert from "node:assert/strict";
import test from "node:test";
import { triage } from "../src/triage.js";

test("redacts sensitive fragments and routes billing requests for approval", () => {
  const result = triage({
    id: "billing-1",
    subject: "Duplicate charge",
    body: "Please refund charge on 4111 1111 1111 1111. Email alex@example.com.",
    requesterRole: "customer"
  });

  assert.equal(result.category, "billing");
  assert.equal(result.risk, "medium");
  assert.match(result.redactedPreview, /\[redacted:payment-card\]/);
  assert.match(result.redactedPreview, /\[redacted:email\]/);
  assert.equal(result.requiresHumanAuthorization, true);
});

test("escalates possible credential exposure without requesting more data", () => {
  const result = triage({
    id: "security-1",
    subject: "API key leaked",
    body: "I accidentally posted a token in our issue tracker."
  });

  assert.equal(result.category, "security");
  assert.equal(result.risk, "high");
  assert.deepEqual(result.prohibitedActions, [
    "Do not request credentials",
    "Do not rotate credentials automatically",
    "Do not contact external systems"
  ]);
});

