export default function TestEnv() {
  return (
    <div>
      <h1>Environment Variables Test</h1>
      <pre>
        {JSON.stringify({
          hasStripeKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          stripeKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10),
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV
        }, null, 2)}
      </pre>
    </div>
  );
} 