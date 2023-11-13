import PropTypes from 'prop-types';

const IconReportSent = ({ color = '#222222', width = 24, height = 24 }) => {
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
        id="mask0_3463_279834"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_3463_279834)">
        <path
          d="M14.8518 21.9357L9.90186 16.9858L11.2775 15.6102L14.8043 19.137L22.5768 11.3645L23.9999 12.7876L14.8518 21.9357Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.41481 17.8749H3.34212C3.25237 17.8749 3.17865 17.846 3.12095 17.7883C3.06325 17.7306 3.0344 17.6569 3.0344 17.5671V4.18258C3.0344 4.09283 3.06325 4.0191 3.12095 3.9614C3.17865 3.9037 3.25237 3.87485 3.34212 3.87485H16.7267C16.8164 3.87485 16.8902 3.9037 16.9479 3.9614C17.0056 4.0191 17.0344 4.09283 17.0344 4.18258V12.8749V13.8533L18.5344 12.4766V4.18258C18.5344 3.68386 18.3578 3.2579 18.0046 2.9047C17.6514 2.55149 17.2254 2.37488 16.7267 2.37488H3.34212C2.84341 2.37488 2.41745 2.55149 2.06425 2.9047C1.71103 3.2579 1.53442 3.68386 1.53442 4.18258V17.5671C1.53442 18.0658 1.71103 18.4918 2.06425 18.845C2.41745 19.1982 2.84341 19.3748 3.34212 19.3748H8.83369L7.41481 17.8749ZM18.4901 17.7954C18.321 18.5856 17.685 19.2028 16.8848 19.3442L18.4901 17.7954ZM5.47675 11.1056V12.6056H10.0344V11.1056H5.47675ZM5.47675 7.12488V8.62483H14.5921V7.12488H5.47675Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconReportSent.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconReportSent;
