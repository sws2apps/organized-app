import { Fragment } from 'react';
import { Box, Stack } from '@mui/material';
import { IconAdd, IconDelete, IconEdit } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { AssignmentCode } from '@definition/assignment';
import { DUTIES_SECTIONS_MAX } from '@services/app/duties';
import { MicSectionsProps } from './index.types';
import useMicSections from './useMicSections';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Divider from '@components/divider';
import IconButton from '@components/icon_button';
import PersonSelector from '@features/meetings/person_selector';
import SectionEdit from './section_edit';
import Typography from '@components/typography';
import { dutyFieldsLayout } from '@features/meetings/duties_schedule/shared';

const MicSections = ({ week, prefix, meeting }: MicSectionsProps) => {
  const { t } = useAppTranslation();

  const {
    sections,
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
      {formOpen && (
        <SectionEdit
          open={formOpen}
          onClose={handleCloseForm}
          type={editId ? 'edit' : 'add'}
          meeting={meeting}
          week={week}
          id={editId}
        />
      )}

      {deleteId.length > 0 && (
        <Dialog onClose={handleCloseDelete} open={deleteId.length > 0}>
          <Stack spacing="24px" sx={{ width: '100%' }}>
            <Typography className="h2">{t('tr_sectionDelete')}</Typography>
            <Typography sx={{ color: 'var(--grey-400)' }}>
              {t('tr_sectionDeleteDesc')}
            </Typography>
            <Stack spacing="8px">
              <Button variant="main" color="red" onClick={handleDelete}>
                {t('tr_delete')}
              </Button>
              <Button variant="secondary" onClick={handleCloseDelete}>
                {t('tr_cancel')}
              </Button>
            </Stack>
          </Stack>
        </Dialog>
      )}

      {sections.map((section) => {
        const partsLabel = sectionParts(section.parts);

        return (
          <Fragment key={section.id}>
            <Divider color="var(--accent-200)" />

            <Stack
              spacing="8px"
              sx={{
                '&:hover .section-actions': { opacity: 1 },
                '&:focus-within .section-actions': { opacity: 1 },
                // touch devices have no hover state, so keep actions visible
                '@media (hover: none)': {
                  '.section-actions': { opacity: 1 },
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 'var(--dialog-header-gap)',
                  paddingBottom: 'var(--radius-s)',
                }}
              >
                <Stack
                  spacing="2px"
                  sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
                >
                  <Typography
                    className="body-small-semibold"
                    sx={{ color: 'var(--grey-400)' }}
                  >
                    {section.name}
                  </Typography>

                  {/* the parts tell the brothers where they are expected, and
                      a section named after its only part says it once */}
                  {partsLabel.length > 0 && partsLabel !== section.name && (
                    <Typography
                      className="label-small-regular"
                      sx={{ color: 'var(--grey-350)' }}
                    >
                      {partsLabel}
                    </Typography>
                  )}
                </Stack>

                <Stack
                  direction="row"
                  spacing="4px"
                  className="section-actions"
                  sx={{
                    flexShrink: 0,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <IconButton
                    aria-label={t('tr_sectionEdit')}
                    sx={{ minWidth: '44px', minHeight: '44px' }}
                    onClick={() => handleOpenEdit(section.id)}
                  >
                    <IconEdit color="var(--accent-main)" />
                  </IconButton>
                  <IconButton
                    aria-label={t('tr_sectionDelete')}
                    sx={{ minWidth: '44px', minHeight: '44px' }}
                    onClick={() => handleAskDelete(section.id)}
                  >
                    <IconDelete color="var(--red-main)" />
                  </IconButton>
                </Stack>
              </Box>

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
            </Stack>
          </Fragment>
        );
      })}

      <Divider color="var(--accent-200)" />

      <Stack spacing="4px" sx={{ alignItems: 'flex-start' }}>
        <Button
          variant="small"
          onClick={handleOpenAdd}
          disabled={sections.length >= DUTIES_SECTIONS_MAX}
          startIcon={<IconAdd />}
          sx={{
            height: '32px',
            minHeight: '32px !important',
          }}
        >
          {t('tr_sectionAdd')}
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
    </Stack>
  );
};

export default MicSections;
