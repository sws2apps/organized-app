import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/InfoMessage',
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
    variant: 'error',
    messageHeader: 'Something went wrong',
    message: 'Please check your connection and try again.',
    onClose: () => {},
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    messageHeader: 'Saved successfully',
    message: 'Your changes have been saved.',
    onClose: () => {},
  },
};
