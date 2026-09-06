import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '@components/button';
import IconButton from '@components/icon_button';
import { IconInfo } from '@components/icons';
import Tooltip from './index';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: { title: 'Published schedules are visible to all publishers' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Button variant="secondary" disableAutoStretch>
        Hover me
      </Button>
    ),
  },
};

export const IconVariant: Story = {
  args: {
    variant: 'icon',
    children: (
      <IconButton aria-label="More information">
        <IconInfo />
      </IconButton>
    ),
  },
};

export const FollowCursor: Story = {
  args: { ...Default.args, followCursor: true, placement: 'bottom' },
};
