import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconApplications = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2697_32419"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2697_32419)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.5 23C18.9853 23 21 20.9853 21 18.5C21 16.0147 18.9853 14 16.5 14C14.0147 14 12 16.0147 12 18.5C12 20.9853 14.0147 23 16.5 23ZM17.9206 16.9745C17.9206 17.7749 17.2718 18.4237 16.4715 18.4237C15.6711 18.4237 15.0223 17.7749 15.0223 16.9745C15.0223 16.1742 15.6711 15.5254 16.4715 15.5254C17.2718 15.5254 17.9206 16.1742 17.9206 16.9745ZM18.9599 20.2416C18.3886 20.991 17.4865 21.4746 16.4715 21.4746C15.4564 21.4746 14.5543 20.991 13.983 20.2416C14.6958 19.7677 15.5514 19.4915 16.4715 19.4915C17.3916 19.4915 18.2472 19.7676 18.9599 20.2416Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.6087 15.75H7.25V14.25H11.5818C11.1924 14.7002 10.8638 15.2045 10.6087 15.75ZM10.0189 19H5.3077C5.23077 19 5.16024 18.9679 5.09612 18.9038C5.03202 18.8397 4.99997 18.7692 4.99997 18.6923V3.3077C4.99997 3.23077 5.03202 3.16024 5.09612 3.09613C5.16024 3.03203 5.23077 2.99998 5.3077 2.99998H12.5V7.49995H17V12.0189C17.5194 12.0585 18.0218 12.159 18.5 12.3135V6.74995L13.25 1.5H5.3077C4.80257 1.5 4.375 1.675 4.025 2.025C3.675 2.375 3.5 2.80257 3.5 3.3077V18.6923C3.5 19.1974 3.675 19.625 4.025 19.975C4.375 20.325 4.80257 20.5 5.3077 20.5H10.3135C10.159 20.0218 10.0585 19.5194 10.0189 19ZM14.75 12.2383V11.25H7.25V12.75H13.4662C13.8707 12.5361 14.3005 12.3637 14.75 12.2383Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconApplications.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconApplications;
