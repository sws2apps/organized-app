import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconSave = ({ color = '#222222', width = 24, height = 24 }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon sx={{ width: `${width}px`, height: `${height}px` }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2557_53784"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2557_53784)">
          <path
            d="M20.5 7.21153V18.6923C20.5 19.1974 20.325 19.625 19.975 19.975C19.625 20.325 19.1974 20.5 18.6923 20.5H5.3077C4.80257 20.5 4.375 20.325 4.025 19.975C3.675 19.625 3.5 19.1974 3.5 18.6923V5.3077C3.5 4.80257 3.675 4.375 4.025 4.025C4.375 3.675 4.80257 3.5 5.3077 3.5H16.7884L20.5 7.21153ZM19 7.84998L16.15 4.99998H5.3077C5.21795 4.99998 5.14423 5.02883 5.08653 5.08653C5.02883 5.14423 4.99997 5.21795 4.99997 5.3077V18.6923C4.99997 18.782 5.02883 18.8557 5.08653 18.9134C5.14423 18.9711 5.21795 19 5.3077 19H18.6923C18.782 19 18.8557 18.9711 18.9134 18.9134C18.9711 18.8557 19 18.782 19 18.6923V7.84998ZM12 17.2692C12.6923 17.2692 13.282 17.0256 13.7692 16.5384C14.2564 16.0512 14.5 15.4615 14.5 14.7692C14.5 14.0769 14.2564 13.4872 13.7692 13C13.282 12.5128 12.6923 12.2692 12 12.2692C11.3077 12.2692 10.7179 12.5128 10.2308 13C9.74359 13.4872 9.5 14.0769 9.5 14.7692C9.5 15.4615 9.74359 16.0512 10.2308 16.5384C10.7179 17.0256 11.3077 17.2692 12 17.2692ZM6.38463 9.88458H14.5961V6.38463H6.38463V9.88458Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconSave.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconSave;
