import OAuthButtonBase from '../button_base';
import { useAppTranslation } from '@hooks/index';
import { IconYahoo } from '@icons/index';
import { authProvider } from '@services/firebase/auth';

const provider = authProvider.Yahoo;

const OAuthYahoo = () => {
  const { t } = useAppTranslation();

  return (
    <OAuthButtonBase
      provider={provider}
      text={t('tr_oauthYahoo')}
      logo={<IconYahoo />}
    />
  );
};

export default OAuthYahoo;
