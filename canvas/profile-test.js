/* eslint-disable @typescript-eslint/no-var-requires */
const satori = require(`satori`).default;
const { Image } = require(`./image.jsx`);
const fs = require(`fs/promises`);
const { Resvg } = require(`@resvg/resvg-js`);

(async () => {
  const svg = await satori(Image(), { width: 1000, height: 700, fonts: [] });

  const resvg = new Resvg(svg, { fitTo: { mode: `width`, value: 1000 }});
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  await fs.writeFile(`result.png`, pngBuffer, `base64`);
})()
