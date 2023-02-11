import { OAuthProvider } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import OAuthButtonBase from './OAuthButtonBase';
import microsoftIcon from '../../img/microsoft.svg';

const provider = new OAuthProvider('microsoft.com');
provider.setCustomParameters({
  prompt: 'consent',
});

const OAuthMicrosoft = () => {
  const { t } = useTranslation('ui');

  return (
    <OAuthButtonBase
      provider={provider}
      text={t('oauthMicrosoft')}
      buttonStyles={{
        backgroundColor: '#2F2F2F',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#2F2F2F',
          color: '#FFFFFF',
        },
      }}
      logo={microsoftIcon}
    />
  );
};

export default OAuthMicrosoft;
