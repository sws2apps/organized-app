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
  dlgAssDeleteOpenState,
  isDeleteSchedState,
  reloadWeekSummaryState,
} from '../../states/schedule';
import { saveAssignment } from '../../utils/schedule';
import { fetchScheduleInfo } from '../../utils/sourceMaterial';
import { Schedules } from '../../classes/Schedules';

const DeleteSchedule = () => {
  const { t } = useTranslation('ui');

  const [dlgAssDeleteOpen, setDlgAssDeleteOpen] = useRecoilState(dlgAssDeleteOpenState);

  const setReloadWeekSummary = useSetRecoilState(reloadWeekSummaryState);

  const isDeleteSched = useRecoilValue(isDeleteSchedState);
  const currentSchedule = useRecoilValue(currentScheduleState);
  const currentWeek = useRecoilValue(currentWeekSchedState);

  const [totalToDelete, setTotalToDelete] = useState(0);
  const [deleted, setDeleted] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [weeks, setWeeks] = useState([]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setDlgAssDeleteOpen(false);
  };

  const fetchInfoToDelete = useCallback(async () => {
    const { weeks, assigned } = fetchScheduleInfo(isDeleteSched, currentSchedule, currentWeek);
    setWeeks(weeks);
    setTotalToDelete(assigned);
  }, [currentSchedule, currentWeek, isDeleteSched]);

  const handleDeleteSchedule = async () => {
    setIsDeleting(true);

    for await (const item of weeks) {
      const week = item.value;

      const schedData = Schedules.get(week);

      // chairman
      if (schedData.chairmanMM_A && schedData.chairmanMM_A !== '') {
        await saveAssignment(week, undefined, 'chairmanMM_A');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      if (schedData.chairmanMM_B && schedData.chairmanMM_B !== '') {
        await saveAssignment(week, undefined, 'chairmanMM_B');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      // opening prayer
      if (schedData.opening_prayerMM && schedData.opening_prayerMM !== '') {
        await saveAssignment(week, undefined, 'opening_prayerMM');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      // tgw 10 min talk
      if (schedData.tgw_talk && schedData.tgw_talk !== '') {
        await saveAssignment(week, undefined, 'tgw_talk');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      // tgw spiritual gems
      if (schedData.tgw_gems && schedData.tgw_gems !== '') {
        await saveAssignment(week, undefined, 'tgw_gems');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      // bible reading
      if (schedData.bRead_stu_A && schedData.bRead_stu_A !== '') {
        await saveAssignment(week, undefined, 'bRead_stu_A');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      if (schedData.bRead_stu_B && schedData.bRead_stu_B !== '') {
        await saveAssignment(week, undefined, 'bRead_stu_B');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      // field ministry
      for await (const a of [1, 2, 3, 4]) {
        const stuFieldA = `ass${a}_stu_A`;
        const assFieldA = `ass${a}_ass_A`;
        const stuFieldB = `ass${a}_stu_B`;
        const assFieldB = `ass${a}_ass_B`;

        if (schedData[stuFieldA] && schedData[stuFieldA] !== '') {
          await saveAssignment(week, undefined, stuFieldA);
          setDeleted((prev) => {
            return prev + 1;
          });
        }
        if (schedData[assFieldA] && schedData[assFieldA] !== '') {
          await saveAssignment(week, undefined, assFieldA);
          setDeleted((prev) => {
            return prev + 1;
          });
        }
        if (schedData[stuFieldB] && schedData[stuFieldB] !== '') {
          await saveAssignment(week, undefined, stuFieldB);
          setDeleted((prev) => {
            return prev + 1;
          });
        }
        if (schedData[assFieldB] && schedData[assFieldB] !== '') {
          await saveAssignment(week, undefined, assFieldB);
          setDeleted((prev) => {
            return prev + 1;
          });
        }
      }

      // lc part 1
      if (schedData.lc_part1 && schedData.lc_part1 !== '') {
        await saveAssignment(week, undefined, 'lc_part1');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      // lc part 2
      if (schedData.lc_part2 && schedData.lc_part2 !== '') {
        await saveAssignment(week, undefined, 'lc_part2');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      // cbs conductor
      if (schedData.cbs_conductor && schedData.cbs_conductor !== '') {
        await saveAssignment(week, undefined, 'cbs_conductor');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      // cbs reader
      if (schedData.cbs_reader && schedData.cbs_reader !== '') {
        await saveAssignment(week, undefined, 'cbs_reader');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      // closing prayer
      if (schedData.closing_prayerMM && schedData.closing_prayerMM !== '') {
        await saveAssignment(week, undefined, 'closing_prayerMM');
        setDeleted((prev) => {
          return prev + 1;
        });
      }
    }

    setReloadWeekSummary((prev) => {
      return !prev;
    });

    setTimeout(() => {
      setIsDeleting(false);
      setDlgAssDeleteOpen(false);
    }, [1000]);
  };

  useEffect(() => {
    fetchInfoToDelete();
  }, [fetchInfoToDelete]);

  useEffect(() => {
    const vPg = (deleted * 100) / totalToDelete;
    setProgress(vPg);
  }, [deleted, totalToDelete]);

  return (
    <Box>
      <Dialog open={dlgAssDeleteOpen} aria-labelledby="dialog-title-delete-assignment" onClose={handleClose}>
        <DialogTitle id="dialog-title-delete-assignment">
          <Typography variant="h6" component="p">
            {t('deleteAssignmentTitle')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {isDeleteSched && (
            <Typography>
              {t('deleteScheduleConfirm', {
                currentSchedule: currentSchedule.label,
              })}
            </Typography>
          )}
          {!isDeleteSched && (
            <Typography>
              {t('deleteWeekConfirm', {
                currentWeek: currentWeek.label,
              })}
            </Typography>
          )}

          {isDeleting && (
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
              <Typography sx={{ fontWeight: 'bold', marginLeft: '25px' }}>{`${deleted}/${totalToDelete}`}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus disabled={isDeleting}>
            {t('no')}
          </Button>
          <Button autoFocus onClick={handleDeleteSchedule} color="primary" disabled={isDeleting}>
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteSchedule;
