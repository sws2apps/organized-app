import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Typography from '@components/typography';
import ScrollableTabs from './index';

const meta = {
  title: 'Components/ScrollableTabs',
  component: ScrollableTabs,
  args: { onChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollableTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const Default: Story = {
  args: {
    value: 8,
    tabs: months.map((month) => ({
      label: month,
      Component: <Typography>{month} schedule</Typography>,
    })),
  },
};

export const IndicatorMode: Story = {
  args: { ...Default.args, indicatorMode: true },
};
