import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import UserCard from './index';

const meta = {
  title: 'Components/UserCard',
  component: UserCard,
  args: { onClick: fn(), onDelete: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Person: Story = {
  args: { name: 'James Carter', type: 'person', female: false },
};

export const Publisher: Story = {
  args: {
    name: 'Sarah Miller',
    type: 'publisher',
    female: true,
    chipLabels: ['Group 2', 'Regular pioneer'],
    showArrow: true,
  },
};

export const Pioneer: Story = {
  args: { name: 'Ana Costa', type: 'pioneer', female: true },
};
