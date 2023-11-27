// this file is used to convert exported svg icon files from Figma to React components

import fs from 'fs/promises';
import path from 'path';

const ROOT_FOLDER = './converter/svg/sources';

const svgFiles = await fs.readdir(ROOT_FOLDER);

let strImport = '';

for await (const svgFile of svgFiles) {
	let componentName = svgFile.replace('name=', '').replace('.svg', '');
	componentName = componentName.replace(/-(\w)/g, (match, p1) => {
		return p1.toUpperCase();
	});
	componentName = componentName.replace(/_(\w)/g, (match, p1) => {
		return p1.toUpperCase();
	});
	componentName = componentName.replace(/^(.)/, function (match) {
		return match.toUpperCase();
	});

	componentName = `Icon${componentName}`;

	let data = `import PropTypes from 'prop-types';
  import { SvgIcon } from '@mui/material';

  const ${componentName} = ({ ${
		componentName !== 'IconGoogle' &&
		componentName !== 'IconMicrosoft' &&
		componentName !== 'IconYahoo' &&
		componentName !== 'IconLogo'
			? `color = '#222222', `
			: ''
	}width = 24, height = 24, sx = {} }) => {
    width = width.toString();
    height = height.toString();
  
    return (
      <SvgIcon sx={{ width: widthPx, height: heightPx, ...sx }}>`;

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
	}

	svgContent = svgContent.replaceAll('style="mask-type:alpha"', 'style={{maskType:"alpha"}}');
	svgContent = svgContent.replaceAll('fill-rule', 'fillRule');
	svgContent = svgContent.replaceAll('clip-rule', 'clipRule');
	svgContent = svgContent.replaceAll('clip-path', 'clipPath');
	svgContent = svgContent.replaceAll('stop-color', 'stopColor');

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
  
  
  ${componentName}.propTypes = {
    color: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    sx: PropTypes.object,
  };

  export default ${componentName};`;

	const jsxFile = path.join('./src/v3/components/icons', `${componentName}.jsx`);
	fs.writeFile(jsxFile, data);

	strImport += `export { default as ${componentName}} from './${componentName}';`;
}

const jsFile = path.join('./src/v3/components/icons', `index.js`);
fs.writeFile(jsFile, strImport);
