import * as fsp from "node:fs/promises";
import * as path from "node:path";
import * as ansis from "ansis";
import sharp from "sharp";

const SAMPLE_MAX_SIZE = 200;
const CONTRAST_THRESHOLD = 10;
const BASE_SIZE = 48;
const SCALE_FACTOR = 0.5;
const DENSITY_FACTOR = 0.5;
const DENSITY_DAMPENING = 0.5;
const REFERENCE_DENSITY = 0.35;

interface Metrics {
  contentRatio: number;
  pixelDensity: number;
  visualCenterX: number;
  visualCenterY: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface NormalizedDimensions {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

interface ContentBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const rootDir = path.resolve(import.meta.dirname, "..");
const publicDir = path.resolve(rootDir, "public");
const brandsDir = path.resolve(publicDir, "img/brands");
const outputFile = path.resolve(rootDir, "app/data/logo-metrics.json");

const files = (await fsp.readdir(brandsDir)).filter(
  (fileName) => fileName.endsWith(".svg") || fileName.endsWith(".png"),
);

console.log(
  ansis.bold`Analyzing ${ansis.cyan(String(files.length))} logo images…\n`,
);

const results: Record<string, NormalizedDimensions> = {};

for (const file of files) {
  const logoPath = `/img/brands/${file}`;
  const absolutePath = path.resolve(brandsDir, file);
  console.log(`  ${ansis.dim(logoPath)}`);

  const metrics = await analyze(absolutePath);

  if (metrics) {
    const normalized = normalize(metrics);
    results[logoPath] = normalized;
    console.log(
      `    ${ansis.green`→`} ${ansis.bold`${normalized.width}×${normalized.height}`}px ${ansis.dim`(density: ${metrics.pixelDensity.toFixed(2)}, ratio: ${metrics.contentRatio.toFixed(2)})`}`,
    );
  } else {
    console.log(
      `    ${ansis.yellow`→ skipped`} ${ansis.dim`(could not analyze)`}`,
    );
  }
}

// Write output
await fsp.mkdir(path.dirname(outputFile), { recursive: true });
await fsp.writeFile(outputFile, `${JSON.stringify(results, null, 2)}\n`);

console.log(
  ansis.green`\n✓ Wrote ${ansis.bold(String(Object.keys(results).length))} entries to ${ansis.bold(path.relative(rootDir, outputFile))}`,
);

async function analyze(filePath: string): Promise<Metrics | undefined> {
  try {
    const { pixels, width, height, alphaOnly, bg } =
      await extractPixels(filePath);

    const contentBox = detectContentBoundingBox(
      pixels,
      width,
      height,
      CONTRAST_THRESHOLD,
      alphaOnly,
      bg,
    );

    if (contentBox.width === 0 || contentBox.height === 0) return;

    const visualCenter = calculateVisualCenter(
      pixels,
      width,
      contentBox,
      CONTRAST_THRESHOLD,
      alphaOnly,
      bg,
    );

    const density = measurePixelDensity(
      pixels,
      width,
      contentBox,
      CONTRAST_THRESHOLD,
      alphaOnly,
    );

    return {
      contentRatio: contentBox.width / contentBox.height,
      pixelDensity: density,
      visualCenterX: visualCenter.offsetX / contentBox.width,
      visualCenterY: visualCenter.offsetY / contentBox.height,
    };
  } catch (error) {
    console.error(`  Failed to analyze ${filePath}:`, error);
  }
}

function normalize(metrics: Metrics): NormalizedDimensions {
  const ratio = metrics.contentRatio;

  // Dan Paquette's aspect ratio normalization
  let width = ratio ** SCALE_FACTOR * BASE_SIZE;
  let height = width / ratio;

  // Density compensation
  if (DENSITY_FACTOR > 0 && metrics.pixelDensity > 0) {
    const densityRatio = metrics.pixelDensity / REFERENCE_DENSITY;
    const densityScale =
      (1 / densityRatio) ** (DENSITY_FACTOR * DENSITY_DAMPENING);
    const clampedScale = Math.max(0.5, Math.min(2.0, densityScale));
    width *= clampedScale;
    height *= clampedScale;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
    offsetX: Math.round(-(metrics.visualCenterX ?? 0) * width * 10) / 10,
    offsetY: Math.round(-(metrics.visualCenterY ?? 0) * height * 10) / 10,
  };
}

async function extractPixels(filePath: string) {
  const input = await fsp.readFile(filePath);
  const isSvg = filePath.endsWith(".svg");

  let image = sharp(input, {
    // For SVGs, set a reasonable density for rasterization
    ...(isSvg && { density: 96 }),
  }).ensureAlpha();

  // Resize to sample dimensions (fit inside max size, preserving aspect ratio)
  image = image.resize(SAMPLE_MAX_SIZE, SAMPLE_MAX_SIZE, {
    fit: "inside",
    withoutEnlargement: false,
  });

  const { data: pixels, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;

  // Detect transparency
  let hasTransparency = false;
  const totalPixels = width * height;

  for (let i = 0; i < totalPixels; i++) {
    if (pixels[i * 4 + 3]! < 250) {
      hasTransparency = true;
      break;
    }
  }

  // Detect background color from corner pixels
  let bg = { r: 255, g: 255, b: 255 };

  if (!hasTransparency) {
    const corners = [
      0,
      (width - 1) * 4,
      (height - 1) * width * 4,
      ((height - 1) * width + width - 1) * 4,
    ];

    let sumR = 0;
    let sumG = 0;
    let sumB = 0;

    for (const ci of corners) {
      sumR += pixels[ci]!;
      sumG += pixels[ci + 1]!;
      sumB += pixels[ci + 2]!;
    }

    bg = {
      r: Math.round(sumR / 4),
      g: Math.round(sumG / 4),
      b: Math.round(sumB / 4),
    };
  }

  return { pixels, width, height, alphaOnly: hasTransparency, bg };
}

function detectContentBoundingBox(
  pixels: Uint8Array,
  width: number,
  height: number,
  threshold: number,
  alphaOnly: boolean,
  bg: RGB,
): ContentBox {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = pixels[i]!;
      const g = pixels[i + 1]!;
      const b = pixels[i + 2]!;
      const a = pixels[i + 3]!;

      if (isContentPixel(r, g, b, a, threshold, alphaOnly, bg)) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (minX > maxX || minY > maxY) {
    return { x: 0, y: 0, width, height };
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function calculateVisualCenter(
  pixels: Uint8Array,
  width: number,
  contentBox: ContentBox,
  threshold: number,
  alphaOnly: boolean,
  bg: RGB,
): { offsetX: number; offsetY: number } {
  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;

  const { x: bx, y: by, width: bw, height: bh } = contentBox;

  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const i = ((by + y) * width + (bx + x)) * 4;
      const r = pixels[i]!;
      const g = pixels[i + 1]!;
      const b = pixels[i + 2]!;
      const a = pixels[i + 3]!;

      if (!isContentPixel(r, g, b, a, threshold, alphaOnly, bg)) {
        continue;
      }

      let weight: number;

      if (alphaOnly) {
        weight = a / 255;
      } else {
        const dr = r - bg.r;
        const dg = g - bg.g;
        const db = b - bg.b;
        const colorDistance = Math.sqrt(dr * dr + dg * dg + db * db);
        weight = Math.sqrt(colorDistance) * (a / 255);
      }

      totalWeight += weight;
      weightedX += (x + 0.5) * weight;
      weightedY += (y + 0.5) * weight;
    }
  }

  if (totalWeight === 0) {
    return { offsetX: 0, offsetY: 0 };
  }

  return {
    offsetX: weightedX / totalWeight - bw / 2,
    offsetY: weightedY / totalWeight - bh / 2,
  };
}

function measurePixelDensity(
  pixels: Uint8Array,
  width: number,
  contentBox: ContentBox,
  threshold: number,
  alphaOnly: boolean,
): number {
  const { x: bx, y: by, width: bw, height: bh } = contentBox;
  const totalPixels = bw * bh;

  if (totalPixels === 0) return 0.5;

  let filledPixels = 0;
  let totalOpacity = 0;

  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const i = ((by + y) * width + (bx + x)) * 4;
      const r = pixels[i]!;
      const g = pixels[i + 1]!;
      const b = pixels[i + 2]!;
      const a = pixels[i + 3]!;

      if (
        isContentPixel(r, g, b, a, threshold, alphaOnly, {
          r: 255,
          g: 255,
          b: 255,
        })
      ) {
        filledPixels++;
        totalOpacity += a / 255;
      }
    }
  }

  if (filledPixels === 0) return 0;

  return (filledPixels / totalPixels) * (totalOpacity / filledPixels);
}

function isContentPixel(
  r: number,
  g: number,
  b: number,
  a: number,
  threshold: number,
  alphaOnly: boolean,
  bg: RGB,
): boolean {
  if (alphaOnly) return a > threshold;

  return (
    a > threshold &&
    (Math.abs(r - bg.r) > threshold ||
      Math.abs(g - bg.g) > threshold ||
      Math.abs(b - bg.b) > threshold)
  );
}
