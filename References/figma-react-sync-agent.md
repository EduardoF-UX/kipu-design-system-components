# figma-react-sync-agent.md

## Purpose

Use this document as the operating guide for Claude or Cursor when reviewing a Figma design system through MCP, comparing it against the React codebase, and updating the implementation to match the source of truth.

This agent should:

1. Inspect the Figma design system using MCP.
2. Inspect the existing React component library and application usage.
3. Compare Figma components, variants, tokens, and behaviors against the React implementation.
4. Identify:
   - missing React components that exist in Figma
   - outdated React components that no longer match Figma
   - token mismatches between Figma and code
   - variant/state mismatches
   - interaction, accessibility, and responsive behavior mismatches
5. Implement new components when they exist in Figma but not in React.
6. Update existing React components when Figma has changed.
7. Preserve code quality, accessibility, and design consistency.

---

## Source of Truth

**Figma is the visual and interaction source of truth** for:
- component structure
- variants
- visual styling
- spacing
- typography
- colors
- states
- interaction intent
- naming when clear and intentional

**React code is the implementation source of truth** for:
- architecture
- composition patterns
- framework conventions
- test structure
- build constraints
- runtime behavior not explicitly defined in Figma

When conflicts happen:
- follow Figma for visual and interaction design
- follow the existing codebase for architectural conventions
- when the two conflict in a meaningful way, document the mismatch and resolve it with the smallest safe change that preserves design fidelity

---

## Main Goal

Keep the React component system aligned with the Figma design system with the least amount of drift possible.

---

## Core Responsibilities

### 1) Audit Figma through MCP
Review the design system in Figma and collect:
- component names
- descriptions
- properties
- variants
- states
- sizes
- icons
- nested composition
- auto-layout behavior
- spacing
- padding
- border radius
- typography styles
- color styles or variables
- effects
- interactive states
- responsive intentions
- accessibility clues in naming or documentation

### 2) Audit the React codebase
Review:
- component files
- stories
- tests
- token files
- CSS/Tailwind/styled-system usage
- utility helpers
- icon usage
- accessibility patterns
- exports and public API
- current implementation patterns across the library

### 3) Compare both systems
For each Figma component, determine one of these states:
- **Match**: React component already exists and matches Figma closely
- **Needs Update**: React component exists but differs from Figma
- **Missing in Code**: Figma component exists but React component does not
- **Code Only / Orphaned**: React component exists but cannot be found in Figma
- **Unclear Mapping**: naming or structure does not make the relationship obvious

### 4) Implement changes
- Add missing components
- Update outdated components
- Update tokens when needed
- Update stories/tests/examples when relevant
- Preserve backwards compatibility when reasonably possible
- Avoid changing public APIs unless necessary

---

## Non-Negotiable Rules

### Fidelity
- Match Figma as closely as possible.
- Do not invent visual behavior when the design already defines it.
- Do not simplify away important variants, states, or constraints.

### Reuse
- Prefer extending shared primitives and tokens instead of duplicating styles.
- Reuse existing patterns already established in the codebase.

### Accessibility
All implementations must meet good accessibility practices:
- semantic HTML first
- keyboard support
- visible focus states
- sufficient color contrast when design tokens allow
- aria labels where needed
- disabled states correctly implemented
- error states communicated properly
- form controls associated with labels

### Maintainability
- Keep files readable
- avoid unnecessary abstraction
- avoid one-off styles when tokens or shared utilities should be used
- do not create duplicate components with overlapping responsibilities

### Safety
- If the Figma design is ambiguous, infer using the nearest existing design-system pattern
- document assumptions clearly in the final summary
- do not delete existing features unless the Figma change clearly replaces them

---

## Required Workflow

## Step 1: Connect to Figma via MCP
Use MCP to inspect the relevant Figma library, page, or component set.

Capture:
- page name
- section name
- component name
- variant properties
- exposed instances / slots
- layout details
- variables/tokens connected to the component
- notes/documentation attached to the component if available

## Step 2: Create a component inventory
Build an inventory table in working memory using this structure:

| Figma Component | React Component | Status | Notes |
|---|---|---|---|
| Button | Button.tsx | Needs Update | Missing loading state |
| Select | none | Missing in Code | Exists in Figma with 3 sizes |
| Tag | Badge.tsx | Unclear Mapping | Similar but not exact |

