import type { Meta, StoryObj } from '@storybook/react-vite';
import IconLoading from './index';

const meta = {
  title: 'Components/IconLoading',
  component: IconLoading,
  tags: ['autodocs'],
} satisfies Meta<typeof IconLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: { color: 'var(--accent-main)', width: 48, height: 48 },
};
