import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import Checkbox from '@components/checkbox';
import { AssignmentCheckList } from './index';

const meta = {
  title: 'Components/AssignmentsChecklist',
  component: AssignmentCheckList,
  args: { onChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof AssignmentCheckList>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  <Checkbox key="chairman" label="Chairman" />,
  <Checkbox key="prayer" label="Opening prayer" />,
  <Checkbox key="talk" label="Talk" />,
];

export const MidweekMeeting: Story = {
  args: {
    header: 'Midweek meeting',
    color: 'midweek-meeting',
    children: items,
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByLabelText('Midweek meeting'));
    await expect(args.onChange).toHaveBeenCalledWith(true);
    await expect(canvas.getByLabelText('Chairman')).toBeChecked();
  },
};

export const TreasuresFromGodsWord: Story = {
  args: {
    ...MidweekMeeting.args,
    header: 'Treasures from God’s Word',
    color: 'treasures-from-gods-word',
  },
};

export const ApplyYourselfToTheFieldMinistry: Story = {
  args: {
    ...MidweekMeeting.args,
    header: 'Apply Yourself to the Field Ministry',
    color: 'apply-yourself-to-the-field-ministry',
  },
};

export const LivingAsChristians: Story = {
  args: {
    ...MidweekMeeting.args,
    header: 'Living as Christians',
    color: 'living-as-christians',
  },
};

export const WeekendMeeting: Story = {
  args: {
    ...MidweekMeeting.args,
    header: 'Weekend meeting',
    color: 'weekend-meeting',
  },
};

export const Ministry: Story = {
  args: {
    ...MidweekMeeting.args,
    header: 'Ministry',
    color: 'ministry',
  },
};

export const Disabled: Story = {
  args: {
    ...MidweekMeeting.args,
    disabled: true,
  },
};
