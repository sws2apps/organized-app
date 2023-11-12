import PropTypes from "prop-types";

const IconEdit = ({ color = "#222222", width = 24, height = 24 }) => {
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
        id="mask0_2538_44048"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2538_44048)">
        <path
          d="M4.99997 19H6.2615L16.4981 8.7634L15.2366 7.50188L4.99997 17.7385V19ZM3.5 20.5V17.1154L16.6904 3.93078C16.8416 3.79343 17.0086 3.68729 17.1913 3.61237C17.374 3.53746 17.5656 3.5 17.7661 3.5C17.9666 3.5 18.1608 3.53558 18.3488 3.60675C18.5368 3.6779 18.7032 3.79103 18.848 3.94615L20.0692 5.18268C20.2243 5.32754 20.3349 5.49424 20.4009 5.68278C20.4669 5.87129 20.5 6.05981 20.5 6.24833C20.5 6.44941 20.4656 6.64131 20.3969 6.82403C20.3283 7.00676 20.219 7.17373 20.0692 7.32495L6.88458 20.5H3.5ZM15.8563 8.1437L15.2366 7.50188L16.4981 8.7634L15.8563 8.1437Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconEdit.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconEdit;
