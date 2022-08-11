import { css, html, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { range } from 'lit-html/directives/range.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { map } from 'lit-html/directives/map.js';
import { FormTableCell } from './FormTableCell.js';

export type Point = { x: number; y: number };

export class FormTable extends LitElement {
  static styles = css`
    :host {
      display: grid;
      box-sizing: border-box;
      gap: 0;
    }
  `;

  @property({ type: Number, reflect: true })
  col = 2;

  @property({ type: Number, reflect: true })
  row = 2;

  static sizeArrayToString = (array: number[]) =>
    array.map(size => `${size}px`).join(' ');

  static stringToSizeArray = (value: string) =>
    value
      ?.split(' ')
      .map(stringValue => JSON.parse(stringValue.replace('px', ''))) ?? [];

  @property({
    type: String,
    reflect: true,
    attribute: 'col-sizes',
    converter: {
      fromAttribute: FormTable.stringToSizeArray,
      toAttribute: FormTable.sizeArrayToString,
    },
  })
  colSizes: number[] = [];

  @property({
    type: String,
    reflect: true,
    attribute: 'row-sizes',
    converter: {
      fromAttribute: FormTable.stringToSizeArray,
      toAttribute: FormTable.sizeArrayToString,
    },
  })
  rowSizes: number[] = [];

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

  // region resize event
  private _resizeCell: FormTableCell | undefined;

  private _onMouseDownColHandler = this._onMouseDownCol.bind(this);

  private _onMouseDownCol(event: Event) {
    this._resizeCell = event.target as FormTableCell;
    window.addEventListener('mousemove', this._onMouseMoveColHandler);
    window.addEventListener('mouseup', this._onMouseUpColHandler);
    this._clearSelection();
  }

  private _onMouseMoveColHandler = this._onMouseMoveCol.bind(this);

  private _onMouseMoveCol(event: Event) {
    const mouseEvent = event as MouseEvent;
    requestAnimationFrame(() => {
      const colIndex = this._resizeCell?.colIndex ?? 1;
      const colspan = this._resizeCell?.colspan ?? 1;
      const resizedIndex = colIndex + colspan - 1 - 1;
      const header = this.shadowRoot?.querySelector(
        `th[data-set-index="${resizedIndex}"]`
      );
      const width = Math.floor(
        mouseEvent.clientX - (header?.getBoundingClientRect().x ?? 0)
      );
      const resizedWidth = Math.max(width, 60);

      const copiedColSizes = [...this.colSizes];
      const prevColSize = copiedColSizes[resizedIndex];
      copiedColSizes[resizedIndex] = resizedWidth;

      const nextColSize = copiedColSizes[resizedIndex + 1];
      if (nextColSize !== undefined) {
        copiedColSizes[resizedIndex + 1] =
          nextColSize + prevColSize - resizedWidth;
        if (copiedColSizes[resizedIndex + 1] < 60) return;
      }
      this.colSizes = copiedColSizes;
    });
  }

  private _onMouseUpColHandler = this._onMouseUpCol.bind(this);

  private _onMouseUpCol() {
    window.removeEventListener('mousemove', this._onMouseMoveColHandler);
    window.removeEventListener('mouseup', this._onMouseUpColHandler);
    // TODO: send message colSizes
  }

  private _onMouseDownRowHandler = this._onMouseDownRow.bind(this);

  private _onMouseDownRow(event: Event) {
    this._resizeCell = event.target as FormTableCell;
    window.addEventListener('mousemove', this._onMouseMoveRowHandler);
    window.addEventListener('mouseup', this._onMouseUpRowHandler);
    this._clearSelection();
  }

  private _onMouseMoveRowHandler = this._onMouseMoveRow.bind(this);

  private _onMouseMoveRow(event: Event) {
    const mouseEvent = event as MouseEvent;
    requestAnimationFrame(() => {
      const rowIndex = this._resizeCell?.rowIndex ?? 1;
      const rowspan = this._resizeCell?.rowspan ?? 1;
      const resizedIndex = rowIndex + rowspan - 1 - 1;
      const row = this.shadowRoot?.querySelector(
        `tr[data-set-index="${resizedIndex}"]`
      );
      const height = Math.floor(
        mouseEvent.clientY - (row?.getBoundingClientRect().y ?? 0)
      );
      const resizedHeight = Math.max(height, 32);

      const copiedRowSizes = [...this.rowSizes];
      copiedRowSizes[resizedIndex] = resizedHeight;
      this.rowSizes = copiedRowSizes;
    });
  }

  private _onMouseUpRowHandler = this._onMouseUpRow.bind(this);

  private _onMouseUpRow() {
    window.removeEventListener('mousemove', this._onMouseMoveRowHandler);
    window.removeEventListener('mouseup', this._onMouseUpRowHandler);
    // TODO: send message rowSizes
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
    this._addSelection(this._pressedCell);
  }

  private _onMouseMoveHandler = this._onMouseMove.bind(this);

  private _onMouseMove(event: Event) {
    const target = event.target as FormTableCell;
    const cell = target.closest('form-table-cell') as FormTableCell;

    if (!cell) return;

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

  private _rectOverlap = (l1: Point, r1: Point, l2: Point, r2: Point) => {
    const startMinX = Math.min(l1.x, r1.x);
    const startMaxX = Math.max(l1.x, r1.x);
    const startMinY = Math.min(l1.y, r1.y);
    const startMaxY = Math.max(l1.y, r1.y);
    const endMinX = Math.min(l2.x, r2.x);
    const endMaxX = Math.max(l2.x, r2.x);
    const endMinY = Math.min(l2.y, r2.y);
    const endMaxY = Math.max(l2.y, r2.y);
    return !(
      startMinX > endMaxX ||
      endMinX > startMaxX ||
      startMinY > endMaxY ||
      endMinY > startMaxY
    );
  };

  private _setSelection(start: Point, end: Point) {
    this._clearSelection();
    this._selection = [this._pressedCell!];
    this.querySelectorAll<FormTableCell>('form-table-cell').forEach(cell => {
      const cellStart = { x: cell.colIndex, y: cell.rowIndex };
      const cellEnd = {
        x: cell.colIndex + (cell.colspan ?? 1) - 1,
        y: cell.rowIndex + (cell.rowspan ?? 1) - 1,
      };
      if (this._rectOverlap(start, end, cellStart, cellEnd)) {
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
      cell.addEventListener('mousedownCol', this._onMouseDownColHandler);
      cell.addEventListener('mousedownRow', this._onMouseDownRowHandler);
    });

    this.col = Array.from(cells)
      .map(cell => cell.colIndex + cell.colspan - 1)
      .reduce((previous, current) => Math.max(previous, current), 0);

    this.row = Array.from(cells)
      .map(cell => cell.rowIndex + cell.rowspan - 1)
      .reduce((previous, current) => Math.max(previous, current), 0);
  }

  // region lifecycle
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
    if (this.colSizes.length === 0 || this.colSizes.length !== this.col) {
      const parentWidth = this.parentElement?.clientWidth ?? 648;
      const cellWidth = Math.floor(parentWidth / this.col);
      this.colSizes = Array(this.col).fill(cellWidth);
    }
    if (this.rowSizes.length === 0 || this.rowSizes.length !== this.row) {
      this.rowSizes = Array(this.row).fill(32);
    }
  }

  // endregion

  protected render(): unknown {
    return html` <style>
        :host {
          grid-template-columns: ${this.colSizes
            .map(size => `${size}px`)
            .join(' ')};
          grid-template-rows: ${this.rowSizes
            .map(size => `minmax(${size}px, auto)`)
            .join(' ')};
        }
      </style>
      ${map(
        range(this.col),
        index => html` <th
          data-set-index="${index}"
          style="grid-column: ${index + 1}"
        ></th>`
      )}
      ${map(
        range(this.row),
        index => html` <tr
          data-set-index="${index}"
          style="grid-row: ${index + 1}"
        ></tr>`
      )}
      <slot @slotchange="${this._onSlotChange}"></slot>`;
  }
}
