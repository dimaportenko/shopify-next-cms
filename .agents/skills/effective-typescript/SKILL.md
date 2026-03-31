---
name: effective-typescript
description: >
  Effective TypeScript coding rules and best practices. Use for ANY TypeScript task:
  writing TS code, reviewing TS code, typing functions, designing interfaces, defining types,
  creating generics, handling nulls, using any/unknown, type narrowing, type assertions,
  type guards, discriminated unions, mapped types, conditional types, template literal types,
  readonly, index signatures, type vs interface, structural typing, type inference,
  TypeScript migration, tsconfig setup, @types packages, module augmentation, type testing,
  type-level programming, branded types, exhaustiveness checking, TypeScript performance,
  TS code review, refactoring TypeScript, fixing type errors, designing type-safe APIs.
---

# Effective TypeScript — Coding Agent Skill

## Core Philosophy

Write TypeScript that leverages the type system to catch bugs at compile time, not runtime. Design types that precisely model your domain so that invalid states are unrepresentable. Let TypeScript infer where it can, annotate where it matters, and keep `any` usage narrow and well-hidden.

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

Check for these common issues:

1. **Bare `any` types** — Replace with `unknown`, a precise `any` variant, or a proper type.
2. **Missing `strict` / `noImplicitAny`** — Should be enabled in all non-legacy projects.
3. **Type assertions without comments** — Every `as X` needs justification.
4. **Interfaces with union properties** — Refactor to tagged unions of interfaces.
5. **Nullable types buried deep** — Push null to the perimeter of the API.
6. **Stringly-typed parameters** — Replace `string` with literal unions or `keyof`.
7. **Redundant type annotations** — Remove annotations TypeScript can infer on locals.
8. **Object wrapper types** — Replace `String`/`Number`/`Boolean` with `string`/`number`/`boolean`.
9. **Overly complex generics** — Simplify, or consider code generation.
10. **Missing exhaustiveness checks** — Use `never` assignments in switch/if chains.

## Full Reference

See `references/rules.md` for the complete per-item rule reference covering all 83 items.
