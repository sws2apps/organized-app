import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AccordionExtended from '../components/AccordingExtended';
import {
  CongregationAdd,
  IncomingCongregationsHeader,
  IncomingSpeakers,
  LocalSpeakers,
  VisitingSpeakersHeader,
} from '../features/visitingSpeakers';
import { Setting } from '../classes/Setting';
import { refreshScreenState } from '../states/main';
import { VisitingSpeakers as Speakers } from '../classes/VisitingSpeakers';
import { congSpeakersRequestsStatusState } from '../states/congregation';

const VisitingSpeakers = () => {
  const { t } = useTranslation('ui');

  const [screenRefresh, setScreenRefresh] = useRecoilState(refreshScreenState);

  const congSpeakersRequests = useRecoilValue(congSpeakersRequestsStatusState);

  const [expanded, setExpanded] = useState('');
  const [isCongregationAdd, setIsCongregationAdd] = useState(false);
  const [congsList, setCongsList] = useState([]);
  const [speakersAccessOpen, setSpeakersAccessOpen] = useState(false);

  const isEditor = Setting.cong_role.includes('public_talk_coordinator');

  const getSelfCong = () => {
    let result;

    const selfCong = Speakers.congregations.find((record) => record.cong_number === +Setting.cong_number);

    if (selfCong) result = selfCong;
    if (!selfCong) result = { cong_name: Setting.cong_name, cong_number: +Setting.cong_number };

    return result;
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleCongregationAdd = () => {
    setExpanded('');
    setIsCongregationAdd(true);
  };

  const handleToggleAccessOpen = (e) => {
    e.stopPropagation();

    setExpanded(Setting.cong_number);
    setSpeakersAccessOpen((prev) => !prev);
  };

  useEffect(() => {
    const congs = Speakers.congregations
      .filter((record) => record.cong_number !== +Setting.cong_number)
      .sort((a, b) => {
        return a.cong_name > b.cong_name ? 1 : -1;
      });
    setCongsList(congs);
  }, [screenRefresh]);

  useEffect(() => {
    const updateRequestsStatus = async () => {
      await Speakers.updateSpeakersRequestsStatus(congSpeakersRequests);
      setScreenRefresh((prev) => !prev);
    };

    updateRequestsStatus();
  }, [congSpeakersRequests, setScreenRefresh]);

  return (
    <Box sx={{ marginBottom: '50px' }}>
      <Typography sx={{ marginBottom: '15px', textTransform: 'uppercase', fontWeight: 'bold' }}>
        {t('visitingSpeakers')}
      </Typography>

      <Box>
        {/* Local Congregation */}
        <AccordionExtended expanded={expanded} content_id={Setting.cong_number} handleChange={handleChange}>
          <AccordionExtended.Summary>
            <VisitingSpeakersHeader
              cong={getSelfCong()}
              isSelf={true}
              handleToggleAccessOpen={handleToggleAccessOpen}
            />
          </AccordionExtended.Summary>
          <AccordionExtended.Details>
            <LocalSpeakers speakersAccessOpen={speakersAccessOpen} />
          </AccordionExtended.Details>
        </AccordionExtended>
      </Box>

      {/* Incoming Congregations */}
      {isEditor && (
        <>
          <IncomingCongregationsHeader handleCongregationAdd={handleCongregationAdd} />

          <CongregationAdd isOpen={isCongregationAdd} setOpen={setIsCongregationAdd} />
        </>
      )}

      {/* Incoming Congregations List */}
      <Box sx={{ marginTop: '20px' }}>
        {congsList.map((cong) => (
          <AccordionExtended
            key={cong.cong_number}
            expanded={expanded}
            content_id={cong.cong_number}
            handleChange={handleChange}
          >
            <AccordionExtended.Summary>
              <VisitingSpeakersHeader cong={cong} />
            </AccordionExtended.Summary>
            <AccordionExtended.Details>
              <IncomingSpeakers cong={cong} />
            </AccordionExtended.Details>
          </AccordionExtended>
        ))}
      </Box>
    </Box>
  );
};

export default VisitingSpeakers;
