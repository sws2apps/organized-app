import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';
import { SelectPropsType } from './index.types';
import Select from './index';

const meta = {
  title: 'Components/Select',
  component: Select,
  args: {
    onChange: fn(),
    label: 'Meeting',
    children: [
      <MenuItem key="midweek" value="midweek">
        <Typography>Midweek meeting</Typography>
      </MenuItem>,
      <MenuItem key="weekend" value="weekend">
        <Typography>Weekend meeting</Typography>
      </MenuItem>,
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<SelectPropsType>;

export default meta;
type Story = StoryObj<SelectPropsType>;

export const Default: Story = {
  args: { value: '' },
};

export const WithValue: Story = {
  args: { value: 'weekend' },
};

export const WithHelperText: Story = {
  args: { value: '', helperText: 'Choose the meeting to schedule' },
};

export const Error: Story = {
  args: { value: '', error: true, helperText: 'Meeting is required' },
};

export const Disabled: Story = {
  args: { value: 'midweek', disabled: true },
};
