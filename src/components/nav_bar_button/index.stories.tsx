import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { IconAdd, IconPrint } from '@components/icons';
import NavBarButton from './index';

const meta = {
  title: 'Components/NavBarButton',
  component: NavBarButton,
  args: { onClick: fn(), text: 'Add person', icon: <IconAdd /> },
  tags: ['autodocs'],
} satisfies Meta<typeof NavBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button'));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Main: Story = {
  args: { main: true },
};

export const TextImportant: Story = {
  args: { text: 'Print', icon: <IconPrint />, textImportant: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
