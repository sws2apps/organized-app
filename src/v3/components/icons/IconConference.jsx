import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconConference = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-conference" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3885_131898"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3885_131898)">
          <path
            d="M4.54815 19.5C4.04302 19.5 3.61545 19.325 3.26545 18.975C2.91547 18.625 2.74048 18.1974 2.74048 17.6923V6.3077C2.74048 5.80257 2.91547 5.375 3.26545 5.025C3.61545 4.675 4.04302 4.5 4.54815 4.5H15.9327C16.4378 4.5 16.8654 4.675 17.2154 5.025C17.5654 5.375 17.7404 5.80257 17.7404 6.3077V10.8846L21.2596 7.36543V16.6345L17.7404 13.1153V17.6923C17.7404 18.1974 17.5654 18.625 17.2154 18.975C16.8654 19.325 16.4378 19.5 15.9327 19.5H4.54815ZM4.54815 18H15.9327C16.0225 18 16.0962 17.9711 16.1539 17.9134C16.2116 17.8557 16.2404 17.782 16.2404 17.6923V6.3077C16.2404 6.21795 16.2116 6.14423 16.1539 6.08652C16.0962 6.02882 16.0225 5.99998 15.9327 5.99998H4.54815C4.4584 5.99998 4.38468 6.02882 4.32698 6.08652C4.26928 6.14423 4.24043 6.21795 4.24043 6.3077V17.6923C4.24043 17.782 4.26928 17.8557 4.32698 17.9134C4.38468 17.9711 4.4584 18 4.54815 18Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconConference.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconConference;
