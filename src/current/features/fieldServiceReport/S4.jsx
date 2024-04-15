import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import StarsIcon from '@mui/icons-material/Stars';
import Typography from '@mui/material/Typography';
import S4Field from './S4Field';
import { S21s } from '../../classes/S21s';
import { refreshReportState } from '../../states/report';
import { Persons } from '../../classes/Persons';
import { ServiceYear } from '../../classes/ServiceYear';
import { LateReports } from '../../classes/LateReports';
import { S1s } from '../../classes/S1s';

const sharedStyles = {
  chip: {
    margin: '2px',
    backgroundColor: 'black',
    color: 'white',
    padding: '8px 5px 5px 5px',
  },
};

const S4 = ({ serviceYear, month, person }) => {
  const { t } = useTranslation('ui');

  const [refresh, setRefresh] = useRecoilState(refreshReportState);

  const [placements, setPlacements] = useState('');
  const [videos, setVideos] = useState('');
  const [hours, setHours] = useState('');
  const [hourCredit, setHourCredit] = useState('');
  const [returnVisits, setReturnVisits] = useState('');
  const [bibleStudies, setBibleStudies] = useState('');
  const [comments, setComments] = useState('');
  const [hourLess, setHourLess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hourCreditInvalid, setHourCreditInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canAuxPioneer, setCanAuxPioneer] = useState(false);
  const [isAuxPioneer, setIsAuxPioneer] = useState(false);
  const [isElder, setIsElder] = useState(false);
  const [isMS, setIsMS] = useState(false);
  const [isBaptized, setIsBaptized] = useState(false);
  const [isRegPioneer, setIsRegPioneer] = useState(false);
  const [isSpecialPioneer, setIsSpecialPioneer] = useState(false);
  const [latePossible, setLatePossible] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCheck, setLockCheck] = useState(false);

  const handleLateSwitch = async (checked) => {
    setIsLate(checked);

    if (checked) {
      await LateReports.add(person, month);
      if (isLocked) setIsLocked(false);
    }

    if (!checked) {
      await LateReports.remove(person, month);
      setLockCheck((prev) => !prev);
    }
  };

  const handleSetAuxiliaryPioneer = async () => {
    const startDate = new Date(month);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const currentPerson = Persons.get(person);
    await currentPerson.setAuxiliaryPioneer(startDate, endDate);
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    if (serviceYear !== ServiceYear.getCurrent().uid) {
      setLatePossible(true);
      return;
    }

    if (serviceYear === ServiceYear.getCurrent().uid) {
      const currentMonth = ServiceYear.currentReportMonth();

      const currentDate = new Date(currentMonth);
      const selectedDate = new Date(month);

      if (selectedDate > currentDate) {
        setLatePossible(false);
        return;
      }

      if (month !== currentMonth) {
        setLatePossible(true);
        return;
      }

      const S1 = S1s.get(month);

      if (S1) {
        if (S1.isSubmitted()) {
          setLatePossible(true);
          return;
        }
      }

      if (new Date().getDate() > 20) {
        setLatePossible(false);
      } else {
        setLatePossible(true);
      }
    }
  }, [serviceYear, month]);

  useEffect(() => {
    const currentS21 = S21s.get(serviceYear, person);
    if (currentS21) {
      const currentMonth = currentS21.months.find((item) => item.month_value === month);
      setIsLate(currentS21.hasLateReport(month));
      setPlacements(currentMonth.placements);
      setVideos(currentMonth.videos);
      if (currentMonth.minutes !== '') {
        setHours(currentMonth.minutes);
        setHourLess(true);
      }
      if (currentMonth.hours !== '') {
        setHours(currentMonth.hours);
      }
      setHourCredit(currentMonth.hourCredit);
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
    setHourCreditInvalid(false);

    if (isRegPioneer) {
      if (hours !== '' && hourCredit !== '') {
        const total = +hours + +hourCredit;
        if (total > 55) setHourCreditInvalid(true);
      }
    }
  }, [isRegPioneer, hours, hourCredit]);

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

  useEffect(() => {
    if (month) {
      setIsLocked(false);
      const currentReport = S1s.get(month);
      if (currentReport) {
        setIsLocked(currentReport.details.isSubmitted);
      }
    }
  }, [month, lockCheck]);

  return (
    <Box>
      {!isLoading && (
        <Box>
          <Box sx={{ marginBottom: '20px' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px', alignItems: 'center', gap: '10px' }}>
              <Box>
                {isElder && <Chip label={t('elder')} size="small" sx={sharedStyles.chip} />}
                {isMS && <Chip label={t('ministerialServant')} size="small" sx={sharedStyles.chip} />}
                {isSpecialPioneer && <Chip label={t('specialPioneer')} size="small" sx={sharedStyles.chip} />}
                {isRegPioneer && <Chip label={t('regularPioneer')} size="small" sx={sharedStyles.chip} />}
                {isAuxPioneer && <Chip label={t('auxiliaryPioneer')} size="small" sx={sharedStyles.chip} />}
                {isBaptized && !isElder && !isMS && !isSpecialPioneer && !isRegPioneer && !isAuxPioneer && (
                  <Chip label={t('baptized')} size="small" sx={sharedStyles.chip} />
                )}
              </Box>
              {latePossible && (
                <FormControlLabel
                  control={<Checkbox />}
                  label={t('lateReport')}
                  checked={isLate}
                  onChange={(e) => handleLateSwitch(e.target.checked)}
                  sx={{ '.MuiFormControlLabel-label': { lineHeight: 1.2 } }}
                />
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
              isLocked={isLocked}
            />
            <S4Field
              field="videos"
              serviceYear={serviceYear}
              month={month}
              person={person}
              initialValue={videos}
              isLocked={isLocked}
            />
            <S4Field
              field="hours"
              serviceYear={serviceYear}
              month={month}
              person={person}
              initialValue={hours}
              hourLess={hourLess}
              setHourLess={(value) => setHourLess(value)}
              latePossible={latePossible}
              isLocked={isLocked}
            />
            {isRegPioneer && (
              <S4Field
                field="hourCredit"
                serviceYear={serviceYear}
                month={month}
                person={person}
                initialValue={hourCredit}
                errorField={hourCreditInvalid}
                isLocked={isLocked}
              />
            )}

            {hourCreditInvalid && (
              <Typography color="error" sx={{ fontSize: '14px' }}>
                {t('totalHoursInvalid')}
              </Typography>
            )}

            <S4Field
              field="returnVisits"
              serviceYear={serviceYear}
              month={month}
              person={person}
              initialValue={returnVisits}
              errorField={hasError}
              isLocked={isLocked}
            />
            <S4Field
              field="bibleStudies"
              serviceYear={serviceYear}
              month={month}
              person={person}
              initialValue={bibleStudies}
              errorField={hasError}
              isLocked={isLocked}
            />

            {hasError && (
              <Typography color="error" sx={{ fontSize: '14px' }}>
                {t('lessReturnVisitsError')}
              </Typography>
            )}

            <S4Field
              field="comments"
              serviceYear={serviceYear}
              month={month}
              person={person}
              initialValue={comments}
              isLocked={isLocked}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default S4;
