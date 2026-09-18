import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import TimePicker from './index';

const meta = {
  title: 'Components/TimePicker',
  component: TimePicker,
  args: {
    onChange: fn(),
    label: 'Meeting time',
    value: new Date(2026, 8, 6, 19, 0),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwentyFourHour: Story = {
  args: { ampm: false },
};

export const TwelveHour: Story = {
  args: { ampm: true },
};

export const ReadOnly: Story = {
  args: { ampm: false, readOnly: true },
};
