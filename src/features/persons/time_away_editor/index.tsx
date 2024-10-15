import { Box } from '@mui/material';
import { IconAdd, IconInfo } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { TimeAwayEditorProps } from './index.types';
import Button from '@components/button';
import Typography from '@components/typography';
import TimeAwayItem from './time_away_item';

const TimeAwayEditor = ({
  items,
  desc,
  onAdd,
  onCommentsChange,
  onDelete,
  onEndDateChange,
  onStartDateChange,
  readOnly,
}: TimeAwayEditorProps) => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        display: 'flex',
        padding: '16px',
        gap: '16px',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <Typography className="h2">{t('tr_timeAway')}</Typography>

      {items.length === 0 && (
        <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          {desc && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconInfo color="var(--grey-350)" />
              <Typography color="var(--grey-350)">{desc}</Typography>
            </Box>
          )}

          {!readOnly && (
            <Button
              variant="small"
              startIcon={<IconAdd />}
              onClick={onAdd}
              sx={{
                height: '32px',
                minHeight: '32px !important',
                alignSelf: 'flex-start',
              }}
            >
              {t('tr_add')}
            </Button>
          )}
        </Box>
      )}

      {items.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '8px',
          }}
        >
          {items.map((timeAwayItem, index) => (
            <TimeAwayItem
              key={timeAwayItem.id}
              readOnly={readOnly}
              id={timeAwayItem.id}
              start_date={timeAwayItem.start_date}
              end_date={timeAwayItem.end_date}
              comments={timeAwayItem.comments}
              isLast={index === items.length - 1}
              onAdd={onAdd}
              onCommentsChange={onCommentsChange}
              onDelete={onDelete}
              onEndDateChange={onEndDateChange}
              onStartDateChange={onStartDateChange}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TimeAwayEditor;
