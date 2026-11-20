import { ReactNode } from 'react';
import { Box } from '@mui/material';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import { IconDonate, IconDutiesDistribution } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useSupport from './useSupport';

type OptionCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  actionVariant: 'main' | 'tertiary';
  onAction: VoidFunction;
};

const OptionCard = ({
  icon,
  title,
  description,
  action,
  actionVariant,
  onAction,
}: OptionCardProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px',
      borderRadius: 'var(--radius-l)',
      backgroundColor: 'var(--accent-100)',
      '& ul': { margin: '8px 0', paddingInlineStart: '24px' },
      '& p': { margin: 0 },
      '& p + p, & ul + p': { marginTop: '8px' },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon}
      <Typography className="h4" color="var(--accent-dark)">
        {title}
      </Typography>
    </Box>

    <TextMarkup
      content={description}
      className="body-small-regular"
      anchorClassName="body-small-semibold"
    />

    <Button variant={actionVariant} onClick={onAction}>
      {action}
    </Button>
  </Box>
);

const Support = () => {
  const { t } = useAppTranslation();

  const { handleClose, isOpen, handleOpenDonate, handleOpenDoc } = useSupport();

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('tr_supportApp')}
      closable
    >
      <TextMarkup content={t('tr_supportAppDesc')} className="body-regular" />

      <OptionCard
        icon={<IconDonate color="var(--accent-dark)" />}
        title={t('tr_supportAppOption1')}
        description={t('tr_supportAppOption1Desc')}
        action={t('tr_makeDonation')}
        actionVariant="tertiary"
        onAction={handleOpenDonate}
      />

      <OptionCard
        icon={<IconDutiesDistribution color="var(--accent-dark)" />}
        title={t('tr_supportAppOption2')}
        description={t('tr_supportAppOption2Desc')}
        action={t('tr_contribute')}
        actionVariant="main"
        onAction={handleOpenDoc}
      />
    </Dialog>
  );
};

export default Support;
