import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { IconDelete, IconEdit } from '@components/icons';
import IconButton from './index';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { onClick: fn(), 'aria-label': 'Edit' },
  tags: ['autodocs'],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <IconEdit /> },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Edit' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Error: Story = {
  args: {
    'aria-label': 'Delete',
    color: 'error',
    children: <IconDelete color="var(--red-main)" />,
  },
};

export const NoHover: Story = {
  args: { children: <IconEdit />, disableHover: true },
};
