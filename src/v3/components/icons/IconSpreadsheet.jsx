import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconSpreadsheet = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2982_68401"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2982_68401)">
          <path
            d="M3.5 5.11538V3.5H5.11537V5.11538H3.5ZM7.34615 5.11538V3.5H8.9615V5.11538H7.34615ZM15.0385 5.11538V3.5H16.6538V5.11538H15.0385ZM18.8846 5.11538V3.5H20.5V5.11538H18.8846ZM3.5 8.9615V7.34615H5.11537V8.9615H3.5ZM18.8846 8.9615V7.34615H20.5V8.9615H18.8846ZM3.5 16.6538V15.0385H5.11537V16.6538H3.5ZM18.8846 16.6538V15.0385H20.5V16.6538H18.8846ZM3.5 20.5V18.8846H5.11537V20.5H3.5ZM7.34615 20.5V18.8846H8.9615V20.5H7.34615ZM15.0385 20.5V18.8846H16.6538V20.5H15.0385ZM18.8846 20.5V18.8846H20.5V20.5H18.8846ZM11.1923 20.5V12.8077H3.5V11.1923H11.1923V3.5H12.8077V11.1923H20.5V12.8077H12.8077V20.5H11.1923Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconSpreadsheet.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconSpreadsheet;
