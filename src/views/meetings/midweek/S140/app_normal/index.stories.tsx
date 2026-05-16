import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Views/Meetings/Midweek/S140/AppNormal',
  component: Component,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [],
    class_count: 1,
    cong_name: 'Springfield East',
    lang: 'en',
  },
};
