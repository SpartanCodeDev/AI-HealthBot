const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

async function build() {
  const input = path.resolve(__dirname, '..', 'src', 'index.css');
  const css = fs.readFileSync(input, 'utf8');

  try {
    const result = await postcss([tailwind(), autoprefixer()]).process(css, { from: input });
    const outPath = path.resolve(__dirname, 'tw-built.css');
    fs.writeFileSync(outPath, result.css, 'utf8');
    console.log('Built CSS to', outPath);
  } catch (err) {
    console.error('Build failed:', err);
    process.exitCode = 1;
  }
}

build();
