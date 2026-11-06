import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import Typography from '@components/typography';
import Accordion from './index';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: { onChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'midweek-meeting',
    label: 'Midweek meeting',
    children: (
      <Typography className="body-small-regular" color="var(--grey-400)">
        Treasures from God’s Word, Apply Yourself to the Field Ministry and
        Living as Christians.
      </Typography>
    ),
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /midweek/i }));
    await expect(args.onChange).toHaveBeenCalledWith('midweek-meeting');
  },
};

export const Expanded: Story = {
  args: {
    ...Default.args,
    id: 'weekend-meeting',
    label: 'Weekend meeting',
    defaultExpanded: true,
  },
};
