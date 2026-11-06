import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen } from 'storybook/test';
import CongregationSelector from './index';

const meta = {
  title: 'Components/CongregationSelector',
  component: CongregationSelector,
  args: { setCongregation: fn(), country_guid: 'us' },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof CongregationSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Typing at least two characters triggers the (mocked) congregation search. */
export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'Spring');
    await userEvent.click(
      await screen.findByRole('option', { name: /Springfield East/ })
    );
    await expect(args.setCongregation).toHaveBeenCalledWith(
      expect.objectContaining({ congName: 'Springfield East' })
    );
  },
};

export const FreeSolo: Story = {
  args: {
    freeSolo: true,
    freeSoloChange: fn(),
    freeSoloValue: 'Springfield',
  },
};

export const ReadOnly: Story = {
  args: {
    cong_name: 'Springfield East',
    readOnly: true,
  },
};
