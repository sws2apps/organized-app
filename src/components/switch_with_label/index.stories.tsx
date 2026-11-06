import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import SwitchWithLabel from './index';

const meta = {
  title: 'Components/SwitchWithLabel',
  component: SwitchWithLabel,
  args: { onChange: fn(), label: 'Enable autofill' },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SwitchWithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const WithHelper: Story = {
  args: {
    checked: true,
    helper: 'Assignments are suggested automatically for empty parts.',
  },
};

export const ReadOnly: Story = {
  args: { checked: true, readOnly: true },
};
