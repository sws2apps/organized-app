import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/ScrollableTabs',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 0,
    tabs: [
      { label: 'Midweek' },
      { label: 'Weekend' },
      { label: 'Reports' },
      { label: 'Persons' },
    ],
  },
};
