import { WebComponents } from './WebComponents.js';
import { FormTable } from './table/FormTable.js';
import { FormTableRow } from './table/FormTableRow.js';
import { FormTableCell } from './table/FormTableCell.js';

window.customElements.define('web-components', WebComponents);
window.customElements.define('form-table', FormTable);
window.customElements.define('form-table-row', FormTableRow);
window.customElements.define('form-table-cell', FormTableCell);
