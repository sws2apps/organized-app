import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TreeViewCheckbox from '../../components/TreeViewCheckbox';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';
import {
  S89DownloadLoadingState,
  S89DownloadOpenState,
  currentScheduleState,
  s89DataState,
} from '../../states/schedule';
import { appLangState } from '../../states/main';
import { Sources } from '../../classes/Sources';
import { Schedules } from '../../classes/Schedules';

const S89Selector = () => {
  const { t } = useTranslation('ui');

  const setS89Data = useSetRecoilState(s89DataState);
  const setIsS89Download = useSetRecoilState(S89DownloadOpenState);
  const setIsS89DownloadLoading = useSetRecoilState(S89DownloadLoadingState);

  const currentSchedule = useRecoilValue(currentScheduleState);
  const appLang = useRecoilValue(appLangState);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [selected, setSelected] = useState([]);
  const [disablePDF, setDisablePDF] = useState(true);

  const handleSelection = (value) => {
    setSelected(value);
  };

  const handlePreviewS89 = async () => {
    setIsS89DownloadLoading(true);
    setIsS89Download(true);

    const realData = selected.filter((item) => item.length > 10);
    realData.sort((a, b) => {
      return a > b ? 1 : -1;
    });

    const finalList = [];
    realData.forEach((item) => {
      if (item.endsWith('-A') || item.endsWith('-B')) {
        if (finalList.findIndex((value) => value === item) === -1) {
          finalList.push(item);
        }
      } else {
        ['A', 'B'].forEach((classIndex) => {
          const week = item.split('-')[0];
          const className = `${item}-${classIndex}`;

          const findWeek = data.children.find((weekItem) => weekItem.value === week);
          const findAss = findWeek.children.find((ass) => ass.value === item);
          const findClass = findAss.children.find((assClass) => assClass.value === className);

          if (findClass && finalList.findIndex((value) => value === className) === -1) {
            finalList.push(className);
          }
        });
      }
    });

    let s89Data = [];

    for await (const item of finalList) {
      const week = item.split('-')[0];
      const assType = item.split('@')[1].split('-')[0];
      const classLabel = item.split('-')[2];
      const data = Schedules.S89ItemData(week, assType, classLabel);

      s89Data.push({ id: item, ...data });
    }

    setS89Data(s89Data);
    setIsS89DownloadLoading(false);
  };

  useEffect(() => {
    if (currentSchedule !== '') {
      const data = Sources.S89WeekList(currentSchedule.value);
      setData(data);
      setLoading(false);
    }
  }, [appLang, currentSchedule]);

  useEffect(() => {
    const realData = selected.filter((item) => item.length > 10);
    if (realData.length === 0) {
      setDisablePDF(true);
    } else {
      setDisablePDF(false);
    }
  }, [selected]);

  return (
    <Box
      sx={{
        maxWidth: '500px',
        borderRadius: '10px',
        overflow: 'auto',
        padding: '20px',
        marginBottom: '20px',
      }}
    >
      {loading && (
        <CircularProgress
          color="secondary"
          size={60}
          disableShrink={true}
          sx={{
            display: 'flex',
            margin: '60px auto',
          }}
        />
      )}
      {!loading && Object.keys(data).length > 2 && (
        <>
          {data.children.length > 0 && (
            <Box>
              <Typography sx={{ marginBottom: '20px' }}>{t('s89Header')}</Typography>
              <TreeViewCheckbox
                data={data}
                selected={selected}
                setSelected={(value) => handleSelection(value)}
                defaultExpanded={['S89']}
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: '20px',
                  gap: '10px',
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SaveAltIcon />}
                  disabled={disablePDF}
                  sx={{ marginRight: '10px' }}
                  onClick={handlePreviewS89}
                >
                  PDF
                </Button>
              </Box>
            </Box>
          )}
          {data.children.length === 0 && (
            <Container
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '20vh',
              }}
            >
              <WarningIcon color="error" sx={{ fontSize: '60px' }} />
              <Typography variant="body1" align="center">
                {t('s89NoData')}
              </Typography>
            </Container>
          )}
        </>
      )}
    </Box>
  );
};

export default S89Selector;
