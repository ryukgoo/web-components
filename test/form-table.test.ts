import { expect, fixture, html } from '@open-wc/testing';
// eslint-disable-next-line import/extensions
import { FormTable, FormTableCell } from '../src';
import '../src/web-components.js';

describe('FormTable', () => {
  it('is initialized', async () => {
    const table = await fixture<FormTable>(html`<form-table></form-table>`);

    expect(table).instanceof(FormTable);
    expect(table.col).to.equal(FormTable.DEFAULT_COL);
    expect(table.row).to.equal(FormTable.DEFAULT_ROW);
  });

  it('is 1X1 table', async () => {
    const table = await fixture<FormTable>(html`<form-table>
      <form-table-cell col-index="1" row-index="1"></form-table-cell>
    </form-table>`);

    expect(table.col).to.equal(1);
    expect(table.row).to.equal(1);
  });

  it('is 2X2 table', async () => {
    const table = await fixture<FormTable>(html`<form-table>
      <form-table-cell
        col-index="1"
        row-index="1"
        colspan="2"
      ></form-table-cell>
      <form-table-cell col-index="1" row-index="2"></form-table-cell>
      <form-table-cell col-index="2" row-index="2"></form-table-cell>
    </form-table>`);

    expect(table.col).to.equal(2);
    expect(table.row).to.equal(2);
    table.colSizes.forEach(size => expect(size).to.equal(392));
    table.rowSizes.forEach(size => expect(size).to.equal(32));
  });

  it('is 2X2 table with sizes', async () => {
    const table = await fixture<FormTable>(html`<form-table col-sizes="200 400">
      <form-table-cell
        col-index="1"
        row-index="1"
        colspan="2"
      ></form-table-cell>
      <form-table-cell col-index="1" row-index="2"></form-table-cell>
      <form-table-cell col-index="2" row-index="2"></form-table-cell>
    </form-table>`);

    expect(table.col).to.equal(2);
    expect(table.row).to.equal(2);
    const cell = table.querySelector(
      `form-table-cell[col-index='1'][row-index='1']`
    ) as FormTableCell;
    expect(cell.clientWidth).to.equal(598); // ??
    table.rowSizes.forEach(size => expect(size).to.equal(32));
  });

  it('is 3X3 table, style test', async () => {
    const table = await fixture<FormTable>(html`<form-table col-sizes="200 400">
      <form-table-cell col-index="1" row-index="1"></form-table-cell>
      <form-table-cell col-index="2" row-index="1"></form-table-cell>
      <form-table-cell col-index="3" row-index="1"></form-table-cell>
      <form-table-cell col-index="1" row-index="2"></form-table-cell>
      <form-table-cell
        col-index="2"
        row-index="2"
        background-color="blue"
        border-left-color="red"
      ></form-table-cell>
      <form-table-cell col-index="3" row-index="2"></form-table-cell>
      <form-table-cell col-index="1" row-index="3"></form-table-cell>
      <form-table-cell col-index="2" row-index="3"></form-table-cell>
      <form-table-cell col-index="3" row-index="3"></form-table-cell>
    </form-table>`);

    await expect(table).shadowDom.to.be.accessible();

    const cell = table.querySelector(
      `form-table-cell[col-index='2'][row-index='2']`
    ) as FormTableCell;
    expect(cell.style.borderLeftColor).to.equal('red');
    expect(cell.style.backgroundColor).to.equal('blue');
  });
});
