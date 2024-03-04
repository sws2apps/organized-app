import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconLanguageCourse = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-language-course" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2799_54677"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2799_54677)">
          <path
            d="M4.19227 14.6583H5.14418L5.70958 13.066H8.4442L9.02495 14.6583H9.9711L7.6038 8.36219H6.54995L4.19227 14.6583ZM6.01533 12.2372L7.05188 9.36987H7.10187L8.13842 12.2372H6.01533ZM13.9423 10.2468V8.93142C14.4858 8.67887 15.0547 8.48945 15.649 8.36317C16.2432 8.23689 16.8602 8.17375 17.4999 8.17375C17.9012 8.17375 18.291 8.20227 18.6692 8.25932C19.0474 8.31637 19.4269 8.39169 19.8076 8.48527V9.7391C19.4333 9.60833 19.0612 9.51345 18.6913 9.45447C18.3214 9.3955 17.9243 9.36602 17.4999 9.36602C16.8602 9.36602 16.2406 9.44198 15.6413 9.59389C15.0419 9.74583 14.4756 9.96346 13.9423 10.2468ZM13.9423 15.7275V14.393C14.473 14.1404 15.0403 13.951 15.6442 13.8247C16.248 13.6984 16.8666 13.6353 17.4999 13.6353C17.9012 13.6353 18.291 13.6638 18.6692 13.7208C19.0474 13.7779 19.4269 13.8532 19.8076 13.9468V15.2006C19.4333 15.0699 19.0612 14.975 18.6913 14.916C18.3214 14.857 17.9243 14.8275 17.4999 14.8275C16.8602 14.8275 16.2406 14.9042 15.6413 15.0574C15.0419 15.2106 14.4756 15.434 13.9423 15.7275ZM13.9423 12.9968V11.6622C14.4858 11.4096 15.0547 11.2202 15.649 11.0939C16.2432 10.9676 16.8602 10.9045 17.4999 10.9045C17.9012 10.9045 18.291 10.933 18.6692 10.9901C19.0474 11.0471 19.4269 11.1224 19.8076 11.216V12.4699C19.4333 12.3391 19.0612 12.2442 18.6913 12.1852C18.3214 12.1263 17.9243 12.0968 17.4999 12.0968C16.8602 12.0968 16.2406 12.176 15.6413 12.3343C15.0419 12.4926 14.4756 12.7135 13.9423 12.9968ZM6.49995 16.5199C7.32817 16.5199 8.13394 16.6138 8.91727 16.8016C9.70061 16.9894 10.4782 17.284 11.25 17.6853V7.8545C10.5474 7.39681 9.78715 7.05354 8.9692 6.82469C8.15125 6.59584 7.32817 6.48142 6.49995 6.48142C5.89995 6.48142 5.33938 6.52853 4.81823 6.62274C4.29708 6.71698 3.7615 6.87114 3.2115 7.08524C3.13457 7.11089 3.08008 7.14776 3.04803 7.19585C3.01597 7.24393 2.99995 7.29681 2.99995 7.3545V16.8122C2.99995 16.9019 3.032 16.9676 3.0961 17.0093C3.16022 17.051 3.23074 17.0558 3.30768 17.0237C3.78203 16.8622 4.28266 16.7378 4.80957 16.6506C5.33649 16.5635 5.89995 16.5199 6.49995 16.5199ZM12.7499 17.6853C13.5217 17.284 14.2993 16.9894 15.0826 16.8016C15.866 16.6138 16.6717 16.5199 17.4999 16.5199C18.0999 16.5199 18.6634 16.5635 19.1903 16.6506C19.7172 16.7378 20.2179 16.8622 20.6922 17.0237C20.7692 17.0558 20.8397 17.051 20.9038 17.0093C20.9679 16.9676 21 16.9019 21 16.8122V7.3545C21 7.29681 20.9839 7.24553 20.9519 7.20065C20.9198 7.15576 20.8653 7.11729 20.7884 7.08524C20.2384 6.87114 19.7028 6.71698 19.1817 6.62274C18.6605 6.52853 18.0999 6.48142 17.4999 6.48142C16.6717 6.48142 15.8486 6.59584 15.0307 6.82469C14.2127 7.05354 13.4525 7.39681 12.7499 7.8545V17.6853ZM11.9999 19.8852C11.1935 19.2904 10.3237 18.8307 9.39032 18.5064C8.45699 18.182 7.49353 18.0198 6.49995 18.0198C5.8897 18.0198 5.29035 18.0875 4.7019 18.2227C4.11343 18.358 3.54613 18.557 2.99998 18.8198C2.64358 18.9839 2.30447 18.958 1.98267 18.7419C1.66089 18.5259 1.5 18.2198 1.5 17.8237V6.96605C1.5 6.75066 1.55544 6.54842 1.66633 6.35932C1.77723 6.17022 1.93717 6.034 2.14615 5.95067C2.82307 5.62119 3.52851 5.37728 4.26248 5.21895C4.99644 5.06061 5.74227 4.98145 6.49995 4.98145C7.47303 4.98145 8.42368 5.11446 9.35188 5.38049C10.2801 5.64651 11.1628 6.03914 11.9999 6.55837C12.8371 6.03914 13.7198 5.64651 14.648 5.38049C15.5762 5.11446 16.5269 4.98145 17.4999 4.98145C18.2576 4.98145 19.0035 5.06061 19.7374 5.21895C20.4714 5.37728 21.1768 5.62119 21.8538 5.95067C22.0627 6.034 22.2227 6.17022 22.3336 6.35932C22.4445 6.54842 22.4999 6.75066 22.4999 6.96605V17.8237C22.4999 18.2198 22.3326 18.5227 21.998 18.7323C21.6634 18.9419 21.3115 18.9647 20.9422 18.8006C20.4025 18.5442 19.8432 18.35 19.2643 18.2179C18.6855 18.0859 18.0974 18.0198 17.4999 18.0198C16.5064 18.0198 15.5429 18.182 14.6096 18.5064C13.6762 18.8307 12.8064 19.2904 11.9999 19.8852Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLanguageCourse;
