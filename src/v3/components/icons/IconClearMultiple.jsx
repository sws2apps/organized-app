import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconClearMultiple = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-clear-multiple" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3251_160506"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3251_160506)">
          <path
            d="M11.6499 13.1442L13.7499 11.0442L15.8499 13.1442L16.8941 12.1L14.7941 9.99998L16.8941 7.89998L15.8499 6.85578L13.7499 8.95578L11.6499 6.85578L10.6057 7.89998L12.7057 9.99998L10.6057 12.1L11.6499 13.1442ZM8.05765 17.5C7.55252 17.5 7.12496 17.325 6.77498 16.975C6.42498 16.625 6.24998 16.1974 6.24998 15.6923V4.3077C6.24998 3.80257 6.42498 3.375 6.77498 3.025C7.12496 2.675 7.55252 2.5 8.05765 2.5H19.4422C19.9473 2.5 20.3749 2.675 20.7249 3.025C21.0749 3.375 21.2499 3.80257 21.2499 4.3077V15.6923C21.2499 16.1974 21.0749 16.625 20.7249 16.975C20.3749 17.325 19.9473 17.5 19.4422 17.5H8.05765ZM8.05765 16H19.4422C19.5191 16 19.5897 15.9679 19.6538 15.9038C19.7179 15.8397 19.7499 15.7692 19.7499 15.6923V4.3077C19.7499 4.23077 19.7179 4.16024 19.6538 4.09613C19.5897 4.03203 19.5191 3.99998 19.4422 3.99998H8.05765C7.98072 3.99998 7.9102 4.03203 7.8461 4.09613C7.78198 4.16024 7.74993 4.23077 7.74993 4.3077V15.6923C7.74993 15.7692 7.78198 15.8397 7.8461 15.9038C7.9102 15.9679 7.98072 16 8.05765 16ZM4.55768 20.9999C4.05256 20.9999 3.625 20.8249 3.275 20.4749C2.925 20.1249 2.75 19.6973 2.75 19.1922V6.3077H4.24998V19.1922C4.24998 19.2692 4.28202 19.3397 4.34613 19.4038C4.41024 19.4679 4.48076 19.5 4.55768 19.5H17.4422V20.9999H4.55768Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconClearMultiple.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconClearMultiple;
