import OAuthButtonBase from '../button_base';
import { useAppTranslation } from '@hooks';
import { IconYahoo } from '@icons';
import { authProvider } from '@services/firebase/auth';

const provider = authProvider.Yahoo;

const OAuthYahoo = () => {
  const { t } = useAppTranslation();

  return <OAuthButtonBase provider={provider} text={t('trans_oauthYahoo')} logo={<IconYahoo />} />;
};

export default OAuthYahoo;
