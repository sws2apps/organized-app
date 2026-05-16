import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import Component from './index';

const meta = {
  title: 'Components/Button',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Submit',
    variant: 'main'
  },
};

export const CssCheck: Story = {
  args: { children: 'Submit', variant: 'main' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i });
    // This will fail if the global CSS defining --always-white isn't loaded
    await expect(getComputedStyle(button).color).toBe('rgb(254, 254, 254)');
  },
};
