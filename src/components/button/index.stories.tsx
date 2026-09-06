import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { IconAdd, IconDelete } from '@components/icons';
import Button from './index';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { onClick: fn(), children: 'Save' },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: { variant: 'main' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Tertiary: Story = {
  args: { variant: 'tertiary' },
};

export const Small: Story = {
  args: { variant: 'small', children: 'Edit' },
};

export const SemiWhite: Story = {
  args: { variant: 'semi-white' },
};

export const Group: Story = {
  args: { variant: 'group' },
};

export const WithIcons: Story = {
  args: {
    variant: 'main',
    children: 'Add person',
    startIcon: <IconAdd />,
  },
};

export const Destructive: Story = {
  args: {
    variant: 'secondary',
    children: 'Delete',
    color: 'red',
    startIcon: <IconDelete />,
  },
};

export const Disabled: Story = {
  args: { variant: 'main', disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled();
  },
};

export const AsLink: Story = {
  args: {
    variant: 'tertiary',
    children: 'Open documentation',
    href: 'https://organized-app.com',
    target: '_blank',
    rel: 'noreferrer',
  },
};
