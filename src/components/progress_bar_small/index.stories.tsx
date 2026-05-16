import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/ProgressBarSmall',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
  args: {
    value: 60,
    maxValue: 100,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    maxValue: 100,
  },
};
