import { css, html, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { FormTableCell } from './FormTableCell.js';
import { FormTableInterface } from './FormTableInterface.js';

export class FormTable extends LitElement implements FormTableInterface {
  static styles = css`
    :host {
      display: grid;
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

  // region key event

  private _onKeyDownHandler = this._onKeyDown.bind(this);

  private _onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case 'KeyM':
        this.merge();
        break;
      case 'KeyS':
        this.split();
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('_onKeyDown', event.code);
        break;
    }
  }

  // endregion

  // region select TableCell
  private _selection: FormTableCell[] = [];

  private _pressedCell: FormTableCell | undefined;

  private _onMouseDownHandler = this._onMouseDown.bind(this);

  private _onMouseDown(event: MouseEvent) {
    this._clearSelection();
    window.addEventListener('mousemove', this._onMouseMoveHandler);
    window.addEventListener('mouseup', this._onMouseUpHandler);
    const target = event.target as HTMLElement;
    this._pressedCell = target.closest('form-table-cell') as FormTableCell;
  }

  private _onMouseMoveHandler = this._onMouseMove.bind(this);

  private _onMouseMove(event: Event) {
    const target = event.target as FormTableCell;
    const cell = target.closest('form-table-cell') as FormTableCell;

    const start = {
      x: Math.min(this._pressedCell!.colIndex, cell.colIndex),
      y: Math.min(this._pressedCell!.rowIndex, cell.rowIndex),
    };
    const end = {
      x: Math.max(
        this._pressedCell!.colIndex + this._pressedCell!.colspan - 1,
        cell.colIndex + cell.colspan - 1
      ),
      y: Math.max(
        this._pressedCell!.rowIndex + this._pressedCell!.rowspan - 1,
        cell.rowIndex + cell.rowspan - 1
      ),
    };

    this._setSelection(start, end);
  }

  private _onMouseUpHandler = this._onMouseUp.bind(this);

  private _onMouseUp() {
    window.removeEventListener('mousemove', this._onMouseMoveHandler);
    window.removeEventListener('mouseup', this._onMouseUpHandler);
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
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    this.querySelectorAll<FormTableCell>('form-table-cell').forEach(cell => {
      if (
        (cell.colIndex >= start.x &&
          cell.colIndex <= end.x &&
          cell.rowIndex >= start.y &&
          cell.rowIndex <= end.y) ||
        (cell.colIndex + cell.colspan - 1 >= start.x &&
          cell.colIndex + cell.colspan - 1 <= end.x &&
          cell.rowIndex + cell.rowspan - 1 >= start.y &&
          cell.rowIndex + cell.rowspan - 1 <= end.y)
      ) {
        this._addSelection(cell);
      }
    });
    const minSelectionX = this._selection
      .map(selectedCell => selectedCell.colIndex)
      .reduce((previous, current) => Math.min(previous, current));
    const minSelectionY = this._selection
      .map(selectedCell => selectedCell.rowIndex)
      .reduce((previous, current) => Math.min(previous, current));
    const maxSelectionX = this._selection
      .map(selectedCell => selectedCell.colIndex + selectedCell.colspan - 1)
      .reduce((previous, current) => Math.max(previous, current));
    const maxSelectionY = this._selection
      .map(selectedCell => selectedCell.rowIndex + selectedCell.rowspan - 1)
      .reduce((previous, current) => Math.max(previous, current));
    if (
      start.x !== minSelectionX ||
      end.x !== maxSelectionX ||
      start.y !== minSelectionY ||
      end.y !== maxSelectionY
    ) {
      this._setSelection(
        { x: minSelectionX, y: minSelectionY },
        { x: maxSelectionX, y: maxSelectionY }
      );
    }
  }

  private _clearSelection() {
    this._selection.forEach(cell => cell.removeFocus());
    this._selection = [];
  }

  // endregion

  // public functions
  merge(): void {
    const copiedSelection = [...this._selection];
    const first = copiedSelection
      .sort((a, b) => a.colIndex - b.colIndex)
      .sort((a, b) => a.rowIndex - b.rowIndex)
      .shift();

    if (first) {
      const rowSpan = Array.from(Array(this.col).keys())
        .map(x =>
          this._selection
            .filter(cell => cell.colIndex === x + 1)
            .map(cell => cell.rowspan)
            .reduce((previous, current) => previous + current, 0)
        )
        .reduce((previous, current) => Math.max(previous, current));
      const colSpan = Array.from(Array(this.row).keys())
        .map(y =>
          this._selection
            .filter(cell => cell.rowIndex === y + 1)
            .map(cell => cell.colspan)
            .reduce((previous, current) => previous + current, 0)
        )
        .reduce((previous, current) => Math.max(previous, current));

      // eslint-disable-next-line no-console
      console.log('colSpan', colSpan, 'rowSpan', rowSpan);

      first.colspan = colSpan;
      first.rowspan = rowSpan;
      copiedSelection.forEach(cell => cell?.remove());
    }
  }

  split(): void {
    const copiedSelection = [...this._selection];
    const first = copiedSelection
      .sort((a, b) => a.colIndex - b.colIndex)
      .sort((a, b) => a.rowIndex - b.rowIndex)
      .shift();

    if (first) {
      const { colIndex, rowIndex, colspan, rowspan } = first;
      Array.from(Array(rowspan).keys()).forEach(y => {
        Array.from(Array(colspan).keys()).forEach(x => {
          const newColIndex = colIndex + x;
          const newRowIndex = rowIndex + y;
          if (!this._getGridItem(newColIndex, newRowIndex)) {
            const newItem = this._createGridItem(newColIndex, newRowIndex);
            this.appendChild(newItem);
          }
        });
      });
      first.colspan = 1;
      first.rowspan = 1;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  insertColLeft(): void {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  insertColRight(): void {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  insertRowAbove(): void {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  insertRowBelow(): void {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  onCreateGridItem(): void {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  onRemoveGridItem(): void {
    throw new Error('Method not implemented.');
  }

  // endregion

  // region private functions
  private _createGridItem = (col: number, row: number) => {
    const element = document.createElement('form-table-cell') as FormTableCell;
    element.colIndex = col;
    element.rowIndex = row;
    return element;
  };

  private _getGridItem(col: number, row: number) {
    return this.querySelector(
      `form-table-cell[col-index="${col}"][row-index="${row}"]`
    );
  }

  // endregion

  private _onSlotChange() {
    const cells = this.querySelectorAll<FormTableCell>('form-table-cell');

    cells.forEach(cell => {
      cell.addEventListener('mousedown', this._onMouseDownHandler);
    });

    this.col = Array.from(cells)
      .map(cell => cell.colIndex + cell.colspan - 1)
      .reduce((previous, current) => Math.max(previous, current), 0);

    this.row = Array.from(cells)
      .map(cell => cell.rowIndex + cell.rowspan - 1)
      .reduce((previous, current) => Math.max(previous, current), 0);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._onKeyDownHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.addEventListener('keydown', this._onKeyDownHandler);
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
