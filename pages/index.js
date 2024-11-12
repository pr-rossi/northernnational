import Head from 'next/head'
import MerchSection from '../src/components/MerchSection'

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Northern National - Alternative Rock Band" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://northernnationalmusic.com/" />
        <meta property="og:title" content="Northern National" />
        <meta property="og:description" content="Northern National - Alternative Rock Band" />
        <meta property="og:image" content="https://northernnationalmusic.com/images/the-boys-show.jpeg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://northernnationalmusic.com/" />
        <meta property="twitter:title" content="Northern National" />
        <meta property="twitter:description" content="Northern National - Alternative Rock Band" />
        <meta property="twitter:image" content="https://northernnationalmusic.com/images/the-boys-show.jpeg" />

        <title>Northern National</title>
        
        {/* Favicon handling with media queries */}
        <link 
          rel="icon" 
          type="image/svg+xml" 
          href="/images/favicon-light.svg"
          media="(prefers-color-scheme: light)"
        />
        <link 
          rel="icon" 
          type="image/svg+xml" 
          href="/images/favicon-dark.svg"
          media="(prefers-color-scheme: dark)"
        />
      </Head>

      <main className="min-h-screen bg-black">
        {/* SVG Filter Definition */}
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id="displacement-filter">
              <feTurbulence 
                type="turbulence" 
                baseFrequency="0.025"
                numOctaves="2" 
                result="turbulence"
              >
                <animate 
                  attributeName="baseFrequency"
                  dur="20s"
                  values="0.02;0.015;0.02"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              
              <feDisplacementMap 
                in2="turbulence"
                in="SourceGraphic"
                scale="20"
                xChannelSelector="R" 
                yChannelSelector="B"
              >
                <animate
                  attributeName="scale"
                  dur="10s"
                  values="20;25;20"
                  repeatCount="indefinite"
                />
              </feDisplacementMap>
            </filter>
          </defs>
        </svg>

        {/* Your main content */}
        <div className="container mx-auto px-4">
          <MerchSection />
        </div>
      </main>
    </>
  )
}
