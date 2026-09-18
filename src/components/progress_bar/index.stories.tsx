import type { Meta, StoryObj } from '@storybook/react-vite';
import ProgressBar from './index';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  args: { maxValue: 100 },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { value: 0 },
};

export const InProgress: Story = {
  args: { value: 60 },
};

export const Complete: Story = {
  args: { value: 100 },
};
