import { WeekHoverBoxType } from './index.types';
import MeetingPart from '@features/meetings/meeting_part';
import Tooltip from '@components/tooltip';

const WeekHoverBox = (props: WeekHoverBoxType) => {
  return (
    <Tooltip
      sx={{
        flex: '1',
        ...props.sx,
      }}
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
        />
      }
    >
      {props.children}
    </Tooltip>
  );
};

export default WeekHoverBox;
