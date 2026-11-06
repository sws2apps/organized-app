import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import TimePickerSlider from './index';

const meta = {
  title: 'Components/TimePickerSlider',
  component: TimePickerSlider,
  args: { onChange: fn(), value: 36000 },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);

    return (
      <TimePickerSlider
        {...args}
        value={value}
        onChange={(seconds) => {
          setValue(seconds);
          args.onChange(seconds);
        }}
      />
    );
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TimePickerSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Midnight: Story = {
  args: { value: 0 },
};
