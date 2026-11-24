import type { Meta, StoryObj } from '@storybook/react-vite';
import WaitingLoader from './index';

const meta = {
  title: 'Components/WaitingLoader',
  component: WaitingLoader,
  decorators: [
    (Story) => (
      <div style={{ width: 200, height: 200, position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof WaitingLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Circular: Story = {
  args: { variant: 'standard' },
};

export const Lottie: Story = {
  args: { variant: 'standard', type: 'lottie', size: 96 },
};
