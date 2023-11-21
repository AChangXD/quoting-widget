'use client';
import { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { RfqContext } from './rfq-context-provider';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { InventoryItem } from '@/app/api/inventory/types';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '../ui/sheet';
import QuoteForm from './quote-form';

export type QuoteWidgetProps = {
  inventory: InventoryItem[];
};
export default function QuoteWidget({ inventory }: QuoteWidgetProps) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { selectedRfq, setRfqToCreateQuoteFor } = useContext(RfqContext);

  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const [selectedItems, setSelectedItems] = useState<
    { itemId: number; selected: boolean }[]
  >([]);

  const [showMobileQuoteForm, setShowMobileQuoteForm] = useState(false);
  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (selectedRfq) {
      setSelectedItems(
        selectedRfq.itemsRequested.map((itemRequested) => {
          return {
            itemId: itemRequested.item.id,
            selected: true,
          };
        })
      );
    }
  }, [selectedRfq]);
  /* -------------------------------------------------------------------------- */
  /*                                 JSX Return                                 */
  /* -------------------------------------------------------------------------- */
  return (
    <Card className="flex flex-col w-full h-full overflow-hidden relative">
      {selectedRfq ? (
        <>
          <Sheet
            open={showMobileQuoteForm}
            onOpenChange={(newState) => setShowMobileQuoteForm(newState)}
          >
            <SheetContent
              side="bottom"
              className="h-full w-full"
            >
              <QuoteForm
                inventory={inventory}
                onClose={() => {
                  setShowMobileQuoteForm(false);
                }}
              />
            </SheetContent>
          </Sheet>

          <CardHeader>
            <CardTitle>Quote Request From {selectedRfq?.customer}</CardTitle>
            <CardDescription>
              The customer has requested {selectedRfq.itemsRequested.length}{' '}
              items on {new Date(selectedRfq.requestDate).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-3 h-full overflow-hidden mb-16">
            {/* Requested Items: */}
            <span className="mb-3">Requested items:</span>
            <Separator className="mt-2 mb-2" />
            <div className="overflow-y-scroll h-full pb-5">
              {selectedRfq.itemsRequested.map((itemRequested, index) => {
                const currentInventoryLevel = inventory.find(
                  (item) => item.id === itemRequested.item.id
                );
                // Percentage of items available in the current inventory:
                let inventoryPercentage = 0;
                let leadTime = 0;
                if (currentInventoryLevel) {
                  inventoryPercentage =
                    currentInventoryLevel.quantity > 0
                      ? currentInventoryLevel.quantity / itemRequested.quantity
                      : 0;

                  leadTime =
                    inventoryPercentage >= 1
                      ? 0
                      : currentInventoryLevel.leadTime *
                        (itemRequested.quantity -
                          currentInventoryLevel.quantity);
                }
                return (
                  <div className="flex flex-col w-full gap-1.5">
                    <div className="flex flex-col w-full justify-between gap-1.5">
                      <div
                        key={itemRequested.item.id + index}
                        className="flex flex-row w-full justify-between"
                      >
                        <span className="text-base">
                          {itemRequested.item.name}
                        </span>
                        {/* Approve/Deny */}
                        {selectedItems.find(
                          (item) => item.itemId === itemRequested.item.id
                        ) && (
                          <Switch
                            checked={
                              selectedItems.find(
                                (item) => item.itemId === itemRequested.item.id
                              )!.selected
                            }
                            onCheckedChange={(newState) => {
                              setSelectedItems((prev) =>
                                prev.map((item) => {
                                  if (item.itemId === itemRequested.item.id) {
                                    return {
                                      itemId: item.itemId,
                                      selected: newState,
                                    };
                                  } else {
                                    return item;
                                  }
                                })
                              );
                            }}
                          >
                            Approve
                          </Switch>
                        )}
                      </div>

                      <div className="flex flex-row justify-between text-base text-muted-foreground">
                        <span>
                          {itemRequested.quantity} units @{' '}
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(
                            currentInventoryLevel
                              ? currentInventoryLevel.price
                              : itemRequested.item.price
                          )}
                          {'/unit '}
                        </span>
                        <span>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(
                            itemRequested.item.price * itemRequested.quantity
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span>
                        <span className="font-semibold">Stock</span>
                        <span className="text-base text-muted-foreground">
                          {' '}
                          {currentInventoryLevel
                            ? currentInventoryLevel.quantity + ' units'
                            : 'N/A'}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        {inventoryPercentage * 100 >= 100
                          ? 'In Stock'
                          : leadTime + ' days'}
                      </span>
                    </div>
                    <Progress
                      value={
                        inventoryPercentage * 100 >= 100
                          ? 100
                          : inventoryPercentage * 100
                      }
                    />
                    <Separator className="my-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>

          <div className="absolute bottom-0 w-full flex flex-row just pb-5 px-3">
            <Button
              className="w-full md:hidden"
              onClick={() => {
                setShowMobileQuoteForm(true);
                setRfqToCreateQuoteFor({
                  ...selectedRfq,
                  itemsRequested: selectedRfq.itemsRequested.filter(
                    (itemRequested) => {
                      return selectedItems.find(
                        (item) =>
                          item.itemId === itemRequested.item.id && item.selected
                      );
                    }
                  ),
                });
              }}
            >
              Start Quote
            </Button>

            <Button
              className="w-full hidden md:block"
              onClick={() => {
                setRfqToCreateQuoteFor({
                  ...selectedRfq,
                  itemsRequested: selectedRfq.itemsRequested.filter(
                    (itemRequested) => {
                      return selectedItems.find(
                        (item) =>
                          item.itemId === itemRequested.item.id && item.selected
                      );
                    }
                  ),
                });
              }}
            >
              Start Quote
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-row h-full w-full items-center justify-center">
          <span>Select A RFQ To Get Started</span>
        </div>
      )}
    </Card>
  );
}
