import Dialog from '@components/dialog';
import { InitialSetupModalWindowProps } from './initial_setup_modal_window.types';
import Typography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import { useState } from 'react';
import {
  Gapped16Box,
  Gapped4Column,
} from './initial_setup_modal_window.styled';
import Switch from '@components/switch';
import Select from '@components/select';
import { MenuItem } from '@mui/material';
import { formatDate } from '@services/dateformat';
import Button from '@components/button';
import TextField from '@components/textfield';
import Radio from '@components/radio';

const InitialSetupModalWindow = (props: InitialSetupModalWindowProps) => {
  const { t } = useAppTranslation();

  const [currentInitialSetupStep, setCurrentInitialSetupStep] = useState(1);

  const [autoSync, setAutoSync] = useState(true);
  const [receivePushNotifications, setReceivePushNotifications] =
    useState(true);
  const [use24hFormat, setUse24hFormat] = useState(true);

  const Step1Switches = () => {
    return (
      <Gapped16Box
        sx={{
          flexDirection: 'column',
        }}
      >
        <Gapped16Box
          sx={{
            alignItems: 'center',
          }}
        >
          <Switch
            checked={autoSync}
            onChange={(e, checked) => {
              setAutoSync(checked);
            }}
          />
          <Gapped4Column>
            <Typography className="body-regular">{t('tr_autoSync')}</Typography>
            <Typography
              className="label-small-regular"
              color={'var(--grey-350)'}
            >
              {t('tr_autoSyncDesc')}
            </Typography>
          </Gapped4Column>
        </Gapped16Box>
        <Gapped16Box
          sx={{
            alignItems: 'center',
          }}
        >
          <Switch
            checked={receivePushNotifications}
            onChange={(e, checked) => {
              setReceivePushNotifications(checked);
            }}
          />
          <Gapped4Column>
            <Typography className="body-regular">
              {t('tr_receivePushNotifications')}
            </Typography>
            <Typography
              className="label-small-regular"
              color={'var(--grey-350)'}
            >
              {t('tr_receivePushNotificationsDesc')}
            </Typography>
          </Gapped4Column>
        </Gapped16Box>
        <Gapped16Box
          sx={{
            alignItems: 'center',
          }}
        >
          <Switch
            checked={use24hFormat}
            onChange={(e, checked) => {
              setUse24hFormat(checked);
            }}
          />
          <Gapped4Column>
            <Typography className="body-regular">
              {t('tr_24hFormat')}
            </Typography>
          </Gapped4Column>
        </Gapped16Box>
      </Gapped16Box>
    );
  };

  const [weekStartDay, setWeekStartDay] = useState('');
  const [dateFormat, setDateFormat] = useState('');
  const [nameFormat, setNameFormat] = useState('');

  const handleWeekStartDaySelectChange = (event) => {
    setWeekStartDay(event.target.value);
  };

  const handleDateFormatSelectChange = (event) => {
    setDateFormat(event.target.value);
  };

  const handleNameFormatSelectChange = (event) => {
    setNameFormat(event.target.value);
  };

  const todayDate = new Date();

  const Step1SelectFields = () => {
    return (
      <Gapped16Box
        sx={{
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Select
          label={t('tr_weekStartDay')}
          value={weekStartDay}
          onChange={handleWeekStartDaySelectChange}
        >
          <MenuItem value={t('tr_saturday')}>{t('tr_saturday')}</MenuItem>
          <MenuItem value={t('tr_sunday')}>{t('tr_sunday')}</MenuItem>
          <MenuItem value={t('tr_monday')}>{t('tr_monday')}</MenuItem>
        </Select>

        <Select
          label={t('tr_dateFormatSelect')}
          value={dateFormat}
          onChange={handleDateFormatSelectChange}
        >
          <MenuItem value={'dd.MM.yyyy'}>
            {formatDate(todayDate, 'dd.MM.yyyy')}
          </MenuItem>
          <MenuItem value={'MM/dd/yyyy'}>
            {formatDate(todayDate, 'MM/dd/yyyy')}
          </MenuItem>
          <MenuItem value={'yyyy-MM-dd'}>
            {formatDate(todayDate, 'yyyy-MM-dd')}
          </MenuItem>
        </Select>

        <Select
          label={t('tr_nameFormat')}
          value={nameFormat}
          onChange={handleNameFormatSelectChange}
        >
          <MenuItem value={t('tr_firstLast')}>{t('tr_firstLast')}</MenuItem>
          <MenuItem value={t('tr_lastFirst')}>{t('tr_lastFirst')}</MenuItem>
        </Select>
      </Gapped16Box>
    );
  };

  const [gender, setGender] = useState('male');

  const Step2SelectFields = () => {
    return (
      <Gapped16Box
        sx={{
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Gapped16Box
          sx={{
            width: '100%',
          }}
        >
          <TextField label={t('tr_firstname')} required />
          <TextField label={t('tr_lastname')} required />
        </Gapped16Box>
        <Gapped16Box
          sx={{
            gap: '24px !important',
          }}
        >
          <Gapped16Box sx={{ gap: '4px !important', alignItems: 'center' }}>
            <Radio
              checked={gender === 'male'}
              onChange={() => setGender('male')}
            />
            <Typography className="body-regular" color={'var(--black)'}>
              {t('tr_male')}
            </Typography>
          </Gapped16Box>
          <Gapped16Box sx={{ gap: '4px !important', alignItems: 'center' }}>
            <Radio
              checked={gender === 'female'}
              onChange={() => setGender('female')}
            />
            <Typography className="body-regular" color={'var(--black)'}>
              {t('tr_female')}
            </Typography>
          </Gapped16Box>
        </Gapped16Box>
      </Gapped16Box>
    );
  };

  return (
    <Dialog
      open={props.isOpen}
      onClose={null}
      sx={{
        display: 'flex',
        gap: '24px',
        padding: '24px',
      }}
    >
      <Gapped16Box
        sx={{
          flexDirection: 'column',
        }}
      >
        <Typography className="h2">
          {t('tr_initialOrganizedSetupTitle')}
        </Typography>
        <Typography className="body-regular" color={'var(--grey-400)'}>
          {t('tr_initialOrganizedSetupDescStep_' + currentInitialSetupStep)}
        </Typography>
      </Gapped16Box>

      {currentInitialSetupStep === 1 ? (
        <>
          <Step1Switches />
          <Step1SelectFields />
        </>
      ) : (
        <Step2SelectFields />
      )}
      <Gapped4Column sx={{ gap: '8px', width: '100%' }}>
        <Button
          variant="main"
          onClick={() => {
            if (currentInitialSetupStep === 1) {
              setCurrentInitialSetupStep(2);
            } else {
              // let hasError = false;
              // if (firstName === '') {
              //   setFirstNameError(true);
              //   hasError = true;
              // } else {
              //   setFirstNameError(false);
              // }
              // if (lastName === '') {
              //   setLastNameError(true);
              //   hasError = true;
              // } else {
              //   setLastNameError(false);
              // }
              // if (!hasError) {
              //   // Proceed with your next action
              // }
            }
          }}
        >
          {currentInitialSetupStep === 1
            ? t('tr_saveAndContinueBtn')
            : t('tr_done')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (currentInitialSetupStep === 1) {
              setCurrentInitialSetupStep(2);
            } else {
              setCurrentInitialSetupStep(1);
            }
          }}
        >
          {currentInitialSetupStep === 1
            ? t('tr_skipThisStepBtn')
            : t('tr_back')}
        </Button>
      </Gapped4Column>
    </Dialog>
  );
};

export default InitialSetupModalWindow;
