import type { Decorator, Preview } from '@storybook/react-vite';
import { mswLoader } from 'msw-storybook-addon/csf3';
import { ColorSchemeType } from '../src/definition/app';
import { AppProviders, AppTheme } from './providers';
import { handlers } from './msw-handlers';
import '../src/global/global.css';
import '../src/global/index.css';
import '../src/services/firebase/index';
import '../src/services/i18n/index';

const COLOR_SCHEMES: ColorSchemeType[] = ['blue', 'green', 'purple', 'orange'];

const THEMES = COLOR_SCHEMES.flatMap((color) => [
  `${color}-light`,
  `${color}-dark`,
]);

const withAppTheme: Decorator = (Story, { globals }) => (
  <AppTheme theme={String(globals.theme ?? 'blue-light')}>
    <Story />
  </AppTheme>
);

const withAppProviders: Decorator = (Story) => (
  <AppProviders>
    <Story />
  </AppProviders>
);

const preview: Preview = {
  decorators: [withAppTheme, withAppProviders],
  loaders: [mswLoader()],
  globalTypes: {
    theme: {
      description: 'Organized color scheme (data-theme attribute)',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: THEMES,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'blue-light',
  },
  parameters: {
    msw: { handlers },
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' reports violations in the test UI without failing CI.
      test: 'todo',
    },
    options: {
      storySort: {
        order: ['Docs', ['Introduction', 'Design tokens'], 'Components'],
      },
    },
  },
};

export default preview;
