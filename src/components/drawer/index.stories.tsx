import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/Drawer',
  component: Component,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Person Details',
    open: true,
    onClose: () => {},
    children: <p style={{ padding: 16 }}>Drawer content goes here.</p>,
  },
};
