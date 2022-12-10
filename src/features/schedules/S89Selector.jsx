import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TreeViewCheckbox from '../../components/TreeViewCheckbox';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';
import { dbGetS89ItemData, dbGetS89WeekList } from '../../indexedDb/dbAssignment';
import { currentScheduleState, s89DataState } from '../../states/schedule';
import { appLangState } from '../../states/main';

const S89Selector = ({ setIsGenerating }) => {
  const { t } = useTranslation();

  const [s89Data, setS89Data] = useRecoilState(s89DataState);

  const currentSchedule = useRecoilValue(currentScheduleState);
  const appLang = useRecoilValue(appLangState);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [selected, setSelected] = useState([]);
  const [disablePDF, setDisablePDF] = useState(true);
  const [dlgOpen, setDlgOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
  };

  const handlePreviewS89 = async () => {
    setIsGenerating(true);
    const realData = selected.filter((item) => item.length > 10);
    realData.sort((a, b) => {
      return a > b ? 1 : -1;
    });

    let s89Data = [];

    for (let i = 0; i < realData.length; i++) {
      const week = realData[i].split('-')[0];
      const assType = realData[i].split('@')[1].split('-')[0];
      const classLabel = realData[i].split('-')[2];

      const data = await dbGetS89ItemData(week, assType, classLabel);

      let obj = {};
      obj.id = realData[i];

      s89Data.push({ ...obj, ...data });
    }

    setS89Data(s89Data);
    setIsGenerating(false);
  };

  const savePDF = async () => {
    setDlgOpen(true);
    const element = document.getElementById('S89-wrapper');
    const opt = {
      filename: 'S-89.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: [3.35, 4.45], orientation: 'portrait' },
    };
    await html2pdf().set(opt).from(element).save();
    setDlgOpen(false);
  };

  useEffect(() => {
    const getDataS89 = async () => {
      const data = await dbGetS89WeekList(currentSchedule.value);
      setData(data);
      setLoading(false);
    };
    if (currentSchedule !== '') {
      getDataS89();
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
        border: '1px outset',
        borderRadius: '10px',
        maxHeight: '500px',
        overflow: 'auto',
        padding: '20px',
        marginBottom: '20px',
      }}
    >
      <Dialog
        open={dlgOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('global.pleaseWait')}</DialogTitle>
        <DialogContent>
          <Container
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '15px',
            }}
          >
            <CircularProgress disableShrink color="secondary" size={'60px'} />
          </Container>
        </DialogContent>
      </Dialog>

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
              <Typography sx={{ marginBottom: '20px' }}>{t('s89.header')}</Typography>
              <TreeViewCheckbox
                data={data}
                selected={selected}
                setSelected={(value) => setSelected(value)}
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
                {s89Data.length > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveAltIcon />}
                    sx={{ margin: '0 2px 2px 0' }}
                    onClick={savePDF}
                  >
                    PDF
                  </Button>
                )}

                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  disabled={disablePDF}
                  sx={{ marginRight: '10px' }}
                  onClick={handlePreviewS89}
                >
                  {t('global.preview')}
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
                {t('schedule.s89NoData')}
              </Typography>
            </Container>
          )}
        </>
      )}
    </Box>
  );
};

export default S89Selector;
