import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SelectPropsType } from '@components/select/index.types';
import SourceLanguageSelector from './index';

const meta = {
  title: 'Components/SourceLanguageSelector',
  component: SourceLanguageSelector,
  args: { onChange: fn(), label: 'Source language' },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<SelectPropsType>;

export default meta;
type Story = StoryObj<SelectPropsType>;

export const Default: Story = {
  args: { value: 'E' },
};

export const ReadOnly: Story = {
  args: { value: 'X', readOnly: true },
};
