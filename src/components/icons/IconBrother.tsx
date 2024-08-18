import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconBrother = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-brother ${className}`}
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
          id="mask0_2673_26610"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2673_26610)">
          <path
            d="M12.0938 17.2712L15 16.5005L15 19.5005L12.0937 18.6284L9 19.5005L9 16.5005L12.0938 17.2712Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.50727 10.8505C10.1787 11.522 10.9858 11.8577 11.9287 11.8577C12.8716 11.8577 13.6787 11.522 14.3502 10.8505C15.0216 10.1791 15.3573 9.37197 15.3573 8.42911C15.3573 7.48623 15.0216 6.67907 14.3502 6.00764C13.6787 5.3362 12.8716 5.00049 11.9287 5.00049C10.9858 5.00049 10.1787 5.3362 9.50727 6.00764C8.83584 6.67907 8.50012 7.48623 8.50012 8.42911C8.50012 9.37197 8.83584 10.1791 9.50727 10.8505ZM4 17.6796V19.561H5.13977L5.13982 18.1435H5.14286V17.6796C5.14286 17.4261 5.22455 17.188 5.38792 16.9653C5.55129 16.7426 5.7773 16.5543 6.06595 16.4005C7.00661 15.9448 7.97648 15.5957 8.97557 15.3532C9.97464 15.1107 10.9828 14.9895 12 14.9895C13.0173 14.9895 14.0254 15.1107 15.0245 15.3532C16.0236 15.5957 16.9935 15.9448 17.9341 16.4005C18.2228 16.5543 18.4488 16.7426 18.6122 16.9653C18.7755 17.188 18.8572 17.4261 18.8572 17.6796V18.1435H18.8692L18.8692 19.561H20.0001V17.6796C20.0001 17.2078 19.8627 16.7664 19.588 16.3554C19.3133 15.9444 18.9437 15.6254 18.4792 15.3983C17.4008 14.8811 16.3217 14.4931 15.2418 14.2345C14.162 13.9759 13.0814 13.8466 12 13.8466C10.9187 13.8466 9.83812 13.9759 8.75825 14.2345C7.6784 14.4931 6.59928 14.8811 5.52089 15.3983C5.05641 15.6254 4.68681 15.9444 4.41209 16.3554C4.13736 16.7664 4 17.2078 4 17.6796ZM13.543 10.0434C13.0954 10.491 12.5573 10.7148 11.9287 10.7148C11.3001 10.7148 10.762 10.491 10.3144 10.0434C9.8668 9.59578 9.64298 9.05768 9.64298 8.42911C9.64298 7.80053 9.8668 7.26243 10.3144 6.81481C10.762 6.36719 11.3001 6.14338 11.9287 6.14338C12.5573 6.14338 13.0954 6.36719 13.543 6.81481C13.9906 7.26243 14.2144 7.80053 14.2144 8.42911C14.2144 9.05768 13.9906 9.59578 13.543 10.0434Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconBrother;
