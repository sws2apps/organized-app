import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/Tooltip',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'This is a tooltip',
    children: <span style={{ padding: '8px', cursor: 'pointer' }}>Hover over me</span>,
  },
};
