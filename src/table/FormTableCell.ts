import { css, html, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

export class FormTableCell extends LitElement {
  static styles = css`
    :host {
      user-select: none;
      display: grid;
      border: 1px solid #444444;
      margin-top: -1px;
      margin-left: -1px;
    }

    :host(.focus) {
      background-color: bisque !important;
    }
  `;

  // region properties
  @property({ type: Number, reflect: true, attribute: 'col-index' })
  colIndex = 0;

  @property({ type: Number, reflect: true, attribute: 'row-index' })
  rowIndex = 0;

  @property({ type: Number, reflect: true })
  colspan = 1;

  @property({ type: Number, reflect: true })
  rowspan = 1;

  @property({ type: String, reflect: true, attribute: 'background-color' })
  backgroundColor = 'white';

  @property({ type: String, reflect: true, attribute: 'border-left-color' })
  borderLeftColor = '';

  @property({ type: String, reflect: true, attribute: 'border-right-color' })
  borderRightColor = '';

  @property({ type: String, reflect: true, attribute: 'border-top-color' })
  borderTopColor = '';

  @property({ type: String, reflect: true, attribute: 'border-bottom-color' })
  borderBottomColor = '';

  @property({ type: String, reflect: true, attribute: 'border-left-style' })
  borderLeftStyle = '';

  @property({ type: String, reflect: true, attribute: 'border-right-style' })
  borderRightStyle = '';

  @property({ type: String, reflect: true, attribute: 'border-top-style' })
  borderTopStyle = '';

  @property({ type: String, reflect: true, attribute: 'border-bottom-style' })
  borderBottomStyle = '';

  @property({ type: String, reflect: true, attribute: 'border-left-width' })
  borderLeftWidth = '';

  @property({ type: String, reflect: true, attribute: 'border-right-width' })
  borderRightWidth = '';

  @property({ type: String, reflect: true, attribute: 'border-top-width' })
  borderTopWidth = '';

  @property({ type: String, reflect: true, attribute: 'border-bottom-width' })
  borderBottomWidth = '';
  // endregion

  public setFocus() {
    this.classList.add('focus');
  }

  public removeFocus() {
    this.classList.remove('focus');
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    Array.from(_changedProperties.keys()).forEach(key => {
      // @ts-ignore
      const newValue = this[key];
      const oldValue = _changedProperties.get(key);
      if (oldValue !== newValue) {
        // @ts-ignore
        this.style[key] = newValue;
      }
    });
  }

  protected render(): unknown {
    return html`
      <style>
        :host {
          grid-column: ${this.colIndex} / span ${this.colspan};
          grid-row: ${this.rowIndex} / span ${this.rowspan};
          background-color: ${this.backgroundColor};
        }
      </style>
      <slot></slot>
    `;
  }
}
