import type { Meta, StoryObj } from '@storybook/react-vite';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Component from './index';

const meta = {
  title: 'Components/ErrorBoundary',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const router = createMemoryRouter([
        {
          path: '/',
          element: <Story />,
          errorElement: <Story />,
        },
      ]);
      return <RouterProvider router={router} />;
    },
  ],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    updatePwa: () => {},
  },
};
