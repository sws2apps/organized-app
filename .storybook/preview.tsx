import type { Preview } from '@storybook/react-vite';
import '../src/global/global.css';
import '../src/global/index.css';
import '../src/services/i18n/index';
import { Provider } from 'jotai';
import { store } from '../src/states';
import { DatabaseWrapper } from '../src/wrapper/index';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { mswHandlers } from './msw-handlers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

initialize({ onUnhandledRequest: 'bypass' });

// Apply the default app theme so CSS variables resolve in Storybook docs
document.body.setAttribute('data-theme', 'blue-light');

const preview: Preview = {
  decorators: [
    (Story) => (
      <Provider store={store}>
        <DatabaseWrapper>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Story />
          </LocalizationProvider>
        </DatabaseWrapper>
      </Provider>
    ),
  ],
  loaders: [mswLoader],
  parameters: {
    msw: { handlers: Object.values(mswHandlers).flat() },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
