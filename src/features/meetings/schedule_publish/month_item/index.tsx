import { ClickAwayListener, Stack } from '@mui/material';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { MonthItemProps } from './index.types';
import useMonthItem from './useMonthItem';
import Checkbox from '@components/checkbox';
import Tooltip from '@components/tooltip';
import IconButton from '@components/icon_button';
import { IconPublishedSchedule } from '@components/icons';

const MonthItem = ({ data, onChange, readOnly, disabled }: MonthItemProps) => {
  const { t } = useAppTranslation();

  const { monthName, publishedTooltipOpen, setPublishedTooltipOpen } =
    useMonthItem(data.month);

  return (
    <Stack
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        gap: '8px',
        minHeight: '44px',
      }}
    >
      {readOnly ? (
        <Typography sx={{ flex: 1, minWidth: 0 }}>{monthName}</Typography>
      ) : (
        <Checkbox
          label={monthName}
          disabled={disabled}
          sx={{
            flex: 1,
            minWidth: 0,
            marginLeft: '4px',
            marginRight: 0,
            '& .MuiFormControlLabel-label': { minWidth: 0 },
          }}
          checked={data.checked}
          onChange={(e) => onChange(e.target.checked, data.month)}
        />
      )}

      {data.status === 'published' && (
        <ClickAwayListener onClickAway={() => setPublishedTooltipOpen(false)}>
          <Tooltip
            title={t('tr_published')}
            open={publishedTooltipOpen}
            onOpen={() => setPublishedTooltipOpen(true)}
            onClose={() => setPublishedTooltipOpen(false)}
            disableTouchListener
          >
            <IconButton
              aria-label={t('tr_published')}
              edge={false}
              disableHover
              disableRipple
              onClick={() => setPublishedTooltipOpen((open) => !open)}
              sx={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-l)',
              }}
            >
              <IconPublishedSchedule color="var(--green-main)" />
            </IconButton>
          </Tooltip>
        </ClickAwayListener>
      )}
    </Stack>
  );
};

export default MonthItem;
