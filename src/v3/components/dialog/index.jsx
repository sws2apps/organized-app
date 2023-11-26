import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@mui/material';

const CPEDialog = ({ open, onClose, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '.MuiPaper-root': {
          margin: { mobile: '16px', tablet: '24px', desktop: '32px' },
        },
      }}
      PaperProps={{
        className: 'pop-up-shadow',
        style: {
          maxWidth: '560px',
          borderRadius: 'var(--radius-xxl)',
          backgroundColor: 'var(--white)',
        },
      }}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: 'var(--accent-dark-overlay)',
          },
        },
      }}
    >
      <DialogContent
        sx={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

CPEDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

export default CPEDialog;
