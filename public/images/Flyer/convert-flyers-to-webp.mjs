import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const flyers = [
  {
    input: "Loft442 Repass Flyer.png",
    output: "loft442-repass-flyer.webp",
  },
  {
    input: "The Door Catering Menu.png",
    output: "the-door-catering-menu.webp",
  },
];

for (const { input, output } of flyers) {
  const inputPath = path.join(__dirname, input);
  const outputPath = path.join(__dirname, output);

  await sharp(inputPath)
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);

  console.log(`Converted ${input} -> ${output}`);
}
