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
import { Button } from '../ui/button';
import Cross from '@/lib/icons/cross';

export type QuoteFormProps = {
  inventory: InventoryItem[];
  onClose?: () => void;
};
export default function QuoteForm({ inventory, onClose }: QuoteFormProps) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { rfqToCreateQuoteFor, setRfqToCreateQuoteFor } =
    useContext(RfqContext);

  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const [quote, setQuote] = useState<Quote | undefined>(undefined);

  // Order details:
  const [totalDollarAmount, setTotalDollarAmount] = useState(0);
  const [longestLeadTime, setLongestLeadTime] = useState(0);

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */
  // Convert RFQ to Quote:
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
    } else {
      setQuote(undefined);
    }
  }, [rfqToCreateQuoteFor]);

  // Calculate order details:
  useEffect(() => {
    if (quote) {
      let totalDollarAmount = 0;
      let longestLeadTime = 0;

      quote.itemsQuoted.forEach((itemQuoted) => {
        totalDollarAmount += itemQuoted.price * itemQuoted.quantity;
        if (itemQuoted.leadTime > longestLeadTime) {
          longestLeadTime = itemQuoted.leadTime;
        }
      });
      setTotalDollarAmount(totalDollarAmount);
      setLongestLeadTime(longestLeadTime);
    }
  }, [quote]);
  /* -------------------------------------------------------------------------- */
  /*                                 JSX Return                                 */
  /* -------------------------------------------------------------------------- */
  return !rfqToCreateQuoteFor ? (
    <div className="w-full h-full flex flex-row justify-center items-center">
      <span>Select A RFQ To Create A Quote</span>
    </div>
  ) : (
    <>
      <Card className="flex flex-col w-full h-full gap-3 relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex flex-row justify-between items-center w-full">
            Customer: {rfqToCreateQuoteFor.customer}
            <Button
              variant="ghost"
              className="hidden md:block"
              onClick={() => {
                setRfqToCreateQuoteFor(undefined);
                setQuote(undefined);
              }}
            >
              <Cross />
            </Button>
          </CardTitle>
        </CardHeader>
        <Separator />

        <CardContent className="w-full h-full pb-36 overflow-y-auto">
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
        <div className="absolute bottom-0 flex flex-col items-center w-full p-5">
          <div className="flex flex-row justify-end w-full pb-4">
            <div className="flex flex-col w-2/5">
              <div className="flex flex-row w-full justify-between">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(totalDollarAmount)}
                </span>
              </div>
              <div className="flex flex-row w-full justify-between">
                <span>Lead Time</span>
                <span>{longestLeadTime} days</span>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={async () => {
              console.log(`${window.location.origin}/api/quote`);
              try {
                const res = await fetch(
                  `${window.location.origin}/api/quotes`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      quote: quote,
                    }),
                  }
                );
                if (res.ok) {
                  console.log(res);
                  setRfqToCreateQuoteFor(undefined);
                  setQuote(undefined);
                  if (onClose) {
                    onClose();
                  }
                } else {
                  console.log('Failed to create quote:');
                }
              } catch (e) {
                console.log(e);
                // !Need to add error handling.
              }
            }}
          >
            Generate Quote
          </Button>
        </div>
      </Card>
    </>
  );
}
