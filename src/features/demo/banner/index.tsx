import Typography from '@components/typography';

const DemoBanner = ({
  environment = 'TEST',
}: {
  environment?: 'TEST' | 'STAGING';
}) => {
  return (
    <Typography
      className="label-small-medium"
      color="var(--always-white)"
      align="center"
      sx={{
        backgroundColor:
          environment === 'TEST' ? 'var(--accent-main)' : 'var(--green-main)',
        borderRadius: '10px',
        padding: '1px 0',
        marginTop: '-2px',
      }}
    >
      {environment}
    </Typography>
  );
};

export default DemoBanner;
