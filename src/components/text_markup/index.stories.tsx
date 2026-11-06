import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import TextMarkup from './index';

const meta = {
  title: 'Components/TextMarkup',
  component: TextMarkup,
  args: { anchorClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof TextMarkup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content:
      'Schedules are <b>published</b> to all publishers. Read the <a href="#">guide</a> to learn more.',
    className: 'body-regular',
  },
};

export const Small: Story = {
  args: {
    content: 'A <i>smaller</i> note rendered with <b>markup</b>.',
    className: 'body-small-regular',
    color: 'var(--grey-400)',
  },
};
