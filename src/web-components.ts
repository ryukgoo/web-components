import { WebComponents } from './WebComponents.js';
import { FormTable } from './table/form-table.js';
import { FormTableCell } from './table/form-table-cell.js';
import { CustomSpinner } from './spinner/custom-spinner.js';

window.customElements.define('web-components', WebComponents);
window.customElements.define('form-table', FormTable);
window.customElements.define('form-table-cell', FormTableCell);
window.customElements.define('custom-spinner', CustomSpinner);