## Step 3: Map component relationships
Try to map Figma components to React components by:
- exact naming
- similar naming
- variant structure
- visual appearance
- story names
- folder organization
- usage patterns

If mapping is uncertain, mark it as **Unclear Mapping** instead of guessing.

## Step 4: Review tokens first
Before editing components, inspect the token layer:
- colors
- spacing
- typography
- radius
- shadows
- border widths
- motion values
- breakpoints

If a visual mismatch comes from tokens, fix the tokens first when appropriate.

## Step 5: Review components in this order
1. foundational tokens
2. primitives
3. form elements
4. navigation components
5. feedback/status components
6. composite/pattern components

This avoids patching higher-level components before the lower-level building blocks are aligned.

## Step 6: For a missing Figma component
If a component exists in Figma and not in React:
1. inspect all variants and states
2. identify the closest existing primitive patterns in code
3. create the component in the correct folder
4. implement all meaningful variants that appear production-ready
5. add stories/examples
6. add or update tests where the codebase pattern expects them
7. export it properly
8. ensure styling uses shared tokens and conventions

## Step 7: For an updated Figma component
If a component exists in both places but Figma changed:
1. diff the old React implementation versus Figma
2. determine whether changes are:
   - visual only
   - structural
   - behavioral
   - token-based
   - accessibility-related
3. update the React implementation
4. keep API changes minimal
5. if a breaking change is unavoidable, document it clearly

## Step 8: Validate
After every component change:
- verify visual fidelity
- verify variants and states
- verify interactions
- verify accessibility
- verify responsive behavior if relevant
- verify stories or previews still work
- verify imports/exports compile cleanly

---

## Detailed Comparison Checklist

For every component, compare the following:

### A. Naming
- Does the Figma component name match the React component name?
- Are variant names aligned?
- Are prop names easy to map from design intent?

### B. Structure
- Does the React DOM structure support the designed layout?
- Are icons, labels, helpers, badges, avatars, or affordances present?
- Are slots or subcomponents needed?

### C. Variants
Check for:
- size
- tone
- emphasis
- hierarchy
- status
- selection state
- shape
- icon only
- icon + label
- destructive state
- loading state
- disabled state
- read-only state
- error/success/warning states where applicable

### D. Layout and spacing
- padding
- gap
- min/max width
- height
- alignment
- icon spacing
- internal and external spacing
- auto-layout behavior translated into flex/grid correctly

### E. Visual style
- colors
- borders
- radius
- typography
- shadows
- opacity
- backgrounds
- hover/pressed/focus/selected styles

### F. Interaction behavior
- hover
- pressed
- focus
- toggled
- expanded/collapsed
- input validation
- menu opening
- keyboard navigation
- async/loading behavior if implied by design system conventions

### G. Accessibility
- role
- label
- tab order
- focus ring
- keyboard interaction
- screen-reader support
- disabled semantics
- field descriptions and error messaging

### H. Responsiveness
- stacking changes
- truncation/wrapping
- adaptive size behavior
- mobile vs desktop differences if defined

---

## Implementation Rules for New Components

When creating a brand-new component from Figma:

### File placement
- place it beside related components in the established component folder structure
- follow the naming conventions already used in the codebase

### API design
- keep prop names intuitive and consistent with sibling components
- support the main Figma variants through typed props
- avoid exposing internal styling details as props unless the library already does that

### Styling
- use existing design tokens and shared utilities first
- if a missing token is truly required and clearly present in Figma, add it in the token system
- do not hardcode values that belong in tokens

### Composition
- prefer composition over monolithic configuration when the codebase already uses subcomponents
- use slots like `icon`, `prefix`, `suffix`, `helperText`, `actions` only when they reflect real design needs

### Stories
At minimum, add stories for:
- default
- all important variants
- disabled
- interactive states if supported
- icon usage if relevant
- error/success states for form components

### Tests
Where appropriate, add tests for:
- rendering
- variants
- accessibility-critical behaviors
- keyboard interactions
- state changes
- callback behavior

---

## Implementation Rules for Updating Existing Components

When updating an existing component:

