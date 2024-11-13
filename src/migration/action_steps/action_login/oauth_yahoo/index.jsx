import { OAuthProvider } from 'firebase/auth';
import OAuthButtonBase from '../oauth_button_base';
import yahooIcon from '../../../img/yahoo.svg?url';

const provider = new OAuthProvider('yahoo.com');

const OAuthYahoo = () => {
  return (
    <OAuthButtonBase
      provider={provider}
      text="Continue with Yahoo"
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
