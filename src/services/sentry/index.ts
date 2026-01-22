import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: `v${import.meta.env.PACKAGE_VERSION}`,
  environment: import.meta.env.VITE_APP_MODE || 'PROD',
});

export default Sentry;
