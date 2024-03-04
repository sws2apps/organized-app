import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconPerson = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-person" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2639_26316"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2639_26316)">
          <path
            d="M12 12.1928C11.0375 12.1928 10.2135 11.8501 9.52813 11.1647C8.84271 10.4793 8.5 9.65533 8.5 8.69285C8.5 7.73035 8.84271 6.9064 9.52813 6.221C10.2135 5.53558 11.0375 5.19287 12 5.19287C12.9625 5.19287 13.7864 5.53558 14.4718 6.221C15.1572 6.9064 15.5 7.73035 15.5 8.69285C15.5 9.65533 15.1572 10.4793 14.4718 11.1647C13.7864 11.8501 12.9625 12.1928 12 12.1928ZM4.5 19.8082V17.5851C4.5 17.0954 4.63302 16.6419 4.89905 16.2246C5.16507 15.8073 5.52051 15.4864 5.96537 15.2621C6.95384 14.7775 7.95096 14.414 8.95672 14.1717C9.96249 13.9294 10.9769 13.8082 12 13.8082C13.023 13.8082 14.0375 13.9294 15.0432 14.1717C16.049 14.414 17.0461 14.7775 18.0346 15.2621C18.4794 15.4864 18.8349 15.8073 19.1009 16.2246C19.3669 16.6419 19.5 17.0954 19.5 17.5851V19.8082H4.5ZM5.99997 18.3082H18V17.5851C18 17.3826 17.9413 17.1951 17.824 17.0226C17.7067 16.8502 17.5474 16.7095 17.3461 16.6005C16.4846 16.1761 15.6061 15.8547 14.7107 15.6361C13.8152 15.4175 12.9117 15.3082 12 15.3082C11.0883 15.3082 10.1847 15.4175 9.28927 15.6361C8.39384 15.8547 7.51536 16.1761 6.65382 16.6005C6.45254 16.7095 6.29325 16.8502 6.17595 17.0226C6.05863 17.1951 5.99997 17.3826 5.99997 17.5851V18.3082ZM12 10.6928C12.55 10.6928 13.0208 10.497 13.4125 10.1053C13.8041 9.71368 14 9.24285 14 8.69285C14 8.14285 13.8041 7.67201 13.4125 7.28035C13.0208 6.88868 12.55 6.69285 12 6.69285C11.45 6.69285 10.9791 6.88868 10.5875 7.28035C10.1958 7.67201 9.99997 8.14285 9.99997 8.69285C9.99997 9.24285 10.1958 9.71368 10.5875 10.1053C10.9791 10.497 11.45 10.6928 12 10.6928Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPerson;
