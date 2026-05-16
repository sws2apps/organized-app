import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';
import { IconAdd } from '@components/icons';

const meta = {
  title: 'Components/NavBarButton',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Add person',
    icon: <IconAdd />,
  },
};

export const Primary: Story = {
  args: {
    text: 'Save',
    icon: <IconAdd />,
    main: true,
  },
};
