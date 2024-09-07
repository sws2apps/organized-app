import { PropsWithChildren } from 'react';
import Typography from '@components/typography';

const YearsCount = ({ children }: PropsWithChildren) => {
  return (
    <Typography
      className="h4"
      color="var(--accent-dark)"
      align="center"
      sx={{
        padding: '8px 16px',
        borderRadius: 'var(--radius-l)',
        backgroundColor: 'var(--accent-150)',
        width: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Typography>
  );
};

export default YearsCount;
