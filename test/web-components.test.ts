import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
// eslint-disable-next-line import/extensions
import { WebComponents } from '../src';
import '../src/web-components.js';

describe('WebComponents', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<WebComponents>(
      html`<web-components></web-components>`
    );

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<WebComponents>(
      html`<web-components></web-components>`
    );
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<WebComponents>(
      html`<web-components title="attribute title"></web-components>`
    );

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<WebComponents>(
      html`<web-components></web-components>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
