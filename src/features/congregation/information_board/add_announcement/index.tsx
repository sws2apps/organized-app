import Dialog from '@components/dialog';
import { AddAnnouncementProps } from './index.types';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { Stack } from '@mui/material';
import Button from '@components/button';
import Divider from '@components/divider';
import Tabs from '@components/tabs';
import SwitchWithLabel from '@components/switch_with_label';
import useAddAnnouncement from './useAddAnnouncement';

const AddAnnouncement = (props: AddAnnouncementProps) => {
  const { t } = useAppTranslation();
  const {
    tabs,
    draft,
    handleSwitchPinAtTheTop,
    handleSwitchNotifyEverybody,
    handleCancel,
    handlePublish,
    isPublishEnabled,
  } = useAddAnnouncement(props.announcementId, props.onClose);
  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      sx={{
        gap: '24px',
        padding: '24px',
      }}
    >
      <Typography className="h2">
        {props.mode === 'edit'
          ? t('tr_editAnnouncement')
          : t('tr_addAnnouncement')}
      </Typography>

      <Tabs tabs={tabs} onChange={() => {}} value={0} />

      <Stack width={'100%'}>
        <Divider color="var(--accent-200)" />
      </Stack>

      <Stack spacing={'16px'}>
        <Typography className="body-small-semibold" color="var(--grey-350)">
          {t('tr_optionalSettings')}
        </Typography>
        <SwitchWithLabel
          checked={draft?.pin_at_the_top.value}
          label={t('tr_pinAtTheTop')}
          helper={t('tr_pinAtTheTopDesc')}
          onChange={handleSwitchPinAtTheTop}
        />
        <SwitchWithLabel
          checked={draft?.notify_everybody}
          label={t('tr_notifyEverybody')}
          helper={t('tr_notifyEverybodyDesc')}
          onChange={handleSwitchNotifyEverybody}
        />
      </Stack>

      <Stack spacing="8px" width={'100%'}>
        <Button
          variant="main"
          onClick={handlePublish}
          disabled={!isPublishEnabled}
        >
          {t('tr_publish')}
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default AddAnnouncement;
