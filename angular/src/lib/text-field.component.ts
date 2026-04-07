import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type TextFieldType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

/**
 * TextField Component - Kipu Design System
 * 
 * A text input component with floating label matching Figma design specifications.
 * Height: 46px, Border Radius: 4px
 * Font: Roboto Regular 16px (input), 12px (label)
 */
@Component({
  selector: 'kipu-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
})
export class TextFieldComponent implements ControlValueAccessor {
  /** Floating label text */
  @Input() label: string = '';
  
  /** Placeholder text */
  @Input() placeholder: string = 'Placeholder';
  
  /** Helper text below input */
  @Input() helperText: string = '';
  
  /** Error text (shown when error is true) */
  @Input() errorText: string = '';
  
  /** Show error state */
  @Input() error: boolean = false;
  
  /** Whether the field is disabled */
  @Input() disabled: boolean = false;
  
  /** Show required asterisk */
  @Input() required: boolean = false;
  
  /** Input type */
  @Input() type: TextFieldType = 'text';
  
  /** Whether field takes full container width */
  @Input() fullWidth: boolean = false;

  /** Value change event */
  @Output() valueChange = new EventEmitter<string>();

  /** Focus state */
  isFocused: boolean = false;
  
  /** Internal value */
  private _value: string = '';

  /** Kipu Design System Colors (from Figma) */
  readonly colors = {
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

  // ControlValueAccessor implementation
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  writeValue(value: string): void {
    this._value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get hasValue(): boolean {
    return this._value && this._value.length > 0;
  }

  get containerStyles(): { [key: string]: string } {
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: this.fullWidth ? '100%' : '260px',
      position: 'relative',
    };
  }

  get fieldStyles(): { [key: string]: string } {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '46px',
      paddingTop: '14px',
      paddingBottom: '12px',
      paddingLeft: '14px',
      paddingRight: '10px',
      background: this.disabled ? this.colors.gray02 : this.colors.white,
      border: this.getBorderStyle(),
      borderRadius: '4px',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease, border-width 0.1s ease',
      cursor: this.disabled ? 'not-allowed' : 'text',
    };
  }

  get inputStyles(): { [key: string]: string } {
    return {
      flex: '1',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: "'Roboto', sans-serif",
      fontWeight: '400',
      fontSize: '16px',
      lineHeight: '20px',
      color: this.disabled ? this.colors.gray05 : (this.hasValue ? this.colors.gray07 : this.colors.gray05),
      cursor: this.disabled ? 'not-allowed' : 'text',
      minWidth: '0',
      width: '100%',
    };
  }

  get labelStyles(): { [key: string]: string } {
    return {
      position: 'absolute',
      top: '-8px',
      left: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      height: '14px',
      paddingLeft: '4px',
      paddingRight: '4px',
      paddingTop: '0px',
      paddingBottom: '0px',
      background: this.disabled ? this.colors.gray02 : this.colors.white,
      fontFamily: "'Roboto', sans-serif",
      fontWeight: '400',
      fontSize: '12px',
      lineHeight: '14px',
      color: this.error ? this.colors.error : (this.isFocused ? this.colors.blue500 : this.colors.gray06),
      whiteSpace: 'nowrap',
      transition: 'color 0.2s ease',
    };
  }

  get helperStyles(): { [key: string]: string } {
    return {
      fontFamily: "'Roboto', sans-serif",
      fontWeight: '400',
      fontSize: '12px',
      lineHeight: '14px',
      color: this.error ? this.colors.error : this.colors.gray06,
      paddingLeft: '14px',
      marginTop: '-4px',
    };
  }

  get iconStyles(): { [key: string]: string } {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: this.isFocused ? this.colors.blue500 : this.colors.gray05,
      flexShrink: '0',
      width: '18px',
      height: '18px',
    };
  }

  private getBorderStyle(): string {
    if (this.error) return `2px solid ${this.colors.error}`;
    if (this.isFocused) return `2px solid ${this.colors.blue500}`;
    return `1px solid ${this.colors.gray04}`;
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
  }

  get displayHelperText(): string {
    return this.error ? this.errorText : this.helperText;
  }

  get showHelper(): boolean {
    return !!(this.helperText || this.errorText);
  }
}
