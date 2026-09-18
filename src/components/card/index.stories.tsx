import type { Meta, StoryObj } from '@storybook/react-vite';
import Typography from '@components/typography';
import Button from '@components/button';
import Card from './index';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sx: { width: 360 },
    children: (
      <>
        <Typography className="h2">Congregation settings</Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          Cards group related content and actions with a consistent border,
          radius and padding.
        </Typography>
        <Button variant="secondary" disableAutoStretch>
          Manage
        </Button>
      </>
    ),
  },
};
