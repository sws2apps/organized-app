import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Component from './index';

const queryClient = new QueryClient();

const meta = {
  title: 'Components/CountrySelector',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div style={{ width: 320 }}>
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    handleCountryChange: () => {},
  },
};

export const ReadOnly: Story = {
  args: {
    handleCountryChange: () => {},
    value: { countryCode: 'US', countryName: 'United States' },
    readOnly: true,
  },
};
