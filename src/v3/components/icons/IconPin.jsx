import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconPin = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3885_132119"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3885_132119)">
          <path
            d="M13.8245 14.7327L13.8921 17.261L12.8602 18.3496L9.56636 15.2275L5.78278 19.2193L4.72252 19.2477L4.69415 18.1874L8.47773 14.1957L5.18384 11.0735L6.21572 9.9849L8.74405 9.9172L13.7051 4.68322L12.9793 3.99529L14.0112 2.90664L20.5431 9.09797L19.5113 10.1866L18.7855 9.49869L13.8245 14.7327ZM7.76772 11.456L12.3401 15.7899L12.2966 14.1642L17.6968 8.46681L14.7937 5.71509L9.39349 11.4124L7.76772 11.456Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconPin.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconPin;
