# T3N Consent Triage Agent — Submission Notes

Repository: https://github.com/chentianba257-cpu/t3n-consent-triage-agent

## What this agent does

This small TypeScript agent reviews an operations or support ticket before an external action is taken. It assigns a risk level, records the reason, and requires explicit human approval for high-risk actions such as payments, credential resets, account changes, exports, or broad data access.

The boundary is intentionally simple and maintainable:

- src/triage.ts contains the deterministic risk classification.
- src/verify-t3n.ts performs the Terminal 3 Sandbox handshake, DID authentication, and credit-balance read.
- examples/sanitized-ticket.json documents the accepted input shape.
- tests/triage.test.ts covers low-risk and approval-required outcomes.

## Verification evidence

The following local checks completed successfully:

1. pnpm test — 2 tests passed.
2. pnpm run build — completed successfully.
3. pnpm run triage -- examples/sanitized-ticket.json — completed successfully.
4. pnpm run verify:t3n — completed the Terminal 3 Sandbox handshake, DID authentication, and credit-balance read.

No API key, DID secret, or user data is included in this repository.

## Run it

1. Copy .env.example to .env.local.
2. Add a Terminal 3 Sandbox API key locally. Never commit it.
3. Run pnpm install, then the commands above.

## Observed platform issue

While claiming Sandbox credits, the browser briefly showed a client-side DOM error: removeChild failed because the target node was no longer a child of its parent. Retrying after a reload resolved the issue and did not block API-key issuance. The issue was observed once and is not currently reproducible.

## Handover

I prefer to hand this agent to Terminal 3 after review. The repository documents configuration and verification so another maintainer can run it without access to any local credentials.
