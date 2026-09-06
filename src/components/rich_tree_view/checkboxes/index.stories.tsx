import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import RichTreeViewCheckboxes from './index';

const meta = {
  title: 'Components/RichTreeViewCheckboxes',
  component: RichTreeViewCheckboxes,
  args: { onSelectedItemsChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof RichTreeViewCheckboxes>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    id: 'midweek',
    label: 'Midweek meeting',
    children: [
      { id: 'midweek-chairman', label: 'Chairman' },
      { id: 'midweek-prayer', label: 'Opening prayer' },
    ],
  },
  {
    id: 'weekend',
    label: 'Weekend meeting',
    children: [
      { id: 'weekend-chairman', label: 'Chairman' },
      { id: 'weekend-speaker', label: 'Public talk speaker' },
    ],
  },
];

export const Default: Story = {
  args: { items, defaultExpandedItems: ['midweek'] },
};

export const WithSelection: Story = {
  args: {
    ...Default.args,
    defaultSelectedItems: ['midweek-chairman'],
  },
};
