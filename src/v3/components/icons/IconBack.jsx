import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconBack = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-back" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3114_66176"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3114_66176)">
          <path
            d="M9.99039 17.6442L4.34619 12L9.99039 6.35583L11.0346 7.40004L7.21919 11.2501H19.6538V12.75H7.20959L11.0596 16.6L9.99039 17.6442Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconBack.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconBack;
