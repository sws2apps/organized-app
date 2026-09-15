import Button from '@components/button';
import { IconArrowLink } from '@components/icons';
import { getWebsiteName } from '@features/congregation/information_board/quick_settings/index.utils';
import { infoBoardExternalLinksState } from '@states/information_board';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

const useExternalLinks = () => {
  const externalLinks = useAtomValue(infoBoardExternalLinksState);

  const linkButtons = useMemo(
    () =>
      externalLinks?.map((externalLink) => (
        <Button
          key={externalLink.id}
          variant="tertiary"
          href={externalLink.link}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<IconArrowLink />}
          sx={{ textTransform: 'uppercase' }}
        >
          {externalLink.label.trim() || getWebsiteName(externalLink.link)}
        </Button>
      )),
    [externalLinks]
  );

  return {
    linkButtons,
  };
};

export default useExternalLinks;
