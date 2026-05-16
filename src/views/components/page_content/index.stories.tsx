import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Views/PageContent',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p style={{ padding: '16px' }}>Content section</p>,
  },
};
