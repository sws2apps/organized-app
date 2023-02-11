import { OAuthProvider } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import OAuthButtonBase from './OAuthButtonBase';
import yahooIcon from '../../img/yahoo.svg';

const provider = new OAuthProvider('yahoo.com');

const OAuthYahoo = () => {
  const { t } = useTranslation('ui');

  return (
    <OAuthButtonBase
      provider={provider}
      text={t('oauthYahoo')}
      buttonStyles={{
        backgroundColor: '#7E1FFF',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#7E1FFF',
          color: '#FFFFFF',
        },
      }}
      logo={yahooIcon}
    />
  );
};

export default OAuthYahoo;
