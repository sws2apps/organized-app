import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import StarsIcon from '@mui/icons-material/Stars';
import Typography from '@mui/material/Typography';
import S4Field from './S4Field';
import { S21s } from '../../classes/S21s';
import { refreshReportState } from '../../states/report';
import { Persons } from '../../classes/Persons';

const sharedStyles = {
  chip: {
    margin: '2px',
    backgroundColor: 'black',
    color: 'white',
    padding: '5px',
  },
};

const S4 = ({ serviceYear, month, person }) => {
  const { t } = useTranslation('ui');

  const [refresh, setRefresh] = useRecoilState(refreshReportState);

  const [placements, setPlacements] = useState('');
  const [videos, setVideos] = useState('');
  const [hours, setHours] = useState('');
  const [returnVisits, setReturnVisits] = useState('');
  const [bibleStudies, setBibleStudies] = useState('');
  const [comments, setComments] = useState('');
  const [hourLess, setHourLess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canAuxPioneer, setCanAuxPioneer] = useState(false);
  const [isAuxPioneer, setIsAuxPioneer] = useState(false);
  const [isElder, setIsElder] = useState(false);
  const [isMS, setIsMS] = useState(false);
  const [isBaptized, setIsBaptized] = useState(false);
  const [isRegPioneer, setIsRegPioneer] = useState(false);
  const [isSpecialPioneer, setIsSpecialPioneer] = useState(false);

  const handleSetAuxiliaryPioneer = async () => {
    const startDate = new Date(month);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const currentPerson = Persons.get(person);
    await currentPerson.setAuxiliaryPioneer(startDate, endDate);
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    const currentS21 = S21s.get(serviceYear, person);
    if (currentS21) {
      const currentMonth = currentS21.months.find((item) => item.month_value === month);
      setPlacements(currentMonth.placements);
      setVideos(currentMonth.videos);
      if (currentMonth.minutes !== '') {
        setHours(currentMonth.minutes);
        setHourLess(true);
      }
      if (currentMonth.hours !== '') {
        setHours(currentMonth.hours);
      }
      setReturnVisits(currentMonth.returnVisits);
      setBibleStudies(currentMonth.bibleStudies);
      setComments(currentMonth.comments);
    }
  }, [serviceYear, month, person, refresh]);

  useEffect(() => {
    setHasError(false);

    if (bibleStudies !== '' && returnVisits === '') {
      setHasError(true);
      return;
    }

    if (bibleStudies !== '' && returnVisits !== '') {
      if (returnVisits < bibleStudies) {
        setHasError(true);
      }
    }
  }, [returnVisits, bibleStudies]);

  useEffect(() => {
    if (month && person) {
      setIsLoading(true);
      const currentPerson = Persons.get(person);

      const isBaptized = currentPerson.isBaptizedDate(month);
      setIsBaptized(isBaptized);

      const isElder = currentPerson.isElder(month);
      setIsElder(isElder);

      const isMS = currentPerson.isMS(month);
      setIsMS(isMS);

      const isSFTS = currentPerson.isSpecialPioneer(month);
      setIsSpecialPioneer(isSFTS);

      const isFR = currentPerson.isRegularPioneer(month);
      setIsRegPioneer(isFR);

      const isAux = currentPerson.isAuxiliaryPioneer(month);
      setIsAuxPioneer(isAux);

      const canAux = currentPerson.canBeAuxiliaryPioneer(month);
      setCanAuxPioneer(canAux);

      setIsLoading(false);
    }
  }, [month, person, refresh]);

  return (
    <Box>
      {!isLoading && (
        <Box>
          <Box sx={{ marginBottom: '20px' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
              {isElder && <Chip label={t('elder')} size="small" sx={sharedStyles.chip} />}
              {isMS && <Chip label={t('ministerialServant')} size="small" sx={sharedStyles.chip} />}
              {isSpecialPioneer && <Chip label={t('specialPioneer')} size="small" sx={sharedStyles.chip} />}
              {isRegPioneer && <Chip label={t('regularPioneer')} size="small" sx={sharedStyles.chip} />}
              {isAuxPioneer && <Chip label={t('auxiliaryPioneer')} size="small" sx={sharedStyles.chip} />}
              {isBaptized && !isElder && !isMS && !isSpecialPioneer && !isRegPioneer && !isAuxPioneer && (
                <Chip label={t('baptized')} size="small" sx={sharedStyles.chip} />
              )}
            </Box>
            <Box>
              {canAuxPioneer && (
                <Button
                  variant="outlined"
                  startIcon={<StarsIcon />}
                  sx={{ textTransform: 'none' }}
                  onClick={handleSetAuxiliaryPioneer}
                >
                  {t('setAuxiliaryPioneer')}
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <S4Field
              field="placements"
              serviceYear={serviceYear}
              month={month}
              person={person}
              initialValue={placements}
            />
            <S4Field field="videos" serviceYear={serviceYear} month={month} person={person} initialValue={videos} />
            <S4Field
              field="hours"
              serviceYear={serviceYear}
              month={month}
              person={person}
              initialValue={hours}
              initialHourLess={hourLess}
            />
            <S4Field
              field="returnVisits"
              serviceYear={serviceYear}
              month={month}
              person={person}
              initialValue={returnVisits}
              errorField={hasError}
            />
            <S4Field
              field="bibleStudies"
              serviceYear={serviceYear}
              month={month}
              person={person}
              initialValue={bibleStudies}
              errorField={hasError}
            />

            {hasError && (
              <Typography color="error" sx={{ fontSize: '14px' }}>
                {t('lessReturnVisitsError')}
              </Typography>
            )}

            <S4Field field="comments" serviceYear={serviceYear} month={month} person={person} initialValue={comments} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default S4;
