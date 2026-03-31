---
name: effective-typescript
description: >
  Effective TypeScript coding rules, anti-patterns, and review guidance. Use when writing,
  reviewing, or refactoring TypeScript code — including type design (discriminated unions,
  generics, branded types), taming any/unknown, narrowing, inference, tsconfig setup,
  migration from JS, and fixing type errors. Triggers on any TS-related task.
---

# Effective TypeScript — Coding Agent Skill

## Core Philosophy

Write TypeScript that leverages the type system to catch bugs at compile time, not runtime. Design types that precisely model your domain so that invalid states are unrepresentable. Let TypeScript infer where it can, annotate where it matters, and keep `any` usage narrow and well-hidden.

## Top 5 Rules — Highest Bug-Prevention Impact

1. **Enable `strict` mode** — catches entire categories of bugs (null derefs, implicit any) with zero runtime cost.
2. **Model valid states only** — use discriminated unions so invalid state combinations are unrepresentable. This eliminates the most common source of "impossible" runtime bugs.
3. **Use `unknown` over `any`** — a single `any` return silently infects every caller. `unknown` contains the unsafety to the narrowing site.
4. **Push null to the boundaries** — don't let nullability scatter through your data model. Compound objects should be fully null or fully populated.
5. **Generate types from schemas** — hand-writing types from sample data always gets nullability and optionality wrong. Use Zod, Prisma, GraphQL codegen, or OpenAPI generators as the source of truth.

When in doubt about which rule applies, check this list first.

## Quick Rules by Category

### 1. Type Safety Fundamentals

- Enable `strict` mode in `tsconfig.json`. At minimum, enable `noImplicitAny` and `strictNullChecks`.
- Limit `any` usage — it silently propagates through the type system, so one `any` in a return type infects every caller.
- Prefer `unknown` over `any` for values of uncertain type — it forces narrowing before use.
- When `any` is needed, scope it as narrowly as possible. Never return `any` from a function.
- Use precise `any` variants (`any[]`, `Record<string, any>`, `() => any`) instead of bare `any`.
- Hide unsafe type assertions inside well-typed wrapper functions with correct signatures.
- Track type coverage with tools like `type-coverage` to prevent safety regressions.

**Example — taming `any`:**
```typescript
// BAD: any leaks into every caller
function parseConfig(raw: string): any {
  return JSON.parse(raw);
}
const port = parseConfig(text).port; // port is any — no checking anywhere downstream

// GOOD: unknown forces narrowing at the usage site
function parseConfig(raw: string): unknown {
  return JSON.parse(raw);
}
const config = parseConfig(text);
if (typeof config === "object" && config !== null && "port" in config) {
  const port = (config as { port: number }).port; // narrowed, assertion justified
}

// BETTER: use a validation library like Zod for runtime + type safety
const ConfigSchema = z.object({ port: z.number() });
const config = ConfigSchema.parse(JSON.parse(text)); // typed & validated
```

### 2. Type Design

- Design types that only represent valid states. If a state combination is invalid, make it unrepresentable.
- Accept broad input types (unions, optionals); return narrow, specific output types.
- Push `null` to the boundaries — make compound objects either fully null or fully non-null.
- Prefer unions of interfaces over interfaces with union properties (use tagged/discriminated unions).
- Use string literal unions instead of bare `string` when the domain is finite.
- Use a distinct type (like `null`, a branded type, or a tagged variant) for special sentinel values — never repurpose `0`, `-1`, or `""`.
- Limit optional properties — prefer required properties with explicit defaults or separate input/output types.
- Avoid repeated consecutive parameters of the same type; use named object parameters instead.
- Unify similar types rather than maintaining near-duplicate variants with conversion code.
- Prefer imprecise-but-correct types over complex-but-wrong types. If you can't model it accurately, use `unknown`.
- Name types after your problem domain, not their shape. Avoid vague names like `Info` or `Data`.
- Generate types from schemas or official sources — never hand-write types from sample data.

