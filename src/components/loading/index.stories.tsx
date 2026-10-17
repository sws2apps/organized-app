import type { Meta, StoryObj } from '@storybook/react-vite';
import Loading from './index';

const meta = {
  title: 'Components/Loading',
  component: Loading,
  tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Circular: Story = {};

export const Lottie: Story = {
  args: { type: 'lottie', text: 'Syncing congregation data' },
};
