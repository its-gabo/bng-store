# Local Agent Instructions

Rules in this file take precedence over all other repository instructions. This file is ignored by Git and applies only to this checkout.

## Scope

- Work on the backend only. Do not touch the frontend (`apps/web`) unless explicitly asked.
- Do not add or update tests unless explicitly asked.

- Never edit `apps/web/app/api/generated-api.ts` (or other generated API files) by hand. Change it only by running `pnpm generate:client`.

## Readability

- Code must read like a book: a reader should understand the flow from names alone, top to bottom.
- Use semantically precise names that say what is acted on. Do not use bare generic verbs such as `execute`, `run`, `process`, `handle`, `apply`, `do`, or `perform`; name the action and its object instead (for example `transferCourseToDestination`, not `execute`).
- Use `match` from `ts-pattern` whenever branching on a value: prefer it over `switch` statements, if/else chains, and ternaries that pick between cases. Use `.exhaustive()` when every case of a known set must be handled.
- Model fixed sets of values (kinds, statuses, modes, groups) as `{ ... } as const` objects and derive their types from them. Do not compare against or pass raw string literals.
- Avoid vendor lock-in in names: database tables, columns, constants, and shared domain types must not be named after a third-party provider (for example `bunny_videos`). Use provider-neutral names and store the provider in a column (for example `provider` with `VIDEO_PROVIDERS`). Provider names belong only in provider-specific adapters such as `BunnyStreamService`.
- When the user says "enum", they mean a `{ ... } as const` object, not a TypeScript `enum`.

## Database

- Repositories contain only data access: one query (or one atomic write) per method, no business decisions, no domain exceptions, no orchestration of other repository calls. Guarding an empty input array is fine.
- Do not execute raw SQL statements (for example `transaction.execute(sql\`...\`)`). Use the Drizzle query builder and existing repository helpers.

## Errors

- Any error message that can reach the user (HTTP exception messages, and error or reason fields in API responses) must be a translation key that exists in the web locale files, such as `masterCourse.error.exportPaused`. Do not throw HTTP exceptions without a message or with plain English text.
- Errors that never reach the user (worker, queue, outbox and internal invariant failures, which surface only in logs or as a generic 500) may use plain English messages.

## Validation

- Validate payload shapes (event payloads, job data, IDs) with TypeBox schemas and `Value.Check`, not hand-written `typeof`/`isUuid` chains.

## Tests

- Backend E2E specs live in `src/**/__tests__/*.e2e-spec.ts`. Concentrate on backend E2E coverage unless told otherwise.
- Use table-driven tests (`it.each` with object rows and `$field` names in the title) whenever cases share their steps and differ only in data or expected outcome.
- Put scenario tables and fixed test data in a sibling `<spec-name>.scenarios.ts` file (for example `course-transfer-media.scenarios.ts`) and import them into the spec. Never use a `.spec` suffix for these files, so Jest does not run them.
- Scenario files hold plain data only: no functions, database handles, or app state. Model case kinds and outcomes there as `{ ... } as const` objects, and let the spec turn them into actions with `match(...).exhaustive()`.
- Seed every row through a factory in `apps/api/test/factory`. When none exists, add one (fishery `Factory.define`, with transient params or class methods such as `.linkedTo()` or `.withTranslations()`) instead of writing raw inserts. Raw updates are fine for changing a seeded row to set up a scenario.
- Put setup shared by several specs in `apps/api/test/helpers` (for example `course-sharing.ts`) instead of copying it between specs.
- Mock only external providers (such as `S3Service`, `BunnyStreamService`, `CACHE_MANAGER`). Reset each mock with `mockReset()` and re-apply its defaults in `beforeEach`; never call `jest.resetAllMocks()`, because it also resets spies. Make doubles tenant-aware through `dbAls` when behaviour differs per tenant.
- Use `useDbProxy: true` so tenant-scoped data goes through RLS and the restricted app role.
- Prefer deterministic flows: leave outbox processing disabled and drive transfers step by step (for example with `createCourseTransferDriver`). Keep at least one full-pipeline test per flow that dispatches through the outbox and queue.
- One behaviour per test. Name tests after the behaviour ("fails when one of its courses fails"), not the implementation. Name shared setup helpers `arrange...` or after what they create.
- Prefer `toMatchObject`/`toEqual` on whole objects over many single-field expectations. Scope assertions on shared mocks to the IDs under test, because background jobs left by earlier tests may still call them.
- Truncate the shared table list in both `beforeEach` and `afterEach`.

## Comments

- Add JSDoc only to important functions: public entry points and functions whose intent or constraints are not obvious from the name.
- Do not add comments that restate the code, and do not comment types.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
