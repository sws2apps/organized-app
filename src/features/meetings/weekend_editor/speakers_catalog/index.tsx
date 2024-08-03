import { Box, TableCell, TableContainer, TableRow } from '@mui/material';
import { IconClose } from '@components/icons';
import { SpeakersCatalogType } from './index.types';
import { Table, TableBody, TableHead } from './index.styles';
import { useAppTranslation } from '@hooks/index';
import useSpeakersCatalog from './useSpeakersCatalog';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import SearchBar from '@components/search_bar';
import Typography from '@components/typography';
import { speakerGetDisplayName } from '@utils/common';

const SpeakersCatalog = (props: SpeakersCatalogType) => {
  const { t } = useAppTranslation();

  const {
    talks,
    count,
    useDisplayName,
    fullnameOption,
    handleSelectSpeaker,
    handleSearchChange,
    search,
  } = useSpeakersCatalog(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '4px',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography className="h3">{t('tr_speakersCatalog')}</Typography>
            <Typography className="h4" color="var(--grey-400)">
              {t('tr_speakersWithCount', { speakersCount: count })}
            </Typography>
          </Box>
          <Typography color="var(--grey-400)">
            {props.type === 'visitingSpeaker'
              ? t('tr_speakersCatalogVisitingDesc')
              : t('tr_speakersCatalogLocalDesc')}
          </Typography>
        </Box>

        <IconButton sx={{ padding: 0 }} onClick={props.onClose}>
          <IconClose color="var(--grey-400)" />
        </IconButton>
      </Box>

      <SearchBar
        placeholder={t('tr_search')}
        value={search}
        onSearch={handleSearchChange}
      />

      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--white)' }}>
              <TableCell>
                <Typography
                  className={'body-small-regular'}
                  color={'var(--grey-350)'}
                >
                  {t('tr_shortNumberLabel')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  className={'body-small-regular'}
                  color={'var(--grey-350)'}
                >
                  {t('tr_title')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  className={'body-small-regular'}
                  color={'var(--grey-350)'}
                >
                  {t('tr_speaker')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {talks.map((talk) => (
              <TableRow key={talk.talk_number}>
                <TableCell>
                  <Typography>{talk.talk_number}</Typography>
                </TableCell>
                <TableCell>
                  <Typography className="body-small-regular">
                    {talk.talk_title}
                  </Typography>
                </TableCell>
                <TableCell>
                  {talk.speakers.map((speaker) => (
                    <Typography
                      key={speaker.person_uid}
                      className="body-small-regular"
                      onClick={() => handleSelectSpeaker(talk, speaker)}
                      sx={{
                        padding: '2px 4px',
                        borderRadius: 'var(--radius-s)',
                        userSelect: 'none',
                        '&:hover': {
                          backgroundColor: 'var(--accent-150)',
                          color: 'var(--accent-main)',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      {speakerGetDisplayName(
                        speaker,
                        useDisplayName,
                        fullnameOption
                      )}
                    </Typography>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
};

export default SpeakersCatalog;
