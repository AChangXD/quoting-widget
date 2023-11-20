import { headers } from 'next/headers';
import React from 'react';
import { Rfq } from './api/rfq/types';
import QuoteCard from '@/components/rfq/quote-card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import QuoteWidget from '@/components/rfq/quote-widget';
import { InventoryItem } from './api/inventory/types';
import QuoteForm from '@/components/rfq/quote-form';

export default async function Home() {
  /* -------------------------------------------------------------------------- */
  /*                               RSC Fetch Data                               */
  /* -------------------------------------------------------------------------- */
  // Fetch all Rfq information on the server:
  const headersData = headers();
  const protocol = headersData.get('x-forwarded-proto');
  const host = headersData.get('host');
  const rfqRequest = await fetch(`${protocol}://${host}/api/rfq`, {
    method: 'GET',
    cache: 'no-store',
  });
  const inventoryRequest = await fetch(`${protocol}://${host}/api/inventory`, {
    method: 'GET',
    cache: 'no-store',
  });
  const rfqs: Rfq[] = await rfqRequest.json();
  const inventory: InventoryItem[] = await inventoryRequest.json();
  console.log(rfqs);

  /* -------------------------------------------------------------------------- */
  /*                                 JSX Return                                 */
  /* -------------------------------------------------------------------------- */
  return (
    <main className="flex h-screen w-screen flex-row">
      <div className="flex w-full md:w-1/2 h-full flex-col items-center gap-5 p-5">
        {/* Header/Rfq Selection: */}
        <div className="flex w-full flex-col items-center ">
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
        {/* RFQ details: */}
        <QuoteWidget inventory={inventory} />
      </div>
      <Separator
        orientation="vertical"
        className="hidden md:block"
      />

      {/* Quote Creation: */}
      <div className="hidden md:flex w-full md:w-1/2 h-full flex-col items-center gap-5 p-5">
        <QuoteForm inventory={inventory} />
      </div>
    </main>
  );
}
