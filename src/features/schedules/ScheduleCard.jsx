import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Paper from '@mui/material/Paper';
import PrintIcon from '@mui/icons-material/Print';
import Typography from '@mui/material/Typography';
import {
  currentScheduleState,
  dlgAssDeleteOpenState,
  dlgAutoFillOpenState,
  isAutoFillSchedState,
  isDeleteSchedState,
  s89DataState,
} from '../../states/schedule';

const ScheduleCard = ({ schedule }) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const setDlgAssDeleteOpen = useSetRecoilState(dlgAssDeleteOpenState);
  const setIsDeleteSched = useSetRecoilState(isDeleteSchedState);
  const setDlgAutofillOpen = useSetRecoilState(dlgAutoFillOpenState);
  const setIsAutofillSched = useSetRecoilState(isAutoFillSchedState);
  const setCurrentSchedule = useSetRecoilState(currentScheduleState);
  const setS89Data = useSetRecoilState(s89DataState);

  const [anchorPrintEl, setAnchorPrintEl] = useState(null);

  const openPrint = Boolean(anchorPrintEl);

  const handleMenuPrint = (e) => {
    setAnchorPrintEl(e.currentTarget);
  };

  const handleClosePrint = () => {
    setAnchorPrintEl(null);
  };

  const handleOpenSchedule = () => {
    navigate(`/schedules/${schedule.value.replace('/', '-')}`);
  };

  const handleAssignSchedule = () => {
    setCurrentSchedule(schedule);
    setIsAutofillSched(true);
    setDlgAutofillOpen(true);
  };

  const handleS89Export = async () => {
    handleClosePrint();
    setS89Data([]);
    setCurrentSchedule(schedule);
    navigate('/assignment-form');
  };

  const handleS140Export = async () => {
    handleClosePrint();
    setCurrentSchedule(schedule);
    navigate('/midweek-meeting-schedule');
  };

  const handleDeleteSchedule = () => {
    setCurrentSchedule(schedule);
    setIsDeleteSched(true);
    setDlgAssDeleteOpen(true);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: '10px',
        display: 'flex',
        gap: '20px',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="h6" sx={{ minWidth: '150px' }}>
        {schedule.label}
      </Typography>
      <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <IconButton
          sx={{
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            justifyContent: 'center',
            padding: '5px 10px',
            border: '1px outset',
          }}
          onClick={handleOpenSchedule}
        >
          <OpenInNewIcon color="success" sx={{ fontSize: '35px' }} />
          <Typography sx={{ fontSize: '12px' }}>{t('global.open')}</Typography>
        </IconButton>
        <IconButton
          sx={{
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            justifyContent: 'center',
            padding: '5px 10px',
            border: '1px outset',
          }}
          onClick={handleAssignSchedule}
        >
          <FlashAutoIcon color="secondary" sx={{ fontSize: '35px' }} />
          <Typography sx={{ fontSize: '12px' }}>{t('schedule.autofill')}</Typography>
        </IconButton>
        <IconButton
          id="button-print"
          onClick={handleMenuPrint}
          aria-controls={openPrint ? 'menu-print' : undefined}
          aria-haspopup="true"
          aria-expanded={openPrint ? 'true' : undefined}
          sx={{
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            justifyContent: 'center',
            padding: '5px 10px',
            border: '1px outset',
          }}
        >
          <PrintIcon sx={{ fontSize: '35px' }} />
          <Typography sx={{ fontSize: '12px' }}>{t('global.export')}</Typography>
        </IconButton>

        <Menu
          sx={{ marginTop: '70px' }}
          id="menu-print"
          MenuListProps={{
            'aria-labelledby': 'button-print',
          }}
          anchorEl={anchorPrintEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={openPrint}
          onClose={handleClosePrint}
        >
          <MenuItem onClick={handleS89Export}>
            <ListItemText primary={t('schedule.s89')} />
          </MenuItem>
          <MenuItem onClick={handleS140Export}>
            <ListItemText primary={t('schedule.midweekMeetingPrint')} />
          </MenuItem>
        </Menu>

        <IconButton
          sx={{
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            justifyContent: 'center',
            padding: '5px 10px',
            border: '1px outset',
          }}
          onClick={handleDeleteSchedule}
        >
          <DeleteIcon color="error" sx={{ fontSize: '35px' }} />
          <Typography sx={{ fontSize: '12px' }}>{t('global.delete')}</Typography>
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ScheduleCard;
