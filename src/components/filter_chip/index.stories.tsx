import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/FilterChip',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Elders',
  },
};

export const Selected: Story = {
  args: {
    label: 'Publishers',
    selected: true,
  },
};
