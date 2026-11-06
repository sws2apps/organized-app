import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import MinusButton from './index';

const meta = {
  title: 'Components/MinusButton',
  component: MinusButton,
  args: { onClick: fn() },
  tags: ['autodocs'],
} satisfies Meta<typeof MinusButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button'));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
