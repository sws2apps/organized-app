import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Button from '@components/button';
import Typography from '@components/typography';
import Drawer from './index';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  args: { onClose: fn() },
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    anchor: 'right',
    title: 'Person details',
    children: (
      <Typography className="body-regular" color="var(--grey-400)">
        Drawers slide in from the side and host secondary flows such as filters
        or detail views.
      </Typography>
    ),
  },
};

export const WithHeadActions: Story = {
  args: {
    ...Default.args,
    headActions: (
      <Button variant="small" disableAutoStretch>
        Reset
      </Button>
    ),
  },
};
