import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Views/Congregation/FieldServiceGroups',
  component: Component,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groups: [],
    congregation: 'Springfield East',
    lang: 'en',
  },
};
