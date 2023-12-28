import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconLanguage = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-language" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2473_22725"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_22725)">
          <path
            d="M11.9193 21.2307L16.1231 10.1539H18.05L22.2538 21.2307H20.3269L19.3538 18.4115H14.8693L13.8654 21.2307H11.9193ZM15.4308 16.7961H18.7423L17.1269 12.2308H17.0462L15.4308 16.7961ZM4.63468 18.4615L3.33085 17.1577L7.9962 12.4923C7.41415 11.85 6.90486 11.1827 6.46833 10.4904C6.0318 9.79811 5.65135 9.07055 5.327 8.30774H7.2539C7.53467 8.86285 7.83146 9.36125 8.14428 9.80291C8.4571 10.2446 8.83594 10.7128 9.2808 11.2077C9.96285 10.4654 10.5279 9.70708 10.976 8.93271C11.4241 8.15836 11.7987 7.33465 12.1 6.46159H1.86548V4.61544H8.32698V2.76929H10.1731V4.61544H16.6346V6.46159H13.9462C13.6218 7.54875 13.1837 8.6074 12.6318 9.63754C12.0798 10.6677 11.3975 11.6359 10.5847 12.5423L12.7923 14.8L12.1 16.6961L9.25005 13.8462L4.63468 18.4615Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconLanguage.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconLanguage;
