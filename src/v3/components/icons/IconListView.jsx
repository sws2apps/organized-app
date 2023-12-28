import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconListView = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-list-view" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2982_68633"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2982_68633)">
          <path
            d="M3.5 21.5V20.3077H6V19.25H4.5V18.0577H6V17H3.5V15.8077H6.34615C6.5859 15.8077 6.78686 15.8887 6.94903 16.0509C7.11121 16.2131 7.1923 16.4141 7.1923 16.6538V17.8461C7.1923 18.0859 7.11121 18.2868 6.94903 18.449C6.78686 18.6112 6.5859 18.6923 6.34615 18.6923C6.5859 18.6923 6.78686 18.7733 6.94903 18.9355C7.11121 19.0977 7.1923 19.2987 7.1923 19.5384V20.6538C7.1923 20.8935 7.11121 21.0945 6.94903 21.2567C6.78686 21.4189 6.5859 21.5 6.34615 21.5H3.5ZM3.5 14.8461V12.25C3.5 12.0102 3.58109 11.8093 3.74327 11.6471C3.90546 11.4849 4.10642 11.4038 4.34615 11.4038H6V10.3461H3.5V9.15383H6.34615C6.5859 9.15383 6.78686 9.23492 6.94903 9.3971C7.11121 9.55928 7.1923 9.76024 7.1923 9.99998V11.75C7.1923 11.9897 7.11121 12.1907 6.94903 12.3529C6.78686 12.515 6.5859 12.5961 6.34615 12.5961H4.6923V13.6538H7.1923V14.8461H3.5ZM5 8.1923V3.6923H3.5V2.5H6.1923V8.1923H5ZM9.3077 18.75V17.25H20.5V18.75H9.3077ZM9.3077 12.75V11.25H20.5V12.75H9.3077ZM9.3077 6.74995V5.25H20.5V6.74995H9.3077Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconListView.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconListView;
