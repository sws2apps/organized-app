import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import UserAccountItem from './index';

const meta = {
  title: 'Components/UserAccountItem',
  component: UserAccountItem,
  args: { clickOnArrow: fn(), clickOnUserAccountItem: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof UserAccountItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const User: Story = {
  args: { name: 'James Carter', variant: 'user', secondary: 'Publisher' },
};

export const Admin: Story = {
  args: { name: 'Sarah Miller', variant: 'admin', secondary: 'Administrator' },
};

export const Baptized: Story = {
  args: { name: 'Ana Costa', variant: 'baptized' },
};
