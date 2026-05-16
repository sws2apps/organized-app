import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Views/Activities/UpcomingEvents',
  component: Component,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: [],
    lang: 'en',
    congregation: 'Springfield East',
  },
};
