export interface SpinnerItem {
  title: string;
  value: unknown;
}

export interface SpinnerInterface {
  index: number;
  value: SpinnerItem | undefined;
  datas: SpinnerItem[];
}
