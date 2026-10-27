import DialogActions from '@components/dialog_actions';
import { useAtomValue } from 'jotai';
import { userDataViewState } from '@states/settings';
import { Fragment } from 'react';
import { Box, Stack } from '@mui/material';
import { IconAdd, IconDelete, IconEdit } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { AssignmentCode } from '@definition/assignment';
import { DUTIES_SECTIONS_MAX } from '@services/app/duties';
import { MicSectionsProps } from './index.types';
import useMicSections from './useMicSections';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Divider from '@components/divider';
import IconButton from '@components/icon_button';
import PersonSelector from '@features/meetings/person_selector';
import SectionEdit from '@features/meetings/duties_schedule/mic_sections/section_edit';
import Typography from '@components/typography';
import { dutyFieldsLayout } from '@features/meetings/duties_schedule/shared';

const MicSections = ({
  week,
  prefix,
  meeting,
  management = false,
}: MicSectionsProps) => {
  const { t } = useAppTranslation();
  const { tabletDown } = useBreakpoints();
  const dataView = useAtomValue(userDataViewState);

  const {
    sections,
    restoreOpen,
    setRestoreOpen,
    handleRestore,
    isBusy,
    parts,
    sectionParts,
    formOpen,
    editId,
    deleteId,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseForm,
    handleAskDelete,
    handleCloseDelete,
    handleDelete,
  } = useMicSections(week, meeting);

  return (
    <Stack spacing="16px" sx={{ flex: 1, width: '100%', minWidth: 0 }}>
      {management && restoreOpen && (
        <Dialog
          open
          onClose={() => {
            if (!isBusy) setRestoreOpen(false);
          }}
          title={t('tr_sectionsRestore')}
          description={t('tr_sectionsRestoreDesc')}
          actions={
            <DialogActions>
              <Button
                variant="secondary"
                disabled={isBusy}
                onClick={() => setRestoreOpen(false)}
              >
                {t('tr_cancel')}
              </Button>
              <Button variant="main" disabled={isBusy} onClick={handleRestore}>
                {t('tr_sectionsRestore')}
              </Button>
            </DialogActions>
          }
        />
      )}
      {formOpen && (
        <SectionEdit
          key={`${week}:${meeting}:${dataView}:${editId ?? 'add'}`}
          open={formOpen}
          onClose={handleCloseForm}
          type={editId ? 'edit' : 'add'}
          meeting={meeting}
          week={week}
          id={editId}
        />
      )}

      {deleteId.length > 0 && (
        <Dialog
          onClose={handleCloseDelete}
          open
          title={t('tr_sectionDelete')}
          description={t('tr_sectionDeleteDesc')}
          actions={
            <DialogActions>
              <Button
                variant="secondary"
                disabled={isBusy}
                onClick={handleCloseDelete}
              >
                {t('tr_cancel')}
              </Button>
              <Button
                variant="main"
                color="red"
                disabled={isBusy}
                onClick={handleDelete}
              >
                {t('tr_delete')}
              </Button>
            </DialogActions>
          }
        />
      )}

      {sections.map((section, sectionIndex) => {
        const partsLabel = section.parts.length
          ? sectionParts(section.parts)
          : '';
        const missingParts = section.parts.some(
          (key) => !parts.some((part) => part.key === key)
        );

        return (
          <Fragment key={section.id}>
            {sectionIndex > 0 && <Divider color="var(--accent-200)" />}

            <Stack
              spacing="var(--dialog-header-gap)"
              role="group"
              aria-label={section.name}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: tabletDown ? 'column' : 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 'var(--dialog-header-gap)',
                  paddingBottom: 'var(--radius-s)',
                }}
              >
                <Stack
                  spacing="2px"
                  sx={{ minWidth: 0, flex: 1, overflowWrap: 'anywhere' }}
                >
                  <Typography
                    className="body-small-semibold"
                    sx={{ color: 'var(--grey-400)' }}
                  >
                    {section.name}
                  </Typography>

                  {/* the parts tell the brothers where they are expected, and
                      a section named after its only part says it once */}
                  {missingParts && (
                    <Typography
                      className="label-small-regular"
                      color="var(--orange-dark)"
                    >
                      {t('tr_sectionPartsChanged')}
                    </Typography>
                  )}
                  {partsLabel.length > 0 && partsLabel !== section.name && (
                    <Typography
                      className="label-small-regular"
                      sx={{ color: 'var(--grey-350)' }}
                    >
                      {partsLabel}
                    </Typography>
                  )}
                </Stack>

                {management && (
                  <Stack
                    direction="row"
                    spacing="4px"
                    className="section-actions"
                    sx={{
                      flexShrink: 0,
                      alignSelf: 'flex-end',
                    }}
                  >
                    <IconButton
                      disabled={isBusy}
                      aria-label={t('tr_sectionEdit')}
                      sx={{ minWidth: '44px', minHeight: '44px' }}
                      onClick={() => handleOpenEdit(section.id)}
                    >
                      <IconEdit
                        color={
                          isBusy ? 'var(--grey-300)' : 'var(--accent-main)'
                        }
                      />
                    </IconButton>
                    <IconButton
                      aria-label={t('tr_sectionDelete')}
                      disabled={isBusy}
                      sx={{ minWidth: '44px', minHeight: '44px' }}
                      onClick={() => handleAskDelete(section.id)}
                    >
                      <IconDelete
                        color={isBusy ? 'var(--grey-300)' : 'var(--red-main)'}
                      />
                    </IconButton>
                  </Stack>
                )}
              </Box>

              {!management && (
                <Box sx={dutyFieldsLayout(section.amount)}>
                  {Array.from(
                    { length: Math.min(section.amount, 4) },
                    (_, index) => (
                      <Box key={index} sx={{ minWidth: 0 }}>
                        <PersonSelector
                          label={t('tr_responsible')}
                          week={week}
                          assignment={`${prefix}_DUTIES_Dynamic`}
                          type={AssignmentCode.DUTIES_Microphone}
                          schedule_id={`${section.id}_${index + 1}`}
                          showIcon={false}
                        />
                      </Box>
                    )
                  )}
                </Box>
              )}
              {management && (
                <Typography className="label-small-regular">
                  {t('tr_sectionPositions', { count: section.amount })}
                </Typography>
              )}
            </Stack>
          </Fragment>
        );
      })}

      {management && sections.length > 0 && (
        <Divider color="var(--accent-200)" />
      )}

      {management ? (
        <Stack spacing="4px" sx={{ alignItems: 'flex-start' }}>
          <Button
            variant="small"
            onClick={handleOpenAdd}
            disabled={isBusy || sections.length >= DUTIES_SECTIONS_MAX}
            startIcon={<IconAdd />}
            sx={{
              height: '32px',
              minHeight: '32px !important',
            }}
          >
            {t('tr_sectionAdd')}
          </Button>

          <Button
            variant="small"
            disabled={isBusy}
            onClick={() => setRestoreOpen(true)}
          >
            {t('tr_sectionsRestore')}
          </Button>
          {/* the limit only shows once it is in the way */}
          {sections.length >= DUTIES_SECTIONS_MAX && (
            <Typography
              className="label-small-regular"
              sx={{ color: 'var(--grey-350)' }}
            >
              {t('tr_sectionsMax', { maxSections: DUTIES_SECTIONS_MAX })}
            </Typography>
          )}
        </Stack>
      ) : (
        sections.length === 0 && (
          <Typography className="body-small-regular" color="var(--grey-350)">
            {t('tr_sectionsConfigureHint')}
          </Typography>
        )
      )}
    </Stack>
  );
};

export default MicSections;
