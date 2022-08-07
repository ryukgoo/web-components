import { css, html, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { FormTableCell } from './FormTableCell.js';

export class FormTable extends LitElement {
  static styles = css`
    :host {
      display: inline-grid;
      width: 100%;
      border-collapse: collapse;
      box-sizing: border-box;
      grid-auto-columns: 1fr;
      grid-auto-rows: minmax(32px, auto);
      gap: 0;
    }
  `;

  @property({ type: Number, reflect: true })
  col = 0;

  @property({ type: Number, reflect: true })
  row = 0;

  private _selection: FormTableCell[] = [];

  private _pressedCell: FormTableCell | undefined;

  private _onMouseDownHandler = this._onMouseDown.bind(this);

  private _onMouseDown(event: MouseEvent) {
    window.addEventListener('mousemove', this._onMouseMoveHandler);
    window.addEventListener('mouseup', this._onMouseUpHandler);
    const target = event.target as HTMLElement;
    this._pressedCell = target.closest('form-table-cell') as FormTableCell;
  }

  private _onMouseMoveHandler = this._onMouseMove.bind(this);

  private _onMouseMove(event: Event) {
    const target = event.target as FormTableCell;
    const cell = target.closest('form-table-cell') as FormTableCell;
    this._setSelection(this._pressedCell!, cell);
    this._addSelection(cell);
  }

  private _onMouseUpHandler = this._onMouseUp.bind(this);

  private _onMouseUp() {
    window.removeEventListener('mousemove', this._onMouseMoveHandler);
    window.removeEventListener('mouseup', this._onMouseUpHandler);
    this._clearSelection();
  }

  private _addSelection(cell: FormTableCell | undefined) {
    if (cell && !this._selection.includes(cell)) {
      this._selection.push(cell);
    }

    this._selection.forEach(selectedCell => {
      selectedCell?.setFocus();
    });
  }

  private _setSelection(
    startCell: FormTableCell | undefined,
    endCell: FormTableCell | undefined
  ) {
    this._clearSelection();
    if (!startCell || !endCell) return;
    const minCol = Math.min(startCell.colIndex, endCell.colIndex);
    const maxCol = Math.max(
      startCell.colIndex + startCell.colSpan - 1,
      endCell.colIndex + endCell.colSpan - 1
    );
    const minRow = Math.min(startCell.rowIndex, endCell.rowIndex);
    const maxRow = Math.max(
      startCell.rowIndex + startCell.rowSpan - 1,
      endCell.rowIndex + endCell.rowSpan - 1
    );
    this.querySelectorAll<FormTableCell>('form-table-cell').forEach(cell => {
      if (
        (cell.colIndex >= minCol &&
          cell.colIndex <= maxCol &&
          cell.rowIndex >= minRow &&
          cell.rowIndex <= maxRow) ||
        (cell.colIndex + cell.colSpan - 1 >= minCol &&
          cell.colIndex + cell.colSpan - 1 <= maxCol &&
          cell.rowIndex + cell.rowSpan - 1 >= minRow &&
          cell.rowIndex + cell.rowSpan - 1 <= maxRow)
      ) {
        this._addSelection(cell);
      }
    });
  }

  private _clearSelection() {
    this._selection.forEach(cell => cell.removeFocus());
    this._selection = [];
  }

  private _onSlotChange() {
    const cells = this.querySelectorAll<FormTableCell>('form-table-cell');

    cells.forEach(cell => {
      cell.addEventListener('mousedown', this._onMouseDownHandler);
    });

    this.col = Array.from(cells)
      .map(cell => cell.colIndex + cell.colSpan - 1)
      .reduce((previous, current) => Math.max(previous, current), 0);

    this.row = Array.from(cells)
      .map(cell => cell.rowIndex + cell.rowSpan - 1)
      .reduce((previous, current) => Math.max(previous, current), 0);
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (_changedProperties.has('col')) {
      this.style.gridTemplateColumns = `repeat(${this.col}, 1fr)`;
    }
    if (_changedProperties.has('row')) {
      this.style.gridTemplateRows = `repeat(${this.row}, auto)`;
    }
  }

  protected render(): unknown {
    return html` <slot @slotchange="${this._onSlotChange}"></slot>`;
  }
}
