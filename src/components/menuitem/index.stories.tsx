import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconEdit } from '@components/icons';
import Typography from '@components/typography';
import MenuItem from './index';

const meta = {
  title: 'Components/MenuItem',
  component: MenuItem,
  args: {
    onClick: fn(),
    children: (
      <>
        <IconEdit />
        <Typography sx={{ marginLeft: '8px' }}>Edit</Typography>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
