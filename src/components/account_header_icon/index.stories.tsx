import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import AccountHeaderIcon from './index';

const meta = {
  title: 'Components/AccountHeaderIcon',
  component: AccountHeaderIcon,
  args: { handleOpenMore: fn() },
  tags: ['autodocs'],
} satisfies Meta<typeof AccountHeaderIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MenuOpen: Story = {
  args: { isMoreOpen: true },
};
