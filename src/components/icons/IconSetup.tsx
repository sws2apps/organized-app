import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSetup = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-setup ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_2704_32182"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2704_32182)">
          <path
            d="M9.69245 21.5004L9.31168 18.4543C9.04373 18.3645 8.76905 18.2389 8.48763 18.0774C8.20621 17.9158 7.9546 17.7427 7.7328 17.5581L4.91165 18.7504L2.604 14.7505L5.04438 12.9062C5.0213 12.7575 5.00495 12.6082 4.99533 12.4582C4.98571 12.3082 4.9809 12.1588 4.9809 12.0101C4.9809 11.8678 4.98571 11.7232 4.99533 11.5764C5.00495 11.4296 5.0213 11.269 5.04438 11.0947L2.604 9.25046L4.91165 5.26974L7.72318 6.45244C7.96421 6.26141 8.22159 6.08672 8.4953 5.92839C8.76904 5.77004 9.03795 5.64279 9.30205 5.54664L9.69245 2.50049H14.3078L14.6885 5.55626C14.9885 5.66523 15.26 5.79247 15.503 5.93799C15.7459 6.08351 15.9911 6.25499 16.2386 6.45244L19.0886 5.26974L21.3962 9.25046L19.5462 10.6505C19.2629 10.5248 18.9728 10.4171 18.676 10.3274C18.3792 10.2377 18.0687 10.171 17.7443 10.1274L19.4347 8.85046L18.4501 7.15046L15.9366 8.21009C15.602 7.85239 15.2011 7.53636 14.7338 7.26201C14.2664 6.98765 13.7937 6.79341 13.3155 6.67931L13.0001 4.00046H11.0155L10.6847 6.66969C10.1745 6.79021 9.7033 6.97482 9.27125 7.22354C8.8392 7.47226 8.42703 7.79277 8.03473 8.18509L5.5501 7.15046L4.56548 8.85046L6.7251 10.4601C6.64177 10.6973 6.58344 10.944 6.5501 11.2005C6.51677 11.4569 6.5001 11.7268 6.5001 12.0101C6.5001 12.2703 6.51677 12.5255 6.5501 12.7755C6.58344 13.0255 6.63856 13.2723 6.71548 13.5158L4.56548 15.1505L5.5501 16.8505L8.0251 15.8005C8.32767 16.103 8.64786 16.3668 8.98568 16.5918C9.32351 16.8168 9.6905 17.0011 10.0867 17.1447C10.1161 17.9857 10.2911 18.778 10.6117 19.5216C10.9322 20.2652 11.361 20.9248 11.8982 21.5004H9.69245ZM10.4867 14.5927C10.5674 14.3427 10.6626 14.1036 10.7722 13.8754C10.8818 13.6472 11.0059 13.4267 11.1443 13.2139C10.9482 13.0806 10.7937 12.9082 10.6809 12.6966C10.568 12.4851 10.5116 12.253 10.5116 12.0005C10.5116 11.5838 10.6575 11.2296 10.9491 10.938C11.2408 10.6463 11.595 10.5005 12.0116 10.5005C12.2578 10.5005 12.4908 10.5578 12.7107 10.6726C12.9305 10.7873 13.1071 10.9428 13.2405 11.1389C13.4533 11.0005 13.6728 10.878 13.8991 10.7716C14.1254 10.6652 14.3603 10.5768 14.6039 10.5062C14.3488 10.0498 13.9914 9.68478 13.5318 9.41106C13.0722 9.13735 12.5655 9.00049 12.0116 9.00049C11.1693 9.00049 10.4588 9.29247 9.87993 9.87644C9.3011 10.4604 9.01168 11.1684 9.01168 12.0005C9.01168 12.5505 9.1434 13.0562 9.40685 13.5178C9.67032 13.9793 10.0303 14.3376 10.4867 14.5927ZM16.8847 19.6254L19.6251 16.8851L16.8847 14.1447L16.2616 14.7678L17.9463 16.4428H14.1347V17.3274H17.9213L16.2616 19.0024L16.8847 19.6254ZM16.8847 21.5004C15.6104 21.5004 14.5225 21.0498 13.6213 20.1485C12.72 19.2472 12.2694 18.1594 12.2694 16.8851C12.2694 15.6107 12.72 14.5229 13.6213 13.6216C14.5225 12.7204 15.6104 12.2697 16.8847 12.2697C18.1591 12.2697 19.2469 12.7204 20.1482 13.6216C21.0494 14.5229 21.5001 15.6107 21.5001 16.8851C21.5001 18.1594 21.0494 19.2472 20.1482 20.1485C19.2469 21.0498 18.1591 21.5004 16.8847 21.5004Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSetup;
