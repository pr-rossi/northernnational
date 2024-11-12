import Head from 'next/head'
import MerchSection from '../src/components/MerchSection'

export default function Home() {
  return (
    <>
      <Head>
        <title>Northern National</title>
        <meta name="description" content="Northern National Official Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-black">
        <MerchSection />
      </main>
    </>
  )
} 