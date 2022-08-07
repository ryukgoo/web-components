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

  @property({ type: Number, reflect: true, attribute: 'col-index' })
  colIndex = 0;

  @property({ type: Number, reflect: true, attribute: 'row-index' })
  rowIndex = 0;

  @property({ type: Number, reflect: true, attribute: 'colspan' })
  colSpan = 1;

  @property({ type: Number, reflect: true, attribute: 'rowspan' })
  rowSpan = 1;

  @property({ type: String, reflect: true, attribute: 'background-color' })
  backgroundColor = 'white';

  @property({ type: String, reflect: true, attribute: 'border-left-color' })
  borderLeftColor = 'black';

  @property({ type: String, reflect: true, attribute: 'border-right-color' })
  borderRightColor = 'black';

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (
      _changedProperties.has('colSpan') ||
      _changedProperties.has('colIndex')
    ) {
      this.style.gridColumn = `${this.colIndex} / span ${this.colSpan}`;
    }
    if (
      _changedProperties.has('rowSpan') ||
      _changedProperties.has('rowIndex')
    ) {
      this.style.gridRow = `${this.rowIndex} / span ${this.rowSpan}`;
    }
    if (_changedProperties.has('backgroundColor')) {
      this.style.backgroundColor = `${this.backgroundColor}`;
    }
    if (_changedProperties.has('borderLeftColor')) {
      this.style.borderLeftColor = `${this.borderLeftColor}`;
    }
    if (_changedProperties.has('borderRightColor')) {
      this.style.borderRightColor = `${this.borderRightColor}`;
    }
  }

  public setFocus() {
    this.classList.add('focus');
  }

  public removeFocus() {
    this.classList.remove('focus');
  }

  protected render(): unknown {
    return html` <slot></slot> `;
  }
}
