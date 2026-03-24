# Effective TypeScript — Complete Rule Reference

All 83 items distilled into actionable rules, organized by chapter.

---

## Chapter 1: Getting to Know TypeScript

### Item 1: TypeScript–JavaScript Relationship
TypeScript is a strict superset of JavaScript with a static type system that models runtime behavior. Code can pass the type checker yet still throw at runtime — types improve safety but don't guarantee it. Use type annotations to express intent and catch errors early.

### Item 2: Compiler Options Matter
Configure TypeScript via `tsconfig.json`, not CLI flags. Enable `noImplicitAny` (unless actively migrating JS) and `strictNullChecks` to catch null/undefined errors. Aim for full `strict` mode.

### Item 3: Code Generation Is Independent of Types
Types are erased at compile time and cannot influence runtime behavior or performance. Use tagged unions, property checks, or classes to reconstruct type information at runtime when needed.

### Item 4: Structural Typing
TypeScript uses structural (duck) typing — values may have properties beyond what the type declares. Types are never "sealed." Use structural typing to your advantage in unit tests by passing plain objects that match the interface.

### Item 5: Restrict any Usage
The `any` type disables safety, breaks contracts, hurts autocomplete, makes refactoring dangerous, and undermines confidence. Avoid it whenever possible.

---

## Chapter 2: TypeScript's Type System

### Item 6: Use Your Editor
Leverage language services (hover types, go-to-definition, rename symbol) to build intuition. Jump into `.d.ts` files to understand how libraries model behavior.

### Item 7: Types as Sets
Think of types as sets of values. `A | B` is the union of sets; `A & B` is the intersection. `extends` means "subset of." An object can belong to a type even with extra properties.

### Item 8: Type Space vs. Value Space
Know whether a symbol lives in type space or value space. `class` and `enum` introduce both. `typeof` means different things in each context. Use the TypeScript playground to build intuition.

### Item 9: Annotations over Assertions
Prefer `: Type` annotations over `as Type` assertions. Assertions bypass the checker — use them only when you know more than TypeScript does, and always add a comment explaining why.

### Item 10: No Object Wrapper Types
Use `string`, `number`, `boolean`, `symbol`, `bigint` — never `String`, `Number`, `Boolean`, `Symbol`, `BigInt`. The wrapper types are rarely what you want.

### Item 11: Excess Property Checking
Object literals assigned directly undergo extra checks that catch typos and unexpected properties. This is distinct from structural assignability. Introducing an intermediate variable skips these checks.

### Item 12: Type Whole Function Expressions
Apply a single type to entire function expressions rather than annotating each parameter. Factor out repeated function signatures into a reusable type alias.

### Item 13: type vs. interface
Both can express object types. `interface` supports declaration merging and often displays more clearly. `type` supports unions, mapped types, and conditional types. For plain object shapes, prefer `interface` unless your project has an established convention.

### Item 14: Use readonly
Mark function parameters as `readonly` (arrays) or `Readonly<T>` (objects) when you don't intend to mutate them. This documents intent and catches accidental mutation. Remember: `readonly` is shallow, and `const` prevents reassignment while `readonly` prevents mutation.

### Item 15: DRY Types with Type Operations
Apply DRY to types: use `keyof`, `typeof`, indexing, mapped types, and generics (`Pick`, `Partial`, `ReturnType`) to derive types rather than duplicating them. Don't over-apply DRY — only share types that genuinely represent the same concept.

### Item 16: Avoid Index Signatures
Index signatures (`[key: string]: T`) erase safety like `any`. Prefer `interface`, `Record`, `Map`, or mapped types with a constrained key space.

### Item 17: No Numeric Index Signatures
Array keys are strings at runtime despite `number` indexing. Use `Array`, tuples, `ArrayLike`, or `Iterable` instead of rolling your own numeric index signature.

---

## Chapter 3: Type Inference and Control Flow Analysis

