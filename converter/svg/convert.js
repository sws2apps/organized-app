// this file is used to convert exported svg icon files from Figma to React components

import fs from 'fs/promises';
import path from 'path';

const ROOT_FOLDER = './converter/svg/sources';
const OUTPUT_FOLDER = './src/v3/components/icons';

const currentFiles = await fs.readdir(OUTPUT_FOLDER);
for await (const file of currentFiles) {
  await fs.unlink(path.join(OUTPUT_FOLDER, file));
}

const svgFiles = await fs.readdir(ROOT_FOLDER);

let strImport = '';

for await (const svgFile of svgFiles) {
  const originalName = svgFile.replace('name=', '').replace('.svg', '');
  let componentName = originalName.replace(/-(\w)/g, (match, p1) => {
    return p1.toUpperCase();
  });
  componentName = componentName.replace(/_(\w)/g, (match, p1) => {
    return p1.toUpperCase();
  });
  componentName = componentName.replace(/^(.)/, function (match) {
    return match.toUpperCase();
  });

  componentName = `Icon${componentName}`;

  let data = `import { SvgIcon, SxProps, Theme } from '@mui/material';

  type IconProps = {
    color?: string;
    width?: number;
    height?: number;
    sx?: SxProps<Theme>;
  };

  const ${componentName} = ({ ${
    componentName !== 'IconGoogle' &&
    componentName !== 'IconMicrosoft' &&
    componentName !== 'IconYahoo' &&
    componentName !== 'IconLogo'
      ? `color = '#222222', `
      : ''
  }width = 24, height = 24, sx = {} }: IconProps) => {
    return (
      <SvgIcon id="organized-icon-${originalName}" sx={{ width: widthPx, height: heightPx, ...sx }}>`;

  data = data.replace('widthPx', '`${width}px`');
  data = data.replace('heightPx', '`${height}px`');

  const filePath = path.join(ROOT_FOLDER, svgFile);
  let svgContent = await fs.readFile(filePath, 'utf-8');

  if (
    componentName !== 'IconGoogle' &&
    componentName !== 'IconMicrosoft' &&
    componentName !== 'IconYahoo' &&
    componentName !== 'IconLogo'
  ) {
    if (componentName === 'IconOnCircle') {
      svgContent = svgContent.replace(/fill=(?!"#D9D9D9"|"none"|"white"|"#FEFEFE")".*?"(?=\s|\/)/g, 'fill={color}');
    }
    if (componentName !== 'IconOnCircle') {
      svgContent = svgContent.replace(/fill=(?!"#D9D9D9"|"none"|"white")".*?"(?=\s|\/)/g, 'fill={color}');
    }

    svgContent = svgContent.replace(/stroke=(?!"#D9D9D9"|"none"|"white")".*?"(?=\s|\/)/g, 'stroke={color}');
  }

  svgContent = svgContent.replaceAll('style="mask-type:alpha"', 'style={{maskType:"alpha"}}');
  svgContent = svgContent.replaceAll('fill-rule', 'fillRule');
  svgContent = svgContent.replaceAll('clip-rule', 'clipRule');
  svgContent = svgContent.replaceAll('clip-path', 'clipPath');
  svgContent = svgContent.replaceAll('stop-color', 'stopColor');
  svgContent = svgContent.replaceAll('stroke-width', 'strokeWidth');
  svgContent = svgContent.replaceAll('stroke-dasharray', 'strokeDasharray');

  if (componentName === 'IconLoading') {
    svgContent = svgContent.replace(
      '</g>',
      `<animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="2s"
          repeatCount="indefinite"
        />
      </g>`
    );
  }

  data += svgContent;

  data += `
  </SvgIcon>);
  };

  export default ${componentName};`;

  const jsxFile = path.join('./src/v3/components/icons', `${componentName}.tsx`);
  fs.writeFile(jsxFile, data);

  strImport += `export { default as ${componentName}} from './${componentName}';`;
}

const jsFile = path.join('./src/v3/components/icons', `index.ts`);
fs.writeFile(jsFile, strImport);
