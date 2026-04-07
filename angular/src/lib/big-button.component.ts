import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
export type IconPosition = 'left' | 'right';

/**
 * BigButton Component - Kipu Design System
 * 
 * A large button component matching Figma design specifications.
 * Height: 40px, Border Radius: 100px (pill shape)
 * Font: Roboto Medium 16px, uppercase
 */
@Component({
  selector: 'kipu-big-button',
  templateUrl: './big-button.component.html',
  styleUrls: ['./big-button.component.scss'],
})
export class BigButtonComponent {
  /** The visual style variant of the button */
  @Input() variant: ButtonVariant = 'filled';
  
  /** Whether the button is disabled */
  @Input() disabled: boolean = false;
  
  /** Position of the icon relative to text */
  @Input() iconPosition: IconPosition = 'left';
  
  /** Whether button takes full container width */
  @Input() fullWidth: boolean = false;
  
  /** Click event emitter */
  @Output() buttonClick = new EventEmitter<MouseEvent>();

  /** Track hover state */
  isHovered: boolean = false;

  /** Kipu Design System Colors (from Figma) */
  readonly colors = {
    blue500: '#1565C0',
    blue700: '#0F4888',
    lightBlue100: '#EFF5FF',
    white: '#FFFFFF',
    gray04: '#CCCCCC',
    gray05: '#999999',
    alertRed: '#E50000',
    red700: '#A84226',
  };

  @HostBinding('style.display') get displayStyle() {
    return this.fullWidth ? 'block' : 'inline-block';
  }

  get buttonClasses(): string[] {
    const classes = ['kipu-big-button', `kipu-big-button--${this.variant}`];
    if (this.disabled) classes.push('kipu-big-button--disabled');
    if (this.isHovered && !this.disabled) classes.push('kipu-big-button--hovered');
    if (this.fullWidth) classes.push('kipu-big-button--full-width');
    return classes;
  }

  get buttonStyles(): { [key: string]: string } {
    const baseStyles = this.getBaseStyles();
    const variantStyles = this.getVariantStyles();
    const hoverStyles = this.isHovered && !this.disabled ? this.getHoverStyles() : {};
    
    return { ...baseStyles, ...variantStyles, ...hoverStyles };
  }

  private getBaseStyles(): { [key: string]: string } {
    return {
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
      cursor: this.disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      outline: 'none',
      width: this.fullWidth ? '100%' : 'auto',
      minHeight: '40px',
      textTransform: 'uppercase',
      letterSpacing: '0',
      lineHeight: '100%',
    };
  }

  private getVariantStyles(): { [key: string]: string } {
    const styles: { [key: string]: { [key: string]: string } } = {
      filled: {
        background: this.disabled ? this.colors.gray04 : this.colors.blue500,
        color: this.colors.white,
        boxShadow: this.disabled ? 'none' : '0px 2px 12px 0px rgba(0, 0, 0, 0.12)',
      },
      outlined: {
        background: 'transparent',
        color: this.disabled ? this.colors.gray04 : this.colors.blue500,
        border: `2px solid ${this.disabled ? this.colors.gray04 : this.colors.blue500}`,
        boxShadow: 'none',
      },
      text: {
        background: 'transparent',
        color: this.disabled ? this.colors.gray04 : this.colors.blue500,
        boxShadow: 'none',
      },
      elevated: {
        background: this.disabled ? this.colors.gray04 : this.colors.white,
        color: this.disabled ? this.colors.gray05 : this.colors.blue500,
        boxShadow: this.disabled ? 'none' : '0px 1px 8px rgba(0, 0, 0, 0.14)',
      },
      tonal: {
        background: this.disabled ? this.colors.gray04 : this.colors.alertRed,
        color: this.colors.white,
        boxShadow: 'none',
      },
    };

    return styles[this.variant] || styles['filled'];
  }

  private getHoverStyles(): { [key: string]: string } {
    const styles: { [key: string]: { [key: string]: string } } = {
      filled: {
        background: this.colors.blue700,
        boxShadow: '0px 2px 12px 0px rgba(0, 0, 0, 0.2)',
      },
      outlined: {
        background: this.colors.lightBlue100,
        color: this.colors.blue700,
        border: `2px solid ${this.colors.blue700}`,
        boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.14)',
      },
      text: {
        background: this.colors.lightBlue100,
        color: this.colors.blue700,
      },
      elevated: {
        color: this.colors.blue700,
        boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.18)',
      },
      tonal: {
        background: this.colors.red700,
      },
    };

    return styles[this.variant] || {};
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
