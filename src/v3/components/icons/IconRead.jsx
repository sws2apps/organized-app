import PropTypes from "prop-types";

const IconRead = ({ color = "#222222", width = 24, height = 24 }) => {
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
        id="mask0_2538_45293"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2538_45293)">
        <path
          d="M6.70005 18L1.05005 12.35L2.47505 10.95L8.12505 16.6L6.70005 18ZM12.35 18L6.70005 12.35L8.10005 10.925L12.35 15.175L21.55 5.97498L22.95 7.39998L12.35 18ZM12.35 12.35L10.925 10.95L15.875 5.99998L17.3 7.39998L12.35 12.35Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconRead.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconRead;
