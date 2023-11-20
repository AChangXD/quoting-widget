import { headers } from 'next/headers';
import React from 'react';
import { Rfq } from './api/rfq/types';
import QuoteCard from '@/components/rfq/quote-card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default async function Home() {
  /* -------------------------------------------------------------------------- */
  /*                               RSC Fetch Data                               */
  /* -------------------------------------------------------------------------- */
  // Fetch all Rfq information on the server:
  const headersData = headers();
  const protocol = headersData.get('x-forwarded-proto');
  const host = headersData.get('host');
  const res = await fetch(`${protocol}://${host}/api/rfq`, {
    method: 'GET',
    cache: 'no-store',
  });
  const rfqs: Rfq[] = await res.json();
  console.log(rfqs);

  /* -------------------------------------------------------------------------- */
  /*                                 JSX Return                                 */
  /* -------------------------------------------------------------------------- */
  return (
    <main className="flex h-screen w-screen flex-row">
      <div className="flex w-full h-full flex-col items-center">
        {/* Header/Rfq Selection: */}
        <div className="flex w-full h-full flex-col items-center px-5">
          <span className="py-5 text-lg">RFQs</span>
          <Separator />
          <ScrollArea className="w-full">
            <div className="flex flex-row w-full gap-5 pt-3 pb-3 overflow-scroll">
              {rfqs.map((rfq, index) => {
                return (
                  <QuoteCard
                    rfq={rfq}
                    key={rfq.id + index}
                  />
                );
              })}
              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
          <Separator />
        </div>
      </div>
    </main>
  );
}
