import { GithubAuthProvider } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import OAuthButtonBase from './OAuthButtonBase';
import githubIcon from '../../img/github.svg';

const provider = new GithubAuthProvider();

const OAuthGitHub = () => {
  const { t } = useTranslation('ui');

  return (
    <OAuthButtonBase
      provider={provider}
      text={t('oauthGithub')}
      buttonStyles={{
        backgroundColor: '#2F2F2F',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#2F2F2F',
          color: '#FFFFFF',
        },
      }}
      logo={githubIcon}
    />
  );
};

export default OAuthGitHub;
