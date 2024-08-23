import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { IconFemale, IconMale } from '@components/icons';
import { styledRemoveProps } from '@utils/common';
import { PersonContainerProps } from './index.types';
import Typography from '@components/typography';

export const DoubleFieldContainer = styled(Box, {
  shouldForwardProp: (prop) => styledRemoveProps(prop, ['laptopUp']),
})<{ laptopUp: boolean }>(({ laptopUp }) => ({
  display: 'flex',
  gap: '8px',
  flexDirection: laptopUp ? 'row' : 'column',
}));

export const PrimaryFieldContainer = styled(Box)({
  flex: 1,
});

export const SecondaryFieldContainer = styled(Box, {
  shouldForwardProp: (prop) => styledRemoveProps(prop, ['laptopUp']),
})<{ laptopUp: boolean }>(({ laptopUp }) => ({
  flex: 1,
  maxWidth: laptopUp ? '320px' : '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));

export const PersonContainer = ({
  name,
  label,
  female,
  active,
}: PersonContainerProps) => {
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
        {label}
      </Typography>
      <Box
        sx={{
          width: '210px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          borderRadius: 'var(--radius-s)',
          border: active && '1px solid var(--accent-click)',
          backgroundColor: active && 'var(--accent-150)',
          padding: '4px 2px',
        }}
      >
        {female ? (
          <IconFemale width={20} height={20} />
        ) : (
          <IconMale width={20} height={20} />
        )}
        <Typography>{name}</Typography>
      </Box>
    </Box>
  );
};
