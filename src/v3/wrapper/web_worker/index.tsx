import { PropsWithChildren } from 'react';
import useWebWorker from './useWebWorker';

const WebWorker = ({ children }: PropsWithChildren) => {
  useWebWorker();

  return children;
};

export default WebWorker;
