import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/TextMarkup',
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
    content: 'This is a <strong>bold</strong> text with an <a href="#">anchor link</a>.',
    className: 'body-regular',
  },
};

export const SmallText: Story = {
  args: {
    content: 'A <em>smaller</em> formatted paragraph.',
    className: 'body-small-regular',
  },
};
