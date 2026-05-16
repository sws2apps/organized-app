import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/TimePicker',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwentyFourHour: Story = {
  args: {
    ampm: false,
  },
};

export const TwelveHour: Story = {
  args: {
    ampm: true,
  },
};
