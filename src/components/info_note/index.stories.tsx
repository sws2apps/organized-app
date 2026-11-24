import type { Meta, StoryObj } from '@storybook/react-vite';
import InfoNote from './index';

const meta = {
  title: 'Components/InfoNote',
  component: InfoNote,
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof InfoNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: {
    message:
      'Assignments are only visible to publishers after the schedule is published.',
  },
};

export const Card: Story = {
  args: {
    ...Inline.args,
    variant: 'card',
  },
};
