import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import Button from '@components/button';
import Typography from '@components/typography';
import Tabs from './index';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    onChange: fn(),
    tabs: [
      {
        label: 'Midweek',
        Component: <Typography>Midweek schedule</Typography>,
      },
      {
        label: 'Weekend',
        Component: <Typography>Weekend schedule</Typography>,
      },
      { label: 'Reports', Component: <Typography>Reports</Typography> },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 0 },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'Weekend' }));
    await expect(args.onChange).toHaveBeenCalledWith(1);
    await expect(canvas.getByText('Weekend schedule')).toBeVisible();
  },
};

export const WithAction: Story = {
  args: {
    value: 1,
    actionComponent: (
      <Button variant="small" disableAutoStretch>
        Export
      </Button>
    ),
  },
};
