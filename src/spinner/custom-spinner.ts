import { css, html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';
import { SpinnerInterface, SpinnerItem } from './spinner-interface.js';

export class CustomSpinner extends LitElement implements SpinnerInterface {
  static styles = css`
    .container {
      display: block;
      width: 200px;
      height: 300px;
      overflow-y: scroll;
      scroll-behavior: smooth;
    }

    // hide scroll bar
    .container {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }

    .container::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }

    .content {
      background: aquamarine;
      width: auto;
    }

    .item {
      display: flex;
      height: 100px;
      font-size: 5em;
    }
  `;

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

  @property({
    type: String,
    converter: {
      fromAttribute(values: string | null): SpinnerItem[] {
        return (
          values?.split(' ').map(value => ({ title: value } as SpinnerItem)) ??
          []
        );
      },
      toAttribute(values: SpinnerItem[]): string {
        return values.map(value => value.title).join(' ');
      },
    },
  })
  datas: SpinnerItem[] = [];

  @query('#container')
  container: HTMLDivElement | undefined;

  private _onScroll = (event: Event) => {
    // eslint-disable-next-line no-console
    console.log('onScroll', 'event', event);
  };

  private _onClick(event: Event) {
    const target = event.target as HTMLElement;
    const y = target.offsetTop - this.offsetTop;
    this.container?.scrollTo(0, y);
  }

  protected render(): unknown {
    return html`
      <div id="container" class="container" @scroll="${this._onScroll}">
        <div id="content" class="content">
          ${this.datas.map(
            data =>
              html` <div
                class="item"
                id="${data.title}"
                onClick="${this._onClick}"
                style="background-color: ${data.title}"
              ></div>`
          )}
        </div>
      </div>
    `;
  }
}
