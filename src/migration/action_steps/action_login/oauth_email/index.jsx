import OAuthButtonBase from '../oauth_button_base';
import emailIcon from '../../../img/email.svg?url';

const OAuthEmail = () => {
  return (
    <OAuthButtonBase
      provider={{ providerId: 'email' }}
      isEmail={true}
      text="Continue with Email"
      buttonStyles={{
        backgroundColor: '#5F6A6A',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#5F6A6A',
          color: '#FFFFFF',
        },
      }}
      logo={emailIcon}
    />
  );
};

export default OAuthEmail;
