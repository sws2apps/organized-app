import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/ProgressBar',
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
    value: 60,
    maxValue: 100,
  },
};

export const Full: Story = {
  args: {
    value: 100,
    maxValue: 100,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    maxValue: 100,
  },
};
