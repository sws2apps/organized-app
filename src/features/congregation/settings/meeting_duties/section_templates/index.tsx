import ScrollableTabs from '@components/scrollable_tabs';
import { SectionTemplatesProps } from '@features/congregation/settings/meeting_duties/section_templates/index.types';
import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { DUTIES_SECTIONS_MAX } from '@services/app/duties';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Divider from '@components/divider';
import IconButton from '@components/icon_button';
import InfoNote from '@components/info_note';
import { IconAdd, IconEdit, IconDelete } from '@components/icons';
import Typography from '@components/typography';
import SectionEdit from '@features/meetings/duties_schedule/mic_sections/section_edit';
import useSectionTemplates from '@features/congregation/settings/meeting_duties/section_templates/useSectionTemplates';

const SectionTemplates = ({
  meeting,
  onMeetingChange,
  onClose,
}: SectionTemplatesProps) => {
  const { t } = useAppTranslation();
  const {
    sections,
    parts,
    editing,
    setEditing,
    busy,
    error,
    update,
    save,
    remove,
  } = useSectionTemplates(meeting, onClose);
  if (editing !== undefined)
    return (
      <SectionEdit
        open
        recurring
        week=""
        meeting={meeting}
        type={editing ? 'edit' : 'add'}
        id={editing || undefined}
        availableSections={sections}
        availableParts={parts}
        onSave={update}
        onClose={() => setEditing(undefined)}
      />
    );
  return (
    <Dialog
      open
      onClose={() => {
        if (!busy) onClose();
      }}
      title={t('tr_sectionsTitle')}
      description={t('tr_sectionsRecurringDesc')}
      actions={
        <DialogActions>
          <Button variant="secondary" disabled={busy} onClick={onClose}>
            {t('tr_cancel')}
          </Button>
          <Button
            variant="main"
            disabled={busy || editing !== undefined}
            onClick={save}
          >
            {t('tr_done')}
          </Button>
        </DialogActions>
      }
    >
      <Stack spacing="16px" sx={{ width: '100%' }}>
        <ScrollableTabs
          appearance="plain"
          value={meeting === 'midweek' ? 0 : 1}
          onChange={(value) =>
            onMeetingChange(value === 0 ? 'midweek' : 'weekend')
          }
          aria-label={t('tr_meetings')}
          disabled={busy}
          tabs={[{ label: t('tr_midweek') }, { label: t('tr_weekend') }]}
        />
        <Stack
          spacing="16px"
          sx={{ width: '100%' }}
          divider={<Divider color="var(--accent-200)" />}
        >
          {error && (
            <Typography color="var(--red-main)" role="alert">
              {error}
            </Typography>
          )}
          {!sections.length && (
            <InfoNote message={t('tr_sectionsRecurringEmpty')} />
          )}
          {sections.map((section) => {
            const linkedParts = section.parts
              .map((key) => parts.find((part) => part.key === key)?.label)
              .filter(Boolean)
              .join(', ');
            return (
              <Stack
                key={section.id}
                direction="row"
                sx={{
                  alignItems: 'center',
                  gap: 'var(--dialog-gap-mobile)',
                  minWidth: 0,
                }}
              >
                <Stack sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
                  <Typography className="body-small-semibold">
                    {section.name}
                  </Typography>
                  <Typography
                    className="label-small-regular"
                    color="var(--grey-350)"
                  >
                    {t('tr_sectionPositions', { count: section.amount })}
                  </Typography>
                  {linkedParts && linkedParts !== section.name && (
                    <Typography
                      className="label-small-regular"
                      color="var(--grey-350)"
                    >
                      {linkedParts}
                    </Typography>
                  )}
                </Stack>
                <Stack
                  direction="row"
                  sx={{ flexShrink: 0, gap: 'var(--dialog-header-gap)' }}
                >
                  <IconButton
                    edge={false}
                    sx={{
                      padding: 'var(--radius-l)',
                      borderRadius: 'var(--radius-l)',
                    }}
                    disabled={busy}
                    aria-label={t('tr_sectionEditNamed', {
                      section: section.name,
                    })}
                    onClick={() => setEditing(section.id)}
                  >
                    <IconEdit
                      width={20}
                      height={20}
                      color="var(--accent-main)"
                    />
                  </IconButton>
                  <IconButton
                    edge={false}
                    sx={{
                      padding: 'var(--radius-l)',
                      borderRadius: 'var(--radius-l)',
                    }}
                    color="error"
                    disabled={busy}
                    aria-label={t('tr_sectionDeleteNamed', {
                      section: section.name,
                    })}
                    onClick={() => remove(section.id)}
                  >
                    <IconDelete
                      width={20}
                      height={20}
                      color="var(--red-main)"
                    />
                  </IconButton>
                </Stack>
              </Stack>
            );
          })}
          <Button
            variant="small"
            disableAutoStretch
            sx={{ alignSelf: 'flex-start' }}
            startIcon={<IconAdd />}
            disabled={busy || sections.length >= DUTIES_SECTIONS_MAX}
            onClick={() => setEditing('')}
          >
            {t('tr_sectionAdd')}
          </Button>
          {sections.length >= DUTIES_SECTIONS_MAX && (
            <Typography>
              {t('tr_sectionsMax', { maxSections: DUTIES_SECTIONS_MAX })}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
};
export default SectionTemplates;
