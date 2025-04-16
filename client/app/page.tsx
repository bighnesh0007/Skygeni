'use client';

import SalesFunnel from '@/components/SalesFunnel';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 lg:p-12">
      <div className="z-10 max-w-6xl w-full items-center justify-between text-sm lg:flex">
        <h1 className="text-2xl font-bold mb-8">Sales Funnel Visualization</h1>
      </div>
      <div className="w-full max-w-6xl mb-8">
        <SalesFunnel />
      </div>
    </main>
  );
}