<template>
  <div :style="containerStyles">
    <div :style="fieldStyles">
      <!-- Leading Icon -->
      <span v-if="$slots.leadingIcon" :style="iconStyles">
        <slot name="leadingIcon"></slot>
      </span>
      
      <!-- Input -->
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :style="inputStyles"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      
      <!-- Trailing Icon -->
      <span v-if="$slots.trailingIcon" :style="iconStyles">
        <slot name="trailingIcon"></slot>
      </span>
    </div>
    
    <!-- Floating Label -->
    <div v-if="label" :style="labelStyles">
      <span>{{ label }}</span>
      <span v-if="required">*</span>
    </div>
    
    <!-- Helper/Error Text -->
    <span v-if="showHelper" :style="helperStyles">
      {{ displayHelperText }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';

export type TextFieldType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

/**
 * TextField Component - Kipu Design System
 * 
 * A text input component with floating label matching Figma design specifications.
 * Height: 46px, Border Radius: 4px
 * Font: Roboto Regular 16px (input), 12px (label)
 */
export default defineComponent({
  name: 'KipuTextField',
  
  props: {
    /** v-model binding */
    modelValue: {
      type: String,
      default: '',
    },
    
    /** Floating label text */
    label: {
      type: String,
      default: '',
    },
    
    /** Placeholder text */
    placeholder: {
      type: String,
      default: 'Placeholder',
    },
    
    /** Helper text below input */
    helperText: {
      type: String,
      default: '',
    },
    
    /** Error text (shown when error is true) */
    errorText: {
      type: String,
      default: '',
    },
    
    /** Show error state */
    error: {
      type: Boolean,
      default: false,
    },
    
    /** Whether the field is disabled */
    disabled: {
      type: Boolean,
      default: false,
    },
    
    /** Show required asterisk */
    required: {
      type: Boolean,
      default: false,
    },
    
    /** Input type */
    type: {
      type: String as PropType<TextFieldType>,
      default: 'text',
    },
    
    /** Whether field takes full container width */
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
  
  emits: ['update:modelValue'],
  
  setup(props, { emit }) {
    const isFocused = ref(false);
    
    // Kipu Design System Colors (from Figma)
    const colors = {
      blue500: '#1565C0',
      blue700: '#0F4888',
      white: '#FFFFFF',
      gray02: '#F0F0F0',
      gray04: '#CCCCCC',
      gray05: '#999999',
      gray06: '#666666',
      gray07: '#333333',
      error: '#E50000',
    };
    
    const hasValue = computed(() => props.modelValue && props.modelValue.length > 0);
    
    const getBorderStyle = () => {
      if (props.error) return `2px solid ${colors.error}`;
      if (isFocused.value) return `2px solid ${colors.blue500}`;
      return `1px solid ${colors.gray04}`;
    };
    
    const containerStyles = computed(() => ({
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      width: props.fullWidth ? '100%' : '260px',
      position: 'relative' as const,
    }));
    
    const fieldStyles = computed(() => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '46px',
      paddingTop: '14px',
      paddingBottom: '12px',
      paddingLeft: '14px',
      paddingRight: '10px',
      background: props.disabled ? colors.gray02 : colors.white,
      border: getBorderStyle(),
      borderRadius: '4px',
      boxSizing: 'border-box' as const,
      transition: 'border-color 0.2s ease, border-width 0.1s ease',
      cursor: props.disabled ? 'not-allowed' : 'text',
    }));
    
    const inputStyles = computed(() => ({
      flex: '1',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: "'Roboto', sans-serif",
      fontWeight: '400',
      fontSize: '16px',
      lineHeight: '20px',
      color: props.disabled ? colors.gray05 : (hasValue.value ? colors.gray07 : colors.gray05),
      cursor: props.disabled ? 'not-allowed' : 'text',
      minWidth: '0',
      width: '100%',
    }));
    
    const labelStyles = computed(() => ({
      position: 'absolute' as const,
      top: '-6px',
      left: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      height: '14px',
      paddingLeft: '2px',
      paddingRight: '2px',
      paddingTop: '4px',
      paddingBottom: '4px',
      background: props.disabled ? colors.gray02 : colors.white,
      fontFamily: "'Roboto', sans-serif",
      fontWeight: '400',
      fontSize: '12px',
      lineHeight: '14px',
      color: props.error ? colors.error : (isFocused.value ? colors.blue500 : colors.gray06),
      whiteSpace: 'nowrap' as const,
      transition: 'color 0.2s ease',
    }));
    
    const helperStyles = computed(() => ({
      fontFamily: "'Roboto', sans-serif",
      fontWeight: '400',
      fontSize: '12px',
      lineHeight: '14px',
      color: props.error ? colors.error : colors.gray06,
      paddingLeft: '14px',
      marginTop: '-4px',
    }));
    
    const iconStyles = computed(() => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isFocused.value ? colors.blue500 : colors.gray05,
      flexShrink: '0',
      width: '18px',
      height: '18px',
    }));
    
    const showHelper = computed(() => !!(props.helperText || props.errorText));
    
    const displayHelperText = computed(() => props.error ? props.errorText : props.helperText);
    
    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.value);
    };
    
    const onFocus = () => {
      isFocused.value = true;
    };
    
    const onBlur = () => {
      isFocused.value = false;
    };
    
    return {
      isFocused,
      containerStyles,
      fieldStyles,
      inputStyles,
      labelStyles,
      helperStyles,
      iconStyles,
      showHelper,
      displayHelperText,
      onInput,
      onFocus,
      onBlur,
    };
  },
});
</script>

<style scoped>
:deep([leadingIcon]) svg,
:deep([trailingIcon]) svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}
</style>
