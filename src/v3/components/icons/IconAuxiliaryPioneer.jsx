import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconAuxiliaryPioneer = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3298_119083"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3298_119083)">
          <path
            d="M6.69224 22.4999V14.9096L3.35571 9.49998L7.67299 2.5H16.3268L20.6441 9.49998L17.3075 14.9096V22.4999L11.9999 20.7019L6.69224 22.4999ZM8.19221 20.3788L11.9999 19.1115L15.8076 20.3788V16.5H8.19221V20.3788ZM8.50951 3.99998L5.10951 9.49998L8.50951 15H15.4903L18.8903 9.49998L15.4903 3.99998H8.50951ZM10.9499 13.2192L7.75569 10.05L8.82489 8.98078L10.9499 11.1058L15.1749 6.85578L16.2441 7.89998L10.9499 13.2192Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconAuxiliaryPioneer.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconAuxiliaryPioneer;
