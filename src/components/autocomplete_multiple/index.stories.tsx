import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import AutocompleteMultiple from './index';

const meta = {
  title: 'Components/AutocompleteMultiple',
  component: AutocompleteMultiple,
  args: { onChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof AutocompleteMultiple>;

export default meta;
type Story = StoryObj<typeof meta>;

const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];

export const Default: Story = {
  args: {
    label: 'Field service groups',
    placeholder: 'Select groups',
    options: groups,
    value: [],
  },
};

export const WithSelection: Story = {
  args: {
    ...Default.args,
    value: groups.slice(0, 2),
  },
};
