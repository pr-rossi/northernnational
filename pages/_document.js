import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <noscript>
          <div style={{
            padding: '20px',
            background: '#f44336',
            color: 'white',
            textAlign: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999
          }}>
            You need to enable JavaScript to run this app.
          </div>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 