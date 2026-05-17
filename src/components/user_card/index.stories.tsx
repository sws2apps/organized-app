import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/UserCard',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Male: Story = {
  args: {
    name: 'James Carter',
    type: 'publisher',
    female: false,
  },
};

export const Female: Story = {
  args: {
    name: 'Sarah Miller',
    type: 'pioneer',
    female: true,
  },
};
