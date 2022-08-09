export interface FormTableInterface {
  merge(): void;

  split(): void;

  insertColLeft(): void;

  insertColRight(): void;

  insertRowAbove(): void;

  insertRowBelow(): void;

  onCreateGridItem(): void;

  onRemoveGridItem(): void;
}
