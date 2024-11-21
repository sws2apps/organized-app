import { GoogleAuthProvider } from 'firebase/auth';
import OAuthButtonBase from '../oauth_button_base';
import googleIcon from '../../../img/google.svg?url';

const provider = new GoogleAuthProvider();

const OAuthGoogle = () => {
  return (
    <OAuthButtonBase
      provider={provider}
      text="Continue with Google"
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
