import { html } from 'lit';

export default {
  title: 'CustomSpinner',
  component: 'custom-spinner',
  argTypes: {
    title: { control: 'text' },
  },
};

export const CustomSpinner = () => html`
  <custom-spinner
    datas="white red green blue yellow black orange white"
  ></custom-spinner>
`;
