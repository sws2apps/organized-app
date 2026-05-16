import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/UserAccountItem',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const User: Story = {
  args: {
    name: 'John Doe',
    variant: 'user',
  },
};

export const Admin: Story = {
  args: {
    name: 'Sarah Miller',
    variant: 'admin',
    secondary: 'Congregation Administrator',
  },
};

export const Baptized: Story = {
  args: {
    name: 'James Carter',
    variant: 'baptized',
  },
};
