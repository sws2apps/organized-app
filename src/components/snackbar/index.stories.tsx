import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/Snackbar',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    open: true,
    variant: 'error',
    messageHeader: 'Sync failed',
    message: 'Unable to connect to the server. Please check your connection.',
  },
};

export const Success: Story = {
  args: {
    open: true,
    variant: 'success',
    messageHeader: 'Changes saved',
    message: 'Your schedule has been updated successfully.',
  },
};
