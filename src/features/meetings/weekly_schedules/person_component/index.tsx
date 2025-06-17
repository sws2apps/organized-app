import { Box } from '@mui/material';
import { IconFemale, IconMale } from '@components/icons';
import { PersonComponentProps } from './index.types';
import usePersonComponent from './usePersonComponent';
import Typography from '@components/typography';

const PersonComponent = (props: PersonComponentProps) => {
  const { personData } = usePersonComponent(props);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '2px 0px',
      }}
    >
      <Typography
        className="body-small-regular"
        color="var(--grey-350)"
        sx={{ flex: 1 }}
      >
        {props.label}
      </Typography>
      {personData?.name && (
        <Box
          sx={{
            width: '250px',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            borderRadius: 'var(--radius-s)',
            border: personData.active && '1px solid var(--accent-click)',
            backgroundColor: personData.active && 'var(--accent-150)',
            padding: '4px 2px',
          }}
        >
          {personData.female ? (
            <IconFemale width={20} height={20} />
          ) : (
            <IconMale width={20} height={20} />
          )}
          <Typography className="body-small-regular">
            {personData.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PersonComponent;
