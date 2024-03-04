import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconPermissionsPending = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-permissions-pending" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_7075_168279"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_7075_168279)">
          <path
            d="M12 16.2505C13.1805 16.2505 14.184 15.8375 15.0104 15.0113C15.8368 14.1851 16.25 13.1819 16.25 12.0017C16.25 10.8215 15.8368 9.81788 15.0104 8.99096C14.184 8.16405 13.1805 7.75059 12 7.75059V8.94286C12.8525 8.94286 13.5753 9.24014 14.1683 9.83469C14.7612 10.4292 15.0577 11.1512 15.0577 12.0006C15.0577 12.8499 14.7604 13.5719 14.1659 14.1664C13.5713 14.761 12.8493 15.0583 12 15.0583C11.4617 15.0583 10.9602 14.923 10.4953 14.6525C10.0305 14.382 9.6551 14.0179 9.3692 13.5602L8.3577 14.1698C8.75128 14.8134 9.26693 15.3211 9.90465 15.6929C10.5424 16.0646 11.2408 16.2505 12 16.2505ZM8.34613 12.9179C8.54997 12.9179 8.72273 12.8471 8.8644 12.7054C9.00607 12.5637 9.0769 12.391 9.0769 12.1871C9.0769 11.9833 9.00607 11.8105 8.8644 11.6688C8.72273 11.5272 8.54837 11.4563 8.34132 11.4563C8.13427 11.4563 7.96152 11.5253 7.82305 11.6631C7.6846 11.801 7.61537 11.9754 7.61537 12.1862C7.61537 12.3971 7.68439 12.5717 7.82243 12.7102C7.96046 12.8487 8.13503 12.9179 8.34613 12.9179ZM8.8673 10.8275C9.07113 10.8275 9.24388 10.7583 9.38555 10.6198C9.52722 10.4813 9.59805 10.3086 9.59805 10.1015C9.59805 9.89449 9.52903 9.72013 9.391 9.57846C9.25297 9.4368 9.0784 9.36596 8.8673 9.36596C8.65618 9.36596 8.48161 9.4368 8.34357 9.57846C8.20554 9.72013 8.13652 9.89449 8.13652 10.1015C8.13652 10.3086 8.20736 10.4813 8.34903 10.6198C8.49069 10.7583 8.66345 10.8275 8.8673 10.8275ZM10.298 9.43326C10.5019 9.43326 10.6747 9.36243 10.8163 9.22076C10.958 9.0791 11.0288 8.90634 11.0288 8.70249C11.0288 8.49864 10.958 8.32588 10.8163 8.18421C10.6747 8.04255 10.5003 7.97171 10.2932 7.97171C10.0862 7.97171 9.91344 8.04065 9.77497 8.17851C9.63652 8.31638 9.5673 8.49074 9.5673 8.70159C9.5673 8.91246 9.63632 9.08711 9.77435 9.22556C9.91238 9.36403 10.0869 9.43326 10.298 9.43326ZM12 21.9813C9.83716 21.3916 8.04646 20.1185 6.62787 18.1621C5.20929 16.2057 4.5 14.0185 4.5 11.6006V5.84674L12 3.03906L19.5 5.84674V11.6006C19.5 14.0185 18.7907 16.2057 17.3721 18.1621C15.9535 20.1185 14.1628 21.3916 12 21.9813ZM12 20.4006C13.7333 19.8506 15.1666 18.7506 16.3 17.1006C17.4333 15.4506 18 13.6172 18 11.6006V6.87556L12 4.63519L5.99997 6.87556V11.6006C5.99997 13.6172 6.56664 15.4506 7.69997 17.1006C8.83331 18.7506 10.2666 19.8506 12 20.4006Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPermissionsPending;
