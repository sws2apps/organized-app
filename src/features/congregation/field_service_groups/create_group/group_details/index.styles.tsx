import { styled } from '@mui/material/styles';
import Typography from '@components/typography';

export const GroupHeader = styled(Typography)({
  position: 'sticky',
  top: '-8px',
  padding: '8px 10px',
  backgroundColor: 'var(--white)',
  color: 'var(--accent-dark)',
}) as unknown as typeof Typography;

export const GroupItems = styled('ul')({
  padding: 0,
}) as unknown as 'ul';
