import type { Meta, StoryObj } from '@storybook/react-vite';
import SwitchWithLabel from '@components/switch_with_label';
import SwitcherContainer from './index';

const meta = {
  title: 'Components/SwitcherContainer',
  component: SwitcherContainer,
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SwitcherContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <SwitchWithLabel label="Midweek meeting" checked />
        <SwitchWithLabel label="Weekend meeting" />
      </>
    ),
  },
};
