import { Button, ButtonGroup as MuiButtonGroup } from '@mui/material';
import { ButtonGroupType } from './index.types';

const ButtonGroup = ({ buttons }: ButtonGroupType) => {
  return (
    <MuiButtonGroup
      sx={{
        minHeight: '32px',
        '& .MuiButtonGroup-lastButton': {
          marginLeft: 'unset !important',
        },
        '& .MuiButton-root': {
          border: '1px solid var(--accent-300)',
          color: 'var(--accent-400)',
          transition: 'background-color 0.8s ease',
        },
        '& .MuiButton-root.active': {
          border: '1px solid var(--accent-dark)',
          backgroundColor: 'var(--accent-200)',
          color: 'var(--accent-dark)',
        },
      }}
    >
      {buttons.map((button) => (
        <Button
          key={button.children.toString()}
          {...button}
          className={`${button.className} ${button.className === 'active' ? 'h4' : 'body-regular'}`}
          sx={{ padding: '0 20px' }}
        />
      ))}
    </MuiButtonGroup>
  );
};

export default ButtonGroup;