### Item 18: Don't Over-Annotate
Let TypeScript infer local variable types — annotate function/method signatures, not bodies. Annotate object literals for excess property checking, and return types on public APIs or multi-return functions.

### Item 19: One Variable, One Type
Don't reuse a variable for values of different types. Declare separate variables to keep both humans and the type checker clear.

### Item 20: Widening
Understand how TypeScript widens literals. Control it with `const` declarations, explicit annotations, `as const`, `satisfies`, and contextual typing.

### Item 21: Build Objects at Once
Construct objects in a single expression using spread (`{...a, ...b}`) rather than adding properties one by one. This ensures the type is complete from the start.

### Item 22: Type Narrowing
Use `typeof`, `instanceof`, `in`, discriminant checks, `Array.isArray`, and user-defined type guards to narrow types. Refactor code to help TypeScript follow along.

### Item 23: Alias Consistency
After narrowing, use the same binding — don't re-alias. Function calls can invalidate property refinements, so trust local variable refinements more than property refinements.

### Item 24: Context and Inference
TypeScript uses context (parameter types, return types, assignment targets) to infer types. If extracting a variable causes a type error, add an annotation, use `as const`, or inline the value.

### Item 25: Evolving Types
Variables initialized as `null`, `undefined`, or `[]` can have their types evolve as values are assigned. Recognize this pattern but prefer explicit annotations for better error checking.

### Item 26: Functional Constructs
Use `map`, `filter`, `reduce`, and library utilities (e.g., Lodash) over hand-rolled loops. Types flow more naturally through functional pipelines.

### Item 27: async/await over Callbacks
Use `async`/`await` instead of callbacks or raw Promises. It improves type flow, readability, and eliminates common error-handling mistakes. If a function returns a Promise, declare it `async`.

### Item 28: Partial Inference with Currying
When a generic function needs some type parameters inferred and some specified, use currying or a class to create a second inference site. Currying also enables local type aliases.

---

## Chapter 4: Type Design

### Item 29: Valid States Only
Design types so that every possible value represents a valid state. If a state combination is nonsensical, make it unrepresentable in the type system.

### Item 30: Liberal Inputs, Strict Outputs
Accept broad parameter types (optionals, unions, `Iterable<T>`). Return specific types. Define a canonical output form and a separate, looser input form if needed.

### Item 31: Don't Repeat Type Info in Docs
Never duplicate type information in comments or variable names — it drifts out of sync. Use `readonly` instead of documenting immutability. Include units in variable names when the type doesn't convey them (`timeMs`, `temperatureC`).

### Item 32: No null/undefined in Type Aliases
Don't define type aliases that include `null` or `undefined`. Keep nullability visible at the usage site.

### Item 33: Null at the Perimeter
Avoid designs where one field being null implies another is also null. Make entire compound objects either null or fully populated. Consider a class that's constructed only when all values are available.

### Item 34: Unions of Interfaces
Replace interfaces with union properties with tagged unions of separate interfaces. Group correlated optional properties into a single discriminated variant.

### Item 35: Precise String Types
Replace bare `string` with string literal unions when the domain is known. Use `keyof T` for property-name parameters.

### Item 36: Distinct Types for Special Values
Don't use `0`, `-1`, or `""` as sentinel values — they're assignable to their base type and bypass checking. Use `null`, `undefined`, or a tagged variant to represent "missing" or "special."

### Item 37: Minimize Optionals
Optional properties weaken type checking and require repeated default-value logic. Prefer required properties, separate input/normalized types, or factory functions with defaults.

### Item 38: No Repeated Same-Type Parameters
Consecutive parameters of identical type are easy to swap by mistake. Refactor to use named fields in an options object.

### Item 39: Unify Types
If two types represent the same concept with minor differences, unify them into one. Eliminate conversion code by adjusting runtime behavior rather than maintaining parallel type hierarchies.

### Item 40: Imprecise over Inaccurate
A simpler, less precise type is better than a complex, wrong one. If you can't model something accurately, fall back to `unknown` or `any`. Monitor error messages and autocomplete as you refine.

