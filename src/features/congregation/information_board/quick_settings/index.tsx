import { Button, Dialog, Tabs, Typography } from '@components/index';
import { useAppTranslation } from '@hooks/index';
import { QuickSettingsInformationBoardProps } from './index.types';
import useQuickSettingsInformationBoard from './useQuickSettingsInformationBoard';
import { Stack } from '@mui/material';

const QuickSettingsInformationBoard = (
  props: QuickSettingsInformationBoardProps
) => {
  const {
    tabs,
    handleTabChange,
    activeTab,
    handleCancel,
    handleSave,
    saveButtonIsActive,
  } = useQuickSettingsInformationBoard(props.open, props.onClose);

  const { t } = useAppTranslation();

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      size="large"
      sx={{
        gap: '24px',
        padding: '24px',
      }}
    >
      <Typography className="h2">{t('tr_quickSettings')}</Typography>
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_quickSettingsDesc')}
      </Typography>
      <Tabs tabs={tabs} onChange={handleTabChange} value={activeTab} />
      <Stack spacing="8px" width={'100%'}>
        <Button
          variant="main"
          onClick={handleSave}
          disabled={!saveButtonIsActive}
        >
          {t('tr_save')}
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default QuickSettingsInformationBoard;
