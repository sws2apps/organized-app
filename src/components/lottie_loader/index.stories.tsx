import type { Meta, StoryObj } from '@storybook/react-vite';
import LottieLoader from './index';

const meta = {
  title: 'Components/LottieLoader',
  component: LottieLoader,
  tags: ['autodocs'],
} satisfies Meta<typeof LottieLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: 120 },
};
