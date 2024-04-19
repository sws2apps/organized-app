import { Box } from '@mui/material';
import Typography from '@components/typography';
import { CardHeaderPropsType } from './index.types';

/**
 * Component for rendering a card header.
 * @param {CardHeaderPropsType} props - Props for the CardHeader component.
 * @returns {JSX.Element} CardHeader component.
 */
const CardHeader = (props: CardHeaderPropsType) => {
  return (
    <Box
      sx={{
        padding: '4px 8px',
        alignSelf: 'stretch',
        borderRadius: 'var(--radius-m)',
        background: 'var(--accent-150)',
      }}
    >
      <Typography className={props.className} color="var(--accent-dark)" sx={{ textAlign: 'left' }}>
        {props.children}
      </Typography>
    </Box>
  );
};
export default CardHeader;
