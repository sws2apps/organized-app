import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import SpeakerTalk from './SpeakerTalk';
import { refreshScreenState } from '../../states/main';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { generateDisplayName } from '../../utils/person';
import { Setting } from '../../classes/Setting';

const IncomingSpeaker = ({ isNew, speaker, cong_number }) => {
  const { t } = useTranslation('ui');

  const [screenRefresh, setScreenRefresh] = useRecoilState(refreshScreenState);

  const [speakerName, setSpeakerName] = useState('');
  const [speakerDisplayName, setSpeakerDisplayName] = useState('');
  const [speakerIsElder, setSpeakerIsElder] = useState(false);
  const [speakerIsMS, setSpeakerIsMS] = useState(false);
  const [speakerEmail, setSpeakerEmail] = useState('');
  const [speakerPhone, setSpeakerPhone] = useState('');

  const isEditor = Setting.cong_role.includes('public_talk_coordinator');
  const readOnly = speaker ? !speaker.is_local : isEditor ? false : true;

  const handleCancel = () => {
    if (isNew) {
      setSpeakerName('');
      setSpeakerDisplayName('');
      setSpeakerIsElder(false);
      setSpeakerIsMS(false);
      setSpeakerEmail('');
      setSpeakerPhone('');
    }
  };

  const handleNameChange = async (value) => {
    setSpeakerName(value);

    const tmp = generateDisplayName(value);
    setSpeakerDisplayName(tmp);

    if (!isNew) {
      await VisitingSpeakers.updateSpeakerDetails({
        cong_number: cong_number,
        person_uid: speaker.person_uid,
        fieldName: 'person_name',
        fieldValue: value,
      });

      await VisitingSpeakers.updateSpeakerDetails({
        cong_number: cong_number,
        person_uid: speaker.person_uid,
        fieldName: 'person_displayName',
        fieldValue: tmp,
      });
    }
  };

  const handleDisplayNameChange = async (value) => {
    setSpeakerDisplayName(value);

    if (!isNew) {
      await VisitingSpeakers.updateSpeakerDetails({
        cong_number: cong_number,
        person_uid: speaker.person_uid,
        fieldName: 'person_displayName',
        fieldValue: value,
      });
    }
  };

  const handleElderCheck = async (value) => {
    setSpeakerIsElder(value);
    setSpeakerIsMS(!value);

    if (!isNew) {
      await VisitingSpeakers.updateSpeakerDetails({
        cong_number: cong_number,
        person_uid: speaker.person_uid,
        fieldName: 'is_elder',
        fieldValue: value,
      });

      await VisitingSpeakers.updateSpeakerDetails({
        cong_number: cong_number,
        person_uid: speaker.person_uid,
        fieldName: 'is_ms',
        fieldValue: !value,
      });
    }
  };

  const handleMSCheck = async (value) => {
    setSpeakerIsMS(value);
    setSpeakerIsElder(!value);

    if (!isNew) {
      await VisitingSpeakers.updateSpeakerDetails({
        cong_number: cong_number,
        person_uid: speaker.person_uid,
        fieldName: 'is_ms',
        fieldValue: value,
      });

      await VisitingSpeakers.updateSpeakerDetails({
        cong_number: cong_number,
        person_uid: speaker.person_uid,
        fieldName: 'is_elder',
        fieldValue: !value,
      });
    }
  };

  const handleEmailChange = async (value) => {
    setSpeakerEmail(value);

    if (!isNew) {
      await VisitingSpeakers.updateSpeakerDetails({
        cong_number: cong_number,
        person_uid: speaker.person_uid,
        fieldName: 'email',
        fieldValue: value,
      });
    }
  };

  const handlePhoneChange = async (value) => {
    setSpeakerPhone(value);

    if (!isNew) {
      await VisitingSpeakers.updateSpeakerDetails({
        cong_number: cong_number,
        person_uid: speaker.person_uid,
        fieldName: 'phone',
        fieldValue: value,
      });
    }
  };

  const handleAddSpeaker = async () => {
    await VisitingSpeakers.add({
      is_self: false,
      person_uid: window.crypto.randomUUID(),
      person_name: speakerName,
      person_displayName: speakerDisplayName,
      is_elder: speakerIsElder,
      is_ms: speakerIsMS,
      cong_number: cong_number,
      email: speakerEmail,
      phone: speakerPhone,
    });

    handleCancel();
    setScreenRefresh((prev) => !prev);
  };

  const handleDeleteSpeaker = async () => {
    await VisitingSpeakers.deleteSpeaker({
      person_uid: speaker.person_uid,
      cong_number: speaker.cong_number,
    });
    setScreenRefresh((prev) => !prev);
  };

  useEffect(() => {
    if (speaker) {
      setSpeakerName(speaker.person_name);
      setSpeakerDisplayName(speaker.person_displayName);
      setSpeakerIsElder(speaker.is_elder);
      setSpeakerIsMS(speaker.is_ms);
      setSpeakerEmail(speaker.email);
      setSpeakerPhone(speaker.phone);
    }
  }, [speaker, screenRefresh]);

  return (
    <Box sx={{ borderBottom: isNew ? '' : '2px outset', padding: '20px 0 15px 0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <TextField
          label={t('name')}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: '320px' }}
          InputProps={{ readOnly }}
          value={speakerName}
          onChange={(e) => handleNameChange(e.target.value)}
        />
        <TextField
          label={t('displayName')}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: '190px' }}
          InputProps={{ readOnly }}
          value={speakerDisplayName}
          onChange={(e) => handleDisplayNameChange(e.target.value)}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
          <FormControlLabel
            control={<Checkbox />}
            label={t('elder')}
            checked={speakerIsElder}
            onChange={readOnly ? null : (e) => handleElderCheck(e.target.checked)}
            sx={{ '.MuiFormControlLabel-label': { lineHeight: 1.2 } }}
          />
          <FormControlLabel
            control={<Checkbox />}
            label={t('ministerialServant')}
            checked={speakerIsMS}
            onChange={readOnly ? null : (e) => handleMSCheck(e.target.checked)}
            sx={{ '.MuiFormControlLabel-label': { lineHeight: 1.2 } }}
          />
        </Box>
      </Box>
      <Box sx={{ marginTop: '15px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <TextField
          label={t('email')}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: '300px' }}
          InputProps={{ readOnly }}
          value={speakerEmail}
          onChange={(e) => handleEmailChange(e.target.value)}
        />
        <TextField
          label={t('phoneNumber')}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: '210px' }}
          InputProps={{ readOnly }}
          value={speakerPhone}
          onChange={(e) => handlePhoneChange(e.target.value)}
        />
      </Box>

      {!isNew && (
        <Box sx={{ marginTop: '15px' }}>
          <SpeakerTalk speaker={speaker} readOnly={readOnly} />

          {!readOnly && (
            <Button
              sx={{ marginTop: '15px' }}
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleDeleteSpeaker}
            >
              {t('delete')}
            </Button>
          )}
        </Box>
      )}

      {isNew && (
        <Box sx={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<AddCircleIcon />}
            onClick={handleAddSpeaker}
            disabled={speakerName === '' || speakerDisplayName === '' || (!speakerIsElder && !speakerIsMS)}
          >
            {t('add')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default IncomingSpeaker;
