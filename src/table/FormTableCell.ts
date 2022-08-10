import { css, html, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

export class FormTableCell extends LitElement {
  static styles = css`
    :host {
      display: table-cell;
      user-select: none;
      border: 1px solid #444444;
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

  @property({ type: String, reflect: true, attribute: 'horizontal-align' })
  horizontalAlign = 'left';

  @property({ type: String, reflect: true, attribute: 'vertical-align' })
  verticalAlign = 'middle';

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

  // region event handler
  private _onMouseDownCol(event: Event) {
    this.dispatchEvent(new CustomEvent('mousedownCol', event));
    event.stopPropagation();
  }

  private _onMouseDownRow(event: Event) {
    this.dispatchEvent(new CustomEvent('mousedownRow', event));
    event.stopPropagation();
  }

  // endregion

  public setFocus() {
    this.classList.add('focus');
  }

  public removeFocus() {
    this.classList.remove('focus');
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (_changedProperties.has('verticalAlign')) {
      this.style.alignItems = this.verticalAlign;
    }
    if (_changedProperties.has('horizontalAlign')) {
      this.style.justifyContent = this.horizontalAlign;
    }

    Array.from(_changedProperties.keys()).forEach(key => {
      if (!key.toString().includes('border')) return;
      // @ts-ignore
      const newValue = this[key];
      const oldValue = _changedProperties.get(key);
      // @ts-ignore
      if (this.style[key] && oldValue !== newValue) {
        // @ts-ignore
        this.style[key] = newValue;
      }
    });
  }

  protected render(): unknown {
    return html`
      <style>
        :host {
          box-sizing: border-box;
          position: relative;
          grid-column: ${this.colIndex} / span ${this.colspan};
          grid-row: ${this.rowIndex} / span ${this.rowspan};
          background-color: ${this.backgroundColor};
          margin-top: -${this.style.borderTopWidth !== ''
            ? this.style.borderTopWidth
            : 1}px;
          margin-left: -${this.style.borderLeftWidth !== ''
            ? this.style.borderLeftWidth
            : 1}px;
        }

        .resize-handle {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          background: red;
          opacity: 0;
          width: 5px;
          height: 100%;
          cursor: col-resize;
        }

        .resize-handle:hover,
        .header--being-resized .resize-handle {
          opacity: 0.5;
        }

        .resize-handle-row {
          position: absolute;
          right: 0;
          bottom: 0;
          background: red;
          opacity: 0;
          width: 100%;
          height: 5px;
          cursor: row-resize;
        }

        .resize-handle-row:hover {
          opacity: 0.5;
        }
      </style>
      <span
        class="resize-handle-row"
        @mousedown="${this._onMouseDownRow}"
      ></span>
      <span class="resize-handle" @mousedown="${this._onMouseDownCol}"></span>
      <slot></slot>
    `;
  }
}