**Example — discriminated unions over union properties:**
```typescript
// BAD: nothing prevents { status: "loading", error: new Error() }
interface RequestState {
  status: "loading" | "success" | "error";
  data?: string;
  error?: Error;
}

// GOOD: each variant carries exactly the fields that make sense
type RequestState =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: Error };

function handle(state: RequestState) {
  switch (state.status) {
    case "loading": return <Spinner />;
    case "success": return <Content data={state.data} />;  // data is string, guaranteed
    case "error":   return <Alert error={state.error} />;  // error is Error, guaranteed
  }
}
```

### 3. Type Inference & Narrowing

- Omit type annotations on local variables when TypeScript infers correctly. Annotate function signatures, not bodies.
- Annotate return types on public APIs, multi-return functions, or when you want a named type.
- Annotate object literals to trigger excess property checking and surface errors at the definition site.
- Use `as const` for truly constant values, and `satisfies` to validate a type while preserving inference.
- Build objects all at once (spread syntax) rather than adding properties incrementally.
- Use type narrowing via `typeof`, `instanceof`, `in`, discriminant properties, and user-defined type guards.
- Keep aliases consistent — once you narrow a variable, use that same variable, not a re-aliased copy.
- Prefer functional constructs (`map`, `filter`, `reduce`) and libraries to help types flow through pipelines.
- Use `async`/`await` over raw callbacks — it improves both type flow and readability.

**Example — let inference work, annotate where it matters:**
```typescript
// BAD: redundant annotations on locals that TS already infers
const name: string = "Alice";
const items: number[] = [1, 2, 3];
const doubled: number[] = items.map((x: number): number => x * 2);

// GOOD: annotate signatures, let locals be inferred
function getUser(id: string): Promise<User> {  // return type annotated — public API
  const name = "Alice";                         // inferred as string
  const items = [1, 2, 3];                      // inferred as number[]
  const doubled = items.map(x => x * 2);        // inferred as number[]
  // ...
}
```

**Example — `as const` + `satisfies` for config objects:**
```typescript
// BAD: annotation widens everything — loses literal values and keys
const routes: Record<string, { path: string }> = {
  home: { path: "/" },
  about: { path: "/about" },
};
routes.typo;      // no error — string index allows anything
routes.home.path; // type is string, not "/"

// GOOD: as const locks down values, satisfies validates the shape
const routes = {
  home: { path: "/" },
  about: { path: "/about" },
} as const satisfies Record<string, { path: string }>;
routes.typo;      // ERROR: Property 'typo' does not exist
routes.home.path; // type is "/" — literal preserved
```

### 4. Generics & Type-Level Programming

- Think of generic types as functions between types. Constrain parameters with `extends`.
- Every type parameter must appear at least twice to justify its existence. Remove unnecessary ones.
- Prefer conditional types over function overloads — they distribute over unions automatically.
- Use template literal types to model structured strings and DSLs.
- Write tail-recursive generic types for efficiency and to avoid depth limits.
- Consider code generation as an alternative to overly complex type-level programming.
- Test your generic types — use `vitest`, `expect-type`, or the Type Challenges pattern.

**Example — unnecessary type parameter:**
```typescript
// BAD: T appears only once — it doesn't relate anything
function parse<T>(input: string): T {
  return JSON.parse(input); // actually returns any, T is a lie
}

// GOOD: T links input to output
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // T appears twice — constrains both param and return
}
```

### 5. Structural Typing & Type Boundaries

- TypeScript uses structural ("duck") typing — types are not sealed. Extra properties are allowed at runtime.
- Excess property checking only applies to object literals assigned directly, not via intermediate variables.
- Use `readonly` arrays and `Readonly<T>` objects to prevent accidental mutation. Remember they are shallow.
- Prefer `type` annotations (`: Type`) over type assertions (`as Type`). Comment every assertion explaining why it's valid.
- Use brands (tagged types) when you need nominal typing to distinguish structurally identical types.

### 6. Declarations & APIs

