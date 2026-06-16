import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/InfoTip',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isBig: false,
    text: 'This person has no upcoming assignments.',
  },
};

export const Big: Story = {
  args: {
    isBig: true,
    title: 'Important notice',
    text: 'Schedules must be published before they can be viewed by congregation members.',
  },
};
