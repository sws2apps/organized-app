import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const useAppTranslation = (props) => {
  const namespace = props || 'ui';

  const { t, i18n } = useTranslation(namespace);

  return { t, i18n };
};

useAppTranslation.propTypes = {
  namespace: PropTypes.string,
};

useAppTranslation.defaultProps = {
  namespace: 'ui',
};

export default useAppTranslation;
