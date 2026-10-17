import type { Meta, StoryObj } from '@storybook/react-vite';
import TabLabelWithBadge from './index';

const meta = {
  title: 'Components/TabLabelWithBadge',
  component: TabLabelWithBadge,
  args: { label: 'Persons' },
  tags: ['autodocs'],
} satisfies Meta<typeof TabLabelWithBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCount: Story = {
  args: { count: 12 },
};

export const NoCount: Story = {
  args: { count: 0 },
};

export const Colored: Story = {
  args: {
    count: 3,
    label: 'Pending',
    color: 'var(--accent-main)',
    badgeColor: 'var(--accent-dark)',
  },
};
