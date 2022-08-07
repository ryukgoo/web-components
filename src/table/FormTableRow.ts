import { css, html, LitElement } from 'lit';

export class FormTableRow extends LitElement {
  static styles = css`
    :host {
      display: table-row;
      min-height: 32px;
      margin-top: -1px;
    }
  `;

  protected render(): unknown {
    return html` <slot></slot>`;
  }
}
