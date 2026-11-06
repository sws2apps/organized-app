import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { store } from '@states/index';
import { featureFlagsState } from '@states/app';
import Typography from '@components/typography';
import FeatureFlag from './index';

const meta = {
  title: 'Components/FeatureFlag',
  component: FeatureFlag,
  args: {
    flag: 'STORYBOOK_DEMO',
    children: <Typography>Rendered because the flag is enabled.</Typography>,
  },
  beforeEach: () => {
    store.set(featureFlagsState, { STORYBOOK_DEMO: true });

    return () => store.set(featureFlagsState, {});
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeatureFlag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/flag is enabled/)).toBeInTheDocument();
  },
};

export const Disabled: Story = {
  args: { flag: 'UNKNOWN_FLAG' },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/flag is enabled/)).not.toBeInTheDocument();
  },
};
