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
import { checkCBSReader, checkLCAssignments, fetchScheduleInfo } from '../../utils/sourceMaterial';
import { openingPrayerAutoAssignState } from '../../states/congregation';
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
  const autoAssignOpeningPrayer = useRecoilValue(openingPrayerAutoAssignState);

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

    // Assign Chairman
    for await (const item of weeks) {
      const week = item.value;
      const schedData = Schedules.get(week);

      if (schedData.noMeeting === false) {
        // Main Hall
        const selected = selectRandomPerson(110, week);
        if (selected) {
          await saveAssignment(week, selected, 'chairmanMM_A');
          setAssigned((prev) => {
            return prev + 1;
          });

          if (autoAssignOpeningPrayer) {
            await saveAssignment(week, selected, 'opening_prayer');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        }

        // Aux Class
        if (Setting.class_count === 2 && schedData.week_type === 1) {
          const selected = selectRandomPerson(110, week);
          if (selected) {
            await saveAssignment(week, selected, 'chairmanMM_B');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        }
      }
    }

    // Assign CBS Conductor
    for await (const item of weeks) {
      const week = item.value;
      const schedData = Schedules.get(week);

      if (schedData.noMeeting === false && schedData.week_type === 1) {
        // Conductor
        const selected = selectRandomPerson(115, week);
        if (selected) {
          await saveAssignment(week, selected, 'cbs_conductor');
          setAssigned((prev) => {
            return prev + 1;
          });
        }
      }
    }

    for await (const item of weeks) {
      const week = item.value;
      const sourceData = Sources.get(week).local();
      const schedData = Schedules.get(week);

      if (schedData.noMeeting === false) {
        // Assign TGW Talk
        const selected = selectRandomPerson(112, week);
        if (selected) {
          await saveAssignment(week, selected, 'tgw_talk');
          setAssigned((prev) => {
            return prev + 1;
          });
        }

        // Assign TGW Spiritual Gems
        const selected2 = selectRandomPerson(113, week);
        if (selected2) {
          await saveAssignment(week, selected2, 'tgw_gems');
          setAssigned((prev) => {
            return prev + 1;
          });
        }

        const noAssignLC1 = checkLCAssignments(sourceData.lcPart1_src);
        if (!noAssignLC1) {
          // Assign LC Part 1
          const selected = selectRandomPerson(114, week);
          if (selected) {
            await saveAssignment(week, selected, 'lc_part1');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        }

        // Assign LC Part 2
        let isAssignLC2 = false;
        if (sourceData.lcCount_override === 0 && sourceData.lcCount === 2) {
          const noAssignLC2 = checkLCAssignments(sourceData.lcPart2_src);
          isAssignLC2 = !noAssignLC2;
        }
        if (sourceData.lcCount_override !== 0 && sourceData.lcCount_override === 2) {
          const noAssignLC2 = checkLCAssignments(sourceData.lcPart2_src_override);
          isAssignLC2 = !noAssignLC2;
        }

        if (isAssignLC2) {
          const selected = selectRandomPerson(114, week);
          if (selected) {
            await saveAssignment(week, selected, 'lc_part2');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        }

        // Assign CBS Reader
        if (schedData.week_type === 1) {
          const noAssignCBSReader = checkCBSReader(sourceData.cbs_src);
          if (!noAssignCBSReader) {
            const selected = selectRandomPerson(116, week);
            if (selected) {
              await saveAssignment(week, selected, 'cbs_reader');
              setAssigned((prev) => {
                return prev + 1;
              });
            }
          }
        }

        if (!autoAssignOpeningPrayer) {
          // Assign Opening Prayer
          const selected = selectRandomPerson(111, week);
          if (selected) {
            await saveAssignment(week, selected, 'opening_prayer');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        }

        // Assign Closing Prayer
        const selected3 = selectRandomPerson(111, week);
        if (selected3) {
          await saveAssignment(week, selected3, 'closing_prayer');
          setAssigned((prev) => {
            return prev + 1;
          });
        }

        // Assign Bible Reading Main Hall
        const selected4 = selectRandomPerson(100, week, undefined, 'A');
        if (selected4) {
          await saveAssignment(week, selected4, 'bRead_stu_A');
          setAssigned((prev) => {
            return prev + 1;
          });
        }

        // Assign Bible Reading Aux Class
        if (Setting.class_count === 2 && schedData.week_type === 1) {
          const selected = selectRandomPerson(100, week, undefined, 'B');
          if (selected) {
            await saveAssignment(week, selected, 'bRead_stu_B');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        }

        // Assign AYF Student
        let fldName = '';
        let fldType = '';

        for await (const a of [1, 2, 3]) {
          fldType = 'ass' + a + '_type';
          const assType = sourceData[fldType];

          // Main Hall
          if (
            assType === 101 ||
            assType === 102 ||
            assType === 103 ||
            assType === 104 ||
            assType === 108 ||
            (assType >= 140 && assType < 170) ||
            (assType >= 170 && assType < 200)
          ) {
            fldName = 'ass' + a + '_stu_A';

            const selected = selectRandomPerson(assType, week, undefined, 'A');
            if (selected) {
              await saveAssignment(week, selected, fldName);
              setAssigned((prev) => {
                return prev + 1;
              });
            }
          }

          // Aux Class
          if (Setting.class_count === 2 && schedData.week_type === 1) {
            if (
              assType === 101 ||
              assType === 102 ||
              assType === 103 ||
              assType === 104 ||
              assType === 108 ||
              (assType >= 140 && assType < 170) ||
              (assType >= 170 && assType < 200)
            ) {
              fldName = 'ass' + a + '_stu_B';

              const selected = selectRandomPerson(assType, week, undefined, 'B');
              if (selected) {
                await saveAssignment(week, selected, fldName);
                setAssigned((prev) => {
                  return prev + 1;
                });
              }
            }
          }
        }

        // Assign AYF Assistant
        for await (const a of [1, 2, 3]) {
          fldType = 'ass' + a + '_type';
          const assType = sourceData[fldType];

          // Main Hall
          if (
            assType === 101 ||
            assType === 102 ||
            assType === 103 ||
            assType === 108 ||
            (assType >= 140 && assType < 170) ||
            (assType >= 170 && assType < 200)
          ) {
            fldName = 'ass' + a + '_stu_A';
            const stuA = schedData[fldName];

            fldName = 'ass' + a + '_ass_A';

            const selected = selectRandomPerson('isAssistant', week, stuA, 'A');
            if (selected) {
              await saveAssignment(week, selected, fldName);
              setAssigned((prev) => {
                return prev + 1;
              });
            }
          }

          // Aux Class
          if (Setting.class_count === 2 && schedData.week_type === 1) {
            if (
              assType === 101 ||
              assType === 102 ||
              assType === 103 ||
              assType === 108 ||
              (assType >= 140 && assType < 170) ||
              (assType >= 170 && assType < 200)
            ) {
              fldName = 'ass' + a + '_stu_B';
              const stuB = schedData[fldName];

              fldName = 'ass' + a + '_ass_B';
              const selected = selectRandomPerson('isAssistant', week, stuB, 'B');
              if (selected) {
                await saveAssignment(week, selected, fldName);
                setAssigned((prev) => {
                  return prev + 1;
                });
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