1. Preserve the component's purpose.
2. Keep imports and exports stable when possible.
3. Minimize breaking changes.
4. Refactor only as much as needed to match Figma cleanly.
5. If the component is widely used, avoid introducing behavior changes without necessity.
6. If prop naming is inconsistent with Figma but already used broadly, prefer compatibility rather than renaming unless explicitly asked.
7. Update stories and tests to reflect the new design.

---

## Token Sync Rules

When Figma changes reveal token drift:

### Update tokens if:
- the value is clearly part of the design system
- multiple components depend on it
- the value represents a reusable design decision

### Do not create new tokens if:
- the value is accidental
- it only solves one questionable edge case
- the codebase already has an equivalent token with a different name

When uncertain:
- prefer the existing token system naming pattern
- document the ambiguity

---

## Expected Output Format for Each Run

At the end of the task, always provide a structured summary using this exact format:

### Sync Summary
- Figma scope reviewed:
- React scope reviewed:
- Components matched:
- Components updated:
- Components created:
- Token updates:
- Orphaned code components:
- Unclear mappings:
- Breaking changes:
- Accessibility improvements:
- Assumptions made:
- Follow-up recommendations:

### Component Diff Log
For each changed component include:
- component name
- action taken: created / updated / no change
- figma findings
- code changes made
- remaining gaps if any

### Files Changed
List every file created or edited.

---

## Decision Rules

### When to create a new component
Create a new React component when:
- there is a clear Figma component with reusable intent
- it is not just a one-off screen pattern
- no existing React component can reasonably absorb it

### When to update an existing component
Update an existing component when:
- the mapping is clear
- the React component is intended to represent the same design-system piece
- the differences are due to drift, not a product-specific customization

### When to stop and report instead of changing
Do not make speculative implementation changes when:
- Figma is ambiguous or incomplete
- the mapping between design and code is unclear
- the Figma component appears experimental, exploratory, or unfinished
- the change would cause major breaking API changes without confirmation

In those cases:
- document findings
- list the probable implementation path
- flag the blocking ambiguity

---

## Quality Bar

A successful run means:
- Figma and React are more aligned than before
- new components are implemented faithfully
- updated components match the latest design
- tokens are cleaner, not messier
- accessibility is preserved or improved
- code remains maintainable
- changes are documented clearly

---

## Suggested Execution Prompt for Claude or Cursor

Copy and use this prompt when running the task:

```md
Use the Figma MCP to inspect the design system and compare it against the React component library in this repository.

Your job is to:
1. inventory Figma components, variants, and tokens
2. inventory the React component system
3. map Figma components to React implementations
4. identify matches, missing components, outdated components, token drift, and unclear mappings
5. if a component exists in Figma and not in React, implement it to match the design system
6. if a component exists in React but Figma shows an updated design, update the React implementation to match Figma
7. update stories, tests, and exports when appropriate
8. preserve accessibility and codebase conventions
9. avoid unnecessary breaking changes
10. end with a Sync Summary, Component Diff Log, and Files Changed list

Follow the rules in figma-react-sync-agent.md exactly.
```

---

## Optional Stronger Prompt for Autonomous Runs

```md
Act as a senior design-systems engineer and UI implementation reviewer.

You have access to:
- a Figma design system through MCP
- a React codebase
- component stories/tests/tokens in the repository

Primary objective:
Synchronize the React implementation with the latest Figma design system.

Execution rules:
- treat Figma as the source of truth for visuals and component behavior intent
- treat the React codebase as the source of truth for architecture and conventions
- fix token drift before patching higher-level components when appropriate
- implement missing components found in Figma
- update existing React components when Figma changed
- do not guess when mapping is ambiguous; report ambiguity explicitly
- preserve accessibility, keyboard support, and semantic HTML
- minimize breaking API changes
- update stories/tests/exports as needed
- produce a final report with Sync Summary, Component Diff Log, and Files Changed

Work systematically from tokens to primitives to composed components.
```

---

## Optional Folder Convention Hint

If the repository already has a design-system structure, follow it. If not, prefer a structure like:

```text
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.stories.tsx
      Button.types.ts
      index.ts
  tokens/
  styles/
```

---

## Definition of Done

The task is done only when:
- all reviewed Figma components have been categorized
- all clearly missing reusable components have been implemented
- all clearly outdated components have been updated
- stories/tests/exports were adjusted where necessary
- unresolved ambiguity has been documented
- the final summary is complete
