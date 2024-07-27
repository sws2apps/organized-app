import Typography from '@components/typography';

const DemoBanner = () => {
  return (
    <Typography
      className="label-small-medium"
      color="var(--always-white)"
      align="center"
      sx={{
        backgroundColor: 'var(--accent-main)',
        borderRadius: '10px',
        padding: '1px 0',
        marginTop: '-2px',
      }}
    >
      TEST
    </Typography>
  );
};

export default DemoBanner;
