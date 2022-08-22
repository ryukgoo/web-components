import { expect, fixture, html } from '@open-wc/testing';
// eslint-disable-next-line import/extensions
import { FormTableCell } from '../src';
import '../src/web-components.js';

describe('FormTableCell', () => {
  it('is initialized', async () => {
    const cell = await fixture<FormTableCell>(html` <form-table-cell
      col-index="1"
      row-index="1"
      colspan="2"
      rowspan="2"
    ></form-table-cell>`);
    expect(cell).instanceof(FormTableCell);
    expect(cell.colIndex).to.equal(1);
    expect(cell.rowIndex).to.equal(1);
    expect(cell.colspan).to.equal(2);
    expect(cell.rowspan).to.equal(2);
  });
});
