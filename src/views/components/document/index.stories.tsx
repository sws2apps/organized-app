import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Views/Document',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'S-140 Midweek Meeting Schedule',
    lang: 'en',
    children: <p style={{ padding: '16px' }}>PDF document content preview</p>,
  },
};
