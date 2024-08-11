import { PropsWithChildren } from 'react';
import { Box, Collapse } from '@mui/material';
import { MeetingSectionType } from './index.types';
import { IconExpand } from '@components/icons';
import Typography from '@components/typography';

const MeetingSection = ({
  color,
  icon,
  part,
  expanded,
  onToggle,
  children,
  alwaysExpanded,
}: MeetingSectionType & PropsWithChildren) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: color,
          borderRadius: 'var(--radius-s)',
          padding: '4px 8px',
          cursor: 'pointer',
        }}
        onClick={onToggle}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flex: 1,
          }}
        >
          {icon}
          <Typography
            className="h2-caps"
            color="var(--always-white)"
            align="center"
          >
            {part}
          </Typography>
        </Box>
        {!alwaysExpanded && (
          <IconExpand
            color="var(--always-white)"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        )}
      </Box>
      <Collapse in={alwaysExpanded || expanded} timeout="auto" unmountOnExit>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {children}
        </Box>
      </Collapse>
    </>
  );
};

export default MeetingSection;
