# Kipu Design System - Angular

Angular component library implementing the Kipu Design System from Figma.

## Installation

```bash
npm install @kipu/design-system-angular
```

## Setup

Import the module in your Angular application:

```typescript
import { KipuBigButtonModule } from '@kipu/design-system-angular';

@NgModule({
  imports: [
    KipuBigButtonModule,
    // ...
  ],
})
export class AppModule {}
```

Make sure to include the Roboto font in your `index.html` or styles:

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
```

## Components

### BigButton

A large button component with 40px height and pill shape (100px border radius).

#### Usage

```html
<!-- Filled button (default) -->
<kipu-big-button (buttonClick)="onSave()">Save</kipu-big-button>

<!-- Outlined button -->
<kipu-big-button variant="outlined" (buttonClick)="onCancel()">Cancel</kipu-big-button>

<!-- With icon on left -->
<kipu-big-button variant="filled">
  <svg icon width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
  Add Item
</kipu-big-button>

<!-- With icon on right -->
<kipu-big-button variant="outlined" iconPosition="right">
  Continue
  <svg icon width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
</kipu-big-button>

<!-- Disabled -->
<kipu-big-button [disabled]="true">Disabled</kipu-big-button>

<!-- Full width -->
<kipu-big-button [fullWidth]="true">Full Width</kipu-big-button>

<!-- Tonal (red) -->
<kipu-big-button variant="tonal">Delete</kipu-big-button>
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'filled' \| 'outlined' \| 'text' \| 'elevated' \| 'tonal'` | `'filled'` | Visual style variant |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Position of icon |
| `fullWidth` | `boolean` | `false` | Full container width |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `buttonClick` | `EventEmitter<MouseEvent>` | Emitted when button is clicked |

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
