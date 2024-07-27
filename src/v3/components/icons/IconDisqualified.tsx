import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconDisqualified = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-disqualified"
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
          id="mask0_3201_167637"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3201_167637)">
          <path
            d="M17.4 12.6543L16.3461 11.6005L18.4307 9.50052L16.3461 7.42552L17.4 6.35632L19.5 8.45632L21.575 6.35632L22.6442 7.42552L20.5538 9.50052L22.6442 11.6005L21.575 12.6543L19.5 10.5793L17.4 12.6543ZM8.99995 11.6928C8.03747 11.6928 7.21352 11.3501 6.5281 10.6647C5.84268 9.97928 5.49997 9.15533 5.49997 8.19285C5.49997 7.23035 5.84268 6.4064 6.5281 5.721C7.21352 5.03558 8.03747 4.69287 8.99995 4.69287C9.96243 4.69287 10.7864 5.03558 11.4718 5.721C12.1572 6.4064 12.4999 7.23035 12.4999 8.19285C12.4999 9.15533 12.1572 9.97928 11.4718 10.6647C10.7864 11.3501 9.96243 11.6928 8.99995 11.6928ZM1.5 19.3082V17.0851C1.5 16.5954 1.633 16.1419 1.899 15.7246C2.16503 15.3073 2.52048 14.9864 2.96535 14.7621C3.95382 14.2775 4.95093 13.914 5.9567 13.6717C6.96247 13.4294 7.97688 13.3082 8.99995 13.3082C10.023 13.3082 11.0374 13.4294 12.0432 13.6717C13.049 13.914 14.0461 14.2775 15.0345 14.7621C15.4794 14.9864 15.8349 15.3073 16.1009 15.7246C16.3669 16.1419 16.4999 16.5954 16.4999 17.0851V19.3082H1.5ZM2.99995 17.8082H15V17.0851C15 16.8826 14.9413 16.6951 14.824 16.5226C14.7067 16.3502 14.5474 16.2095 14.3461 16.1005C13.4846 15.6761 12.6061 15.3547 11.7107 15.1361C10.8152 14.9175 9.91165 14.8082 8.99995 14.8082C8.08825 14.8082 7.18468 14.9175 6.28925 15.1361C5.39382 15.3547 4.51533 15.6761 3.6538 16.1005C3.45252 16.2095 3.29323 16.3502 3.17593 16.5226C3.05861 16.6951 2.99995 16.8826 2.99995 17.0851V17.8082ZM8.99995 10.1928C9.54995 10.1928 10.0208 9.99701 10.4124 9.60535C10.8041 9.21368 11 8.74285 11 8.19285C11 7.64285 10.8041 7.17201 10.4124 6.78035C10.0208 6.38868 9.54995 6.19285 8.99995 6.19285C8.44995 6.19285 7.97912 6.38868 7.58745 6.78035C7.19578 7.17201 6.99995 7.64285 6.99995 8.19285C6.99995 8.74285 7.19578 9.21368 7.58745 9.60535C7.97912 9.99701 8.44995 10.1928 8.99995 10.1928Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDisqualified;
