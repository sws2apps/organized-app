import { ReactNode } from 'react';
import useWebWorker from './useWebWorker';

const WebWorker = ({ children }: { children?: ReactNode }) => {
  useWebWorker();

  return <>{children}</>;
};

export default WebWorker;
