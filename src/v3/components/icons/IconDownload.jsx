import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconDownload = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-download" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2674_31400"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2674_31400)">
          <path
            d="M5.3077 22.4999C4.80257 22.4999 4.375 22.3249 4.025 21.9749C3.675 21.6249 3.5 21.1974 3.5 20.6923V3.3077C3.5 2.80257 3.675 2.375 4.025 2.025C4.375 1.675 4.80257 1.5 5.3077 1.5H12.0385V2.99998H5.3077C5.23077 2.99998 5.16024 3.03203 5.09613 3.09613C5.03202 3.16024 4.99997 3.23077 4.99997 3.3077V4.25H12.0385V5.74995H4.99997V18.25H15V16.25H16.5V20.6923C16.5 21.1974 16.325 21.625 15.975 21.975C15.625 22.325 15.1974 22.5 14.6922 22.5L5.3077 22.4999ZM4.99997 19.75V20.6923C4.99997 20.7692 5.03202 20.8397 5.09613 20.9039C5.16024 20.968 5.23077 21 5.3077 21H14.6922C14.7692 21 14.8397 20.968 14.9038 20.9039C14.9679 20.8397 15 20.7692 15 20.6923V19.75H4.99997ZM16 13.6442L11.3461 8.99035L12.4 7.93655L15.25 10.7866V3.25H16.75V10.7866L19.6 7.93655L20.6538 8.99035L16 13.6442Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconDownload.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconDownload;
