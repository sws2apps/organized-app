import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconUndo = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-undo" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2697_32275"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2697_32275)">
          <path
            d="M7.20193 18.5V17H14.3789C15.4224 17 16.3205 16.6554 17.0731 15.9663C17.8256 15.2772 18.2019 14.4262 18.2019 13.4134C18.2019 12.4006 17.8256 11.5513 17.0731 10.8654C16.3205 10.1795 15.4224 9.8365 14.3789 9.8365H7.35762L10.1403 12.6192L9.08652 13.673L4.5 9.08652L9.08652 4.5L10.1403 5.55383L7.35762 8.33655H14.3789C15.8417 8.33655 17.0945 8.82468 18.1375 9.80095C19.1804 10.7772 19.7019 11.9814 19.7019 13.4134C19.7019 14.8455 19.1804 16.0512 18.1375 17.0307C17.0945 18.0102 15.8417 18.5 14.3789 18.5H7.20193Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconUndo.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconUndo;
