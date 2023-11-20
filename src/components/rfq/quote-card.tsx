'use client';
import { Rfq } from '@/app/api/rfq/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { useContext } from 'react';
import { RfqContext } from './rfq-context-provider';
import { cn } from '@/lib/utils';

export default function QuoteCard({ rfq }: { rfq: Rfq }) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { selectedRfq, setSelectedRfq } = useContext(RfqContext);

  /* -------------------------------------------------------------------------- */
  /*                                 JSX Return                                 */
  /* -------------------------------------------------------------------------- */

  return (
    <Card
      onClick={() => {
        setSelectedRfq(rfq);
      }}
      className={cn('w-max p-4 cursor-pointer', {
        'bg-primary': selectedRfq && selectedRfq.id === rfq.id,
      })}
    >
      <CardHeader>
        <CardTitle
          className={cn({
            'text-primary-foreground': selectedRfq && selectedRfq.id === rfq.id,
          })}
        >
          {rfq.customer}
        </CardTitle>
        <CardDescription
          className={cn({
            'text-primary-foreground': selectedRfq && selectedRfq.id === rfq.id,
          })}
        >
          {new Date(rfq.requestDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
