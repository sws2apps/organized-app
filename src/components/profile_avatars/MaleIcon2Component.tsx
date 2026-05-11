import { SVGProps } from 'react';

const COMPONENT_NAME = (props: SVGProps<SVGSVGElement>) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Accent circle + face/body silhouette + eye cutouts (evenodd compound) */}
