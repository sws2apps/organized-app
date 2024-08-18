import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconManageAccounts = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-manage-accounts ${className}`}
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
          id="mask0_2538_43144"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2538_43144)">
          <path
            d="M9.99997 11.6928C9.03749 11.6928 8.21354 11.3501 7.52813 10.6647C6.84271 9.97928 6.5 9.15533 6.5 8.19285C6.5 7.23035 6.84271 6.4064 7.52813 5.721C8.21354 5.03558 9.03749 4.69287 9.99997 4.69287C10.9625 4.69287 11.7864 5.03558 12.4718 5.721C13.1572 6.4064 13.5 7.23035 13.5 8.19285C13.5 9.15533 13.1572 9.97928 12.4718 10.6647C11.7864 11.3501 10.9625 11.6928 9.99997 11.6928ZM2.5 19.3082V17.0851C2.5 16.58 2.62885 16.1226 2.88655 15.713C3.14423 15.3034 3.50384 14.9864 3.96537 14.7621C4.79616 14.348 5.69359 14.0021 6.65768 13.7246C7.62178 13.447 8.73587 13.3082 9.99997 13.3082H10.2923C10.373 13.3082 10.4602 13.3185 10.5538 13.339C10.4525 13.5749 10.3689 13.8153 10.3028 14.0601C10.2368 14.305 10.182 14.5544 10.1385 14.8082H9.99997C8.84869 14.8082 7.82947 14.9406 6.9423 15.2053C6.05512 15.4701 5.29229 15.7684 4.65383 16.1005C4.42691 16.2223 4.2612 16.3646 4.1567 16.5274C4.05222 16.6903 3.99998 16.8762 3.99998 17.0851V17.8082H10.3C10.3743 18.062 10.4708 18.3197 10.5894 18.5812C10.708 18.8428 10.8384 19.0851 10.9807 19.3082H2.5ZM16.1058 20.0485L15.8827 18.7216C15.6442 18.6511 15.4199 18.5588 15.2096 18.4447C14.9993 18.3306 14.7993 18.1876 14.6096 18.0158L13.3423 18.4562L12.6308 17.2466L13.6654 16.4005C13.5936 16.1415 13.5577 15.8864 13.5577 15.6351C13.5577 15.3838 13.5936 15.1287 13.6654 14.8697L12.6404 14.0043L13.3519 12.7948L14.6096 13.2448C14.7929 13.073 14.9913 12.9316 15.2048 12.8207C15.4183 12.7098 15.6442 12.6191 15.8827 12.5486L16.1058 11.2217H17.5288L17.7423 12.5486C17.9807 12.6191 18.2067 12.7124 18.4201 12.8284C18.6336 12.9444 18.832 13.0935 19.0153 13.2755L20.273 12.7948L20.9845 14.0351L19.9595 14.9005C20.0313 15.141 20.0672 15.3915 20.0672 15.652C20.0672 15.9125 20.0313 16.162 19.9595 16.4005L20.9942 17.2466L20.2826 18.4562L19.0153 18.0158C18.8256 18.1876 18.6256 18.3306 18.4153 18.4447C18.2051 18.5588 17.9807 18.6511 17.7423 18.7216L17.5288 20.0485H16.1058ZM16.8085 17.5389C17.3323 17.5389 17.7804 17.3524 18.1529 16.9794C18.5253 16.6064 18.7115 16.1581 18.7115 15.6343C18.7115 15.1105 18.525 14.6624 18.152 14.2899C17.779 13.9175 17.3306 13.7313 16.8068 13.7313C16.283 13.7313 15.8349 13.9178 15.4625 14.2908C15.09 14.6638 14.9038 15.1122 14.9038 15.636C14.9038 16.1598 15.0903 16.6079 15.4633 16.9803C15.8363 17.3527 16.2847 17.5389 16.8085 17.5389ZM9.99997 10.1928C10.55 10.1928 11.0208 9.99701 11.4125 9.60535C11.8041 9.21368 12 8.74285 12 8.19285C12 7.64285 11.8041 7.17201 11.4125 6.78035C11.0208 6.38868 10.55 6.19285 9.99997 6.19285C9.44997 6.19285 8.97914 6.38868 8.58747 6.78035C8.19581 7.17201 7.99997 7.64285 7.99997 8.19285C7.99997 8.74285 8.19581 9.21368 8.58747 9.60535C8.97914 9.99701 9.44997 10.1928 9.99997 10.1928Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconManageAccounts;
