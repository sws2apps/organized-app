import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import DaySelector from './index';

const meta = {
  title: 'Components/DaySelector',
  component: DaySelector,
  args: { onChange: fn(), label: 'Meeting day' },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DaySelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: '' },
};

export const WithValue: Story = {
  args: { value: 2 },
};

export const ReadOnly: Story = {
  args: { value: 6, readOnly: true },
};
