import type { Meta, StoryObj } from '@storybook/react-vite';
import ProgressBarSmall from './index';

const meta = {
  title: 'Components/ProgressBarSmall',
  component: ProgressBarSmall,
  args: { maxValue: 100 },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBarSmall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
  args: { value: 60 },
};

export const Complete: Story = {
  args: { value: 100 },
};
