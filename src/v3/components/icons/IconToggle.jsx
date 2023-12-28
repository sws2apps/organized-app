import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconToggle = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-toggle" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
        <ellipse cx="9.31666" cy="9" rx="9.00001" ry="9" fill={color} />
      </svg>
    </SvgIcon>
  );
};

IconToggle.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconToggle;
