import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import ThemeSwitch from './index';

const meta = {
  title: 'Components/ThemeSwitch',
  component: ThemeSwitch,
  args: { onChange: fn() },
  render: function Render(args) {
    const [checked, setChecked] = useState(Boolean(args.checked));

    return (
      <ThemeSwitch
        {...args}
        checked={Boolean(checked)}
        onChange={(value) => {
          setChecked(value);
          args.onChange(value);
        }}
      />
    );
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { checked: false },
};

export const Dark: Story = {
  args: { checked: true },
};
