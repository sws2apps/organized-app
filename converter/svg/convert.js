// this file is used to convert exported svg icon files from Figma to React components

import fs from 'fs/promises';
import path from 'path';

const ROOT_FOLDER = './converter/svg/sources';
const OUTPUT_FOLDER = './src/components/icons';

const currentFiles = await fs.readdir(OUTPUT_FOLDER);
for await (const file of currentFiles) {
  await fs.unlink(path.join(OUTPUT_FOLDER, file));
}

const svgFiles = await fs.readdir(ROOT_FOLDER);

let strImport = '';

const specialIcons = [
  'IconGoogle',
  'IconMicrosoft',
  'IconYahoo',
  'IconLogo',
  'IconMale',
  'IconFemale',
  'IconPersonPlaceholder',
];

const directionalIcons = [
  'IconArrowBack',
  'IconBack',
  'IconArrowLink',
  'IconChevronLeft',
  'IconChevronRight',
  'IconMoveBack',
  'IconMoveForward',
  'IconNavigateLeft',
  'IconNavigateRight',
  'IconNext',
  'IconReturn',
];

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

  let data = `import { SvgIcon, SxProps, Theme${
    directionalIcons.includes(componentName) ? ', useTheme' : ''
  } } from '@mui/material';

  type IconProps = {
    color?: string;
    width?: number;
    height?: number;
    sx?: SxProps<Theme>;
    className?: string
  };

  const ${componentName} = ({ ${
    !specialIcons.includes(componentName) ? `color = '#222222', ` : ''
  }width = 24, height = 24, sx = {}, className }: IconProps) => {${
    directionalIcons.includes(componentName)
      ? `\n    const theme = useTheme();`
      : ''
  }
    return (
      <SvgIcon className={} sx={{ width: widthPx, height: heightPx, animation, transform, ...sx }}>`;

  data = data.replace('widthPx', '`${width}px`');
  data = data.replace('heightPx', '`${height}px`');
  data = data.replace(
    'className={}',
    'className={`organized-icon-${iconName} ${className}`}'
  );

  if (componentName === 'IconLoading') {
    data = data.replace(
      ' animation,',
      ' animation: "rotate 2s linear infinite",'
    );
  } else {
    data = data.replace(' animation,', '');
  }

  if (directionalIcons.includes(componentName)) {
    data = data.replace(
      ' transform,',
      " transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',"
    );
  } else {
    data = data.replace(' transform,', '');
  }

  data = data.replace('${iconName}', originalName);

  const filePath = path.join(ROOT_FOLDER, svgFile);
  let svgContent = await fs.readFile(filePath, 'utf-8');

  if (!specialIcons.includes(componentName)) {
    if (componentName === 'IconOnCircle') {
      svgContent = svgContent.replace(
        /fill=(?!"#D9D9D9"|"none"|"white"|"#FEFEFE")".*?"(?=\s|\/)/g,
        'fill={color}'
      );
    }
    if (componentName !== 'IconOnCircle') {
      svgContent = svgContent.replace(
        /fill=(?!"#D9D9D9"|"none"|"white")".*?"(?=\s|\/)/g,
        'fill={color}'
      );
    }

    svgContent = svgContent.replace(
      /stroke=(?!"#D9D9D9"|"none"|"white")".*?"(?=\s|\/)/g,
      'stroke={color}'
    );
  }

  svgContent = svgContent.replaceAll(
    'style="mask-type:alpha"',
    'style={{maskType:"alpha"}}'
  );
  svgContent = svgContent.replaceAll('fill-rule', 'fillRule');
  svgContent = svgContent.replaceAll('clip-rule', 'clipRule');
  svgContent = svgContent.replaceAll('clip-path', 'clipPath');
  svgContent = svgContent.replaceAll('stop-color', 'stopColor');
  svgContent = svgContent.replaceAll('stroke-width', 'strokeWidth');
  svgContent = svgContent.replaceAll('stroke-dasharray', 'strokeDasharray');

  data += svgContent;

  data += `
  </SvgIcon>);
  };

  export default ${componentName};`;

  const jsxFile = path.join('./src/components/icons', `${componentName}.tsx`);
  fs.writeFile(jsxFile, data);

  strImport += `export { default as ${componentName}} from './${componentName}';`;
}

const jsFile = path.join('./src/components/icons', `index.ts`);
fs.writeFile(jsFile, strImport);
