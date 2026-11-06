import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import ButtonGroup from './index';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    buttons: [
      { children: 'Week', className: 'active', onClick: fn() },
      { children: 'Month', onClick: fn() },
      { children: 'Year', onClick: fn() },
    ],
  },
};