- Put TypeScript and `@types` in `devDependencies`. Keep library, `@types`, and TS compiler versions in sync.
- Export all types that appear in public APIs.
- Use TSDoc (`@param`, `@returns`, `@deprecated`) for API documentation. Never duplicate type info in comments.
- Provide a `this` type in callback signatures when `this` binding is part of your API.
- Mirror types to sever unnecessary dependencies in published packages.
- Use module augmentation (declaration merging) to improve third-party types or disable problematic APIs.

### 7. Type System Mechanics

- Types are sets of values. Think in Venn diagrams: `extends` means "subset of," `|` means "union," `&` means "intersection."
- Know when you're in type space vs. value space. `typeof`, `this`, and `class` behave differently in each.
- Don't use object wrapper types (`String`, `Number`, `Boolean`) — always use lowercase primitives.
- Prefer `type` for unions, mapped types, and computed types. Use `interface` for object shapes (it supports declaration merging and often displays better).
- Use `keyof T` instead of `string` for property-name parameters.
- Prefer `Record`, `Map`, or mapped types over index signatures.
- Avoid numeric index signatures — arrays use string keys at runtime.

### 8. Code Quality & Migration

- Prefer standard ECMAScript features over TS-specific ones (avoid enums, parameter properties, namespaces).
- Use source maps for debugging. Never debug compiled JavaScript.
- Understand the DOM hierarchy (`Node` → `Element` → `HTMLElement`) and use specific types.
- Model your runtime environment accurately — match `lib` settings, use project references for different targets.
- Type checking and unit testing are complementary — test behavior, let the compiler check types.
- Watch compiler performance: remove dead code, avoid huge unions, prefer `interface extends` over intersections, annotate complex return types.
- Migrate to TypeScript module-by-module from the bottom of the dependency graph. Finish by enabling `noImplicitAny`.

### 9. Modern TypeScript (5.0+)

- Use `const` type parameters (TS 5.0) to infer literal types from generic arguments without requiring callers to write `as const`.
- Use `using` declarations (TS 5.2) for deterministic cleanup of resources like file handles, DB connections, and locks — replaces manual `try/finally`.
- Use `NoInfer<T>` (TS 5.4) to block inference from specific positions in generic functions, forcing the caller to specify or letting other positions drive inference.
- Combine `as const satisfies` (TS 5.0+) for config objects — validates shape while preserving literal types (see example in section 3).
- Use standard decorators (TS 5.0) over experimental decorators when starting new projects. Avoid mixing both in the same codebase.
- Use `import type` / `export type` to make type-only imports explicit — helps bundlers with tree-shaking and makes the value/type boundary clear.

```typescript
// const type parameter — callers get literal types without writing as const
function createRoute<const T extends readonly string[]>(paths: T): T {
  return paths;
}
const routes = createRoute(["home", "about"]); // type is readonly ["home", "about"]

// using declaration — cleanup runs automatically when scope exits
async function readConfig(path: string) {
  using file = await openFile(path);  // file[Symbol.dispose]() called on scope exit
  return parseConfig(await file.read());
}

// NoInfer — prevents unwanted inference from a default value
function getOrDefault<T>(values: T[], fallback: NoInfer<T>): T {
  return values.length > 0 ? values[0] : fallback;
}
getOrDefault([1, 2], "oops"); // ERROR — string is not assignable to number
// Without NoInfer, T would widen to number | string and silently pass
```

**Example — exhaustiveness checking with `never`:**
```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rect":   return shape.width * shape.height;
    default: {
      const _exhaustive: never = shape; // ERROR if a new variant is added but not handled
      return _exhaustive;
    }
  }
}
// When someone adds { kind: "triangle"; ... } to Shape, this function
// immediately fails to compile — no silent fallthrough at runtime.
```

## When Reviewing TypeScript Code

Scan for these issues in priority order. High-severity items hide bugs or break type safety silently; medium items hurt maintainability; low items are style/hygiene.

