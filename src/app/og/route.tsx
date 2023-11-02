// src/app/og/route.tsx

import { ImageResponse } from 'next/server';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const postTitle = searchParams.get('title');
  const font = fetch(
    new URL('/public/fonts/Dosis/static/Dosis-Regular.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());
  const fontData = await font;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundImage: 'url(https://benjamin-chavez.com/img/og-bg.png)',
        }}
      >
        <div
          style={{
            marginLeft: 190,
            marginRight: 190,
            marginTop: 150,

            display: 'flex',
            fontSize: 130,
            fontFamily: 'Dosis',
            letterSpacing: '-0.05em',
            fontStyle: 'normal',
            color: 'white',
            lineHeight: '120px',
            whiteSpace: 'pre-wrap',
            textTransform: 'uppercase',
          }}
        >
          {postTitle}
          {/* integrating next.js with express.js using auth0 for authentication */}
        </div>
        <div
          style={{
            marginLeft: 190,
            marginRight: 190,
            marginTop: 150,
            display: 'flex',
            backgroundColor: 'red',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            marginBottom: 150,
          }}
        >
          <img
            src="https://picsum.photos/200/300"
            width={150}
            height={150}
            style={{ borderRadius: '50%' }}
          />
          ,
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              backgroundColor: 'green',
              height: '100%',
              color: 'white',
              paddingLeft: 10,
            }}
          >
            <p
              style={{
                textTransform: 'uppercase',
                fontSize: '2rem',
                lineHeight: '2.0rem',
                letterSpacing: '0.1rem',
              }}
            >
              Benjamin Chavez
            </p>
            <p
              style={{
                fontSize: 24,
              }}
            >
              Full Stack Developer
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
      fonts: [
        {
          name: 'Dosis',
          data: fontData,
          style: 'normal',
        },
      ],
    },
  );
}
