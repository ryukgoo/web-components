export interface CellInfo {
  colIndex: number;
  rowIndex: number;
  colspan: number;
  rowspan: number;
  origin: CellInfo | undefined;
}
