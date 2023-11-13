import PropTypes from 'prop-types';

const IconNext = ({ color = '#222222', width = 24, height = 24 }) => {
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
        id="mask0_3114_66177"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_3114_66177)">
        <path
          d="M14.0096 17.6442L12.9404 16.6L16.7904 12.75H4.34619V11.2501H16.7808L12.9654 7.40004L14.0096 6.35583L19.6538 12L14.0096 17.6442Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconNext.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconNext;
