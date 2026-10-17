import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconPerson, IconSearch } from '@components/icons';
import Autocomplete from './index';

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  args: { onChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

const persons = ['Ana Costa', 'James Carter', 'Sarah Miller', 'Tom Hill'];

export const Default: Story = {
  args: {
    label: 'Person',
    options: persons,
  },
};

export const WithIcons: Story = {
  args: {
    ...Default.args,
    startIcon: <IconPerson />,
    endIcon: <IconSearch />,
  },
};

export const WithValue: Story = {
  args: {
    ...Default.args,
    value: persons[1],
  },
};

export const ReadOnly: Story = {
  args: {
    ...WithValue.args,
    readOnly: true,
  },
};
