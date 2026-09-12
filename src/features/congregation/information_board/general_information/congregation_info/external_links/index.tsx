import { Stack } from '@mui/material';
import useExternalLinks from './useExternalLinks';

const ExternalLinks = () => {
  const { linkButtons } = useExternalLinks();

  return (
    <Stack direction="row" spacing="16px" flexWrap="wrap" useFlexGap>
      {linkButtons}
    </Stack>
  );
};

export default ExternalLinks;
