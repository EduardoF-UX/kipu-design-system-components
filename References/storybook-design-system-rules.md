# Storybook Design System Rules for Cursor / Claude

Use this file as the **single source of truth** when generating UI, layouts, interactions, and design recommendations for this product.

## Mission

Always design and generate UI using the approved Storybook components listed below. Do **not** invent new components, custom styles, or alternate interaction patterns unless there is a clear product requirement that cannot be solved with the existing system.

The goal is to ensure:
- visual consistency
- implementation fidelity
- accessibility
- scalability across screens and flows
- better alignment between design and engineering

---

## Core Behavior for Cursor / Claude

When creating any screen, flow, prototype, or front-end output:

1. **Prefer Storybook components first** before creating custom UI.
2. **Match the structure, naming, and intent** of the approved components.
3. **Use design tokens for color and typography** instead of hardcoded visual values whenever possible.
4. **Use Material Design icons only**.
5. **Only use icons in 2 sizes:** `18px` or `24px`.
6. **Preserve accessibility** with proper labels, helper text, validation, focus states, and semantic HTML.
7. **Keep patterns predictable** across all screens.
8. **Do not mix component styles** from other libraries unless explicitly requested.
9. **When in doubt, choose the most standard and reusable solution** from the approved system.
10. **Output should feel production-ready and consistent with Storybook**.

---

## Non-Negotiable Rules

### 1) Buttons
- All primary actions must use the approved **Button** component.
- Use **Icon Button** only for compact utility actions.
- Use **Button Group** when actions are visibly related and should be presented together.
- Use **Bento Menu** only when the design explicitly calls for a launcher/grid-style action entry point.
- Do not create custom CTA styling outside the approved button system.

### 2) Forms
- All text entry must use the approved **Input Text** or **Text Area** components.
- All boolean selections must use **Checkbox** or **Toggle Switch** according to meaning:
  - **Checkbox** = multi-select or yes/no form input
  - **Toggle Switch** = immediate on/off system setting
- All single-choice selections must use **Radio Button** when options should remain visible.
- Use **Dropdown** when the option list is longer or should remain collapsed.
- Use **Slider** only for ranged input where dragging is the most intuitive control.
- Do not build custom field styles when a Storybook form component already exists.

### 3) Data Display
- Use **Chips** for compact metadata, tags, filters, or tokenized selections.
- Use **Avatar** only for people, identity, or ownership representations.
- Use **Badge Status** for concise state communication such as success, warning, error, info, active, inactive, or progress-related states.
- Use **List** and **List Item** for structured collections, navigation, menus, or grouped information.
- Use **Pagination** when content is split across pages and page-level navigation is needed.

### 4) Icons
- Use icons from the **Material Design icon library only**.
- Allowed sizes only:
  - `18px x 18px`
  - `24px x 24px`
- Do not use decorative icons without meaning.
- Icons must support clarity, scanning, and action recognition.
- Keep icon usage consistent for repeated actions across screens.

### 5) Tokens
- Colors must come from the approved **Color Tokens**.
- Typography must come from the approved **Font Family and Typography Tokens**.
- Avoid hardcoded HEX values unless explicitly documented as a token fallback.
- Avoid arbitrary font sizes, weights, spacing behavior, or color usage.

---

## Approved Storybook Sources

Use these links as the reference index for approved components.

### Buttons
- Button  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-buttons-kuibutton--docs
- Bento Menu  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-buttons-kuibentomenu--docs
- Icon Button  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-buttons-kuiiconbutton--docs
- Button Group  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-buttons-kuibuttongroup--docs

### Forms
- Input Text  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-forms-kuiinput--docs
- Text Area  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-forms-kuitextarea--docs
- Checkbox  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-forms-kuicheckbox--docs
- Radio Button  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-forms-kuiradiobutton--docs
- Toggle Switch  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-forms-kuitoggleswitch--docs
- Dropdown  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-forms-kuidropdown--docs
- Slider  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-forms-kuislider--docs

### Data Display
- Chips  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-data-display-kuichip--docs
- Avatar  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-data-display-kuiavatar--docs
- Badge Status  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-data-display-kuibadgestatus--docs
- List  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-data-display-kuilist--docs
- Menu  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-data-display-kuilist--docs
- List Item  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-data-display-kuilistitem--docs
- Pagination  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/components-data-display-kuipagination--docs

### Tokens
- Color Tokens  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/getting-started-design-tokens-color-scheme--docs
- Font Family and Typography  
  https://reimagined-bassoon-wr56m4r.pages.github.io/?path=/docs/getting-started-design-tokens-typography--docs

---

## Component Selection Rules

Use these heuristics whenever generating UI.

