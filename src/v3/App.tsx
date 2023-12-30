import { Suspense, lazy } from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary, WaitingCircular } from '@components';
import { useGlobal } from '@hooks/index';
import { RootLayout } from '@layouts/index';
import ComponentsPreview from './ComponentsPreview';

// lazy loading
const Dashboard = lazy(() => import('@pages/dashboard'));

const queryClient = new QueryClient();

const App = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const { isSupported } = useGlobal();

  const router = createHashRouter([
    {
      errorElement: <ErrorBoundary />,
      children: [
        { path: '/components-preview', element: <ComponentsPreview /> },
        {
          element: <RootLayout updatePwa={updatePwa} />,
          children: [{ path: '*', element: <Dashboard /> }],
        },
      ],
    },
  ]);

  return (
    <>
      {!isSupported && (
        <div className="browser-not-supported">
          You are using unsupported browser for the Congregation Program for Everyone app. Make sure that your browser
          is up to date, or try to use another browser.
        </div>
      )}

      {isSupported && (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<WaitingCircular />}>
            <RouterProvider router={router} />
          </Suspense>
        </QueryClientProvider>
      )}
    </>
  );
};
export default App;
