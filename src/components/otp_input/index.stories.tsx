import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import OTPInput from './index';

const meta = {
  title: 'Components/OtpInput',
  component: OTPInput,
  args: { onChange: fn(), value: '' },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);

    return (
      <OTPInput
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange?.(next);
        }}
      />
    );
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { value: '482913' },
};

export const WithError: Story = {
  args: { value: '482913', hasError: true },
};
