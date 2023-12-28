import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconArrowLink = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-arrow-link" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2976_38562"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2976_38562)">
          <path
            d="M6.2942 17.6442L5.25 16.6L15.0904 6.74995H6.14422V5.25H17.6442V16.75H16.1442V7.80378L6.2942 17.6442Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconArrowLink.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconArrowLink;
