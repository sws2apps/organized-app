import { Box, Stack } from '@mui/material';
import { IconExpand, IconGithub } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { GITHUB_RELEASES_URL } from '@constants/index';
import useReleaseNotes from './useReleaseNotes';
import Accordion from '@components/accordion';
import Button from '@components/button';
import ImprovementsList from '@features/whats_new/improvements_list';
import NoteFeature from './note_feature';
import Typography from '@components/typography';

const ReleaseNotes = () => {
  const { t } = useAppTranslation();

  const { notes, expanded, handleExpand } = useReleaseNotes();

  return (
    <Stack spacing="16px">
      <Box>
        {notes.map((note, index) => (
          <Accordion
            key={note.key}
            id={note.key}
            expanded={expanded === note.key}
            onChange={handleExpand}
            disableGutters
            slotProps={{ transition: { unmountOnExit: true } }}
            summaryProps={{
              expandIcon: (
                <IconExpand color="var(--grey-350)" width={20} height={20} />
              ),
            }}
            sx={{
              borderBottom:
                index < notes.length - 1
                  ? '1px solid var(--accent-200)'
                  : 'none',
            }}
            label={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '8px',
                  width: '100%',
                  paddingRight: '8px',
                }}
              >
                <Typography className="h4">{note.version}</Typography>
                <Typography
                  className="body-small-regular"
                  color="var(--grey-350)"
                >
                  {note.date}
                </Typography>
              </Box>
            }
          >
            <Stack spacing="12px" sx={{ paddingBottom: '16px' }}>
              {note.features.map((feature) => (
                <NoteFeature key={feature.tr_title} feature={feature} />
              ))}

              {note.improvements.length > 0 && (
                <ImprovementsList
                  list={note.improvements}
                  showHeader={note.features.length > 0}
                />
              )}
            </Stack>
          </Accordion>
        ))}
      </Box>

      <Button
        variant="secondary"
        href={GITHUB_RELEASES_URL}
        target="_blank"
        rel="noopener"
        startIcon={<IconGithub />}
      >
        {t('tr_moreOnGitHub')}
      </Button>
    </Stack>
  );
};

export default ReleaseNotes;
