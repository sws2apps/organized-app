import { GoogleAuthProvider } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import OAuthButtonBase from './OAuthButtonBase';
import googleIcon from '../../img/google.svg';

const provider = new GoogleAuthProvider();

const OAuthGoogle = () => {
  const { t } = useTranslation('ui');

  return (
    <OAuthButtonBase
      provider={provider}
      text={t('oauthGoogle')}
      buttonStyles={{
        backgroundColor: '#4285F4',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#4285F4',
          color: '#FFFFFF',
        },
      }}
      logo={googleIcon}
    />
  );
};

export default OAuthGoogle;
