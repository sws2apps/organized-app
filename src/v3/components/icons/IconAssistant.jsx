import PropTypes from 'prop-types';

const IconAssistant = ({ color = '#222222', width = 24, height = 24 }) => {
  width = width.toString();
  height = height.toString();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_3106_63388"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_3106_63388)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.21153 19.5L12 22.2884L14.7884 19.5H18.6923C19.1974 19.5 19.625 19.325 19.975 18.975C20.325 18.625 20.5 18.1974 20.5 17.6923V4.3077C20.5 3.80257 20.325 3.375 19.975 3.025C19.625 2.675 19.1974 2.5 18.6923 2.5H5.3077C4.80257 2.5 4.375 2.675 4.025 3.025C3.675 3.375 3.5 3.80257 3.5 4.3077V17.6923C3.5 18.1974 3.675 18.625 4.025 18.975C4.375 19.325 4.80257 19.5 5.3077 19.5H9.21153ZM5 17.0423C4.99999 17.0423 4.99998 17.0423 4.99997 17.0423V4.30768C4.99997 4.30643 4.99998 4.30519 5 4.30396V4.29994C5 4.13425 5.13431 3.99994 5.3 3.99994H18.7C18.8657 3.99994 19 4.13425 19 4.29994V17.6999C19 17.8656 18.8657 17.9999 18.7 17.9999H17.5577V18H6.44225V17.9999H5.3C5.13431 17.9999 5 17.8656 5 17.6999L5 17.0423Z"
          fill={color}
        />
        <path
          d="M12 6L13.3505 9.64955L17 11L13.3505 12.3505L12 16L10.6495 12.3505L7 11L10.6495 9.64955L12 6Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconAssistant.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconAssistant;
