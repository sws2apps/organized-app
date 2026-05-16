import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Views/PageHeader',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    variant: 'main',
    title: 'Midweek Meeting — May 2025',
    congregationName: 'Springfield East',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    title: 'Continued from previous page',
  },
};
