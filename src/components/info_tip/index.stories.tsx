import type { Meta, StoryObj } from '@storybook/react-vite';
import InfoTip from './index';

const meta = {
  title: 'Components/InfoTip',
  component: InfoTip,
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof InfoTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    isBig: false,
    color: 'blue',
    text: 'This person has no upcoming assignments.',
  },
};

export const Big: Story = {
  args: {
    isBig: true,
    color: 'white',
    title: 'Before you publish',
    text: 'Schedules must be published before publishers can see their assignments.',
  },
};
