import { Box } from '@mui/material';
import { IconAddMonth, IconAtHome, IconEdit } from '@components/icons';
import Button from '@components/button';
import GroupBadge from '@components/group_badge';
import Badge from '@components/badge';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';

type MeetingItemProps = {
  id: number;
  title: string;
  badges: string[];
  type: string;
};

const MeetingItem = ({ id, title, badges }: MeetingItemProps) => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  return (
    <Box
      className="meeting-item"
      key={id}
      sx={{
        '&:hover .add-to-calendar, &:hover .edit-button': {
          '@media (hover: hover) and (pointer: fine)': {
            opacity: 1,
          },
        },
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        backgroundColor: 'var(--white)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography className="h3">{title}</Typography>
          <Box className="edit-button" sx={{ opacity: desktopUp ? 0 : 1 }}>
            <Button
              variant="small"
              sx={{ marginLeft: '8px', minHeight: '24px', minWidth: '24px' }}
            >
              <IconEdit />
            </Button>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap="8px">
          {/* TODO: remove old badge and implement new one */}
          {badges.map((badge, index) => (
            <Badge key={index} text={badge} size="big" color="accent" />
          ))}
          <Badge text="Service overseer visit" size="big" color="accent" />
          <GroupBadge
            label="Group 3 - Outlined"
            color="group-3"
            variant="outlined"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'var(--accent-150)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-l)',
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'stretch',
            justifyContent: 'center',
            flex: 0,
          }}
        >
          <Typography className="h4" color="var(--accent-dark)">
            {/* Format time based on location */}
            {new Date().toLocaleTimeString(navigator.language, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: '4px',
          }}
        >
          <Typography className="h4">Nolan Ekstrom Bothman</Typography>
          <Typography className="body-regular" color="var(--grey-400)">
            <Box component="span" display="flex" alignItems="center" gap="4px">
              <IconAtHome color="var(--grey-400)" /> Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </Box>
          </Typography>
          <Typography className="body-small-regular" color="var(--grey-400)">
            Optional: e.g. a maps link: https://goo.gl/maps/xyz123
          </Typography>
        </Box>
        <Box
          className="add-to-calendar"
          sx={{
            display: 'flex',
            flex: 0,
            alignItems: 'center',
            opacity: desktopUp ? 0 : 1,
          }}
        >
          <Button variant="small" startIcon={<IconAddMonth />}>
            <Typography
              className="body-small-regular"
              color="var(--blue-500)"
              noWrap
            >
              {t('tr_addToCalendar')}
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MeetingItem;