### Item 41: Domain-Driven Naming
Name types using the language of your problem domain. Avoid generic names (`Info`, `Entity`, `Data`). Make naming distinctions meaningful.

### Item 42: Schema-Driven Types
Generate types from schemas, APIs, or official clients — never hand-author types from example data. You will get nullability and optionality wrong.

---

## Chapter 5: Unsoundness and the any Type

### Item 43: Narrow any Scope
Apply `any` to the smallest possible scope — a single expression or property, not an entire object or function. Never return `any`.

### Item 44: Precise any Variants
Use `any[]`, `Record<string, any>`, `() => any`, or other structured forms instead of bare `any` to retain partial type information.

### Item 45: Hide Assertions in Well-Typed Wrappers
When unsafe assertions are unavoidable, encapsulate them in a function with a correct external signature. Write tests and comments to justify the assertion.

### Item 46: Prefer unknown
Use `unknown` instead of `any` for values of uncertain type. It forces callers to narrow before use. Avoid return-only type parameters that create false safety.

### Item 47: Type-Safe Monkey Patching
Avoid storing data on globals or the DOM. If you must, use module augmentation or assert a custom interface. Include `undefined` if the property may not exist at runtime.

### Item 48: Soundness Traps
Unsoundness means runtime values diverge from static types. Watch for it via: `any`, type assertions, `as`/`is` guards, unchecked object lookups, and parameter mutation. Mark parameters `readonly` and ensure subclass methods match parent declarations.

### Item 49: Track Type Coverage
Even with `noImplicitAny`, `any` enters through explicit annotations and third-party `@types`. Use `type-coverage` to monitor and improve safety over time.

---

## Chapter 6: Generics and Type-Level Programming

### Item 50: Generics as Type Functions
Generic types are functions from types to types. Constrain parameters with `extends`. Choose descriptive type parameter names and document them with TSDoc.

### Item 51: No Unnecessary Type Parameters
Every type parameter must appear at least twice (to relate types). Remove unused ones — replace with `unknown`. Avoid return-only generics.

### Item 52: Conditional Types over Overloads
Conditional types distribute over unions, making them more flexible than overloads. If the union case is unrealistic, use separate named functions instead.

### Item 53: Control Union Distribution
Understand that conditional types distribute over unions by default. Wrap in one-tuples (`[T] extends [U]`) to disable distribution. Watch for surprising behavior with `boolean` and `never`.

### Item 54: Template Literal Types
Use template literal types to model structured strings and DSLs. Combine with mapped and conditional types for powerful string-level relationships. Don't sacrifice usability for cleverness.

### Item 55: Test Your Types
Test types for correctness using `vitest`, `expect-type`, or the Type Challenges approach. Test callback parameter inference and `this` types. Don't write ad-hoc type tests.

### Item 56: Type Display
How a type displays in editor tooltips matters. Use a `Resolve` helper to flatten complex types. Handle important special cases of generics for clearer display. Write display tests.

### Item 57: Tail-Recursive Generics
Make recursive type aliases tail-recursive (using an accumulator) for efficiency and to avoid depth limits.

### Item 58: Codegen over Complexity
When type-level code becomes too complex, generate code and types with an external tool instead. Run codegen in CI and diff the output to keep it in sync.

---

## Chapter 7: TypeScript Recipes

### Item 59: Exhaustiveness with never
Assign to `never` in the default branch of switch/if chains to ensure all variants are handled. Use return type annotations on multi-branch functions. Combine with template literal types for combinatorial exhaustiveness.

### Item 60: Iterating Over Objects
Use `Object.entries` for safe key-value iteration. Use `for-in` with an explicit assertion when you know the exact keys. Consider `Map` for easier iteration.

### Item 61: Record Types for Sync
Use `Record` types to force updates when adding new interface properties. Recognize the "fail open" vs. "fail closed" trade-off.

### Item 62: Rest Parameters and Tuples
Model variadic functions with rest parameters and tuple types. Use conditional types to link parameter types. Label tuple elements for meaningful parameter names.

