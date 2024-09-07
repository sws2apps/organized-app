import { useState } from 'react';
import { Box } from '@mui/material';
import { Button, SnackBar } from '@components/index';
import { IconCheckCircle, IconCopy } from '@components/icons';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import { useAppTranslation } from '@hooks/index';
import SwitchWithLabel from '@components/switch_with_label';

const PageLinkItem = ({
  label,
  helper,
  link,
  isPublic: initialPublic,
}: {
  label: string;
  helper?: string;
  link: string;
  isPublic: boolean;
}) => {
  const { t } = useAppTranslation();
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [isCopied, setIsCopied] = useState(false);

  let seed: NodeJS.Timeout;

  const handleClick = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    seed = setTimeout(handlePopupClose, 3000);
  };

  const handlePopupClose = () => {
    setIsCopied(false);
    if (seed) {
      clearTimeout(seed);
      seed = null;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '32px' }}>
      <SwitchWithLabel
        label={label}
        helper={helper}
        checked={isPublic}
        onChange={setIsPublic}
      />
      {isPublic && (
        <Button
          onClick={handleClick}
          variant="small"
          sx={{ gap: '8px', flexShrink: 0, minHeight: '32px' }}
        >
          <IconCopy />
          {t('tr_copyLink')}
        </Button>
      )}
      <SnackBar
        open={isCopied}
        variant="success"
        messageIcon={<IconCheckCircle color="var(--always-white)" />}
        messageHeader={t('tr_textCopied')}
        message=""
        onClose={handlePopupClose}
      />
    </Box>
  );
};

const PublicLinksSection = () => {
  const { t } = useAppTranslation();

  const links = [
    {
      label: t('tr_meetingSchedules'),
      link: window.location.origin + '/#/weekly-schedules',
      isPublic: true,
    },
    {
      label: t('tr_informationBoard'),
      link: window.location.origin + '/#/',
      isPublic: true,
    },
    {
      label: t('tr_cleaningSchedules'),
      link: window.location.origin + '/#/',
      isPublic: true,
    },
    {
      label: t('tr_coVisitSchedules'),
      link: window.location.origin + '/#/',
      isPublic: true,
    },
    {
      label: t('tr_serviceMeetingSchedules'),
      link: window.location.origin + '/#/',
      isPublic: false,
    },
    {
      label: t('tr_meetingDutiesSchedules'),
      link: window.location.origin + '/#/',
      isPublic: false,
    },
  ];

  return (
    <CardSection>
      <CardSectionContent sx={{ gap: '16px' }}>
        <CardSectionHeader
          title={t('tr_enablePublicLinks')}
          description={t('tr_enablePublicLinksDesc')}
        />
        {links.map((link, index) => (
          <PageLinkItem key={index} {...link} />
        ))}
      </CardSectionContent>
    </CardSection>
  );
};

export default PublicLinksSection;
