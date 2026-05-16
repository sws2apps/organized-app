import type { Meta, StoryObj } from '@storybook/react-vite';
import Component from './index';

const meta = {
  title: 'Components/Accordion',
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
    id: 'accordion-default',
    label: 'Accordion Title',
    children: 'This is the accordion content area.',
  },
};

export const Expanded: Story = {
  args: {
    id: 'accordion-expanded',
    label: 'Expanded by Default',
    defaultExpanded: true,
    children: 'This content is visible on load.',
  },
};
