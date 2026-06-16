import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/Badge',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'small',
    text: 'New',
    color: 'green',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    text: 'Active',
    color: 'accent',
  },
};

export const Big: Story = {
  args: {
    size: 'big',
    text: 'Elder',
    color: 'red',
  },
};
