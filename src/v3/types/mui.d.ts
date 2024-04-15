import { BreakpointOverrides } from '@mui/system/createTheme/createBreakpoints';

declare module '@mui/system/createTheme/createBreakpoints' {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    tablet: true;
    tablet600: true;
    tablet688: true;
    laptop: true;
    desktop: true;
  }
}

declare module '@mui/material/styles/createTheme' {
  interface ThemeOptions {
    breakpoint?: BreakpointOverrides;
  }
}
