'use client';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { useContext, useEffect, useState } from 'react';
import { RfqContext } from './rfq-context-provider';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { InventoryItem } from '@/app/api/inventory/types';
import Edit from '@/lib/icons/edit';
import { Popover, PopoverContent } from '../ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { Rfq } from '@/app/api/rfq/types';
import { Quote } from '@/app/api/quotes/types';

export type QuoteFormProps = {
  inventory: InventoryItem[];
};
export default function QuoteForm({ inventory }: QuoteFormProps) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { rfqToCreateQuoteFor, setRfqToCreateQuoteFor } =
    useContext(RfqContext);

  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const [quote, setQuote] = useState<Quote | undefined>(undefined);

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (rfqToCreateQuoteFor) {
      setQuote({
        quoteDate: new Date().toISOString(),
        rfqId: rfqToCreateQuoteFor.id,
        customer: rfqToCreateQuoteFor.customer,
        itemsQuoted: rfqToCreateQuoteFor.itemsRequested.map((itemRequested) => {
          const currentInventoryLevel = inventory.find(
            (item) => item.id === itemRequested.item.id
          );
          let leadTime = 0;
          if (currentInventoryLevel) {
            const inventoryPercentage =
              currentInventoryLevel.quantity > 0
                ? currentInventoryLevel.quantity / itemRequested.quantity
                : 0;

            leadTime =
              inventoryPercentage >= 1
                ? 0
                : currentInventoryLevel.leadTime *
                  (itemRequested.quantity - currentInventoryLevel.quantity);
          }
          return {
            item: itemRequested.item,
            price: itemRequested.item.price,
            quantity: itemRequested.quantity,
            leadTime: leadTime,
          };
        }),
      });
    }
  }, [rfqToCreateQuoteFor]);
  /* -------------------------------------------------------------------------- */
  /*                                 JSX Return                                 */
  /* -------------------------------------------------------------------------- */
  return !rfqToCreateQuoteFor ? (
    <div className="w-full h-full flex flex-row justify-center items-center">
      <span>Select A RFQ From The Left To Create A Quote</span>
    </div>
  ) : (
    <>
      {/* Header */}
      <div className="flex w-full flex-col items-center ">
        <span className="py-5 text-lg">Quote Creation</span>
        <Separator />
      </div>
      <Card className="flex flex-col w-full h-full gap-3 relative">
        <CardHeader>
          <CardTitle>Customer: {rfqToCreateQuoteFor.customer}</CardTitle>
        </CardHeader>
        <Separator />

        <CardContent className="w-full h-full">
          {quote?.itemsQuoted.map((itemQuoted, index) => {
            const currentInventoryLevel = inventory.find(
              (item) => item.id === itemQuoted.item.id
            );
            return (
              <div
                className="flex flex-col w-full"
                key={index + itemQuoted.item.id}
              >
                <div className="flex flex-row w-full justify-between">
                  <span>Item: {itemQuoted.item.name}</span>
                  <Popover>
                    <PopoverTrigger>
                      <Edit />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex flex-row w-full justify-between items-center gap-5">
                          <span>Price</span>
                          <Input
                            value={itemQuoted.price}
                            onChange={(e) => {
                              setQuote((prev) => {
                                if (prev) {
                                  // Create deep copy of prev
                                  const prevCopy: Quote = JSON.parse(
                                    JSON.stringify(prev)
                                  );
                                  prevCopy.itemsQuoted =
                                    prevCopy.itemsQuoted.map(
                                      (quotedItemInner) => {
                                        if (
                                          quotedItemInner.item.id ===
                                          itemQuoted.item.id
                                        ) {
                                          return {
                                            ...quotedItemInner,
                                            price:
                                              parseInt(e.target.value) || 0,
                                          };
                                        } else {
                                          return quotedItemInner;
                                        }
                                      }
                                    );
                                  return prevCopy;
                                }
                              });
                            }}
                            className="w-1/2"
                          />
                        </div>

                        <div className="flex flex-row w-full justify-between items-center gap-5">
                          <span>Quantity</span>
                          <Input
                            value={itemQuoted.quantity}
                            onChange={(e) => {
                              setQuote((prev) => {
                                if (prev) {
                                  // Create deep copy of prev
                                  const prevCopy: Quote = JSON.parse(
                                    JSON.stringify(prev)
                                  );
                                  prevCopy.itemsQuoted =
                                    prevCopy.itemsQuoted.map(
                                      (quotedItemInner) => {
                                        if (
                                          quotedItemInner.item.id ===
                                          itemQuoted.item.id
                                        ) {
                                          return {
                                            ...quotedItemInner,
                                            quantity:
                                              parseInt(e.target.value) || 0,
                                          };
                                        } else {
                                          return quotedItemInner;
                                        }
                                      }
                                    );
                                  return prevCopy;
                                }
                              });
                            }}
                            className="w-1/2"
                          />
                        </div>

                        <div className="flex flex-row w-full justify-between items-center gap-5">
                          <span>Lead Time</span>
                          <Input
                            value={itemQuoted.leadTime}
                            onChange={(e) => {
                              setQuote((prev) => {
                                if (prev) {
                                  // Create deep copy of prev
                                  const prevCopy: Quote = JSON.parse(
                                    JSON.stringify(prev)
                                  );
                                  prevCopy.itemsQuoted =
                                    prevCopy.itemsQuoted.map(
                                      (quotedItemInner) => {
                                        if (
                                          quotedItemInner.item.id ===
                                          itemQuoted.item.id
                                        ) {
                                          return {
                                            ...quotedItemInner,
                                            leadTime:
                                              parseInt(e.target.value) || 0,
                                          };
                                        } else {
                                          return quotedItemInner;
                                        }
                                      }
                                    );
                                  return prevCopy;
                                }
                              });
                            }}
                            className="w-1/2"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-row w-full justify-between text-base text-muted-foreground">
                  <span>
                    {itemQuoted.quantity} units @{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(itemQuoted.price)}
                    {'/unit '}
                  </span>
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(itemQuoted.item.price * itemQuoted.quantity)}
                  </span>
                </div>
                <Separator />
              </div>
            );
          })}
        </CardContent>
        {/* Summary */}
        <div className="absolute bottom-0 flex flex-col items-center w-full p-3">
          <span>Total Cost</span>
        </div>
      </Card>
    </>
  );
}
