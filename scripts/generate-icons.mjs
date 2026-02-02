#!/usr/bin/env node

/**
 * Icon Generator Script
 * Generates all required icons and favicons from the SVG source
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');

// Icon sizes needed for PWA and various platforms
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const FAVICON_SIZES = [16, 32, 48];

async function generateIcons() {
  console.log('🎨 Generating icons for MonoCollector...\n');

  // Create icons directory if it doesn't exist
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
    console.log('📁 Created icons directory');
  }

  const iconSvgPath = path.join(PUBLIC_DIR, 'icon.svg');
  const faviconSvgPath = path.join(PUBLIC_DIR, 'favicon.svg');

  // Check if source files exist
  if (!fs.existsSync(iconSvgPath)) {
    console.error('❌ icon.svg not found in public directory');
    process.exit(1);
  }

  const iconSvg = fs.readFileSync(iconSvgPath);
  const faviconSvg = fs.existsSync(faviconSvgPath)
    ? fs.readFileSync(faviconSvgPath)
    : iconSvg;

  // Generate PWA icons
  console.log('📱 Generating PWA icons...');
  for (const size of ICON_SIZES) {
    await sharp(iconSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));
    console.log(`   ✅ icon-${size}x${size}.png`);
  }

  // Generate Apple Touch Icon (180x180)
  console.log('\n🍎 Generating Apple Touch Icon...');
  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('   ✅ apple-touch-icon.png');

  // Generate favicon PNGs
  console.log('\n🔖 Generating favicon PNGs...');
  for (const size of FAVICON_SIZES) {
    await sharp(faviconSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(PUBLIC_DIR, `favicon-${size}x${size}.png`));
    console.log(`   ✅ favicon-${size}x${size}.png`);
  }

  // Generate main favicon.ico (using 32x32)
  console.log('\n🎯 Generating favicon.ico...');
  await sharp(faviconSvg)
    .resize(32, 32)
    .toFormat('png')
    .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));
  console.log('   ✅ favicon.ico');

  // Copy to src/app directory as well for Next.js
  const srcAppDir = path.join(__dirname, '..', 'src', 'app');
  if (fs.existsSync(srcAppDir)) {
    await sharp(faviconSvg)
      .resize(32, 32)
      .toFormat('png')
      .toFile(path.join(srcAppDir, 'favicon.ico'));
    console.log('   ✅ src/app/favicon.ico');
  }

  // Generate OG Image (1200x630)
  console.log('\n🖼️  Generating OG Image...');
  const ogSvgPath = path.join(PUBLIC_DIR, 'og-image.svg');
  if (fs.existsSync(ogSvgPath)) {
    await sharp(fs.readFileSync(ogSvgPath))
      .resize(1200, 630)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
    console.log('   ✅ og-image.png');
  } else {
    // Create a simple OG image from the icon
    await sharp(iconSvg)
      .resize(512, 512)
      .extend({
        top: 59,
        bottom: 59,
        left: 344,
        right: 344,
        background: { r: 254, g: 247, b: 255, alpha: 1 }, // #fef7ff
      })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
    console.log('   ✅ og-image.png (generated from icon)');
  }

  // Generate add-icon for PWA shortcut
  console.log('\n➕ Generating shortcut icons...');
  await sharp(iconSvg)
    .resize(96, 96)
    .png()
    .toFile(path.join(ICONS_DIR, 'add-icon.png'));
  console.log('   ✅ add-icon.png');

  console.log('\n🎉 All icons generated successfully!\n');

  // Print summary
  console.log('📋 Generated files:');
  console.log('   - public/icons/icon-*.png (PWA icons)');
  console.log('   - public/apple-touch-icon.png');
  console.log('   - public/favicon.ico');
  console.log('   - public/favicon-*.png');
  console.log('   - public/og-image.png');
  console.log('   - src/app/favicon.ico');
}

generateIcons().catch(console.error);
