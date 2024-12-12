import { Box, Stack } from '@mui/material';
import { IconCheck, IconClose, IconEdit } from '@components/icons';
import { MonthItemProps } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMonthItem from './useMonthItem';
import Badge from '@components/badge';
import IconButton from '@components/icon_button';
import MonthDetails from '../month_details';
import ReportDetails from '../report_details';
import Typography from '@components/typography';

const MonthItem = (props: MonthItemProps) => {
  const { t } = useAppTranslation();

  const { laptopDown } = useBreakpoints();

  const {
    monthname,
    monthStatus,
    bible_studies,
    total_hours,
    isAP,
    comments,
    isCurrent,
    isAhead,
    handleHover,
    handleUnhover,
    showEdit,
    editorOpen,
    handleCloseEditor,
    handleOpenEditor,
    mobileShowEdit,
  } = useMonthItem(props);

  return (
    <Box
      sx={{
        padding: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        minHeight: '28px',
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
    >
      {editorOpen && (
        <ReportDetails
          open={editorOpen}
          onClose={handleCloseEditor}
          month={props.month}
          person={props.person}
        />
      )}

      <Stack spacing="4px">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isCurrent && !isAhead && monthStatus === 'shared' && (
            <IconCheck width={20} height={20} color="var(--accent-main)" />
          )}
          {!isCurrent && !isAhead && monthStatus === 'not_shared' && (
            <IconClose width={20} height={20} color="var(--red-main)" />
          )}

          <Typography
            className="h4"
            sx={{ color: isAhead ? 'var(--grey-300)' : 'var(--black)' }}
          >
            {monthname}
          </Typography>

          {isAP && (
            <Badge
              className="label-small-medium"
              size="big"
              color="orange"
              sx={{ borderRadius: '2px', padding: '2px 6px' }}
              text={t('tr_AP')}
            />
          )}
        </Box>

        {laptopDown && (
          <MonthDetails
            bible_studies={bible_studies}
            isAhead={isAhead}
            isCurrent={isCurrent}
            total_hours={total_hours}
          />
        )}

        {!isCurrent && !isAhead && comments.length > 0 && (
          <Typography className="body-small-regular" color="var(--grey-350)">
            {comments}
          </Typography>
        )}
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {(showEdit || (laptopDown && mobileShowEdit)) && (
          <IconButton sx={{ padding: 0 }} onClick={handleOpenEditor}>
            <IconEdit color="var(--accent-dark)" />
          </IconButton>
        )}

        {!laptopDown && (
          <MonthDetails
            bible_studies={bible_studies}
            isAhead={isAhead}
            isCurrent={isCurrent}
            total_hours={total_hours}
          />
        )}
      </Box>
    </Box>
  );
};

export default MonthItem;
