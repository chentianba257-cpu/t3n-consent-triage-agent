# Consent Triage Agent

An enterprise support-ticket triage agent designed for T3N's trust and delegation model. It classifies a supplied ticket, redacts obvious contact/payment fragments from its preview, and produces a **non-executing** next step. It never sends messages, changes accounts, makes payments, or calls third parties.

## Why this is useful

Support teams need quick routing without giving an automation unrestricted access to customer data or operational systems. This agent starts with a narrow, auditable task: create a safe triage record. A later T3N deployment can grant specific functions and specific outbound hosts only after the data owner authorizes them.

## Run locally

```bash
pnpm install
pnpm test
pnpm run triage -- examples/sanitized-ticket.json
```

No external account, key, or live network call is required for these commands.

## T3N sandbox verification

1. Claim a sandbox key and credits from T3N's claim page. Keep the key private.
2. Copy `.env.example` to `.env.local`, then set the key there. The file is ignored by Git.
3. Run `pnpm run verify:t3n`.

The verification command uses `@terminal3/t3n-sdk` on the sandbox, verifies the trusted manifest, performs an authenticated handshake, and reads the sandbox credit balance. It never prints the API key.

## Public-agent handoff

After the local T3N handshake succeeds, claim a **separate** credited key for the public agent. Use the T3N CLI to read its DID, replace the DID placeholder in `agent-card.template.json`, and host the resulting card. Do not reuse the tenant key for the agent key.

## Submission evidence to capture

- Terminal output showing successful T3N sandbox verification (with keys omitted)
- `pnpm test` output
- One redacted triage result from the provided example
- Public GitHub repository URL and a short note about any SDK/doc issue found

## Safety model

The agent's default behavior is deliberately conservative. Any future use of T3N member delegation must grant an exact contract, function list, data scopes, and approved outbound hosts. Authentication alone does not grant operational authority.

