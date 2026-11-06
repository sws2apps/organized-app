import type { Meta, StoryObj } from '@storybook/react-vite';
import Divider from './index';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dashed: Story = {
  args: { dashed: true },
};

export const Colored: Story = {
  args: { color: 'var(--red-main)', height: 2 },
};
