import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import Checkbox from './index';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { onChange: fn(), label: 'Approved for field service' },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(Boolean(args.checked));

    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(event, value) => {
          setChecked(value);
          args.onChange?.(event, value);
        }}
      />
    );
  },
  play: async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole('checkbox');
    await userEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'All assignments' },
};

export const WithDescription: Story = {
  args: {
    checked: true,
    isBorder: true,
    label: 'Baptized publisher',
    labelDescription: 'Eligible for all weekend meeting parts',
  },
};

export const Disabled: Story = {
  args: { disabled: true, checked: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, checked: true },
};
