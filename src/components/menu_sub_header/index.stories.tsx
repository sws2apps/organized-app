import { MenuList } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';
import MenuSubHeader from './index';

const meta = {
  title: 'Components/MenuSubHeader',
  component: MenuSubHeader,
  args: { children: 'Congregation' },
  decorators: [
    (Story) => (
      <MenuList sx={{ width: 240, backgroundColor: 'var(--white)' }}>
        <Story />
        <MenuItem>
          <Typography>Settings</Typography>
        </MenuItem>
        <MenuItem>
          <Typography>Manage access</Typography>
        </MenuItem>
      </MenuList>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof MenuSubHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
