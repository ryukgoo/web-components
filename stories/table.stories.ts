import { html } from 'lit';

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
    <form-table-cell col-index="1" row-index="4"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="2" row-index="4"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="3" row-index="4"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="1" row-index="5"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="2" row-index="5"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="3" row-index="5"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="4" row-index="5"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="1" row-index="5"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="2" row-index="5"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="3" row-index="5"><p>Cell</p></form-table-cell>
    <form-table-cell col-index="4" row-index="5"><p>Cell</p></form-table-cell>
  </form-table>
`;

export const Sample = () => html`
  <style>
    /* this is to reproduce table-like structure
     for the sake of table-less layout. */
    .table {
      display: table;
      table-layout: fixed;
      width: 300px;
      border-collapse: collapse;
    }

    .row {
      display: table-row;
      height: 10px;
    }

    .cell {
      display: table-cell;
      border: 1px solid red;
    }

    /* this is where the colspan tricks works. */
    span {
      width: 100%;
    }
  </style>
  <div class="table">
    <div class="row">
      <span class="cell red"></span>
      <span class="cell blue"></span>
      <span class="cell green"></span>
    </div>
    <div class="row">
      <span class="cell black"></span>
      <span class="cell black"></span>
      <span class="cell black"></span>
    </div>
  </div>
`;
