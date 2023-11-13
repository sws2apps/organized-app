import PropTypes from 'prop-types';

const IconInformationBoard = ({ color = '#222222', width = 24, height = 24 }) => {
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
        id="mask0_3865_1882"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_3865_1882)">
        <path
          d="M4.3077 20.5C3.80257 20.5 3.375 20.325 3.025 19.975C2.675 19.625 2.5 19.1974 2.5 18.6923V5.3077C2.5 4.80257 2.675 4.375 3.025 4.025C3.375 3.675 3.80257 3.5 4.3077 3.5H19.6923C20.1974 3.5 20.625 3.675 20.975 4.025C21.325 4.375 21.5 4.80257 21.5 5.3077V18.6923C21.5 19.1974 21.325 19.625 20.975 19.975C20.625 20.325 20.1974 20.5 19.6923 20.5H4.3077ZM4.3077 19H19.6923C19.7692 19 19.8397 18.9679 19.9038 18.9038C19.9679 18.8397 20 18.7692 20 18.6923V5.3077C20 5.23077 19.9679 5.16024 19.9038 5.09613C19.8397 5.03203 19.7692 4.99998 19.6923 4.99998H4.3077C4.23077 4.99998 4.16024 5.03203 4.09613 5.09613C4.03202 5.16024 3.99998 5.23077 3.99998 5.3077V18.6923C3.99998 18.7692 4.03202 18.8397 4.09613 18.9038C4.16024 18.9679 4.23077 19 4.3077 19ZM6.38463 16.6153H17.6153V15.1154H6.38463V16.6153ZM6.38463 12.75H10.0769V7.38463H6.38463V12.75ZM12.2692 12.75H17.6153V11.25H12.2692V12.75ZM12.2692 8.88458H17.6153V7.38463H12.2692V8.88458Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconInformationBoard.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconInformationBoard;
