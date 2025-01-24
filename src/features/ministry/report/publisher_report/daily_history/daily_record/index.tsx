import { Box } from '@mui/material';
import { IconEdit } from '@components/icons';
import { useBreakpoints } from '@hooks/index';
import { DailyRecordProps } from './index.types';
import useDailyRecord from './useDailyRecord';
import IconButton from '@components/icon_button';
import MinistryDetails from '../ministry_details';
import ReportFormDialog from '@features/ministry/report/report_form_dialog';
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
    status,
    hours_credit,
    hours_field,
  } = useDailyRecord(report);

  return (
    <Box
      onClick={status === 'pending' ? handleOpenEditor : null}
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
        cursor: status === 'pending' ? 'pointer' : 'auto',
        '&:hover': {
          backgroundColor: 'var(--accent-150)',
        },
      }}
    >
      {editorOpen && (
        <ReportFormDialog
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
              hours_field={hours_field}
              hours_credit={hours_credit}
              studies={report.report_data.bible_studies.value}
              hovered={showEdit}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {status === 'pending' && (showEdit || laptopDown) && (
          <IconButton sx={{ padding: 0 }} onClick={handleOpenEditor}>
            <IconEdit color="var(--accent-dark)" />
          </IconButton>
        )}

        {!laptopDown && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MinistryDetails
              hours_field={hours_field}
              hours_credit={hours_credit}
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
