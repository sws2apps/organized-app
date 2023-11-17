import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconHome = ({ color = '#222222', width = 24, height = 24 }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon sx={{ width: `${width}px`, height: `${height}px` }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3114_66203"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3114_66203)">
          <path
            d="M5.99997 19H9.34615V13.0577H14.6538V19H18V10L12 5.48079L5.99997 10V19ZM4.5 20.5V9.25004L12 3.60583L19.5 9.25004V20.5H13.1538V14.5577H10.8461V20.5H4.5Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconHome.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconHome;
