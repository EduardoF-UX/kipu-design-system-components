/*
 * Kipu Design System - Vue Component Library
 * Main entry point
 */

import type { App } from 'vue';
import BigButton from './BigButton.vue';
import TextField from './TextField.vue';

// Export individual components
export { BigButton, TextField };
export type { ButtonVariant, IconPosition } from './BigButton.vue';
export type { TextFieldType } from './TextField.vue';

// Export plugin for app.use()
export default {
  install(app: App) {
    app.component('KipuBigButton', BigButton);
    app.component('KipuTextField', TextField);
  },
};

// Named export for plugin
export const KipuDesignSystem = {
  install(app: App) {
    app.component('KipuBigButton', BigButton);
    app.component('KipuTextField', TextField);
  },
};
