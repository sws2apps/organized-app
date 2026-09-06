import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import MiniChip from './index';

const meta = {
  title: 'Components/MiniChip',
  component: MiniChip,
  args: { label: 'Elder', onDelete: fn() },
  tags: ['autodocs'],
} satisfies Meta<typeof MiniChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Editable: Story = {
  args: { edit: true },
  play: async ({ canvasElement, userEvent, args }) => {
    await userEvent.click(
      canvasElement.querySelector('.MuiChip-deleteIcon') as HTMLElement
    );
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};

export const Disabled: Story = {
  args: { edit: true, disabled: true },
};
