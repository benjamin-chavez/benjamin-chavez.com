import React from 'react';
import fs from 'fs';
import path from 'path';
import satori from 'satori';
import sharp from 'sharp';
import { getAllPosts } from '../src/lib/posts';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

async function main() {
  const outDir = path.join(process.cwd(), 'public/og');
  fs.mkdirSync(outDir, { recursive: true });

  const fontPath = path.join(
    process.cwd(),
    'public/fonts/Dosis/static/Dosis-Regular.ttf',
  );
  const fontData = fs.readFileSync(fontPath);

  const avatarPath = path.join(process.cwd(), 'public/img/avatar.png');
  const avatarBase64 = `data:image/png;base64,${fs.readFileSync(avatarPath).toString('base64')}`;

  const posts = getAllPosts();

  for (const post of posts) {
    const svg = await satori(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg, #7cb563 0%, #4a8c3f 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontFamily: 'Dosis',
            color: 'white',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <img
            src={avatarBase64}
            width={70}
            height={70}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontFamily: 'Dosis',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Benjamin Chavez
            </span>
            <span
              style={{
                fontSize: 22,
                fontFamily: 'Dosis',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              Full Stack Developer
            </span>
          </div>
        </div>
      </div>,
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts: [
          {
            name: 'Dosis',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      },
    );

    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
    const outPath = path.join(outDir, `${post.slug}.png`);
    fs.writeFileSync(outPath, pngBuffer);
    console.log(`Generated: ${outPath}`);
  }

  console.log(`Done. Generated ${posts.length} OG images.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
