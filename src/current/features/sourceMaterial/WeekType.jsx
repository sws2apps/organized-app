import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { WeekTypeList } from '../../classes/WeekType';

const WeekType = (props) => {
  const { t } = useTranslation('ui');

  const { weekType, setWeekType } = props;

  const [weekTypeList, setWeekTypeList] = useState(WeekTypeList.local());

  const handleTypeChange = async (e) => {
    setWeekType(e.target.value);
    if (e.target.value === 2) {
      props.setPublicTalk('');
    }
    if (e.target.value === 3 || e.target.value === 4) {
      props.setNoMMeeting(true);
      props.setNoWMeeting(true);
    } else {
      props.setNoMMeeting(false);
      props.setNoWMeeting(false);
    }
  };

  const renderWeekType = (type) => {
    return (
      <MenuItem key={type.value} value={type.value}>
        {type.label}
      </MenuItem>
    );
  };

  useEffect(() => {
    const loadWeekType = async () => {
      await WeekTypeList.loadAll();
      const tmp = WeekTypeList.local();
      setWeekTypeList(tmp);
    };

    if (weekTypeList.length === 0) loadWeekType();
  }, [weekTypeList]);

  return (
    <>
      {weekTypeList.length > 0 && (
        <TextField
          id="outlined-select-weekType"
          select
          label={t('type')}
          size="small"
          value={weekType}
          onChange={(e) => handleTypeChange(e)}
          sx={{
            minWidth: '140px',
            margin: '5px 5px 10px 0',
          }}
        >
          {weekTypeList.map((weekType) => renderWeekType(weekType))}
        </TextField>
      )}
    </>
  );
};

export default WeekType;
