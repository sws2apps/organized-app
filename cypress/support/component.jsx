/// <reference types="cypress" />

// Import commands.js using ES2015 syntax:
import './commands';
import '../../src/current/i18n';

import { mount } from 'cypress/react18';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import RecoilOutside from 'recoil-outside';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

Cypress.Commands.add('mount', (children) => {
  return mount(
    <RecoilRoot>
      <RecoilOutside />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RecoilRoot>
  );
});
