import { themeOptionsState } from '@states/app';
import { getCSSPropertyValue } from '@utils/common';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

const useSVGAsImage = ({ src }: { src: string }) => {
  const theme = useRecoilValue(themeOptionsState);

  const [encodedSVG, setEncodedSVG] = useState<string>('');

  const convertSvgToBase64 = async (svgUrl: string): Promise<string> => {
    try {
      const response = await fetch(svgUrl);
      let svgText = await response.text();
      const regex = /var\(--([^)]*)\)/g;
      let match;

      while ((match = regex.exec(svgText)) !== null) {
        const varName = match[1];
        const value = getCSSPropertyValue(`--${varName}`);
        svgText = svgText.replace(match[0], value);
      }

      const encodedSvg = encodeURIComponent(svgText)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');

      return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
    } catch (error) {
      console.error('Error fetching or converting SVG:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchAndConvert = async () => {
      const base64 = await convertSvgToBase64(src);
      setEncodedSVG(base64);
    };

    fetchAndConvert();
  }, [src, theme]);

  return {
    encodedSVG,
  };
};

export default useSVGAsImage;
