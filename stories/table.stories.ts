import { html } from 'lit';
import '../src/table/form-table.js';

export default {
  title: 'FormTable',
  component: 'form-table',
  argTypes: {
    title: { control: 'text' },
  },
};

export const FormTable = () => html`
  <form-table>
    <form-table-cell
      col-index="1"
      row-index="1"
      colspan="2"
      rowspan="2"
      horizontal-align="center"
      vertical-align="center"
      border-top-color="pink"
      border-left-color="red"
      border-right-color="red"
      border-right-style="dashed"
      border-bottom-color="red"
    >
      <p>Cell</p>
    </form-table-cell>
    <form-table-cell
      col-index="3"
      row-index="1"
      colspan="2"
      background-color="aqua"
      border-left-color="red"
      border-left-style="dashed"
      border-right-color="red"
    >
      <p>Cell</p>
    </form-table-cell>
    <form-table-cell col-index="3" row-index="2"></form-table-cell>
    <form-table-cell col-index="4" row-index="2"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="1" row-index="3" border-top-color="red"
      ><p>Cell</p></form-table-cell
    >
    <form-table-cell col-index="2" row-index="3"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="3" row-index="3"><p>Cell</p></form-table-cell>
    <form-table-cell
      col-index="4"
      row-index="3"
      rowspan="2"
      border-right-style="dotted"
    ></form-table-cell>
    <form-table-cell col-index="1" row-index="4" colspan="2" rowspan="2"
      ><p>Cell</p></form-table-cell
    >
    <form-table-cell col-index="3" row-index="4"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="3" row-index="5"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="4" row-index="5"><p>Cell</p></form-table-cell>
  </form-table>
`;
