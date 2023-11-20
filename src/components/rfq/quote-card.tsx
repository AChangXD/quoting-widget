import { Rfq } from '@/app/api/rfq/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

export default function QuoteCard({ rfq }: { rfq: Rfq }) {
  /* -------------------------------------------------------------------------- */
  /*                                 JSX Return                                 */
  /* -------------------------------------------------------------------------- */

  return (
    <Card className="w-max">
      <CardHeader>
        <CardTitle>{rfq.customer}</CardTitle>
        <CardDescription>
          {new Date(rfq.requestDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
