import Head from 'next/head'
import MerchSection from '../src/components/MerchSection'

export default function Home() {
  return (
    <>
      <Head>
        <title>Northern National</title>
        <meta name="description" content="Northern National Official Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4">
          <h1 className="text-[#D4FF99] text-4xl font-bold py-8">
            Northern National
          </h1>
          <MerchSection />
        </div>
      </main>
    </>
  )
} 