### Item 63: Exclusive Or with Optional never
TypeScript's `|` is inclusive or. Use tagged unions for exclusive or, or add `property?: never` to exclude fields from specific variants.

### Item 64: Branded / Nominal Types
Attach brands (tag properties, unique symbols, private fields) to distinguish structurally identical types that are semantically different (e.g., `UserId` vs. `OrderId`).

---

## Chapter 8: Type Declarations and @types

### Item 65: devDependencies
Install TypeScript and `@types` as `devDependencies`, not `dependencies`. Don't install TypeScript globally.

### Item 66: Three Versions
Track three versions: the library, its `@types`, and the TypeScript compiler. Keep them in sync. Update `@types` when you update a library.

### Item 67: Export All API Types
Export every type that appears in a public API. Users will extract them anyway — make it easy.

### Item 68: TSDoc
Use TSDoc (`@param`, `@returns`, `@deprecated`) on exported functions, classes, and types. Never include type information in doc comments.

### Item 69: Type this in Callbacks
When `this` binding is part of a callback API, provide a `this` parameter type. Avoid dynamic `this` in new APIs.

### Item 70: Mirror Types
Use structural typing to sever transitive dependencies in npm packages. Don't force JS users to depend on `@types` or web devs to depend on Node types.

### Item 71: Module Augmentation
Use declaration merging to improve existing APIs or disable problematic methods. Use `void` returns or error strings to knock out unsafe methods. Don't let augmented types diverge from runtime behavior.

---

## Chapter 9: Writing and Running Your Code

### Item 72: Prefer ECMAScript
Avoid TypeScript-specific runtime features: enums, parameter properties, namespaces, experimental decorators. Stick to standard ECMAScript constructs for clarity and forward compatibility.

### Item 73: Source Maps
Debug TypeScript with source maps, not compiled JavaScript. Verify maps trace all the way to your source. Don't publish source maps unless intentional — they may embed your source code.

### Item 74: Runtime Types
TypeScript types are erased at runtime. Use Zod (or similar) for runtime validation, or generate types from schemas. Pick a single source of truth for your types.

### Item 75: DOM Hierarchy
Know the DOM type hierarchy: `EventTarget` → `Node` → `Element` → `HTMLElement` → specific elements. Use specific types or let TypeScript infer from context.

### Item 76: Accurate Environment Model
Match your `lib` and `target` settings to your actual runtime. Use project references and multiple `tsconfig.json` files for mixed environments (e.g., client + server).

### Item 77: Type Checking vs. Unit Testing
Type checking eliminates classes of errors; unit tests verify specific behaviors. Both are necessary. Test behavior, not types — don't write tests for inputs that would be compile errors.

### Item 78: Compiler Performance
Separate type checking from bundling. Remove dead code and unused dependencies. Prefer `interface extends` over `&` intersections. Avoid huge union types. Use incremental builds and project references. Annotate return types on complex functions.

---

## Chapter 10: Modernization and Migration

### Item 79: Modern JavaScript
Use ES modules (`import`/`export`), classes, destructuring, and `async`/`await`. TypeScript can downlevel these for older runtimes.

### Item 80: @ts-check and JSDoc First
Add `// @ts-check` to JavaScript files to enable lightweight type checking before converting. Use JSDoc annotations for type info. Don't over-invest — the goal is to convert to `.ts`.

### Item 81: allowJs for Gradual Migration
Enable `allowJs` to mix TypeScript and JavaScript during migration. Get tests and builds working with TypeScript before converting files.

### Item 82: Bottom-Up Conversion
Start with leaf modules (utility code) and work up the dependency graph. Resist refactoring during migration — keep a list for later. Move JSDoc types into proper annotations to preserve safety.

### Item 83: Finish with noImplicitAny
The migration isn't done until `noImplicitAny` is enabled. Loose type checking hides real mistakes. Fix errors gradually and give the team time to get comfortable.
