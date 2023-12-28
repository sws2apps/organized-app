import OAuthButtonBase from '../button_base';
import { authProvider } from '@services/firebase/auth';
import { useAppTranslation } from '@hooks';
import { IconGoogle } from '@icons';

const provider = authProvider.Google;

const OAuthGoogle = () => {
  const { t } = useAppTranslation();

  return <OAuthButtonBase provider={provider} text={t('oauthGoogle')} logo={<IconGoogle />} />;
};

export default OAuthGoogle;
