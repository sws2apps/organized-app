import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import FilterChip from './index';

const meta = {
  title: 'Components/FilterChip',
  component: FilterChip,
  args: { onClick: fn(), label: 'Elders' },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Elders' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Selected: Story = {
  args: { selected: true },
};
