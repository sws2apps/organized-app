import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconCreate = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-create" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2473_21947"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_21947)">
          <path
            d="M8.95382 11.3539L11.1711 9.12116L9.4442 7.37884L8.31535 8.50769L7.26153 7.45387L8.375 6.32501L6.8365 4.78651L4.6038 7.01921L8.95382 11.3539ZM16.9711 19.3865L19.2038 17.1538L17.6653 15.6154L16.5365 16.7288L15.4827 15.675L16.5961 14.5461L14.8634 12.8288L12.6461 15.0461L16.9711 19.3865ZM7.2019 20.5H3.5V16.7981L7.88462 12.4135L2.5 7.01921L6.8365 2.68274L12.2557 8.09234L16.3769 3.95579C16.532 3.80066 16.7026 3.68591 16.8885 3.61156C17.0743 3.5372 17.2686 3.50001 17.4711 3.50001C17.6737 3.50001 17.8679 3.5372 18.0538 3.61156C18.2397 3.68591 18.4102 3.80066 18.5653 3.95579L20.0442 5.47887C20.1993 5.634 20.3125 5.80451 20.3836 5.99039C20.4548 6.17629 20.4903 6.37052 20.4903 6.57309C20.4903 6.77564 20.4548 6.9657 20.3836 7.14326C20.3125 7.32081 20.1993 7.48716 20.0442 7.64229L15.9422 11.7692L21.3172 17.1635L16.9808 21.5L11.5865 16.1153L7.2019 20.5ZM4.99997 19H6.56345L16.3731 9.20576L14.7942 7.62689L4.99997 17.4365V19ZM15.5961 8.41921L14.7942 7.62689L16.3731 9.20576L15.5961 8.41921Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconCreate.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconCreate;
