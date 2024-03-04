import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconShow = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-show" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_5125_42609"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5125_42609)">
          <path
            d="M12.0023 16.0774C13.1354 16.0774 14.0978 15.6808 14.8895 14.8876C15.6811 14.0944 16.077 13.1313 16.077 11.9982C16.077 10.8651 15.6804 9.90273 14.8872 9.11106C14.094 8.3194 13.1309 7.92356 11.9978 7.92356C10.8647 7.92356 9.90234 8.32015 9.11067 9.11331C8.31901 9.9065 7.92317 10.8696 7.92317 12.0027C7.92317 13.1358 8.31976 14.0982 9.11293 14.8899C9.90611 15.6815 10.8692 16.0774 12.0023 16.0774ZM12.0001 14.7005C11.2501 14.7005 10.6126 14.438 10.0876 13.913C9.56258 13.388 9.30007 12.7505 9.30007 12.0005C9.30007 11.2505 9.56258 10.613 10.0876 10.088C10.6126 9.56296 11.2501 9.30046 12.0001 9.30046C12.7501 9.30046 13.3876 9.56296 13.9126 10.088C14.4376 10.613 14.7001 11.2505 14.7001 12.0005C14.7001 12.7505 14.4376 13.388 13.9126 13.913C13.3876 14.438 12.7501 14.7005 12.0001 14.7005ZM12.0014 19.0004C9.70183 19.0004 7.60651 18.3661 5.71547 17.0976C3.82446 15.829 2.43216 14.1299 1.53857 12.0005C2.43216 9.87098 3.82401 8.17195 5.71412 6.90336C7.60422 5.63478 9.69908 5.00049 11.9987 5.00049C14.2983 5.00049 16.3936 5.63478 18.2847 6.90336C20.1757 8.17195 21.568 9.87098 22.4616 12.0005C21.568 14.1299 20.1761 15.829 18.286 17.0976C16.3959 18.3661 14.3011 19.0004 12.0014 19.0004ZM12.0001 17.5005C13.8834 17.5005 15.6126 17.0046 17.1876 16.013C18.7626 15.0213 19.9667 13.6838 20.8001 12.0005C19.9667 10.3171 18.7626 8.97963 17.1876 7.98796C15.6126 6.9963 13.8834 6.50046 12.0001 6.50046C10.1167 6.50046 8.38757 6.9963 6.81257 7.98796C5.23757 8.97963 4.03341 10.3171 3.20007 12.0005C4.03341 13.6838 5.23757 15.0213 6.81257 16.013C8.38757 17.0046 10.1167 17.5005 12.0001 17.5005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconShow;
