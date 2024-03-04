import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCircuitOverseer = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-circuit-overseer" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2515_25886"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2515_25886)">
          <path
            d="M10.9712 12.1159L17.6808 5.39674C17.8359 5.2416 18.0116 5.16404 18.2077 5.16404C18.4039 5.16404 18.5795 5.2416 18.7346 5.39674C18.8898 5.55185 18.9673 5.72749 18.9673 5.92364C18.9673 6.11979 18.8898 6.29542 18.7346 6.45054L12.0404 13.1601L10.9712 12.1159ZM13.3693 14.5044L19.3635 8.49479C19.5186 8.33967 19.6968 8.26211 19.8981 8.26211C20.0994 8.26211 20.2776 8.33967 20.4327 8.49479C20.5878 8.64992 20.6654 8.82812 20.6654 9.02939C20.6654 9.23067 20.5878 9.40888 20.4327 9.56401L14.4289 15.5582L13.3693 14.5044ZM5.4866 18.9948C4.05968 17.5678 3.34782 15.855 3.35102 13.8563C3.35424 11.8576 4.07251 10.1416 5.50582 8.70826L8.43852 5.77556L9.67312 7.01979C9.82184 7.1685 9.94107 7.3278 10.0308 7.49769C10.1206 7.66755 10.1943 7.848 10.252 8.03904L13.9135 4.36211C14.0686 4.20699 14.2468 4.12944 14.4481 4.12944C14.6494 4.12944 14.8276 4.20699 14.9827 4.36211C15.1378 4.51724 15.2154 4.69544 15.2154 4.89671C15.2154 5.09799 15.1378 5.27619 14.9827 5.43131L10.6481 9.76594L8.80195 11.6063L9.28657 12.0909C9.98914 12.7935 10.3302 13.6364 10.3096 14.6198C10.2891 15.6031 9.92246 16.4511 9.20965 17.164L9.1135 17.2601L8.0539 16.2063L8.14045 16.1101C8.55583 15.6948 8.77635 15.2005 8.802 14.6274C8.82763 14.0544 8.63276 13.5601 8.21737 13.1447L7.31162 12.2544C7.13086 12.0736 7.04047 11.8585 7.04047 11.6092C7.04047 11.3598 7.13086 11.1448 7.31162 10.964L8.58277 9.71786C8.81482 9.48581 8.93085 9.20664 8.93085 8.88036C8.93085 8.55406 8.81482 8.27489 8.58277 8.04284L8.43852 7.89859L6.55965 9.76786C5.41991 10.9076 4.84524 12.2698 4.83562 13.8544C4.82601 15.439 5.39106 16.8012 6.5308 17.9409C7.67055 19.0807 9.04011 19.6505 10.6395 19.6505C12.2388 19.6505 13.6084 19.0807 14.7481 17.9409L20.3962 12.2775C20.5513 12.1224 20.7295 12.0448 20.9308 12.0448C21.1321 12.0448 21.3103 12.1224 21.4654 12.2775C21.6205 12.4326 21.6981 12.6108 21.6981 12.8121C21.6981 13.0134 21.6205 13.1916 21.4654 13.3467L15.7923 18.9948C14.359 20.4281 12.6414 21.1447 10.6395 21.1447C8.63756 21.1447 6.91993 20.4281 5.4866 18.9948ZM16.6346 22.9005L16.625 21.3851C17.802 21.3851 18.8061 20.9694 19.6375 20.138C20.4689 19.3066 20.8846 18.3024 20.8846 17.1255L22.4 17.1351C22.4 18.7313 21.8381 20.0912 20.7144 21.2149C19.5907 22.3386 18.2308 22.9005 16.6346 22.9005ZM1.6001 7.86594C1.6001 6.2698 2.16196 4.90988 3.28567 3.78616C4.40939 2.66244 5.76931 2.10059 7.36545 2.10059L7.37507 3.61594C6.19814 3.61594 5.19397 4.03164 4.36257 4.86306C3.53116 5.69446 3.11545 6.69863 3.11545 7.87556L1.6001 7.86594Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCircuitOverseer;
