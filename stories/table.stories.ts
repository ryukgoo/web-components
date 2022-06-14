import { html } from 'lit';

export default {
  title: 'TableCell',
  component: 'table-cell',
  argTypes: {
    title: { control: 'text' },
  },
};

const Template = () => html`
  <table-cell></table-cell>
`;

export const TableCell = Template.bind({});
