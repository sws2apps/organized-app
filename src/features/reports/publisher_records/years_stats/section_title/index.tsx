import { PropsWithChildren } from 'react';
import Typography from '@components/typography';

const SectionTitle = ({ children }: PropsWithChildren) => {
  return (
    <Typography
      className="h4"
      sx={{
        color: 'var(--accent-dark)',
        borderRadius: 'var(--radius-s)',
        padding: '4px 8px',
        backgroundColor: 'var(--accent-150)',
      }}
    >
      {children}
    </Typography>
  );
};

export default SectionTitle;
