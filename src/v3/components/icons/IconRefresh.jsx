import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconRefresh = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-refresh" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2706_33636"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2706_33636)">
          <path
            d="M12.0412 19.9587C9.79639 19.9587 7.89497 19.1839 6.33698 17.6342C4.77899 16.0845 4 14.1932 4 11.9604C4 9.72749 4.77899 7.83567 6.33698 6.28491C7.89497 4.73413 9.79639 3.95874 12.0412 3.95874C13.2949 3.95874 14.4811 4.23601 15.6 4.79056C16.7189 5.34508 17.6495 6.12765 18.3917 7.13827V3.95874H20V10.4818H13.4433V8.88182H17.6784C17.1134 7.85208 16.3299 7.04079 15.3278 6.44795C14.3258 5.85513 13.2302 5.55872 12.0412 5.55872C10.2543 5.55872 8.73538 6.18094 7.48452 7.42539C6.23366 8.66984 5.60823 10.181 5.60823 11.9587C5.60823 13.7365 6.23366 15.2476 7.48452 16.4921C8.73538 17.7365 10.2543 18.3588 12.0412 18.3588C13.4172 18.3588 14.6591 17.9676 15.767 17.1854C16.8749 16.4032 17.6523 15.3721 18.099 14.0921H19.7938C19.3072 15.8329 18.3488 17.2459 16.9185 18.3311C15.4883 19.4162 13.8625 19.9587 12.0412 19.9587Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconRefresh.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconRefresh;
