import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconImportJson = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-import-json ${className}`}
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
          id="mask0_11572_288536"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_11572_288536)">
          <path
            d="M6.30775 21.5C5.80258 21.5 5.375 21.325 5.025 20.975C4.675 20.625 4.5 20.1974 4.5 19.6923V4.30775C4.5 3.80258 4.675 3.375 5.025 3.025C5.375 2.675 5.80258 2.5 6.30775 2.5H14.8652L19.5 7.13475V19.6923C19.5 20.1974 19.325 20.625 18.975 20.975C18.625 21.325 18.1974 21.5 17.6923 21.5H6.30775ZM6.30775 20H17.6923C17.7692 20 17.8398 19.9679 17.9038 19.9038C17.9679 19.8398 18 19.7693 18 19.6923V7.8845H14.1155V4H6.30775C6.23075 4 6.16025 4.03208 6.09625 4.09625C6.03208 4.16025 6 4.23075 6 4.30775V19.6923C6 19.7693 6.03208 19.8398 6.09625 19.9038C6.16025 19.9679 6.23075 20 6.30775 20ZM12 18.6057C13.0142 18.6057 13.8702 18.2429 14.5682 17.5173C15.2662 16.7916 15.6152 15.9204 15.6152 14.9038V10.6152H14.1155V14.9038C14.1155 15.5051 13.9126 16.0224 13.5068 16.4557C13.1009 16.8891 12.5987 17.1058 12 17.1058C11.4115 17.1058 10.9118 16.8891 10.501 16.4557C10.09 16.0224 9.8845 15.5051 9.8845 14.9038V9.423C9.8845 9.21533 9.95058 9.04 10.0827 8.897C10.2147 8.75417 10.3763 8.68275 10.5673 8.68275C10.7686 8.68275 10.9328 8.75417 11.0598 8.897C11.1866 9.04 11.25 9.21533 11.25 9.423V14.9038H12.75V9.423C12.75 8.80633 12.5404 8.27883 12.1213 7.8405C11.7019 7.402 11.1839 7.18275 10.5673 7.18275C9.95058 7.18275 9.43267 7.402 9.0135 7.8405C8.59433 8.27883 8.38475 8.80633 8.38475 9.423V14.9038C8.38475 15.9204 8.73633 16.7916 9.4395 17.5173C10.1427 18.2429 10.9962 18.6057 12 18.6057Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconImportJson;
