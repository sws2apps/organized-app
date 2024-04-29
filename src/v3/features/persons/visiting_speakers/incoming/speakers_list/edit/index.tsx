import { Box, FormControlLabel, RadioGroup } from '@mui/material';
import { IconDelete, IconMale, IconSong } from '@components/icons';
import { IncomingSpeakerEditType } from './index.types';
import { FullnameOption } from '@definition/settings';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useEdit from './useEdit';
import Button from '@components/button';
import Radio from '@components/radio';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const IncomingSpeakerEdit = ({ speaker }: IncomingSpeakerEditType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const {
    fullnameOption,
    displayNameEnabled,
    handleFirstnameChange,
    firstname,
    handleLastnameChange,
    lastname,
    handleToggleGender,
    speakerGender,
  } = useEdit(speaker);

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: tabletDown
            ? fullnameOption === FullnameOption.FIRST_BEFORE_LAST
              ? 'column'
              : 'column-reverse'
            : fullnameOption === FullnameOption.FIRST_BEFORE_LAST
              ? 'row'
              : 'row-reverse',
        }}
      >
        <TextField
          label={t('tr_firstname')}
          styleIcon={false}
          startIcon={fullnameOption === FullnameOption.FIRST_BEFORE_LAST ? <IconMale /> : null}
          value={firstname}
          onChange={(e) => handleFirstnameChange(e.target.value)}
        />
        <TextField
          label={t('tr_lastname')}
          styleIcon={false}
          startIcon={fullnameOption === FullnameOption.LAST_BEFORE_FIRST ? <IconMale /> : null}
          value={lastname}
          onChange={(e) => handleLastnameChange(e.target.value)}
        />
      </Box>

      {displayNameEnabled && <TextField label={t('tr_displayName')} />}

      <RadioGroup
        sx={{ marginLeft: '4px', flexDirection: 'row', gap: tabletDown ? '16px' : '24px', flexWrap: 'wrap' }}
        value={speakerGender}
        onChange={(e) => handleToggleGender(e.target.value)}
      >
        <FormControlLabel value="elder" control={<Radio />} label={<Typography>{t('tr_elder')}</Typography>} />
        <FormControlLabel
          value="ms"
          control={<Radio />}
          label={<Typography>{t('tr_ministerialServant')}</Typography>}
        />
      </RadioGroup>

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: tabletDown ? 'column' : 'row',
        }}
      >
        <TextField label={t('tr_email')} />
        <TextField label={t('tr_phoneNumber')} />
      </Box>

      <TextField label={t('tr_shortNote')} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'space-between',
        }}
      >
        <Button variant="small" startIcon={<IconSong />} sx={{ height: '32px', minHeight: '32px !important' }}>
          {t('tr_songs')}
        </Button>

        <Button
          variant="small"
          color="red"
          startIcon={<IconDelete />}
          sx={{ height: '32px', minHeight: '32px !important', justifySelf: 'flex-end' }}
        >
          {t('tr_delete')}
        </Button>
      </Box>
    </Box>
  );
};

export default IncomingSpeakerEdit;
