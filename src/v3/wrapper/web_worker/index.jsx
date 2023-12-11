import PropTypes from 'prop-types';
import useWebWorker from './useWebWorker';

const WebWorker = ({ children }) => {
  useWebWorker();

  return <>{children}</>;
};

WebWorker.propTypes = {
  children: PropTypes.node,
};

export default WebWorker;
