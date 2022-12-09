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
import { dbGetSourceMaterial, dbGetWeekListBySched } from '../../indexedDb/dbSourceMaterial';
import { dbCountAssignmentsInfo, dbGetScheduleData } from '../../indexedDb/dbSchedule';
import { dbSaveAss } from '../../indexedDb/dbAssignment';
import { dbGetAppSettings } from '../../indexedDb/dbAppSettings';
import { dbGetPersonsByAssType } from '../../indexedDb/dbPersons';

const AutofillSchedule = () => {
  const { t } = useTranslation();

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

  const fetchInfoToAssign = useCallback(async () => {
    const newData = [];

    if (isAutofillSched) {
      let data = await dbGetWeekListBySched(currentSchedule.value);
      for (let i = 0; i < data.length; i++) {
        const obj = {};
        obj.value = data[i].weekOf;
        newData.push(obj);
      }
    } else {
      newData.push({ value: currentWeek.value });
    }

    setWeeks(newData);

    let cn = 0;
    for (let i = 0; i < newData.length; i++) {
      const week = newData[i].value;
      const { total } = await dbCountAssignmentsInfo(week);
      cn = cn + total;
    }

    setTotalToAssign(cn);
  }, [currentSchedule, currentWeek, isAutofillSched]);

  const handleAssignSchedule = async () => {
    setIsAssigning(true);

    const { class_count } = await dbGetAppSettings();

    for (let i = 0; i < weeks.length; i++) {
      const week = weeks[i].value;

      const schedData = await dbGetScheduleData(week);
      const sourceData = await dbGetSourceMaterial(week);

      if (schedData.noMeeting === false) {
        let students = [];

        // Assign Chairman A
        const autoChairmanA = async () => {
          students = await dbGetPersonsByAssType(110);
          if (students.length > 0) {
            const chairmanA = students[0].person_uid;
            await dbSaveAss(week, chairmanA, 'chairmanMM_A');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        };

        // Assign Chairman B
        const autoChairmanB = async () => {
          if (class_count === 2 && schedData.week_type === 1) {
            students = await dbGetPersonsByAssType(110);
            if (students.length > 0) {
              const chairmanB = students[0].person_uid;
              await dbSaveAss(week, chairmanB, 'chairmanMM_B');
              setAssigned((prev) => {
                return prev + 1;
              });
            }
          }
        };

        // Opening Prayer
        const autoOpeningPrayer = async () => {
          students = await dbGetPersonsByAssType(111);
          if (students.length > 0) {
            const openingPrayer = students[0].person_uid;
            await dbSaveAss(week, openingPrayer, 'opening_prayer');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        };

        // TGW 10 min Talk
        const autoTGWTalk = async () => {
          students = await dbGetPersonsByAssType(112);
          if (students.length > 0) {
            const tgwTalk = students[0].person_uid;
            await dbSaveAss(week, tgwTalk, 'tgw_talk');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        };

        // TGW Spiritual Gems
        const autoTGWGems = async () => {
          students = await dbGetPersonsByAssType(113);
          if (students.length > 0) {
            const tgwGems = students[0].person_uid;
            await dbSaveAss(week, tgwGems, 'tgw_gems');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        };

        // Assign Bible Reading A
        const autoBReadA = async () => {
          students = await dbGetPersonsByAssType(100);
          if (students.length > 0) {
            const stuBReadA = students[0].person_uid;
            await dbSaveAss(week, stuBReadA, 'bRead_stu_A');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        };

        // Assign Bible Reading B
        const autoBReadB = async () => {
          if (class_count === 2 && schedData.week_type === 1) {
            students = await dbGetPersonsByAssType(100);
            if (students.length > 0) {
              const stuBReadB = students[0].person_uid;
              await dbSaveAss(week, stuBReadB, 'bRead_stu_B');
              setAssigned((prev) => {
                return prev + 1;
              });
            }
          }
        };

        // Assign AYF
        const autoAYF = async () => {
          //Assign AYF Main Student
          let fldName = '';
          let fldType = '';

          for (let a = 1; a <= 3; a++) {
            fldType = 'ass' + a + '_type';
            const assType = sourceData[fldType];

            //Assign AYF A
            fldName = 'ass' + a + '_stu_A';
            students = await dbGetPersonsByAssType(assType);
            if (assType === 101 || assType === 102 || assType === 103 || assType === 104 || assType === 108) {
              if (students.length > 0) {
                const stuA = students[0].person_uid;
                await dbSaveAss(week, stuA, fldName);
                setAssigned((prev) => {
                  return prev + 1;
                });
              }
            }

            //Assign AYF B
            if (class_count === 2 && schedData.week_type === 1) {
              fldName = 'ass' + a + '_stu_B';
              students = await dbGetPersonsByAssType(assType);
              if (assType === 101 || assType === 102 || assType === 103 || assType === 104 || assType === 108) {
                if (students.length > 0) {
                  const stuB = students[0].person_uid;
                  await dbSaveAss(week, stuB, fldName);
                  setAssigned((prev) => {
                    return prev + 1;
                  });
                }
              }
            }
          }

          //Assign AYF Assistant
          for (let a = 1; a <= 3; a++) {
            fldType = 'ass' + a + '_type';
            const assType = sourceData[fldType];

            //Assign AYF A Assistant
            if (assType === 101 || assType === 102 || assType === 103 || assType === 108) {
              fldName = 'ass' + a + '_ass_A';
              students = await dbGetPersonsByAssType('isAssistant');
              if (students.length > 0) {
                const assA = students[0].person_uid;
                await dbSaveAss(week, assA, fldName);
                setAssigned((prev) => {
                  return prev + 1;
                });
              }
            }

            //Assign AYF B Assistant
            if (class_count === 2 && schedData.week_type === 1) {
              if (assType === 101 || assType === 102 || assType === 103 || assType === 108) {
                fldName = 'ass' + a + '_ass_B';
                students = await dbGetPersonsByAssType('isAssistant');
                if (students.length > 0) {
                  const assB = students[0].person_uid;
                  await dbSaveAss(week, assB, fldName);
                  setAssigned((prev) => {
                    return prev + 1;
                  });
                }
              }
            }
          }
        };

        // Assign LC Part 1
        const autoLCPart1 = async () => {
          students = await dbGetPersonsByAssType(114);
          if (students.length > 0) {
            const lcPart1 = students[0].person_uid;
            await dbSaveAss(week, lcPart1, 'lc_part1');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        };

        // LC Part 2
        const autoLCPart2 = async () => {
          if (sourceData.lcCount === 2) {
            students = await dbGetPersonsByAssType(114);
            if (students.length > 0) {
              const lcPart2 = students[0].person_uid;
              await dbSaveAss(week, lcPart2, 'lc_part2');
              setAssigned((prev) => {
                return prev + 1;
              });
            }
          }
        };

        // CBS
        const autoCBS = async () => {
          if (schedData.week_type === 1) {
            // Conductor
            students = await dbGetPersonsByAssType(115);
            if (students.length > 0) {
              const cbsConductor = students[0].person_uid;
              await dbSaveAss(week, cbsConductor, 'cbs_conductor');
              setAssigned((prev) => {
                return prev + 1;
              });
            }

            // Reader
            students = await dbGetPersonsByAssType(116);
            if (students.length > 0) {
              const cbsReader = students[0].person_uid;
              await dbSaveAss(week, cbsReader, 'cbs_reader');
              setAssigned((prev) => {
                return prev + 1;
              });
            }
          }
        };

        // Closing Prayer
        const autoClosingPrayer = async () => {
          students = await dbGetPersonsByAssType(111);
          if (students.length > 0) {
            const closingPrayer = students[0].person_uid;
            await dbSaveAss(week, closingPrayer, 'closing_prayer');
            setAssigned((prev) => {
              return prev + 1;
            });
          }
        };

        const autoFillActions = [
          { name: 'chairmanA', run: autoChairmanA },
          { name: 'chairmanB', run: autoChairmanB },
          { name: 'openingPrayer', run: autoOpeningPrayer },
          { name: 'tgwTalk', run: autoTGWTalk },
          { name: 'tgwGems', run: autoTGWGems },
          { name: 'bReadA', run: autoBReadA },
          { name: 'bReadB', run: autoBReadB },
          { name: 'ayf', run: autoAYF },
          { name: 'lcPart1', run: autoLCPart1 },
          { name: 'lcPart2', run: autoLCPart2 },
          { name: 'cbs', run: autoCBS },
          { name: 'closingPrayer', run: autoClosingPrayer },
        ];

        const shuffledActions = autoFillActions.sort(() => Math.random() - 0.5);

        for (let z = 0; z < shuffledActions.length; z++) {
          const action = shuffledActions[z];
          await action.run();
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
            {t('schedule.autofill')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {isAutofillSched && (
            <Typography>
              {t('schedule.autofillScheduleConfirm', {
                currentSchedule: currentSchedule.label,
              })}
            </Typography>
          )}
          {!isAutofillSched && (
            <Typography>
              {t('schedule.autofillWeekConfirm', {
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
            {t('global.no')}
          </Button>
          <Button autoFocus onClick={handleAssignSchedule} color="primary" disabled={isAssigning}>
            {t('schedule.autofill')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutofillSchedule;
