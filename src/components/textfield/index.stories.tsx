import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { IconMail, IconSearch } from '@components/icons';
import { TextFieldTypeProps } from './index.types';
import TextField from './index';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  args: { onChange: fn(), label: 'Email' },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<TextFieldTypeProps>;

export default meta;
type Story = StoryObj<TextFieldTypeProps>;

export const Default: Story = {
  args: { placeholder: 'name@example.com' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByRole('textbox'), 'ana');
    await expect(args.onChange).toHaveBeenCalled();
    await expect(canvas.getByRole('textbox')).toHaveValue('ana');
  },
};

export const WithIcons: Story = {
  args: {
    startIcon: <IconMail />,
    endIcon: <IconSearch />,
  },
};

export const WithHelperText: Story = {
  args: { helperText: 'We will send a verification code to this address.' },
};

export const ErrorState: Story = {
  args: {
    defaultValue: 'not-an-email',
    error: true,
    helperText: 'Enter a valid email address',
  },
};

export const Success: Story = {
  args: { defaultValue: 'ana@example.com', success: true },
};

export const Password: Story = {
  args: { label: 'Access code', type: 'password', defaultValue: 'secret' },
};

export const Multiline: Story = {
  args: { label: 'Notes', multiline: true, rows: 3 },
};

export const Disabled: Story = {
  args: { defaultValue: 'ana@example.com', disabled: true },
};
