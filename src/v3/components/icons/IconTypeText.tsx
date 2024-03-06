import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconTypeText = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-type-text" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2979680"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2979680)">
          <path
            d="M3.28941 18.7916H0.866211L6.06687 4.28076H8.73806L13.9387 18.7916H11.5155L7.45561 6.98737H7.34224L3.28941 18.7916ZM3.61533 13.1091H11.1754V15.0009H3.61533V13.1091Z"
            fill={color}
          />
          <path
            d="M17.7577 18.9045C17.0763 18.9045 16.4603 18.7785 15.9095 18.5264C15.3635 18.2744 14.9294 17.908 14.6074 17.4273C14.29 16.9419 14.1313 16.3469 14.1313 15.6421C14.1313 15.0307 14.2457 14.529 14.4744 14.137C14.7077 13.7449 15.0228 13.4346 15.4195 13.2059C15.8162 12.9725 16.2572 12.7975 16.7426 12.6808C17.2327 12.5641 17.7344 12.4755 18.2478 12.4148C18.8872 12.3401 19.4053 12.2794 19.802 12.2328C20.2033 12.1814 20.495 12.0997 20.6771 11.9877C20.8591 11.8757 20.9501 11.6937 20.9501 11.4417V11.3927C20.9501 10.7999 20.7821 10.3402 20.446 10.0135C20.11 9.68681 19.6129 9.52346 18.9549 9.52346C18.2641 9.52346 17.7204 9.67515 17.3237 9.97851C16.9317 10.2772 16.661 10.6156 16.5116 10.9936L14.4674 10.5666C14.6914 9.91317 15.0251 9.38111 15.4685 8.9704C15.9165 8.55969 16.4369 8.25866 17.0297 8.0673C17.6271 7.87595 18.2595 7.78027 18.9269 7.78027C19.3749 7.78027 19.8416 7.83395 20.327 7.94129C20.8171 8.04397 21.2745 8.23066 21.6992 8.50135C22.1239 8.76738 22.4693 9.14542 22.7353 9.63547C23.0013 10.1255 23.1343 10.7533 23.1343 11.5187V18.6735H21.0131V17.2033H20.9291C20.7937 17.4787 20.5884 17.747 20.313 18.0084C20.0423 18.2697 19.6946 18.4844 19.2699 18.6525C18.8499 18.8205 18.3458 18.9045 17.7577 18.9045ZM18.2548 17.1893C18.8195 17.1893 19.3026 17.0773 19.704 16.8533C20.11 16.6292 20.4204 16.3375 20.6351 15.9782C20.8497 15.6141 20.9571 15.2221 20.9571 14.802V13.4369C20.8824 13.5116 20.7401 13.5792 20.53 13.6399C20.3247 13.7006 20.089 13.7543 19.823 13.8009C19.5616 13.8429 19.3049 13.8803 19.0529 13.9129C18.8009 13.9456 18.5908 13.9736 18.4228 13.9969C18.0214 14.053 17.6574 14.1416 17.3307 14.263C17.004 14.3797 16.7426 14.55 16.5466 14.774C16.3553 14.9934 16.2596 15.2851 16.2596 15.6491C16.2596 16.1578 16.4463 16.5429 16.8196 16.8043C17.1977 17.0609 17.6761 17.1893 18.2548 17.1893Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconTypeText;
