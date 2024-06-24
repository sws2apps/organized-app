import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconWatchtowerStudy = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-watchtower-study" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.24414 4.92493C3.24414 4.44188 3.63573 4.05029 4.11878 4.05029H8.15688C8.63993 4.05029 9.03152 4.44188 9.03152 4.92493V7.3546H10.0788V4.92493C10.0788 4.44188 10.4703 4.05029 10.9534 4.05029H14.7873C15.2704 4.05029 15.662 4.44188 15.662 4.92493V7.3546H16.7092V4.92493C16.7092 4.44188 17.1008 4.05029 17.5838 4.05029H21.046C21.5291 4.05029 21.9207 4.44188 21.9207 4.92493V7.3546H22.9679V4.92493C22.9679 4.44188 23.3595 4.05029 23.8426 4.05029H27.8807C28.3637 4.05029 28.7553 4.44188 28.7553 4.92493V13.5501C28.7553 14.0332 28.3637 14.4248 27.8807 14.4248H26.8966V16.2349C26.8966 16.7179 26.505 17.1095 26.022 17.1095H24.6662V27.076C24.6662 27.559 24.2746 27.9506 23.7916 27.9506H8.24917C7.76612 27.9506 7.37453 27.559 7.37453 27.076V17.1095H5.85355C5.3705 17.1095 4.97891 16.7179 4.97891 16.2349V14.4248H4.11878C3.63573 14.4248 3.24414 14.0332 3.24414 13.5501V4.92493ZM4.79905 5.6052V12.8698H5.65918C6.14223 12.8698 6.53382 13.2614 6.53382 13.7445V15.5546H8.05481C8.53786 15.5546 8.92945 15.9462 8.92945 16.4292V26.3957H23.1113V16.4292C23.1113 15.9462 23.5029 15.5546 23.9859 15.5546H25.3417V13.7445C25.3417 13.2614 25.7333 12.8698 26.2163 12.8698H27.2004V5.6052H24.5228V8.03487C24.5228 8.51792 24.1312 8.90951 23.6482 8.90951H21.2404C20.7574 8.90951 20.3658 8.51792 20.3658 8.03487V5.6052H18.2641V8.03487C18.2641 8.51792 17.8725 8.90951 17.3895 8.90951H14.9817C14.4986 8.90951 14.1071 8.51792 14.1071 8.03487V5.6052H11.6337V8.03487C11.6337 8.51792 11.2421 8.90951 10.759 8.90951H8.35125C7.8682 8.90951 7.47661 8.51792 7.47661 8.03487V5.6052H4.79905Z"
          fill={color}
        />
      </svg>
    </SvgIcon>
  );
};

export default IconWatchtowerStudy;
