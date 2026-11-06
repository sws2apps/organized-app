import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomClassName } from '@definition/app';
import Typography from './index';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

const classNames: CustomClassName[] = [
  'huge-numbers',
  'big-numbers',
  'h1',
  'h2',
  'h2-caps',
  'h3',
  'h4',
  'body-regular',
  'body-small-semibold',
  'body-small-regular',
  'label-small-medium',
  'label-small-regular',
  'button-caps',
];

export const Default: Story = {
  args: { children: 'Organized', className: 'h1' },
};

export const Colored: Story = {
  args: {
    children: 'Secondary text',
    className: 'body-small-regular',
    color: 'var(--grey-400)',
  },
};

export const AllStyles: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {classNames.map((className) => (
        <Typography key={className} className={className}>
          {className}
        </Typography>
      ))}
    </div>
  ),
};
