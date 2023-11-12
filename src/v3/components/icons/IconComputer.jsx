import PropTypes from "prop-types";

const IconComputer = ({ color = "#222222", width = 24, height = 24 }) => {
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
        id="mask0_2704_31558"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2704_31558)">
        <path
          d="M8.5 20.5V19H10.5V17H4.3077C3.80257 17 3.375 16.825 3.025 16.475C2.675 16.125 2.5 15.6974 2.5 15.1923V5.3077C2.5 4.80257 2.675 4.375 3.025 4.025C3.375 3.675 3.80257 3.5 4.3077 3.5H19.6923C20.1974 3.5 20.625 3.675 20.975 4.025C21.325 4.375 21.5 4.80257 21.5 5.3077V15.1923C21.5 15.6974 21.325 16.125 20.975 16.475C20.625 16.825 20.1974 17 19.6923 17H13.5V19H15.5V20.5H8.5ZM4.3077 15.5H19.6923C19.7692 15.5 19.8397 15.468 19.9038 15.4039C19.9679 15.3398 20 15.2692 20 15.1923V5.3077C20 5.23077 19.9679 5.16024 19.9038 5.09613C19.8397 5.03203 19.7692 4.99998 19.6923 4.99998H4.3077C4.23077 4.99998 4.16024 5.03203 4.09613 5.09613C4.03202 5.16024 3.99998 5.23077 3.99998 5.3077V15.1923C3.99998 15.2692 4.03202 15.3398 4.09613 15.4039C4.16024 15.468 4.23077 15.5 4.3077 15.5Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconComputer.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconComputer;
