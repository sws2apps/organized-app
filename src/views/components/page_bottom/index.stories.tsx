import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Views/PageBottom',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    qrCode: <div style={{ width: 60, height: 60, background: '#ccc' }} />,
    created: new Date('2025-05-16'),
    shortDateFormat: 'MM/dd/yyyy',
  },
};
