import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import Switch from './index';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { onChange: fn(), inputProps: { 'aria-label': 'Toggle' } },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(Boolean(args.checked));

    return (
      <Switch
        {...args}
        checked={Boolean(checked)}
        onChange={(event, value) => {
          setChecked(value);
          args.onChange?.(event, value);
        }}
      />
    );
  },
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole('switch');
    await userEvent.click(toggle);
    await waitFor(() => expect(toggle).toBeChecked());
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true },
};

export const ReadOnly: Story = {
  args: { checked: true, readOnly: true },
};
