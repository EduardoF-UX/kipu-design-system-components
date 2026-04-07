# Kipu Design System - Vue

Vue 3 component library implementing the Kipu Design System from Figma.

## Installation

```bash
npm install @kipu/design-system-vue
```

## Setup

### Option 1: Plugin (Global Registration)

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import KipuDesignSystem from '@kipu/design-system-vue';

const app = createApp(App);
app.use(KipuDesignSystem);
app.mount('#app');
```

### Option 2: Individual Component Import

```typescript
import { BigButton } from '@kipu/design-system-vue';
```

Make sure to include the Roboto font in your `index.html` or styles:

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
```

## Components

### BigButton

A large button component with 40px height and pill shape (100px border radius).

#### Usage

```vue
<template>
  <!-- Filled button (default) -->
  <KipuBigButton @click="onSave">Save</KipuBigButton>

  <!-- Outlined button -->
  <KipuBigButton variant="outlined" @click="onCancel">Cancel</KipuBigButton>

  <!-- With icon on left -->
  <KipuBigButton variant="filled">
    <template #icon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    </template>
    Add Item
  </KipuBigButton>

  <!-- With icon on right -->
  <KipuBigButton variant="outlined" icon-position="right">
    Continue
    <template #icon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
      </svg>
    </template>
  </KipuBigButton>

  <!-- Disabled -->
  <KipuBigButton :disabled="true">Disabled</KipuBigButton>

  <!-- Full width -->
  <KipuBigButton :full-width="true">Full Width</KipuBigButton>

  <!-- Tonal (red) -->
  <KipuBigButton variant="tonal">Delete</KipuBigButton>
</template>

<script setup lang="ts">
import { KipuBigButton } from '@kipu/design-system-vue';
// Or if using plugin: KipuBigButton is globally available

const onSave = () => console.log('Save clicked');
const onCancel = () => console.log('Cancel clicked');
</script>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'outlined' \| 'text' \| 'elevated' \| 'tonal'` | `'filled'` | Visual style variant |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Position of icon |
| `fullWidth` | `boolean` | `false` | Full container width |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted when button is clicked |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Button text content |
| `icon` | Icon element (18×18px) |

## Design Specifications

| Property | Value |
|----------|-------|
| Height | 40px |
| Border Radius | 100px (pill) |
| Font | Roboto Medium, 16px, uppercase |
| Padding | 12px 24px (no icon) / 12px 24px 12px 16px (with icon) |
| Icon Size | 18×18px |
| Gap | 8px |

### Color Tokens

| Variant | Enabled | Hover |
|---------|---------|-------|
| Filled | bg: #1565C0, text: white | bg: #0F4888 |
| Outlined | border: #1565C0, text: #1565C0 | bg: #EFF5FF, border: #0F4888 |
| Text | text: #1565C0 | bg: #EFF5FF, text: #0F4888 |
| Elevated | bg: white, text: #1565C0 | shadow increases |
| Tonal | bg: #E50000 (red), text: white | bg: #A84226 |

---

### TextField

A text input component with floating label and validation states.

#### Usage

```vue
<template>
  <!-- Basic usage with v-model -->
  <KipuTextField
    v-model="email"
    label="Email"
    placeholder="Enter your email"
    :required="true"
  />

  <!-- With leading icon -->
  <KipuTextField label="Search">
    <template #leadingIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27..."/>
      </svg>
    </template>
  </KipuTextField>

  <!-- With trailing icon -->
  <KipuTextField label="Password" type="password">
    <template #trailingIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5..."/>
      </svg>
    </template>
  </KipuTextField>

  <!-- Error state -->
  <KipuTextField
    v-model="email"
    label="Email"
    :error="true"
    error-text="Please enter a valid email"
  />

  <!-- Disabled -->
  <KipuTextField label="Disabled" :disabled="true" />

  <!-- Full width -->
  <KipuTextField label="Notes" :full-width="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
</script>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | v-model binding |
| `label` | `string` | `''` | Floating label text |
| `placeholder` | `string` | `'Placeholder'` | Placeholder text |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url'` | `'text'` | Input type |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `required` | `boolean` | `false` | Show required asterisk |
| `error` | `boolean` | `false` | Show error state |
| `errorText` | `string` | `''` | Error message |
| `helperText` | `string` | `''` | Helper text below input |
| `fullWidth` | `boolean` | `false` | Full container width |

#### Slots

| Slot | Description |
|------|-------------|
| `leadingIcon` | Icon at start of input (18×18px) |
| `trailingIcon` | Icon at end of input (18×18px) |

## Design Specifications - TextField

| Property | Value |
|----------|-------|
| Height | 46px |
| Border Radius | 4px |
| Border (default) | 1px solid #CCCCCC |
| Border (focused) | 2px solid #1565C0 |
| Border (error) | 2px solid #E50000 |
| Input Font | Roboto Regular, 16px |
| Label Font | Roboto Regular, 12px |
| Padding | 14px 10px 12px 14px |
| Icon Size | 18×18px |

## TypeScript Support

The library is fully typed. Import types as needed:

```typescript
import type { ButtonVariant, IconPosition, TextFieldType } from '@kipu/design-system-vue';
```
