import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import SearchBar from './index';

const meta = {
  title: 'Components/SearchBar',
  component: SearchBar,
  args: { onSearch: fn(), placeholder: 'Search persons' },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByPlaceholderText('Search persons'), 'Ana');
    await expect(args.onSearch).toHaveBeenLastCalledWith('Ana');
  },
};

export const WithValue: Story = {
  args: { value: 'Miller' },
};
