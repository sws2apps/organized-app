import { Fragment } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import {
  IconAdd,
  IconAssign,
  IconCopy,
  IconDelete,
  IconEdit,
} from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { AssignmentCode } from '@definition/assignment';
import { MicSectionsProps } from './index.types';
import useMicSections from './useMicSections';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Divider from '@components/divider';
import IconButton from '@components/icon_button';
import PersonSelector from '@features/meetings/person_selector';
import SectionEdit from './section_edit';
import Typography from '@components/typography';
import { dutyFieldColumns } from '../shared';

const MicSections = ({ week, prefix, meeting }: MicSectionsProps) => {
  const { t } = useAppTranslation();

  const {
    sections,
    sectionParts,
    hasSuggestion,
    previousWeek,
    formOpen,
    editId,
    deleteId,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseForm,
    handleAskDelete,
    handleCloseDelete,
    handleDelete,
    handleAddSuggested,
    handleCopyPrevious,
  } = useMicSections(week, meeting);

  return (
    <Stack spacing="16px" flex={1} width="100%">
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
          <Stack spacing="24px" width="100%">
            <Typography className="h2">{t('tr_sectionDelete')}</Typography>
            <Typography color="var(--grey-400)">
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
        const size = dutyFieldColumns(section.amount);

        const partsLabel =
          sectionParts(section.parts) || t('tr_sectionWholeMeeting');

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
              {/* absolute icons keep the row at label height */}
              <Box sx={{ position: 'relative', display: 'flex' }}>
                <Stack spacing="2px">
                  <Typography
                    className="body-small-semibold"
                    color="var(--grey-400)"
                  >
                    {section.name}
                  </Typography>

                  {/* the parts tell the brothers where they are expected, and
                      a section named after its only part says it once */}
                  {partsLabel !== section.name && (
                    <Typography
                      className="label-small-regular"
                      color="var(--grey-350)"
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
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <IconButton
                    sx={{ padding: '4px' }}
                    onClick={() => handleOpenEdit(section.id)}
                  >
                    <IconEdit color="var(--accent-main)" />
                  </IconButton>
                  <IconButton
                    sx={{ padding: '4px' }}
                    onClick={() => handleAskDelete(section.id)}
                  >
                    <IconDelete color="var(--red-main)" />
                  </IconButton>
                </Stack>
              </Box>

              <Grid container columnSpacing="8px" rowSpacing="16px">
                {Array.from(
                  { length: Math.min(section.amount, 4) },
                  (_, index) => (
                    <Grid key={index} size={{ mobile: 12, laptop: size }}>
                      <PersonSelector
                        label={t('tr_responsible')}
                        week={week}
                        assignment={`${prefix}_DUTIES_Dynamic`}
                        type={AssignmentCode.DUTIES_Microphone}
                        schedule_id={`${section.id}_${index + 1}`}
                        showIcon={false}
                      />
                    </Grid>
                  )
                )}
              </Grid>
            </Stack>
          </Fragment>
        );
      })}

      <Divider color="var(--accent-200)" />

      <Stack direction="row" spacing="8px" flexWrap="wrap" useFlexGap>
        <Button
          variant="small"
          onClick={handleOpenAdd}
          startIcon={<IconAdd />}
          sx={{
            height: '32px',
            minHeight: '32px !important',
          }}
        >
          {t('tr_sectionAdd')}
        </Button>

        {/* the layout used most of the time, one click away */}
        {sections.length === 0 && hasSuggestion && (
          <Button
            variant="small"
            onClick={handleAddSuggested}
            startIcon={<IconAssign />}
            sx={{
              height: '32px',
              minHeight: '32px !important',
            }}
          >
            {t('tr_sectionsSuggested')}
          </Button>
        )}

        {/* the sections of a week are its own: a congregation that keeps the
            same shifts brings them over instead of typing them again */}
        {sections.length === 0 && previousWeek.length > 0 && (
          <Button
            variant="small"
            onClick={handleCopyPrevious}
            startIcon={<IconCopy />}
            sx={{
              height: '32px',
              minHeight: '32px !important',
            }}
          >
            {t('tr_sectionsCopyPrevious')}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default MicSections;
