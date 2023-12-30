import OAuthButtonBase from '../button_base';
import { useAppTranslation } from '@hooks';
import { IconGithub } from '@icons';
import { authProvider } from '@services/firebase/auth';

const provider = authProvider.GitHub;

const OAuthGitHub = () => {
  const { t } = useAppTranslation();

  return (
    <OAuthButtonBase provider={provider} text={t('trans_oauthGithub')} logo={<IconGithub color="var(--black)" />} />
  );
};

export default OAuthGitHub;
