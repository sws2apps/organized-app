import OAuthButtonBase from '../button_base';
import { useAppTranslation } from '@hooks/index';
import { IconGithub } from '@icons/index';
import { authProvider } from '@services/firebase/auth';

const provider = authProvider.GitHub;

const OAuthGitHub = () => {
  const { t } = useAppTranslation();

  return <OAuthButtonBase provider={provider} text={t('tr_oauthGithub')} logo={<IconGithub color="var(--black)" />} />;
};

export default OAuthGitHub;
