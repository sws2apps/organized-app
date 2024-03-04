import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconWork = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-work" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3258_161976"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3258_161976)">
          <path
            d="M18.6574 21.9757C18.5369 21.9757 18.4248 21.9564 18.3209 21.918C18.2171 21.8795 18.1184 21.8135 18.0248 21.7199L12.9824 16.6872C12.8889 16.5936 12.8228 16.4949 12.7844 16.3911C12.7459 16.2872 12.7267 16.175 12.7267 16.0545C12.7267 15.934 12.7459 15.8218 12.7844 15.718C12.8228 15.6141 12.8889 15.5154 12.9824 15.4218L14.8767 13.5276C14.9703 13.434 15.069 13.368 15.1728 13.3296C15.2767 13.2911 15.3889 13.2719 15.5094 13.2719C15.6299 13.2719 15.742 13.2911 15.8459 13.3296C15.9497 13.368 16.0485 13.434 16.142 13.5276L21.1843 18.5699C21.2779 18.6635 21.344 18.7622 21.3824 18.8661C21.4209 18.9699 21.4401 19.0821 21.4401 19.2026C21.4401 19.3231 21.4209 19.4353 21.3824 19.5392C21.344 19.643 21.2779 19.7417 21.1843 19.8353L19.2901 21.7199C19.1965 21.8135 19.0978 21.8795 18.994 21.918C18.8901 21.9564 18.778 21.9757 18.6574 21.9757ZM18.6574 20.2642L19.719 19.2026L15.5247 15.0084L14.4632 16.0699L18.6574 20.2642ZM5.31709 21.9911C5.19658 21.9911 5.08183 21.9693 4.97287 21.9257C4.86388 21.8821 4.7626 21.8135 4.66902 21.7199L2.79019 19.8507C2.69659 19.7571 2.628 19.6558 2.58442 19.5469C2.54083 19.4379 2.51904 19.3231 2.51904 19.2026C2.51904 19.0821 2.54083 18.9683 2.58442 18.8613C2.628 18.7542 2.69659 18.6539 2.79019 18.5603L8.01327 13.3372H10.119L10.9306 12.5257L6.74787 8.343H5.32287L2.54789 5.56803L5.02672 3.0892L7.80169 5.86418V7.28918L11.9844 11.4719L14.9421 8.51418L13.4824 7.05455L14.7478 5.78918H12.2017L11.6459 5.24303L14.8401 2.04883L15.3863 2.59495V5.1507L16.6516 3.88533L20.4132 7.62765C20.6773 7.88535 20.8763 8.17895 21.0103 8.50843C21.1443 8.83791 21.2113 9.18663 21.2113 9.55458C21.2113 9.87765 21.1555 10.1889 21.044 10.4882C20.9324 10.7876 20.7703 11.0597 20.5574 11.3046L18.4709 9.218L17.0613 10.6276L16.0017 9.568L11.1632 14.4065V16.5161L5.94977 21.7199C5.85618 21.8135 5.75747 21.8821 5.65362 21.9257C5.54978 21.9693 5.43761 21.9911 5.31709 21.9911ZM5.31709 20.2546L9.90364 15.668V14.6064H8.84209L4.25552 19.193L5.31709 20.2546ZM5.31709 20.2546L4.25552 19.193L4.79399 19.7161L5.31709 20.2546Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconWork;
