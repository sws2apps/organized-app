import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useSectionsSettings from '@features/congregation/settings/meeting_duties/sections_settings/useSectionsSettings';
import Button from '@components/button';
import { IconSettings } from '@components/icons';
import SectionTemplates from '@features/congregation/settings/meeting_duties/section_templates';

const SectionsSettings = () => {
  const { t } = useAppTranslation();
  const { isDutiesEditor } = useCurrentUser();
  const { config, dataView, meeting, setMeeting, open, setOpen } =
    useSectionsSettings();
  if (!config?.mic_sections.value || config.schedule_weekly?.value) return null;
  return (
    <>
      <Button
        variant="small"
        startIcon={<IconSettings color="currentColor" />}
        disableAutoStretch
        sx={{ flexShrink: 0 }}
        disabled={!isDutiesEditor}
        onClick={() => setOpen(true)}
      >
        {t('tr_sectionsManage')}
      </Button>
      {open && (
        <SectionTemplates
          key={dataView}
          meeting={meeting}
          onMeetingChange={setMeeting}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
export default SectionsSettings;
