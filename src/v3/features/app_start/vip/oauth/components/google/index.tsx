import OAuthButtonBase from '../button_base';
import { authProvider } from '@services/firebase/auth';
import { useAppTranslation } from '@hooks/index';
import { IconGoogle } from '@icons';

const provider = authProvider.Google;

const OAuthGoogle = () => {
  const { t } = useAppTranslation();

  return <OAuthButtonBase provider={provider} text={t('trans_oauthGoogle')} logo={<IconGoogle />} />;
};

export default OAuthGoogle;
