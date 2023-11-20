import OAuthButtonBase from '../button_base';
import { useAppTranslation } from '@hooks';
import { IconMicrosoft } from '@icons';
import { authProvider } from '@services/firebase/auth';

const provider = authProvider.Microsoft;

const OAuthMicrosoft = () => {
  const { t } = useAppTranslation();

  return <OAuthButtonBase provider={provider} text={t('oauthMicrosoft')} logo={<IconMicrosoft />} />;
};

export default OAuthMicrosoft;
