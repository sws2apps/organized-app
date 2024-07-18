import { Box } from '@mui/material';
import { DeleteGroupModalWindowProps } from './delete_group.types';
import useAppTranslation from '@hooks/useAppTranslation';

const DeleteGroupModalWindow = (props: DeleteGroupModalWindowProps) => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        padding: '24px',
        gap: '24px',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '500px',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
      }}
      className="pop-up-shadow"
    ></Box>
  );
};

export default DeleteGroupModalWindow;
