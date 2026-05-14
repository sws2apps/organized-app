import { ReactElement } from 'react';
import { WeekHoverBoxType } from './index.types';
import MeetingPart from '@features/meetings/meeting_part';
import Tooltip from '@components/tooltip';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { userDataViewState } from '@states/settings';

/**
 * Wraps a cell in the monthly view.
 * The outer Box is the actual flex item (flex:1, minWidth:0) that participates
 * in StyledMonthlyViewRow layout and caps column width.
 * The MUI Tooltip is inside so the hover area matches the column.
 */
const WeekHoverBox = (props: WeekHoverBoxType) => {
  const dataView = useAtomValue(userDataViewState);

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        ...props.sx,
      }}
    >
      <Tooltip
        sx={{ display: 'block' }}
        placement="bottom-start"
        slotProps={{
          tooltip: {
            sx: {
              padding: '16px',
              borderRadius: 'var(--radius-m)',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--accent-200)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxWidth: '339px',
            },
          },
          popper: { style: { zIndex: 2 } },
        }}
        title={
          <MeetingPart
            week={props.week}
            type={props.type}
            color={'var(--black)'}
            dataView={dataView}
          />
        }
      >
        {props.children as ReactElement}
      </Tooltip>
    </Box>
  );
};

export default WeekHoverBox;
