import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssignmentCheckList } from './index';

const meta = {
  title: 'Components/AssignmentsChecklist',
  component: AssignmentCheckList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AssignmentCheckList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    header: 'Midweek Assignments',
    color: 'midweek-meeting',
  },
};
