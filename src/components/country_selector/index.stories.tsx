import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen } from 'storybook/test';
import CountrySelector from './index';

const meta = {
  title: 'Components/CountrySelector',
  component: CountrySelector,
  args: { handleCountryChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof CountrySelector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Countries come from the mocked `/api/v3/congregations/countries` endpoint. */
export const Default: Story = {
  args: { autoLoad: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox'));
    await expect(
      await screen.findByRole('option', { name: 'United States' })
    ).toBeVisible();
  },
};

export const WithValue: Story = {
  args: {
    autoLoad: true,
    value: {
      countryCode: 'US',
      countryName: 'United States',
      countryGuid: 'us',
    },
  },
};

export const ReadOnly: Story = {
  args: {
    ...WithValue.args,
    readOnly: true,
  },
};