### High Severity — fix immediately
| Issue | What to look for | Fix |
|-------|-----------------|-----|
| Bare `any` types | `any` in function params, returns, or variable declarations | Replace with `unknown` + narrowing, a precise variant (`any[]`, `Record<string, any>`), or a proper type |
| Missing `strict` mode | `tsconfig.json` without `strict: true` | Enable `strict`. At minimum enable `noImplicitAny` + `strictNullChecks` |
| Type assertions without justification | `as Type` without a comment explaining why | Add a comment, or refactor to use narrowing instead. If the assertion is in a hot path, wrap it in a well-typed helper |
| Interfaces with union properties | `{ status: "a" \| "b"; data?: X; error?: Y }` | Refactor to a discriminated union — each variant carries only its relevant fields |
| Missing exhaustiveness checks | `switch` on a union type with no `default: never` | Add `const _: never = x` in default branch, or use return type annotation to force all branches |

### Medium Severity — fix in the same PR
| Issue | What to look for | Fix |
|-------|-----------------|-----|
| Nullable types buried deep | Null checks scattered through business logic, `x?.y?.z?.w` chains | Push null to the API boundary — make compound objects fully null or fully populated |
| Stringly-typed parameters | `function f(status: string)` where the domain is finite | Replace with `"active" \| "inactive"` literal union, or `keyof T` for property names |
| Hand-written API types | Types that mirror an API response but were written from sample data | Generate from schema (OpenAPI, GraphQL codegen, Zod) — hand-written types always drift |
| Overly complex generics | Deeply nested conditional types, multiple `infer` keywords | Simplify, split into named helpers, or use code generation instead |

### Low Severity — fix when convenient
| Issue | What to look for | Fix |
|-------|-----------------|-----|
| Redundant type annotations | `const x: string = "hello"`, `const arr: number[] = [1, 2]` | Remove — let TypeScript infer locals. Keep annotations on function signatures and public APIs |
| Object wrapper types | `String`, `Number`, `Boolean` in type positions | Replace with lowercase `string`, `number`, `boolean` |
| TS-specific runtime features | `enum`, `namespace`, parameter properties | Replace with `as const` objects, ES modules, regular class properties |

## Common Anti-Patterns and Why They Hurt

### Returning `any` from helper functions
Looks harmless — "I'll type it properly at the call site." But `any` propagates silently: every caller inherits `any`, their callers inherit `any`, and soon half the codebase is unchecked. One `any` return can disable type checking across dozens of files without a single error.

### Using `enum` instead of `as const` objects
TS enums generate runtime code, have surprising numeric reverse-mapping behavior, and don't tree-shake well. An `as const` object gives you the same namespace + type safety with zero surprises:
```typescript
// Avoid
enum Status { Active = "active", Inactive = "inactive" }

// Prefer
const Status = { Active: "active", Inactive: "inactive" } as const;
type Status = (typeof Status)[keyof typeof Status]; // "active" | "inactive"
```

### Optional properties everywhere
Optional properties feel flexible, but they push complexity to every consumer — each usage site must handle the missing case. When most callers need defaults anyway, you end up with scattered `?? defaultValue` logic that's easy to get inconsistent. Prefer required properties with explicit defaults at construction time.

### Type assertions to "fix" type errors
`as Type` silences the compiler but doesn't change runtime behavior. If the assertion is wrong, you get a silent type mismatch — the worst kind of bug because the compiler told you everything was fine. Before reaching for `as`, ask: can I narrow with a type guard, restructure the code, or fix the upstream type instead?

### Building objects property by property
```typescript
// This gives obj type {} — TS can't track incremental property addition
const obj = {};
obj.name = "Alice";  // ERROR: Property 'name' does not exist on type '{}'
obj.age = 30;

// Build all at once — the type is complete from the start
const obj = { name: "Alice", age: 30 };
```
When properties come from different sources, use spread: `{ ...defaults, ...overrides }`.

### Index signatures for known key sets
`[key: string]: T` tells TypeScript "any string key is valid" — it won't catch typos, won't autocomplete property names, and every lookup returns `T` even for keys that don't exist. If you know the keys, use a `Record` with a literal union, a mapped type, or an interface.

## Full Reference

See `references/rules.md` for the complete per-item rule reference covering all 83 items.
