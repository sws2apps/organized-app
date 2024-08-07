import { Box, IconButton } from '@mui/material';
import {
  IconCheckCircle,
  IconCopy,
  IconFemale,
  IconMale,
} from '@components/icons';
import { SnackBar } from '@components/index';
import { useState } from 'react';
import useAppTranslation from '@hooks/useAppTranslation';

const ScheduleGrid = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        counterReset: 'schedule',
        gridTemplateColumns: '1fr 100px 210px',
        columnGap: '10px',
      }}
    >
      {children}
    </Box>
  );
};

const ScheduleHeader = ({
  text,
  color,
  icon,
}: {
  text: string;
  color: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        backgroundColor: color,
        height: '32px',
        borderRadius: 'var(--radius-s)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        '& svg *': {
          fill: 'white !important',
        },
      }}
    >
      {icon}
      <span className="h2-caps" style={{ color: 'white' }}>
        {text}
      </span>
    </Box>
  );
};

const ScheduleItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        paddingBottom: '8px',
        display: 'grid',
        '&:not(:has(#classRoomName))': {
          alignItems: 'center',
        },
        gridTemplateColumns: 'subgrid',
        gridColumn: '1 / -1',
        padding: '8px 0',
        '& + &': {
          borderTop: '1px solid var(--grey-200)',
        },
      }}
    >
      {children}
    </Box>
  );
};

const ScheduleItemTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        gridColumn: '1 / -1',
      }}
    >
      {children}
    </Box>
  );
};

const ScheduleWeekTitle = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) => {
  return (
    <Box
      sx={(theme) => ({
        ['&, & > *']: {
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: color,
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'flex-start',
          },
        },
      })}
    >
      <span className="h2-caps">{children}</span>
    </Box>
  );
};

const ScheduleTitle = ({
  children,
  color,
  cssCounter,
}: {
  children: React.ReactNode;
  color: string;
  cssCounter?: boolean;
}) => {
  return (
    <span className="h4">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          counterIncrement: cssCounter ? 'schedule' : 'none',
          color: color,
          '&::before': {
            content: cssCounter ? "counter(schedule) '.'" : 'none',
            margin: '0 8px 0 4px',
          },
          '& svg': {
            width: '20px',
            height: '20px',
            marginRight: '8px',
          },
        }}
      >
        {children}
      </Box>
    </span>
  );
};

const CopyButton = ({ value }: { value: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
  };
  const { t } = useAppTranslation();

  return (
    <>
      <IconButton onClick={handleClick}>
        <IconCopy />
      </IconButton>
      <SnackBar
        open={isCopied}
        variant="success"
        messageIcon={<IconCheckCircle color="var(--always-white)" />}
        messageHeader={t('tr_textCopied')}
        message=""
        onClose={() => setIsCopied(false)}
      />
    </>
  );
};

const ScheduleSubtitle = ({
  children,
  isCopyable,
}: {
  children: React.ReactNode;
  isCopyable?: boolean;
}) => {
  return (
    <span
      className="h4"
      style={{
        color: 'var(--black)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {children}
      {isCopyable && <CopyButton value={children.toString()} />}
    </span>
  );
};

const ScheduleDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="body-small-regular" style={{ color: 'var(--grey-400)' }}>
      {children}
    </span>
  );
};

// Use Multiple <ScheduleMemberRow /> as Children :)
const ScheduleMemberClassRoom = ({
  children,
  classRoomName,
}: {
  children: React.ReactNode;
  classRoomName: string;
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        gridColumn: '1 / -1',
        color: 'var(--grey-350)',
        fontWeight: '500',
        '& + &': {
          marginBottom: '8px',
          paddingBottom: '8px',
          borderTop: '1px solid var(--grey-200)',
        },
      }}
    >
      <span
        id="classRoomName"
        className="body-small-semibold"
        style={{
          gridColumn: '1/-1',
          padding: '8px 0px 4px 0',
        }}
      >
        {classRoomName}
      </span>
      {children}
    </Box>
  );
};

// Use Multiple <ScheduleMemberRow /> or <ScheduleMemberClassRoom /> as Children :)
const ScheduleMembers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        gridColumn: '2 / -1',
        columnGap: '8px',
        rowGap: '4px',
      }}
    >
      {children}
    </Box>
  );
};

const ScheduleMemberRow = ({
  type,
  name,
  female,
  active,
}: {
  type?: string;
  name: string;
  female?: boolean;
  active?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        gridColumn: '1 / -1',
        color: 'var(--grey-350)',
        '& + &': {
          marginTop: '2px',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span className="body-small-regular">{type}</span>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            '& svg': {
              width: '24px',
              height: '24px',
            },
            padding: '2px 4px',
            borderRadius: 'var(--radius-s)',
            border: active && '1px solid var(--accent-click)',
            backgroundColor: active && 'var(--accent-150)',
          }}
        >
          {female ? <IconFemale /> : <IconMale />}
          <span style={{ color: 'var(--black)' }} className="body-regular">
            {name}
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export {
  ScheduleGrid,
  ScheduleHeader,
  ScheduleItem,
  ScheduleItemTitle,
  ScheduleWeekTitle,
  ScheduleTitle,
  ScheduleSubtitle,
  ScheduleDescription,
  ScheduleMembers,
  ScheduleMemberClassRoom,
  ScheduleMemberRow,
};
