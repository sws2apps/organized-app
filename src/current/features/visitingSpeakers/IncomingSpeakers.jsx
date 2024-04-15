import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IncomingSpeaker from './IncomingSpeaker';
import { refreshScreenState } from '../../states/main';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { Setting } from '../../classes/Setting';

const IncomingSpeakers = ({ cong }) => {
  const { t } = useTranslation('ui');

  const screenRefresh = useRecoilValue(refreshScreenState);

  const [speakers, setSpeakers] = useState([]);

  const isEditor = Setting.cong_role.includes('public_talk_coordinator');

  useEffect(() => {
    const tmpSpeakers = VisitingSpeakers.getSpeakers(cong.cong_number);
    setSpeakers(tmpSpeakers);
  }, [screenRefresh, cong.cong_number]);

  return (
    <Box>
      {cong.request_status === 'pending' && <Typography>{t('visitingSpeakersRequestPending')}</Typography>}

      {cong.request_status === 'disapproved' && <Typography>{t('visitingSpeakersRequestDisapproved')}</Typography>}

      {/* Speakers List */}
      {speakers.map((speaker) => (
        <IncomingSpeaker key={speaker.person_uid} speaker={speaker} cong_number={cong.cong_number} />
      ))}

      {/* Speaker Add  */}
      {isEditor && cong.is_local && <IncomingSpeaker isNew={true} cong_number={cong.cong_number} />}
    </Box>
  );
};

export default IncomingSpeakers;
