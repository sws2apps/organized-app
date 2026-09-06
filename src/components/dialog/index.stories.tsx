import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import Button from '@components/button';
import Typography from '@components/typography';
import Dialog from './index';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: { onClose: fn() },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Typography className="h2">Delete person?</Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          This will remove the person and all related assignments. This action
          cannot be undone.
        </Typography>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" disableAutoStretch>
            Cancel
          </Button>
          <Button variant="main" color="var(--red-main)" disableAutoStretch>
            Delete
          </Button>
        </div>
      </div>
    ),
  },
  play: async ({ userEvent, args }) => {
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
