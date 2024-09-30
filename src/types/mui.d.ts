import { BreakpointOverrides } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    mobile400: true;
    tablet: true;
    tablet500: true;
    tablet600: true;
    tablet688: true;
    laptop: true;
    desktop: true;
    desktopLarge: true;
  }
}

declare module '@mui/material/styles/createTheme' {
  interface ThemeOptions {
    breakpoint?: BreakpointOverrides;
  }
}
