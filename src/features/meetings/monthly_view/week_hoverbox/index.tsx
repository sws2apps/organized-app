import { Box, Popper } from '@mui/material';
import React, { useRef, useState } from 'react';
import { WeekHoverBoxType } from './index.types';
import MeetingPart from '@features/meetings/meeting_part';

const WeekHoverBox = (props: WeekHoverBoxType) => {
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setAnchorEl(boxRef.current);
      setOpen(true);
    }, 3000); // 3 seconds delay
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setOpen(false); // Close the Popper when the mouse leaves the box
  };

  return (
    <>
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        flex={1}
        ref={boxRef}
      >
        {props.children}
      </Box>

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
        <Box
          sx={{
            padding: '16px',
            borderRadius: 'var(--radius-m)',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--accent-200)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxWidth: '339px',
          }}
          className="btn-shadow"
        >
          <MeetingPart
            week={props.week}
            type={props.type}
            color={'var(--black)'}
          />
        </Box>
      </Popper>
    </>
  );
};

export default WeekHoverBox;
