# Kipu Design System Icons

These SVG icons are extracted from the Kipu Design System Figma file for use in the Global Header and other components.

## Header Icon Buttons

| Icon | Filename | Description |
|------|----------|-------------|
| Search | `search.svg` | Magnifying glass icon for search functionality |
| AI Sparkle | `ai-sparkle.svg` | Star/sparkle icon for AI features |
| Incoming Document | `incoming-document.svg` | Document with person icon for contact/incoming items |
| Notifications | `notifications.svg` | Bell icon for alerts and notifications |
| Download | `download.svg` | Arrow down icon for download actions |
| Email | `email.svg` | Envelope icon for messages |

### Header Icon Button Specifications
- **Icon Size**: 24×24px viewBox
- **Fill Color**: White (`#FFFFFF`)
- **Container**: 36×36px circular button
- **Background**: Purple 500 (`#6C18C9`), hover: Purple 700 (`#4D118F`)

## Kipu Product Icons (Bento Menu / App Switcher)

Based on Figma design reference (node 7684-10275):

| Icon | Filename | Description |
|------|----------|-------------|
| Helix | `kipu-helix.svg` | DNA/molecular structure icon for Kipu Helix platform |
| EMR | `kipu-emr.svg` | Document with form fields for Electronic Medical Records |
| CRM | `kipu-crm.svg` | Network/nodes icon for Customer Relationship Management |
| RCM | `kipu-rcm.svg` | Document icon for Revenue Cycle Management |
| Labs | `kipu-labs.svg` | Document icon for Labs functionality |
| Compliance | `kipu-compliance.svg` | Network icon for Compliance tracking |

### Bento Menu Product Icon Specifications
- **Icon Size**: 24×24px viewBox
- **Fill Color**: White (`#FFFFFF`)
- **Icon Background**: 40×40px circular, Purple 700 (`#4D118F`)
- **Card Size**: 100px width
- **Card Padding**: 16px top, 12px sides and bottom
- **Card Border Radius**: 4px
- **Card Border (Apps section)**: 2px solid `#F0F0F0` (inactive), `#EFF5FF` (active)
- **Card Border (Discover section)**: 2px solid `#F0E8FA`
- **Card Background (Active)**: `#EFF5FF` (Light Blue 100)
- **Label Font**: Roboto Regular, 14px, line-height 20px
- **Label Color**: Black (`#000000`), Active: Purple 900 (`#2D0A54`)

## Bento Menu Structure (Kipu Bento Box)

The Bento Menu follows this structure from Figma:

1. **Apps Section**: Primary applications (Helix, EMR, CRM)
2. **Discover More Section**: Additional apps (RCM, Labs, Compliance)
3. **Promotional Banner**: "Introducing KIP" with AI illustration

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| sublime | `box-shadow: 0px 2px 20px rgba(0,0,0,0.08)` | Menu dropdown shadow |
| Purple 700 | `#4D118F` | Icon background |
| Purple 900 | `#2D0A54` | Active text color |
| Light Blue 100 | `#EFF5FF` | Active card background, banner background |
| Gray 02 | `#F0F0F0` | Inactive card border (Apps) |
| Purple 50 | `#F0E8FA` | Card border (Discover section) |
| Gray 06 | `#666666` | Section labels ("Apps", "Discover More") |
| Blue 500 | `#1565C0` | "Learn more" link text |

## Usage

### HTML
```html
<img src="assets/icons/search.svg" alt="Search" width="24" height="24" />
```

### React JSX
```jsx
import { ReactComponent as SearchIcon } from './assets/icons/search.svg';

<SearchIcon width={24} height={24} fill="white" />
```

### Inline SVG (for React components)
```jsx
const HelixProductIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 3C10.22 3..." fill="white"/>
    ...
  </svg>
);
```

These icons are designed to be used with white fill on colored backgrounds. If you need to use them on light backgrounds, change the fill color accordingly.
