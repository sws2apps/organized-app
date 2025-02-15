import useSVGAsImage from './useSVGAsImage';
import { SVGAsImageProps } from './index.types';

/**
 * A React component that converts an SVG source into an encoded image and renders it.
 *
 *  @component
 *  @param {SVGAsImageProps} props - The properties for the component.
 *
 *  @returns {JSX.Element} The rendered image element.
 */
const SVGAsImage = (props: SVGAsImageProps) => {
  const { encodedSVG } = useSVGAsImage({ src: props.src });

  return <img src={encodedSVG} alt={props.alt} style={props.style} />;
};

export default SVGAsImage;
