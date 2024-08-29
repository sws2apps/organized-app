import { Box } from '@mui/material';
import { IconEdit } from '@components/icons';
import { useBreakpoints } from '@hooks/index';
import { DailyRecordProps } from './index.types';
import useDailyRecords from './useDailyRecord';
import IconButton from '@components/icon_button';
import MinistryDetails from '../ministry_details';
import ReportDaily from '@features/ministry/report_daily';
import Typography from '@components/typography';

const DailyRecord = ({ report }: DailyRecordProps) => {
  const { laptopDown } = useBreakpoints();

  const {
    fullDate,
    handleHideEdit,
    handleShowEdit,
    showEdit,
    editorOpen,
    handleCloseEditor,
    handleOpenEditor,
  } = useDailyRecords(report);

  return (
    <Box
      onMouseEnter={handleShowEdit}
      onMouseLeave={handleHideEdit}
      sx={{
        borderRadius: 'var(--radius-m)',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        margin: '4px 0',
        justifyContent: 'space-between',
        minHeight: '34px',
        '&:hover': {
          backgroundColor: 'var(--accent-150)',
        },
      }}
    >
      {editorOpen && (
        <ReportDaily
          isEdit={true}
          open={editorOpen}
          onClose={handleCloseEditor}
          date={report.report_date}
        />
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography className="h4">{fullDate}</Typography>

        {laptopDown && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <MinistryDetails
              hours={report.report_data.hours}
              studies={report.report_data.bible_studies.value}
              hovered={showEdit}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {(showEdit || laptopDown) && (
          <IconButton sx={{ padding: 0 }} onClick={handleOpenEditor}>
            <IconEdit color="var(--accent-dark)" />
          </IconButton>
        )}

        {!laptopDown && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MinistryDetails
              hours={report.report_data.hours}
              studies={report.report_data.bible_studies.value}
              hovered={showEdit}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DailyRecord;
