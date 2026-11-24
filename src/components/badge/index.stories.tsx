import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconCheckCircle } from '@components/icons';
import { BadgeColor } from '@definition/app';
import Badge from './index';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const colors: BadgeColor[] = [
  'accent',
  'green',
  'orange',
  'red',
  'grey',
  'transparent',
];

export const Default: Story = {
  args: {
    text: 'Elder',
    size: 'medium',
    color: 'accent',
  },
};

export const Filled: Story = {
  args: {
    ...Default.args,
    filled: true,
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
    text: 'Approved',
    color: 'green',
    icon: <IconCheckCircle />,
  },
};

export const Sizes: Story = {
  args: Default.args,
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge {...args} size="small" />
      <Badge {...args} size="medium" />
      <Badge {...args} size="big" />
    </div>
  ),
};

export const Colors: Story = {
  args: Default.args,
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      {colors.map((color) => (
        <div key={color} style={{ display: 'flex', gap: 8 }}>
          <Badge {...args} color={color} text={color} />
          <Badge {...args} color={color} text={color} filled />
        </div>
      ))}
    </div>
  ),
};
