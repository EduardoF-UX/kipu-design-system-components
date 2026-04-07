<template>
  <button
    :style="buttonStyles"
    :disabled="disabled"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    type="button"
  >
    <!-- Left Icon -->
    <span 
      v-if="$slots.icon && iconPosition === 'left'" 
      class="kipu-big-button__icon"
    >
      <slot name="icon"></slot>
    </span>
    
    <!-- Button Text -->
    <slot></slot>
    
    <!-- Right Icon -->
    <span 
      v-if="$slots.icon && iconPosition === 'right'" 
      class="kipu-big-button__icon"
    >
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';

export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
export type IconPosition = 'left' | 'right';

/**
 * BigButton Component - Kipu Design System
 * 
 * A large button component matching Figma design specifications.
 * Height: 40px, Border Radius: 100px (pill shape)
 * Font: Roboto Medium 16px, uppercase
 */
export default defineComponent({
  name: 'KipuBigButton',
  
  props: {
    /** The visual style variant of the button */
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'filled',
      validator: (value: string) => 
        ['filled', 'outlined', 'text', 'elevated', 'tonal'].includes(value),
    },
    
    /** Whether the button is disabled */
    disabled: {
      type: Boolean,
      default: false,
    },
    
    /** Position of the icon relative to text */
    iconPosition: {
      type: String as PropType<IconPosition>,
      default: 'left',
      validator: (value: string) => ['left', 'right'].includes(value),
    },
    
    /** Whether button takes full container width */
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    const isHovered = ref(false);
    
    // Kipu Design System Colors (from Figma)
    const colors = {
      blue500: '#1565C0',
      blue700: '#0F4888',
      lightBlue100: '#EFF5FF',
      white: '#FFFFFF',
      gray04: '#CCCCCC',
      gray05: '#999999',
      alertRed: '#E50000',
      red700: '#A84226',
    };
    
    const baseStyles = computed(() => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      paddingTop: '12px',
      paddingBottom: '12px',
      paddingLeft: '24px',
      paddingRight: '24px',
      fontSize: '16px',
      fontWeight: '500',
      fontFamily: "'Roboto', sans-serif",
      borderRadius: '100px',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      outline: 'none',
      width: props.fullWidth ? '100%' : 'auto',
      minHeight: '40px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0',
      lineHeight: '100%',
    }));
    
    const variantStyles = computed(() => {
      const styles: Record<ButtonVariant, Record<string, string>> = {
        filled: {
          background: props.disabled ? colors.gray04 : colors.blue500,
          color: colors.white,
          boxShadow: props.disabled ? 'none' : '0px 2px 12px 0px rgba(0, 0, 0, 0.12)',
        },
        outlined: {
          background: 'transparent',
          color: props.disabled ? colors.gray04 : colors.blue500,
          border: `2px solid ${props.disabled ? colors.gray04 : colors.blue500}`,
          boxShadow: 'none',
        },
        text: {
          background: 'transparent',
          color: props.disabled ? colors.gray04 : colors.blue500,
          boxShadow: 'none',
        },
        elevated: {
          background: props.disabled ? colors.gray04 : colors.white,
          color: props.disabled ? colors.gray05 : colors.blue500,
          boxShadow: props.disabled ? 'none' : '0px 1px 8px rgba(0, 0, 0, 0.14)',
        },
        tonal: {
          background: props.disabled ? colors.gray04 : colors.alertRed,
          color: colors.white,
          boxShadow: 'none',
        },
      };
      
      return styles[props.variant] || styles.filled;
    });
    
    const hoverStyles = computed(() => {
      if (!isHovered.value || props.disabled) return {};
      
      const styles: Record<ButtonVariant, Record<string, string>> = {
        filled: {
          background: colors.blue700,
          boxShadow: '0px 2px 12px 0px rgba(0, 0, 0, 0.2)',
        },
        outlined: {
          background: colors.lightBlue100,
          color: colors.blue700,
          border: `2px solid ${colors.blue700}`,
          boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.14)',
        },
        text: {
          background: colors.lightBlue100,
          color: colors.blue700,
        },
        elevated: {
          color: colors.blue700,
          boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.18)',
        },
        tonal: {
          background: colors.red700,
        },
      };
      
      return styles[props.variant] || {};
    });
    
    const buttonStyles = computed(() => ({
      ...baseStyles.value,
      ...variantStyles.value,
      ...hoverStyles.value,
    }));
    
    const handleClick = (event: MouseEvent) => {
      if (!props.disabled) {
        emit('click', event);
      }
    };
    
    return {
      isHovered,
      buttonStyles,
      handleClick,
    };
  },
});
</script>

<style scoped>
.kipu-big-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.kipu-big-button__icon :deep(svg) {
  width: 18px;
  height: 18px;
  fill: currentColor;
}
</style>
