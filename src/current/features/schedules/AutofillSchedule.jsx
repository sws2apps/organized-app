import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import {
  currentScheduleState,
  currentWeekSchedState,
  dlgAutoFillOpenState,
  isAutoFillSchedState,
  reloadWeekSummaryState,
} from '../../states/schedule';
import { checkAYFExplainingBeliefsAssignment, checkCBSReader, fetchScheduleInfo } from '../../utils/sourceMaterial';
import { selectRandomPerson, saveAssignment } from '../../utils/schedule';
import { Sources } from '../../classes/Sources';
import { Schedules } from '../../classes/Schedules';
import { Setting } from '../../classes/Setting';

const AutofillSchedule = () => {
  const { t } = useTranslation('ui');

  const [dlgAutofillOpen, setDlgAutofillOpen] = useRecoilState(dlgAutoFillOpenState);

  const setReloadWeekSummary = useSetRecoilState(reloadWeekSummaryState);

  const isAutofillSched = useRecoilValue(isAutoFillSchedState);
  const currentSchedule = useRecoilValue(currentScheduleState);
  const currentWeek = useRecoilValue(currentWeekSchedState);

  const [totalToAssign, setTotalToAssign] = useState(0);
  const [assigned, setAssigned] = useState(0);
  const [isAssigning, setIsAssigning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [weeks, setWeeks] = useState([]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setDlgAutofillOpen(false);
  };

  const fetchInfoToAssign = useCallback(() => {
    const { weeks, total } = fetchScheduleInfo(isAutofillSched, currentSchedule, currentWeek);
    setWeeks(weeks);
    setTotalToAssign(total);
  }, [currentSchedule, currentWeek, isAutofillSched]);

  const handleAssignSchedule = async () => {
    setIsAssigning(true);

    const { class_count, opening_prayer_MM_autoAssign } = Setting;

    // Assign Chairman
    for await (const item of weeks) {
      const week = item.value;
      const schedData = Schedules.get(week);

      if (schedData.noMMeeting === false) {
        // Main Hall
        if (schedData.chairmanMM_A === '') {
          const selected = selectRandomPerson({ assType: 110, week });
          if (selected) {
            await saveAssignment(week, selected, 'chairmanMM_A');
            setAssigned((prev) => prev + 1);
          }
        }

        // Aux Class
        if (class_count === 2 && schedData.week_type === 1 && schedData.chairmanMM_B === '') {
          const selected = selectRandomPerson({ assType: 110, week });
          if (selected) {
            await saveAssignment(week, selected, 'chairmanMM_B');
            setAssigned((prev) => prev + 1);
          }
        }
      }
    }

    // Assign CBS Conductor
    for await (const item of weeks) {
      const week = item.value;
      const schedData = Schedules.get(week);

      if (schedData.noMMeeting === false && schedData.week_type === 1 && schedData.cbs_conductor === '') {
        // Conductor
        const selected = selectRandomPerson({ assType: 115, week });
        if (selected) {
          await saveAssignment(week, selected, 'cbs_conductor');
          setAssigned((prev) => prev + 1);
        }
      }
    }

    for await (const item of weeks) {
      const week = item.value;
      const currentSource = Sources.get(week);
      const sourceData = currentSource.local();
      const schedData = Schedules.get(week);

      if (schedData.noMMeeting === false) {
        // Assign TGW Talk
        if (schedData.tgw_talk === '') {
          const selected = selectRandomPerson({ assType: 112, week });
          if (selected) {
            await saveAssignment(week, selected, 'tgw_talk');
            setAssigned((prev) => prev + 1);
          }
        }

        // Assign TGW Spiritual Gems
        if (schedData.tgw_gems === '') {
          const selected2 = selectRandomPerson({ assType: 113, week });
          if (selected2) {
            await saveAssignment(week, selected2, 'tgw_gems');
            setAssigned((prev) => prev + 1);
          }
        }

        const noAssignLC1 = currentSource.noAssignLC1();
        const isElderPartLC1 = currentSource.isElderPartLC1();

        if (!noAssignLC1 && schedData.lc_part1 === '') {
          // Assign LC Part 1
          const selected = selectRandomPerson({ assType: 114, week, isLC: true, isElderPart: isElderPartLC1 });
          if (selected) {
            await saveAssignment(week, selected, 'lc_part1');
            setAssigned((prev) => prev + 1);
          }
        }

        // Assign LC Part 2
        let isAssignLC2 = false;
        const noAssignLC2 = currentSource.noAssignLC2();
        const isElderPartLC2 = currentSource.isElderPartLC2();

        if (sourceData.mwb_lc_count_override === 0 && sourceData.mwb_lc_count === 2) {
          isAssignLC2 = !noAssignLC2;
        }
        if (sourceData.mwb_lc_count_override !== 0 && sourceData.mwb_lc_count_override === 2) {
          isAssignLC2 = !noAssignLC2;
        }

        if (isAssignLC2 && schedData.lc_part2 === '') {
          const selected = selectRandomPerson({ assType: 114, week, isLC: true, isElderPart: isElderPartLC2 });
          if (selected) {
            await saveAssignment(week, selected, 'lc_part2');
            setAssigned((prev) => prev + 1);
          }
        }

        // Assign CBS Reader
        if (schedData.week_type === 1) {
          const noAssignCBSReader = checkCBSReader(sourceData.mwb_lc_cbs);
          if (!noAssignCBSReader && schedData.cbs_reader === '') {
            const selected = selectRandomPerson({ assType: 116, week });
            if (selected) {
              await saveAssignment(week, selected, 'cbs_reader');
              setAssigned((prev) => prev + 1);
            }
          }
        }

        if (!opening_prayer_MM_autoAssign && schedData.opening_prayerMM === '') {
          // Assign Opening Prayer
          const selected = selectRandomPerson({ assType: 111, week });
          if (selected) {
            await saveAssignment(week, selected, 'opening_prayerMM');
            setAssigned((prev) => prev + 1);
          }
        }

        // Assign Closing Prayer
        if (schedData.closing_prayerMM === '') {
          const selected3 = selectRandomPerson({ assType: 111, week });
          if (selected3) {
            await saveAssignment(week, selected3, 'closing_prayerMM');
            setAssigned((prev) => prev + 1);
          }
        }

        // Assign Bible Reading Main Hall
        if (schedData.bRead_stu_A === '') {
          const selected4 = selectRandomPerson({ assType: 100, week, assClass: 'A' });
          if (selected4) {
            await saveAssignment(week, selected4, 'bRead_stu_A');
            setAssigned((prev) => prev + 1);
          }
        }

        // Assign Bible Reading Aux Class
        if (class_count === 2 && schedData.week_type === 1 && schedData.bRead_stu_B === '') {
          const selected = selectRandomPerson({ assType: 100, week, assClass: 'B' });
          if (selected) {
            await saveAssignment(week, selected, 'bRead_stu_B');
            setAssigned((prev) => prev + 1);
          }
        }

        // Assign AYF Student
        let fldName = '';
        let fldType = '';

        for await (const a of [1, 2, 3, 4]) {
          fldType = 'mwb_ayf_part' + a + '_type';
          const assType = sourceData[fldType];

          // Main Hall

          if (
            assType === 101 ||
            assType === 102 ||
            assType === 103 ||
            assType === 104 ||
            assType === 108 ||
            (assType >= 140 && assType < 170) ||
            (assType >= 170 && assType < 200) ||
            assType === 123 ||
            assType === 124 ||
            assType === 125 ||
            assType === 126 ||
            assType === 127
          ) {
            fldName = 'ass' + a + '_stu_A';

            if (schedData[fldName] === '') {
              const selected = selectRandomPerson({ assType, week, assClass: 'A' });
              if (selected) {
                await saveAssignment(week, selected, fldName);
                setAssigned((prev) => prev + 1);
              }
            }
          }

          // Aux Class
          if (class_count === 2 && schedData.week_type === 1) {
            if (
              assType === 101 ||
              assType === 102 ||
              assType === 103 ||
              assType === 104 ||
              assType === 108 ||
              (assType >= 140 && assType < 170) ||
              (assType >= 170 && assType < 200) ||
              assType === 123 ||
              assType === 124 ||
              assType === 125 ||
              assType === 126
            ) {
              fldName = 'ass' + a + '_stu_B';

              if (schedData[fldName] === '') {
                const selected = selectRandomPerson({ assType, week, assClass: 'B' });
                if (selected) {
                  await saveAssignment(week, selected, fldName);
                  setAssigned((prev) => prev + 1);
                }
              }
            }
          }
        }

        // Assign AYF Assistant
        for await (const a of [1, 2, 3, 4]) {
          fldType = 'mwb_ayf_part' + a + '_type';
          const assType = sourceData[fldType];

          const fldSrc = 'mwb_ayf_part' + a;
          const assSrc = sourceData[fldSrc];
          let isAYFExplainTalk = false;

          if (assType === 126) {
            isAYFExplainTalk = checkAYFExplainingBeliefsAssignment(assSrc);
          }

          // Main Hall
          if (
            assType === 101 ||
            assType === 102 ||
            assType === 103 ||
            assType === 108 ||
            (assType >= 140 && assType < 170) ||
            (assType >= 170 && assType < 200) ||
            assType === 123 ||
            assType === 124 ||
            assType === 125 ||
            (assType === 126 && !isAYFExplainTalk)
          ) {
            fldName = 'ass' + a + '_stu_A';
            const stuA = schedData[fldName];

            fldName = 'ass' + a + '_ass_A';

            if (schedData[fldName] === '') {
              const selected = selectRandomPerson({ assType: 'isAssistant', week, mainStudent: stuA, assClass: 'A' });
              if (selected) {
                await saveAssignment(week, selected, fldName);
                setAssigned((prev) => prev + 1);
              }
            }
          }

          // Aux Class
          if (class_count === 2 && schedData.week_type === 1) {
            if (
              assType === 101 ||
              assType === 102 ||
              assType === 103 ||
              assType === 108 ||
              (assType >= 140 && assType < 170) ||
              (assType >= 170 && assType < 200) ||
              assType === 123 ||
              assType === 124 ||
              assType === 125 ||
              (assType === 126 && !isAYFExplainTalk)
            ) {
              fldName = 'ass' + a + '_stu_B';
              const stuB = schedData[fldName];

              fldName = 'ass' + a + '_ass_B';

              if (schedData[fldName] === '') {
                const selected = selectRandomPerson({ assType: 'isAssistant', week, mainStudent: stuB, assClass: 'B' });
                if (selected) {
                  await saveAssignment(week, selected, fldName);
                  setAssigned((prev) => prev + 1);
                }
              }
            }
          }
        }
      }
    }

    setReloadWeekSummary((prev) => {
      return !prev;
    });

    setTimeout(() => {
      setIsAssigning(false);
      setDlgAutofillOpen(false);
    }, [1000]);
  };

  useEffect(() => {
    fetchInfoToAssign();
  }, [fetchInfoToAssign]);

  useEffect(() => {
    const vPg = (assigned * 100) / totalToAssign;
    setProgress(vPg);
  }, [assigned, totalToAssign]);

  return (
    <Box>
      <Dialog open={dlgAutofillOpen} aria-labelledby="dialog-title-autofill-assignment" onClose={handleClose}>
        <DialogTitle id="dialog-title-autofill-assignment">
          <Typography variant="h6" component="p">
            {t('autofill')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {isAutofillSched && (
            <Typography>
              {t('autofillScheduleConfirm', {
                currentSchedule: currentSchedule.label,
              })}
            </Typography>
          )}
          {!isAutofillSched && (
            <Typography>
              {t('autofillWeekConfirm', {
                currentWeek: currentWeek.label,
              })}
            </Typography>
          )}

          {isAssigning && (
            <Box
              sx={{
                display: 'flex',
                gap: '3px',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '20px',
              }}
            >
              <LinearProgress color="success" variant="determinate" value={progress} sx={{ width: '100%' }} />
              <Typography sx={{ fontWeight: 'bold', marginLeft: '25px' }}>{`${assigned}/${totalToAssign}`}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus disabled={isAssigning}>
            {t('no')}
          </Button>
          <Button autoFocus onClick={handleAssignSchedule} color="primary" disabled={isAssigning}>
            {t('autofill')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutofillSchedule;
