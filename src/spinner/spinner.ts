import { LitElement } from 'lit';
import { SpinnerInterface, SpinnerItem } from './spinner-interface.js';

export class Spinner extends LitElement implements SpinnerInterface {
  private _index: number = 0;

  get index(): number {
    return this._index;
  }

  set index(value: number) {
    this._index = value;
  }

  private _value: SpinnerItem | undefined;

  get value(): SpinnerItem | undefined {
    return this._value;
  }

  set value(value: SpinnerItem | undefined) {
    this._value = value;
  }

  datas: SpinnerItem[] = [];

  protected render(): unknown {
    return super.render();
  }
}
