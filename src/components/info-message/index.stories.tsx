import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { IconRefresh } from '@components/icons';
import InfoMessage from './index';

const meta = {
  title: 'Components/InfoMessage',
  component: InfoMessage,
  args: { onClose: fn(), actionClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof InfoMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorState: Story = {
  args: {
    variant: 'error',
    messageHeader: 'Sync failed',
    message: 'Unable to reach the server. Check your connection and retry.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    messageHeader: 'Schedule published',
    message: 'The midweek meeting schedule is now visible to publishers.',
  },
};

export const WithAction: Story = {
  args: {
    variant: 'message-with-button',
    messageHeader: 'Update available',
    message: 'A new version of Organized is ready to install.',
    actionText: 'Reload',
    actionIcon: <IconRefresh />,
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /reload/i }));
    await expect(args.actionClick).toHaveBeenCalledTimes(1);
  },
};
