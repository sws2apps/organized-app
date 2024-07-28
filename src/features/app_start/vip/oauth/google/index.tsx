import OAuthButtonBase from '../button_base';
import { authProvider } from '@services/firebase/auth';
import { useAppTranslation } from '@hooks/index';
import { IconGoogle } from '@icons/index';

const provider = authProvider.Google;

const OAuthGoogle = () => {
  const { t } = useAppTranslation();

  return (
    <OAuthButtonBase
      provider={provider}
      text={t('tr_oauthGoogle')}
      logo={<IconGoogle />}
    />
  );
};

export default OAuthGoogle;
