import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/TabLabelWithBadge',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBadge: Story = {
  args: {
    label: 'Persons',
    count: 12,
  },
};

export const NoBadge: Story = {
  args: {
    label: 'Reports',
    count: 0,
  },
};
