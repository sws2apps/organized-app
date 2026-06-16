import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/ThemeSwitch',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  args: {
    checked: false,
    onChange: () => {},
  },
};

export const DarkMode: Story = {
  args: {
    checked: true,
    onChange: () => {},
  },
};
