import PropTypes from 'prop-types';

const IconRegularPioneer = ({ color = '#222222', width = 24, height = 24 }) => {
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
        id="mask0_3298_119085"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_3298_119085)">
        <path
          d="M8.81152 21.8653L7.02692 18.8576L3.63847 18.1153L3.96925 14.6269L1.6731 12L3.96925 9.37309L3.63847 5.88464L7.02692 5.14234L8.81152 2.13464L12 3.48849L15.1884 2.13464L16.973 5.14234L20.3615 5.88464L20.0307 9.37309L22.3268 12L20.0307 14.6269L20.3615 18.1153L16.973 18.8576L15.1884 21.8653L12 20.5115L8.81152 21.8653ZM9.44997 19.95L12 18.8692L14.5807 19.95L16 17.55L18.75 16.9192L18.5 14.1L20.35 12L18.5 9.86922L18.75 7.04999L16 6.44999L14.55 4.04999L12 5.13077L9.4192 4.04999L7.99997 6.44999L5.24997 7.04999L5.49997 9.86922L3.64997 12L5.49997 14.1L5.24997 16.95L7.99997 17.55L9.44997 19.95ZM10.95 15.2038L16.2538 9.89999L15.2 8.81539L10.95 13.0654L8.79997 10.9462L7.74615 12L10.95 15.2038Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconRegularPioneer.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconRegularPioneer;
