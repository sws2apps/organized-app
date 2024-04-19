import { Box, Stack } from '@mui/material';
import Typography from '@components/typography';
import ButtonIcon from '@components/icon_button';
import { IconAddMonth } from '@icons/index';
import { FC, PropsWithChildren } from 'react';
import { parseISO, getDay, format } from 'date-fns';
import { useAppTranslation } from '@hooks/index';

interface AssigmentItemProps {
  assigmentDate: string;
}

export const AssigmentMonthItem = ({ assigmentDate }: AssigmentItemProps) => {
  const { t } = useAppTranslation();
  const formattedDate = format(new Date(assigmentDate), 'LLLL');
  const formattedYear = format(new Date(assigmentDate), 'yyyy');
  return (
    <Box
      sx={{
        padding: '8px 16px',
        alignSelf: 'stretch',
        borderRadius: 'var(--radius-m)',
        background: 'var(--accent-200)',
      }}
    >
      <Typography className="h2" color="var(--accent-dark)" sx={{ textAlign: 'left' }}>
        {t(`tr_${formattedDate.toLowerCase()}`)} {formattedYear}
      </Typography>
    </Box>
  );
};

const AssigmentItem: FC<PropsWithChildren & AssigmentItemProps> = ({ children, assigmentDate }) => {
  return (
    <Stack direction={'row'} spacing={2} alignItems={'center'}>
      <Box
        style={{
          textAlign: 'center',
          width: '56px',
          borderRadius: 'var(--radius-m)',
          padding: '8px 4px',
          backgroundColor: [6, 0].includes(getDay(parseISO(assigmentDate)))
            ? 'var(--weekend-meeting)'
            : 'var(--midweek-meeting)',
        }}
      >
        <Typography className={'h2'} color={'var(--always-white)'}>
          {format(new Date(assigmentDate), 'd')}
        </Typography>
      </Box>
      <Stack
        alignItems={'center'}
        justifyContent={'space-between'}
        direction={'row'}
        width={'calc(100% - 72px)'}
        spacing={1}
        sx={(theme) => ({
          cursor: 'pointer',
          [theme.breakpoints.up('tablet')]: {
            ':hover': {
              button: {
                backgroundColor: 'var(--accent-200)',
                opacity: 1,
                pointerEvents: 'all',
              },
            },
          },
        })}
      >
        {children}
        <ButtonIcon
          sx={(theme) => ({
            borderRadius: 'var(--radius-l)',
            [theme.breakpoints.up('tablet')]: {
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 500ms ease',
            },
          })}
        >
          <IconAddMonth color={'var(--accent-main)'} height={24} width={24} />
        </ButtonIcon>
      </Stack>
    </Stack>
  );
};

export default AssigmentItem;
