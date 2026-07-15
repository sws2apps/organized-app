import { Fragment } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import { IconAdd, IconDelete, IconEdit } from '@components/icons';
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

const MicSections = ({ week, prefix }: MicSectionsProps) => {
  const { t } = useAppTranslation();

  const {
    sections,
    formOpen,
    editId,
    deleteId,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseForm,
    handleAskDelete,
    handleCloseDelete,
    handleDelete,
  } = useMicSections();

  return (
    <Stack spacing="16px" flex={1} width="100%">
      {formOpen && (
        <SectionEdit
          open={formOpen}
          onClose={handleCloseForm}
          type={editId ? 'edit' : 'add'}
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
                <Typography
                  className="body-small-regular"
                  color="var(--grey-400)"
                >
                  {section.name}
                </Typography>

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

      <Button
        variant="small"
        onClick={handleOpenAdd}
        startIcon={<IconAdd />}
        sx={{
          height: '32px',
          minHeight: '32px !important',
          alignSelf: 'flex-start',
        }}
      >
        {t('tr_sectionAdd')}
      </Button>
    </Stack>
  );
};

export default MicSections;
