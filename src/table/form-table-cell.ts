import { css, html, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

export class FormTableCell extends LitElement {
  static styles = css`
    :host {
      //display: table-cell;
      display: flex;
      align-items: center;
      align-content: center;
      flex-wrap: wrap;
      user-select: none;
      border-right: 1px solid black;
      border-bottom: 1px solid black;

      ::slotted(*) {
        flex: 0 0 auto;
        width: 100%;
      }
    }

    :host(.focus) {
      background-color: rgba(0, 0, 255, 0.1) !important;
    }

    :host([row-index='1']) {
      border-top: 1px solid black;
    }

    :host([col-index='1']) {
      border-left: 1px solid black;
    }

    .resize-handle {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      background: transparent;
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
      background: transparent;
      opacity: 0;
      width: 100%;
      height: 5px;
      cursor: row-resize;
    }

    .resize-handle-row:hover {
      opacity: 0.5;
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
  backgroundColor = '';

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

  public leftSiblings: FormTableCell[] = [];

  public rightSiblings: FormTableCell[] = [];

  public topSiblings: FormTableCell[] = [];

  public bottomSiblings: FormTableCell[] = [];

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

  private _reverseBorderKey = (key: string) => {
    switch (key) {
      case 'borderLeftColor':
        return 'borderRightColor';
      case 'borderLeftStyle':
        return 'borderRightStyle';
      case 'borderLeftWidth':
        return 'borderRightWidth';
      case 'borderRightColor':
        return 'borderLeftColor';
      case 'borderRightStyle':
        return 'borderLeftStyle';
      case 'borderRightWidth':
        return 'borderLeftWidth';
      case 'borderTopColor':
        return 'borderBottomColor';
      case 'borderTopStyle':
        return 'borderBottomStyle';
      case 'borderTopWidth':
        return 'borderBottomWidth';
      case 'borderBottomColor':
        return 'borderTopColor';
      case 'borderBottomStyle':
        return 'borderTopStyle';
      case 'borderBottomWidth':
        return 'borderTopWidth';
      default:
        return '';
    }
  };

  // endregion

  public setFocus() {
    this.classList.add('focus');
  }

  public removeFocus() {
    this.classList.remove('focus');
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (_changedProperties.has('backgroundColor')) {
      this.style.backgroundColor = this.backgroundColor;
    }
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
      if (this.style[key] !== undefined && oldValue !== newValue) {
        // @ts-ignore
        this.style[key] = newValue;
        // console.log('key', key);
        if (key.toString().includes('Left')) {
          this.leftSiblings?.forEach(left => {
            const reverseKey = this._reverseBorderKey(key.toString());
            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            left[reverseKey] = newValue;
          });
        }
        if (key.toString().includes('Right')) {
          this.rightSiblings?.forEach(right => {
            const reverseKey = this._reverseBorderKey(key.toString());
            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            right[reverseKey] = newValue;
          });
        }
        if (key.toString().includes('Top')) {
          this.topSiblings?.forEach(top => {
            const reverseKey = this._reverseBorderKey(key.toString());
            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            top[reverseKey] = newValue;
          });
        }
        if (key.toString().includes('Bottom')) {
          this.bottomSiblings?.forEach(bottom => {
            const reverseKey = this._reverseBorderKey(key.toString());
            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            bottom[reverseKey] = newValue;
          });
        }
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
