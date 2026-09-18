import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import TimeField from './index';

const meta = {
  title: 'Components/TimeField',
  component: TimeField,
  args: { onChange: fn(), value: '' },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);

    return (
      <TimeField
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange?.(next);
        }}
      />
    );
  },
  decorators: [
    (Story) => (
      <div style={{ width: 160 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof TimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithValue: Story = {
  args: { value: '1:30' },
};

export const LongHours: Story = {
  args: { value: '120:45', hoursLength: 3 },
};
