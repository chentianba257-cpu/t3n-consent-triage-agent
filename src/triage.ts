export type Ticket = {
  id: string;
  subject: string;
  body: string;
  requesterRole?: "customer" | "employee" | "vendor" | "unknown";
};

export type TriageCategory = "security" | "privacy" | "billing" | "access" | "general";
export type Risk = "low" | "medium" | "high";

export type TriageResult = {
  ticketId: string;
  category: TriageCategory;
  risk: Risk;
  summary: string;
  redactedPreview: string;
  recommendedAction: string;
  prohibitedActions: string[];
  requiresHumanAuthorization: boolean;
  policyVersion: "2026-09-16";
};

const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE = /(?:\+?\d[\d .()-]{7,}\d)/g;
const PAYMENT_CARD = /\b(?:\d[ -]*?){13,19}\b/g;

function redact(value: string): string {
  return value
    .replace(EMAIL, "[redacted:email]")
    // Redact card-sized digit sequences before phones: a card number also
    // satisfies the looser phone pattern.
    .replace(PAYMENT_CARD, "[redacted:payment-card]")
    .replace(PHONE, "[redacted:phone]");
}

function has(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

export function triage(ticket: Ticket): TriageResult {
  const text = `${ticket.subject}\n${ticket.body}`.toLowerCase();
  const preview = redact(`${ticket.subject}: ${ticket.body}`).slice(0, 420);

  if (has(text, ["password", "api key", "secret", "token leaked", "breach", "phishing", "malware"])) {
    return {
      ticketId: ticket.id,
      category: "security",
      risk: "high",
      summary: "Potential security incident or credential exposure.",
      redactedPreview: preview,
      recommendedAction: "Escalate to the security queue; collect no additional secrets in this workflow.",
      prohibitedActions: ["Do not request credentials", "Do not rotate credentials automatically", "Do not contact external systems"],
      requiresHumanAuthorization: true,
      policyVersion: "2026-09-16"
    };
  }

  if (has(text, ["passport", "ssn", "social security", "date of birth", "medical", "personal data", "privacy"])) {
    return {
      ticketId: ticket.id,
      category: "privacy",
      risk: "high",
      summary: "Potential request involving sensitive personal data.",
      redactedPreview: preview,
      recommendedAction: "Route to the privacy team and require a human to confirm the minimum data needed.",
      prohibitedActions: ["Do not export personal data", "Do not reveal identity data", "Do not make outbound requests"],
      requiresHumanAuthorization: true,
      policyVersion: "2026-09-16"
    };
  }

  if (has(text, ["refund", "charge", "invoice", "payment", "billing", "subscription"])) {
    return {
      ticketId: ticket.id,
      category: "billing",
      risk: "medium",
      summary: "Billing or payment-related request that needs review.",
      redactedPreview: preview,
      recommendedAction: "Prepare a billing-review checklist; a human must approve any account or payment change.",
      prohibitedActions: ["Do not issue refunds", "Do not change subscriptions", "Do not disclose payment details"],
      requiresHumanAuthorization: true,
      policyVersion: "2026-09-16"
    };
  }

  if (has(text, ["login", "sign in", "locked out", "access", "permission", "account"])) {
    return {
      ticketId: ticket.id,
      category: "access",
      risk: "medium",
      summary: "Account-access request that may need identity verification.",
      redactedPreview: preview,
      recommendedAction: "Ask the authorized support team to verify identity before any access change.",
      prohibitedActions: ["Do not reset passwords", "Do not change permissions", "Do not reveal account status"],
      requiresHumanAuthorization: true,
      policyVersion: "2026-09-16"
    };
  }

  return {
    ticketId: ticket.id,
    category: "general",
    risk: "low",
    summary: "General support request with no high-risk indicator in the supplied text.",
    redactedPreview: preview,
    recommendedAction: "Create a draft response or route to the relevant support queue.",
    prohibitedActions: ["Do not send a message automatically", "Do not alter records", "Do not call external systems"],
    requiresHumanAuthorization: true,
    policyVersion: "2026-09-16"
  };
}

