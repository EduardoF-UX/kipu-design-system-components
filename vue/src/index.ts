/*
 * Kipu Design System - Vue Component Library
 * Main entry point
 */

import type { App } from 'vue';
import BigButton from './BigButton.vue';

// Export individual components
export { BigButton };
export type { ButtonVariant, IconPosition } from './BigButton.vue';

// Export plugin for app.use()
export default {
  install(app: App) {
    app.component('KipuBigButton', BigButton);
  },
};

// Named export for plugin
export const KipuDesignSystem = {
  install(app: App) {
    app.component('KipuBigButton', BigButton);
  },
};