### Buttons
- Use **Primary Button** for the main action on the screen.
- Use **Secondary / tertiary button treatments only if supported by the Button component API**.
- Use **Icon Button** for actions like close, edit, delete, overflow, search, expand, or quick tools.
- Use **Button Group** when actions are paired or when segmented decisions are needed.
- Use **Bento Menu** when surfacing a grid of destinations or grouped product areas.

### Inputs
- Use **Input Text** for short or structured entries.
- Use **Text Area** for multi-line or freeform content.
- Add labels, placeholders only when useful, helper text when needed, and validation messaging when applicable.

### Selection Controls
- Use **Checkbox** for selecting multiple items.
- Use **Radio Button** for choosing one option from a small visible set.
- Use **Dropdown** for one or more options when the list should stay collapsed.
- Use **Toggle Switch** only when the user is turning a feature/state on or off.
- Use **Slider** for quantitative adjustments, ranges, thresholds, or intensity controls.

### Status / Metadata
- Use **Badge Status** for system state.
- Use **Chips** for tags, filters, categories, assignments, or selected values.
- Use **Avatar** for user references.

### Lists and Navigation
- Use **List** for grouped, repeated, scannable information.
- Use **List Item** for each row/item structure.
- Use **Menu** patterns from the list system when actions or destinations are vertically grouped.
- Use **Pagination** when the content model actually requires multiple pages.

---

## Accessibility Rules

Always apply these rules when generating or evaluating screens:

- Every interactive control must have a clear label or accessible name.
- Inputs must expose error, disabled, focus, and valid states when relevant.
- Use semantic HTML whenever possible:
  - `button` for actions
  - `input`, `textarea`, `select` for form controls
  - `label` linked to its control
  - lists for grouped repeated items
- Never rely on color alone to communicate meaning.
- Status colors should be paired with text or icon cues.
- Maintain keyboard support and visible focus treatment.
- Preserve readable hierarchy through approved typography tokens.
- Avoid low-contrast combinations.

---

## Visual Consistency Rules

- Use spacing that feels systematic and repeatable.
- Keep alignment clean and intentional.
- Avoid decorative containers or shadows unless part of the approved design language.
- Do not introduce one-off rounded corners, borders, or hover styles.
- Reuse the same component for the same job across the product.
- Prioritize clarity over novelty.

---

## Prototyping and Code Generation Rules

When building screens in code:

- Reference the Storybook component by name whenever possible.
- Recreate the component API pattern as faithfully as possible.
- If the exact implementation is unavailable, create the closest equivalent while preserving:
  - structure
  - spacing intent
  - behavior
  - accessibility
  - token usage
- Do not replace approved components with raw HTML unless necessary.
- If a custom fallback is required, clearly comment why.

---

## Expected Output Format for Cursor / Claude

Whenever you generate a screen, component spec, or UI proposal, include:

1. **Which approved components are being used**
2. **Why each component was chosen**
3. **Any relevant token usage**
4. **Any accessibility considerations**
5. **Any assumptions or fallback decisions**

Example:

```txt
Components used:
- KUIButton for primary and secondary actions
- KUIInput for single-line text fields
- KUIDropdown for collapsed option selection
- KUIBadgeStatus for row status
- Material Design icons at 18px

Why:
- Keeps the screen aligned with the existing Storybook system
- Preserves consistent action hierarchy and form behavior
- Reduces engineering ambiguity

Accessibility:
- Inputs include labels and error messages
- Icon-only actions include aria-labels
- Status is communicated by text + badge, not color alone
```

---

## Strict Prompt Block for Cursor / Claude

Copy and reuse this instruction block whenever you want consistent output:

```txt
Use the approved Storybook design system as the default for all UI decisions.
Do not invent custom components when an approved component already exists.
Use only these component categories: Buttons, Bento Menu, Icon Button, Button Group, Input Text, Text Area, Checkbox, Radio Button, Toggle Switch, Dropdown, Slider, Chips, Avatar, Badge Status, List, Menu, List Item, Pagination.
Use approved color tokens and typography tokens instead of hardcoded styles.
Use Material Design icons only, and only at 18px or 24px.
Keep the UI accessible, production-ready, and visually consistent.
For every screen or flow you generate, explicitly mention which approved components are being used and why.
```

---

## Optional Review Mode Prompt

Use this when you want Cursor / Claude to audit a screen or code output:

```txt
Review this UI against the approved Storybook design system.
Check whether the screen uses the correct components, respects token usage, keeps icon sizes to 18px or 24px, and avoids unnecessary custom patterns.
Flag any inconsistency, accessibility risk, or component mismatch.
Then propose a corrected version using the approved Storybook components only.
```

---

## Designer Intent

This system should be interpreted with the following priorities:
1. consistency over novelty
2. scalability over one-off customization
3. accessibility over decoration
4. implementation readiness over abstract design exploration
5. reusable patterns over bespoke components

If there is uncertainty, always choose the option that is **more reusable, more accessible, and closer to the approved Storybook system**.
