// this file is used to convert exported variables from Figma

import fs from 'fs/promises';
import path from 'path';

const ROOT_FOLDER = './converter/css/sources';

const files = await fs.readdir(ROOT_FOLDER);
const jsonFiles = files.filter(
  (file) => path.extname(file) === '.json' && path.basename(file).indexOf('sources.json') === -1
);

const tokens = {};

for await (const jsonFile of jsonFiles) {
  const filePath = path.join(ROOT_FOLDER, jsonFile);
  const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

  for (let [key, value] of Object.entries(data)) {
    if (key !== 'colors' && key !== 'version' && key !== 'metadata') {
      let tmpValue = data[key];

      if (key === 'collections') {
        key = 'colors';
        const modes = value.find((collection) => collection.name === 'Colors').modes;

        value = {};

        for (const mode of modes) {
          const obj = { [mode.name]: {} };

          for (const variable of mode.variables) {
            obj[mode.name] = { ...obj[mode.name], [variable.name]: { value: variable.value } };
          }

          Object.assign(value, obj);
        }

        tmpValue = value;
      }

      if (!tokens[key]) {
        tokens[key] = value;
      }

      if (tokens[key]) {
        tokens[key] = { ...tokens[key], ...tmpValue };
      }
    }
  }
}

fs.writeFile('./converter/css/tokens.json', JSON.stringify(tokens));

let data = '';

data += `/**
* Do not edit directly
* Generated on ${new Date().toLocaleString()}
*/\n\n`;

// converting fixed variables
data += `:root {\n`;

// radius variables
data += `/* global border-radius variables */\n`;
for (const [key, details] of Object.entries(tokens.radius)) {
  data += `--${key}: ${details.value}px;\n`;
}

// meeting colors variables
data += `\n/* global meeting-colors variables */\n`;
for (const [key, details] of Object.entries(tokens['meeting-colors'])) {
  data += `--${key}: ${details.value};\n`;
}

// group colors variables
data += `\n/* global group-colors variables */\n`;
for (const [key, details] of Object.entries(tokens['group-colors'])) {
  data += `--${key}: ${details.value};\n`;
}

data += '}\n\n';

// converting colors tokens to css variables
for (const [theme, details] of Object.entries(tokens.colors)) {
  data += `/* colors for ${theme} theme */\n`;
  data += `[data-theme='${theme}'] {\n`;

  for (const [color, props] of Object.entries(details)) {
    data += `--${color}-base: ${props.value.r}, ${props.value.g}, ${props.value.b};\n`;
    data += `--${color}: rgba(var(--${color}-base), ${props.value.a});\n`;
  }

  data += '}\n\n';
}

// converting font tokens to css properties

// check if common fonts
const allFonts = Object.keys(tokens.font).filter((font) => font !== 'mobile');
const mobileFonts = Object.keys(tokens.font.mobile);
const common = {};

for (const font of allFonts) {
  const hasMobile = mobileFonts.find((mFont) => mFont.replace('m-', '') === font);

  if (!hasMobile) {
    Object.assign(common, { [font]: tokens.font[font] });
  }
}

if (Object.keys(common).length > 0) {
  data += `/* font styles generic */\n`;
  for (const [font, details] of Object.entries(common)) {
    const className = font.replace('m-', '');
    data += `.${className} {\n`;

    for (let [key, value] of Object.entries(details.value)) {
      if (key !== 'paragraphSpacing' && key !== 'fontFamily') {
        if (key === 'paragraphIndent') key = 'text-indent';
        if (key === 'textCase') key = 'text-transform';

        let property = key
          .split(/(?=[A-Z])/g)
          .map((text) => text.toLocaleLowerCase())
          .join('-');

        if (typeof value === 'number' && key !== 'fontWeight') value = `${value}px`;

        data += `${property}: ${value};\n`;
      }
    }

    data += '}\n\n';
  }
}

// mobile first fonts
data += `/* font styles used for tablet & mobile devices */\n`;
data += `@media (max-width: 768px) {\n`;
for (const [font, details] of Object.entries(tokens.font.mobile)) {
  const className = font.replace('m-', '');
  data += `.${className} {\n`;

  for (let [key, value] of Object.entries(details.value)) {
    if (key !== 'paragraphSpacing' && key !== 'fontFamily') {
      if (key === 'paragraphIndent') key = 'text-indent';
      if (key === 'textCase') key = 'text-transform';

      let property = key
        .split(/(?=[A-Z])/g)
        .map((text) => text.toLocaleLowerCase())
        .join('-');

      if (typeof value === 'number' && key !== 'fontWeight') value = `${value}px`;

      data += `${property}: ${value};\n`;
    }
  }

  data += '}\n\n';
}
data += '}\n\n';

// wider devices fonts
data += `/* font styles used for wider devices */\n`;
data += `@media (min-width: 768px) {\n`;
for (const [className, details] of Object.entries(tokens.font)) {
  if (className !== 'mobile' && !Object.keys(common).includes(className)) {
    data += `.${className} {\n`;

    for (let [key, value] of Object.entries(details.value)) {
      if (key !== 'paragraphSpacing' && key !== 'fontFamily') {
        if (key === 'paragraphIndent') key = 'text-indent';
        if (key === 'textCase') key = 'text-transform';

        let property = key
          .split(/(?=[A-Z])/g)
          .map((text) => text.toLocaleLowerCase())
          .join('-');

        if (key === 'margin') value = `${value}px 0px`;
        if (typeof value === 'number' && key !== 'fontWeight') value = `${value}px`;

        data += `${property}: ${value};\n`;
      }
    }

    data += '}\n\n';
  }
}
data += '}\n\n';

// converting effect tokens to css properties
data += `/* default effect styles */\n`;
for (const [effectName, details] of Object.entries(tokens.effect)) {
  if (effectName !== 'dark') {
    const varValue = [];
    let effectsArray = [];

    if (details.type === 'custom-shadow') {
      effectsArray = [details];
    } else {
      effectsArray = Object.values(details);
    }

    for (const props of effectsArray) {
      if (props && props.value) {
        const effect = props.value;
        let tmp = '';
        tmp = `${effect.offsetX}px ${effect.offsetY}px ${effect.radius}px `;

        tmp += `${effect.spread}px `;

        const colorShadow = effectName === 'message-glow' ? `rgba(var(--accent-main-base), 0.24)` : effect.color;

        tmp += colorShadow;

        varValue.push(tmp);
      }
    }

    data += `.${effectName} {\n`;
    data += `box-shadow: ${varValue.join(', ')};\n`;
    data += '}\n\n';
  }
}

data += `/* some dark effect styles */\n`;
data += `[data-theme$='dark'] {\n`;
for (let [effectName, details] of Object.entries(tokens.effect.dark)) {
  effectName = effectName.replace('dark-', '');

  const varValue = [];
  let effectsArray = [];

  if (details.type === 'custom-shadow') {
    effectsArray = [details];
  } else {
    effectsArray = Object.values(details);
  }

  for (const props of effectsArray) {
    if (props && props.value) {
      const effect = props.value;
      let tmp = '';
      tmp = `${effect.offsetX}px ${effect.offsetY}px ${effect.radius}px `;

      tmp += `${effect.spread}px `;

      const colorShadow = effectName === 'message-glow' ? `var(--accent-main)` : effect.color;

      tmp += colorShadow;

      varValue.push(tmp);
    }
  }

  data += `.${effectName} {\n`;
  data += `box-shadow: ${varValue.join(', ')};\n`;
  data += '}\n\n';
}
data += '}\n\n';

fs.writeFile('./src/v3/global.css', data);
