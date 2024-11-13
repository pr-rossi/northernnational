import PageTransition from '../components/PageTransition';
import MerchSection from '../components/MerchSection';

function Merch() {
  return (
    <PageTransition>
      <div className="pt-32 min-h-screen bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-[#D4FF99] mb-12">MERCH</h1>
          <MerchSection />
        </div>
      </div>
    </PageTransition>
  );
}

export default Merch; 