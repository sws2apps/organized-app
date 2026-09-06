import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import DatePicker from './index';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  args: { onChange: fn(), label: 'Date' },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const value = new Date(2026, 8, 6);

export const Default: Story = {
  args: { value },
};

export const Empty: Story = {
  args: { value: null },
};

export const ButtonView: Story = {
  args: { value, view: 'button' },
};

export const WithError: Story = {
  args: { value: null, error: true, helperText: 'Please select a date' },
};

export const ReadOnly: Story = {
  args: { value, readOnly: true },
};
