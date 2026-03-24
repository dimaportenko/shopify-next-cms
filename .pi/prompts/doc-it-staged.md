---
description: Review staged changes and update docs in apps/docs
---

Review the currently staged git changes.
Additional focus: $@

Your job:

1. Inspect the staged changes with git diff for the index only.
2. Determine which user-facing, developer-facing, architectural, setup, workflow, or API changes should be documented.
3. Update `apps/docs` only where needed.
4. Prefer updating existing docs pages in `apps/docs/content/docs/**` before creating new ones.
5. If a new docs section or page is needed, add the `.mdx` file and update the relevant `meta.json`.
6. Keep docs concise, accurate, and aligned with the existing docs style.
7. Do not document trivial refactors unless they change behavior, usage, architecture, or maintenance workflows.
8. If no documentation changes are needed, explain why instead of forcing edits.

Implementation guidance:

- Use staged diff commands such as `git diff --cached` and `git diff --cached --name-only`.
- Map code changes to the most relevant docs location in `apps/docs/content/docs`.
- Preserve existing navigation structure and naming conventions.
- Include concrete examples, commands, paths, or code snippets when helpful.
- Mention breaking changes, new setup steps, new environment variables, new scripts, new workflows, and changed behavior.

Validation requirements:

- Run formatting for changed files if needed.
- Run `pnpm --filter docs lint`
- Run `pnpm --filter docs typecheck`
- Run `pnpm --filter docs build`

At the end, provide:

- which staged files were reviewed
- which docs files were changed
- what was documented
- any notable gaps or follow-up docs that may still be needed
