import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/CongregationSelector',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    country_guid: '',
    setCongregation: () => {},
    label: 'Your Congregation',
  },
};

export const ReadOnly: Story = {
  args: {
    country_guid: 'us',
    setCongregation: () => {},
    cong_name: 'Springfield East',
    readOnly: true,
  },
};
