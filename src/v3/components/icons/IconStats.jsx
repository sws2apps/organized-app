import PropTypes from "prop-types";

const IconStats = ({ color = "#222222", width = 24, height = 24 }) => {
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
        id="mask0_2457_20498"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2457_20498)">
        <path
          d="M7.39997 21.6538L6.34615 20.6L12.9 14.0308L16.4 17.5308L21.575 12.3558L22.6442 13.425L16.4 19.6538L12.9 16.1538L7.39997 21.6538ZM4.3077 20.5C3.80257 20.5 3.375 20.325 3.025 19.975C2.675 19.625 2.5 19.1974 2.5 18.6923V5.3077C2.5 4.80257 2.675 4.375 3.025 4.025C3.375 3.675 3.80257 3.5 4.3077 3.5H17.6923C18.1974 3.5 18.625 3.675 18.975 4.025C19.325 4.375 19.5 4.80257 19.5 5.3077V9.5077H3.99998V18.6923C3.99998 18.7692 4.03202 18.8397 4.09612 18.9038C4.16024 18.9679 4.23077 19 4.3077 19V20.5ZM3.99998 8.00773H18V5.3077C18 5.23077 17.9679 5.16024 17.9038 5.09613C17.8397 5.03203 17.7692 4.99998 17.6923 4.99998H4.3077C4.23077 4.99998 4.16024 5.03203 4.09612 5.09613C4.03202 5.16024 3.99998 5.23077 3.99998 5.3077V8.00773Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconStats.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconStats;
