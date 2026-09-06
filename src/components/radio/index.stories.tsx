import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Radio from './index';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  args: { onChange: fn(), inputProps: { 'aria-label': 'Option' } },
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: { checked: false },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true },
};
