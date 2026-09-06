import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconRefresh } from '@components/icons';
import Snackbar from './index';

const meta = {
  title: 'Components/Snackbar',
  component: Snackbar,
  args: { open: true, onClose: fn(), actionClick: fn() },
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorState: Story = {
  args: {
    variant: 'error',
    messageHeader: 'Sync failed',
    message: 'Unable to connect to the server. Please check your connection.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    messageHeader: 'Changes saved',
    message: 'Your schedule has been updated successfully.',
  },
};

export const WithAction: Story = {
  args: {
    variant: 'message-with-button',
    position: 'top-center',
    messageHeader: 'Update available',
    message: 'Reload to get the latest version of Organized.',
    actionText: 'Reload',
    actionIcon: <IconRefresh />,
  },
};
