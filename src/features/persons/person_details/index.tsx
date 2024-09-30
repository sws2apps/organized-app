import { Box, Stack } from '@mui/material';
import { PersonDetailsProps } from './index.types';
import usePersonDetails from './usePersonDetails';
import Badge from '@components/badge';
import Typography from '@components/typography';
import UserCardMaleImg from '@assets/img/illustration_male.svg?url';
import UserCardFemaleImg from '@assets/img/illustration_female.svg?url';

const PersonDetails = (props: PersonDetailsProps) => {
  const { name, female, badges } = usePersonDetails(props);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
      <img alt="" src={female ? UserCardFemaleImg : UserCardMaleImg} />
      <Stack spacing="4px">
        <Typography className={props.className || 'h4'}>{name}</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {badges.map((badge) => (
            <Badge
              key={badge.name}
              text={badge.name}
              color={badge.color}
              size="small"
              filled={false}
            />
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

export default PersonDetails;
