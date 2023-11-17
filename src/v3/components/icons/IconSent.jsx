import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconSent = ({ color = '#222222', width = 24, height = 24 }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon sx={{ width: `${width}px`, height: `${height}px` }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2936_42672"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2936_42672)">
          <path
            d="M15.7192 21.6346L11.8154 17.7308L12.8692 16.677L15.7192 19.5269L21.3884 13.8577L22.4423 14.9115L15.7192 21.6346ZM12 11L19.8461 5.99998H4.15383L12 11ZM12 12.5576L3.99998 7.44225V17.6923C3.99998 17.782 4.02883 17.8557 4.08653 17.9134C4.14423 17.9711 4.21795 18 4.3077 18H9.27498L10.775 19.5H4.3077C3.80257 19.5 3.375 19.325 3.025 18.975C2.675 18.625 2.5 18.1974 2.5 17.6923V6.3077C2.5 5.80257 2.675 5.375 3.025 5.025C3.375 4.675 3.80257 4.5 4.3077 4.5H19.6923C20.1974 4.5 20.625 4.675 20.975 5.025C21.325 5.375 21.5 5.80257 21.5 6.3077V10.9462L20 12.4461V7.44225L12 12.5576Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconSent.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconSent;
